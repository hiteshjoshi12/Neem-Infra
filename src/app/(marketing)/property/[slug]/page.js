import { notFound } from 'next/navigation';
import { getProperties } from '@/services/propertyService';
import PropertyLandingView from '@/components/property-landing/PropertyLandingView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCorridor(slug) {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: `corridor_${slug}` }).lean();
    if (doc?.data) return doc.data;
  } catch (err) {
    console.warn(`[Corridor] Database fetch error:`, err?.message);
  }
  return null;
}

import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';

export async function generateMetadata(props) {
  const params = await props.params;
  const rawSlug = params?.slug;
  const slug = rawSlug === 'sushant-lok' ? 'shushant-lok' : rawSlug;
  const corridor = await getCorridor(slug);

  const corridorName = corridor?.corridorName || slug.replace(/-/g, ' ');
  const defaultTitle = `Best Property in ${corridorName} | Saudagar Properties Gurugram`;
  const defaultDesc = corridor?.hero?.subtitle
    ? corridor.hero.subtitle.substring(0, 155) + '...'
    : `Explore luxury builder floors, kothis, and residential plots in ${corridorName} Gurugram with Saudagar Properties.`;

  return await getDynamicPageSeo(`/property/${slug}`, {
    title: defaultTitle,
    description: defaultDesc,
    canonical: `/property/${slug}`,
    keywords: [
      `Best Property in ${corridorName}`,
      `${corridorName} Gurugram`,
      `Luxury Builder Floors ${corridorName}`,
      `DLF Phase 1 plots`,
      `Saudagar Properties ${corridorName}`,
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

  const [properties, dynamicBreadcrumbs] = await Promise.all([
    getProperties({
      location: locationFilter,
      limit: 6
    }),
    getDynamicBreadcrumbs(`/property/${slug}`),
  ]);

  const breadcrumbs = dynamicBreadcrumbs?.length > 1 ? dynamicBreadcrumbs : [
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
