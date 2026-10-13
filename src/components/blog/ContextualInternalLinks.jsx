import React from 'react';
import Link from 'next/link';
import { Compass, Building2, Briefcase, FileText } from 'lucide-react';

export default function ContextualInternalLinks({ 
  categorySlug, 
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

  // Commercial investment advisory
  recommendations.push({
    title: 'Commercial Real Estate & Grade-A Offices in Gurugram',
    href: '/services/commercial',
    category: 'Investment Advisory',
    description: 'Discover institutional pre-leased assets yielding high returns with blue-chip corporate covenants.',
    icon: Briefcase,
  });

  // Industrial & Warehousing
  recommendations.push({
    title: 'Industrial Land & High-Throughput Warehousing Advisory',
    href: '/services/industrial',
    category: 'Industrial Solutions',
    description: 'Strategic logistics parcels and manufacturing hubs across prime NCR economic corridors.',
    icon: Compass,
  });

  // Live properties portfolio link
  recommendations.push({
    title: 'Curated Ready-to-Move Luxury Residences Portfolio',
    href: '/properties',
    category: 'Property Directory',
    description: 'Browse verified ready-to-move builder floors and villas available for immediate handover.',
    icon: Building2,
  });

  // Filter out self-referencing links
  const filtered = recommendations.filter(r => !currentSlug || !r.href.includes(currentSlug));


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
