import { getProperties, getPropertyBySlug } from '@/services/propertyService';
import PublicLayout from '@/layouts/PublicLayout';
import { notFound } from 'next/navigation';
import PropertyJsonLd from '@/components/seo/PropertyJsonLd';
import PropertyDetailClient from '@/components/properties/PropertyDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const properties = await getProperties({ all: false });
  return (properties || [])
    .map(p => ({ slug: p.slug || p._id?.toString() || p.id }))
    .filter(p => Boolean(p.slug));
}

import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  
  if (!property) {
    return buildPageMetadata({
      title: 'Property Not Found',
      description: 'The requested luxury property could not be located in our portfolio.',
      path: '/properties',
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: `${property.title} in ${property.location || 'DLF Gurugram'} | Saudagar Properties`,
    description: property.desc ? property.desc.slice(0, 160) : `Exclusive luxury property listing in ${property.location}. Freehold title verified.`,
    path: `/properties/${slug}`,
    canonical: `/properties/${slug}`,
    image: property.img,
    imageAlt: property.title,
    keywords: [property.title, property.location, property.category, 'DLF Gurugram Luxury Real Estate', 'Builder Floor Gurgaon'].filter(Boolean),
  });
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <PublicLayout>
      <PropertyJsonLd property={property} />
      <PropertyDetailClient property={property} />
    </PublicLayout>
  );
}
