import nextDynamic from 'next/dynamic';
// Toggle between original Hero and Option 1 Split-Screen Focus (HeroCopy)
import Hero from '@/sections/home/HeroCopy';
// import Hero from '@/sections/home/Hero';
import TopConsultantSection from '@/sections/home/TopConsultantSection';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

const CuratedCorridors = nextDynamic(() => import('@/sections/home/CuratedCorridors'), { ssr: true });
const OurServicesSection = nextDynamic(() => import('@/sections/home/OurServicesSection'), { ssr: true });
const WhyChooseUsSection = nextDynamic(() => import('@/sections/home/WhyChooseUsSection'), { ssr: true });
const AiShowcaseSection = nextDynamic(() => import('@/sections/home/AiShowcaseSection'), { ssr: true });
const TestimonialsSection = nextDynamic(() => import('@/sections/home/TestimonialsSection'), { ssr: true });
const LocationMap = nextDynamic(() => import('@/sections/home/LocationMap'), { ssr: true });
const NewsletterSection = nextDynamic(() => import('@/sections/home/NewsletterSection'), { ssr: true });

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getDynamicPageSeo } from '@/lib/seo/dynamicSeo';
import LeadInquiryModal from '@/components/home/LeadInquiryModal';

export async function generateMetadata() {
  return await getDynamicPageSeo('/', {
    title: PAGE_SEO['/']?.title,
    description: PAGE_SEO['/']?.description,
    canonical: '/',
  });
}

export default function Home() {
  const breadcrumbs = BREADCRUMBS['/'];

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 5-Second Timed Consultation Popup */}
      <LeadInquiryModal />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Top Real Estate Consultant in DLF Gurugram & Video Tour Section */}
      <TopConsultantSection />

      {/* 3. Curated Corridors 3D Section (Featured Properties) */}
      <CuratedCorridors />

      {/* 4. Our Services Section */}
      <OurServicesSection />

      {/* 5. Why Choose Our Company Section */}
      <WhyChooseUsSection />

      {/* 5.5 AI / AEO Showcase Section */}
      {/* <AiShowcaseSection /> */}

      {/* 6. Testimonials Section */}
      <TestimonialsSection />

      {/* 7. Location Map & Market Intelligence Section */}
      <LocationMap />

      {/* 8. Newsletter Subscription Banner */}
      <NewsletterSection />
    </div>
  );
}
