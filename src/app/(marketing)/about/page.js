import AboutHero from '@/sections/about/AboutHero';
import AboutVideoShowcase from '@/sections/about/AboutVideoShowcase';
import AboutOfferings from '@/sections/about/AboutOfferings';
import AboutProposition from '@/sections/about/AboutProposition';
import AboutLeadership from '@/sections/about/AboutLeadership';
import AboutWhyChooseUs from '@/sections/about/AboutWhyChooseUs';
import AboutConsultationCta from '@/sections/about/AboutConsultationCta';
import LocationMap from '@/sections/home/LocationMap';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  return await getDynamicPageSeo('/about', {
    title: PAGE_SEO['/about']?.title,
    description: PAGE_SEO['/about']?.description,
    canonical: '/about',
  });
}

export default async function About() {
  const breadcrumbs = await getDynamicBreadcrumbs('/about');

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. Hero Section & Mission Statement */}
      <AboutHero />

      {/* 2. Official Corporate Showcase Video Player */}
      <AboutVideoShowcase />

      {/* 3. Core Property Offerings (Kothis/Flats, Office Spaces, Plots) */}
      <AboutOfferings />

      {/* 4. Three Pillars of Value Proposition (Residential, Commercial, Industrial) */}
      <AboutProposition />

      {/* 5. Founders & Leadership Team (Mr. Arun Sharma & Mrs. Suneeta Chawla) */}
      <AboutLeadership />

      {/* 6. Why Choose Us • 7 Strategic Distinction Pillars & Matrix */}
      <AboutWhyChooseUs />

      {/* 7. Headquarters & Location Map */}
      <LocationMap />

      {/* 8. Request a Free Consultation Action Banner */}
      <AboutConsultationCta />
    </div>
  );
}
