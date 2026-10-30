import nextDynamic from 'next/dynamic';
// Toggle between original Hero and Option 1 Split-Screen Focus (HeroCopy)
import Hero from '@/sections/home/HeroCopy';
// import Hero from '@/sections/home/Hero';
import TopConsultantSection from '@/sections/home/TopConsultantSection';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

const CuratedCorridors = nextDynamic(() => import('@/sections/home/CuratedCorridors'));
const OurServicesSection = nextDynamic(() => import('@/sections/home/OurServicesSection'));
const WhyChooseUsSection = nextDynamic(() => import('@/sections/home/WhyChooseUsSection'));
import HomeBelowTheFold from '@/components/home/HomeBelowTheFold';

export const revalidate = 60;

import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';
import { getProperties } from '@/services/propertyService';
import { getAllSections, getTestimonials } from '@/lib/dal';

export async function generateMetadata() {
  return await getDynamicPageSeo('/', {
    title: PAGE_SEO['/']?.title,
    description: PAGE_SEO['/']?.description,
    canonical: '/',
  });
}

export default async function Home() {
  const [breadcrumbs, sections, featuredProperties, testimonials] = await Promise.all([
    getDynamicBreadcrumbs('/'),
    getAllSections().catch(() => ({})),
    getProperties({ isFeatured: true }).catch((err) => {
      console.warn('[Home SSR] Error loading featured properties:', err?.message);
      return [];
    }),
    getTestimonials(10).catch(() => []),
  ]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. Hero Section */}
      <Hero initialProperties={featuredProperties} initialHeroData={sections?.hero} />

      {/* 2. Top Real Estate Consultant in DLF Gurugram & Video Tour Section */}
      <TopConsultantSection initialData={sections?.topConsultant} />

      {/* 3. Curated Corridors 3D Section (Featured Properties) */}
      <CuratedCorridors initialProperties={featuredProperties} initialSectionData={sections?.curatedCorridors} />

      {/* 4. Our Services Section */}
      <OurServicesSection initialData={sections?.services} />

      {/* 5. Why Choose Our Company Section */}
      <WhyChooseUsSection initialData={sections?.whyChooseUs} />

      {/* 6. Below-the-fold Client Dynamic Sections (Modal, Testimonials, Map, Newsletter) */}
      <HomeBelowTheFold initialTestimonials={testimonials} initialSections={sections} />
    </div>
  );
}
