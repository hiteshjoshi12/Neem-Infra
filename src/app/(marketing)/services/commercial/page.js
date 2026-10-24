import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
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
        assetClasses={pageData?.assetClasses || []}
        yieldBenchmarks={pageData?.yieldBenchmarks || []}
        leaseFramework={pageData?.leaseFramework || []}
        complianceStandards={pageData?.complianceStandards || []}
      />
    </>
  );
}
