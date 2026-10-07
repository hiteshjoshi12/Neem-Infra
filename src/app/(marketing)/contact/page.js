import ContactClient from '@/sections/contact/ContactClient';
import LocationMap from '@/sections/home/LocationMap';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

export async function generateMetadata() {
  const seoData = PAGE_SEO['/contact'];
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default function Contact() {
  const breadcrumbs = BREADCRUMBS['/contact'] || [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5]">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Client Component containing animations and form */}
      <ContactClient />

      {/* Reuse Existing Location Map Component */}
      <LocationMap />
    </div>
  );
}
