import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BusinessProfile from '@/models/BusinessProfile';
import { requireAdmin } from '@/lib/auth/authGuard';
import { revalidateBusinessProfile } from '@/lib/cache/revalidateHelper';

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

    delete body._id;
    delete body.id;

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

    await revalidateBusinessProfile();

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
