import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingWidgets from '../components/ui/FloatingWidgets';
import OrganizationJsonLd from '../components/seo/OrganizationJsonLd';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWidgets />
      <OrganizationJsonLd />
    </div>
  );
}
