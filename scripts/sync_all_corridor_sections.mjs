import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CORRIDOR_PAGES_DATA } from '../src/constants/corridorPagesData.js';

const MONGO_URI = 'mongodb+srv://hitesh:hitesh@mom.ba5lcxw.mongodb.net/saudagar_properties';

const CORRIDOR_EXTRA_FIELDS = {
  'dlf-phase-1': {
    inventorySection: {
      badge: 'Verified Real Estate',
      title: 'Available Properties in DLF Phase 1',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Inquiry Desk',
      title: 'Consult Directly for DLF Phase 1',
      description: 'Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.',
      confidentialityNote: 'Strict client confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Expert Guidance & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, pricing benchmarks, and zoning in DLF Phase 1.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Micro-Market Authority' },
      { value: '100%', label: 'Clean Freehold Titles' },
      { value: '₹500+ Cr', label: 'Transactions Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Due Diligence',
      cardBadgeDesc: 'Title clearance, registry representation & architect consultation'
    },
    locationSectionCards: {
      cardBadge: 'Prime Location Estate',
      cardTag: 'Direct Sector Mandate',
      cardTitle: 'DLF Phase 1 Prime Micro-Market'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold Title Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'DLF Phase 1 Micro-Market Intelligence'
    }
  },
  'dlf-phase-2': {
    inventorySection: {
      badge: 'Verified Real Estate',
      title: 'Available Properties in DLF Phase 2',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Inquiry Desk',
      title: 'Consult Directly for DLF Phase 2',
      description: 'Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.',
      confidentialityNote: 'Strict client confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Expert Guidance & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, pricing benchmarks, and zoning in DLF Phase 2.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Micro-Market Authority' },
      { value: '100%', label: 'Clean Freehold Titles' },
      { value: '₹500+ Cr', label: 'Transactions Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Due Diligence',
      cardBadgeDesc: 'Title clearance, registry representation & architect consultation'
    },
    locationSectionCards: {
      cardBadge: 'Prime Location Estate',
      cardTag: 'Direct Sector Mandate',
      cardTitle: 'DLF Phase 2 Prime Micro-Market'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold Title Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'DLF Phase 2 Micro-Market Intelligence'
    }
  },
  'dlf-phase-3': {
    inventorySection: {
      badge: 'Verified Real Estate',
      title: 'Available Properties in DLF Phase 3',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Inquiry Desk',
      title: 'Consult Directly for DLF Phase 3',
      description: 'Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.',
      confidentialityNote: 'Strict client confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Expert Guidance & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, pricing benchmarks, and zoning in DLF Phase 3.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Micro-Market Authority' },
      { value: '100%', label: 'Clean Freehold Titles' },
      { value: '₹500+ Cr', label: 'Transactions Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Due Diligence',
      cardBadgeDesc: 'Title clearance, registry representation & architect consultation'
    },
    locationSectionCards: {
      cardBadge: 'Prime Location Estate',
      cardTag: 'Direct Sector Mandate',
      cardTitle: 'DLF Phase 3 Prime Micro-Market'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold Title Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'DLF Phase 3 Micro-Market Intelligence'
    }
  },
  'dlf-phase-4': {
    inventorySection: {
      badge: 'Verified Real Estate',
      title: 'Available Properties in DLF Phase 4',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Inquiry Desk',
      title: 'Consult Directly for DLF Phase 4',
      description: 'Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.',
      confidentialityNote: 'Strict client confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Expert Guidance & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, pricing benchmarks, and zoning in DLF Phase 4.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Micro-Market Authority' },
      { value: '100%', label: 'Clean Freehold Titles' },
      { value: '₹500+ Cr', label: 'Transactions Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Due Diligence',
      cardBadgeDesc: 'Title clearance, registry representation & architect consultation'
    },
    locationSectionCards: {
      cardBadge: 'Prime Location Estate',
      cardTag: 'Direct Sector Mandate',
      cardTitle: 'DLF Phase 4 Prime Micro-Market'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold Title Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'DLF Phase 4 Micro-Market Intelligence'
    }
  },
  'shushant-lok': {
    inventorySection: {
      badge: 'Verified Real Estate',
      title: 'Available Properties in Sushant Lok',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Inquiry Desk',
      title: 'Consult Directly for Sushant Lok',
      description: 'Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.',
      confidentialityNote: 'Strict client confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Expert Guidance & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, pricing benchmarks, and zoning in Sushant Lok.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Micro-Market Authority' },
      { value: '100%', label: 'Clean Freehold Titles' },
      { value: '₹500+ Cr', label: 'Transactions Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Due Diligence',
      cardBadgeDesc: 'Title clearance, registry representation & architect consultation'
    },
    locationSectionCards: {
      cardBadge: 'Prime Location Estate',
      cardTag: 'Direct Sector Mandate',
      cardTitle: 'Sushant Lok Prime Micro-Market'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold Title Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'Sushant Lok Micro-Market Intelligence'
    }
  },
  'udyog-vihar': {
    inventorySection: {
      badge: 'Verified Commercial & Industrial',
      title: 'Available Commercial Properties in Udyog Vihar',
      linkText: 'View Full Catalog'
    },
    inquiryForm: {
      badge: 'Confidential Commercial Desk',
      title: 'Consult Directly for Udyog Vihar',
      description: 'Fill out the form below. Arun Sharma or our corporate leasing principals will contact you within 2 business hours.',
      confidentialityNote: 'Strict corporate confidentiality. Zero spam.',
      buttonText: 'Send Inquiry'
    },
    faqsInfo: {
      badge: 'Corporate Advisory & Insights',
      title: 'Frequently Asked Questions',
      subtitle: 'Key questions answered regarding acquisitions, lease yields, and HSIIDC zoning in Udyog Vihar.'
    },
    whyChooseStats: [
      { value: '25+ Yrs', label: 'Corporate Authority' },
      { value: '100%', label: 'HSIIDC Mutation Vetted' },
      { value: '₹500+ Cr', label: 'Leases Facilitated' }
    ],
    howWeHelpCards: {
      cardBadgeTitle: 'Turnkey Commercial Due Diligence',
      cardBadgeDesc: 'HSIIDC title clearance, lease structuring & fire NOC approvals'
    },
    locationSectionCards: {
      cardBadge: 'Premier Corporate Hub',
      cardTag: 'Direct Industrial Mandate',
      cardTitle: 'Udyog Vihar Strategic Corporate Hub'
    },
    heroExtra: {
      trustBadges: [
        '25+ Years Authority',
        '100% Freehold & HSIIDC Vetted',
        'Direct Seller Mandates'
      ],
      intelligenceTagline: 'Udyog Vihar Micro-Market Intelligence'
    }
  }
};

