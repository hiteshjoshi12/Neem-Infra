import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Author from '@/models/Author';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PropertyType from '@/models/PropertyType';
import Location from '@/models/Location';
import { getCached, setCached } from '@/lib/cache/apiCache';

const CACHE_KEY = 'taxonomies_all';
const CACHE_TTL = 60_000; // 60 seconds — taxonomies change very rarely

export async function GET(req) {
  try {
    const cached = getCached(CACHE_KEY, CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'private, max-age=30',
          'X-Cache': 'HIT',
        }
      });
    }

    await connectDB();
    
    const [authors, categories, tags, locations, propertyTypes] = await Promise.all([
      Author.find().sort({ name: 1 }).lean(),
      Category.find().sort({ name: 1 }).lean(),
      Tag.find().sort({ name: 1 }).lean(),
      Location.find().sort({ name: 1 }).lean(),
      PropertyType.find().sort({ name: 1 }).lean()
    ]);

    const responsePayload = {
      success: true,
      data: {
        authors,
        categories,
        tags,
        locations,
        propertyTypes
      }
    };

    setCached(CACHE_KEY, responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'private, max-age=30',
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
