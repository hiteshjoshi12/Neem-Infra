import React, { useEffect } from 'react';
import AboutHero from '../../sections/about/AboutHero';
import AboutVideoShowcase from '../../sections/about/AboutVideoShowcase';
import AboutOfferings from '../../sections/about/AboutOfferings';
import AboutProposition from '../../sections/about/AboutProposition';
import AboutLeadership from '../../sections/about/AboutLeadership';
import AboutConsultationCta from '../../sections/about/AboutConsultationCta';
import LocationMap from '../../sections/home/LocationMap';
import SEOHead from '../../components/seo/SEOHead';
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '../../lib/seo/seoConfig';

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1D263B] selection:bg-[#D09A16]/30 selection:text-[#0C101A]">
      <SEOHead {...PAGE_SEO['/about']} />
      <BreadcrumbJsonLd items={BREADCRUMBS['/about']} />
      
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

      {/* 6. Headquarters & Location Map */}
      <LocationMap />

      {/* 7. Request a Free Consultation Action Banner */}
      <AboutConsultationCta />
    </div>
  );
}
