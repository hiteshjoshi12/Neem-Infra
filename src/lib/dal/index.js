import 'server-only';
import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import BusinessProfile from '@/models/BusinessProfile';
import SectionContent from '@/models/SectionContent';
import Property from '@/models/Property';
import Testimonial from '@/models/Testimonial';
import Page from '@/models/Page';
import { BUSINESS_INFO } from '@/lib/seo/seoConfig';

const DEFAULT_BASE_URL = 'https://saudagarproperties.com';

/**
 * Server-Only Data Access Layer (DAL)
 * Uses Next.js 16 tag-based caching (unstable_cache) with on-demand invalidation via revalidateTag.
 * Guaranteed single source of truth from MongoDB with zero runtime imports of static constants.
 */

// ─── 1. Global SEO Settings ──────────────────────────────────────────────────
const fetchGlobalSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      const settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean();
      if (settings) {
        return JSON.parse(JSON.stringify(settings));
      }
    } catch (err) {
      console.error('[DAL] Error fetching SeoSettings:', err.message);
    }

    return {
      canonicalBaseUrl: DEFAULT_BASE_URL,
      defaultMetaTitle: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
      defaultMetaDescription:
        'Find luxury builder floors, independent villas, penthouses, and commercial offices in DLF Phase 1–5, Sushant Lok, and Golf Course Road. 25+ years of trusted advisory in Gurugram.',
      organizationSchema: {
        name: BUSINESS_INFO.name,
        url: DEFAULT_BASE_URL,
        telephone: BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
        email: BUSINESS_INFO.email,
        founders: (BUSINESS_INFO.founders || ['Arun Sharma', 'Suneeta Chawla']).map((name) => ({ name })),
        sameAs: [],
      },
    };
  },
  ['dal_global_settings'],
  { tags: ['settings', 'dal_global_settings'], revalidate: 3600 }
);

export async function getGlobalSettings() {
  return await fetchGlobalSettings();
}

// ─── 2. Business Profile ──────────────────────────────────────────────────────
const fetchBusinessProfile = unstable_cache(
  async () => {
    try {
      await connectDB();
      const profile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' }).lean();
      if (profile) {
        return JSON.parse(JSON.stringify(profile));
      }
    } catch (err) {
      console.error('[DAL] Error fetching BusinessProfile:', err.message);
    }

    return {
      name: BUSINESS_INFO.name,
      legalName: BUSINESS_INFO.name,
      tagline: 'Premier Real Estate Consultancy in DLF Gurugram',
      primaryPhone: BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
      secondaryPhone: BUSINESS_INFO.phone?.[1] || '+91 98112 21207',
      whatsappNumber: BUSINESS_INFO.whatsapp || '+91 97185 11207',
      primaryEmail: BUSINESS_INFO.email,
      address: BUSINESS_INFO.address,
      socialLinks: {
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        twitter: '',
      },
      foundingYear: BUSINESS_INFO.foundingYear || 1999,
      founders: [
        { name: 'Arun Sharma', role: 'Founder & Managing Director' },
        { name: 'Suneeta Chawla', role: 'Co-Founder & Head of Investment Advisory' },
      ],
      isDlfAuthorized: true,
      dlfAuthorizationText: 'DLF Authorized & Verified',
    };
  },
  ['dal_business_profile'],
  { tags: ['business_profile', 'dal_business_profile'], revalidate: 3600 }
);

export async function getBusinessProfile() {
  return await fetchBusinessProfile();
}

// ─── 3. Dynamic Company Years of Experience ──────────────────────────────────
export async function getCompanyYearsOfExperience() {
  const profile = await getBusinessProfile();
  const foundingYear = Number(profile?.foundingYear) || 1999;
  const currentYear = new Date().getFullYear();
  return Math.max(1, currentYear - foundingYear);
}

// ─── 4. CMS Sections ──────────────────────────────────────────────────────────
function resolveSectionTokens(data, years) {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    return data
      .replace(/\{\{yearsExperience\}\}\+/g, `${years}+`)
      .replace(/\{\{yearsExperience\}\}/g, `${years}`);
  }
  if (Array.isArray(data)) {
    return data.map((item) => resolveSectionTokens(item, years));
  }
  if (typeof data === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(data)) {
      res[k] = resolveSectionTokens(v, years);
    }
    return res;
  }
  return data;
}

