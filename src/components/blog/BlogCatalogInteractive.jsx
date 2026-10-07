"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
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
  Filter,
  X,
  FileText,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import CorridorIntelligenceHub from '@/components/blog/CorridorIntelligenceHub';

export default function BlogCatalogInteractive({ allPosts = [], categories = [], locations = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    let result = allPosts;

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug === selectedCategory ||
          p.category?.slug === selectedCategory
      );
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allPosts, selectedCategory, searchQuery]);

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
      <section className="py-16 md:py-24 bg-[#F7F5EF] text-[#17213D] border-b border-[#17213D]/10 relative overflow-hidden">
        {/* Subtle Luxury Watermark Grid */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:48px_48px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Eyebrow & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#17213D]/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#D09A16] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                <Sparkles size={13} />
                <span>Editorial Spotlight • Cover Dossier</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] tracking-tight leading-tight">
                Curated High-Value <span className="italic font-serif text-[#D09A16]">Research Dispatches</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#566078] max-w-md font-sans leading-relaxed">
              In-depth fiduciary valuation benchmarks, 30-year DLF Phase 1–5 registry insights, and sovereign NRI capital repatriation advisory.
            </p>
          </div>

          {/* ASYMMETRIC 3D MAGAZINE SPREAD */}
          {leadStory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
              
              {/* LEFT: Cinematic Lead Cover Story Card (8 Cols) */}
              <motion.article 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8 group bg-white rounded-3xl border border-[#17213D]/10 hover:border-[#D09A16]/60 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_60px_rgba(208,154,22,0.18)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 mb-8 border border-[#17213D]/10">
                    <Image
                      src={leadStory.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                      alt={leadStory.featuredImageAlt || leadStory.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Luxury Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E17]/90 backdrop-blur-md text-[#D09A16] border border-[#D09A16]/40 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                        Cover Story • High Impact
                      </span>
                      {leadStory.category && (
                        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#17213D] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {leadStory.category.name}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#D09A16]" />
                        <span>{leadStory.readingTime || 7} min read</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#D09A16] font-semibold">
                        VERIFIED DISPATCH
                      </span>
                    </div>
                  </div>

                  {/* Headline & Excerpt */}
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-tight">
                      <Link href={`/blog/${leadStory.slug}`}>
                        {leadStory.title}
                      </Link>
                    </h3>

                    <p className="text-sm sm:text-base text-[#566078] leading-relaxed font-sans line-clamp-3">
                      {leadStory.excerpt}
                    </p>

                    {/* Key Strategic Takeaways Pill Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#17213D]/10">
                      <div className="flex items-start gap-2 text-xs text-[#17213D]">
                        <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                        <span>Freehold registry scrutiny &amp; municipal clearances</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[#17213D]">
                        <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                        <span>Quarterly capital appreciation &amp; rental yields</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="pt-8 mt-8 border-t border-[#17213D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#17213D] text-[#D09A16] font-serif font-bold flex items-center justify-center text-sm shadow-sm">
                      {leadStory.author?.name ? leadStory.author.name.charAt(0) : 'S'}
                    </div>
                    <div>
                      <span className="block font-serif font-bold text-sm text-[#17213D]">
                        {leadStory.author?.name || 'Saudagar Research Desk'}
                      </span>
                      <span className="text-[11px] text-[#8892A6]">
                        Executive Advisory Principals
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${leadStory.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#17213D] hover:bg-[#D09A16] text-[#F7F5EF] hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
                  >
                    <span>Read Full Dossier</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>

              {/* RIGHT: Stacked Editor's Dispatches (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] flex items-center gap-2">
                    <BookOpen size={14} />
                    <span>Executive Briefs</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#8892A6]">
                    Weekly Dispatches
                  </span>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  {secondaryStories.map((post, idx) => (
                    <motion.article
                      key={post._id || post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="group p-5 sm:p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16]/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-1"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#D09A16] mb-2">
                          <span>{post.category?.name || 'Market Report'}</span>
                          <span className="text-slate-400 font-mono">0{idx + 1}</span>
                        </div>

                        <h4 className="font-serif font-bold text-base text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug line-clamp-2 mb-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>

                        <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#17213D]/10 flex items-center justify-between text-[11px] text-[#8892A6]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#D09A16]" />
                          <span>{post.readingTime || 5} min read</span>
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-bold text-[#17213D] group-hover:text-[#D09A16] flex items-center gap-1 transition-colors"
                        >
                          <span>Brief</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DARK — CORRIDOR INTELLIGENCE HUB (GEOGRAPHIC RADAR)
      ========================================================================= */}
      <CorridorIntelligenceHub locations={locations} allPosts={allPosts} />

      {/* =========================================================================
          SECTION 4: LIGHT — INTERACTIVE RESEARCH LIBRARY & CATEGORY CLUSTERS
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#F7F5EF] text-[#17213D] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar: Category Pills + Live Search */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#17213D]/10 shadow-[0_15px_35px_rgba(23,33,61,0.04)] mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Category Pills Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 luxury-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-[#17213D] text-white shadow-sm'
                      : 'text-[#566078] hover:text-[#17213D] hover:bg-[#F7F5EF]'
                  }`}
                >
                  {selectedCategory === 'all' && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-[#17213D] rounded-xl -z-10"
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
                          ? 'bg-[#17213D] text-white shadow-sm'
                          : 'text-[#566078] hover:text-[#17213D] hover:bg-[#F7F5EF]'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeFilterPill"
                          className="absolute inset-0 bg-[#17213D] rounded-xl -z-10"
                        />
                      )}
                      <span>{cat.name} ({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative min-w-[280px] sm:min-w-[340px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#F7F5EF] border border-[#17213D]/10 text-xs font-medium text-[#17213D] placeholder-slate-400 focus:outline-none focus:border-[#D09A16] focus:ring-1 focus:ring-[#D09A16] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17213D] p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* MAIN ARTICLES GRID + EDITORIAL SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* LEFT: Articles Grid (8 cols) */}
            <div className="lg:col-span-8">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#17213D]/10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] flex items-center gap-2">
                  <FileText size={14} />
                  <span>Research Library</span>
                </span>
                <span className="text-xs text-[#566078] font-medium">
                  Showing {filteredPosts.length} Articles
                </span>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, idx) => (
                    <motion.article
                      key={post._id || post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: (idx % 4) * 0.1 }}
                      whileHover={{ y: -6 }}
                      className="group bg-white rounded-3xl border border-[#17213D]/10 hover:border-[#D09A16]/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 mb-5 border border-[#17213D]/5">
                          <Image
                            src={post.featuredImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 360px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                          {post.category && (
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 rounded-full bg-[#0A0E17]/85 backdrop-blur-md text-[#D09A16] text-[10px] font-bold uppercase tracking-wider border border-white/15">
                                {post.category.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Excerpt */}
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-xs text-[#566078] line-clamp-3 leading-relaxed mb-6 font-sans">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-[#17213D]/10 flex items-center justify-between text-xs text-[#8892A6]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={12} className="text-[#D09A16]" />
                          <span>{post.readingTime || 5} min read</span>
                        </span>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-bold uppercase tracking-wider text-[#17213D] group-hover:text-[#D09A16] flex items-center gap-1 transition-colors"
                        >
                          <span>Read Dossier</span>
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                /* Empty Search State */
                <div className="bg-white rounded-3xl p-12 text-center border border-[#17213D]/10 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mx-auto mb-4 font-bold">
                    <Search size={24} />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#17213D] mb-2">No research dossiers found</h4>
                  <p className="text-xs text-[#566078] max-w-md mx-auto mb-6">
                    No articles matched &ldquo;{searchQuery}&rdquo;. Try another search term or reset category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#17213D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D09A16] hover:text-[#0A0E17] transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT: High-Impact Editorial Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Widget 1: Most Read Analyses (Ranked 01-04) */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#17213D]/10 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#17213D]/10">
                  <TrendingUp size={16} className="text-[#D09A16]" />
                  <h3 className="text-lg font-serif font-bold text-[#17213D]">
                    Most Read Intelligence
                  </h3>
                </div>

                <div className="space-y-6">
                  {popularStories.map((post, idx) => (
                    <div
                      key={post._id || post.slug}
                      className="flex items-start gap-4 pb-5 border-b border-[#17213D]/10 last:border-b-0 last:pb-0 group"
                    >
                      <span className="font-serif font-bold text-2xl text-[#D09A16] shrink-0 w-7">
                        0{idx + 1}
                      </span>
                      <div className="flex-1">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                            {post.category.name}
                          </span>
                        )}
                        <h4 className="font-serif font-bold text-sm text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug mb-1">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>{post.readingTime || 5} min read</span>
                          <span>•</span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-bold text-[#17213D] hover:text-[#D09A16] transition-colors"
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
              <div className="bg-gradient-to-br from-[#17213D] via-[#121A2F] to-[#0A0E17] text-white rounded-3xl p-7 sm:p-8 border border-[#D09A16]/30 shadow-xl relative overflow-hidden">
                <div 
                  aria-hidden="true"
                  className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#D09A16]/15 blur-2xl pointer-events-none"
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    <ShieldCheck size={12} className="text-[#D09A16]" />
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
                      href="https://wa.me/919718511207"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Advisory Desk</span>
                    </a>

                    <a
                      href="tel:+919811221207"
                      className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <PhoneCall size={14} className="text-[#D09A16]" />
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
