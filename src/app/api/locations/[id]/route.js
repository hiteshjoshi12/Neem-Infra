import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Location from '@/models/Location';
import { requireAdmin } from '@/lib/auth/authGuard';
import { clearBlogCache } from '@/services/blogService';
import { revalidatePath } from 'next/cache';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const location = await Location.findById(id);

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const location = await Location.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    clearBlogCache();
    try {
      revalidatePath('/blog');
      revalidatePath('/blog/location');
      if (location.slug) revalidatePath(`/blog/location/${location.slug}`);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Location corridor updated successfully',
      data: location
    });
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    clearBlogCache();
    try {
      revalidatePath('/blog');
      revalidatePath('/blog/location');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Location corridor deleted successfully'
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
