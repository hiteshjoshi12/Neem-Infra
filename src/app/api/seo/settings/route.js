import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import { requireAdmin } from '@/lib/auth/authGuard';
import { ensureDefaultSeoData, invalidateSeoCache } from '@/lib/seo/dynamicSeo';
import { invalidateCache } from '@/lib/cache/apiCache';

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

    // Script injection security: only superadmin can modify custom head or body scripts
    if (body.customScripts !== undefined) {
      if (admin.role !== 'superadmin') {
        return NextResponse.json(
          { success: false, message: 'Forbidden: Custom script injection is restricted to Super-Admin users only.' },
          { status: 403 }
        );
      }
    }

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
    invalidateCache(); // Invalidate in-memory DAL cache
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('settings');
      revalidateTag('dal_global_settings');
    } catch (e) {}
    revalidatePath('/', 'layout');
    revalidatePath('/sitemap.xml');
    revalidatePath('/robots.txt');
    revalidatePath('/llms.txt');
    revalidatePath('/llms-full.txt');

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
