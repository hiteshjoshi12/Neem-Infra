import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';
import { revalidatePageSeo } from '@/lib/cache/revalidateHelper';

/**
 * Flexible page finder by ObjectId OR slug/route
 */
async function findPageByIdOrSlug(identifier) {
  if (!identifier && identifier !== '/') return null;
  const decoded = decodeURIComponent(String(identifier)).trim();

  // 1. Try finding by MongoDB ObjectId if 24-hex
  if (mongoose.isValidObjectId(decoded) && /^[0-9a-fA-F]{24}$/.test(decoded)) {
    const byId = await Page.findById(decoded);
    if (byId) return byId;
  }

  // 2. Exact match on slug
  let page = await Page.findOne({ slug: decoded });
  if (page) return page;

  // 3. Try finding by slug variations
  const clean = decoded.startsWith('/') ? decoded : `/${decoded}`;
  const slugVariations = [
    clean,
    decoded,
    clean.toLowerCase(),
    decoded.toLowerCase(),
    `/property/${decoded.replace(/^\//, '')}`,
    `/services/${decoded.replace(/^\//, '')}`,
  ];

  return await Page.findOne({ slug: { $in: slugVariations } });
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('slug') ?? searchParams.get('id');

    if (!identifier && identifier !== '/') {
      return NextResponse.json({ success: false, message: 'Missing page slug or ID query parameter' }, { status: 400 });
    }

    const page = await findPageByIdOrSlug(identifier);
    if (!page) {
      return NextResponse.json({ success: false, message: `Page '${identifier}' not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('slug') ?? searchParams.get('id');
    const body = await req.json();

    const lookupTarget = identifier || body._id || body.slug;
    if (!lookupTarget && lookupTarget !== '/') {
      return NextResponse.json({ success: false, message: 'Missing page identifier' }, { status: 400 });
    }

    const existingPage = await findPageByIdOrSlug(lookupTarget);
    if (!existingPage) {
      return NextResponse.json({ success: false, message: `Page '${lookupTarget}' not found` }, { status: 404 });
    }

    const realId = existingPage._id;

    // Handle slug change
    let newSlug = existingPage.slug;
    if (body.slug && body.slug !== existingPage.slug) {
      if (existingPage.slug === '/' && body.slug !== '/') {
        return NextResponse.json({ success: false, message: 'The homepage slug cannot be changed' }, { status: 400 });
      }

      newSlug = normalizePath(body.slug);
      const duplicate = await Page.findOne({ slug: newSlug, _id: { $ne: realId } });
      if (duplicate) {
        return NextResponse.json({ success: false, message: `A page with slug '${newSlug}' already exists.` }, { status: 400 });
      }

      if (body.createRedirectOnSlugChange !== false && existingPage.slug !== newSlug) {
        try {
          await Redirect.findOneAndUpdate(
            { fromPath: existingPage.slug },
            {
              $set: {
                fromPath: existingPage.slug,
                toPath: newSlug,
                statusCode: 301,
                isActive: true,
                preserveQuery: true,
                notes: `Auto-generated when page slug was updated from '${existingPage.slug}' to '${newSlug}'`,
                updatedBy: admin?.email || 'admin'
              }
            },
            { upsert: true, new: true }
          );
        } catch (redirectErr) {
          console.warn('[SEO] Failed to create automatic redirect for slug change:', redirectErr);
        }
      }
    }

    const updateFields = {
      title: body.title !== undefined ? body.title.trim() : existingPage.title,
      slug: newSlug,
      pageType: body.pageType || existingPage.pageType,
      status: body.status || existingPage.status,
      h1: body.h1 !== undefined ? body.h1 : existingPage.h1,
      h2: body.h2 !== undefined ? body.h2 : existingPage.h2,
      directAnswer: body.directAnswer !== undefined ? body.directAnswer : existingPage.directAnswer,
      content: body.content !== undefined ? body.content : existingPage.content,
      sections: Array.isArray(body.sections) ? body.sections : existingPage.sections,
      metaTitle: body.metaTitle !== undefined ? body.metaTitle : existingPage.metaTitle,
      metaDescription: body.metaDescription !== undefined ? body.metaDescription : existingPage.metaDescription,
      canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl : existingPage.canonicalUrl,
      focusKeywords: Array.isArray(body.focusKeywords) ? body.focusKeywords : existingPage.focusKeywords,
      robots: body.robots || existingPage.robots,
      excludeFromSitemap: body.excludeFromSitemap !== undefined ? Boolean(body.excludeFromSitemap) : existingPage.excludeFromSitemap,
      ogTitle: body.ogTitle !== undefined ? body.ogTitle : existingPage.ogTitle,
      ogDescription: body.ogDescription !== undefined ? body.ogDescription : existingPage.ogDescription,
      ogImage: body.ogImage !== undefined ? body.ogImage : existingPage.ogImage,
      ogImageAlt: body.ogImageAlt !== undefined ? body.ogImageAlt : existingPage.ogImageAlt,
      ogType: body.ogType || existingPage.ogType,
      twitterCard: body.twitterCard || existingPage.twitterCard,
      breadcrumbs: Array.isArray(body.breadcrumbs) ? body.breadcrumbs : existingPage.breadcrumbs,
      schemaType: body.schemaType || existingPage.schemaType,
      customSchemaJson: body.customSchemaJson !== undefined ? body.customSchemaJson : existingPage.customSchemaJson,
      faq: Array.isArray(body.faq) ? body.faq : existingPage.faq,
      internalLinks: Array.isArray(body.internalLinks) ? body.internalLinks : existingPage.internalLinks,
      featuredImage: body.featuredImage !== undefined ? body.featuredImage : existingPage.featuredImage,
      featuredImageAlt: body.featuredImageAlt !== undefined ? body.featuredImageAlt : existingPage.featuredImageAlt,
      updatedAt: new Date()
    };

    if (body.status === 'published' && existingPage.status !== 'published') {
      updateFields.publishedAt = new Date();
    }

    const updatedPage = await Page.findByIdAndUpdate(
      realId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    try {
      await revalidatePageSeo(existingPage.slug);
      if (newSlug !== existingPage.slug) {
        await revalidatePageSeo(newSlug);
      }
    } catch (revErr) {
      console.warn('[SEO] Cache revalidation error:', revErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      data: updatedPage,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

