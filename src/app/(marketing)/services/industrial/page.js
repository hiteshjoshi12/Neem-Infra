import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import IndustrialServiceView from '@/components/services/IndustrialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  const fallbackSeo = PAGE_SEO['/services/industrial'];
  return await getDynamicPageSeo('/services/industrial', {
    title: fallbackSeo?.title,
    description: fallbackSeo?.description,
    canonical: '/services/industrial',
  });
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

export default async function IndustrialServicesPage() {
  const [industrialListings, pageData, breadcrumbs] = await Promise.all([
    getProperties({ category: 'industrial', limit: 4 }),
    getIndustrialData(),
    getDynamicBreadcrumbs('/services/industrial'),
  ]);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <IndustrialServiceView
        initialData={pageData}
        industrialListings={industrialListings}
        breadcrumbs={breadcrumbs}
        assetClasses={pageData?.assetClasses || []}
        corridors={pageData?.corridors || []}
        complianceSteps={pageData?.complianceSteps || []}
        engineeringStandards={pageData?.engineeringStandards || []}
      />
    </>
  );
}
