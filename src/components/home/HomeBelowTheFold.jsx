'use client';

import dynamic from 'next/dynamic';
import TestimonialsSection from '@/sections/home/TestimonialsSection';
import LocationMap from '@/sections/home/LocationMap';
import NewsletterSection from '@/sections/home/NewsletterSection';

const LeadInquiryModal = dynamic(() => import('@/components/home/LeadInquiryModal'), { ssr: false });

export default function HomeBelowTheFold({ initialTestimonials = [], initialSections = {} }) {
  return (
    <>
      <LeadInquiryModal />
      <TestimonialsSection
        initialTestimonials={initialTestimonials}
        initialSectionData={initialSections?.testimonials}
      />
      <LocationMap />
      <NewsletterSection />
    </>
  );
}
