"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  Navigation, 
  BookOpen, 
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function CorridorIntelligenceHub({ locations = [], allPosts = [] }) {
  const [activeSlug, setActiveSlug] = useState(locations[0]?.slug || 'dlf-phase-1');

  const activeLocation = locations.find(l => l.slug === activeSlug) || locations[0] || {
    name: 'DLF Phase 1',
    slug: 'dlf-phase-1',
    description: 'Premier freehold residential enclave featuring mature tree canopies, high-end builder floors, and private kothis.',
  };

  const matchingPostsCount = allPosts.filter(
    (p) =>
      p.locationSlugs?.includes(activeLocation.slug) ||
      p.location?.some((l) => l.slug === activeLocation.slug)
  ).length;

  return (
    <section className="bg-[#0A0E17] text-white py-20 md:py-24 border-y border-white/10 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.12) 0%, rgba(208,154,22,0) 70%)' }}
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 w-80 h-80 rounded-full bg-[#17213D]/40 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
              <Compass size={13} className="text-[#D09A16]" />
              <span>Interactive Geographic Radar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Location-Based <span className="italic font-serif text-[#D09A16]">Market Intelligence</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-sans leading-relaxed">
            Select a prime Gurugram micro-market below to inspect real-time zoning benchmarks, capital appreciation drivers, and published advisory research.
          </p>
        </div>

        {/* Compact Horizontal Corridor Switcher Strip (No Endless Scrolling!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 luxury-scrollbar scroll-smooth">
          {locations.map((loc) => {
            const isSelected = loc.slug === activeLocation.slug;
            return (
              <button
                key={loc._id || loc.slug}
                onClick={() => setActiveSlug(loc.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#D09A16] text-[#0A0E17] font-bold shadow-[0_0_15px_rgba(208,154,22,0.35)] ring-1 ring-[#D09A16]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <MapPin size={12} className={isSelected ? 'text-[#0A0E17]' : 'text-slate-400'} />
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Corridor Intelligence Dossier (Split Radar Card) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLocation.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl bg-white/[0.04] border border-white/15 p-6 sm:p-10 lg:p-12 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left: Corridor Narrative & Identity */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] text-xs font-mono font-bold uppercase tracking-wider">
                  Micro-Market #{locations.findIndex(l => l.slug === activeLocation.slug) + 1 || '01'}
                </span>
                
                {activeLocation.coordinates?.latitude && activeLocation.coordinates?.longitude && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-white/5 border border-white/10">
                    <Navigation size={11} className="text-[#D09A16]" />
                    <span>{activeLocation.coordinates.latitude.toFixed(3)}° N, {activeLocation.coordinates.longitude.toFixed(3)}° E</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                  {activeLocation.name}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
                  {activeLocation.description || 'Exclusive luxury enclave in Gurugram featuring high-net-worth real estate, independent builder floors, and high-capital growth metrics.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/blog/location/${activeLocation.slug}`}
                  className="px-6 py-3 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0A0E17] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(208,154,22,0.3)] transition-all flex items-center gap-2"
                >
                  <span>Read Full Corridor Dossier</span>
                  <ArrowRight size={13} />
                </Link>

                <Link
                  href={`/properties?location=${activeLocation.slug}`}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Building2 size={13} className="text-[#D09A16]" />
                  <span>View Verified Listings</span>
                </Link>
              </div>
            </div>

            {/* Right: Micro-Market Intelligence Metrics Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#D09A16]/20 text-[#D09A16] flex items-center justify-center font-bold mb-3">
                  <TrendingUp size={16} />
                </div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white">
                  12% – 16%
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Avg Annual Capital CAGR
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#D09A16]/20 text-[#D09A16] flex items-center justify-center font-bold mb-3">
                  <BookOpen size={16} />
                </div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white">
                  {matchingPostsCount} {matchingPostsCount === 1 ? 'Article' : 'Articles'}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Published Intelligence
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#D09A16]/20 text-[#D09A16] flex items-center justify-center font-bold mb-3">
                  <Building2 size={16} />
                </div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white">
                  Freehold
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Dominant Land Tenure
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#D09A16]/20 text-[#D09A16] flex items-center justify-center font-bold mb-3">
                  <ShieldCheck size={16} />
                </div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white">
                  100%
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  RERA / Registry Verified
                </span>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
