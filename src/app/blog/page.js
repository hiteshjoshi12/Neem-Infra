import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Clock, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Building2,
  Mail
} from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
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
    getBlogPosts({ limit: 12 }),
    getCategories(),
    getLocations(),
  ]);

  const breadcrumbs = BREADCRUMBS['/blog'] || [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];

  // 1. Featured Article
  const featuredPost = allPosts.find((p) => p.featured) || allPosts[0];

  // 2. Latest Articles (excluding the featured one)
  const remainingPosts = allPosts.filter((p) => p.slug !== featuredPost?.slug);
  const latestPosts = remainingPosts.slice(0, 4);

  // 3. Property Investment Guides (posts tagged or categorized as investment)
  const investmentPosts = allPosts.filter(
    (p) =>
      p.categorySlug === 'property-investment' ||
      p.category?.slug === 'property-investment' ||
      p.tags?.some((t) => t.slug === 'nri-investment' || t.slug === 'pre-leased-commercial')
  ).slice(0, 3);

  // 4. Market Insights
  const marketInsightPosts = allPosts.filter(
    (p) =>
      p.categorySlug === 'market-insights' ||
      p.category?.slug === 'market-insights' ||
      p.tags?.some((t) => t.slug === 'market-trends' || t.slug === 'capital-appreciation')
  ).slice(0, 3);

  // 5. Popular / Trending Articles (top 4 curated)
  const popularPosts = allPosts.slice(0, 4);

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] text-[#17213D] selection:bg-[#C6A24A] selection:text-[#0E162B]">
        {/* =========================================================
            1. LUXURY ARCHITECTURAL EDITORIAL MASTHEAD (WARM LIGHT WORLD)
        ========================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5EF] via-[#FAF8F5] to-[#F7F5EF] text-[#17213D] pt-32 sm:pt-36 pb-20 md:pb-28 border-b border-[#17213D]/10">
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(#C6A24A_1px,transparent_1px),linear-gradient(90deg,#C6A24A_1px,transparent_1px)] [background-size:48px_48px]" 
          />
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 w-96 h-96 rounded-full bg-[#C6A24A]/12 blur-[120px]"
          />
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 -bottom-32 w-80 h-80 rounded-full bg-[#EFEBE1]/80 blur-[100px]"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/30 text-[#B38E36] text-xs font-semibold uppercase tracking-[0.22em] mb-6 shadow-xs">
                <Sparkles size={13} className="text-[#C6A24A]" />
                <span>Editorial Intelligence • DLF Gurugram</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#17213D] tracking-tight leading-[1.1] mb-6">
                The Gurugram Real Estate <span className="italic font-serif text-[#C6A24A]">Journal</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[#566078] font-sans leading-relaxed mb-8">
                Authoritative market research, independent builder floor valuation benchmarks, and strategic investment advisory for high-net-worth families across DLF Phase 1–5, Sushant Lok, and Golf Course Road.
              </p>

              {/* Quick Corridor Jump Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#566078]">
                <span className="font-semibold uppercase tracking-wider text-[#B38E36]">
                  Prime Corridors:
                </span>
                {locations.slice(0, 4).map((loc) => (
                  <Link
                    key={loc._id || loc.slug}
                    href={`/blog/location/${loc.slug}`}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#17213D]/10 hover:border-[#C6A24A] text-[#17213D] hover:text-[#C6A24A] font-medium transition-all shadow-xs"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. FEATURED ARTICLE SPOTLIGHT
        ========================================================== */}
        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-14 relative z-20 mb-20">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#17213D]/10 shadow-[0_25px_60px_-15px_rgba(23,33,61,0.08)] grid grid-cols-1 lg:grid-cols-12 gap-0 group hover:border-[#C6A24A]/50 transition-all duration-300">
              {featuredPost.featuredImage && (
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[320px] lg:min-h-[460px] overflow-hidden bg-slate-100">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.featuredImageAlt || featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-[#0E162B]/90 backdrop-blur-md text-[#C6A24A] border border-[#C6A24A]/40 text-xs font-bold uppercase tracking-widest shadow-md">
                      Featured Cover Story
                    </span>
                  </div>
                </div>
              )}

              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
                <div>
                  {featuredPost.category && (
                    <Link
                      href={`/blog/category/${featuredPost.category.slug}`}
                      className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#C6A24A] hover:underline mb-3"
                    >
                      {featuredPost.category.name}
                    </Link>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-tight mb-4">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[#566078] leading-relaxed mb-6 line-clamp-3 font-sans">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#17213D]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {featuredPost.author && (
                      <div className="text-xs">
                        <span className="block font-serif font-semibold text-[#17213D]">
                          {featuredPost.author.name}
                        </span>
                        <span className="text-[11px] text-[#8892A6]">
                          {featuredPost.readingTime || 7} min read
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17213D] group-hover:text-[#C6A24A] transition-colors"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            3. CATEGORY NAVIGATION BAR
        ========================================================== */}
        <section className="bg-[#EFEBE1] border-y border-[#17213D]/10 py-4 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#566078] flex-shrink-0">
                Browse Topics:
              </span>
              <div className="flex items-center gap-2 flex-nowrap">
                <Link
                  href="/blog"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#17213D] text-[#F7F5EF] shadow-xs flex-shrink-0"
                >
                  All ({allPosts.length})
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    href={`/blog/category/${cat.slug}`}
                    className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider bg-white/70 hover:bg-white text-[#17213D] hover:text-[#C6A24A] border border-[#17213D]/10 hover:border-[#C6A24A]/40 transition-all flex-shrink-0"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. LATEST ARTICLES GRID
        ========================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#17213D]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A24A] block mb-1">
                Fresh Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
                Latest Editorial Dispatches
              </h2>
            </div>
            <span className="text-xs text-[#8892A6]">
              Updated Weekly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts.map((post) => (
              <article
                key={post._id || post.slug}
                className="group flex flex-col justify-between"
              >
                <div>
                  {post.featuredImage && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4 bg-slate-100 border border-[#17213D]/5">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {post.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A24A] block mb-2">
                      {post.category.name}
                    </span>
                  )}

                  <h3 className="font-serif font-bold text-lg text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-snug line-clamp-2 mb-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#17213D]/10 flex items-center justify-between text-[11px] text-[#8892A6]">
                  <span>{post.readingTime || 5} min read</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-[#17213D] group-hover:text-[#C6A24A] transition-colors"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================================
            5. LOCATION-BASED INSIGHTS (WARM CREAM #EFEBE1 ARCHITECTURAL)
        ========================================================== */}
        <section className="bg-[#EFEBE1] text-[#17213D] py-20 mb-20 border-y border-[#17213D]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#17213D]/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A24A] block mb-2">
                  Corridor Analysis
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17213D]">
                  Location-Based Market Intelligence
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#566078] max-w-md mt-4 sm:mt-0 font-sans">
                Explore micro-market trends, plot zoning regulations, and capital growth drivers across Gurugram’s prime postal codes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((loc) => {
                const count = allPosts.filter(
                  (p) =>
                    p.locationSlugs?.includes(loc.slug) ||
                    p.location?.some((l) => l.slug === loc.slug)
                ).length;

                return (
                  <div
                    key={loc._id || loc.slug}
                    className="bg-white border border-[#17213D]/10 hover:border-[#C6A24A]/60 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#C6A24A]/25 flex items-center justify-center text-[#C6A24A] shadow-inner">
                          <MapPin size={18} />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8892A6]">
                          {count} {count === 1 ? 'Article' : 'Articles'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#C6A24A] transition-colors mb-2">
                        <Link href={`/blog/location/${loc.slug}`}>{loc.name}</Link>
                      </h3>

                      <p className="text-xs text-[#566078] leading-relaxed mb-6 font-sans">
                        {loc.description || 'Exclusive luxury enclave in Gurugram featuring high-net-worth real estate.'}
                      </p>
                    </div>

                    <Link
                      href={`/blog/location/${loc.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6A24A] hover:text-[#B38E36] transition-colors"
                    >
                      <span>Explore Corridor Insights</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            6 & 7. PROPERTY INVESTMENT GUIDES & MARKET INSIGHTS
        ========================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 6. Property Investment Guides */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#17213D]/10">
                <BookOpen size={18} className="text-[#C6A24A]" />
                <h2 className="text-2xl font-serif font-bold text-[#17213D]">
                  Property Investment Guides
                </h2>
              </div>

              <div className="space-y-6">
                {investmentPosts.map((post) => (
                  <article
                    key={post._id || post.slug}
                    className="p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#C6A24A]/50 transition-all shadow-xs flex flex-col sm:flex-row gap-6 items-start group"
                  >
                    {post.featuredImage && (
                      <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A24A] block mb-1">
                          HNW & NRI Advisory
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#17213D] group-hover:text-[#C6A24A] transition-colors mb-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#8892A6] pt-2">
                        <span>{post.readingTime || 6} min read</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-bold text-[#17213D] group-hover:text-[#C6A24A] transition-colors"
                        >
                          Read Guide →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* 7 & 8. Market Insights & Popular Articles */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#17213D]/10">
                <TrendingUp size={18} className="text-[#C6A24A]" />
                <h2 className="text-2xl font-serif font-bold text-[#17213D]">
                  Popular Analyses
                </h2>
              </div>

              {/* Numbered Editorial List (Not cards!) */}
              <div className="space-y-6">
                {popularPosts.map((post, idx) => (
                  <div
                    key={post._id || post.slug}
                    className="flex items-start gap-4 pb-6 border-b border-[#17213D]/10 last:border-b-0 group"
                  >
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-[#C6A24A] flex-shrink-0 w-8">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      {post.category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8892A6] block mb-1">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-base text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-snug mb-1">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-[#8892A6]">
                        <span>{post.readingTime || 5} min read</span>
                        <span>•</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-semibold text-[#17213D] hover:text-[#C6A24A]"
                        >
                          Read Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Advisory Callout Box */}
              <div className="mt-8 bg-[#EFEBE1] rounded-2xl p-6 border border-[#17213D]/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17213D] mb-2">
                  <ShieldCheck size={16} className="text-[#C6A24A]" />
                  <span>Confidential Advisory</span>
                </div>
                <p className="text-xs text-[#566078] leading-relaxed mb-4">
                  Need a custom valuation or title search for an independent floor in DLF Phase 1–5?
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full text-center py-2.5 px-4 rounded-xl bg-[#17213D] hover:bg-[#202B4A] text-[#F7F5EF] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Connect With Our Partners
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            9. NEWSLETTER / PRIVATE CONSULTATION CTA (WARM LUXURY ARCHITECTURAL)
        ========================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#EFEBE1] text-[#17213D] rounded-3xl p-8 sm:p-14 border-2 border-[#C6A24A]/30 shadow-[0_25px_60px_-15px_rgba(23,33,61,0.08)] text-center ring-1 ring-[#17213D]/[0.03]">
            <div 
              aria-hidden="true" 
              className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#C6A24A_1px,transparent_1px),linear-gradient(90deg,#C6A24A_1px,transparent_1px)] [background-size:36px_36px]" 
            />
            <div 
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C6A24A]/10 blur-[90px]"
            />
            <div 
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#C6A24A]/8 blur-[90px]"
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C6A24A]/10 border border-[#C6A24A]/30 text-[#B38E36] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                <Mail size={13} className="text-[#C6A24A]" />
                <span>Quarterly DLF Market Dispatch</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17213D] mb-4 leading-tight">
                Receive Off-Market Intelligence in Your Inbox
              </h2>

              <p className="text-sm sm:text-base text-[#566078] leading-relaxed mb-8 font-sans">
                Join our private registry of high-net-worth investors, family offices, and NRIs who receive discreet property reports and pre-launch opportunities across DLF Gurugram.
              </p>

              <form className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-4">
                <input
                  type="email"
                  placeholder="Enter your private email..."
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-white border border-[#17213D]/15 text-[#17213D] placeholder-[#8892A6] text-xs outline-none focus:border-[#C6A24A] focus:ring-1 focus:ring-[#C6A24A] shadow-xs transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C6A24A] hover:bg-[#D8BD73] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-[11px] text-[#8892A6]">
                Zero spam. Strict privacy protocols observed. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
