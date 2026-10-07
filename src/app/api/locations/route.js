import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Location from '@/models/Location';
import { requireAdmin } from '@/lib/auth/authGuard';
import { clearBlogCache } from '@/services/blogService';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  try {
    await connectDB();
    const locations = await Location.find().sort({ name: 1 });
    return NextResponse.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const location = await Location.create(body);

    clearBlogCache();
    try {
      revalidatePath('/blog');
      revalidatePath('/blog/location');
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Location corridor created successfully',
        data: location
      },
      { status: 201 }
    );
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
