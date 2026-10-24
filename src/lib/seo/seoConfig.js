/**
 * SEO Configuration — Single Source of Truth
 * ============================================
 * All site-wide SEO defaults, business entity information,
 * and per-page metadata are defined here.
 * Canonical host is configured via SeoSettings.canonicalBaseUrl.
 * TODO: Update social profile URLs with real accounts.
 */

// ─── Site-Wide Constants ────────────────────────────────────────────────
export const SITE_NAME = 'Saudagar Properties';
export const SITE_LEGAL_NAME = 'Saudagar Properties Pvt. Ltd.';
export const DEFAULT_LOCALE = 'en_IN';
export const DEFAULT_LANGUAGE = 'en';

// ─── Business Entity Information (NAP + Identity) ───────────────────────
export const BUSINESS_INFO = {
  name: 'Saudagar Properties',
  shortName: 'Saudagar Properties',
  description:
    'Premier real estate consultancy in Gurugram specializing in luxury builder floors, independent villas, commercial offices, and industrial properties across DLF Phase 1–5, Sushant Lok, Golf Course Road, and Udyog Vihar.',
  foundingYear: 1999,
  founders: ['Mr. Arun Sharma', 'Mrs. Suneeta Chawla'],
  address: {
    streetAddress: '38, Akashneem Marg, DLF Phase 2',
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    postalCode: '122002',
    addressCountry: 'IN',
    full: '38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002',
  },
  geo: {
    latitude: 28.4847851,
    longitude: 77.0842655,
  },
  phone: ['+91 97185 11207', '+91 98112 21207'],
  email: 'Saudagar.Properties@Yahoo.In',
  url: 'https://saudagarproperties.com',
  logo: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?tr=f-auto,q-80',
  socialProfiles: {
    facebook: '',
    instagram: '',
    pinterest: '',
    linkedin: '',
    youtube: '',
  },
  areaServed: [
    'Gurugram',
    'Gurgaon',
    'DLF Phase 1',
    'DLF Phase 2',
    'DLF Phase 3',
    'DLF Phase 4',
    'DLF Phase 5',
    'Sushant Lok',
    'Golf Course Road',
    'Golf Course Extension',
    'Udyog Vihar',
    'Cyber City',
    'Dwarka Expressway',
  ],
  services: [
    'Luxury Residential Advisory',
    'Commercial Real Estate Consulting',
    'Industrial Property Solutions',
    'Property Investment Advisory',
    'End-to-End Transaction Support',
  ],
};

// ─── Default Meta Tags ─────────────────────────────────────────────────
export const DEFAULT_META = {
  title: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
  description:
    'Saudagar Properties is a trusted real estate consultancy in Gurugram with 25+ years of experience. Explore luxury builder floors, villas, commercial offices, and plots in DLF Phase 1–5, Sushant Lok, and Golf Course Road.',
  ogType: 'website',
  ogImage: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?updatedAt=1792302925853', // Place an OG image (1200×630px)
  twitterCard: 'summary_large_image',
};

// ─── Per-Page SEO Configuration ─────────────────────────────────────────
export const PAGE_SEO = {
  '/': {
    title: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
    description:
      'Find luxury builder floors, independent villas, penthouses, and commercial offices in DLF Phase 1–5, Sushant Lok, and Golf Course Road. Saudagar Properties — 25+ years of trusted real estate advisory in Gurugram.',
    canonical: '/',
    ogType: 'website',
  },
  '/about': {
    title: 'About Us — Saudagar Properties | 25+ Years of Real Estate Excellence in Gurugram',
    description:
      'Learn about Saudagar Properties — founded in 1999, we are Gurugram\'s most trusted real estate consultancy. Meet our leadership team and discover our commitment to transparent, client-first property advisory.',
    canonical: '/about',
    ogType: 'website',
  },
  '/team': {
    title: 'Leadership & Real Estate Advisory Team | Saudagar Properties Gurugram',
    description:
      'Meet the leadership, founders, and senior luxury real estate specialists behind Saudagar Properties with 25+ years of authority in DLF Phase 1–5.',
    canonical: '/team',
    ogType: 'website',
  },
  '/contact': {
    title: 'Contact Us — Saudagar Properties | DLF Gurugram Real Estate',
    description:
      'Get in touch with Saudagar Properties for premium real estate advisory in Gurugram. Visit our office in DLF Phase 2 or contact us via phone and email.',
    canonical: '/contact',
    ogType: 'website',
  },
  '/terms': {
    title: 'Terms of Service — Saudagar Properties',
    description: 'Read the terms and conditions of use for the Saudagar Properties website.',
    canonical: '/terms',
    ogType: 'website',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Saudagar Properties',
    description: 'Learn how Saudagar Properties collects, uses, and protects your personal information.',
    canonical: '/privacy-policy',
    ogType: 'website',
  },
  '/services/residential': {
    title: 'Luxury Residential Properties in DLF Gurugram | Builder Floors & Villas | Saudagar Properties',
    description: 'Discover Gurgaon’s finest portfolio of luxury independent builder floors, kothis, penthouses, and bespoke villas in DLF Phase 1–5, Sushant Lok & Golf Course Ext.',
    canonical: '/services/residential',
    ogType: 'website',
  },
  '/services/commercial': {
    title: 'Commercial Real Estate in DLF Gurugram | Office Spaces & Retail | Saudagar Properties',
    description: 'Premier commercial real estate consultancy in Gurgaon. Explore Grade-A office spaces, high-street retail, pre-leased investment assets, and corporate hubs in Cybercity & Golf Course Road.',
    canonical: '/services/commercial',
    ogType: 'website',
  },
  '/services/industrial': {
    title: 'Industrial Real Estate in Gurugram & Udyog Vihar | Warehouses & Plots | Saudagar Properties',
    description: 'Specialized industrial real estate advisory in Gurgaon and Manesar. Warehouses, factory leasing, industrial plots, and build-to-suit logistics facilities in Udyog Vihar & IMT Manesar.',
    canonical: '/services/industrial',
    ogType: 'website',
  },
  '/blog': {
    title: 'The Gurugram Real Estate Journal | Saudagar Properties DLF Advisory',
    description: 'Expert commentary, luxury builder floor guides, and micro-market analysis across DLF Phase 1–5, Sushant Lok, and Golf Course Road Gurugram.',
    canonical: '/blog',
    ogType: 'website',
  },
};

