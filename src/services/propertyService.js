import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { FEATURED_PROPERTIES_DATA } from '@/constants';

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

    let properties = await Property.find(filter).lean().exec();

    // In-memory price range filtering
    if (minPrice || maxPrice) {
      const minNum = minPrice ? parseFloat(minPrice) * 10000000 : 0;
      const maxNum = maxPrice ? parseFloat(maxPrice) * 10000000 : Infinity;
      properties = properties.filter((p) => {
        const val = parsePriceToNumber(p.price);
        return val >= minNum && val <= maxNum;
      });
    }

    // Sorting
    if (sort === 'price_asc') {
      properties.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
    } else if (sort === 'price_desc') {
      properties.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
    } else if (sort === 'newest') {
      properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      properties.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    if (properties && properties.length > 0) {
      return JSON.parse(JSON.stringify(properties));
    }
    return FEATURED_PROPERTIES_DATA;
  } catch (error) {
    console.warn('[propertyService] Using fallback properties data:', error?.message);
    return FEATURED_PROPERTIES_DATA;
  }
}

export async function getPropertyById(id) {
  try {
    await connectDB();
    const property = await Property.findById(id).lean().exec();
    return property ? JSON.parse(JSON.stringify(property)) : null;
  } catch (error) {
    console.warn('[propertyService] getPropertyById fallback:', error?.message);
    return FEATURED_PROPERTIES_DATA.find(p => p._id === id || p.id === id) || null;
  }
}

export async function getPropertyBySlug(slug) {
  try {
    await connectDB();
    const property = await Property.findOne({ slug }).lean().exec();
    return property ? JSON.parse(JSON.stringify(property)) : null;
  } catch (error) {
    console.warn('[propertyService] getPropertyBySlug fallback:', error?.message);
    return FEATURED_PROPERTIES_DATA.find(p => p.slug === slug || p.id === slug) || null;
  }
}
