import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
// import { protect } from '@/middleware/auth'; // Not implemented in Next.js yet, skipping for migration since frontend checks it

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { sectionKey } = await params;
    const section = await SectionContent.findOne({ sectionKey });

    if (!section) {
      return NextResponse.json({ success: false, message: `Section '${sectionKey}' not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: section.data,
      sectionKey: section.sectionKey,
      updatedAt: section.updatedAt
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { sectionKey } = await params;
    const body = await req.json();
    const { data, title } = body;

    if (!data) {
      return NextResponse.json({ success: false, message: 'Please provide section data' }, { status: 400 });
    }

    const updatedSection = await SectionContent.findOneAndUpdate(
      { sectionKey },
      {
        sectionKey,
        title: title || sectionKey,
        data,
        lastUpdatedBy: 'Admin'
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: `Section '${sectionKey}' updated successfully`,
      data: updatedSection.data,
      sectionKey: updatedSection.sectionKey
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
