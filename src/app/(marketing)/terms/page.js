import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTermsData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_terms' }).lean();
    if (doc?.data) return doc.data;
  } catch (err) {
    console.warn('[Terms] DB fetch fallback:', err?.message);
  }
  return DEFAULT_SECTIONS.page_terms;
}

import { getDynamicPageSeo } from '@/lib/seo/dynamicSeo';

export async function generateMetadata() {
  const fallback = PAGE_SEO['/terms'];
  return await getDynamicPageSeo('/terms', {
    title: fallback?.title,
    description: fallback?.description,
    canonical: '/terms',
  });
}

export default async function Terms() {
  const breadcrumbs = BREADCRUMBS['/terms'] || [];
  const termsData = await getTermsData();

  const hero = termsData?.hero || DEFAULT_SECTIONS.page_terms.hero;
  const sections = termsData?.sections || DEFAULT_SECTIONS.page_terms.sections;

  return (
    <div className="w-full flex flex-col min-h-screen bg-brand-ivory-warm selection:bg-brand-gold selection:text-brand-obsidian">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* 1. DARK MASTHEAD OPENING */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-14 lg:pb-16 bg-brand-obsidian text-white border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none select-none">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
            alt="Terms of Service Architectural Backdrop"
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
              <span>Terms of Service</span>
            </span>
          </div>

          {hero.badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
              <Sparkles size={11} className="text-brand-gold" />
              <span>{hero.badge}</span>
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            {hero.title || "Terms of Service"}
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
