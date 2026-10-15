import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { getCached, setCached } from '@/lib/cache/apiCache';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isFresh = url.searchParams.get('fresh') === '1';

    if (!isFresh) {
      const cached = getCached('cms_sections_all', 15000); // 15 sec server cache
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache'
          }
        });
      }
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
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

