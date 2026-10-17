import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { getCached, setCached } from '@/lib/cache/apiCache';

const CACHE_KEY = 'pages_all';
const CACHE_TTL = 30_000; // 30 seconds

export async function GET(req) {
  try {
    const cached = getCached(CACHE_KEY, CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'private, max-age=15',
          'X-Cache': 'HIT',
        }
      });
    }

    await connectDB();
    const records = await SectionContent.find({}).lean();
    
    const pageMap = {};
    records.forEach((item) => {
      pageMap[item.sectionKey] = item.data;
    });

    const responsePayload = {
      success: true,
      data: pageMap,
      raw: records
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
