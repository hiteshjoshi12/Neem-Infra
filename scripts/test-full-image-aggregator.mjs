import { connectDB } from '../src/lib/mongodb.js';
import mongoose from 'mongoose';
import { validateAltText } from '../src/lib/seo/imageSeoHelper.js';

const SECTION_PAGE_MAP = {
  page_about: { title: 'About Us', url: '/about' },
  page_properties: { title: 'Properties Catalog', url: '/properties' },
  page_residential: { title: 'Residential Services', url: '/services/residential' },
  page_commercial: { title: 'Commercial Services', url: '/services/commercial' },
  page_industrial: { title: 'Industrial Services', url: '/services/industrial' },
  page_team: { title: 'Our Team', url: '/team' },
  page_contact: { title: 'Contact Us', url: '/contact' },
  page_blog: { title: 'Blog & Research', url: '/blog' },
  page_terms: { title: 'Terms of Service', url: '/terms' },
  page_privacy: { title: 'Privacy Policy', url: '/privacy-policy' },
  'corridor_dlf-phase-1': { title: 'Corridor: DLF Phase 1', url: '/property/dlf-phase-1' },
  'corridor_dlf-phase-2': { title: 'Corridor: DLF Phase 2', url: '/property/dlf-phase-2' },
  'corridor_dlf-phase-3': { title: 'Corridor: DLF Phase 3', url: '/property/dlf-phase-3' },
  'corridor_dlf-phase-4': { title: 'Corridor: DLF Phase 4', url: '/property/dlf-phase-4' },
  'corridor_shushant-lok': { title: 'Corridor: Sushant Lok', url: '/property/shushant-lok' },
  'corridor_udyog-vihar': { title: 'Corridor: Udyog Vihar', url: '/property/udyog-vihar' },
  hero: { title: 'Home: Hero Masthead', url: '/' },
  topConsultant: { title: 'Home: Top Consultant Showcase', url: '/' },
  services: { title: 'Home: Services Grid', url: '/' },
  whyChooseUs: { title: 'Home: Why Choose Us Section', url: '/' },
  dlfCallout: { title: 'Home: DLF Phase 1–5 Callout', url: '/' },
  curatedCorridors: { title: 'Home: Curated Corridors', url: '/' },
};

function isImageUrl(val) {
  if (typeof val !== 'string') return false;
  const clean = val.trim();
  if (!clean.startsWith('http') && !clean.startsWith('/')) return false;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean)) return false;
  return (
    /\.(jpg|jpeg|png|webp|svg|avif)(\?.*)?$/i.test(clean) ||
    clean.includes('images.unsplash.com') ||
    clean.includes('saudagarproperties.com/wp-content') ||
    (clean.includes('imagekit.io') && !clean.includes('/videos/'))
  );
}

function getAltField(key) {
  if (key === 'image') return 'imageAlt';
  if (key === 'bgImage') return 'bgImageAlt';
  if (key === 'img') return 'imgAlt';
  if (key === 'avatar') return 'avatarAlt';
  if (key === 'logo') return 'logoAlt';
  return `${key}Alt`;
}

function getContextLabel(obj, fallbackKey) {
  if (!obj || typeof obj !== 'object') return fallbackKey;
  return obj.title || obj.name || obj.label || obj.headline || obj.tag || obj.badge || fallbackKey;
}

