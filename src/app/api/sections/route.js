import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { getCached, setCached } from '@/lib/cache/apiCache';

export async function GET() {
  try {
    const cached = getCached('cms_sections_all', 60000);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
        }
      });
    }

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

    setCached('cms_sections_all', responsePayload);
    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

