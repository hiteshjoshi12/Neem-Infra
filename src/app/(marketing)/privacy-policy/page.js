import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPrivacyData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_privacy' }).lean();
    if (doc?.data) return doc.data;
  } catch (err) {
    console.warn('[Privacy] DB fetch fallback:', err?.message);
  }
  return {};
}

import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  const fallback = PAGE_SEO['/privacy-policy'];
  return await getDynamicPageSeo('/privacy-policy', {
    title: fallback?.title,
    description: fallback?.description,
    canonical: '/privacy-policy',
  });
}

export default async function PrivacyPolicy() {
  const [privacyData, breadcrumbs] = await Promise.all([
    getPrivacyData(),
    getDynamicBreadcrumbs('/privacy-policy'),
  ]);

  const hero = privacyData?.hero || {
    badge: 'Confidentiality & Data Protection',
    title: 'Privacy Policy',
    description: 'Fiduciary discretion, client record confidentiality, and digital privacy standards.'
  };
  const sections = privacyData?.sections || [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory-warm selection:bg-brand-gold selection:text-brand-obsidian">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. DARK MASTHEAD OPENING */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-14 lg:pb-16 bg-brand-obsidian text-white border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none select-none">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=80"
            alt="Privacy Policy Architectural Backdrop"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian/90 via-brand-obsidian/60 to-brand-obsidian/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/90 via-transparent to-brand-obsidian/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-brand-gold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
              <span>Privacy Policy</span>
            </span>
          </div>

          {hero.badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
              <Sparkles size={11} className="text-brand-gold" />
              <span>{hero.badge}</span>
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {hero.title || "Privacy Policy"}
          </h1>

          {hero.subtitle && (
            <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed">
              {hero.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT BODY */}
      <div className="w-full py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-cream-border">
          <div className="prose prose-lg text-brand-slate space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className="border-b border-brand-cream-border/60 pb-6 last:border-b-0 last:pb-0">
                <h2 className="text-xl font-bold text-brand-navy mb-3">
                  {section.heading}
                </h2>
                <p className="leading-relaxed text-brand-slate">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
