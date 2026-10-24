import AboutHero from '@/sections/about/AboutHero';
import AboutVideoShowcase from '@/sections/about/AboutVideoShowcase';
import AboutOfferings from '@/sections/about/AboutOfferings';
import AboutProposition from '@/sections/about/AboutProposition';
import AboutLeadership from '@/sections/about/AboutLeadership';
import AboutWhyChooseUs from '@/sections/about/AboutWhyChooseUs';
import AboutConsultationCta from '@/sections/about/AboutConsultationCta';
import LocationMap from '@/sections/home/LocationMap';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO } from '@/lib/seo/seoConfig';
import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';
import { getSectionByKey } from '@/lib/dal';

export const revalidate = 60;

export async function generateMetadata() {
  return await getDynamicPageSeo('/about', {
    title: PAGE_SEO['/about']?.title,
    description: PAGE_SEO['/about']?.description,
    canonical: '/about',
  });
}

export default async function About() {
  const [breadcrumbs, aboutData] = await Promise.all([
    getDynamicBreadcrumbs('/about'),
    getSectionByKey('page_about')
  ]);

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. Hero Section & Mission Statement */}
      <AboutHero data={aboutData?.hero} />

      {/* 2. Official Corporate Showcase Video Player */}
      <AboutVideoShowcase data={aboutData?.videoShowcase} />

      {/* 3. Core Property Offerings (Kothis/Flats, Office Spaces, Plots) */}
      <AboutOfferings data={aboutData?.offerings} />

      {/* 4. Three Pillars of Value Proposition (Residential, Commercial, Industrial) */}
      <AboutProposition data={aboutData?.proposition} />

      {/* 5. Founders & Leadership Team (Mr. Arun Sharma & Mrs. Suneeta Chawla) */}
      <AboutLeadership data={aboutData?.leadership} />

      {/* 6. Why Choose Us • 7 Strategic Distinction Pillars & Matrix */}
      <AboutWhyChooseUs data={aboutData?.whyChooseUs} />

      {/* 7. Headquarters & Location Map */}
      <LocationMap />

      {/* 8. Request a Free Consultation Action Banner */}
      <AboutConsultationCta data={aboutData?.consultationCta} />
    </div>
  );
}
