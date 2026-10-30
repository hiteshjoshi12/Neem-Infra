import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getSitemapSummary } from '@/lib/sitemap/sitemapService';
import { revalidateSitemaps, revalidateSeoSettings } from '@/lib/cache/revalidateHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const summary = await getSitemapSummary();
    return NextResponse.json({
      success: true,
      data: summary,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const { sitemapConfig } = body;

    const existing = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
    const currentConfig = existing?.sitemapConfig || {};

    const updatedConfig = {
      ...currentConfig,
      ...(sitemapConfig || {}),
    };

    await SeoSettings.findOneAndUpdate(
      { singletonKey: 'global_seo_settings' },
      {
        $set: {
          sitemapConfig: updatedConfig,
          lastUpdatedBy: admin.name || admin.email || 'Admin',
        },
      },
      { upsert: true, new: true }
    );

    await revalidateSeoSettings();
    await revalidateSitemaps();

    const summary = await getSitemapSummary();

    return NextResponse.json({
      success: true,
      message: 'Sitemap configuration updated successfully',
      data: summary,
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

