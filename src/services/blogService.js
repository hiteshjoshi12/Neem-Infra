import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Author from '@/models/Author';
import Category from '@/models/Category';
import Location from '@/models/Location';
import Tag from '@/models/Tag';
import PropertyType from '@/models/PropertyType';
import { 
  INITIAL_POSTS, 
  INITIAL_AUTHORS, 
  INITIAL_CATEGORIES, 
  INITIAL_LOCATIONS, 
  INITIAL_TAGS 
} from '@/constants/blogData';

// In-memory cache with 60s TTL to eliminate database roundtrips and make page navigation instant
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCached(key) {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function clearBlogCache() {
  memoryCache.clear();
}

// Helper to hydrate fallback posts with objects for author, category, etc.
function getHydratedFallbackPosts() {
  const authorMap = Object.fromEntries(INITIAL_AUTHORS.map(a => [a.slug, a]));
  const catMap = Object.fromEntries(INITIAL_CATEGORIES.map(c => [c.slug, c]));
  const locMap = Object.fromEntries(INITIAL_LOCATIONS.map(l => [l.slug, l]));
  const tagMap = Object.fromEntries(INITIAL_TAGS.map(t => [t.slug, t]));

  return INITIAL_POSTS.map(p => ({
    ...p,
    _id: `fallback-${p.slug}`,
    author: authorMap[p.authorSlug] || { name: 'Saudagar Advisory Desk', slug: 'saudagar-advisory' },
    category: catMap[p.categorySlug] || { name: 'Real Estate Advisory', slug: 'real-estate-advisory' },
    location: (p.locationSlugs || []).map(s => locMap[s]).filter(Boolean),
    tags: (p.tagsSlugs || []).map(s => tagMap[s]).filter(Boolean),
    publishedAt: p.publishedAt,
    createdAt: p.publishedAt,
    updatedAt: p.publishedAt
  }));
}

export async function getBlogPosts(options = {}) {
  const cacheKey = `posts:${JSON.stringify(options)}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    await connectDB();
    const { 
      category, 
      tag, 
      location, 
      author, 
      featured, 
      limit, 
      excludeSlug, 
      status = 'published' 
    } = options;

    const filter = {};
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured;
    if (excludeSlug) filter.slug = { $ne: excludeSlug };

    // Filter by category slug or ID
    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        filter.categorySlug = category;
      }
    }

    // Filter by tag slug or ID
    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) {
        filter.tags = tagDoc._id;
      }
    }

    // Filter by location slug or ID
    if (location) {
      const locDoc = await Location.findOne({ slug: location });
      if (locDoc) {
        filter.location = locDoc._id;
      }
    }

    // Filter by author slug or ID
    if (author) {
      const authorDoc = await Author.findOne({ slug: author });
      if (authorDoc) {
        filter.author = authorDoc._id;
      } else {
        filter.authorSlug = author;
      }
    }

    let query = BlogPost.find(filter)
      .populate('author')
      .populate('category')
      .populate('tags')
      .populate('location')
      .populate('propertyType')
      .sort({ publishedAt: -1, createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const posts = await query.lean().exec();

    let result;
    if (posts && posts.length > 0) {
      result = JSON.parse(JSON.stringify(posts));
    } else {
      result = getFallbackFiltered(options);
    }
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getBlogPosts error, using fallback:', error?.message);
    const result = getFallbackFiltered(options);
    setCached(cacheKey, result);
    return result;
  }
}

function getFallbackFiltered(options = {}) {
  const { category, tag, location, author, featured, limit, excludeSlug } = options;
  let posts = getHydratedFallbackPosts();

  if (excludeSlug) {
    posts = posts.filter(p => p.slug !== excludeSlug);
  }
  if (featured !== undefined) {
    posts = posts.filter(p => !!p.featured === !!featured);
  }
  if (category) {
    posts = posts.filter(p => p.categorySlug === category || p.category?.slug === category);
  }
  if (tag) {
    posts = posts.filter(p => p.tagsSlugs?.includes(tag) || p.tags?.some(t => t.slug === tag));
  }
  if (location) {
    posts = posts.filter(p => p.locationSlugs?.includes(location) || p.location?.some(l => l.slug === location));
  }
  if (author) {
    posts = posts.filter(p => p.authorSlug === author || p.author?.slug === author);
  }
  if (limit) {
    posts = posts.slice(0, limit);
  }

  return posts;
}

export async function getBlogPostBySlug(slug) {
  const cacheKey = `post:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: 'published' })
      .populate('author')
      .populate('category')
      .populate('tags')
      .populate('location')
      .populate('propertyType')
      .populate({
        path: 'relatedPosts',
        populate: { path: 'author category' }
      })
      .lean()
      .exec();

    let result = null;
    if (post) {
      result = JSON.parse(JSON.stringify(post));
    } else {
      const fallback = getHydratedFallbackPosts().find(p => p.slug === slug);
      result = fallback || null;
    }
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getBlogPostBySlug error:', error?.message);
    const fallback = getHydratedFallbackPosts().find(p => p.slug === slug);
    const result = fallback || null;
    if (result) setCached(cacheKey, result);
    return result;
  }
}

