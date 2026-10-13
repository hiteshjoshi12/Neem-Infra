import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getCached, setCached, invalidateCache } from '@/lib/cache/apiCache';

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

export async function GET(req) {
  try {
    const cacheKey = `prop_cache_${req.url}`;
    const cached = getCached(cacheKey, 60000);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }

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

    let properties = await Property.find(filter).lean();

    // In-memory price range verification for unindexed/legacy items
    if (minNum !== null || maxNum !== null) {
      const minVal = minNum ?? 0;
      const maxVal = maxNum ?? Infinity;
      properties = properties.filter((p) => {
        const val = p.priceNumeric || parsePriceToNumber(p.price);
        return val >= minVal && val <= maxVal;
      });
    }

    // In-memory or database sorting
    if (sort === 'price_asc') {
      properties.sort((a, b) => (a.priceNumeric || parsePriceToNumber(a.price)) - (b.priceNumeric || parsePriceToNumber(b.price)));
    } else if (sort === 'price_desc') {
      properties.sort((a, b) => (b.priceNumeric || parsePriceToNumber(b.price)) - (a.priceNumeric || parsePriceToNumber(a.price)));
    } else if (sort === 'newest') {
      properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      properties.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    const responsePayload = {
      success: true,
      count: properties.length,
      data: properties
    };

    setCached(cacheKey, responsePayload);
    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
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
    invalidateCache('prop_cache');
    
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
