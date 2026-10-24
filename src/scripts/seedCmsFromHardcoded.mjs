import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if available
const envPath = path.resolve(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k && v.length) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Check flags
const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--test');

import { DEFAULT_SECTIONS } from '../constants/defaultSections.js';
import { PROPERTIES, LUXURY_PROPERTIES_DETAILED } from '../constants/propertiesData.js';
import { CORRIDOR_PAGES_DATA } from '../constants/corridorPagesData.js';
import { BUSINESS_INFO, PAGE_SEO, BREADCRUMBS, SITE_URL } from '../lib/seo/seoConfig.js';

import SectionContent from '../models/SectionContent.js';
import Property from '../models/Property.js';
import SeoSettings from '../models/SeoSettings.js';
import BusinessProfile from '../models/BusinessProfile.js';
import Page from '../models/Page.js';
import Redirect from '../models/Redirect.js';

async function seedCms() {
  console.log('====================================================');
  console.log('🌱 IDEMPOTENT CMS & SEO SEED MIGRATION');
  if (isDryRun) {
    console.log('⚠️  MODE: DRY RUN / TEST (No database writes will occur)');
  }
  console.log('====================================================\n');

  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not set in environment or .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB.\n');

  const stats = {
    seoSettings: 0,
    businessProfile: 0,
    sections: { created: 0, skipped: 0 },
    pages: { created: 0, skipped: 0 },
    properties: { created: 0, skipped: 0 },
    redirects: { created: 0, skipped: 0 },
  };

  // 1. SeoSettings (Singleton)
  console.log('1. Checking Global SeoSettings...');
  const existingSeo = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
  if (!existingSeo) {
    console.log('   -> Creating default SeoSettings with apex domain and AI crawler rules...');
    if (!isDryRun) {
      await SeoSettings.create({
        singletonKey: 'global_seo_settings',
        canonicalBaseUrl: 'https://saudagarproperties.com',
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
          'Saudagar Properties',
        ],
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
        googleTagManagerId: '',
        googleSearchConsoleCode: '',
        bingVerificationCode: '',
        enableGa4: true,
        enableGtm: true,
        enableGsc: true,
        enableBingVerification: true,
        robotsTxtMode: 'standard',
        robotsTxtCustomRules: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n`,
        aiBotRules: {
          gptBot: true,
          claudeBot: true,
          perplexityBot: true,
          ccBot: false,
        },
        organizationSchema: {
          name: BUSINESS_INFO.name,
          legalName: BUSINESS_INFO.name,
          url: 'https://saudagarproperties.com',
          logo: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png',
          telephone: '+91 97185 11207',
          email: 'info@saudagarproperties.com',
          streetAddress: 'DLF Phase 2, Sector 25',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
          priceRange: '₹₹₹₹₹',
          areaServed: ['DLF Phase 1-5, Gurugram', 'Golf Course Road', 'Sushant Lok'],
          foundingDate: '1999',
          founders: [{ name: 'Raman Saudagar' }],
          sameAs: [
            'https://facebook.com/saudagarproperties',
            'https://instagram.com/saudagarproperties',
            'https://linkedin.com/company/saudagarproperties',
            'https://youtube.com/@saudagarproperties',
          ],
        },
      });
    }
    stats.seoSettings = 1;
  } else {
    console.log('   ✓ SeoSettings already exists. Healing canonical URL to apex if needed...');
    if (!isDryRun && (existingSeo.canonicalBaseUrl?.includes('www.') || existingSeo.organizationSchema?.url?.includes('www.'))) {
      existingSeo.canonicalBaseUrl = 'https://saudagarproperties.com';
      if (existingSeo.organizationSchema) {
        existingSeo.organizationSchema.url = 'https://saudagarproperties.com';
      }
      await existingSeo.save();
    }
  }

  // 2. BusinessProfile (Singleton)
  console.log('\n2. Checking BusinessProfile...');
  const existingProfile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' });
  if (!existingProfile) {
    console.log('   -> Creating default BusinessProfile...');
    if (!isDryRun) {
      await BusinessProfile.create({
        singletonKey: 'primary_business_profile',
        name: 'Saudagar Properties',
        legalName: 'Saudagar Properties',
        tagline: 'Premier Real Estate Consultancy in DLF Gurugram',
        shortDescription:
          '25+ years of dedicated authority in luxury builder floors, independent villas & corporate assets in DLF Gurugram.',
        fullDescription:
          'Saudagar Properties is Gurugram’s premier real estate consultancy specializing in luxury builder floors, DLF Phase 1–5 villas, penthouses, and commercial spaces across Golf Course Road and Cyber City. Founded in 1999.',
        primaryPhone: '+91 97185 11207',
        secondaryPhone: '+91 98100 02447',
        whatsappNumber: '+91 97185 11207',
        primaryEmail: 'info@saudagarproperties.com',
        address: {
          streetAddress: '38, Akashneem Marg, DLF-II',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
        },
        geo: { latitude: 28.4815, longitude: 77.0863 },
        googleBusinessProfileUrl: 'https://maps.google.com/?q=Saudagar+Properties+DLF+Gurugram',
        operatingHours: 'Mo-Sa 09:30-19:30',
        foundingYear: 1999,
        founders: [{ name: 'Raman Saudagar', role: 'Founder & Managing Director' }],
        socialLinks: {
          facebook: 'https://facebook.com/saudagarproperties',
          instagram: 'https://instagram.com/saudagarproperties',
          linkedin: 'https://linkedin.com/company/saudagarproperties',
          youtube: 'https://youtube.com/@saudagarproperties',
        },
        corridorsServed: [
          'DLF Phase 1',
          'DLF Phase 2',
          'DLF Phase 3',
          'DLF Phase 4',
          'DLF Phase 5',
          'Golf Course Road',
          'Sushant Lok 1',
        ],
      });
    }
    stats.businessProfile = 1;
  } else {
    console.log('   ✓ BusinessProfile already exists.');
  }

  // 3. SectionContent (Idempotent upsert via $setOnInsert)
  console.log('\n3. Upserting CMS Sections (SectionContent)...');
  const sectionKeys = Object.keys(DEFAULT_SECTIONS);
  for (const key of sectionKeys) {
    const existing = await SectionContent.findOne({ sectionKey: key });
    if (!existing) {
      if (!isDryRun) {
        await SectionContent.create({
          sectionKey: key,
          title: `${key.replace(/^page_/, '').replace(/([A-Z])/g, ' $1').toUpperCase()} Content`,
          data: DEFAULT_SECTIONS[key],
          lastUpdatedBy: 'Idempotent Seed Migration',
        });
      }
      stats.sections.created++;
    } else {
      stats.sections.skipped++;
    }
  }

  // Micro-market corridors in SectionContent
  for (const cKey of Object.keys(CORRIDOR_PAGES_DATA)) {
    const sectionKey = `corridor_${cKey}`;
    const existing = await SectionContent.findOne({ sectionKey });
    if (!existing) {
      if (!isDryRun) {
        await SectionContent.create({
          sectionKey,
          title: `${CORRIDOR_PAGES_DATA[cKey].corridorName || cKey} Corridor Landing Content`,
          data: CORRIDOR_PAGES_DATA[cKey],
          lastUpdatedBy: 'Idempotent Seed Migration',
        });
      }
      stats.sections.created++;
    } else {
      stats.sections.skipped++;
    }
  }
  console.log(`   ✓ Sections: ${stats.sections.created} created, ${stats.sections.skipped} preserved.`);

  // 4. Page Collection (System & Corridor Pages)
  console.log('\n4. Upserting System & Corridor Pages (Page)...');
  const corePages = [
    {
      title: 'Homepage',
      slug: '/',
      pageType: 'system',
      h1: 'Premier Real Estate Consultancy in DLF Gurugram',
      h2: '25+ Years of Dedicated Authority in Luxury Builder Floors, Independent Villas & Corporate Assets',
      metaTitle: PAGE_SEO['/']?.title || 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
      metaDescription: PAGE_SEO['/']?.description || '',
      canonicalUrl: 'https://saudagarproperties.com/',
      focusKeywords: ['Real Estate Consultant Gurugram', 'DLF Phase 1-5 Builder Floors'],
      directAnswer:
        'Saudagar Properties is a premier real estate advisory firm in DLF Gurugram founded in 1999. Specializing in luxury builder floors, independent villas, penthouses, and commercial assets across DLF Phase 1–5, Sushant Lok, and Golf Course Road.',
      breadcrumbs: [{ name: 'Home', url: '/' }],
      schemaType: 'RealEstateAgent',
    },
    {
      title: 'About Us',
      slug: '/about',
      pageType: 'system',
      h1: 'Quarter-Century Leadership Narrative in DLF Gurugram',
      h2: 'Founded in 1999 — Fiduciary Real Estate Advisory Built on Generational Trust & Uncompromising Ethics',
      metaTitle: PAGE_SEO['/about']?.title || 'About Us — Saudagar Properties',
      metaDescription: PAGE_SEO['/about']?.description || '',
      canonicalUrl: 'https://saudagarproperties.com/about',
      focusKeywords: ['About Saudagar Properties', 'DLF Real Estate Leadership'],
      directAnswer:
        'Established in 1999 by Raman Saudagar, Saudagar Properties is a fiduciary real estate advisory firm based in DLF Phase 2, Gurugram. The firm has advised over 1,200 elite families and corporates on prime DLF acquisitions.',
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about' }],
      schemaType: 'AboutPage',
    },
    {
      title: 'Leadership & Team',
      slug: '/team',
      pageType: 'system',
      h1: 'Visionary Founders & Senior Real Estate Advisory Principals',
      h2: 'Decades of Micro-Market Mastery Guiding Ultra-High-Net-Worth Individuals & Corporate Entities',
      metaTitle: PAGE_SEO['/team']?.title || 'Our Leadership & Team — Saudagar Properties',
      metaDescription: PAGE_SEO['/team']?.description || '',
      canonicalUrl: 'https://saudagarproperties.com/team',
      focusKeywords: ['Saudagar Properties Team', 'Gurgaon Property Advisors'],
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Team', url: '/team' }],
      schemaType: 'WebPage',
    },
    {
      title: 'Contact Us',
      slug: '/contact',
      pageType: 'system',
      h1: 'Private Consultation Desk for DLF Acquisitions & Advisory',
      h2: 'Connect Directly with Managing Partners in DLF Phase 2, Gurugram',
      metaTitle: PAGE_SEO['/contact']?.title || 'Contact Us — Saudagar Properties',
      metaDescription: PAGE_SEO['/contact']?.description || '',
      canonicalUrl: 'https://saudagarproperties.com/contact',
      focusKeywords: ['Contact Saudagar Properties', 'DLF Real Estate Office'],
      directAnswer:
        'Reach Saudagar Properties at 38, Akashneem Marg, DLF Phase 2, Gurugram (PIN 122002). Direct advisory lines: +91 97185 11207 and +91 98100 02447. Operating hours: Monday to Saturday 09:30 to 19:30 IST.',
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }],
      schemaType: 'ContactPage',
    },
    {
      title: 'Prime Properties Portfolio',
      slug: '/properties',
      pageType: 'system',
      h1: 'Vetted Builder Floors, Luxury Villas & Commercial Assets in DLF Gurugram',
      h2: 'Curated Ready-to-Move Residences with Clear Titles & Prime Locations',
      metaTitle: 'Properties in DLF Gurugram | Saudagar Properties',
      metaDescription:
        'Explore luxury builder floors, independent villas, and penthouses in DLF Phase 1–5, Sushant Lok, and Golf Course Road Gurugram. 100% verified legal titles.',
      canonicalUrl: 'https://saudagarproperties.com/properties',
      focusKeywords: ['Properties in DLF Gurugram', 'DLF Builder Floors for Sale'],
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Properties', url: '/properties' }],
      schemaType: 'WebPage',
    },
  ];

  // Add Corridor Pages from CORRIDOR_PAGES_DATA
  for (const [corridorSlug, data] of Object.entries(CORRIDOR_PAGES_DATA)) {
    const fullSlug = `/property/${corridorSlug}`;
    corePages.push({
      title: data.corridorName || `Property in ${corridorSlug}`,
      slug: fullSlug,
      pageType: 'corridor',
      h1: data.hero?.title || `Luxury Properties in ${data.corridorName || corridorSlug}`,
      h2: data.hero?.subtitle || `Premier Builder Floors & Villas in Gurugram`,
      metaTitle: data.seo?.metaTitle || `${data.corridorName || corridorSlug} Real Estate | Saudagar Properties`,
      metaDescription: data.seo?.metaDescription || data.hero?.description || '',
      canonicalUrl: `https://saudagarproperties.com${fullSlug}`,
      focusKeywords: data.seo?.keywords || [data.corridorName, 'Builder Floors DLF'],
      directAnswer:
        data.overview?.content?.slice(0, 220) ||
        `${data.corridorName} is one of Gurugram's most prestigious corridors offering independent builder floors, luxury villas, and plots with excellent connectivity to Cyber City and Delhi.`,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Properties', url: '/properties' },
        { name: data.corridorName || corridorSlug, url: fullSlug },
      ],
      faq: (data.faq || []).map((f) => ({
        question: f.question || f.q,
        answer: f.answer || f.a,
      })),
      schemaType: 'WebPage',
    });
  }

  for (const pageItem of corePages) {
    const existing = await Page.findOne({ slug: pageItem.slug });
    if (!existing) {
      if (!isDryRun) {
        await Page.create({
          ...pageItem,
          status: 'published',
          robots: { index: true, follow: true, noarchive: false, nosnippet: false },
          lastUpdatedBy: 'Idempotent Seed Migration',
        });
      }
      stats.pages.created++;
    } else {
      stats.pages.skipped++;
    }
  }
  console.log(`   ✓ Pages: ${stats.pages.created} created, ${stats.pages.skipped} preserved.`);

  // 5. Properties (Catalog)
  console.log('\n5. Checking Property Catalog...');
  const propertyCount = await Property.countDocuments();
  if (propertyCount === 0) {
    console.log(`   -> Seeding ${PROPERTIES.length} verified properties...`);
    if (!isDryRun) {
      const source = (LUXURY_PROPERTIES_DETAILED && LUXURY_PROPERTIES_DETAILED.length > 0)
        ? LUXURY_PROPERTIES_DETAILED
        : PROPERTIES;

      for (let i = 0; i < source.length; i++) {
        const item = source[i];
        await Property.create({
          title: item.title,
          slug: item.slug || `property-${i + 1}`,
          price: item.price,
          location: item.location,
          specs: item.specs,
          desc: item.desc,
          img: item.img,
          images: item.images || (item.img ? [item.img] : []),
          tag: item.tag || 'Exclusive Floor',
          category: item.category || 'residential',
          bhk: item.bhk,
          bathrooms: item.bathrooms,
          plotArea: item.plotArea,
          builtUpArea: item.builtUpArea,
          facing: item.facing,
          floor: item.floor,
          furnishing: item.furnishing,
          parking: item.parking,
          possession: item.possession,
          reraNumber: item.reraNumber || '',
          features: item.features || [],
          nearbyLandmarks: item.nearbyLandmarks || [],
          order: i,
          isFeatured: true,
          isActive: true,
        });
        stats.properties.created++;
      }
    }
  } else {
    stats.properties.skipped = propertyCount;
    console.log(`   ✓ Property catalog already populated (${propertyCount} properties).`);
  }

  // 6. Redirects (Legacy WordPress & Trailing Slash Cleanups)
  console.log('\n6. Upserting Standard 301 Redirects...');
  const standardRedirects = [
    { fromPath: '/feed', toPath: '/blog', statusCode: 301 },
    { fromPath: '/feed/', toPath: '/blog', statusCode: 301 },
    { fromPath: '/category', toPath: '/blog', statusCode: 301 },
    { fromPath: '/tag', toPath: '/blog', statusCode: 301 },
    { fromPath: '/properties/', toPath: '/properties', statusCode: 301 },
    { fromPath: '/property/shushant-lok', toPath: '/property/shushant-lok', statusCode: 301 },
  ];

  for (const red of standardRedirects) {
    const existing = await Redirect.findOne({ fromPath: red.fromPath });
    if (!existing) {
      if (!isDryRun) {
        await Redirect.create({
          fromPath: red.fromPath,
          toPath: red.toPath,
          statusCode: red.statusCode,
          isActive: true,
          notes: 'Standard Technical SEO Redirect',
        });
      }
      stats.redirects.created++;
    } else {
      stats.redirects.skipped++;
    }
  }
  console.log(`   ✓ Redirects: ${stats.redirects.created} created, ${stats.redirects.skipped} preserved.`);

  console.log('\n====================================================');
  console.log('🎉 IDEMPOTENT CMS & SEO MIGRATION COMPLETED');
  console.log('====================================================');
  console.log(`• SeoSettings created:   ${stats.seoSettings}`);
  console.log(`• BusinessProfile created: ${stats.businessProfile}`);
  console.log(`• Sections created/kept: ${stats.sections.created} / ${stats.sections.skipped}`);
  console.log(`• Pages created/kept:    ${stats.pages.created} / ${stats.pages.skipped}`);
  console.log(`• Properties seeded/kept:${stats.properties.created} / ${stats.properties.skipped}`);
  console.log(`• Redirects created/kept:${stats.redirects.created} / ${stats.redirects.skipped}`);
  console.log('====================================================\n');

  await mongoose.disconnect();
}

seedCms().catch((err) => {
  console.error('Fatal error during seed execution:', err);
  process.exit(1);
});
