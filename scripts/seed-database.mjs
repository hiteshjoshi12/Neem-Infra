import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if available
const envPath = path.resolve(__dirname, '../.env.local');
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
const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--test');

// Import clean seed data from scripts/seed-data (outside app bundle)
import { DEFAULT_SECTIONS } from './seed-data/defaultSections.js';
import { PROPERTIES, LUXURY_PROPERTIES_DETAILED } from './seed-data/propertiesData.js';
import { CORRIDOR_PAGES_DATA } from './seed-data/corridorPagesData.js';
import { INITIAL_AUTHORS, INITIAL_CATEGORIES, INITIAL_POSTS } from './seed-data/blogData.js';
import { DEFAULT_TESTIMONIALS_DATA } from './seed-data/homeData.js';
import { TEAM_FOUNDERS_DATA, TEAM_SPECIALISTS_DATA } from './seed-data/teamData.js';

// Import Mongoose Models
import SectionContent from '../src/models/SectionContent.js';
import Property from '../src/models/Property.js';
import SeoSettings from '../src/models/SeoSettings.js';
import BusinessProfile from '../src/models/BusinessProfile.js';
import Page from '../src/models/Page.js';
import Redirect from '../src/models/Redirect.js';
import Author from '../src/models/Author.js';
import Category from '../src/models/Category.js';
import BlogPost from '../src/models/BlogPost.js';
import Testimonial from '../src/models/Testimonial.js';

