import 'server-only';
import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import BusinessProfile from '@/models/BusinessProfile';
import SectionContent from '@/models/SectionContent';
import Property from '@/models/Property';
import Testimonial from '@/models/Testimonial';
import Page from '@/models/Page';
import { DEFAULT_SECTIONS } from '@/constants/defaultSections';
import { PROPERTIES } from '@/constants/propertiesData';
import { DEFAULT_TESTIMONIALS_DATA } from '@/constants/homeData';
import { BUSINESS_INFO, SITE_URL } from '@/lib/seo/seoConfig';
import { getCached, setCached } from '@/lib/cache/apiCache';

/**
 * Server-Only Data Access Layer (DAL)
 * Guarantees single-source-of-truth from MongoDB with resilient in-memory caching and fallbacks.
 */

const DAL_TTL_MS = 20_000; // 20 seconds TTL

/**
 * Retrieve Global SEO Settings
 */
export async function getGlobalSettings() {
  const cacheKey = 'dal_global_settings';
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  try {
    await connectDB();
    const settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean();
    if (settings) {
      setCached(cacheKey, settings);
      return settings;
    }
  } catch (err) {
    console.error('[DAL] Error fetching SeoSettings:', err.message);
  }

  return {
    canonicalBaseUrl: SITE_URL,
    defaultMetaTitle: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
    organizationSchema: {
      name: BUSINESS_INFO.name,
      url: SITE_URL,
      telephone: BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
      email: BUSINESS_INFO.email,
    },
  };
}

/**
 * Retrieve Business Profile
 */
export async function getBusinessProfile() {
  const cacheKey = 'dal_business_profile';
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  try {
    await connectDB();
    const profile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' }).lean();
    if (profile) {
      setCached(cacheKey, profile);
      return profile;
    }
  } catch (err) {
    console.error('[DAL] Error fetching BusinessProfile:', err.message);
  }

  return {
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.name,
    primaryPhone: BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
    secondaryPhone: BUSINESS_INFO.phone?.[1] || '+91 98100 02447',
    whatsappNumber: BUSINESS_INFO.whatsapp || '+91 97185 11207',
    primaryEmail: BUSINESS_INFO.email,
    address: BUSINESS_INFO.address,
    socialLinks: BUSINESS_INFO.socialProfiles,
    foundingYear: BUSINESS_INFO.foundingYear || 1999,
    founders: (BUSINESS_INFO.founders || ['Raman Saudagar']).map((n) => ({ name: n })),
  };
}

/**
 * Retrieve All CMS Sections as a key-value dictionary, merged with DEFAULT_SECTIONS
 */
export async function getAllSections() {
  const cacheKey = 'dal_all_sections';
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  let mergedSections = { ...DEFAULT_SECTIONS };

  try {
    await connectDB();
    const sectionDocs = await SectionContent.find({}).lean();
    if (Array.isArray(sectionDocs) && sectionDocs.length > 0) {
      sectionDocs.forEach((doc) => {
        if (doc.sectionKey && doc.data) {
          mergedSections[doc.sectionKey] = doc.data;
        }
      });
    }
    setCached(cacheKey, mergedSections);
  } catch (err) {
    console.error('[DAL] Error fetching CMS Sections:', err.message);
  }

  return mergedSections;
}

/**
 * Retrieve Featured Properties for Landing and High-Priority Corridors
 */
export async function getFeaturedProperties(limit = 8) {
  const cacheKey = `dal_featured_properties_${limit}`;
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  try {
    await connectDB();
    const properties = await Property.find({ isFeatured: true, status: 'published' })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (Array.isArray(properties) && properties.length > 0) {
      // Clean Mongo IDs to string
      const sanitized = properties.map((p) => ({
        ...p,
        _id: String(p._id),
        id: p.id || String(p._id),
      }));
      setCached(cacheKey, sanitized);
      return sanitized;
    }
  } catch (err) {
    console.error('[DAL] Error fetching Featured Properties:', err.message);
  }

  // Resilient fallback to verified PROPERTIES constant
  const fallback = (PROPERTIES || []).slice(0, limit);
  return fallback;
}

/**
 * Retrieve All Active Testimonials
 */
export async function getTestimonials(limit = 10) {
  const cacheKey = `dal_testimonials_${limit}`;
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  try {
    await connectDB();
    const testimonials = await Testimonial.find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (Array.isArray(testimonials) && testimonials.length > 0) {
      const sanitized = testimonials.map((t) => ({
        ...t,
        _id: String(t._id),
        id: t.id || String(t._id),
      }));
      setCached(cacheKey, sanitized);
      return sanitized;
    }
  } catch (err) {
    console.error('[DAL] Error fetching Testimonials:', err.message);
  }

  return DEFAULT_TESTIMONIALS_DATA || [];
}

/**
 * Retrieve dynamic Page document by slug
 */
export async function getPageBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const cacheKey = `dal_page_${cleanSlug}`;
  const cached = getCached(cacheKey, DAL_TTL_MS);
  if (cached) return cached;

  try {
    await connectDB();
    const page = await Page.findOne({
      slug: { $in: [cleanSlug, cleanSlug.toLowerCase(), slug] },
      status: 'published',
    }).lean();

    if (page) {
      const sanitized = {
        ...page,
        _id: String(page._id),
      };
      setCached(cacheKey, sanitized);
      return sanitized;
    }
  } catch (err) {
    console.error(`[DAL] Error fetching Page for slug ${cleanSlug}:`, err.message);
  }

  return null;
}

/**
 * Complete Initial CMS Payload for Root Hydration
 */
export async function getInitialCmsPayload() {
  try {
    const [sections, properties, testimonials] = await Promise.all([
      getAllSections(),
      getFeaturedProperties(8),
      getTestimonials(10),
    ]);

    return {
      sections,
      properties,
      testimonials,
    };
  } catch (err) {
    console.error('[DAL] Error fetching initial CMS payload:', err.message);
    return {
      sections: DEFAULT_SECTIONS,
      properties: PROPERTIES || [],
      testimonials: DEFAULT_TESTIMONIALS_DATA || [],
    };
  }
}
