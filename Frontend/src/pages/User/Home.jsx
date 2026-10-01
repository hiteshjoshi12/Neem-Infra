import React from 'react';
import Hero from '../../sections/home/Hero';
import TopConsultantSection from '../../sections/home/TopConsultantSection';
import CuratedCorridors from '../../sections/home/CuratedCorridors';
import OurServicesSection from '../../sections/home/OurServicesSection';
import WhyChooseUsSection from '../../sections/home/WhyChooseUsSection';
import TestimonialsSection from '../../sections/home/TestimonialsSection';

import LocationMap from '../../sections/home/LocationMap';
import NewsletterSection from '../../sections/home/NewsletterSection';

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5]">
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

      {/* 6. Testimonials Section */}
      <TestimonialsSection />

      {/* 7. Location Map Section */}
      <LocationMap />

      {/* 8. Newsletter Subscription Section */}
      <NewsletterSection />
    </div>
  );
}
