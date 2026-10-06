import React from 'react';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingWidgets from '../components/ui/FloatingWidgets';
import OrganizationJsonLd from '../components/seo/OrganizationJsonLd';

export default function PublicLayout({ children, asMain = true }) {
  const MainTag = asMain ? 'main' : 'div';
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <Navbar />
      <MainTag className="flex-grow">
        {children}
      </MainTag>
      <Footer />
      <FloatingWidgets />
      <OrganizationJsonLd />
    </div>
  );
}
