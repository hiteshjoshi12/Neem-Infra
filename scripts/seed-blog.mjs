import mongoose from 'mongoose';
import { connectDB } from '../src/lib/mongodb.js';
import Author from '../src/models/Author.js';
import Category from '../src/models/Category.js';
import Location from '../src/models/Location.js';
import Tag from '../src/models/Tag.js';
import BlogPost from '../src/models/BlogPost.js';
import { INITIAL_AUTHORS, INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_TAGS, INITIAL_POSTS } from '../src/constants/blogData.js';

async function seedBlog() {
  console.log('--- Starting Blog Seed Script ---');
  await connectDB();

  // 1. Authors
  console.log('Seeding authors...');
  const authorMap = {};
  for (const authorData of INITIAL_AUTHORS) {
    let author = await Author.findOne({ slug: authorData.slug });
    if (!author) {
      author = await Author.create(authorData);
      console.log(`Created author: ${author.name}`);
    } else {
      console.log(`Author already exists: ${author.name}`);
    }
    authorMap[author.slug] = author._id;
  }

  // 2. Categories
  console.log('Seeding categories...');
  const categoryMap = {};
  for (const catData of INITIAL_CATEGORIES) {
    let cat = await Category.findOne({ slug: catData.slug });
    if (!cat) {
      cat = await Category.create(catData);
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
    categoryMap[cat.slug] = cat._id;
  }

  // 3. Locations
  console.log('Seeding locations...');
  const locationMap = {};
  for (const locData of INITIAL_LOCATIONS) {
    let loc = await Location.findOne({ slug: locData.slug });
    if (!loc) {
      loc = await Location.create(locData);
      console.log(`Created location: ${loc.name}`);
    } else {
      console.log(`Location already exists: ${loc.name}`);
    }
    locationMap[loc.slug] = loc._id;
  }

  // 4. Tags
  console.log('Seeding tags...');
  const tagMap = {};
  for (const tagData of INITIAL_TAGS) {
    let tag = await Tag.findOne({ slug: tagData.slug });
    if (!tag) {
      tag = await Tag.create(tagData);
      console.log(`Created tag: ${tag.name}`);
    } else {
      console.log(`Tag already exists: ${tag.name}`);
    }
    tagMap[tag.slug] = tag._id;
  }

  // 5. Posts
  console.log('Seeding blog posts...');
  for (const postData of INITIAL_POSTS) {
    let post = await BlogPost.findOne({ slug: postData.slug });
    if (!post) {
      const doc = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featured: postData.featured,
        featuredImage: postData.featuredImage,
        featuredImageAlt: postData.featuredImageAlt,
        readingTime: postData.readingTime,
        status: postData.status,
        publishedAt: new Date(postData.publishedAt),
        author: authorMap[postData.authorSlug],
        authorSlug: postData.authorSlug,
        category: categoryMap[postData.categorySlug],
        categorySlug: postData.categorySlug,
        tags: (postData.tagsSlugs || []).map(s => tagMap[s]).filter(Boolean),
        location: (postData.locationSlugs || []).map(s => locationMap[s]).filter(Boolean),
        seoTitle: postData.seoTitle,
        seoDescription: postData.seoDescription,
        canonicalUrl: postData.canonicalUrl,
        focusKeyword: postData.focusKeyword,
        faq: postData.faq || []
      };

      await BlogPost.create(doc);
      console.log(`Created blog post: ${postData.title}`);
    } else {
      console.log(`Blog post already exists: ${post.title}`);
    }
  }

  // Update author published counts
  for (const authorSlug of Object.keys(authorMap)) {
    const count = await BlogPost.countDocuments({ authorSlug, status: 'published' });
    await Author.findOneAndUpdate({ slug: authorSlug }, { publishedPostCount: count });
  }

  console.log('--- Blog Seed Completed Successfully ---');
  process.exit(0);
}

seedBlog().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
