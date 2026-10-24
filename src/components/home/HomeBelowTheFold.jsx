'use client';

import dynamic from 'next/dynamic';

const TestimonialsSection = dynamic(() => import('@/sections/home/TestimonialsSection'), { ssr: false });
const LocationMap = dynamic(() => import('@/sections/home/LocationMap'), { ssr: false });
const NewsletterSection = dynamic(() => import('@/sections/home/NewsletterSection'), { ssr: false });
const LeadInquiryModal = dynamic(() => import('@/components/home/LeadInquiryModal'), { ssr: false });

export default function HomeBelowTheFold() {
  return (
    <>
      <LeadInquiryModal />
      <TestimonialsSection />
      <LocationMap />
      <NewsletterSection />
    </>
  );
}
