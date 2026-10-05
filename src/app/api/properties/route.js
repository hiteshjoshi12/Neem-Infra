import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isFeatured = searchParams.get('isFeatured');
    const all = searchParams.get('all');
    
    const filter = {};

    if (!all) {
      filter.isActive = true;
    }
    if (category) {
      filter.category = category;
    }
    if (isFeatured !== null) {
      filter.isFeatured = isFeatured === 'true';
    }

    const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const property = await Property.create(body);
    
    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      data: property
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

