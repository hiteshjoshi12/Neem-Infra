import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import { requireAdmin } from '@/lib/auth/authGuard';
import { ensureDefaultSeoData, invalidateSeoCache, getGlobalSeoSettings } from '@/lib/seo/dynamicSeo';
import { normalizePath } from '@/lib/seo/metadataHelper';

export async function GET(req) {
  try {
    await connectDB();
    await ensureDefaultSeoData();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { h1: { $regex: search, $options: 'i' } },
      ];
    }

    if (status !== 'all') {
      filter.status = status;
    }

    if (type !== 'all') {
      filter.pageType = type;
    }

    const pages = await Page.find(filter)
      .sort({ pageType: 1, slug: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: pages,
      total: pages.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const { title, slug, pageType, status, h1, h2, content, metaTitle, metaDescription, canonicalUrl, robots, ogTitle, ogDescription, ogImage, breadcrumbs, schemaType, customSchemaJson, faq } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: 'Page title and slug are required' }, { status: 400 });
    }

    const normalizedSlug = normalizePath(slug);

    // Check duplicate slug
    const existing = await Page.findOne({ slug: normalizedSlug });
    if (existing) {
      return NextResponse.json({ success: false, message: `A page with URL slug '${normalizedSlug}' already exists.` }, { status: 400 });
    }

    const settings = await getGlobalSeoSettings();
    const baseUrl = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');

    const newPage = await Page.create({
      title: title.trim(),
      slug: normalizedSlug,
      pageType: pageType || 'custom',
      status: status || 'published',
      publishedAt: status === 'published' ? new Date() : undefined,
      h1: h1 || title,
      h2: h2 || '',
      content: content || '',
      sections: Array.isArray(body.sections) ? body.sections : [],
      metaTitle: metaTitle || `${title.trim()} | Saudagar Properties`,
      metaDescription: metaDescription || '',
      canonicalUrl: canonicalUrl || `${baseUrl}${normalizedSlug === '/' ? '' : normalizedSlug}`,
      focusKeywords: Array.isArray(body.focusKeywords) ? body.focusKeywords : [],
      robots: robots || { index: true, follow: true, noarchive: false, nosnippet: false },
      ogTitle: ogTitle || metaTitle || title,
      ogDescription: ogDescription || metaDescription || '',
      ogImage: ogImage || '',
      ogImageAlt: body.ogImageAlt || title,
      ogType: body.ogType || 'website',
      twitterCard: body.twitterCard || 'summary_large_image',
      breadcrumbs: Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? breadcrumbs : [
        { name: 'Home', url: '/' },
        { name: title.trim(), url: normalizedSlug }
      ],
      schemaType: schemaType || 'WebPage',
      customSchemaJson: customSchemaJson || '',
      faq: Array.isArray(faq) ? faq : [],
      internalLinks: Array.isArray(body.internalLinks) ? body.internalLinks : [],
      featuredImage: body.featuredImage || '',
      featuredImageAlt: body.featuredImageAlt || '',
      lastUpdatedBy: admin.name || admin.email || 'Admin',
    });

    invalidateSeoCache();

    return NextResponse.json({
      success: true,
      message: 'Page created successfully',
      data: newPage,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create page' },
      { status: error.status || 500 }
    );
  }
}
