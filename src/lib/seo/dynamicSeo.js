import { connectDB } from '@/lib/mongodb';
import SeoSettings from '@/models/SeoSettings';
import Page from '@/models/Page';
import { SITE_NAME, PAGE_SEO, BREADCRUMBS, DEFAULT_META } from './seoConfig';
import { normalizePath, formatMetaDescription, resolveYearsToken } from './metadataHelper';

// Short-lived in-memory caches to guarantee fast sub-millisecond responses on hot requests
let cachedSettings = null;
let settingsCacheExpiry = 0;

let cachedPagesMap = new Map();
let pagesCacheExpiry = 0;

const CACHE_TTL_MS = 15_000; // 15 seconds

export function invalidateSeoCache() {
  cachedSettings = null;
  settingsCacheExpiry = 0;
  cachedPagesMap.clear();
  pagesCacheExpiry = 0;
}

/**
 * Initializes default global SEO settings and core pages if MongoDB is fresh
 */
export async function ensureDefaultSeoData() {
  try {
    await connectDB();

    // 1. Ensure Global SeoSettings
    let settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
    if (!settings) {
      settings = await SeoSettings.create({
        singletonKey: 'global_seo_settings',
        siteTitleTemplate: '%s | Saudagar Properties',
        defaultMetaTitle: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
        defaultMetaDescription:
          'Find luxury builder floors, independent villas, penthouses, and commercial offices in DLF Phase 1–5, Sushant Lok, and Golf Course Road. 25+ years of trusted advisory in Gurugram.',
        defaultOgImage: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/og-default.jpg',
        defaultKeywords: [
          'Real Estate Consultant Gurugram',
          'DLF Phase 1-5 Builder Floors',
          'Luxury Villas Gurgaon',
          'Commercial Office Lease Cyber City',
          'Saudagar Properties'
        ],
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
        googleTagManagerId: '',
        googleSearchConsoleCode: '',
        enableGa4: true,
        enableGtm: true,
        enableGsc: true,
        robotsTxtMode: 'standard',
        robotsTxtCustomRules: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n`,
      });
    }

    // 2. Ensure Core Pages in Page collection (atomic upsert per slug)
    const defaultBaseUrl = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');
    const initialPages = [
        {
          title: 'Homepage',
          slug: '/',
          pageType: 'system',
          status: 'published',
          h1: 'Premier Real Estate Consultancy in DLF Gurugram',
          h2: '25+ Years of Dedicated Authority in Luxury Builder Floors, Independent Villas & Corporate Assets',
          metaTitle: PAGE_SEO['/']?.title || 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
          metaDescription: PAGE_SEO['/']?.description || '',
          canonicalUrl: defaultBaseUrl,
          focusKeywords: ['Real Estate Consultant Gurugram', 'DLF Phase 1-5 Builder Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/']?.title,
          ogDescription: PAGE_SEO['/']?.description,
          breadcrumbs: BREADCRUMBS['/'] || [{ name: 'Home', url: '/' }],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'About Us',
          slug: '/about',
          pageType: 'system',
          status: 'published',
          h1: 'Quarter-Century Leadership Narrative in DLF Gurugram',
          h2: 'Founded in 1999 — Fiduciary Real Estate Advisory Built on Generational Trust & Uncompromising Ethics',
          metaTitle: PAGE_SEO['/about']?.title || 'About Us — Saudagar Properties',
          metaDescription: PAGE_SEO['/about']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/about`,
          focusKeywords: ['About Saudagar Properties', 'DLF Real Estate Leadership'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/about']?.title,
          ogDescription: PAGE_SEO['/about']?.description,
          breadcrumbs: BREADCRUMBS['/about'] || [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about' }],
          schemaType: 'AboutPage',
        },
        {
          title: 'Leadership & Team',
          slug: '/team',
          pageType: 'system',
          status: 'published',
          h1: 'Visionary Founders & Senior Real Estate Advisory Principals',
          h2: 'Decades of Micro-Market Mastery Guiding Ultra-High-Net-Worth Individuals & Corporate Entities',
          metaTitle: PAGE_SEO['/team']?.title || 'Leadership & Real Estate Advisory Team | Saudagar Properties',
          metaDescription: PAGE_SEO['/team']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/team`,
          focusKeywords: ['Saudagar Properties Founders', 'Arun Sharma', 'Suneeta Chawla'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/team']?.title,
          ogDescription: PAGE_SEO['/team']?.description,
          breadcrumbs: BREADCRUMBS['/team'] || [{ name: 'Home', url: '/' }, { name: 'Our Team', url: '/team' }],
          schemaType: 'AboutPage',
        },
        {
          title: 'Contact Us',
          slug: '/contact',
          pageType: 'system',
          status: 'published',
          h1: 'Private Real Estate Consultation & Client Advisory Desks',
          h2: 'Direct Access to Senior Partners for Acquisitions, Divestments & Corporate Real Estate Structuring',
          metaTitle: PAGE_SEO['/contact']?.title || 'Contact Us — Saudagar Properties',
          metaDescription: PAGE_SEO['/contact']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/contact`,
          focusKeywords: ['Contact Saudagar Properties', 'DLF Phase 2 Real Estate Office'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/contact']?.title,
          ogDescription: PAGE_SEO['/contact']?.description,
          breadcrumbs: BREADCRUMBS['/contact'] || [{ name: 'Home', url: '/' }, { name: 'Contact Us', url: '/contact' }],
          schemaType: 'ContactPage',
        },
        {
          title: 'Properties Catalog',
          slug: '/properties',
          pageType: 'system',
          status: 'published',
          h1: 'Curated Luxury Residences & Commercial Assets in DLF Gurugram',
          h2: '100% Freehold Title-Verified Builder Floors, Villas, Penthouse Typologies & Grade-A Offices',
          metaTitle: 'Luxury Properties & Builder Floors DLF Gurugram | Saudagar Properties',
          metaDescription:
            'Explore verified ready-to-move luxury builder floors, kothis, and commercial spaces across DLF Phase 1–5, Sushant Lok, and Golf Course Road.',
          canonicalUrl: `${defaultBaseUrl}/properties`,
          focusKeywords: ['Luxury Builder Floors', 'DLF Phase 1-5 Properties'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: 'Luxury Properties & Builder Floors DLF Gurugram',
          ogDescription: 'Explore verified ready-to-move luxury builder floors across DLF Phase 1–5.',
          breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Properties', url: '/properties' }],
          schemaType: 'WebPage',
        },
        {
          title: 'Residential Services',
          slug: '/services/residential',
          pageType: 'service',
          status: 'published',
          h1: 'Luxury Builder Floors, Bespoke Penthouses & Villas in DLF Phase 1–5',
          h2: 'Strategic Micro-Market Intelligence, 7-Point Due Diligence & Bespoke Acquisition Advisory',
          metaTitle: PAGE_SEO['/services/residential']?.title || 'Luxury Residential Properties in DLF Gurugram',
          metaDescription: PAGE_SEO['/services/residential']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/services/residential`,
          focusKeywords: ['Luxury Builder Floors DLF', 'Residential Real Estate Gurugram'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/services/residential']?.title,
          ogDescription: PAGE_SEO['/services/residential']?.description,
          breadcrumbs: BREADCRUMBS['/services/residential'] || [
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/#services' },
            { name: 'Residential Real Estate', url: '/services/residential' }
          ],
          schemaType: 'WebPage',
        },
        {
          title: 'Commercial Services',
          slug: '/services/commercial',
          pageType: 'service',
          status: 'published',
          h1: 'Corporate Offices, High-Street Retail & Pre-Leased Assets in Cyber City & Golf Course Rd',
          h2: 'Grade-A Commercial Space Leasing, High-Yield Investment Portfolios & Institutional Due Diligence',
          metaTitle: PAGE_SEO['/services/commercial']?.title || 'Commercial Real Estate in DLF Gurugram',
          metaDescription: PAGE_SEO['/services/commercial']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/services/commercial`,
          focusKeywords: ['Commercial Real Estate Gurugram', 'Cyber City Office Space', 'Golf Course Road Offices'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/services/commercial']?.title,
          ogDescription: PAGE_SEO['/services/commercial']?.description,
          breadcrumbs: BREADCRUMBS['/services/commercial'] || [
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/#services' },
            { name: 'Commercial Real Estate', url: '/services/commercial' }
          ],
          schemaType: 'WebPage',
        },
        {
          title: 'Industrial & Logistics Services',
          slug: '/services/industrial',
          pageType: 'service',
          status: 'published',
          h1: 'HSIIDC Plots, Warehousing Hubs & Industrial Land Parcels in NCR Corridors',
          h2: 'Compliance Roadmaps, Build-To-Suit Engineering Standards & Regulatory Clearance Assistance',
          metaTitle: PAGE_SEO['/services/industrial']?.title || 'Industrial Real Estate in Gurugram & Udyog Vihar',
          metaDescription: PAGE_SEO['/services/industrial']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/services/industrial`,
          focusKeywords: ['Industrial Land Gurgaon', 'Udyog Vihar Warehouse', 'HSIIDC Industrial Plots'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/services/industrial']?.title,
          ogDescription: PAGE_SEO['/services/industrial']?.description,
          breadcrumbs: BREADCRUMBS['/services/industrial'] || [
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/#services' },
            { name: 'Industrial Real Estate', url: '/services/industrial' }
          ],
          schemaType: 'WebPage',
        },
        {
          title: 'Real Estate Journal (Blog)',
          slug: '/blog',
          pageType: 'system',
          status: 'published',
          h1: 'The Gurugram Real Estate Journal & Market Research',
          h2: 'Quarterly Price Benchmarks, Infrastructure Deep-Dives & Regulatory Guidance for HNWIs and NRIs',
          metaTitle: PAGE_SEO['/blog']?.title || 'The Gurugram Real Estate Journal | Saudagar Properties',
          metaDescription: PAGE_SEO['/blog']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/blog`,
          focusKeywords: ['Gurugram Real Estate News', 'DLF Phase 1-5 Market Trends'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          ogTitle: PAGE_SEO['/blog']?.title,
          ogDescription: PAGE_SEO['/blog']?.description,
          breadcrumbs: BREADCRUMBS['/blog'] || [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }],
          schemaType: 'WebPage',
        },
        {
          title: 'DLF Phase 1 Corridor',
          slug: '/property/dlf-phase-1',
          pageType: 'corridor',
          status: 'published',
          h1: 'Luxury Builder Floors & Independent Villas in DLF Phase 1 Gurugram',
          h2: 'Prime Heritage Enclave Adjacent to Golf Course Road & MG Road Metro',
          metaTitle: 'Best Property in DLF Phase 1 | Saudagar Properties Gurugram',
          metaDescription: 'Explore luxury builder floors, kothis, and residential plots in DLF Phase 1 Gurugram with Saudagar Properties.',
          canonicalUrl: `${defaultBaseUrl}/property/dlf-phase-1`,
          focusKeywords: ['Best Property in DLF Phase 1', 'DLF Phase 1 Gurgaon Builder Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'DLF Phase 1', url: '/property/dlf-phase-1' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'DLF Phase 2 Corridor',
          slug: '/property/dlf-phase-2',
          pageType: 'corridor',
          status: 'published',
          h1: 'Luxury Builder Floors & Residences in DLF Phase 2 Gurugram',
          h2: 'Strategic Connectivity to Cyber City, NH-8 & Delhi Border',
          metaTitle: 'Best Property in DLF Phase 2 | Saudagar Properties Gurugram',
          metaDescription: 'Explore luxury builder floors, kothis, and residential plots in DLF Phase 2 Gurugram with Saudagar Properties.',
          canonicalUrl: `${defaultBaseUrl}/property/dlf-phase-2`,
          focusKeywords: ['Best Property in DLF Phase 2', 'DLF Phase 2 Gurugram Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'DLF Phase 2', url: '/property/dlf-phase-2' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'DLF Phase 3 Corridor',
          slug: '/property/dlf-phase-3',
          pageType: 'corridor',
          status: 'published',
          h1: 'Turnkey Residential Floors & High-Rental Yield Assets in DLF Phase 3',
          h2: 'Immediate Proximity to Cyber Hub, Ambience Mall & Moulsari Avenue',
          metaTitle: 'Best Property in DLF Phase 3 | Saudagar Properties Gurugram',
          metaDescription: 'Explore verified residential builder floors and plots in DLF Phase 3 Gurugram.',
          canonicalUrl: `${defaultBaseUrl}/property/dlf-phase-3`,
          focusKeywords: ['Best Property in DLF Phase 3', 'Cyber Hub Proximity Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'DLF Phase 3', url: '/property/dlf-phase-3' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'DLF Phase 4 Corridor',
          slug: '/property/dlf-phase-4',
          pageType: 'corridor',
          status: 'published',
          h1: 'Bespoke Luxury Builder Floors & Kothis in DLF Phase 4 Gurugram',
          h2: 'Central Gurugram Location Near Galleria Market & Sector 28 Metro',
          metaTitle: 'Best Property in DLF Phase 4 | Saudagar Properties Gurugram',
          metaDescription: 'Explore luxury builder floors and park-facing residences in DLF Phase 4 Gurugram.',
          canonicalUrl: `${defaultBaseUrl}/property/dlf-phase-4`,
          focusKeywords: ['Best Property in DLF Phase 4', 'Galleria Market Luxury Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'DLF Phase 4', url: '/property/dlf-phase-4' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'Sushant Lok Corridor',
          slug: '/property/shushant-lok',
          pageType: 'corridor',
          status: 'published',
          h1: 'Luxury Builder Floors & Spacious Kothis in Sushant Lok 1 Gurugram',
          h2: 'Tranquil Residential Enclave with Mature Tree-Lined Avenues & Top Healthcare',
          metaTitle: 'Best Property in Sushant Lok | Saudagar Properties Gurugram',
          metaDescription: 'Explore luxury builder floors, kothis, and residential plots in Sushant Lok Gurugram.',
          canonicalUrl: `${defaultBaseUrl}/property/shushant-lok`,
          focusKeywords: ['Best Property in Sushant Lok', 'Sushant Lok 1 Gurgaon Floors'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'Sushant Lok', url: '/property/shushant-lok' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'Udyog Vihar Corridor',
          slug: '/property/udyog-vihar',
          pageType: 'corridor',
          status: 'published',
          h1: 'Industrial Land, Warehousing & Corporate Offices in Udyog Vihar',
          h2: 'NCR’s Flagship Commercial & Industrial District Bordering Delhi on NH-8',
          metaTitle: 'Best Property in Udyog Vihar | Saudagar Properties Gurugram',
          metaDescription: 'Explore industrial plots, commercial offices, and warehousing in Udyog Vihar Gurugram.',
          canonicalUrl: `${defaultBaseUrl}/property/udyog-vihar`,
          focusKeywords: ['Best Property in Udyog Vihar', 'Udyog Vihar Industrial Plots'],
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: 'Udyog Vihar', url: '/property/udyog-vihar' }
          ],
          schemaType: 'RealEstateAgent',
        },
        {
          title: 'Terms of Service',
          slug: '/terms',
          pageType: 'system',
          status: 'published',
          h1: 'Advisory Terms of Engagement & Website Usage Agreement',
          h2: 'Official Legal Protocols, Due Diligence Disclaimers & Professional Disclosures',
          metaTitle: PAGE_SEO['/terms']?.title || 'Terms of Service — Saudagar Properties',
          metaDescription: PAGE_SEO['/terms']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/terms`,
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: BREADCRUMBS['/terms'] || [{ name: 'Home', url: '/' }, { name: 'Terms of Service', url: '/terms' }],
          schemaType: 'WebPage',
        },
        {
          title: 'Privacy Policy',
          slug: '/privacy-policy',
          pageType: 'system',
          status: 'published',
          h1: 'HNWI Confidentiality & Data Protection Governance',
          h2: 'Commitment to Client Privacy, Secure Handling of Property Documentation & Statutory Compliance',
          metaTitle: PAGE_SEO['/privacy-policy']?.title || 'Privacy Policy — Saudagar Properties',
          metaDescription: PAGE_SEO['/privacy-policy']?.description || '',
          canonicalUrl: `${defaultBaseUrl}/privacy-policy`,
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          breadcrumbs: BREADCRUMBS['/privacy-policy'] || [{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy-policy' }],
          schemaType: 'WebPage',
        },
      ];

      const operations = initialPages.map(page => ({
        updateOne: {
          filter: { slug: page.slug },
          update: { $setOnInsert: page },
          upsert: true,
        }
      }));
      await Page.bulkWrite(operations, { ordered: false });
    } catch (err) {
    console.warn('[ensureDefaultSeoData] Error initializing SEO defaults:', err?.message);
  }
}

/**
 * Returns global SEO settings with in-memory caching
 */
export async function getGlobalSeoSettings() {
  const now = Date.now();
  if (cachedSettings && now < settingsCacheExpiry) {
    return cachedSettings;
  }

  try {
    await connectDB();
    let settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean();
    if (!settings) {
      await ensureDefaultSeoData();
      settings = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean();
    }
    cachedSettings = settings || null;
    settingsCacheExpiry = now + CACHE_TTL_MS;
    return cachedSettings;
  } catch (err) {
    console.warn('[getGlobalSeoSettings] Database lookup error:', err?.message);
    return null;
  }
}

/**
 * Fetches dynamic Page document by slug/path
 */
export async function getDynamicPageRecord(path = '/') {
  const norm = normalizePath(path);
  const now = Date.now();

  if (cachedPagesMap.has(norm) && now < pagesCacheExpiry) {
    return cachedPagesMap.get(norm);
  }

  try {
    await connectDB();
    let page = await Page.findOne({ slug: norm }).lean();

    // Fallback if slug without leading slash or with corridor variations
    if (!page && norm !== '/') {
      const stripped = norm.replace(/^\//, '');
      page = await Page.findOne({
        $or: [
          { slug: stripped },
          { slug: `/${stripped}` },
          { slug: norm }
        ]
      }).lean();
    }

    if (page) {
      cachedPagesMap.set(norm, page);
      if (pagesCacheExpiry <= now) {
        pagesCacheExpiry = now + CACHE_TTL_MS;
      }
    }
    return page;
  } catch (err) {
    console.warn(`[getDynamicPageRecord] Error loading page '${path}':`, err?.message);
    return null;
  }
}

/**
 * Generates dynamic Next.js Metadata for any page
 * Respects admin customizations immediately without code changes!
 */
export async function getDynamicPageSeo(path = '/', fallbackData = {}) {
  const norm = normalizePath(path);
  const [pageDoc, settings] = await Promise.all([
    getDynamicPageRecord(norm),
    getGlobalSeoSettings(),
  ]);

  const siteTitleTemplate = settings?.siteTitleTemplate || '%s | Saudagar Properties';
  const defaultMetaTitle = settings?.defaultMetaTitle || 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram';
  const defaultMetaDesc = settings?.defaultMetaDescription || DEFAULT_META.description;
  const defaultOgImg = settings?.defaultOgImage || DEFAULT_META.ogImage;

  // Resolve Title
  let rawTitle = pageDoc?.metaTitle || fallbackData.title || PAGE_SEO[norm]?.title || defaultMetaTitle;
  rawTitle = resolveYearsToken(rawTitle);
  if (!rawTitle.includes(SITE_NAME) && !rawTitle.includes('Saudagar')) {
    rawTitle = `${rawTitle} | ${SITE_NAME}`;
  }

  // Resolve Description
  const rawDesc = pageDoc?.metaDescription || fallbackData.description || PAGE_SEO[norm]?.description || defaultMetaDesc;
  const description = resolveYearsToken(formatMetaDescription(rawDesc));

  // Resolve Canonical URL strictly from settings.canonicalBaseUrl
  const baseUrl = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');
  let canonical = pageDoc?.canonicalUrl || fallbackData.canonical || PAGE_SEO[norm]?.canonical || norm;
  if (canonical.startsWith('http')) {
    try {
      const u = new URL(canonical);
      const cleanPath = u.pathname.length > 1 && u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname;
      canonical = cleanPath === '/' ? baseUrl : `${baseUrl}${cleanPath}`;
    } catch {
      canonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
    }
  } else {
    const cleanNorm = norm.length > 1 && norm.endsWith('/') ? norm.slice(0, -1) : norm;
    canonical = cleanNorm === '/' ? baseUrl : `${baseUrl}${cleanNorm}`;
  }

  // Resolve Robots Directives
  const isIndex = pageDoc?.robots ? pageDoc.robots.index !== false : true;
  const isFollow = pageDoc?.robots ? pageDoc.robots.follow !== false : true;
  const isNoarchive = pageDoc?.robots?.noarchive || false;
  const isNosnippet = pageDoc?.robots?.nosnippet || false;

  const robots = {
    index: isIndex,
    follow: isFollow,
    nocache: !isIndex,
    googleBot: {
      index: isIndex,
      follow: isFollow,
      ...(isNoarchive ? { noarchive: true } : {}),
      ...(isNosnippet ? { nosnippet: true } : {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }),
    },
  };

  // Open Graph Image & Alt
  const ogImage = pageDoc?.ogImage || fallbackData.image || defaultOgImg;
  const ogImageAlt = pageDoc?.ogImageAlt || pageDoc?.metaTitle || rawTitle;

  // Open Graph & Twitter Objects
  const ogTitle = resolveYearsToken(pageDoc?.ogTitle || rawTitle);
  const ogDescription = resolveYearsToken(pageDoc?.ogDescription || description);
  const ogType = pageDoc?.ogType || fallbackData.ogType || 'website';
  const twitterCard = pageDoc?.twitterCard || 'summary_large_image';

  // Keywords
  const keywords = pageDoc?.focusKeywords?.length
    ? pageDoc.focusKeywords
    : (fallbackData.keywords || settings?.defaultKeywords || []);

  const metaResult = {
    title: { absolute: rawTitle },
    description,
    alternates: {
      canonical,
    },
    robots,
    keywords: keywords.length ? keywords : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: ogType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };

  // Inject verification if configured and enabled
  if (settings?.enableGsc && settings?.googleSearchConsoleCode) {
    metaResult.verification = {
      google: settings.googleSearchConsoleCode.replace(/^google-site-verification=/, ''),
    };
  }

  return metaResult;
}

/**
 * Returns dynamic breadcrumbs from DB or fallback
 */
export async function getDynamicBreadcrumbs(path = '/') {
  const norm = normalizePath(path);
  const pageDoc = await getDynamicPageRecord(norm);
  if (pageDoc?.breadcrumbs && pageDoc.breadcrumbs.length > 0) {
    return pageDoc.breadcrumbs;
  }
  return BREADCRUMBS[norm] || [{ name: 'Home', url: '/' }];
}
