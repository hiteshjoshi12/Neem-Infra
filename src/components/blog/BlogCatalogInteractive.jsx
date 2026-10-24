"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  User, 
  ArrowUpRight,
  FileText,
  PhoneCall,
  LayoutList,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';

const CORRIDOR_CHIPS = [
  { name: 'DLF Phase 1', slug: 'dlf-phase-1', tag: 'Flagship Freehold' },
  { name: 'DLF Phase 2', slug: 'dlf-phase-2', tag: 'Direct Cybercity' },
  { name: 'DLF Phase 3', slug: 'dlf-phase-3', tag: 'High-Rental Yield' },
  { name: 'DLF Phase 4', slug: 'dlf-phase-4', tag: 'Galleria & Super Mart' },
  { name: 'Sushant Lok 1', slug: 'shushant-lok', tag: 'Prime Plotted' },
  { name: 'Udyog Vihar', slug: 'udyog-vihar', tag: 'Corporate & Tech' },
];

const BATCH_SIZE = 6;

export default function BlogCatalogInteractive({ initialData, allPosts = [], categories = [] }) {
  const { sections } = useCms();
  const cms = sections?.page_blog || initialData || DEFAULT_SECTIONS.page_blog;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('expanded'); // 'expanded' | 'grid'
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  // Filter posts based on category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allPosts;
    }
    return allPosts.filter(
      (p) =>
        p.categorySlug === selectedCategory ||
        p.category?.slug === selectedCategory
    );
  }, [allPosts, selectedCategory]);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setIsLoadingMore(false);
  }, [selectedCategory]);

  // Paginated visible posts for infinite scroll
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredPosts.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, filteredPosts.length]);

  // Infinite scroll observer: loads next batch when user approaches sentinel
  useEffect(() => {
    if (!hasMore) return;

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      if (sentinelEl) {
        observer.unobserve(sentinelEl);
      }
    };
  }, [hasMore, isLoadingMore, handleLoadMore]);

  // Featured Lead Story (always highest priority or first)
  const leadStory = useMemo(() => {
    return allPosts.find((p) => p.featured) || allPosts[0];
  }, [allPosts]);

  // Secondary highlights (next 3 posts)
  const secondaryStories = useMemo(() => {
    return allPosts.filter((p) => p.slug !== leadStory?.slug).slice(0, 3);
  }, [allPosts, leadStory]);

  // Most Popular / Trending (top 4 curated)
  const popularStories = useMemo(() => {
    return allPosts.slice(0, 4);
  }, [allPosts]);

  const categoryCounts = useMemo(() => {
    const map = { all: allPosts.length };
    categories.forEach((c) => {
      map[c.slug] = allPosts.filter(
        (p) => p.categorySlug === c.slug || p.category?.slug === c.slug
      ).length;
    });
    return map;
  }, [allPosts, categories]);

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 2: LIGHT — EDITORIAL MAGAZINE SPREAD (LEAD COVER STORY & DISPATCHES)
      ========================================================================= */}
      <section className="pt-12 md:pt-16 pb-8 md:pb-10 bg-brand-ivory text-brand-navy border-b border-brand-navy/10 relative overflow-hidden">
        {/* Subtle Luxury Watermark Grid */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:48px_48px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Eyebrow & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-brand-navy/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                <Sparkles size={13} />
                <span>{cms.spotlight?.badge || "Editorial Spotlight • Cover Dossier"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy tracking-tight leading-tight">
                {cms.spotlight?.titleMain || "Curated High-Value "} <span className="italic font-serif text-brand-gold">{cms.spotlight?.titleItalic || "Research Dispatches"}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate max-w-md font-sans leading-relaxed">
              {cms.spotlight?.description || "In-depth fiduciary valuation benchmarks, 30-year DLF Phase 1–5 registry insights, and sovereign NRI capital repatriation advisory."}
            </p>
          </div>

          {/* ASYMMETRIC 3D MAGAZINE SPREAD */}
          {leadStory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
              
              {/* LEFT: Cinematic Lead Cover Story Card (8 Cols) - Entire Card is Clickable */}
              <Link
                href={`/blog/${leadStory.slug}`}
                className="lg:col-span-8 group block cursor-pointer"
              >
                <div className="bg-white rounded-3xl border border-brand-navy/10 group-hover:border-brand-gold/60 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,61,0.06)] group-hover:shadow-[0_25px_60px_rgba(208,154,22,0.18)] transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    {/* Meta Header Strip Above Image (Never blocks image artwork) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full bg-brand-navy text-brand-gold border border-brand-gold/40 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                          Cover Story • High Impact
                        </span>
                        {leadStory.category && (
                          <span className="px-3.5 py-1.5 rounded-full bg-brand-gold/10 text-brand-navy border border-brand-gold/30 text-[10px] font-bold uppercase tracking-wider">
                            {leadStory.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-brand-slate">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={13} className="text-brand-gold" />
                          <span>{leadStory.readingTime || 7} min read</span>
                        </span>
                        <span className="font-mono text-[11px] text-brand-gold font-bold tracking-wider">
                          VERIFIED DISPATCH
                        </span>
                      </div>
                    </div>

                    {/* Image Container: Enlarged Aspect Ratio, Ambient Backdrop, Full Uncut Image */}
                    <div className="relative aspect-[16/10] sm:aspect-[3/2] w-full rounded-2xl overflow-hidden bg-brand-obsidian mb-8 border border-brand-navy/10 shadow-inner group-hover:border-brand-gold/40 transition-colors">
                      {/* Ambient Blurred Backdrop */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                        <Image
                          src={leadStory.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                          alt=""
                          fill
                          sizes="100px"
                          className="object-cover blur-2xl scale-125 brightness-75"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Full Foreground Image - 100% visible, zero cropping */}
                      <Image
                        src={leadStory.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                        alt={leadStory.featuredImageAlt || leadStory.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out relative z-10"
                      />
                    </div>

                    {/* Headline & Excerpt */}
                    <div className="space-y-4">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-navy group-hover:text-brand-gold transition-colors leading-tight">
                        {leadStory.title}
                      </h3>

                      <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-sans line-clamp-3">
                        {leadStory.excerpt}
                      </p>

                      {/* Key Strategic Takeaways Pill Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-brand-navy/10">
                        <div className="flex items-start gap-2 text-xs text-brand-navy">
                          <CheckCircle2 size={15} className="text-brand-gold shrink-0 mt-0.5" />
                          <span>Freehold registry scrutiny &amp; municipal clearances</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-brand-navy">
                          <CheckCircle2 size={15} className="text-brand-gold shrink-0 mt-0.5" />
                          <span>Quarterly capital appreciation &amp; rental yields</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="pt-8 mt-8 border-t border-brand-navy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-navy text-brand-gold font-serif font-bold flex items-center justify-center text-sm shadow-sm">
                        {leadStory.author?.name ? leadStory.author.name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <span className="block font-serif font-bold text-sm text-brand-navy">
                          {leadStory.author?.name || 'Saudagar Research Desk'}
                        </span>
                        <span className="text-[11px] text-brand-muted">
                          Executive Advisory Principals
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy group-hover:bg-brand-gold text-brand-ivory group-hover:text-brand-obsidian text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm">
                      <span>Read Full Dossier</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* RIGHT: Stacked Editor's Dispatches (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-2">
                    <BookOpen size={14} />
                    <span>Executive Briefs</span>
                  </span>
                  <span className="text-[11px] font-semibold text-brand-muted">
                    Weekly Dispatches
                  </span>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  {secondaryStories.map((post, idx) => (
                    <Link
                      key={post._id || post.slug}
                      href={`/blog/${post.slug}`}
                      className="group p-5 sm:p-6 bg-white rounded-2xl border border-brand-navy/10 hover:border-brand-gold/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-1 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-2">
                          <span>{post.category?.name || 'Market Report'}</span>
                          <span className="text-slate-400 font-mono">0{idx + 1}</span>
                        </div>

                        <h4 className="font-serif font-bold text-base text-brand-navy group-hover:text-brand-gold transition-colors leading-snug line-clamp-2 mb-2">
                          {post.title}
                        </h4>

                        <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-brand-navy/10 flex items-center justify-between text-[11px] text-brand-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-brand-gold" />
                          <span>{post.readingTime || 5} min read</span>
                        </span>
                        <div className="font-bold text-brand-navy group-hover:text-brand-gold flex items-center gap-1 transition-colors">
                          <span>Brief</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 2.5: INTERACTIVE GEOGRAPHIC RADAR & CORRIDOR SPOTLIGHTS
      ========================================================================= */}
      {cms.corridors && (
        <section className="py-10 bg-white border-b border-brand-navy/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold block mb-1">
                  {cms.corridors?.badge || "Interactive Geographic Radar"}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy">
                  {cms.corridors?.titleMain || "Location-Based "}<span className="italic font-serif text-brand-gold">{cms.corridors?.titleItalic || "Market Intelligence"}</span>
                </h3>
              </div>
              <p className="text-xs text-brand-slate max-w-md font-sans leading-relaxed">
                {cms.corridors?.description || "Select a prime Gurugram micro-market below to inspect real-time zoning benchmarks, capital appreciation drivers, and published advisory research."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CORRIDOR_CHIPS.map((corr) => (
                <Link
                  key={corr.slug}
                  href={`/property/${corr.slug}`}
                  className="p-3.5 rounded-2xl bg-brand-ivory hover:bg-brand-navy text-brand-navy hover:text-white border border-brand-navy/10 hover:border-brand-gold transition-all group flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold group-hover:text-brand-gold">
                    {corr.tag}
                  </span>
                  <span className="text-xs font-serif font-bold mt-1 group-hover:text-white flex items-center justify-between">
                    <span>{corr.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: LIGHT — INTERACTIVE RESEARCH LIBRARY & CATEGORY CLUSTERS
      ========================================================================= */}
      <section className="pt-8 md:pt-10 pb-16 md:pb-24 bg-brand-ivory text-brand-navy relative overflow-hidden">
        {/* Subtle Luxury Watermark Grid */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:48px_48px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Eyebrow & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 md:mb-8 pb-5 border-b border-brand-navy/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                <FileText size={13} />
                <span>{cms.researchLibrary?.badge || "Complete Archives • Intelligence Catalog"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy tracking-tight leading-tight">
                {cms.researchLibrary?.titleMain || "The Gurugram Real Estate "} <span className="italic font-serif text-brand-gold">{cms.researchLibrary?.titleItalic || "Research Library"}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate max-w-md font-sans leading-relaxed">
              {cms.researchLibrary?.description || "Explore our comprehensive archive of independent market analyses, builder floor valuation benchmarks, legal due diligence advisories, and corridor growth studies."}
            </p>
          </div>

          {/* Controls Bar: Category Filter Pills (No search bar) */}
          {/* Controls Bar: Category Filter Pills + View Switcher */}
          <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-brand-navy/10 shadow-[0_4px_20px_rgba(23,33,61,0.03)] mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto luxury-scrollbar py-0.5 px-0.5 flex-1 min-w-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-brand-slate hover:text-brand-navy hover:bg-brand-ivory'
                }`}
              >
                {selectedCategory === 'all' && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-brand-navy rounded-xl -z-10"
                  />
                )}
                <span>All Analyses ({categoryCounts.all || 0})</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const count = categoryCounts[cat.slug] || 0;
                return (
                  <button
                    key={cat._id || cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-brand-navy text-white shadow-sm'
                        : 'text-brand-slate hover:text-brand-navy hover:bg-brand-ivory'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeFilterPill"
                        className="absolute inset-0 bg-brand-navy rounded-xl -z-10"
                      />
                    )}
                    <span>{cat.name} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* View Switcher: Expanded Editorial vs Magazine Grid */}
            <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-brand-navy/10 shrink-0">
              <button
                onClick={() => setViewMode('expanded')}
                title="Expanded Editorial Cards (Full Width)"
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  viewMode === 'expanded'
                    ? 'bg-brand-navy text-brand-gold shadow-sm'
                    : 'text-brand-slate hover:text-brand-navy hover:bg-brand-ivory'
                }`}
              >
                <LayoutList size={15} />
                <span className="hidden md:inline">Expanded</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Cards"
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  viewMode === 'grid'
                    ? 'bg-brand-navy text-brand-gold shadow-sm'
                    : 'text-brand-slate hover:text-brand-navy hover:bg-brand-ivory'
                }`}
              >
                <LayoutGrid size={15} />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>
          </div>

          {/* MAIN ARTICLES GRID + EDITORIAL SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* LEFT: Articles Grid (8 cols) */}
            <div className="lg:col-span-8">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-navy/10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>Published Dossiers</span>
                </span>
                <span className="text-xs text-brand-slate font-medium">
                  Showing {Math.min(visibleCount, filteredPosts.length)} of {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>

              {filteredPosts.length > 0 ? (
                <>
                  {viewMode === 'expanded' ? (
                    /* =========================================================
                       MODE 1: EXPANDED EDITORIAL CARDS (LARGE FORMAT)
                       • Full-width cards with spacious image container
                       • Entire graphic displayed without any cropping
                       • Clear editorial typography & breathing room
                    ========================================================= */
                    <div className="space-y-8">
                      {displayedPosts.map((post) => (
                        <Link
                          key={post._id || post.slug}
                          href={`/blog/${post.slug}`}
                          className="group block cursor-pointer bg-white rounded-3xl border border-brand-navy/10 hover:border-brand-gold/60 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                            {/* Large Sized Image Container with Ambient Backdrop */}
                            <div className="relative w-full md:w-[46%] aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:min-h-[260px] rounded-2xl overflow-hidden bg-brand-obsidian border border-brand-navy/10 shrink-0 shadow-inner group-hover:border-brand-gold/40 transition-colors">
                              {/* Ambient Blurred Backdrop */}
                              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                                <Image
                                  src={post.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                                  alt=""
                                  fill
                                  sizes="100px"
                                  className="object-cover blur-xl scale-125 brightness-75"
                                  aria-hidden="true"
                                  loading="lazy"
                                />
                              </div>
                              {/* Full Uncut Foreground Image */}
                              <Image
                                src={post.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 420px"
                                className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-500 relative z-10"
                                loading="lazy"
                              />
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col justify-between flex-1 py-1">
                              <div>
                                {/* Meta Header */}
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  {post.category && (
                                    <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-navy border border-brand-gold/30 text-[10px] font-bold uppercase tracking-wider">
                                      {post.category.name}
                                    </span>
                                  )}
                                  <span className="text-slate-400 text-xs">•</span>
                                  <span className="text-xs text-brand-muted flex items-center gap-1 font-medium">
                                    <Clock size={12} className="text-brand-gold" />
                                    <span>{post.readingTime || 5} min read</span>
                                  </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-3">
                                  {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-sm text-brand-slate line-clamp-3 leading-relaxed mb-6 font-sans">
                                  {post.excerpt}
                                </p>
                              </div>

                              {/* Card Footer */}
                              <div className="pt-4 border-t border-brand-navy/10 flex items-center justify-between text-xs">
                                <span className="text-brand-muted font-medium">
                                  {post.author?.name || 'Saudagar Research Desk'}
                                </span>
                                <div className="font-bold uppercase tracking-wider text-brand-navy group-hover:text-brand-gold flex items-center gap-1.5 transition-colors">
                                  <span>Read Full Dossier</span>
                                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {/* Luxury Skeleton Cards while loading next batch */}
                      {isLoadingMore && (
                        <div className="space-y-8 animate-pulse pt-2">
                          {[1, 2].map((n) => (
                            <div
                              key={`skeleton-expanded-${n}`}
                              className="bg-white rounded-3xl border border-brand-navy/10 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-stretch gap-6 md:gap-8"
                            >
                              <div className="w-full md:w-[46%] aspect-[4/3] sm:aspect-[16/10] md:min-h-[260px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/80 shrink-0" />
                              <div className="flex flex-col justify-between flex-1 py-2 space-y-4">
                                <div className="space-y-3">
                                  <div className="h-5 w-28 bg-slate-200 rounded-full" />
                                  <div className="h-7 w-3/4 bg-slate-200 rounded-xl" />
                                  <div className="h-4 w-full bg-slate-100 rounded" />
                                  <div className="h-4 w-5/6 bg-slate-100 rounded" />
                                </div>
                                <div className="pt-4 border-t border-brand-navy/10 flex items-center justify-between">
                                  <div className="h-4 w-24 bg-slate-100 rounded" />
                                  <div className="h-4 w-28 bg-slate-200 rounded" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* =========================================================
                       MODE 2: MAGAZINE GRID (ENLARGED CARDS)
                       • Increased container height with 4:3 native ratio
                       • Ambient blurred backdrop + 100% uncut image
                       • Meta badges placed cleanly above image
                    ========================================================= */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {displayedPosts.map((post) => (
                        <Link
                          key={post._id || post.slug}
                          href={`/blog/${post.slug}`}
                          className="group block cursor-pointer bg-white rounded-3xl border border-brand-navy/10 hover:border-brand-gold/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
                        >
                          <div>
                            {/* Top Meta Bar */}
                            <div className="flex items-center justify-between gap-2 mb-3.5">
                              {post.category ? (
                                <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-navy border border-brand-gold/30 text-[10px] font-bold uppercase tracking-wider">
                                  {post.category.name}
                                </span>
                              ) : <span />}
                              <span className="text-xs text-brand-muted flex items-center gap-1 font-medium">
                                <Clock size={12} className="text-brand-gold" />
                                <span>{post.readingTime || 5} min read</span>
                              </span>
                            </div>

                            {/* Image Container: Increased Height, Aspect-[4/3] Native Ratio */}
                            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-brand-obsidian mb-5 border border-brand-navy/10 shadow-inner group-hover:border-brand-gold/40 transition-colors">
                              {/* Ambient Blurred Backdrop */}
                              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                                <Image
                                  src={post.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                                  alt=""
                                  fill
                                  sizes="100px"
                                  className="object-cover blur-xl scale-125 brightness-75"
                                  aria-hidden="true"
                                  loading="lazy"
                                />
                              </div>
                              {/* Full Uncut Foreground Image */}
                              <Image
                                src={post.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 380px"
                                className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-500 relative z-10"
                                loading="lazy"
                              />
                            </div>

                            {/* Title & Excerpt */}
                            <h3 className="font-serif font-bold text-lg sm:text-xl text-brand-navy group-hover:text-brand-gold transition-colors leading-snug line-clamp-2 mb-3">
                              {post.title}
                            </h3>

                            <p className="text-xs text-brand-slate line-clamp-3 leading-relaxed mb-6 font-sans">
                              {post.excerpt}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-4 border-t border-brand-navy/10 flex items-center justify-between text-xs text-brand-muted">
                            <span className="font-medium text-brand-muted">
                              {post.author?.name || 'Saudagar Desk'}
                            </span>
                            <div className="font-bold uppercase tracking-wider text-brand-navy group-hover:text-brand-gold flex items-center gap-1 transition-colors">
                              <span>Read Dossier</span>
                              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}

                      {/* Luxury Skeleton Cards while loading next batch */}
                      {isLoadingMore && (
                        <div className="contents animate-pulse">
                          {[1, 2].map((n) => (
                            <div
                              key={`skeleton-grid-${n}`}
                              className="bg-white rounded-3xl border border-brand-navy/10 p-6 shadow-sm flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3.5">
                                  <div className="h-4 w-20 bg-slate-200 rounded-full" />
                                  <div className="h-4 w-16 bg-slate-100 rounded" />
                                </div>
                                <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/80 mb-5" />
                                <div className="h-6 w-5/6 bg-slate-200 rounded-lg mb-3" />
                                <div className="h-3.5 w-full bg-slate-100 rounded mb-2" />
                                <div className="h-3.5 w-4/6 bg-slate-100 rounded mb-6" />
                              </div>
                              <div className="pt-4 border-t border-brand-navy/10 flex items-center justify-between">
                                <div className="h-3.5 w-20 bg-slate-100 rounded" />
                                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Infinite Scroll Sentinel */}
                  <div ref={sentinelRef} className="w-full h-6 pointer-events-none my-2" aria-hidden="true" />

                  {/* Active Loading Spinner State */}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center gap-2.5 py-6 text-brand-gold">
                      <Loader2 size={18} className="animate-spin text-brand-gold" />
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                        Loading additional research dossiers...
                      </span>
                    </div>
                  )}

                  {/* Manual Fallback Trigger */}
                  {hasMore && !isLoadingMore && (
                    <div className="text-center pt-8 pb-4">
                      <button
                        onClick={handleLoadMore}
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-brand-navy/15 hover:border-brand-gold bg-white hover:bg-brand-navy text-brand-navy hover:text-brand-gold text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                      >
                        <span>Load More Research ({filteredPosts.length - visibleCount} Remaining)</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* End of Catalog Indicator */}
                  {!hasMore && filteredPosts.length > BATCH_SIZE && (
                    <div className="py-8 text-center border-t border-brand-navy/10 mt-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-navy text-xs font-medium">
                        <CheckCircle2 size={14} className="text-brand-gold" />
                        <span>All {filteredPosts.length} research dossiers loaded</span>
                      </div>
                      <p className="text-[11px] text-brand-muted mt-2">
                        You have explored the complete archive in this selection.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Empty Category State */
                <div className="bg-white rounded-3xl p-12 text-center border border-brand-navy/10 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-4 font-bold">
                    <BookOpen size={24} />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-brand-navy mb-2">No research dossiers found</h4>
                  <p className="text-xs text-brand-slate max-w-md mx-auto mb-6">
                    No articles currently published under this category. Explore other categories or view all analyses.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-obsidian transition-all cursor-pointer"
                  >
                    View All Analyses
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT: High-Impact Editorial Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Widget 1: Most Read Analyses (Ranked 01-04) */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-brand-navy/10 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-brand-navy/10">
                  <TrendingUp size={16} className="text-brand-gold" />
                  <h3 className="text-lg font-serif font-bold text-brand-navy">
                    Most Read Intelligence
                  </h3>
                </div>

                <div className="space-y-6">
                  {popularStories.map((post, idx) => (
                    <div
                      key={post._id || post.slug}
                      className="flex items-start gap-4 pb-5 border-b border-brand-navy/10 last:border-b-0 last:pb-0 group"
                    >
                      <span className="font-serif font-bold text-2xl text-brand-gold shrink-0 w-7">
                        0{idx + 1}
                      </span>
                      <div className="flex-1">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                            {post.category.name}
                          </span>
                        )}
                        <h4 className="font-serif font-bold text-sm text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-1">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>{post.readingTime || 5} min read</span>
                          <span>•</span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-bold text-brand-navy hover:text-brand-gold transition-colors"
                          >
                            Explore →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Confidential Title Search & Valuation Callout */}
              <div className="bg-gradient-to-br from-brand-navy via-brand-text-dark to-brand-obsidian text-white rounded-3xl p-7 sm:p-8 border border-brand-gold/30 shadow-xl relative overflow-hidden">
                <div 
                  aria-hidden="true"
                  className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-brand-gold/15 blur-2xl pointer-events-none"
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-brand-gold/40 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    <ShieldCheck size={12} className="text-brand-gold" />
                    <span>Fiduciary Concierge</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 leading-snug">
                    Require Independent Due Diligence for DLF Phase 1–5?
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                    Speak directly with Arun Sharma and senior principals for discreet title vetting, builder floor registry valuation, or pre-acquisition scrutiny.
                  </p>

                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/${(cms.newsletter?.whatsappNumber || '919718511207').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-obsidian text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <WhatsAppIcon size={15} />
                        <span>WhatsApp Advisory Desk</span>
                      </a>

                      <a
                        href="tel:+919811221207"
                        className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <PhoneCall size={14} className="text-brand-gold" />
                        <span>Direct Line (+91 98112 21207)</span>
                      </a>
                    </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
