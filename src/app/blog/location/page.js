import React from 'react';
import Link from 'next/link';
import { MapPin, Compass, Building2, Navigation, ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getLocations } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Gurugram Real Estate Corridors & Micro-Market Guides | Saudagar Properties',
    description: 'Explore authoritative guides across DLF Phase 1–5, Golf Course Road, Cyber City, and prime Gurugram micro-markets. Verified pricing, plot sizes, and investment insights.',
    path: '/blog/location',
    canonical: '/blog/location',
    keywords: [
      'Gurugram Real Estate Corridors',
      'DLF Phase 1 to 5',
      'Golf Course Road Properties',
      'Cyber City Commercial Real Estate',
      'Gurugram Builder Floors',
      'Saudagar Properties'
    ],
  });
}

export default async function BlogLocationsDirectoryPage() {
  const locations = await getLocations();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Locations', url: '/blog/location' },
  ];

  // Group locations logically
  const dlfPhases = locations.filter(l => l.slug.startsWith('dlf-phase'));
  const primeAvenues = locations.filter(l => 
    l.slug === 'golf-course-road' || 
    l.slug === 'golf-course-extension' || 
    l.slug === 'mg-road' || 
    l.slug === 'sohna-road'
  );
  const commercialAndOther = locations.filter(l => 
    l.slug === 'cyber-city' || 
    l.slug === 'sushant-lok-1' ||
    l.slug === 'gurugram'
  );

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#D09A16] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <header className="mb-14 pb-10 border-b border-[#17213D]/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/30 mb-4">
              <Compass size={12} />
              <span>Geographic Real Estate Topology</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-5 tracking-tight">
              Gurugram Real Estate Corridors & Local Guides
            </h1>
            <p className="text-base sm:text-lg text-[#566078] max-w-3xl leading-relaxed font-light">
              Detailed corridor-by-corridor intelligence covering land zoning, builder floor price benchmarks, verified coordinates, and legal due diligence across DLF Gurugram.
            </p>
          </header>

          {/* DLF Phase Enclaves */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Building2 size={20} className="text-[#D09A16]" />
              <h2 className="font-serif font-bold text-2xl text-[#17213D]">
                DLF Residential Phases (Phase 1 to 5)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dlfPhases.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/blog/location/${loc.slug}`}
                  className="p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16] transition-all duration-300 shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8892A6] mb-3">
                      <span className="inline-flex items-center gap-1 text-[#D09A16] font-semibold">
                        <MapPin size={12} />
                        <span>{loc.city}, Haryana</span>
                      </span>
                      {loc.coordinates && (
                        <span className="font-mono text-[10px]">
                          {loc.coordinates.latitude.toFixed(2)}°N, {loc.coordinates.longitude.toFixed(2)}°E
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors mb-2">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#566078] line-clamp-3 leading-relaxed mb-4">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-xs font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                    <span>Explore Corridor Guide</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Prime Expressways & Avenues */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Navigation size={20} className="text-[#D09A16]" />
              <h2 className="font-serif font-bold text-2xl text-[#17213D]">
                Prime Expressways & Growth Avenues
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {primeAvenues.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/blog/location/${loc.slug}`}
                  className="p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16] transition-all duration-300 shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8892A6] mb-3">
                      <span className="inline-flex items-center gap-1 text-[#D09A16] font-semibold">
                        <MapPin size={12} />
                        <span>Arterial Expressway</span>
                      </span>
                      {loc.coordinates && (
                        <span className="font-mono text-[10px]">
                          {loc.coordinates.latitude.toFixed(2)}°N, {loc.coordinates.longitude.toFixed(2)}°E
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors mb-2">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#566078] line-clamp-3 leading-relaxed mb-4">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-xs font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                    <span>Explore Corridor Guide</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Commercial & Mixed-Use Districts */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={20} className="text-[#D09A16]" />
              <h2 className="font-serif font-bold text-2xl text-[#17213D]">
                Commercial Core & Macro Hubs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {commercialAndOther.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/blog/location/${loc.slug}`}
                  className="p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16] transition-all duration-300 shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8892A6] mb-3">
                      <span className="inline-flex items-center gap-1 text-[#D09A16] font-semibold">
                        <MapPin size={12} />
                        <span>Key District</span>
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors mb-2">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#566078] line-clamp-3 leading-relaxed mb-4">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-xs font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                    <span>Explore Corridor Guide</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </PublicLayout>
  );
}
