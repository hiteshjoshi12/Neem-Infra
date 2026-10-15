import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import ResidentialServiceView from '@/components/services/ResidentialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/residential'];
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
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Luxury Residential Real Estate in DLF Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    },
  };
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
