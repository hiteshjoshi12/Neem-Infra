import React from 'react';
import Link from 'next/link';
import { Compass, Building2, Briefcase, FileText } from 'lucide-react';

export default function ContextualInternalLinks({ 
  categorySlug, 
  currentSlug 
}) {
  const recommendations = [];

  const slugLower = (currentSlug || '').toLowerCase();
  if (slugLower.includes('phase-1') || slugLower.includes('phase1')) {
    recommendations.push({
      title: 'DLF Phase 1 Prime Real Estate & Corridor Hub',
      href: '/property/dlf-phase-1',
      category: 'Prime Corridor Hub',
      description: 'Explore verified luxury builder floors, kothis, and plot transactions across Sector 26 & 26A.',
      icon: Building2,
    });
  } else if (slugLower.includes('phase-2')) {
    recommendations.push({
      title: 'DLF Phase 2 Luxury Residences & Corridor Hub',
      href: '/property/dlf-phase-2',
      category: 'Prime Corridor Hub',
      description: 'Explore signature residential kothis and modern builder floors in Sector 25 & 25A.',
      icon: Building2,
    });
  } else if (slugLower.includes('phase-3')) {
    recommendations.push({
      title: 'DLF Phase 3 Residential & Corridor Hub',
      href: '/property/dlf-phase-3',
      category: 'Prime Corridor Hub',
      description: 'Browse independent floors and high-yield residential plots in Sector 24.',
      icon: Building2,
    });
  } else if (slugLower.includes('phase-4')) {
    recommendations.push({
      title: 'DLF Phase 4 Prime Residences & Corridor Hub',
      href: '/property/dlf-phase-4',
      category: 'Prime Corridor Hub',
      description: 'Explore premium residences near Galleria Market and Sector 28.',
      icon: Building2,
    });
  } else if (slugLower.includes('sushant-lok')) {
    recommendations.push({
      title: 'Sushant Lok 1 Portfolio & Corridor Hub',
      href: '/property/shushant-lok',
      category: 'Prime Corridor Hub',
      description: 'Discover luxury duplex villas and freehold builder floors in Sectors 43 & 27.',
      icon: Building2,
    });
  } else if (slugLower.includes('udyog-vihar')) {
    recommendations.push({
      title: 'Udyog Vihar Industrial & Commercial Hub',
      href: '/property/udyog-vihar',
      category: 'Industrial Hub',
      description: 'Grade-A industrial plots and commercial assets in Phases 1–5.',
      icon: Compass,
    });
  } else {
    recommendations.push({
      title: 'DLF Phase 1 Prime Real Estate & Corridor Hub',
      href: '/property/dlf-phase-1',
      category: 'Prime Corridor Hub',
      description: 'Explore verified luxury builder floors, kothis, and plot transactions across DLF Phase 1–5.',
      icon: Building2,
    });
  }

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
      <div className="bg-brand-ivory-warm border border-brand-navy/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-brand-gold" />
          <h3 className="font-serif font-bold text-lg sm:text-xl text-brand-navy">
            Relevant Guides & Curated Corridors
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-brand-slate mb-6 leading-relaxed">
          Continue exploring related real estate advisory, prime corridors, and off-market investment portfolios:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-4 bg-white rounded-xl border border-brand-navy/10 hover:border-brand-gold/60 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1.5">
                    <span>{item.category}</span>
                    <Icon size={13} className="text-brand-muted group-hover:text-brand-gold transition-colors" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-brand-navy/5 flex items-center justify-end text-[11px] font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">
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
