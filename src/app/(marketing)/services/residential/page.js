import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import ResidentialServiceView from '@/components/services/ResidentialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  const fallbackSeo = PAGE_SEO['/services/residential'];
  return await getDynamicPageSeo('/services/residential', {
    title: fallbackSeo?.title,
    description: fallbackSeo?.description,
    canonical: '/services/residential',
  });
}

async function getResidentialData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_residential' }).lean();
    return doc?.data || null;
  } catch (err) {
    console.error('Error fetching page_residential from DB:', err?.message);
    return null;
  }
}

export default async function ResidentialServicesPage() {
  const [residentialListings, pageData, breadcrumbs] = await Promise.all([
    getProperties({ category: 'residential', limit: 4 }),
    getResidentialData(),
    getDynamicBreadcrumbs('/services/residential'),
  ]);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ResidentialServiceView
        initialData={pageData}
        residentialListings={residentialListings}
        breadcrumbs={breadcrumbs}
        typologies={pageData?.assetClasses || []}
        microMarkets={pageData?.microMarkets || []}
        dueDiligenceSteps={pageData?.dueDiligenceSteps || []}
        specificationStandards={pageData?.specificationStandards || []}
      />
    </>
  );
}
