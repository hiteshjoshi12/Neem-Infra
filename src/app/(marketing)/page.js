import dynamic from 'next/dynamic';
// Toggle between original Hero and Option 1 Split-Screen Focus (HeroCopy)
import Hero from '@/sections/home/HeroCopy';
// import Hero from '@/sections/home/Hero';
import TopConsultantSection from '@/sections/home/TopConsultantSection';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

const CuratedCorridors = dynamic(() => import('@/sections/home/CuratedCorridors'), { ssr: true });
const OurServicesSection = dynamic(() => import('@/sections/home/OurServicesSection'), { ssr: true });
const WhyChooseUsSection = dynamic(() => import('@/sections/home/WhyChooseUsSection'), { ssr: true });
const AiShowcaseSection = dynamic(() => import('@/sections/home/AiShowcaseSection'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/sections/home/TestimonialsSection'), { ssr: true });
const LocationMap = dynamic(() => import('@/sections/home/LocationMap'), { ssr: true });

export async function generateMetadata() {
  const seoData = PAGE_SEO['/'];
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default function Home() {
  const breadcrumbs = BREADCRUMBS['/'];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F7F5EF] text-[#17213D] selection:bg-[#C6A24A] selection:text-[#0E162B]">
      <BreadcrumbJsonLd items={breadcrumbs} />
        
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
      <AiShowcaseSection />

      {/* 6. Testimonials Section */}
      <TestimonialsSection />

      {/* 7. Location Map & Market Intelligence Section */}
      <LocationMap />
    </div>
  );
}
