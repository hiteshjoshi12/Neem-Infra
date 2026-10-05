import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Server-side validation
    if (!body.email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const inquiry = await Inquiry.create(body);

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully',
      data: inquiry
    }, { status: 201 });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  // TODO: Add Auth check here
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

