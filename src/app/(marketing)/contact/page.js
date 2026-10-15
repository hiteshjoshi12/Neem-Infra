import ContactClient from '@/sections/contact/ContactClient';
import LocationMap from '@/sections/home/LocationMap';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const seoData = PAGE_SEO['/contact'] || {
    title: 'Contact Us | Saudagar Properties Gurugram',
    description: 'Connect with our senior partners for luxury real estate advisory in Gurugram.',
    canonical: '/contact',
  };
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
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
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5]">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Client Component containing animations and form */}
      <ContactClient initialData={pageData} />

      {/* Reuse Existing Location Map Component */}
      <LocationMap />
    </div>
  );
}
