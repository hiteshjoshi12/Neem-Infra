import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import CommercialServiceView from '@/components/services/CommercialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/commercial'];
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
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Grade-A Commercial Real Estate in Cyber City Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

async function getCommercialData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_commercial' }).lean();
    return doc?.data || null;
  } catch (err) {
    console.error('Error fetching page_commercial from DB:', err?.message);
    return null;
  }
}

import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export default async function CommercialServicesPage() {
  const [commercialListings, pageData] = await Promise.all([
    getProperties({ category: 'commercial', limit: 4 }),
    getCommercialData(),
  ]);
  const breadcrumbs = BREADCRUMBS['/services/commercial'];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CommercialServiceView
        initialData={pageData}
        commercialListings={commercialListings}
        breadcrumbs={breadcrumbs}
        assetClasses={pageData?.assetClasses?.length ? pageData.assetClasses : DEFAULT_SECTIONS.page_commercial.assetClasses}
        yieldBenchmarks={pageData?.yieldBenchmarks?.length ? pageData.yieldBenchmarks : DEFAULT_SECTIONS.page_commercial.yieldBenchmarks}
        leaseFramework={pageData?.leaseFramework?.length ? pageData.leaseFramework : DEFAULT_SECTIONS.page_commercial.leaseFramework}
        complianceStandards={pageData?.complianceStandards?.length ? pageData.complianceStandards : DEFAULT_SECTIONS.page_commercial.complianceStandards}
      />
    </>
  );
}
