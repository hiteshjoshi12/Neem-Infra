import { connectDB } from '../src/lib/mongodb.js';
import mongoose from 'mongoose';

async function run() {
  await connectDB();
  const db = mongoose.connection.db;

  console.log('=== SCANNING ALL IMAGES IN DATABASE ===\n');

  // 1. Pages collection
  const pages = await db.collection('pages').find({}).toArray();
  console.log(`PAGES (${pages.length} docs):`);
  pages.forEach(p => {
    const imgs = [];
    if (p.featuredImage) imgs.push({ field: 'featuredImage', url: p.featuredImage, alt: p.featuredImageAlt });
    if (p.ogImage && p.ogImage !== p.featuredImage) imgs.push({ field: 'ogImage', url: p.ogImage, alt: p.ogImageAlt });
    if (Array.isArray(p.sections)) {
      p.sections.forEach((s, idx) => {
        if (s.image) imgs.push({ field: `sections.${idx}.image`, url: s.image, alt: s.imageAlt });
      });
    }
    if (imgs.length > 0) {
      console.log(`  - [${p.slug || p.title}]: ${imgs.length} images`);
    }
  });

  // 2. BlogPosts collection
  const blogs = await db.collection('blogposts').find({}).toArray();
  console.log(`\nBLOG POSTS (${blogs.length} docs):`);
  let blogImgCount = 0;
  blogs.forEach(b => {
    if (b.featuredImage) blogImgCount++;
    if (b.ogImage && b.ogImage !== b.featuredImage) blogImgCount++;
  });
  console.log(`  Total blog images found: ${blogImgCount}`);

  // 3. Properties collection
  const properties = await db.collection('properties').find({}).toArray();
  console.log(`\nPROPERTIES (${properties.length} docs):`);
  let propImgCount = 0;
  properties.forEach(p => {
    if (p.img) propImgCount++;
    if (Array.isArray(p.images)) {
      propImgCount += p.images.length;
    }
    console.log(`  - [${p.title}]: main: ${!!p.img}, gallery: ${(p.images || []).length}`);
  });
  console.log(`  Total property images found: ${propImgCount}`);

  // 4. SectionContent collection
  const sections = await db.collection('sectioncontents').find({}).toArray();
  console.log(`\nSECTION CONTENTS (${sections.length} docs):`);
  let totalSectionImgs = 0;
  for (const sc of sections) {
    const found = [];
    function scanObj(obj, prefix = '') {
      if (!obj || typeof obj !== 'object') return;
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof val === 'string') {
          if (
            (val.startsWith('http') || val.startsWith('/') || val.includes('imagekit') || val.includes('unsplash')) &&
            (val.match(/\.(jpg|jpeg|png|webp|svg|avif)(\?.*)?$/i) || key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key === 'avatar' || key === 'logo')
          ) {
            found.push({ path, url: val });
          }
        } else if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            if (typeof item === 'string' && (item.match(/\.(jpg|jpeg|png|webp|svg|avif)(\?.*)?$/i) || key.toLowerCase().includes('image') || key.toLowerCase().includes('img'))) {
              found.push({ path: `${path}.${idx}`, url: item });
            } else {
              scanObj(item, `${path}.${idx}`);
            }
          });
        } else if (typeof val === 'object') {
          scanObj(val, path);
        }
      }
    }
    scanObj(sc.data);
    totalSectionImgs += found.length;
    if (found.length > 0) {
      console.log(`  - [${sc.sectionKey}]: ${found.length} images`);
      found.slice(0, 3).forEach(f => console.log(`      ${f.path}: ${f.url.slice(0, 70)}...`));
    }
  }
  console.log(`  Total section content images found: ${totalSectionImgs}`);

  // 5. Authors
  const authors = await db.collection('authors').find({}).toArray();
  console.log(`\nAUTHORS (${authors.length} docs):`);
  authors.forEach(a => {
    if (a.avatar || a.image) {
      console.log(`  - [${a.name}]: avatar: ${a.avatar || a.image}`);
    }
  });

  // 6. Testimonials
  const testimonials = await db.collection('testimonials').find({}).toArray();
  console.log(`\nTESTIMONIALS (${testimonials.length} docs):`);
  testimonials.forEach(t => {
    if (t.avatar || t.image) {
      console.log(`  - [${t.name}]: avatar: ${t.avatar || t.image}`);
    }
  });

  // 7. BusinessProfile
  const profile = await db.collection('businessprofiles').findOne({});
  console.log(`\nBUSINESS PROFILE:`);
  if (profile) {
    if (profile.logo) console.log(`  - logo: ${profile.logo}`);
    if (profile.favicon) console.log(`  - favicon: ${profile.favicon}`);
    if (profile.heroImage) console.log(`  - heroImage: ${profile.heroImage}`);
  }

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
