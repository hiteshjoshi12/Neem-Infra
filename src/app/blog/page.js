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
  Award,
  ArrowRight,
  Send,
  MessageCircle
} from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import BlogCatalogInteractive from '@/components/blog/BlogCatalogInteractive';
import { 
  getBlogPosts, 
  getCategories, 
  getLocations 
} from '@/services/blogService';
import { BREADCRUMBS } from '@/lib/seo/seoConfig';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

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
}

export default async function BlogIndexPage() {
  const [allPosts, categories, locations] = await Promise.all([
    getBlogPosts({ limit: 16 }),
    getCategories(),
    getLocations(),
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
          {/* Architectural Background Vignette */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
              alt="Gurugram Real Estate Editorial"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0A0E17]/85 to-[#0A0E17]" />
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-bold uppercase tracking-[0.22em] mb-6 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
                <Sparkles size={13} className="text-[#D09A16]" />
                <span>Editorial Intelligence • DLF Gurugram</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6">
                The Gurugram Real Estate <span className="italic font-serif text-[#D09A16]">Journal</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 font-sans leading-relaxed mb-8 max-w-3xl">
                Authoritative market research, independent builder floor valuation benchmarks, and strategic investment advisory for high-net-worth families across DLF Phase 1–5, Sushant Lok, and Golf Course Road.
              </p>

              {/* LIVE MARKET PULSE TICKER GRID (4 DARK GLASS METRICS CARDS) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 pb-8 border-y border-white/10 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    DLF Phase 1–5 Freehold
                  </span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                    ₹3.5L–₹4.5L <span className="text-xs text-[#D09A16]">/yd</span>
                  </span>
                  <span className="text-[10px] text-[#D09A16] font-mono">100% Clear Titles</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Golf Course Sky Estates
                  </span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-[#D09A16] block">
                    +14.2% <span className="text-xs text-white">CAGR</span>
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">3-Year Appreciation</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Cyber City Grade-A Lease
                  </span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                    8.5% <span className="text-xs text-[#D09A16]">Yield</span>
                  </span>
                  <span className="text-[10px] text-[#D09A16] font-mono">Pre-Leased Commercial</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Advisory Authority
                  </span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                    25+ <span className="text-xs text-[#D09A16]">Years</span>
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">1,000+ HNIs Advised</span>
                </div>
              </div>

              {/* Quick Corridor Jump Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[#D09A16] mr-1">
                  Corridor Focus:
                </span>
                {locations.slice(0, 5).map((loc) => (
                  <Link
                    key={loc._id || loc.slug}
                    href={`/blog/location/${loc.slug}`}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D09A16] border border-white/10 hover:border-[#D09A16] text-slate-200 hover:text-[#0A0E17] font-medium transition-all shadow-xs"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTIONS 2–4: ALTERNATING INTERACTIVE CATALOG
            • Section 2: Light (Lead Cover Story & Stacked Dispatches)
            • Section 3: Dark (Corridor Intelligence Hub)
            • Section 4: Light (Research Library Grid, Search, Tabs & Most Read)
        ========================================================================= */}
        <BlogCatalogInteractive 
          allPosts={allPosts} 
          categories={categories} 
          locations={locations} 
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
              <span>Quarterly DLF Market Intelligence Dispatch</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Receive Off-Market Intelligence in <span className="italic font-serif text-[#D09A16]">Your Private Inbox</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto font-sans">
              Join our private registry of high-net-worth investors, family offices, and NRI principals who receive confidential quarterly valuation reports, zoning circulars, and pre-launch opportunities across DLF Gurugram.
            </p>

            {/* Newsletter Input */}
            <form className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your confidential email..."
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-[#D09A16] focus:ring-1 focus:ring-[#D09A16] shadow-sm transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <Send size={13} />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#D09A16]" />
                <span>Zero spam. Strict client privacy protocol.</span>
              </span>
              <a 
                href="https://wa.me/919718511207" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D09A16] hover:underline flex items-center gap-1"
              >
                <MessageCircle size={13} />
                <span>Or Request WhatsApp Dispatch Directly</span>
              </a>
            </div>
          </div>
        </section>

      </main>
    </PublicLayout>
  );
}
