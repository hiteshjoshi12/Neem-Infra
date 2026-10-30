import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getCached, setCached, invalidateCache } from '@/lib/cache/apiCache';
import { revalidateProperty } from '@/lib/cache/revalidateHelper';

/**
 * Helper to parse Indian currency strings like '₹5.75 Cr' or '₹85 Lakh' into numbers (in INR).
 */
function parsePriceToNumber(priceStr) {
  if (!priceStr) return 0;
  const str = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
  const crMatch = str.match(/([\d.]+)\s*cr/);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;
  const lakhMatch = str.match(/([\d.]+)\s*(?:lakh|lac)/);
  if (lakhMatch) return parseFloat(lakhMatch[1]) * 100000;
  const rawNum = parseFloat(str);
  return isNaN(rawNum) ? 0 : rawNum;
}

function normalizeArrayField(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

function generateSlug(title) {
  if (!title) return `property-${Date.now().toString(36)}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const CACHE_TTL = 15_000; // 15 seconds for property listings

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const bhk = searchParams.get('bhk');
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const all = searchParams.get('all');
    
    // Build a cache key from significant query params
    const cacheKey = `props:${all || ''}:${category || ''}:${location || ''}:${search || ''}:${bhk || ''}:${isFeatured || ''}:${sort || ''}:${minPrice || ''}:${maxPrice || ''}`;
    const cached = getCached(cacheKey, CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'private, max-age=10',
          'X-Cache': 'HIT',
        }
      });
    }

    const filter = {};

    if (!all) {
      filter.isActive = true;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (isFeatured !== null && isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }
    if (location && location !== 'all') {
      const safeLoc = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.location = { $regex: safeLoc, $options: 'i' };
    }
    if (bhk && bhk !== 'all') {
      const safeBhk = bhk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.specs = { $regex: safeBhk, $options: 'i' };
    }
    if (search) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { location: { $regex: safeSearch, $options: 'i' } },
        { specs: { $regex: safeSearch, $options: 'i' } },
        { desc: { $regex: safeSearch, $options: 'i' } },
        { tag: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    const minNum = minPrice ? parseFloat(minPrice) * 10000000 : null;
    const maxNum = maxPrice ? parseFloat(maxPrice) * 10000000 : null;

    if (minNum !== null || maxNum !== null) {
      const priceCond = {};
      if (minNum !== null) priceCond.$gte = minNum;
      if (maxNum !== null) priceCond.$lte = maxNum;
      filter.$or = [
        { priceNumeric: priceCond },
        { priceNumeric: { $in: [0, null] } }
      ];
    }

    // Determine MongoDB sort to push sorting to the database instead of in-memory
    let dbSort = {};
    if (sort === 'price_asc') {
      dbSort = { priceNumeric: 1 };
    } else if (sort === 'price_desc') {
      dbSort = { priceNumeric: -1 };
    } else if (sort === 'newest') {
      dbSort = { createdAt: -1 };
    } else {
      dbSort = { order: 1, createdAt: -1 };
    }

    let properties = await Property.find(filter).sort(dbSort).lean();

    // In-memory price range verification for unindexed/legacy items
    if (minNum !== null || maxNum !== null) {
      const minVal = minNum ?? 0;
      const maxVal = maxNum ?? Infinity;
      properties = properties.filter((p) => {
        const val = p.priceNumeric || parsePriceToNumber(p.price);
        return val >= minVal && val <= maxVal;
      });
    }

    const responsePayload = {
      success: true,
      count: properties.length,
      data: properties
    };

    setCached(cacheKey, responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'private, max-age=10',
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    if (!body.slug || !body.slug.trim()) {
      body.slug = generateSlug(body.title);
    } else {
      body.slug = generateSlug(body.slug);
    }

    // Normalize array fields
    if (body.features !== undefined) body.features = normalizeArrayField(body.features);
    if (body.nearbyLandmarks !== undefined) body.nearbyLandmarks = normalizeArrayField(body.nearbyLandmarks);
    if (body.images !== undefined) body.images = normalizeArrayField(body.images);

    const property = await Property.create(body);
    await revalidateProperty(property);
    
    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      data: property
    }, { status: 201 });
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
