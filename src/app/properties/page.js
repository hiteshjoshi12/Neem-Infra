import { Suspense } from 'react';
import { getProperties } from '@/services/propertyService';
import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';
import PropertiesCatalogClient from '@/components/properties/PropertiesCatalogClient';

export const metadata = buildPageMetadata({
  title: 'Luxury Properties & Builder Floors DLF Gurugram',
  description: 'Explore verified ready-to-move luxury builder floors, kothis, and commercial spaces across DLF Phase 1–5, Sushant Lok, and Golf Course Road.',
  path: '/properties',
  canonical: '/properties',
  keywords: ['Luxury Builder Floors', 'DLF Phase 1-5', 'Gurugram Properties', 'Ready to Move', 'Saudagar Properties'],
});

function PropertiesCatalogSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] pt-28 pb-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-96 bg-gray-300 rounded mb-4" />
        <div className="h-5 w-full max-w-2xl bg-gray-200 rounded mb-10" />
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-20 bg-white rounded-2xl border border-gray-200 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-white rounded-3xl border border-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function PropertiesPage(props) {
  const searchParams = props?.searchParams ? await props.searchParams : {};
  
  let corridorMatch = undefined;
  if (searchParams?.location && searchParams.location !== 'all') {
    const found = [
      { id: 'dlf-phase-1', match: 'DLF Phase 1' },
      { id: 'dlf-phase-2', match: 'DLF Phase 2' },
      { id: 'dlf-phase-4', match: 'DLF Phase 4' },
      { id: 'golf-course-ext', match: 'Golf Course' },
      { id: 'sushant-lok-1', match: 'Sushant Lok' },
    ].find(c => c.id === searchParams.location);
    corridorMatch = found?.match || searchParams.location;
  }

  const properties = await getProperties({
    all: false,
    search: searchParams?.search,
    category: searchParams?.category && searchParams.category !== 'all' ? searchParams.category : undefined,
    location: corridorMatch,
    bhk: searchParams?.bhk && searchParams.bhk !== 'all' ? searchParams.bhk : undefined,
    sort: searchParams?.sort && searchParams.sort !== 'curated' ? searchParams.sort : undefined,
  });

  return (
    <PublicLayout>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' }
        ]}
      />
      <Suspense fallback={<PropertiesCatalogSkeleton />}>
        <PropertiesCatalogClient initialProperties={properties} />
      </Suspense>
    </PublicLayout>
  );
}
