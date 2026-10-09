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
    <div className="w-full min-h-screen bg-[#F7F5EF] animate-pulse">
      <div className="bg-[#0A0E17] pt-28 pb-10 sm:pt-32 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-32 bg-white/10 rounded mb-4" />
          <div className="h-10 w-80 bg-white/20 rounded mb-3" />
          <div className="h-4 w-full max-w-xl bg-white/10 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="h-28 bg-white rounded-2xl border border-gray-200 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-white rounded-3xl border border-gray-200" />
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
