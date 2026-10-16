import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Mail, 
  MapPin, 
  ArrowRight,
  Send
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import BlogCatalogInteractive from '@/components/blog/BlogCatalogInteractive';
import BlogNewsletterForm from '@/components/blog/BlogNewsletterForm';
import { 
  getBlogPosts, 
  getCategories 
} from '@/services/blogService';
import { BREADCRUMBS } from '@/lib/seo/seoConfig';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getBlogPageCms() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_blog' }).lean();
    return doc?.data || DEFAULT_SECTIONS.page_blog;
  } catch {
    return DEFAULT_SECTIONS.page_blog;
  }
}

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'The Gurugram Real Estate Journal | DLF Luxury Advisory',
    description: 'Expert research, independent builder floor pricing benchmarks, and corridor analysis across DLF Phase 1–5, Sushant Lok, and Golf Course Road Gurugram.',
    path: '/blog',
    canonical: '/blog',
    keywords: [
      'DLF Gurugram Real Estate',
      'Luxury Builder Floors',
      'Golf Course Road Real Estate',
      'Gurugram Market Insights',
      'Saudagar Properties Blog',
      'NRI Property Advisory Gurugram'
    ],
  });
}export default async function BlogIndexPage() {
  const [allPosts, categories, blogCms] = await Promise.all([
    getBlogPosts({ limit: 100 }),
    getCategories(),
    getBlogPageCms(),
  ]);

  const breadcrumbs = BREADCRUMBS['/blog'] || [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#0A0E17] text-white selection:bg-[#D09A16] selection:text-[#0A0E17]">
        {/* =========================================================================
            SECTION 1: DARK — LUXURY ARCHITECTURAL EDITORIAL MASTHEAD (OPENING SCREEN)
        ========================================================================= */}
        <section className="relative overflow-hidden bg-[#0A0E17] text-white pt-32 sm:pt-36 pb-20 md:pb-24 border-b border-white/10">
          {/* Architectural Background Vignette - Clearly Visible */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
            <Image
              src={blogCms.masthead?.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"}
              alt="Gurugram Real Estate Editorial"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/80 via-[#0A0E17]/45 to-[#0A0E17]/95" />
          </div>

          {/* Ambient Golden Glow Beams */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.15) 0%, rgba(208, 154, 22, 0) 70%)' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Illuminated Breadcrumb Navigation */}
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
              <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
              <span className="text-slate-600">/</span>
              <span className="text-[#D09A16] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
                <span>The Gurugram Journal</span>
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6">
                {blogCms.masthead?.titleMain || "The Gurugram Real Estate "} <span className="italic font-serif text-[#D09A16]">{blogCms.masthead?.titleItalic || "Journal"}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 font-sans leading-relaxed max-w-3xl">
                {blogCms.masthead?.description || "Authoritative market research, independent builder floor valuation benchmarks, and strategic investment advisory for high-net-worth families."}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1.5: 4-POINT LIVE MARKET PULSE TELEMETRY BAR
        ========================================================================= */}
        {blogCms.marketPulse && blogCms.marketPulse.length > 0 && (
          <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-8">
            <div className="bg-[#12192C]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {blogCms.marketPulse.map((pulse, pIdx) => (
                  <div key={pIdx} className={`flex flex-col justify-between ${pIdx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}>
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16] mr-1 self-center shrink-0" />
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        {pulse.value}
                      </span>
                      {pulse.unit && (
                        <span className="text-xs font-semibold text-[#D09A16] uppercase tracking-wider">
                          {pulse.unit}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-200">
                        {pulse.label}
                      </span>
                      {pulse.subtext && (
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {pulse.subtext}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            INTERACTIVE CATALOG
            • Section 1: Lead Cover Story & Stacked Dispatches
            • Section 2: Research Library Grid, Search, Tabs & Most Read
        ========================================================================= */}
        <BlogCatalogInteractive 
          initialData={blogCms}
          allPosts={allPosts} 
          categories={categories} 
        />

        {/* =========================================================================
            SECTION 5: DARK — PRIVATE MARKET DISPATCH & QUARTERLY HNI REPORT CONCIERGE
        ========================================================================= */}
        <section className="py-20 md:py-24 bg-[#0A0E17] text-white border-t border-white/10 relative overflow-hidden">
          {/* Ambient Beams */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.12) 0%, rgba(208, 154, 22, 0) 70%)' }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-semibold uppercase tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
              <Mail size={13} className="text-[#D09A16]" />
              <span>{blogCms.newsletter?.badge || "Quarterly DLF Market Intelligence Dispatch"}</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {blogCms.newsletter?.titleMain || "Receive Off-Market Intelligence in "} <span className="italic font-serif text-[#D09A16]">{blogCms.newsletter?.titleItalic || "Your Private Inbox"}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto font-sans">
              {blogCms.newsletter?.description || "Join our private registry of high-net-worth investors, family offices, and NRI principals who receive confidential quarterly valuation reports, zoning circulars, and pre-launch opportunities across DLF Gurugram."}
            </p>

            {/* Newsletter Input Component */}
            <BlogNewsletterForm
              placeholder={blogCms.newsletter?.inputPlaceholder}
              buttonText={blogCms.newsletter?.buttonText}
            />

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#D09A16]" />
                <span>{blogCms.newsletter?.privacyText || "Zero spam. Strict client privacy protocol."}</span>
              </span>
              <a 
                href={`https://wa.me/${blogCms.newsletter?.whatsappNumber || '919718511207'}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D09A16] hover:underline flex items-center gap-1.5"
              >
                <WhatsAppIcon size={14} />
                <span>{blogCms.newsletter?.whatsappText || "Or Request WhatsApp Dispatch Directly"}</span>
              </a>
            </div>
          </div>
        </section>

      </main>
    </PublicLayout>
  );
}
