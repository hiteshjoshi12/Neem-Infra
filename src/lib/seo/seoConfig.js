/**
 * SEO Configuration — Single Source of Truth
 * ============================================
 * All site-wide SEO defaults, business entity information,
 * and per-page metadata are defined here.
 *
 * TODO: Update SITE_URL with the actual production domain before launch.
 * TODO: Update social profile URLs with real accounts.
 */

// ─── Site-Wide Constants ────────────────────────────────────────────────
export const SITE_URL = 'https://www.saudagarproperties.com'; // TODO: Set actual production domain
export const SITE_NAME = 'Saudagar Properties';
export const SITE_LEGAL_NAME = 'Saudagar Properties Pvt. Ltd.';
export const DEFAULT_LOCALE = 'en_IN';
export const DEFAULT_LANGUAGE = 'en';

// ─── Business Entity Information (NAP + Identity) ───────────────────────
export const BUSINESS_INFO = {
  name: 'Saudagar Properties Pvt. Ltd.',
  shortName: 'Saudagar Properties',
  description:
    'Premier real estate consultancy in Gurugram specializing in luxury builder floors, independent villas, commercial offices, and industrial properties across DLF Phase 1–5, Sushant Lok, Golf Course Road, and Udyog Vihar.',
  foundingYear: 1999,
  founders: ['Mr. Arun Sharma', 'Mrs. Suneeta Chawla'],
  address: {
    streetAddress: '38, Akashneem Marg',
    addressLocality: 'DLF Phase 2, Gurugram',
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
  url: SITE_URL,
  logo: '/logo.png',
  socialProfiles: {
    // TODO: Replace '#' with actual profile URLs
    facebook: '#',
    instagram: '#',
    pinterest: '#',
    linkedin: '#',
    youtube: '#',
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
  priceRange: '₹₹₹₹',
};

// ─── Default Meta Tags ─────────────────────────────────────────────────
export const DEFAULT_META = {
  title: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
  description:
    'Saudagar Properties is a trusted real estate consultancy in Gurugram with 25+ years of experience. Explore luxury builder floors, villas, commercial offices, and plots in DLF Phase 1–5, Sushant Lok, and Golf Course Road.',
  ogType: 'website',
  ogImage: `${SITE_URL}/og-image.jpg`, // TODO: Create and place an OG image (1200×630px)
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
  '/contact': {
    title: 'Contact Us — Saudagar Properties | DLF Gurugram Real Estate',
    description:
      'Get in touch with Saudagar Properties for premium real estate advisory in Gurugram. Visit our office in DLF Phase 2 or contact us via phone and email.',
    canonical: '/contact',
    ogType: 'website',
  },
  '/ready-to-move': {
    title: 'Ready to Move Properties in DLF Gurugram — Saudagar Properties',
    description:
      'Browse ready-to-move luxury builder floors, villas, and apartments in DLF Phase 1–5, Sushant Lok, and Golf Course Road. Immediate possession properties curated by Saudagar Properties.',
    canonical: '/ready-to-move',
    ogType: 'website',
  },
  '/new-launches': {
    title: 'New Launch Properties in DLF Gurugram — Saudagar Properties',
    description:
      'Discover newly launched residential and commercial projects in Gurugram. Pre-launch and new-launch builder floors, apartments, and commercial spaces in DLF and surrounding corridors.',
    canonical: '/new-launches',
    ogType: 'website',
  },
  '/under-construction': {
    title: 'Under Construction Properties in DLF Gurugram — Saudagar Properties',
    description:
      'Invest in under-construction properties in DLF Gurugram at pre-possession prices. Builder floors, apartments, and commercial developments currently under construction.',
    canonical: '/under-construction',
    ogType: 'website',
  },
  '/developers': {
    title: 'Top Real Estate Developers in Gurugram — Saudagar Properties',
    description:
      'Explore properties from leading developers in Gurugram including DLF, Emaar, BPTP, and more. Saudagar Properties partners with the most trusted builders in the region.',
    canonical: '/developers',
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
  '/contact': [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ],
  '/ready-to-move': [
    { name: 'Home', url: '/' },
    { name: 'Ready to Move', url: '/ready-to-move' },
  ],
  '/new-launches': [
    { name: 'Home', url: '/' },
    { name: 'New Launches', url: '/new-launches' },
  ],
  '/under-construction': [
    { name: 'Home', url: '/' },
    { name: 'Under Construction', url: '/under-construction' },
  ],
  '/developers': [
    { name: 'Home', url: '/' },
    { name: 'Developers', url: '/developers' },
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
