import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { FEATURED_PROPERTIES_DATA } from '@/constants';

export async function getProperties(options = {}) {
  try {
    await connectDB();
    
    const { category, isFeatured, all, limit } = options;
    const filter = {};

    if (!all) {
      filter.isActive = true;
    }
    if (category) {
      filter.category = category;
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    let query = Property.find(filter).sort({ order: 1, createdAt: -1 });
    if (limit) {
      query = query.limit(limit);
    }

    const properties = await query.lean().exec();
    
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

