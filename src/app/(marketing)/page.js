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

export async function generateMetadata() {
  return await getDynamicPageSeo('/', {
    title: PAGE_SEO['/']?.title,
    description: PAGE_SEO['/']?.description,
    canonical: '/',
  });
}

export default async function Home() {
  const breadcrumbs = await getDynamicBreadcrumbs('/');
  let featuredProperties = [];
  try {
    featuredProperties = await getProperties({ isFeatured: true });
  } catch (err) {
    console.warn('[Home SSR] Error loading featured properties:', err?.message);
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. Hero Section */}
      <Hero initialProperties={featuredProperties} />

      {/* 2. Top Real Estate Consultant in DLF Gurugram & Video Tour Section */}
      <TopConsultantSection />

      {/* 3. Curated Corridors 3D Section (Featured Properties) */}
      <CuratedCorridors initialProperties={featuredProperties} />

      {/* 4. Our Services Section */}
      <OurServicesSection />

      {/* 5. Why Choose Our Company Section */}
      <WhyChooseUsSection />

      {/* 6. Below-the-fold Client Dynamic Sections (Modal, Testimonials, Map, Newsletter) */}
      <HomeBelowTheFold />
    </div>
  );
}
