import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import BlogPost from '@/models/BlogPost';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth/authGuard';
import { validateAltText } from '@/lib/seo/imageSeoHelper';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get('type') || 'all'; // all, missing, warning, valid
    const search = searchParams.get('q') || '';

    const [pages, blogs, properties] = await Promise.all([
      Page.find({}).lean(),
      BlogPost.find({}).lean(),
      Property.find({}).lean(),
    ]);

    const imageRecords = [];

    // 1. Pages
    pages.forEach((p) => {
      if (p.featuredImage) {
        const alt = p.featuredImageAlt || '';
        const validation = validateAltText(alt);
        imageRecords.push({
          id: `page_${p._id}_featured`,
          parentId: p._id,
          parentType: 'Page',
          parentTitle: p.title,
          parentSlug: p.slug,
          field: 'featuredImageAlt',
          imageUrl: p.featuredImage,
          altText: alt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }

      if (p.ogImage && p.ogImage !== p.featuredImage) {
        const alt = p.ogImageAlt || '';
        const validation = validateAltText(alt);
        imageRecords.push({
          id: `page_${p._id}_og`,
          parentId: p._id,
          parentType: 'Page',
          parentTitle: p.title,
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
          if (sec.image) {
            const alt = sec.imageAlt || '';
            const validation = validateAltText(alt);
            imageRecords.push({
              id: `page_${p._id}_sec_${idx}`,
              parentId: p._id,
              parentType: 'Page',
              parentTitle: `${p.title} (Section: ${sec.title || idx + 1})`,
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
      if (b.featuredImage) {
        const alt = b.featuredImageAlt || '';
        const validation = validateAltText(alt);
        imageRecords.push({
          id: `blog_${b._id}_featured`,
          parentId: b._id,
          parentType: 'BlogPost',
          parentTitle: b.title,
          parentSlug: `/blog/${b.slug}`,
          field: 'featuredImageAlt',
          imageUrl: b.featuredImage,
          altText: alt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }
    });

    // 3. Properties
    properties.forEach((prop) => {
      if (prop.img) {
        const alt = prop.title || '';
        const validation = validateAltText(alt);
        imageRecords.push({
          id: `prop_${prop._id}_main`,
          parentId: prop._id,
          parentType: 'Property',
          parentTitle: prop.title,
          parentSlug: `/properties/${prop.slug || prop._id}`,
          field: 'imgAlt',
          imageUrl: prop.img,
          altText: alt,
          isValid: validation.isValid,
          issues: validation.issues,
        });
      }
    });

    let filtered = imageRecords;
    if (search) {
      filtered = filtered.filter(
        (img) =>
          img.parentTitle?.toLowerCase().includes(search.toLowerCase()) ||
          img.altText?.toLowerCase().includes(search.toLowerCase()) ||
          img.imageUrl?.toLowerCase().includes(search.toLowerCase())
      );
    }

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

    if (parentType === 'Page') {
      if (field.startsWith('sections.') && typeof sectionIndex === 'number') {
        const page = await Page.findById(parentId);
        if (page && page.sections && page.sections[sectionIndex]) {
          page.sections[sectionIndex].imageAlt = cleanAlt;
          await page.save();
        }
      } else {
        await Page.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } });
      }
      invalidateSeoCache();
    } else if (parentType === 'BlogPost') {
      await BlogPost.findByIdAndUpdate(parentId, { $set: { [field]: cleanAlt } });
    } else if (parentType === 'Property') {
      await Property.findByIdAndUpdate(parentId, { $set: { title: cleanAlt } });
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
