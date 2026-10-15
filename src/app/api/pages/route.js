import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export async function GET() {
  try {
    await connectDB();
    const records = await SectionContent.find({});
    
    const pageMap = {};
    records.forEach((item) => {
      pageMap[item.sectionKey] = item.data;
    });

    return NextResponse.json({
      success: true,
      data: pageMap,
      raw: records
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
