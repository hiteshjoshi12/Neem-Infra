import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, Building2, Phone, Compass, ArrowRight } from 'lucide-react';
import { getGlobalSeoSettings } from '@/lib/seo/dynamicSeo';

export const metadata = {
  title: 'Page Not Found | Saudagar Properties',
  description: 'The requested luxury real estate page could not be located. Browse our Gurugram portfolio or editorial journal.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const ICON_MAP = {
  Home,
  BookOpen,
  Building2,
  Phone,
  Compass,
};

export default async function NotFound() {
  const settings = await getGlobalSeoSettings();
  const c404 = settings?.custom404 || {};

  const badgeText = c404.badgeText || 'Error 404 • Destination Not Found';
  const title = c404.title || 'Page Not Located';
  const subtitle =
    c404.subtitle ||
    'The property listing, editorial dispatch, or link you requested is unavailable or has been relocated to our updated platform.';
  const showQuickLinks = c404.showQuickLinks !== false;
  const ctaTitle = c404.ctaTitle || 'Speak Directly with Senior Partners';
  const ctaButtonText = c404.ctaButtonText || 'Request Private Consultation';
  const ctaButtonLink = c404.ctaButtonLink || '/contact';

  const defaultQuickLinks = [
    {
      title: 'Return to Homepage',
      desc: 'Explore prime corridors & services',
      url: '/',
      iconName: 'Home',
    },
    {
      title: 'Real Estate Journal',
      desc: 'Read luxury builder floor analyses',
      url: '/blog',
      iconName: 'BookOpen',
    },
    {
      title: 'Ready-to-Move Residences',
      desc: 'Vetted DLF Phase 1–5 builder floors',
      url: '/properties',
      iconName: 'Building2',
    },
    {
      title: 'Private Consultation',
      desc: 'Speak directly with senior partners',
      url: '/contact',
      iconName: 'Phone',
    },
  ];

  const quickLinks = Array.isArray(c404.quickLinks) && c404.quickLinks.length > 0 ? c404.quickLinks : defaultQuickLinks;

  return (
    <div className="min-h-screen bg-brand-navy-deep text-brand-ivory flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-brand-gold selection:text-brand-navy-deep">
      {/* Subtle architectural backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-96 h-96 rounded-full bg-brand-gold/10 blur-[120px]"
      />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-6">
          <Compass size={13} />
          <span>{badgeText}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-brand-ivory mb-4 tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-brand-text-on-dark-muted mb-10 leading-relaxed font-sans">
          {subtitle}
        </p>

        {showQuickLinks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
            {quickLinks.map((item, idx) => {
              const IconComponent = ICON_MAP[item.iconName] || Compass;
              return (
                <Link
                  key={idx}
                  href={item.url || '/'}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-brand-navy border border-white/10 hover:border-brand-gold transition-all group"
                >
                  <IconComponent size={18} className="text-brand-gold shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-brand-gold transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-brand-text-dim">
                      {item.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text-dim">
          <span>{ctaTitle}</span>
          <Link
            href={ctaButtonLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep font-bold hover:brightness-110 transition-all text-xs"
          >
            <span>{ctaButtonText}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
