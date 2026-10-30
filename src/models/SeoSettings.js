import mongoose from 'mongoose';

const seoSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: 'global_seo_settings',
      unique: true,
      index: true,
    },

    // Canonical Base URL
    canonicalBaseUrl: {
      type: String,
      default: 'https://saudagarproperties.com',
      trim: true,
    },

    // Global Meta Defaults
    siteTitleTemplate: {
      type: String,
      default: '%s | Saudagar Properties',
    },
    defaultMetaTitle: {
      type: String,
      default: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
    },
    defaultMetaDescription: {
      type: String,
      default:
        'Find luxury builder floors, independent villas, penthouses, and commercial offices in DLF Phase 1–5, Sushant Lok, and Golf Course Road. 25+ years of trusted advisory in Gurugram.',
    },
    defaultOgImage: {
      type: String,
      default: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?updatedAt=1792302925853',
    },
    defaultKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // Analytics & Tracking Verification
    googleAnalyticsId: {
      type: String,
      trim: true,
      default: '',
    },
    enableGa4: {
      type: Boolean,
      default: true,
    },
    googleTagManagerId: {
      type: String,
      trim: true,
      default: '',
    },
    enableGtm: {
      type: Boolean,
      default: true,
    },
    googleSearchConsoleCode: {
      type: String,
      trim: true,
      default: '',
    },
    enableGsc: {
      type: Boolean,
      default: true,
    },
    bingVerificationCode: {
      type: String,
      trim: true,
      default: '',
    },
    enableBingVerification: {
      type: Boolean,
      default: true,
    },
    indexNowKey: {
      type: String,
      trim: true,
      default: '',
    },
    indexNowKeyLocation: {
      type: String,
      trim: true,
      default: '',
    },
    customScripts: {
      head: { type: String, default: '' },
      body: { type: String, default: '' },
      isEnabled: { type: Boolean, default: true },
    },
    aiBotRules: {
      gptBot: { type: Boolean, default: true },
      claudeBot: { type: Boolean, default: true },
      perplexityBot: { type: Boolean, default: true },
      ccBot: { type: Boolean, default: false },
    },

    // Robots.txt Configuration
    robotsTxtMode: {
      type: String,
      enum: ['standard', 'custom', 'disallow_all'],
      default: 'standard',
    },
    robotsTxtCustomRules: {
      type: String,
      default: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
`,
    },

    // Taxonomies Robots & Indexing Policy
    tagArchiveRobots: {
      type: String,
      enum: ['noindex,follow', 'index,follow', 'noindex,nofollow'],
      default: 'noindex,follow',
    },
    authorArchiveRobots: {
      type: String,
      enum: ['noindex,follow', 'index,follow', 'noindex,nofollow'],
      default: 'noindex,follow',
    },

    // XML Sitemap Configuration
    sitemapConfig: {
      includePages: { type: Boolean, default: true },
      includeServices: { type: Boolean, default: true },
      includeProperties: { type: Boolean, default: true },
      includeCorridors: { type: Boolean, default: true },
      includeBlogs: { type: Boolean, default: true },
      includeCategories: { type: Boolean, default: true },
      includeTags: { type: Boolean, default: false },
      includeAuthors: { type: Boolean, default: false },
      includeCustomPages: { type: Boolean, default: true },
      extraUrls: [
        {
          url: { type: String, required: true },
          priority: { type: Number, default: 0.8 },
          changeFrequency: { type: String, default: 'weekly' },
        },
      ],
    },

    // Custom 404 Page Experience
    custom404: {
      badgeText: { type: String, default: 'Error 404 • Destination Not Found' },
      title: { type: String, default: 'Page Not Located' },
      subtitle: {
        type: String,
        default:
          'The property listing, editorial dispatch, or link you requested is unavailable or has been relocated to our updated platform.',
      },
      showQuickLinks: { type: Boolean, default: true },
      ctaTitle: { type: String, default: 'Speak Directly with Senior Partners' },
      ctaButtonText: { type: String, default: 'Request Private Consultation' },
      ctaButtonLink: { type: String, default: '/contact' },
      phoneContact: { type: String, default: '+91 97185 11207' },
      quickLinks: [
        {
          title: { type: String, default: 'Return to Homepage' },
          desc: { type: String, default: 'Explore prime corridors & services' },
          url: { type: String, default: '/' },
          iconName: { type: String, default: 'Home' },
        },
        {
          title: { type: String, default: 'Real Estate Journal' },
          desc: { type: String, default: 'Read luxury builder floor analyses' },
          url: { type: String, default: '/blog' },
          iconName: { type: String, default: 'BookOpen' },
        },
        {
          title: { type: String, default: 'Ready-to-Move Residences' },
          desc: { type: String, default: 'Vetted DLF Phase 1–5 builder floors' },
          url: { type: String, default: '/properties' },
          iconName: { type: String, default: 'Building2' },
        },
        {
          title: { type: String, default: 'Private Consultation' },
          desc: { type: String, default: 'Speak directly with senior partners' },
          url: { type: String, default: '/contact' },
          iconName: { type: String, default: 'Phone' },
        },
      ],
    },

    // Website Speed & Core Web Vitals Optimizations
    speedOptimizations: {
      enablePreconnect: { type: Boolean, default: true },
      enableDnsPrefetch: { type: Boolean, default: true },
      enableLazyLoadScripts: { type: Boolean, default: true },
      preconnectDomains: [
        { type: String, default: 'https://ik.imagekit.io' },
        { type: String, default: 'https://images.unsplash.com' },
        { type: String, default: 'https://fonts.googleapis.com' },
        { type: String, default: 'https://fonts.gstatic.com' },
      ],
      enableImageOptimization: { type: Boolean, default: true },
      imageQualityPreset: { type: String, default: '85' },
    },

    // Organization & LocalBusiness Knowledge Graph Schema
    organizationSchema: {
      name: { type: String, default: 'Saudagar Properties' },
      legalName: { type: String, default: 'Saudagar Properties' },
      url: { type: String, default: 'https://saudagarproperties.com' },
      logo: {
        type: String,
        default: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png',
      },
      telephone: { type: String, default: '+91 97185 11207' },
      email: { type: String, default: 'info@saudagarproperties.com' },
      streetAddress: { type: String, default: '38, Akashneem Marg, DLF Phase 2' },
      addressLocality: { type: String, default: 'Gurugram' },
      addressRegion: { type: String, default: 'Haryana' },
      postalCode: { type: String, default: '122002' },
      addressCountry: { type: String, default: 'IN' },
      priceRange: { type: String, default: '₹₹₹₹₹' },
      areaServed: [{ type: String, default: 'DLF Phase 1-5, Gurugram' }],
      foundingDate: { type: String, default: '1999' },
      founders: [
        {
          name: { type: String, default: 'Arun Sharma' },
        },
        {
          name: { type: String, default: 'Suneeta Chawla' },
        },
      ],
      sameAs: [
        { type: String, trim: true },
      ],
      reraNumber: { type: String, default: '' },
      googleBusinessProfileUrl: { type: String, default: '' },
    },

    // Automatic Backup Frequency
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'manual'],
      default: 'weekly',
    },
    lastBackupAt: {
      type: Date,
    },
    lastUpdatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SeoSettings || mongoose.model('SeoSettings', seoSettingsSchema);
