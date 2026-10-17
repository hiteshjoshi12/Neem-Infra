import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth/authGuard';
import { invalidateCache } from '@/lib/cache/apiCache';

function normalizeArrayField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.features !== undefined) body.features = normalizeArrayField(body.features);
    if (body.nearbyLandmarks !== undefined) body.nearbyLandmarks = normalizeArrayField(body.nearbyLandmarks);
    if (body.images !== undefined) body.images = normalizeArrayField(body.images);
    
    const property = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    invalidateCache('props');

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    invalidateCache('props');

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
