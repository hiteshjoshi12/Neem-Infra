import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';
import { normalizePath } from '@/lib/seo/metadataHelper';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const page = await Page.findById(id).lean();
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
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
    const { id } = await params;
    const body = await req.json();

    const existingPage = await Page.findById(id);
    if (!existingPage) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    // Handle slug change
    let newSlug = existingPage.slug;
    if (body.slug && body.slug !== existingPage.slug) {
      // Prevent modifying root "/" slug
      if (existingPage.slug === '/' && body.slug !== '/') {
        return NextResponse.json({ success: false, message: 'The homepage slug cannot be changed' }, { status: 400 });
      }

      newSlug = normalizePath(body.slug);
      const duplicate = await Page.findOne({ slug: newSlug, _id: { $ne: id } });
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

    // If status transitioned to published and publishedAt not set
    let publishedAt = existingPage.publishedAt;
    if (body.status === 'published' && (!existingPage.publishedAt || existingPage.status !== 'published')) {
      publishedAt = new Date();
    }

    const updated = await Page.findByIdAndUpdate(
      id,
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

    invalidateSeoCache();

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
    const { id } = await params;

    const page = await Page.findById(id);
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    if (page.pageType === 'system') {
      return NextResponse.json(
        { success: false, message: 'System core pages cannot be deleted. You can unpublish or modify them instead.' },
        { status: 400 }
      );
    }

    await Page.findByIdAndDelete(id);
    invalidateSeoCache();

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
