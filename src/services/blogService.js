import { connectDB } from '../lib/mongodb.js';
import BlogPost from '../models/BlogPost.js';
import Author from '../models/Author.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import Tag from '../models/Tag.js';
import PropertyType from '../models/PropertyType.js';

// In-memory cache with 60s TTL to eliminate database roundtrips and make page navigation instant
const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCached(_key) {
  // Always return null to ensure database changes reflect immediately on the UI
  return null;
}

function setCached(key, data) {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function clearBlogCache() {
  memoryCache.clear();
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
      .populate('relatedPosts')
      .sort({ publishedAt: -1, createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const posts = await query.lean().exec();
    const result = posts && posts.length > 0 ? JSON.parse(JSON.stringify(posts)) : [];
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getBlogPosts error:', error?.message);
    return [];
  }
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
      .populate('parentPillar')
      .populate('childArticles')
      .populate({
        path: 'relatedPosts',
        populate: { path: 'author category' }
      })
      .lean()
      .exec();

    const result = post ? JSON.parse(JSON.stringify(post)) : null;

    if (result) {
      // Resolve parentPillar if not populated but slug exists
      if (result.parentPillarSlug && (!result.parentPillar || typeof result.parentPillar === 'string')) {
        const parentDoc = await BlogPost.findOne({ slug: result.parentPillarSlug, status: 'published' }).lean().exec();
        if (parentDoc) {
          result.parentPillar = {
            title: parentDoc.title,
            slug: parentDoc.slug,
            excerpt: parentDoc.excerpt
          };
        }
      }

      // Resolve childArticles if pillar
      if (result.isPillar && (!result.childArticles || result.childArticles.length === 0)) {
        const allPosts = await getBlogPosts();
        result.childArticles = allPosts
          .filter(p => p.slug !== result.slug && (p.parentPillarSlug === result.slug || result.childArticlesSlugs?.includes(p.slug)))
          .map(c => ({
            title: c.title,
            slug: c.slug,
            excerpt: c.excerpt,
            readingTime: c.readingTime || 5,
            featuredImage: c.featuredImage
          }));
      }

      setCached(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.warn('[blogService] getBlogPostBySlug error:', error?.message);
    return null;
  }
}

export async function getCategories() {
  const cacheKey = 'categories';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean().exec();
    let result = [];
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
    }
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getCategories error:', error?.message);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  const cacheKey = `cat:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const cat = await Category.findOne({ slug }).lean().exec();
    const result = cat ? JSON.parse(JSON.stringify(cat)) : null;
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getCategoryBySlug error:', error?.message);
    return null;
  }
}

export async function getLocations() {
  return [];
}

export async function getLocationBySlug() {
  return null;
}

export async function getTags() {
  const cacheKey = 'tags';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 }).lean().exec();
    const result = (tags && tags.length > 0) ? JSON.parse(JSON.stringify(tags)) : [];
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getTags error:', error?.message);
    return [];
  }
}

export async function getTagBySlug(slug) {
  const cacheKey = `tag:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const tag = await Tag.findOne({ slug }).lean().exec();
    const result = tag ? JSON.parse(JSON.stringify(tag)) : null;
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getTagBySlug error:', error?.message);
    return null;
  }
}

export async function getAuthors() {
  const cacheKey = 'authors';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const authors = await Author.find().sort({ name: 1 }).lean().exec();
    const result = (authors && authors.length > 0) ? JSON.parse(JSON.stringify(authors)) : [];
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getAuthors error:', error?.message);
    return [];
  }
}

export async function getAuthorBySlug(slug) {
  const cacheKey = `author:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await connectDB();
    const author = await Author.findOne({ slug }).lean().exec();
    const result = author ? JSON.parse(JSON.stringify(author)) : null;
    if (result) setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('[blogService] getAuthorBySlug error:', error?.message);
    return null;
  }
}

/**
 * Intelligent Topical Authority & Relevance Scoring Algorithm
 * Factors:
 * 1. Topic Cluster & Pillar relationship (Weight: +5.0)
 * 2. Category Match (Weight: +3.5)
 * 3. Location Overlap (Weight: +2.5 per match)
 * 4. Tag Overlap (Weight: +2.0 per match)
 * 5. Property Type Match (Weight: +1.5 per match)
 * 6. Focus & Secondary Keywords Match (Weight: +2.0)
 */
