import { notFound } from 'next/navigation';
import { getProperties } from '@/services/propertyService';
import PropertyLandingView from '@/components/property-landing/PropertyLandingView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';
import { SITE_URL } from '@/lib/seo/seoConfig';

import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { CORRIDOR_PAGES_DATA } from '@/constants/corridorPagesData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCorridor(slug) {
  const fallback = CORRIDOR_PAGES_DATA[slug] || null;
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: `corridor_${slug}` }).lean();
    if (doc?.data) {
      if (!fallback) return doc.data;
      return {
        ...fallback,
        ...doc.data,
        overview: {
          ...fallback.overview,
          ...doc.data.overview,
          typologies: (doc.data.overview?.typologies?.length >= 3)
            ? doc.data.overview.typologies
            : (fallback.overview?.typologies || []),
        },
        whyLiveHere: {
          ...fallback.whyLiveHere,
          ...doc.data.whyLiveHere,
          pillars: (doc.data.whyLiveHere?.pillars?.length >= 8)
            ? doc.data.whyLiveHere.pillars
            : (fallback.whyLiveHere?.pillars || []),
        },
        hero: {
          ...fallback.hero,
          ...doc.data.hero,
        },
        nearestPlaces: {
          ...fallback.nearestPlaces,
          ...doc.data.nearestPlaces,
        },
        howWeHelp: {
          ...fallback.howWeHelp,
          ...doc.data.howWeHelp,
        },
        whyChooseSaudagar: {
          ...fallback.whyChooseSaudagar,
          ...doc.data.whyChooseSaudagar,
        },
        locationSection: {
          ...fallback.locationSection,
          ...doc.data.locationSection,
        },
        inventorySection: {
          ...fallback.inventorySection,
          ...doc.data.inventorySection,
        },
        inquiryForm: {
          ...fallback.inquiryForm,
          ...doc.data.inquiryForm,
        },
        faqsInfo: {
          ...fallback.faqsInfo,
          ...doc.data.faqsInfo,
        },
        mapShowcase: {
          ...fallback.mapShowcase,
          ...doc.data.mapShowcase,
        }
      };
    }
  } catch (err) {
    console.warn(`[Corridor] Database fetch error:`, err?.message);
  }
  return fallback;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const rawSlug = params?.slug;
  const slug = rawSlug === 'sushant-lok' ? 'shushant-lok' : rawSlug;
  const corridor = await getCorridor(slug);

  if (!corridor) {
    return {
      title: 'Luxury Property in DLF Gurugram | Saudagar Properties',
      description: 'Explore premier builder floors, villas, and residential plots across DLF Phase 1–5 Gurugram with Saudagar Properties.'
    };
  }

  const title = `Best Property in ${corridor.corridorName} | Saudagar Properties Gurugram`;
  const description = corridor.hero?.subtitle
    ? corridor.hero.subtitle.substring(0, 155) + '...'
    : `Explore luxury builder floors, kothis, and residential plots in ${corridor.corridorName} Gurugram with Saudagar Properties.`;

  return buildPageMetadata({
    title,
    description,
    path: `/property/${slug}`,
    canonical: `/property/${slug}`,
    keywords: [
      `Best Property in ${corridor.corridorName}`,
      `${corridor.corridorName} Gurugram`,
      `Luxury Builder Floors ${corridor.corridorName}`,
      `DLF Phase 1 plots`,
      `Saudagar Properties ${corridor.corridorName}`,
      'Property Dealers DLF Gurugram'
    ]
  });
}

export default async function PropertyCorridorPage(props) {
  const params = await props.params;
  const rawSlug = params?.slug;
  const slug = rawSlug === 'sushant-lok' ? 'shushant-lok' : rawSlug;
  const corridor = await getCorridor(slug);

  if (!corridor) {
    notFound();
  }

  // Fetch verified properties matching this micro-market
  let locationFilter = corridor.corridorName;
  if (slug === 'shushant-lok') locationFilter = 'Sushant Lok';
  if (slug === 'udyog-vihar') locationFilter = 'Udyog Vihar';

  const properties = await getProperties({
    location: locationFilter,
    limit: 6
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Properties', url: '/properties' },
    { name: corridor.corridorName, url: `/property/${slug}` }
  ];

  // Extract FAQs and build FAQPage Schema
  const faqs = corridor.faqsInfo?.faqs || corridor.faq || [];
  const validFaqs = Array.isArray(faqs)
    ? faqs
        .filter((f) => f && (f.question || f.q) && (f.answer || f.a))
        .map((f) => ({
          question: (f.question || f.q).trim(),
          answer: (f.answer || f.a).trim(),
        }))
    : [];

  const faqSchema = validFaqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null;

  // Place Schema for micro-market geographic indexing
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `https://saudagarproperties.com/property/${slug}#place`,
    name: corridor.corridorName,
    description: corridor.hero?.subtitle || corridor.hero?.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: corridor.corridorName,
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
    containedInPlace: {
      '@type': 'City',
      name: 'Gurugram',
    },
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PropertyLandingView corridor={corridor} properties={properties} />
    </>
  );
}
