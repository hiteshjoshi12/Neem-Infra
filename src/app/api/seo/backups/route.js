import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Backup from '@/models/Backup';
import Page from '@/models/Page';
import SeoSettings from '@/models/SeoSettings';
import Redirect from '@/models/Redirect';
import BlogPost from '@/models/BlogPost';
import Property from '@/models/Property';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth/authGuard';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';

export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const backups = await Backup.find({})
      .select('-data') // exclude heavy data blob for listing
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: backups,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to list backups' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const label = body.label || 'Manual SEO & Content Snapshot';

    // Collect all collections
    const [pages, settings, redirects, blogs, properties, categories] = await Promise.all([
      Page.find({}).lean(),
      SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean(),
      Redirect.find({}).lean(),
      BlogPost.find({}).lean(),
      Property.find({}).lean(),
      Category.find({}).lean(),
    ]);

    const snapshot = {
      timestamp: new Date().toISOString(),
      label,
      version: '1.0.0',
      settings,
      pages,
      redirects,
      blogs,
      properties,
      categories,
    };

    const jsonString = JSON.stringify(snapshot);
    const sizeBytes = Buffer.byteLength(jsonString, 'utf8');

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `saudagar-seo-backup-${timestampStr}.json`;

    const backupDoc = await Backup.create({
      filename,
      label,
      sizeBytes,
      itemCounts: {
        pages: pages.length,
        blogs: blogs.length,
        properties: properties.length,
        categories: categories.length,
        redirects: redirects.length,
        settings: settings ? 1 : 0,
      },
      data: snapshot,
      createdBy: admin.name || admin.email || 'Admin',
    });

    // Update lastBackupAt in SeoSettings
    await SeoSettings.updateOne(
      { singletonKey: 'global_seo_settings' },
      { $set: { lastBackupAt: new Date() } }
    );

    invalidateSeoCache();

    return NextResponse.json({
      success: true,
      message: 'Website SEO snapshot backup created successfully',
      data: {
        _id: backupDoc._id,
        filename: backupDoc.filename,
        label: backupDoc.label,
        sizeBytes: backupDoc.sizeBytes,
        itemCounts: backupDoc.itemCounts,
        createdAt: backupDoc.createdAt,
        downloadPayload: snapshot,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create backup' },
      { status: error.status || 500 }
    );
  }
}
