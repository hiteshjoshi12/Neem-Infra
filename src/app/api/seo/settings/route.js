import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import { requireAdmin } from '@/lib/auth/authGuard';
import { ensureDefaultSeoData, invalidateSeoCache } from '@/lib/seo/dynamicSeo';

export async function GET(req) {
  try {
    await connectDB();
    await ensureDefaultSeoData();

    let settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean();
    if (!settings) {
      settings = await SeoSettings.create({ singletonKey: 'global_seo_settings' });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
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

    const updated = await SeoSettings.findOneAndUpdate(
      { singletonKey: 'global_seo_settings' },
      {
        $set: {
          ...body,
          singletonKey: 'global_seo_settings',
          lastUpdatedBy: admin.name || admin.email || 'Admin',
        },
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    invalidateSeoCache();

    return NextResponse.json({
      success: true,
      message: 'Global SEO settings saved successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update SEO settings' },
      { status: error.status || 500 }
    );
  }
}
