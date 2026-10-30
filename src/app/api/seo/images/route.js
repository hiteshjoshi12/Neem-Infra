import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import BlogPost from '@/models/BlogPost';
import Property from '@/models/Property';
import SectionContent from '@/models/SectionContent';
import Author from '@/models/Author';
import Testimonial from '@/models/Testimonial';
import { requireAdmin } from '@/lib/auth/authGuard';
import { validateAltText } from '@/lib/seo/imageSeoHelper';
import {
  revalidateSectionContent,
  revalidateProperty,
  revalidateBlogPost,
  revalidateAuthor,
  revalidateTestimonials,
  revalidatePageSeo,
} from '@/lib/cache/revalidateHelper';

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

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get('type') || 'all'; // all, missing, issues, valid
    const entityType = searchParams.get('entity') || 'all'; // all, SectionContent, Property, BlogPost, Testimonial, Author, Page
    const search = searchParams.get('q') || '';

    const [pages, blogs, properties, sections, authors, testimonials] = await Promise.all([
      Page.find({}).lean(),
      BlogPost.find({}).lean(),
      Property.find({}).lean(),
      SectionContent.find({}).lean(),
      Author.find({}).lean(),
      Testimonial.find({}).lean(),
    ]);

    const imageRecords = [];

    // 1. Pages (Custom SEO Pages)
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

    // 3. Properties (Main Image + Gallery Images)
    properties.forEach((prop) => {
      if (prop.img && isImageUrl(prop.img)) {
        const alt = prop.imgAlt || '';
        const suggestedAlt = `${prop.title} — Main Exterior Architecture`;
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
          suggestedAlt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }

      if (Array.isArray(prop.images)) {
        prop.images.forEach((galImg, gIdx) => {
          if (isImageUrl(galImg)) {
            const alt = (prop.imagesAlt && prop.imagesAlt[gIdx]) || '';
            const suggestedAlt = `${prop.title} — Photo #${gIdx + 1}`;
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
              suggestedAlt,
              isValid: validation.isValid,
              issues: validation.issues,
            });
          }
        });
      }
    });

    // 4. SectionContent (All CMS Pages, Corridors, Services, About Us, Home)
    sections.forEach((secDoc) => {
      const sKey = secDoc.sectionKey;
      const pageMeta = SECTION_PAGE_MAP[sKey] || {
        title: secDoc.title || sKey,
        url: sKey.startsWith('corridor_')
          ? `/property/${sKey.replace('corridor_', '')}`
          : `/${sKey.replace('page_', '')}`,
      };

      function traverseSection(obj, path = '', parentContext = '') {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          obj.forEach((item, idx) => {
            const currentPath = path ? `${path}.${idx}` : `${idx}`;
            if (typeof item === 'string' && isImageUrl(item)) {
              const altFieldKey = `${currentPath}Alt`;
              const rawAlt = obj[`${idx}Alt`] || '';
              const suggestedAlt = `${pageMeta.title} • Item #${idx + 1}`;
              const alt = rawAlt;
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
                suggestedAlt,
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
            const suggestedAlt = `${pageMeta.title} • ${contextTitle}`;
            const alt = rawAlt;
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
              suggestedAlt,
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
        const alt = a.imageAlt || '';
        const suggestedAlt = `${a.name} — Real Estate Consultant Profile`;
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
          suggestedAlt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }
    });

    // 6. Testimonials
    testimonials.forEach((t) => {
      if (t.avatar && isImageUrl(t.avatar)) {
        const alt = t.avatarAlt || t.imageAlt || '';
        const suggestedAlt = `${t.name} — Verified Client Testimonial`;
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
          suggestedAlt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }
    });

    let filtered = imageRecords;

    // Filter by entity type
    if (entityType && entityType !== 'all') {
      filtered = filtered.filter((img) => img.parentType === entityType);
    }

    // Filter by text search
    if (search) {
      filtered = filtered.filter(
        (img) =>
          img.parentTitle?.toLowerCase().includes(search.toLowerCase()) ||
          img.altText?.toLowerCase().includes(search.toLowerCase()) ||
          img.imageUrl?.toLowerCase().includes(search.toLowerCase()) ||
          img.parentSlug?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by quality status
    if (filterType === 'missing') {
      filtered = filtered.filter((img) => !img.altText || !img.altText.trim());
    } else if (filterType === 'issues') {
      filtered = filtered.filter((img) => !img.isValid);
    } else if (filterType === 'valid') {
      filtered = filtered.filter((img) => img.isValid);
    }

    const summary = {
      total: imageRecords.length,
      missing: imageRecords.filter((i) => !i.altText || !i.altText.trim()).length,
      valid: imageRecords.filter((i) => i.isValid).length,
      warnings: imageRecords.filter((i) => !i.isValid && i.altText).length,
      byType: {
        SectionContent: imageRecords.filter((i) => i.parentType === 'SectionContent').length,
        Property: imageRecords.filter((i) => i.parentType === 'Property').length,
        BlogPost: imageRecords.filter((i) => i.parentType === 'BlogPost').length,
        Testimonial: imageRecords.filter((i) => i.parentType === 'Testimonial').length,
        Author: imageRecords.filter((i) => i.parentType === 'Author').length,
        Page: imageRecords.filter((i) => i.parentType === 'Page').length,
      },
    };

    return NextResponse.json({
      success: true,
      data: filtered,
      summary,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const { parentType, parentId, field, altText, sectionIndex } = body;

    if (!parentType || !parentId || !field) {
      return NextResponse.json({ success: false, message: 'Missing target parameters' }, { status: 400 });
    }

    const cleanAlt = (altText || '').trim();

    if (parentType === 'SectionContent') {
      // Support dot notation update for nested JSON in SectionContent.data
      const dbField = field.startsWith('data.') ? field : `data.${field}`;
      await SectionContent.updateOne({ sectionKey: parentId }, { $set: { [dbField]: cleanAlt } });
      await revalidateSectionContent(parentId);
    } else if (parentType === 'Property') {
      if (field === 'imgAlt') {
        await Property.findByIdAndUpdate(parentId, { $set: { imgAlt: cleanAlt } });
      } else if (field.startsWith('imagesAlt.')) {
        const idx = parseInt(field.split('.')[1], 10);
        await Property.updateOne({ _id: parentId }, { $set: { [`imagesAlt.${idx}`]: cleanAlt } });
      } else {
        await Property.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } });
      }
      const prop = await Property.findById(parentId).lean();
      await revalidateProperty(prop);
    } else if (parentType === 'BlogPost') {
      const post = await BlogPost.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } }, { new: true }).lean();
      await revalidateBlogPost(post);
    } else if (parentType === 'Author') {
      const author = await Author.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } }, { new: true }).lean();
      await revalidateAuthor(author);
    } else if (parentType === 'Testimonial') {
      await Testimonial.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } });
      await revalidateTestimonials();
    } else if (parentType === 'Page') {
      let pageSlug = '/';
      if (field.startsWith('sections.') && typeof sectionIndex === 'number') {
        const page = await Page.findById(parentId);
        if (page && page.sections && page.sections[sectionIndex]) {
          page.sections[sectionIndex].imageAlt = cleanAlt;
          await page.save();
          pageSlug = page.slug;
        }
      } else {
        const updated = await Page.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } }, { new: true }).lean();
        pageSlug = updated?.slug || '/';
      }
      await revalidatePageSeo(pageSlug);
    }

    return NextResponse.json({
      success: true,
      message: 'Alt text updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update alt text' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const { parentType, parentId, field, sectionIndex } = body;

    if (!parentType || !parentId || !field) {
      return NextResponse.json({ success: false, message: 'Missing target parameters' }, { status: 400 });
    }

    if (parentType === 'SectionContent') {
      const dbField = field.startsWith('data.') ? field : `data.${field}`;
      await SectionContent.updateOne({ sectionKey: parentId }, { $set: { [dbField]: '' } });
      await revalidateSectionContent(parentId);
    } else if (parentType === 'Property') {
      let prop;
      if (field === 'imgAlt') {
        prop = await Property.findByIdAndUpdate(parentId, { $set: { imgAlt: '' } }, { new: true });
      } else if (field.startsWith('imagesAlt.')) {
        const idx = parseInt(field.split('.')[1], 10);
        prop = await Property.findByIdAndUpdate(parentId, { $set: { [`imagesAlt.${idx}`]: '' } }, { new: true });
      } else {
        prop = await Property.findByIdAndUpdate(parentId, { $set: { [field]: '' } }, { new: true });
      }
      await revalidateProperty(prop);
    } else if (parentType === 'BlogPost') {
      const post = await BlogPost.findByIdAndUpdate(parentId, { $set: { [field]: '' } }, { new: true });
      await revalidateBlogPost(post);
    } else if (parentType === 'Author') {
      const author = await Author.findByIdAndUpdate(parentId, { $set: { [field]: '' } }, { new: true });
      await revalidateAuthor(author);
    } else if (parentType === 'Testimonial') {
      await Testimonial.findByIdAndUpdate(parentId, { $set: { [field]: '' } });
      await revalidateTestimonials();
    } else if (parentType === 'Page') {
      let page;
      if (field.startsWith('sections.') && typeof sectionIndex === 'number') {
        page = await Page.findById(parentId);
        if (page && page.sections && page.sections[sectionIndex]) {
          page.sections[sectionIndex].imageAlt = '';
          await page.save();
        }
      } else {
        page = await Page.findByIdAndUpdate(parentId, { $set: { [field]: '' } }, { new: true });
      }
      await revalidatePageSeo(page?.slug);
    }

    return NextResponse.json({
      success: true,
      message: 'Alt text removed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete alt text' },
      { status: error.status || 500 }
    );
  }
}
