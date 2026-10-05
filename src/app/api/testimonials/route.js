import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    
    const filter = all ? {} : { isActive: true };

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const testimonial = await Testimonial.create(body);
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

