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
  if (!identifier) return null;
  const decoded = decodeURIComponent(String(identifier)).trim();

  // 1. Try finding by MongoDB ObjectId
  if (mongoose.isValidObjectId(decoded)) {
    const byId = await Page.findById(decoded);
    if (byId) return byId;
  }

  // 2. Try finding by slug variations
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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing page ID or slug' }, { status: 400 });
    }

    const page = await findPageByIdOrSlug(id);
    if (!page) {
      return NextResponse.json({ success: false, message: `Page '${id}' not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const body = await req.json();

    const existingPage = await findPageByIdOrSlug(id);
    if (!existingPage) {
      return NextResponse.json({ success: false, message: `Page '${id}' not found` }, { status: 404 });
    }

    const realId = existingPage._id;

    // Handle slug change
    let newSlug = existingPage.slug;
    if (body.slug && body.slug !== existingPage.slug) {
      // Prevent modifying root "/" slug
      if (existingPage.slug === '/' && body.slug !== '/') {
        return NextResponse.json({ success: false, message: 'The homepage slug cannot be changed' }, { status: 400 });
      }

      newSlug = normalizePath(body.slug);
      const duplicate = await Page.findOne({ slug: newSlug, _id: { $ne: realId } });
      if (duplicate) {
        return NextResponse.json({ success: false, message: `A page with slug '${newSlug}' already exists.` }, { status: 400 });
      }

      // Automatically create a 301 redirect from old slug to new slug if requested
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
                notes: `Auto-generated redirect upon slug change from '${existingPage.slug}' to '${newSlug}'`,
                createdBy: admin.name || 'System',
              },
            },
            { upsert: true }
          );
        } catch (redirectErr) {
          console.warn('[Auto-Redirect] Error creating redirect on slug change:', redirectErr?.message);
        }
      }
    }

    delete body._id;
    delete body.id;

    if (Array.isArray(body.breadcrumbs)) {
      body.breadcrumbs = body.breadcrumbs.map((b) => ({
        name: b.name || '',
        url: b.url || '',
      }));
    }

    // If status transitioned to published and publishedAt not set
    let publishedAt = existingPage.publishedAt;
    if (body.status === 'published' && (!existingPage.publishedAt || existingPage.status !== 'published')) {
      publishedAt = new Date();
    }

    const updated = await Page.findByIdAndUpdate(
      realId,
      {
        $set: {
          ...body,
          slug: newSlug,
          publishedAt,
          lastUpdatedBy: admin.name || admin.email || 'Admin',
        },
      },
      { returnDocument: 'after', runValidators: true }
    );

    await revalidatePageSeo(updated?.slug);

    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update page' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const page = await findPageByIdOrSlug(id);
    if (!page) {
      return NextResponse.json({ success: false, message: `Page '${id}' not found` }, { status: 404 });
    }

    if (page.pageType === 'system') {
      return NextResponse.json(
        { success: false, message: 'System core pages cannot be deleted. You can unpublish or modify them instead.' },
        { status: 400 }
      );
    }

    await Page.findByIdAndDelete(page._id);
    await revalidatePageSeo(page?.slug);

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete page' },
      { status: error.status || 500 }
    );
  }
}