export function calculateRelevanceScore(currentPost, candidate) {
  if (!currentPost || !candidate || currentPost.slug === candidate.slug) return -1;
  let score = 0;

  // 1. Topic Cluster & Pillar Hierarchy
  if (currentPost.isPillar && (candidate.parentPillarSlug === currentPost.slug || currentPost.childArticlesSlugs?.includes(candidate.slug))) {
    score += 5.0; // Child of current pillar
  }
  if (candidate.isPillar && (currentPost.parentPillarSlug === candidate.slug || candidate.childArticlesSlugs?.includes(currentPost.slug))) {
    score += 5.0; // Parent pillar of current child
  }
  if (currentPost.topicCluster && candidate.topicCluster && currentPost.topicCluster === candidate.topicCluster) {
    score += 4.0; // Same topic cluster
  }

  // 2. Category Match
  const currentCat = currentPost.categorySlug || currentPost.category?.slug;
  const candCat = candidate.categorySlug || candidate.category?.slug;
  if (currentCat && candCat && currentCat === candCat) {
    score += 3.5;
  }

  // 3. Location Overlap
  const currentLocs = (currentPost.locationSlugs || currentPost.location?.map(l => l.slug || l) || []).filter(Boolean);
  const candLocs = (candidate.locationSlugs || candidate.location?.map(l => l.slug || l) || []).filter(Boolean);
  const locOverlap = currentLocs.filter(l => candLocs.includes(l)).length;
  score += locOverlap * 2.5;

  // 4. Tags Overlap
  const currentTags = (currentPost.tagsSlugs || currentPost.tags?.map(t => t.slug || t) || []).filter(Boolean);
  const candTags = (candidate.tagsSlugs || candidate.tags?.map(t => t.slug || t) || []).filter(Boolean);
  const tagOverlap = currentTags.filter(t => candTags.includes(t)).length;
  score += tagOverlap * 2.0;

  // 5. Property Type Overlap
  const currentProps = (currentPost.propertyTypes || currentPost.propertyType?.map(p => p.slug || p) || []).filter(Boolean);
  const candProps = (candidate.propertyTypes || candidate.propertyType?.map(p => p.slug || p) || []).filter(Boolean);
  const propOverlap = currentProps.filter(p => candProps.includes(p)).length;
  score += propOverlap * 1.5;

  // 6. Keywords Overlap
  const currentKeywords = [
    currentPost.focusKeyword,
    ...(currentPost.secondaryKeywords || [])
  ].filter(Boolean).map(k => k.toLowerCase().trim());

  const candKeywords = [
    candidate.focusKeyword,
    ...(candidate.secondaryKeywords || []),
    candidate.title,
    candidate.excerpt
  ].filter(Boolean).map(k => k.toLowerCase());

  for (const ck of currentKeywords) {
    for (const candText of candKeywords) {
      if (candText.includes(ck) || ck.includes(candText)) {
        score += 2.0;
        break;
      }
    }
  }

  return score;
}