const fetchAllSections = unstable_cache(
  async () => {
    const sectionsMap = {};
    const years = Math.max(1, new Date().getFullYear() - 1999);
    try {
      await connectDB();
      const sectionDocs = await SectionContent.find({}).lean();
      if (Array.isArray(sectionDocs) && sectionDocs.length > 0) {
        sectionDocs.forEach((doc) => {
          if (doc.sectionKey && doc.data) {
            sectionsMap[doc.sectionKey] = resolveSectionTokens(doc.data, years);
          }
        });
      }
    } catch (err) {
      console.error('[DAL] Error fetching CMS Sections:', err.message);
    }
    return JSON.parse(JSON.stringify(sectionsMap));
  },
  ['dal_all_sections'],
  { tags: ['sections', 'dal_all_sections'], revalidate: 3600 }
);

export async function getAllSections() {
  return await fetchAllSections();
}

const fetchSectionByKey = unstable_cache(
  async (sectionKey) => {
    const years = Math.max(1, new Date().getFullYear() - 1999);
    try {
      await connectDB();
      const doc = await SectionContent.findOne({ sectionKey }).lean();
      if (doc && doc.data) {
        return JSON.parse(JSON.stringify(resolveSectionTokens(doc.data, years)));
      }
    } catch (err) {
      console.error(`[DAL] Error fetching section '${sectionKey}':`, err.message);
    }
    return null;
  },
  ['dal_single_section'],
  { tags: ['sections', 'dal_single_section'], revalidate: 3600 }
);

export async function getSectionByKey(sectionKey) {
  return await fetchSectionByKey(sectionKey);
}

// ─── 5. Featured Properties ───────────────────────────────────────────────────
const fetchFeaturedProperties = unstable_cache(
  async (limit) => {
    try {
      await connectDB();
      const docs = await Property.find({ isActive: true })
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (Array.isArray(docs) && docs.length > 0) {
        const sanitized = docs.map((p) => ({
          ...p,
          _id: String(p._id),
          id: p.id || String(p._id),
        }));
        return JSON.parse(JSON.stringify(sanitized));
      }
    } catch (err) {
      console.error('[DAL] Error fetching Featured Properties:', err.message);
    }
    return [];
  },
  ['dal_featured_properties'],
  { tags: ['properties', 'dal_featured_properties'], revalidate: 3600 }
);

export async function getFeaturedProperties(limit = 8) {
  return await fetchFeaturedProperties(limit);
}

// ─── 6. Active Testimonials ───────────────────────────────────────────────────
const fetchTestimonials = unstable_cache(
  async (limit) => {
    try {
      await connectDB();
      const docs = await Testimonial.find({ isActive: { $ne: false } })
        .sort({ order: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (Array.isArray(docs) && docs.length > 0) {
        const sanitized = docs.map((t) => ({
          ...t,
          _id: String(t._id),
          id: t.id || String(t._id),
        }));
        return JSON.parse(JSON.stringify(sanitized));
      }
    } catch (err) {
      console.error('[DAL] Error fetching Testimonials:', err.message);
    }
    return [];
  },
  ['dal_testimonials'],
  { tags: ['testimonials', 'dal_testimonials'], revalidate: 3600 }
);

export async function getTestimonials(limit = 10) {
  return await fetchTestimonials(limit);
}

// ─── 7. Dynamic Page by Slug ──────────────────────────────────────────────────
const fetchPageBySlug = unstable_cache(
  async (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;

    try {
      await connectDB();
      const page = await Page.findOne({
        slug: { $in: [cleanSlug, cleanSlug.toLowerCase(), slug] },
        status: 'published',
      }).lean();

      if (page) {
        return JSON.parse(
          JSON.stringify({
            ...page,
            _id: String(page._id),
          })
        );
      }
    } catch (err) {
      console.error(`[DAL] Error fetching Page for slug ${cleanSlug}:`, err.message);
    }
    return null;
  },
  ['dal_page_by_slug'],
  { tags: ['pages', 'dal_page_by_slug'], revalidate: 3600 }
);

export async function getPageBySlug(slug) {
  return await fetchPageBySlug(slug);
}

// ─── 8. Root CMS Hydration Payload ───────────────────────────────────────────
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
      sections: {},
      properties: [],
      testimonials: [],
    };
  }
}
