import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { requireAdmin } from '@/lib/auth/authGuard';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const inquiry = await Inquiry.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!inquiry) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
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
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
