import React from 'react';
import Link from 'next/link';
import { Compass, Building2, Briefcase, FileText } from 'lucide-react';

export default function ContextualInternalLinks({ 
  categorySlug, 
  locationSlug, 
  currentSlug 
}) {
  const recommendations = [];

  // Always include primary residential recommendation
  recommendations.push({
    title: 'Independent Luxury Builder Floors in DLF Phase 1–5',
    href: '/services/residential',
    category: 'Core Service',
    description: 'Explore freehold 3, 4 & 5 BHK luxury builder floors with private stilt parking and elevators.',
    icon: Building2,
  });

  // Map of location corridor guides
  const LOCATION_GUIDES_MAP = {
    'dlf-phase-1': {
      title: 'DLF Phase 1 Aravalli Enclave & Builder Floor Guide',
      href: '/blog/location/dlf-phase-1',
      category: 'Corridor Guide',
      description: 'Explore 500 to 1,000 sq. yd. freehold plots, boutique 4 BHK floors, and Aravalli ridge living.',
      icon: Compass,
    },
    'dlf-phase-2': {
      title: 'DLF Phase 2 Corporate Executive Corridor Guide',
      href: '/blog/location/dlf-phase-2',
      category: 'Corridor Guide',
      description: 'Review builder floor valuations on Akashneem & Jacaranda Marg with Rapid Metro walkability.',
      icon: Compass,
    },
    'dlf-phase-3': {
      title: 'DLF Phase 3 High-Yield Builder Floors & Rental Dynamics',
      href: '/blog/location/dlf-phase-3',
      category: 'Corridor Guide',
      description: 'Discover rental income dynamics, Moulsari Avenue connectivity, and boutique floors.',
      icon: Compass,
    },
    'dlf-phase-4': {
      title: 'DLF Phase 4 & Galleria Market Enclave Guide',
      href: '/blog/location/dlf-phase-4',
      category: 'Corridor Guide',
      description: 'Explore 400 to 600 sq. yd. builder floors, Galleria Market walkability, and family livability.',
      icon: Compass,
    },
    'dlf-phase-5': {
      title: 'DLF Phase 5 Ultra-Luxury Condominiums & Penthouses',
      href: '/blog/location/dlf-phase-5',
      category: 'Corridor Guide',
      description: 'Advisory on The Camellias, The Magnolias, Horizon Center, and golf-facing trophy estates.',
      icon: Compass,
    },
    'golf-course-road': {
      title: 'Golf Course Road Billionaire Boulevard Guide',
      href: '/blog/location/golf-course-road',
      category: 'Corridor Guide',
      description: 'Valuation benchmarks along the 16-lane expressway, luxury towers, and Rapid Metro corridor.',
      icon: Compass,
    },
    'golf-course-extension': {
      title: 'Golf Course Extension Road High-Growth Corridor Guide',
      href: '/blog/location/golf-course-extension',
      category: 'Corridor Guide',
      description: 'New luxury launches, SPR infrastructure links, and 5-year capital appreciation forecasts.',
      icon: Compass,
    },
    'sushant-lok-1': {
      title: 'Sushant Lok 1 Freehold Kothis & Builder Floors Guide',
      href: '/blog/location/sushant-lok-1',
      category: 'Corridor Guide',
      description: 'Quiet residential colony insights near Millennium City Centre Metro and Galleria Market.',
      icon: Compass,
    },
    'cyber-city': {
      title: 'Cyber City Grade-A Commercial Real Estate Guide',
      href: '/blog/location/cyber-city',
      category: 'Corridor Guide',
      description: 'Pre-leased institutional office suites, 7–9% rental yields, and MNC corporate covenants.',
      icon: Briefcase,
    },
    'mg-road': {
      title: 'MG Road Commercial Retail & Prime Residential Guide',
      href: '/blog/location/mg-road',
      category: 'Corridor Guide',
      description: 'High-street retail spaces, South Delhi transit, and Yellow Line Metro interchange.',
      icon: Compass,
    },
    'sohna-road': {
      title: 'Sohna Road Commercial & Residential Growth Corridor',
      href: '/blog/location/sohna-road',
      category: 'Corridor Guide',
      description: 'Elevated highway connectivity, mature gated communities, and commercial business parks.',
      icon: Compass,
    },
  };

  // Add corridor recommendation based on locationSlug or fallback to macro corridor
  const locGuide = (locationSlug && LOCATION_GUIDES_MAP[locationSlug]) || {
    title: 'DLF Phase 1–5 Macro Luxury Corridor Guide',
    href: '/blog/location/dlf-phase-1-5',
    category: 'Corridor Guide',
    description: 'Comprehensive advisory on acquiring freehold independent builder floors in DLF Phase 1 to 5.',
    icon: Compass,
  };
  recommendations.push(locGuide);

  // Category specific recommendations
  if (categorySlug === 'market-insights' || categorySlug === 'property-investment') {
    recommendations.push({
      title: 'Commercial Real Estate & Grade-A Offices in DLF Cyber City',
      href: '/services/commercial',
      category: 'Investment Advisory',
      description: 'Discover institutional pre-leased assets yielding 7–9% with blue-chip MNC tenant covenants.',
      icon: Briefcase,
    });
  } else {
    recommendations.push({
      title: 'Golf Course Road vs Golf Course Extension Corridor Analysis',
      href: '/blog/golf-course-road-vs-golf-course-extension-comparison',
      category: 'Market Report',
      description: 'Comparative valuation and infrastructure analysis between Gurugram’s premier corridors.',
      icon: FileText,
    });
  }

  // Live properties portfolio link
  recommendations.push({
    title: 'Curated Ready-to-Move Luxury Residences Portfolio',
    href: '/properties',
    category: 'Property Directory',
    description: 'Browse verified ready-to-move builder floors and villas available for immediate handover.',
    icon: Building2,
  });

  // Filter out self-referencing links
  const filtered = recommendations.filter(r => !r.href.includes(currentSlug));


  return (
    <section aria-label="Related Guides & Real Estate Corridors" className="my-10">
      <div className="bg-[#FAF8F5] border border-[#17213D]/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-[#D09A16]" />
          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#17213D]">
            Relevant Guides & Curated Corridors
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#566078] mb-6 leading-relaxed">
          Continue exploring related real estate advisory, prime corridors, and off-market investment portfolios:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-4 bg-white rounded-xl border border-[#17213D]/10 hover:border-[#D09A16]/60 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#D09A16] mb-1.5">
                    <span>{item.category}</span>
                    <Icon size={13} className="text-[#8892A6] group-hover:text-[#D09A16] transition-colors" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#17213D]/5 flex items-center justify-end text-[11px] font-semibold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                  <span>Explore Portfolio →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
