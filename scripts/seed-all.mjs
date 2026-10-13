import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually if not in process.env
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k && v.length) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  });
}

import { DEFAULT_SECTIONS } from '../src/constants/defaultSections.js';
import { LUXURY_PROPERTIES_DETAILED } from '../src/constants/propertiesData.js';
import {
  INITIAL_AUTHORS,
  INITIAL_CATEGORIES,
  INITIAL_LOCATIONS,
  INITIAL_TAGS,
  INITIAL_POSTS
} from '../src/constants/blogData.js';

import SectionContent from '../src/models/SectionContent.js';
import Property from '../src/models/Property.js';
import Author from '../src/models/Author.js';
import Category from '../src/models/Category.js';
import Location from '../src/models/Location.js';
import Tag from '../src/models/Tag.js';
import BlogPost from '../src/models/BlogPost.js';
import Testimonial from '../src/models/Testimonial.js';
import Admin from '../src/models/Admin.js';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGO_URI is not set in environment or .env.local');
  process.exit(1);
}

const DEFAULT_TESTIMONIALS = [
  {
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "DLF Phase 1 Floor",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c3.jpg",
    quote: "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory",
    order: 0,
    isActive: true
  },
  {
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "DLF Phase 2 Floor",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c2.jpg",
    quote: "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction",
    order: 1,
    isActive: true
  },
  {
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "India",
    propertyType: "Sushant Lok Villa",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c1.jpg",
    quote: "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge",
    order: 2,
    isActive: true
  }
];

