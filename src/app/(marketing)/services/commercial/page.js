import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import CommercialServiceView from '@/components/services/CommercialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDynamicPageSeo } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  const fallbackSeo = PAGE_SEO['/services/commercial'];
  return await getDynamicPageSeo('/services/commercial', {
    title: fallbackSeo?.title,
    description: fallbackSeo?.description,
    canonical: '/services/commercial',
  });
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