async function main() {
  console.log('1. Updating in-memory CORRIDOR_PAGES_DATA and writing to corridorPagesData.js...');
  const updatedData = { ...CORRIDOR_PAGES_DATA };

  for (const [slug, extras] of Object.entries(CORRIDOR_EXTRA_FIELDS)) {
    if (!updatedData[slug]) continue;
    const c = updatedData[slug];

    c.inventorySection = {
      ...extras.inventorySection,
      ...(c.inventorySection || {})
    };

    c.inquiryForm = {
      ...extras.inquiryForm,
      ...(c.inquiryForm || {})
    };

    c.faqsInfo = {
      ...extras.faqsInfo,
      ...(c.faqsInfo || {})
    };

    c.whyChooseSaudagar = {
      ...(c.whyChooseSaudagar || {}),
      stats: c.whyChooseSaudagar?.stats || extras.whyChooseStats
    };

    c.howWeHelp = {
      ...(c.howWeHelp || {}),
      cardBadgeTitle: c.howWeHelp?.cardBadgeTitle || extras.howWeHelpCards.cardBadgeTitle,
      cardBadgeDesc: c.howWeHelp?.cardBadgeDesc || extras.howWeHelpCards.cardBadgeDesc
    };

    c.locationSection = {
      ...(c.locationSection || {}),
      cardBadge: c.locationSection?.cardBadge || extras.locationSectionCards.cardBadge,
      cardTag: c.locationSection?.cardTag || extras.locationSectionCards.cardTag,
      cardTitle: c.locationSection?.cardTitle || extras.locationSectionCards.cardTitle
    };

    c.hero = {
      ...(c.hero || {}),
      trustBadges: c.hero?.trustBadges || extras.heroExtra.trustBadges,
      intelligenceTagline: c.hero?.intelligenceTagline || extras.heroExtra.intelligenceTagline
    };
  }

  // Write to src/constants/corridorPagesData.js
  const filePath = path.resolve('src/constants/corridorPagesData.js');
  const fileContent = `/**
 * Corridor Landing Pages Data
 * ============================================================================
 * Comprehensive content structure for dedicated micro-market property pages
 * (e.g. /property/dlf-phase-1, /property/dlf-phase-2, etc.)
 */

export const CORRIDOR_PAGES_DATA = ${JSON.stringify(updatedData, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log('✓ Successfully updated src/constants/corridorPagesData.js with all section defaults!');

  // Connect to MongoDB and update sectioncontents
  console.log('\n2. Connecting to MongoDB Atlas to sync existing sectioncontents documents...');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  for (const [slug, extras] of Object.entries(CORRIDOR_EXTRA_FIELDS)) {
    const sectionKey = `corridor_${slug}`;
    console.log(`Checking ${sectionKey}...`);
    const doc = await db.collection('sectioncontents').findOne({ sectionKey });
    
    if (doc && doc.data) {
      const d = doc.data;
      
      d.inventorySection = {
        ...extras.inventorySection,
        ...(d.inventorySection || {})
      };

      d.inquiryForm = {
        ...extras.inquiryForm,
        ...(d.inquiryForm || {})
      };

      d.faqsInfo = {
        ...extras.faqsInfo,
        ...(d.faqsInfo || {})
      };

      d.whyChooseSaudagar = {
        ...(d.whyChooseSaudagar || {}),
        stats: d.whyChooseSaudagar?.stats || extras.whyChooseStats
      };

      d.howWeHelp = {
        ...(d.howWeHelp || {}),
        cardBadgeTitle: d.howWeHelp?.cardBadgeTitle || extras.howWeHelpCards.cardBadgeTitle,
        cardBadgeDesc: d.howWeHelp?.cardBadgeDesc || extras.howWeHelpCards.cardBadgeDesc
      };

      d.locationSection = {
        ...(d.locationSection || {}),
        cardBadge: d.locationSection?.cardBadge || extras.locationSectionCards.cardBadge,
        cardTag: d.locationSection?.cardTag || extras.locationSectionCards.cardTag,
        cardTitle: d.locationSection?.cardTitle || extras.locationSectionCards.cardTitle
      };

      d.hero = {
        ...(d.hero || {}),
        trustBadges: d.hero?.trustBadges || extras.heroExtra.trustBadges,
        intelligenceTagline: d.hero?.intelligenceTagline || extras.heroExtra.intelligenceTagline
      };

      await db.collection('sectioncontents').updateOne(
        { sectionKey },
        { $set: { data: d, updatedAt: new Date() } }
      );
      console.log(`✓ Updated ${sectionKey} in MongoDB with complete section fields!`);
    } else {
      console.log(`Document ${sectionKey} not found in DB; creating from updatedData...`);
      await db.collection('sectioncontents').insertOne({
        sectionKey,
        pageTitle: `Corridor: ${slug.toUpperCase()}`,
        data: updatedData[slug],
        updatedAt: new Date()
      });
      console.log(`✓ Inserted ${sectionKey} into MongoDB!`);
    }
  }

  console.log('\nAll 6 corridors synced successfully across both code and MongoDB database!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in sync script:', err);
  process.exit(1);
});
