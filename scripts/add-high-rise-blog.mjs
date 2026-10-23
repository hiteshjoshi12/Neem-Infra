import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing!');
  process.exit(1);
}

const jsonPath = path.resolve('C:\\Users\\joshi\\.gemini\\antigravity-ide\\brain\\d43217d2-6499-4dc9-8a08-b4d9d2897303\\scratch\\post_obj.json');
const postData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const db = mongoose.connection;
  const authorsCol = db.collection('authors');
  const categoriesCol = db.collection('categories');
  const tagsCol = db.collection('tags');
  const locationsCol = db.collection('locations');
  const blogpostsCol = db.collection('blogposts');

  const author = await authorsCol.findOne({ slug: postData.authorSlug });
  const category = await categoriesCol.findOne({ slug: postData.categorySlug });
  
  const tagDocs = await tagsCol.find({ slug: { $in: postData.tagsSlugs } }).toArray();
  const locationDocs = await locationsCol.find({ slug: { $in: postData.locationSlugs } }).toArray();

  console.log('Author found:', author?._id);
  console.log('Category found:', category?._id);
  console.log('Tags found:', tagDocs.map(t => t.slug));
  console.log('Locations found:', locationDocs.map(l => l.slug));

  const updateDoc = {
    title: postData.title,
    slug: postData.slug,
    excerpt: postData.excerpt,
    content: postData.content,
    featured: postData.featured,
    featuredImage: postData.featuredImage,
    featuredImageAlt: postData.featuredImageAlt,
    featuredImageCaption: postData.featuredImageCaption || '',
    featuredImageCredit: postData.featuredImageCredit || '',
    featuredImageSource: postData.featuredImageSource || '',
    featuredImageWidth: postData.featuredImageWidth || 1600,
    featuredImageHeight: postData.featuredImageHeight || 900,
    socialImage: postData.socialImage || '',
    readingTime: postData.readingTime || 12,
    status: postData.status || 'published',
    publishedAt: new Date(postData.publishedAt),
    updatedAt: new Date(),
    author: author?._id,
    authorSlug: postData.authorSlug,
    category: category?._id,
    categorySlug: postData.categorySlug,
    tags: tagDocs.map(t => t._id),
    location: locationDocs.map(l => l._id),
    seoTitle: postData.seoTitle,
    seoDescription: postData.seoDescription,
    canonicalUrl: postData.canonicalUrl,
    focusKeyword: postData.focusKeyword,
    faq: postData.faq || [],
    directAnswer: postData.directAnswer || '',
    keyTakeaways: postData.keyTakeaways || [],
    isPillar: postData.isPillar || false,
    topicCluster: postData.topicCluster || 'dlf-gurugram',
    parentPillarSlug: postData.parentPillarSlug || null,
    propertyType: [],
    relatedPosts: [],
    relatedLocations: [],
    relatedServices: [],
    childArticles: [],
    definitions: [],
    editorialSources: [],
    tableOfContents: []
  };

  const result = await blogpostsCol.updateOne(
    { slug: postData.slug },
    { $set: updateDoc },
    { upsert: true }
  );

  console.log('Upsert result:', result);
  console.log('Blog post added/updated in MongoDB successfully!');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
