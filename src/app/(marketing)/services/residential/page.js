import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import ResidentialServiceView from '@/components/services/ResidentialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDynamicPageSeo } from '@/lib/seo/dynamicSeo';

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

import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export default async function ResidentialServicesPage() {
  const [residentialListings, pageData] = await Promise.all([
    getProperties({ category: 'residential', limit: 4 }),
    getResidentialData(),
  ]);
  const breadcrumbs = BREADCRUMBS['/services/residential'];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ResidentialServiceView
        initialData={pageData}
        residentialListings={residentialListings}
        breadcrumbs={breadcrumbs}
        typologies={pageData?.assetClasses?.length ? pageData.assetClasses : DEFAULT_SECTIONS.page_residential.assetClasses}
        microMarkets={pageData?.microMarkets?.length ? pageData.microMarkets : DEFAULT_SECTIONS.page_residential.microMarkets}
        dueDiligenceSteps={pageData?.dueDiligenceSteps?.length ? pageData.dueDiligenceSteps : DEFAULT_SECTIONS.page_residential.dueDiligenceSteps}
        specificationStandards={pageData?.specificationStandards?.length ? pageData.specificationStandards : DEFAULT_SECTIONS.page_residential.specificationStandards}
      />
    </>
  );
}
