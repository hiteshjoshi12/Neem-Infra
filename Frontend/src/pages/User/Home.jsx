import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../sections/home/Hero';
import TopConsultantSection from '../../sections/home/TopConsultantSection';
import SEOHead from '../../components/seo/SEOHead';
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '../../lib/seo/seoConfig';

// Lazy loaded components for below-the-fold content
const CuratedCorridors = lazy(() => import('../../sections/home/CuratedCorridors'));
const OurServicesSection = lazy(() => import('../../sections/home/OurServicesSection'));
const WhyChooseUsSection = lazy(() => import('../../sections/home/WhyChooseUsSection'));
const AiShowcaseSection = lazy(() => import('../../sections/home/AiShowcaseSection'));
const TestimonialsSection = lazy(() => import('../../sections/home/TestimonialsSection'));
const LocationMap = lazy(() => import('../../sections/home/LocationMap'));
const NewsletterSection = lazy(() => import('../../sections/home/NewsletterSection'));

// A simple loading fallback
const SectionLoader = () => (
  <div className="w-full flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-[#D09A16]/30 border-t-[#D09A16] rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const location = useLocation();
  const currentPath = location.pathname;
  const seoData = PAGE_SEO[currentPath] || PAGE_SEO['/'];
  const breadcrumbs = BREADCRUMBS[currentPath] || BREADCRUMBS['/'];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5]">
      <SEOHead {...seoData} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Top Real Estate Consultant in DLF Gurugram & Video Tour Section */}
      <TopConsultantSection />

      <Suspense fallback={<SectionLoader />}>
        {/* 3. Curated Corridors 3D Section (Featured Properties) */}
        <CuratedCorridors />

        {/* 4. Our Services Section */}
        <OurServicesSection />

        {/* 5. Why Choose Our Company Section */}
        <WhyChooseUsSection />

        {/* 5.5 AI / AEO Showcase Section */}
        <AiShowcaseSection />

        {/* 6. Testimonials Section */}
        <TestimonialsSection />

        {/* 7. Location Map Section */}
        <LocationMap />

        {/* 8. Newsletter Subscription Section */}
        <NewsletterSection />
      </Suspense>
    </div>
  );
}
