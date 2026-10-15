import { notFound } from 'next/navigation';
import { CORRIDOR_PAGES_DATA } from '@/constants/corridorPagesData';
import { getProperties } from '@/services/propertyService';
import PropertyLandingView from '@/components/property-landing/PropertyLandingView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';
import { SITE_URL } from '@/lib/seo/seoConfig';

export const revalidate = 120;

export async function generateMetadata(props) {
  const params = await props.params;
  const rawSlug = params?.slug;
  const slug = rawSlug === 'sushant-lok' ? 'shushant-lok' : rawSlug;
  const corridor = CORRIDOR_PAGES_DATA[slug];

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
  const corridor = CORRIDOR_PAGES_DATA[slug];

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

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PropertyLandingView corridor={corridor} properties={properties} />
    </>
  );
}