async function runSeed() {
  console.log('====================================================');
  console.log('🌱 SAUDAGAR PROPERTIES DATABASE MIGRATION & SEED');
  if (isDryRun) {
    console.log('⚠️  MODE: DRY RUN (No database writes will occur)');
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
    sections: { created: 0, preserved: 0 },
    pages: { created: 0, preserved: 0 },
    properties: { created: 0, preserved: 0 },
    redirects: { created: 0, preserved: 0 },
    authors: { created: 0, preserved: 0 },
    categories: { created: 0, preserved: 0 },
    blogPosts: { created: 0, preserved: 0 },
    testimonials: { created: 0, preserved: 0 },
  };

  // 1. SeoSettings
  console.log('1. Checking Global SeoSettings...');
  let seo = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
  if (!seo) {
    console.log('   -> Creating default SeoSettings...');
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
          name: 'Saudagar Properties',
          legalName: 'Saudagar Properties',
          url: 'https://saudagarproperties.com',
          logo: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png',
          telephone: '+91 97185 11207',
          email: 'info@saudagarproperties.com',
          streetAddress: '38, Akashneem Marg, DLF Phase 2',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
          priceRange: '₹₹₹₹₹',
          areaServed: ['DLF Phase 1-5, Gurugram', 'Golf Course Road', 'Sushant Lok'],
          foundingDate: '1999',
          founders: [{ name: 'Arun Sharma' }, { name: 'Suneeta Chawla' }],
          sameAs: [],
        },
      });
    }
    stats.seoSettings = 1;
  } else {
    // Ensure apex domain and clean founders
    if (!isDryRun) {
      seo.canonicalBaseUrl = 'https://saudagarproperties.com';
      if (seo.organizationSchema) {
        seo.organizationSchema.url = 'https://saudagarproperties.com';
        seo.organizationSchema.telephone = '+91 97185 11207';
        seo.organizationSchema.founders = [{ name: 'Arun Sharma' }, { name: 'Suneeta Chawla' }];
        seo.organizationSchema.sameAs = (seo.organizationSchema.sameAs || []).filter((u) => u && u !== '#' && !u.includes('#'));
      }
      await seo.save();
    }
    stats.seoSettings = 1;
  }

  // 2. BusinessProfile
  console.log('2. Checking BusinessProfile...');
  let profile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' });
  if (!profile) {
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
        secondaryPhone: '+91 98112 21207',
        whatsappNumber: '+91 97185 11207',
        primaryEmail: 'info@saudagarproperties.com',
        address: {
          streetAddress: '38, Akashneem Marg, DLF Phase 2',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
        },
        geo: { latitude: 28.4847851, longitude: 77.0842655 },
        googleBusinessProfileUrl: '',
        operatingHours: 'Mo-Sa 09:30-19:30',
        foundingYear: 1999,
        founders: [
          { name: 'Arun Sharma', role: 'Founder & Managing Director' },
          { name: 'Suneeta Chawla', role: 'Co-Founder & Head of Investment Advisory' },
        ],
        socialLinks: {
          facebook: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          twitter: '',
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
        isDlfAuthorized: true,
        dlfAuthorizationText: 'DLF Authorized & Verified',
      });
    }
    stats.businessProfile = 1;
  } else {
    if (!isDryRun) {
      profile.primaryPhone = '+91 97185 11207';
      profile.secondaryPhone = '+91 98112 21207';
      profile.whatsappNumber = '+91 97185 11207';
      profile.founders = [
        { name: 'Arun Sharma', role: 'Founder & Managing Director' },
        { name: 'Suneeta Chawla', role: 'Co-Founder & Head of Investment Advisory' },
      ];
      profile.isDlfAuthorized = true;
      profile.dlfAuthorizationText = 'DLF Authorized & Verified';
      if (profile.socialLinks) {
        Object.keys(profile.socialLinks).forEach((k) => {
          if (profile.socialLinks[k] === '#') profile.socialLinks[k] = '';
        });
      }
      await profile.save();
    }
    stats.businessProfile = 1;
  }

  // 3. SectionContent (18 core + 10 corridor sections = 28)
  console.log('3. Upserting CMS Sections (SectionContent)...');
  for (const key of Object.keys(DEFAULT_SECTIONS)) {
    const existing = await SectionContent.findOne({ sectionKey: key });
    if (!existing) {
      if (!isDryRun) {
        await SectionContent.create({
          sectionKey: key,
          title: `${key.replace(/^page_/, '').replace(/([A-Z])/g, ' $1').toUpperCase()} Content`,
          data: DEFAULT_SECTIONS[key],
          lastUpdatedBy: 'Migration Seed',
        });
      }
      stats.sections.created++;
    } else {
      stats.sections.preserved++;
    }
  }

  for (const cKey of Object.keys(CORRIDOR_PAGES_DATA)) {
    const sectionKey = `corridor_${cKey}`;
    const existing = await SectionContent.findOne({ sectionKey });
    if (!existing) {
      if (!isDryRun) {
        await SectionContent.create({
          sectionKey,
          title: `${CORRIDOR_PAGES_DATA[cKey].corridorName || cKey} Corridor Landing Content`,
          data: CORRIDOR_PAGES_DATA[cKey],
          lastUpdatedBy: 'Migration Seed',
        });
      }
      stats.sections.created++;
    } else {
      stats.sections.preserved++;
    }
  }

  // 4. Authors (Blog & Team Leadership)
  console.log('4. Upserting Authors & Team Principals...');
  const allAuthorsToSeed = [
    ...INITIAL_AUTHORS,
    {
      name: 'Ankit Sharma',
      slug: 'ankit-sharma',
      jobTitle: 'Senior Client Advisory',
      bio: 'Specializing in prime freehold floor acquisitions and client mandate representation across DLF Phase 1 & 2.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      expertise: ['DLF Phase 1 & 2 Luxury Floors', 'Client Representation'],
      email: 'ankit@saudagarproperties.com',
    },
    {
      name: 'Bhavishya Sharma',
      slug: 'bhavishya-sharma',
      jobTitle: 'Luxury Investment Specialist',
      bio: 'Advising family offices and NRI investors on high-yield residential assets and premium duplex residences.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertise: ['Golf Course Rd Penthouses & Villas', 'Family Office Advisory'],
      email: 'bhavishya@saudagarproperties.com',
    },
    {
      name: 'Shyam Upreti',
      slug: 'shyam-upreti',
      jobTitle: 'Commercial & Portfolio Lead',
      bio: 'Leading commercial leasing, pre-leased investment desks, and corporate headquarters relocations in Gurugram.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      expertise: ['Cybercity & Udyog Vihar Grade-A', 'Commercial Pre-Leased'],
      email: 'shyam@saudagarproperties.com',
    },
  ];

  const authorIdMap = {};
  for (const auth of allAuthorsToSeed) {
    let existing = await Author.findOne({ slug: auth.slug });
    if (!existing) {
      if (!isDryRun) {
        existing = await Author.create(auth);
      }
      stats.authors.created++;
    } else {
      stats.authors.preserved++;
    }
    if (existing) {
      authorIdMap[auth.slug] = existing._id;
    }
  }

  // 5. Categories
  console.log('5. Upserting Blog Categories...');
  const categoryIdMap = {};
  for (const cat of INITIAL_CATEGORIES) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      if (!isDryRun) {
        existing = await Category.create(cat);
      }
      stats.categories.created++;
    } else {
      stats.categories.preserved++;
    }
    if (existing) {
      categoryIdMap[cat.slug] = existing._id;
    }
  }

  // 6. Blog Posts
  console.log('6. Upserting Blog Articles...');
  for (const post of INITIAL_POSTS) {
    const existing = await BlogPost.findOne({ slug: post.slug });
    if (!existing) {
      if (!isDryRun) {
        const authorId = authorIdMap[post.authorSlug] || Object.values(authorIdMap)[0];
        const categoryId = categoryIdMap[post.categorySlug] || Object.values(categoryIdMap)[0];

        await BlogPost.create({
          ...post,
          author: authorId,
          category: categoryId,
          status: post.status || 'published',
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        });
      }
      stats.blogPosts.created++;
    } else {
      stats.blogPosts.preserved++;
    }
  }

  // 7. Testimonials
  console.log('7. Upserting Testimonials...');
  for (let i = 0; i < DEFAULT_TESTIMONIALS_DATA.length; i++) {
    const t = DEFAULT_TESTIMONIALS_DATA[i];
    const existing = await Testimonial.findOne({ name: t.name });
    if (!existing) {
      if (!isDryRun) {
        await Testimonial.create({
          name: t.name,
          role: t.role || 'Investor',
          location: t.location || 'Gurugram, India',
          propertyType: t.propertyType || 'DLF Luxury Estate',
          rating: t.rating || 5,
          avatar: t.avatar,
          quote: t.quote,
          tag: t.tag || 'Verified Client',
          order: i,
          isActive: true,
        });
      }
      stats.testimonials.created++;
    } else {
      stats.testimonials.preserved++;
    }
  }

  // 8. Properties (Catalog)
  console.log('8. Checking Property Catalog...');
  const propSource = LUXURY_PROPERTIES_DETAILED || PROPERTIES;
  for (let i = 0; i < propSource.length; i++) {
    const item = propSource[i];
    const existing = await Property.findOne({ slug: item.slug });
    if (!existing) {
      if (!isDryRun) {
        await Property.create({
          title: item.title,
          slug: item.slug,
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
          reraNumber: '', // sanitized clean
          features: item.features || [],
          nearbyLandmarks: item.nearbyLandmarks || [],
          order: i,
          isFeatured: true,
          isActive: true,
        });
      }
      stats.properties.created++;
    } else {
      // Heal existing property: purge wp-content images and empty reraNumber if contaminated
      if (!isDryRun) {
        let changed = false;
        if (existing.img?.includes('/wp-content/')) {
          existing.img = item.img;
          changed = true;
        }
        if (Array.isArray(existing.images) && existing.images.some((img) => img.includes('/wp-content/'))) {
          existing.images = item.images;
          changed = true;
        }
        if (existing.reraNumber && (existing.reraNumber.includes('Freehold') || existing.reraNumber.includes('Title'))) {
          existing.reraNumber = '';
          changed = true;
        }
        if (changed) await existing.save();
      }
      stats.properties.preserved++;
    }
  }

  // 9. Redirects
  console.log('9. Checking 301 Redirects...');
  const standardRedirects = [
    { fromPath: '/feed', toPath: '/blog', statusCode: 301 },
    { fromPath: '/feed/', toPath: '/blog', statusCode: 301 },
    { fromPath: '/category', toPath: '/blog', statusCode: 301 },
    { fromPath: '/tag', toPath: '/blog', statusCode: 301 },
    { fromPath: '/properties/', toPath: '/properties', statusCode: 301 },
    { fromPath: '/property/sushant-lok', toPath: '/property/shushant-lok', statusCode: 301 },
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
      stats.redirects.preserved++;
    }
  }

  console.log('\n====================================================');
  console.log('🎉 DATABASE MIGRATION & SEED COMPLETED');
  console.log('====================================================');
  console.log(`• SeoSettings:   ${stats.seoSettings}`);
  console.log(`• BusinessProfile: ${stats.businessProfile}`);
  console.log(`• Sections:      ${stats.sections.created} created / ${stats.sections.preserved} preserved`);
  console.log(`• Authors:       ${stats.authors.created} created / ${stats.authors.preserved} preserved`);
  console.log(`• Categories:    ${stats.categories.created} created / ${stats.categories.preserved} preserved`);
  console.log(`• Blog Posts:    ${stats.blogPosts.created} created / ${stats.blogPosts.preserved} preserved`);
  console.log(`• Testimonials:  ${stats.testimonials.created} created / ${stats.testimonials.preserved} preserved`);
  console.log(`• Properties:    ${stats.properties.created} created / ${stats.properties.preserved} preserved`);
  console.log(`• Redirects:     ${stats.redirects.created} created / ${stats.redirects.preserved} preserved`);
  console.log('====================================================\n');

  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error('Fatal migration seed error:', err);
  process.exit(1);
});
