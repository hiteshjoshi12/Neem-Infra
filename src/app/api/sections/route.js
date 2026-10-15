import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { getCached, setCached } from '@/lib/cache/apiCache';

export async function GET() {
  try {
    await connectDB();
    const sections = await SectionContent.find({});
    
    const sectionMap = {};
    sections.forEach((item) => {
      sectionMap[item.sectionKey] = item.data;
    });

    const responsePayload = {
      success: true,
      data: sectionMap,
      raw: sections
    };
    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