async function seedAll() {
  console.log('====================================================');
  console.log('🚀 MASTER DATABASE RESET & FULL RE-SEEDING');
  console.log('====================================================');
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ MongoDB Connected successfully.\n');

  // ====================================================================
  // 1. CMS SECTIONS (All 20 Sections + All Pages)
  // ====================================================================
  console.log('📦 1/5. Resetting & Seeding CMS Sections (SectionContent)...');
  await SectionContent.deleteMany({});
  const sectionKeys = Object.keys(DEFAULT_SECTIONS);
  let seededSectionsCount = 0;

  for (const key of sectionKeys) {
    await SectionContent.create({
      sectionKey: key,
      title: `${key.replace(/^page_/, '').replace(/([A-Z])/g, ' $1').toUpperCase()} Content`,
      data: DEFAULT_SECTIONS[key],
      lastUpdatedBy: 'Master Seed'
    });
    seededSectionsCount++;
  }
  console.log(`   ✓ Successfully seeded ${seededSectionsCount} CMS sections.\n`);

  // ====================================================================
  // 2. PROPERTIES CATALOG
  // ====================================================================
  console.log('🏡 2/5. Resetting & Seeding Properties Database...');
  await Property.deleteMany({});
  let seededPropertiesCount = 0;

  for (let i = 0; i < LUXURY_PROPERTIES_DETAILED.length; i++) {
    const item = LUXURY_PROPERTIES_DETAILED[i];
    await Property.create({
      title: item.title,
      slug: item.slug,
      price: item.price,
      location: item.location,
      specs: item.specs,
      desc: item.desc,
      img: item.img,
      images: item.images || [],
      tag: item.tag || 'Exclusive Floor',
      category: item.category || 'residential',
      bhk: item.bhk,
      bathrooms: item.bathrooms,
      plotArea: item.plotArea,
      builtUpArea: item.builtUpArea,
      facing: item.facing,
      floor: item.floor,
      furnishing: item.furnishing,
      parking: item.parking,
      possession: item.possession,
      reraNumber: item.reraNumber,
      features: item.features || [],
      nearbyLandmarks: item.nearbyLandmarks || [],
      order: i,
      isFeatured: true,
      isActive: true,
    });
    seededPropertiesCount++;
  }
  console.log(`   ✓ Successfully seeded ${seededPropertiesCount} luxury properties.\n`);

  // ====================================================================
  // 3. BLOG TAXONOMIES & ARTICLES
  // ====================================================================
  console.log('📝 3/5. Resetting & Seeding Blog Taxonomies & Articles...');
  await BlogPost.deleteMany({});
  await Author.deleteMany({});
  await Category.deleteMany({});
  await Location.deleteMany({});
  await Tag.deleteMany({});

  // 3a. Authors
  const authorMap = {};
  for (const authorData of INITIAL_AUTHORS) {
    const author = await Author.create(authorData);
    authorMap[author.slug] = author._id;
  }
  console.log(`   ✓ Seeded ${INITIAL_AUTHORS.length} authors.`);

  // 3b. Categories
  const categoryMap = {};
  for (const catData of INITIAL_CATEGORIES) {
    const cat = await Category.create(catData);
    categoryMap[cat.slug] = cat._id;
  }
  console.log(`   ✓ Seeded ${INITIAL_CATEGORIES.length} categories.`);

  // 3c. Locations
  const locationMap = {};
  for (const locData of INITIAL_LOCATIONS) {
    const loc = await Location.create(locData);
    locationMap[loc.slug] = loc._id;
  }
  console.log(`   ✓ Seeded ${INITIAL_LOCATIONS.length} locations.`);

  // 3d. Tags
  const tagMap = {};
  for (const tagData of INITIAL_TAGS) {
    const tag = await Tag.create(tagData);
    tagMap[tag.slug] = tag._id;
  }
  console.log(`   ✓ Seeded ${INITIAL_TAGS.length} tags.`);

  // 3e. Blog Posts
  let seededPostsCount = 0;
  for (const postData of INITIAL_POSTS) {
    await BlogPost.create({
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
      readingTime: postData.readingTime || 5,
      status: postData.status || 'published',
      publishedAt: new Date(postData.publishedAt),
      updatedAt: postData.updatedAt ? new Date(postData.updatedAt) : new Date(postData.publishedAt),
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
      faq: postData.faq || [],
      directAnswer: postData.directAnswer || '',
      keyTakeaways: postData.keyTakeaways || [],
      isPillar: postData.isPillar || false,
      topicCluster: postData.topicCluster || 'dlf-floors',
      parentPillarSlug: postData.parentPillarSlug || null,
    });
    seededPostsCount++;
  }
  console.log(`   ✓ Seeded ${seededPostsCount} editorial blog articles.\n`);

  // ====================================================================
  // 4. TESTIMONIALS
  // ====================================================================
  console.log('⭐ 4/5. Resetting & Seeding Testimonials...');
  await Testimonial.deleteMany({});
  for (const t of DEFAULT_TESTIMONIALS) {
    await Testimonial.create(t);
  }
  console.log(`   ✓ Seeded ${DEFAULT_TESTIMONIALS.length} client testimonials.\n`);

  // ====================================================================
  // 5. ADMIN ACCOUNT CHECK
  // ====================================================================
  console.log('🔐 5/5. Checking Admin Authentication Accounts...');
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    await Admin.create({
      name: 'Administrator',
      email: 'admin@saudagar.com',
      password: 'admin123',
      role: 'superadmin'
    });
    console.log('   ✓ Default admin account created: admin@saudagar.com / admin123');
  } else {
    console.log(`   ✓ Admin accounts intact (${adminCount} registered admin).`);
  }

  // ====================================================================
  // FINAL DATABASE AUDIT SUMMARY
  // ====================================================================
  console.log('\n====================================================');
  console.log('📊 FINAL DATABASE STATE');
  console.log('====================================================');
  const [
    finalSections,
    finalProps,
    finalPosts,
    finalAuthors,
    finalCats,
    finalLocs,
    finalTags,
    finalTests,
    finalAdmins
  ] = await Promise.all([
    SectionContent.countDocuments(),
    Property.countDocuments(),
    BlogPost.countDocuments(),
    Author.countDocuments(),
    Category.countDocuments(),
    Location.countDocuments(),
    Tag.countDocuments(),
    Testimonial.countDocuments(),
    Admin.countDocuments()
  ]);

  console.log(`• CMS Sections (SectionContent): ${finalSections}`);
  console.log(`• Properties (Property):         ${finalProps}`);
  console.log(`• Blog Articles (BlogPost):      ${finalPosts}`);
  console.log(`• Authors (Author):              ${finalAuthors}`);
  console.log(`• Categories (Category):         ${finalCats}`);
  console.log(`• Locations (Location):          ${finalLocs}`);
  console.log(`• Tags (Tag):                    ${finalTags}`);
  console.log(`• Testimonials (Testimonial):    ${finalTests}`);
  console.log(`• Admins (Admin):                ${finalAdmins}`);
  console.log('====================================================');
  console.log('✨ ALL DATABASE COLLECTIONS SUCCESSFULLY RESET & RE-SEEDED!\n');

  await mongoose.disconnect();
}

seedAll().catch(err => {
  console.error('Fatal error during seed execution:', err);
  process.exit(1);
});
