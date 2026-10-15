import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import IndustrialServiceView from '@/components/services/IndustrialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/industrial'];
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: `${SITE_URL}${seoData.canonical}`,
    },
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: `${SITE_URL}${seoData.canonical}`,
      type: 'website',
      siteName: SITE_NAME,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Industrial Warehouses and Plots in Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

async function getIndustrialData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_industrial' }).lean();
    return doc?.data || null;
  } catch (err) {
    console.error('Error fetching page_industrial from DB:', err?.message);
    return null;
  }
}

import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export default async function IndustrialServicesPage() {
  const [industrialListings, pageData] = await Promise.all([
    getProperties({ category: 'industrial', limit: 4 }),
    getIndustrialData(),
  ]);
  const breadcrumbs = BREADCRUMBS['/services/industrial'];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <IndustrialServiceView
        initialData={pageData}
        industrialListings={industrialListings}
        breadcrumbs={breadcrumbs}
        assetClasses={pageData?.assetClasses?.length ? pageData.assetClasses : DEFAULT_SECTIONS.page_industrial.assetClasses}
        corridors={pageData?.corridors?.length ? pageData.corridors : DEFAULT_SECTIONS.page_industrial.corridors}
        complianceSteps={pageData?.complianceSteps?.length ? pageData.complianceSteps : DEFAULT_SECTIONS.page_industrial.complianceSteps}
        engineeringStandards={pageData?.engineeringStandards?.length ? pageData.engineeringStandards : DEFAULT_SECTIONS.page_industrial.engineeringStandards}
      />
    </>
  );
}
