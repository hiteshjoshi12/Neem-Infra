import ContactClient from '@/sections/contact/ContactClient';
import LocationMap from '@/sections/home/LocationMap';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return await getDynamicPageSeo('/contact', {
    title: PAGE_SEO['/contact']?.title,
    description: PAGE_SEO['/contact']?.description,
    canonical: '/contact',
  });
}

async function getContactData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_contact' }).lean();
    return doc?.data || null;
  } catch (err) {
    console.error('Error fetching page_contact from DB:', err?.message);
    return null;
  }
}

export default async function Contact() {
  const pageData = await getContactData();
  const breadcrumbs = BREADCRUMBS['/contact'] || [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory-warm">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Client Component containing animations and form */}
      <ContactClient initialData={pageData} />

      {/* Reuse Existing Location Map Component */}
      <LocationMap />
    </div>
  );
}
