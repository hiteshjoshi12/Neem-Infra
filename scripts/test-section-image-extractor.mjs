import { connectDB } from '../src/lib/mongodb.js';
import mongoose from 'mongoose';

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
  hero: { title: 'Home: Hero', url: '/' },
  topConsultant: { title: 'Home: Top Consultant', url: '/' },
  services: { title: 'Home: Services', url: '/' },
  whyChooseUs: { title: 'Home: Why Choose Us', url: '/' },
  dlfCallout: { title: 'Home: DLF Callout', url: '/' },
  curatedCorridors: { title: 'Home: Curated Corridors', url: '/' },
};

export function extractImagesFromSection(sectionDoc) {
  const images = [];
  const sectionKey = sectionDoc.sectionKey;
  const pageMeta = SECTION_PAGE_MAP[sectionKey] || {
    title: sectionDoc.title || sectionKey,
    url: sectionKey.startsWith('corridor_') ? `/property/${sectionKey.replace('corridor_', '')}` : `/${sectionKey.replace('page_', '')}`,
  };

  function isImageUrl(val) {
    if (typeof val !== 'string') return false;
    const clean = val.trim();
    if (!clean.startsWith('http') && !clean.startsWith('/')) return false;
    return (
      /\.(jpg|jpeg|png|webp|svg|avif)(\?.*)?$/i.test(clean) ||
      clean.includes('imagekit.io') ||
      clean.includes('images.unsplash.com') ||
      clean.includes('saudagarproperties.com/wp-content')
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

  function traverse(obj, path = '', parentContext = '') {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        const currentPath = path ? `${path}.${idx}` : `${idx}`;
        if (typeof item === 'string' && isImageUrl(item)) {
          const altField = `${currentPath}Alt`;
          images.push({
            id: `sec_${sectionKey}_${currentPath.replace(/\./g, '_')}`,
            parentId: sectionKey,
            parentType: 'SectionContent',
            parentTitle: `${pageMeta.title} • Item #${idx + 1}`,
            parentSlug: pageMeta.url,
            field: `data.${altField}`,
            imageUrl: item,
            altText: '',
          });
        } else if (typeof item === 'object') {
          const itemLabel = getContextLabel(item, `Item #${idx + 1}`);
          traverse(item, currentPath, itemLabel);
        }
      });
      return;
    }

    for (const [key, val] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof val === 'string' && isImageUrl(val)) {
        const altFieldKey = getAltField(key);
        const existingAlt = obj[altFieldKey] || obj.alt || obj.altText || '';
        const contextTitle = parentContext || getContextLabel(obj, key);
        images.push({
          id: `sec_${sectionKey}_${currentPath.replace(/\./g, '_')}`,
          parentId: sectionKey,
          parentType: 'SectionContent',
          parentTitle: `${pageMeta.title} • ${contextTitle}`,
          parentSlug: pageMeta.url,
          field: `data.${path ? `${path}.${altFieldKey}` : altFieldKey}`,
          imageUrl: val,
          altText: existingAlt,
        });
      } else if (typeof val === 'object' && val !== null) {
        const newContext = obj.title || obj.name || obj.label || parentContext;
        traverse(val, currentPath, newContext);
      }
    }
  }

  traverse(sectionDoc.data);
  return images;
}

async function run() {
  await connectDB();
  const db = mongoose.connection.db;
  const sections = await db.collection('sectioncontents').find({}).toArray();

  let allImages = [];
  for (const s of sections) {
    const list = extractImagesFromSection(s);
    allImages.push(...list);
  }

  console.log(`Extracted ${allImages.length} images from ${sections.length} SectionContent docs!`);
  console.log('Sample extracted images (first 10):');
  allImages.slice(0, 10).forEach(i => {
    console.log(`- [${i.parentTitle}] (${i.field}): ${i.imageUrl.slice(0, 60)}... alt: "${i.altText}"`);
  });

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
