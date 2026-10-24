import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import BusinessProfile from '@/models/BusinessProfile';
import { requireAdmin } from '@/lib/auth/authGuard';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';
import { invalidateCache } from '@/lib/cache/apiCache';

export async function GET(req) {
  try {
    await connectDB();
    let profile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' }).lean();
    if (!profile) {
      profile = await BusinessProfile.create({ singletonKey: 'primary_business_profile' });
    }

    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const updated = await BusinessProfile.findOneAndUpdate(
      { singletonKey: 'primary_business_profile' },
      {
        $set: {
          ...body,
          singletonKey: 'primary_business_profile',
        },
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    invalidateSeoCache();
    invalidateCache(); // Clear in-memory DAL cache
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      success: true,
      message: 'Business profile saved successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update business profile' },
      { status: error.status || 500 }
    );
  }
}