export async function getRelatedPosts(currentPost, limit = 3) {
  if (!currentPost) return [];
  const cacheKey = `related:${currentPost.slug}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // 1. Manual relationships override automatic recommendations
    const manualPosts = Array.isArray(currentPost.relatedPosts)
      ? currentPost.relatedPosts.filter(Boolean)
      : [];

    if (manualPosts.length >= limit) {
      const res = manualPosts.slice(0, limit);
      setCached(cacheKey, res);
      return res;
    }

    // 2. Fetch candidates for intelligent scoring
    const allPublished = await getBlogPosts({ excludeSlug: currentPost.slug, status: 'published' });
    const manualSlugs = new Set(manualPosts.map(p => p.slug));

    // Filter out posts already manually selected
    const candidates = allPublished.filter(p => !manualSlugs.has(p.slug));

    // Score and sort candidates
    const scoredCandidates = candidates
      .map(candidate => ({
        post: candidate,
        score: calculateRelevanceScore(currentPost, candidate)
      }))
      .sort((a, b) => b.score - a.score)
      .map(sc => sc.post);

    const combined = [...manualPosts, ...scoredCandidates].slice(0, limit);
    setCached(cacheKey, combined);
    return combined;
  } catch (error) {
    console.warn('[blogService] getRelatedPosts error:', error?.message);
    return [];
  }
}

/**
 * Diagnostic Orphan & Internal Link Audit Report
 * Identifies published articles with:
 * - Zero outbound internal links
 * - Zero inbound internal links (orphans)
 * - Missing category
 * - Missing location
 * - Missing related posts
 */
export async function getOrphanAuditReport() {
  const allPosts = await getBlogPosts({ status: 'published' });

  // Regex to detect internal link paths
  const internalLinkRegex = /\[([^\]]+)\]\((\/(?:blog|services|properties)[^)]*)\)|href=["'](\/(?:blog|services|properties)[^"']*)["']/g;

  const inboundCounts = {};
  allPosts.forEach(p => { inboundCounts[p.slug] = 0; });

  const analyzedArticles = allPosts.map(post => {
    const content = post.content || '';
    const outboundMatches = [];
    let match;
    const re = new RegExp(internalLinkRegex);
    while ((match = re.exec(content)) !== null) {
      const url = match[2] || match[3];
      if (url) outboundMatches.push(url);
    }

    // Trace inbound links to other posts
    outboundMatches.forEach(url => {
      const blogMatch = url.match(/^\/blog\/([^/?#]+)/);
      if (blogMatch && blogMatch[1] && inboundCounts[blogMatch[1]] !== undefined && blogMatch[1] !== post.slug) {
        inboundCounts[blogMatch[1]] += 1;
      }
    });

    // Also credit inbound from manual relatedPosts
    if (Array.isArray(post.relatedPosts)) {
      post.relatedPosts.forEach(rel => {
        const slug = rel.slug || rel;
        if (slug && inboundCounts[slug] !== undefined && slug !== post.slug) {
          inboundCounts[slug] += 1;
        }
      });
    }

    // Also credit parent pillar link
    if (post.parentPillarSlug && inboundCounts[post.parentPillarSlug] !== undefined) {
      inboundCounts[post.parentPillarSlug] += 1;
    }

    const hasCategory = Boolean(post.category || post.categorySlug);
    const hasLocation = Boolean(
      (Array.isArray(post.location) && post.location.length > 0) || 
      (Array.isArray(post.locationSlugs) && post.locationSlugs.length > 0) || 
      post.location
    );
    const hasRelatedPosts = Boolean(
      (Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0) || 
      (Array.isArray(post.relatedPostsSlugs) && post.relatedPostsSlugs.length > 0)
    );

    return {
      _id: post._id,
      title: post.title,
      slug: post.slug,
      isPillar: !!post.isPillar,
      topicCluster: post.topicCluster || 'dlf-gurugram',
      parentPillarSlug: post.parentPillarSlug || null,
      outboundCount: outboundMatches.length,
      outboundLinks: outboundMatches,
      hasCategory,
      categoryName: post.category?.name || post.categorySlug || 'None',
      hasLocation,
      locationCount: post.location?.length || post.locationSlugs?.length || 0,
      hasRelatedPosts,
      updatedAt: post.updatedAt || post.publishedAt
    };
  });

  let totalOrphans = 0;
  let totalDeadEnds = 0;
  let missingCategoryCount = 0;
  let missingLocationCount = 0;
  let missingRelatedPostsCount = 0;

  const finalizedArticles = analyzedArticles.map(art => {
    const inboundCount = inboundCounts[art.slug] || 0;
    const isOrphan = inboundCount === 0;
    const isDeadEnd = art.outboundCount === 0;

    if (isOrphan) totalOrphans++;
    if (isDeadEnd) totalDeadEnds++;
    if (!art.hasCategory) missingCategoryCount++;
    if (!art.hasLocation) missingLocationCount++;
    if (!art.hasRelatedPosts) missingRelatedPostsCount++;

    const issues = [];
    if (isOrphan) issues.push('No Inbound Links (Orphan)');
    if (isDeadEnd) issues.push('No Outbound Internal Links');
    if (!art.hasCategory) issues.push('Missing Category');
    if (!art.hasLocation) issues.push('Missing Location');
    if (!art.hasRelatedPosts) issues.push('No Related Posts');

    return {
      ...art,
      inboundCount,
      isOrphan,
      isDeadEnd,
      issues,
      status: issues.length === 0 ? 'HEALTHY' : 'NEEDS_ATTENTION'
    };
  });

  const total = finalizedArticles.length;
  const healthyCount = finalizedArticles.filter(a => a.issues.length === 0).length;
  const healthScore = total > 0 ? Math.round((healthyCount / total) * 100) : 100;

  return {
    summary: {
      totalPublished: total,
      healthyCount,
      healthScore,
      totalOrphans,
      totalDeadEnds,
      missingCategoryCount,
      missingLocationCount,
      missingRelatedPostsCount
    },
    articles: finalizedArticles
  };
}
