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

  // Category or location specific recommendations
  if (categorySlug === 'market-insights' || categorySlug === 'property-investment') {
    recommendations.push({
      title: 'Commercial Real Estate & Grade-A Offices in DLF Cyber City',
      href: '/services/commercial',
      category: 'Investment Advisory',
      description: 'Discover institutional pre-leased assets yielding 7–9% with blue-chip MNC tenant covenants.',
      icon: Briefcase,
    });
  }

  if (locationSlug === 'golf-course-road' || categorySlug === 'location-insights') {
    recommendations.push({
      title: 'Golf Course Road vs Golf Course Extension Corridor Analysis',
      href: '/blog/golf-course-road-vs-golf-course-extension-comparison',
      category: 'Corridor Guide',
      description: 'Detailed comparative valuation and infrastructure analysis between Gurugram’s premier corridors.',
      icon: Compass,
    });
  } else {
    recommendations.push({
      title: 'Guide to Acquiring Independent Builder Floors in DLF Corridors',
      href: '/blog/luxury-builder-floors-dlf-phase-1-5-guide',
      category: 'Buyer Guide',
      description: 'Review plot zoning, stilt parking permissions, and legal title verification protocols.',
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
          <Compass size={18} className="text-[#C6A24A]" />
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
                className="group p-4 bg-white rounded-xl border border-[#17213D]/10 hover:border-[#C6A24A]/60 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#C6A24A] mb-1.5">
                    <span>{item.category}</span>
                    <Icon size={13} className="text-[#8892A6] group-hover:text-[#C6A24A] transition-colors" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#17213D]/5 flex items-center justify-end text-[11px] font-semibold text-[#17213D] group-hover:text-[#C6A24A] transition-colors">
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
