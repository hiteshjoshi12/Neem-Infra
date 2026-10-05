import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export async function GET() {
  try {
    await connectDB();
    const sections = await SectionContent.find({});
    
    const sectionMap = {};
    sections.forEach((item) => {
      sectionMap[item.sectionKey] = item.data;
    });

    return NextResponse.json({
      success: true,
      data: sectionMap,
      raw: sections
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

