import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';

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

export async function getProperties(options = {}) {
  try {
    await connectDB();
    
    const { category, location, search, bhk, sort, minPrice, maxPrice, isFeatured, all, limit } = options;
    const filter = {};

    if (!all) {
      filter.isActive = true;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
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
      // Filter by indexed priceNumeric with fallback
      filter.$or = [
        { priceNumeric: priceCond },
        { priceNumeric: { $in: [0, null] } }
      ];
    }

    let properties = await Property.find(filter).lean().exec();

    // In-memory price range verification for unindexed/legacy items
    if (minNum !== null || maxNum !== null) {
      const minVal = minNum ?? 0;
      const maxVal = maxNum ?? Infinity;
      properties = properties.filter((p) => {
        const val = p.priceNumeric || parsePriceToNumber(p.price);
        return val >= minVal && val <= maxVal;
      });
    }

    // Sorting
    if (sort === 'price_asc') {
      properties.sort((a, b) => (a.priceNumeric || parsePriceToNumber(a.price)) - (b.priceNumeric || parsePriceToNumber(b.price)));
    } else if (sort === 'price_desc') {
      properties.sort((a, b) => (b.priceNumeric || parsePriceToNumber(b.price)) - (a.priceNumeric || parsePriceToNumber(a.price)));
    } else if (sort === 'newest') {
      properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      properties.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return JSON.parse(JSON.stringify(properties || []));
  } catch (error) {
    console.error('[propertyService] Error fetching properties from MongoDB:', error?.message);
    return [];
  }
}

import mongoose from 'mongoose';

export async function getPropertyById(id) {
  try {
    await connectDB();
    let property = null;
    if (mongoose.isValidObjectId(id)) {
      property = await Property.findById(id).lean().exec();
    }
    if (property) return JSON.parse(JSON.stringify(property));
    return null;
  } catch (error) {
    console.error('[propertyService] getPropertyById error:', error?.message);
    return null;
  }
}

export async function getPropertyBySlug(slug) {
  try {
    await connectDB();
    let property = await Property.findOne({ slug }).lean().exec();
    if (!property && mongoose.isValidObjectId(slug)) {
      property = await Property.findById(slug).lean().exec();
    }
    if (property) return JSON.parse(JSON.stringify(property));
    return null;
  } catch (error) {
    console.error('[propertyService] getPropertyBySlug error:', error?.message);
    return null;
  }
}