// ─── Breadcrumb Configuration ───────────────────────────────────────────
export const BREADCRUMBS = {
  '/': [{ name: 'Home', url: '/' }],
  '/about': [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ],
  '/team': [
    { name: 'Home', url: '/' },
    { name: 'Our Team', url: '/team' },
  ],
  '/contact': [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ],
  '/terms': [
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms' },
  ],
  '/privacy-policy': [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ],
  '/services/residential': [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#services' },
    { name: 'Residential Real Estate', url: '/services/residential' },
  ],
  '/services/commercial': [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#services' },
    { name: 'Commercial Real Estate', url: '/services/commercial' },
  ],
  '/services/industrial': [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#services' },
    { name: 'Industrial Real Estate', url: '/services/industrial' },
  ],
  '/blog': [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ],
};

// ─── Dynamic CMS Getters (Admin Panel Driven) ───────────────────────────
/**
 * Asynchronously returns live site name from CMS database, falling back to SITE_NAME.
 */
export async function getLiveSiteName() {
  try {
    const { getLiveBusinessProfile, getGlobalSeoSettings } = await import('./dynamicSeo');
    const [profile, settings] = await Promise.all([
      getLiveBusinessProfile(),
      getGlobalSeoSettings(),
    ]);
    return profile?.name || settings?.organizationSchema?.name || SITE_NAME;
  } catch {
    return SITE_NAME;
  }
}

/**
 * Asynchronously returns live business profile from CMS database, falling back to BUSINESS_INFO.
 */
export async function getLiveBusinessInfo() {
  try {
    const { getLiveBusinessProfile, getGlobalSeoSettings } = await import('./dynamicSeo');
    const [profile, settings] = await Promise.all([
      getLiveBusinessProfile(),
      getGlobalSeoSettings(),
    ]);
    if (!profile && !settings) return BUSINESS_INFO;

    const org = settings?.organizationSchema || {};
    const baseUrl = (settings?.canonicalBaseUrl || BUSINESS_INFO.url).replace(/\/+$/, '');

    return {
      name: profile?.name || org.name || BUSINESS_INFO.name,
      shortName: profile?.tagline || org.alternateName || BUSINESS_INFO.shortName,
      description: profile?.fullDescription || profile?.shortDescription || org.description || BUSINESS_INFO.description,
      foundingYear: profile?.foundingYear || BUSINESS_INFO.foundingYear,
      founders: (profile?.founders || org.founders || BUSINESS_INFO.founders || []).map(f => typeof f === 'string' ? f : (f.name || '')).filter(Boolean),
      address: {
        streetAddress: profile?.address?.streetAddress || org.streetAddress || BUSINESS_INFO.address?.streetAddress,
        addressLocality: profile?.address?.addressLocality || org.addressLocality || BUSINESS_INFO.address?.addressLocality,
        addressRegion: profile?.address?.addressRegion || org.addressRegion || BUSINESS_INFO.address?.addressRegion,
        postalCode: profile?.address?.postalCode || org.postalCode || BUSINESS_INFO.address?.postalCode,
        addressCountry: profile?.address?.addressCountry || org.addressCountry || BUSINESS_INFO.address?.addressCountry || 'IN',
        full: profile?.address?.full || BUSINESS_INFO.address?.full,
      },
      geo: org.geo || profile?.geo || BUSINESS_INFO.geo,
      phone: [
        profile?.primaryPhone || org.telephone || BUSINESS_INFO.phone?.[0],
        profile?.secondaryPhone || BUSINESS_INFO.phone?.[1],
      ].filter(Boolean),
      email: profile?.primaryEmail || org.email || BUSINESS_INFO.email,
      url: baseUrl,
      logo: profile?.logoUrl || org.logo || BUSINESS_INFO.logo,
      socialProfiles: profile?.socialLinks || BUSINESS_INFO.socialProfiles,
      areaServed: org.areaServed?.length ? org.areaServed : BUSINESS_INFO.areaServed,
      services: BUSINESS_INFO.services,
    };
  } catch {
    return BUSINESS_INFO;
  }
}

/**
 * Returns dynamic page metadata config for a given path
 */
export async function getLivePageSeo(path = '/') {
  const { getDynamicPageSeo } = await import('./dynamicSeo');
  return await getDynamicPageSeo(path, PAGE_SEO[path] || {});
}

/**
 * Returns dynamic breadcrumbs for a given path
 */
export async function getLiveBreadcrumbs(path = '/') {
  const { getDynamicBreadcrumbs } = await import('./dynamicSeo');
  return await getDynamicBreadcrumbs(path);
}

