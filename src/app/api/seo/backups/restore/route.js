import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Backup from '@/models/Backup';
import Page from '@/models/Page';
import SeoSettings from '@/models/SeoSettings';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';
import { revalidateSeoSettings, revalidatePageSeo, revalidateRedirects } from '@/lib/cache/revalidateHelper';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    let backupData = body.snapshotData;

    // If backupId was provided instead of direct snapshot
    if (body.backupId && !backupData) {
      const found = await Backup.findById(body.backupId);
      if (!found) {
        return NextResponse.json({ success: false, message: 'Backup not found' }, { status: 404 });
      }
      backupData = found.data;
    }

    if (!backupData) {
      return NextResponse.json({ success: false, message: 'Invalid or missing backup data' }, { status: 400 });
    }

    // 1. Restore SeoSettings
    if (backupData.settings) {
      const { _id, createdAt, updatedAt, ...cleanSettings } = backupData.settings;
      await SeoSettings.findOneAndUpdate(
        { singletonKey: 'global_seo_settings' },
        { $set: cleanSettings },
        { upsert: true }
      );
    }

    // 2. Restore Pages
    if (Array.isArray(backupData.pages) && backupData.pages.length > 0) {
      for (const p of backupData.pages) {
        const { _id, createdAt, updatedAt, ...cleanPage } = p;
        if (cleanPage.slug) {
          await Page.findOneAndUpdate(
            { slug: cleanPage.slug },
            { $set: cleanPage },
            { upsert: true }
          );
        }
      }
    }

    // 3. Restore Redirects
    if (Array.isArray(backupData.redirects) && backupData.redirects.length > 0) {
      for (const r of backupData.redirects) {
        const { _id, createdAt, updatedAt, ...cleanRedir } = r;
        if (cleanRedir.fromPath) {
          await Redirect.findOneAndUpdate(
            { fromPath: cleanRedir.fromPath },
            { $set: cleanRedir },
            { upsert: true }
          );
        }
      }
    }

    invalidateSeoCache();
    await Promise.all([
      revalidateSeoSettings(),
      revalidatePageSeo('/'),
      revalidateRedirects(),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Website SEO configurations successfully restored from snapshot!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to restore backup' },
      { status: error.status || 500 }
    );
  }
}
