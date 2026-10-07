import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { requireAdmin } from '@/lib/auth/authGuard';

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
      // Escape regex special chars
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

    let properties = await Property.find(filter).lean();

    // In-memory price range filtering (converting '₹5.75 Cr' to numeric)
    if (minPrice || maxPrice) {
      const minNum = minPrice ? parseFloat(minPrice) * 10000000 : 0;
      const maxNum = maxPrice ? parseFloat(maxPrice) * 10000000 : Infinity;
      properties = properties.filter((p) => {
        const val = parsePriceToNumber(p.price);
        return val >= minNum && val <= maxNum;
      });
    }

    // In-memory or database sorting
    if (sort === 'price_asc') {
      properties.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
    } else if (sort === 'price_desc') {
      properties.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
    } else if (sort === 'newest') {
      properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: order field then createdAt
      properties.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties
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
    const property = await Property.create(body);
    
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