export async function getCategories() {
  const cacheKey = 'categories';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean().exec();
    let result;
    if (categories && categories.length > 0) {
      const counts = await BlogPost.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      const countMap = Object.fromEntries(counts.map(c => [String(c._id), c.count]));
      result = categories.map(cat => ({
        ...JSON.parse(JSON.stringify(cat)),
        postCount: countMap[String(cat._id)] || 0
      }));
    } else {
      result = INITIAL_CATEGORIES.map(c => ({ ...c, postCount: 1 }));
    }
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getCategories error:', error?.message);
    const result = INITIAL_CATEGORIES.map(c => ({ ...c, postCount: 1 }));
    setCached(cacheKey, result);
    return result;
  }
}

export async function getCategoryBySlug(slug) {
  const cacheKey = `cat:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const cat = await Category.findOne({ slug }).lean().exec();
    let result = cat ? JSON.parse(JSON.stringify(cat)) : (INITIAL_CATEGORIES.find(c => c.slug === slug) || null);
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getCategoryBySlug error:', error?.message);
    const result = INITIAL_CATEGORIES.find(c => c.slug === slug) || null;
    if (result) setCached(cacheKey, result);
    return result;
  }
}

export async function getLocations() {
  const cacheKey = 'locations';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const locations = await Location.find().sort({ name: 1 }).lean().exec();
    const result = (locations && locations.length > 0) ? JSON.parse(JSON.stringify(locations)) : INITIAL_LOCATIONS;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getLocations error:', error?.message);
    setCached(cacheKey, INITIAL_LOCATIONS);
    return INITIAL_LOCATIONS;
  }
}

export async function getLocationBySlug(slug) {
  const cacheKey = `loc:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const loc = await Location.findOne({ slug }).lean().exec();
    const result = loc ? JSON.parse(JSON.stringify(loc)) : (INITIAL_LOCATIONS.find(l => l.slug === slug) || null);
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getLocationBySlug error:', error?.message);
    const result = INITIAL_LOCATIONS.find(l => l.slug === slug) || null;
    if (result) setCached(cacheKey, result);
    return result;
  }
}

export async function getTags() {
  const cacheKey = 'tags';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 }).lean().exec();
    const result = (tags && tags.length > 0) ? JSON.parse(JSON.stringify(tags)) : INITIAL_TAGS;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getTags error:', error?.message);
    setCached(cacheKey, INITIAL_TAGS);
    return INITIAL_TAGS;
  }
}

export async function getTagBySlug(slug) {
  const cacheKey = `tag:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const tag = await Tag.findOne({ slug }).lean().exec();
    const result = tag ? JSON.parse(JSON.stringify(tag)) : (INITIAL_TAGS.find(t => t.slug === slug) || null);
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getTagBySlug error:', error?.message);
    const result = INITIAL_TAGS.find(t => t.slug === slug) || null;
    if (result) setCached(cacheKey, result);
    return result;
  }
}

export async function getAuthors() {
  const cacheKey = 'authors';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const authors = await Author.find().sort({ name: 1 }).lean().exec();
    const result = (authors && authors.length > 0) ? JSON.parse(JSON.stringify(authors)) : INITIAL_AUTHORS;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getAuthors error:', error?.message);
    setCached(cacheKey, INITIAL_AUTHORS);
    return INITIAL_AUTHORS;
  }
}

export async function getAuthorBySlug(slug) {
  const cacheKey = `author:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const author = await Author.findOne({ slug }).lean().exec();
    const result = author ? JSON.parse(JSON.stringify(author)) : (INITIAL_AUTHORS.find(a => a.slug === slug) || null);
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getAuthorBySlug error:', error?.message);
    const result = INITIAL_AUTHORS.find(a => a.slug === slug) || null;
    if (result) setCached(cacheKey, result);
    return result;
  }
}

export async function getRelatedPosts(currentPost, limit = 3) {
  const cacheKey = `related:${currentPost?.slug}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    if (currentPost?.relatedPosts && currentPost.relatedPosts.length > 0) {
      const res = currentPost.relatedPosts.slice(0, limit);
      setCached(cacheKey, res);
      return res;
    }

    const categorySlug = currentPost?.categorySlug || currentPost?.category?.slug;

    const res = await getBlogPosts({
      category: categorySlug,
      excludeSlug: currentPost?.slug,
      limit
    });
    setCached(cacheKey, res);
    return res;
  } catch (error) {
    console.warn('[blogService] getRelatedPosts error:', error?.message);
    const res = getFallbackFiltered({ excludeSlug: currentPost?.slug, limit });
    setCached(cacheKey, res);
    return res;
  }
}