export async function aggregateAllImages() {
  await connectDB();
  const db = mongoose.connection.db;

  const [pages, blogs, properties, sections, authors, testimonials] = await Promise.all([
    db.collection('pages').find({}).toArray(),
    db.collection('blogposts').find({}).toArray(),
    db.collection('properties').find({}).toArray(),
    db.collection('sectioncontents').find({}).toArray(),
    db.collection('authors').find({}).toArray(),
    db.collection('testimonials').find({}).toArray(),
  ]);

  const imageRecords = [];

  // 1. Pages
  pages.forEach((p) => {
    if (p.featuredImage && isImageUrl(p.featuredImage)) {
      const alt = p.featuredImageAlt || '';
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `page_${p._id}_featured`,
        parentId: String(p._id),
        parentType: 'Page',
        parentTitle: `Page: ${p.title} (Featured Image)`,
        parentSlug: p.slug,
        field: 'featuredImageAlt',
        imageUrl: p.featuredImage,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }

    if (p.ogImage && isImageUrl(p.ogImage) && p.ogImage !== p.featuredImage) {
      const alt = p.ogImageAlt || '';
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `page_${p._id}_og`,
        parentId: String(p._id),
        parentType: 'Page',
        parentTitle: `Page: ${p.title} (Social OG)`,
        parentSlug: p.slug,
        field: 'ogImageAlt',
        imageUrl: p.ogImage,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }

    if (Array.isArray(p.sections)) {
      p.sections.forEach((sec, idx) => {
        if (sec.image && isImageUrl(sec.image)) {
          const alt = sec.imageAlt || '';
          const validation = validateAltText(alt);
          imageRecords.push({
            id: `page_${p._id}_sec_${idx}`,
            parentId: String(p._id),
            parentType: 'Page',
            parentTitle: `Page: ${p.title} • Section: ${sec.title || idx + 1}`,
            parentSlug: p.slug,
            field: `sections.${idx}.imageAlt`,
            sectionIndex: idx,
            imageUrl: sec.image,
            altText: alt,
            isValid: validation.isValid,
            issues: validation.issues,
          });
        }
      });
    }
  });

  // 2. Blog Posts
  blogs.forEach((b) => {
    if (b.featuredImage && isImageUrl(b.featuredImage)) {
      const alt = b.featuredImageAlt || '';
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `blog_${b._id}_featured`,
        parentId: String(b._id),
        parentType: 'BlogPost',
        parentTitle: `Blog: ${b.title}`,
        parentSlug: `/blog/${b.slug}`,
        field: 'featuredImageAlt',
        imageUrl: b.featuredImage,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }
  });

  // 3. Properties (Main Image + Full Gallery Images)
  properties.forEach((prop) => {
    if (prop.img && isImageUrl(prop.img)) {
      const alt = prop.imgAlt || prop.title || '';
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `prop_${prop._id}_main`,
        parentId: String(prop._id),
        parentType: 'Property',
        parentTitle: `Property: ${prop.title} (Main Image)`,
        parentSlug: `/properties/${prop.slug || prop._id}`,
        field: 'imgAlt',
        imageUrl: prop.img,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }

    if (Array.isArray(prop.images)) {
      prop.images.forEach((galImg, gIdx) => {
        if (isImageUrl(galImg)) {
          const alt = (prop.imagesAlt && prop.imagesAlt[gIdx]) || `${prop.title} - Interior / Exterior View ${gIdx + 1}`;
          const validation = validateAltText(alt);
          imageRecords.push({
            id: `prop_${prop._id}_gallery_${gIdx}`,
            parentId: String(prop._id),
            parentType: 'Property',
            parentTitle: `Property: ${prop.title} (Gallery Photo #${gIdx + 1})`,
            parentSlug: `/properties/${prop.slug || prop._id}`,
            field: `imagesAlt.${gIdx}`,
            imageUrl: galImg,
            altText: alt,
            isValid: validation.isValid,
            issues: validation.issues,
          });
        }
      });
    }
  });

  // 4. SectionContent (All CMS Pages & Corridors)
  sections.forEach((secDoc) => {
    const sKey = secDoc.sectionKey;
    const pageMeta = SECTION_PAGE_MAP[sKey] || {
      title: secDoc.title || sKey,
      url: sKey.startsWith('corridor_') ? `/property/${sKey.replace('corridor_', '')}` : `/${sKey.replace('page_', '')}`,
    };

    function traverseSection(obj, path = '', parentContext = '') {
      if (!obj || typeof obj !== 'object') return;

      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          const currentPath = path ? `${path}.${idx}` : `${idx}`;
          if (typeof item === 'string' && isImageUrl(item)) {
            const altFieldKey = `${currentPath}Alt`;
            const alt = `${pageMeta.title} • Item #${idx + 1}`;
            const validation = validateAltText(alt);
            imageRecords.push({
              id: `sec_${sKey}_${currentPath.replace(/\./g, '_')}`,
              parentId: sKey,
              parentType: 'SectionContent',
              parentTitle: `${pageMeta.title} • Item #${idx + 1}`,
              parentSlug: pageMeta.url,
              field: `data.${altFieldKey}`,
              imageUrl: item,
              altText: alt,
              isValid: validation.isValid,
              issues: validation.issues,
            });
          } else if (typeof item === 'object') {
            const itemLabel = getContextLabel(item, `Item #${idx + 1}`);
            traverseSection(item, currentPath, itemLabel);
          }
        });
        return;
      }

      for (const [key, val] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof val === 'string' && isImageUrl(val)) {
          const altFieldKey = getAltField(key);
          const rawAlt = obj[altFieldKey] || obj.alt || obj.altText || '';
          const contextTitle = parentContext || getContextLabel(obj, key);
          const alt = rawAlt || `${pageMeta.title} • ${contextTitle}`;
          const validation = validateAltText(alt);

          imageRecords.push({
            id: `sec_${sKey}_${currentPath.replace(/\./g, '_')}`,
            parentId: sKey,
            parentType: 'SectionContent',
            parentTitle: `${pageMeta.title} • ${contextTitle}`,
            parentSlug: pageMeta.url,
            field: `data.${path ? `${path}.${altFieldKey}` : altFieldKey}`,
            imageUrl: val,
            altText: alt,
            isValid: validation.isValid,
            issues: validation.issues,
          });
        } else if (typeof val === 'object' && val !== null) {
          const newContext = obj.title || obj.name || obj.label || parentContext;
          traverseSection(val, currentPath, newContext);
        }
      }
    }

    traverseSection(secDoc.data);
  });

  // 5. Authors
  authors.forEach((a) => {
    const imgUrl = a.image || a.avatar;
    if (imgUrl && isImageUrl(imgUrl)) {
      const alt = a.imageAlt || `${a.name} — Real Estate Consultant Profile`;
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `author_${a._id}`,
        parentId: String(a._id),
        parentType: 'Author',
        parentTitle: `Author Profile: ${a.name}`,
        parentSlug: `/blog/author/${a.slug}`,
        field: 'imageAlt',
        imageUrl: imgUrl,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }
  });

  // 6. Testimonials
  testimonials.forEach((t) => {
    if (t.avatar && isImageUrl(t.avatar)) {
      const alt = t.avatarAlt || `${t.name} — Verified Client Testimonial`;
      const validation = validateAltText(alt);
      imageRecords.push({
        id: `testim_${t._id}`,
        parentId: String(t._id),
        parentType: 'Testimonial',
        parentTitle: `Testimonial: ${t.name}`,
        parentSlug: '/',
        field: 'avatarAlt',
        imageUrl: t.avatar,
        altText: alt,
        isValid: validation.isValid,
        issues: validation.issues,
      });
    }
  });

  return imageRecords;
}

async function run() {
  const images = await aggregateAllImages();
  console.log(`\nTOTAL COMPREHENSIVE IMAGES SCANNED: ${images.length}`);
  
  const byType = {};
  images.forEach(i => {
    byType[i.parentType] = (byType[i.parentType] || 0) + 1;
  });
  console.log('Distribution by Parent Type:', byType);

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
