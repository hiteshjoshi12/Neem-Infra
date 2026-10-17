import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { getCached, setCached } from '@/lib/cache/apiCache';

const CACHE_KEY = 'sections_all';
const CACHE_TTL = 30_000; // 30 seconds

export async function GET(req) {
  try {
    // Check for fresh=1 param to bypass cache
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('fresh') === '1';
    
    if (!forceFresh) {
      const cached = getCached(CACHE_KEY, CACHE_TTL);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'private, max-age=15',
            'X-Cache': 'HIT',
          }
        });
      }
    }

    await connectDB();
    const sections = await SectionContent.find({}).lean();
    
    const sectionMap = {};
    sections.forEach((item) => {
      sectionMap[item.sectionKey] = item.data;
    });

    const responsePayload = {
      success: true,
      data: sectionMap,
      raw: sections
    };

    setCached(CACHE_KEY, responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'private, max-age=15',
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

