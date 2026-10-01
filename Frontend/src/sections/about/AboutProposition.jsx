import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Briefcase, Factory, ArrowUpRight, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutProposition() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: "residential",
      number: "01",
      icon: Compass,
      tag: "Residential Solutions",
      title: "Residential Plots, Kothis & Floors",
      headline: "Curating Dream Homes For Discerning Families",
      quote: "Our expertise lies in sale and purchase of Residential Plots, Kothis, Apartments & Builder floors. So, we suggest properties that can best serve your family’s needs.",
      keyPoints: [
        "Residential Plots & Kothis",
        "Designer Builder Floors",
        "Luxury Penthouses & Villas",
        "DLF Phase 1–5 & Sushant Lok"
      ],
      bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Explore Residential",
      ctaLink: "/ready-to-move"
    },
    {
      id: "commercial",
      number: "02",
      icon: Briefcase,
      tag: "Commercial Advisory",
      title: "Strategic Corporate & Office Spaces",
      headline: "Where Visionary Ideas Flourish & Expand",
      quote: "Our experts offer advice to streamline and consolidate the right office space for you because we know that the greatest of ideas flourish when encouraged.",
      keyPoints: [
        "Modern Class-A Office Spaces",
        "Cyber City & Golf Course Road",
        "Corporate Floor Consolidation",
        "High-Yield Rental Opportunities"
      ],
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Inquire Office Spaces",
      ctaLink: "/contact"
    },
    {
      id: "industrial",
      number: "03",
      icon: Factory,
      tag: "Industrial Logistics",
      title: "Industrial Plots & Warehouses",
      headline: "Prime Logistics & Industrial Infrastructure",
      quote: "We offer unique solutions when it comes to buying industrial plots, warehouses, or grabbing other leasing opportunities. Finding the right space for you is our motto.",
      keyPoints: [
        "Strategic Industrial Plots",
        "High-Capacity Warehouses",
        "Institutional Long-term Leases",
        "Udyog Vihar & Key NCR Nodes"
      ],
      bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Discover Industrial Deals",
      ctaLink: "/contact"
    }
  ];

  return (
    <section id="proposition" className="relative py-12 md:py-16 bg-[#0C101A] text-white overflow-hidden">
      {/* Ambient Lighting (0 blur, 0 rasterization overhead) */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(197,168,128,0.18) 0%, rgba(197,168,128,0) 70%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(179,147,102,0.12) 0%, rgba(179,147,102,0) 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles size={13} className="text-[#C5A880]" />
            <span>Our Proposition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            Where Our <span className="italic font-light text-[#C5A880]">Expertise Lies</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Let’s have a look at where our expertise lies and what it brings out for you.
          </p>

          {/* Interactive Pillar Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mt-8 p-1 sm:p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm sm:max-w-lg mx-auto backdrop-blur-md">
            {pillars.map((p, idx) => {
              const isActive = activePillar === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(idx)}
                  className={`relative px-2 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                    isActive ? 'text-[#0C101A]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePillarTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#C5A880] to-[#E2CEB4] rounded-xl shadow-[0_4px_20px_rgba(197,168,128,0.4)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 font-mono text-[9px] sm:text-[10px] opacity-75">{p.number}</span>
                  <span className="relative z-10 truncate">{p.id}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ================= INTERACTIVE 3D EXPANDING SHOWCASE STAGE ================= */}
        <div className="hidden lg:flex gap-4 h-[560px] items-stretch">
          {pillars.map((p, idx) => {
            const isExpanded = activePillar === idx;
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                onClick={() => setActivePillar(idx)}
                onMouseEnter={() => setActivePillar(idx)}
                layout
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border ${
                  isExpanded
                    ? 'flex-[3.5] border-[#C5A880] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,168,128,0.25)]'
                    : 'flex-[1] border-white/10 hover:border-[#C5A880]/50 hover:brightness-110'
                }`}
              >
                {/* Background Image with Zoom on Active */}
                <div className="absolute inset-0">
                  <img
                    src={p.bgImage}
                    alt={p.title}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isExpanded ? 'scale-105' : 'scale-100 filter grayscale brightness-50'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                </div>

                {/* Big Artistic Watermark Numeral */}
                <div className="absolute top-4 right-6 text-7xl xl:text-8xl font-serif font-bold text-white/5 pointer-events-none select-none">
                  {p.number}
                </div>

                {/* Content Container */}
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] flex items-center justify-center shadow-md">
                      <Icon size={22} />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-bold tracking-widest uppercase">
                      {p.tag}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div>
                    {isExpanded ? (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="space-y-4"
                      >
                        <h3 className="text-2xl xl:text-3xl font-serif font-bold text-white leading-tight">
                          {p.title}
                        </h3>

                        <p className="text-xs xl:text-sm text-slate-200 font-light leading-relaxed max-w-xl">
                          {p.quote}
                        </p>

                        {/* Interactive Feature Pills */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {p.keyPoints.map((pt, ptIdx) => (
                            <div
                              key={ptIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white"
                            >
                              <CheckCircle2 size={13} className="text-[#C5A880]" />
                              <span className="font-medium text-[11px]">{pt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-3">
                          <Link
                            to={p.ctaLink}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(197,168,128,0.3)] hover:-translate-y-0.5"
                          >
                            <span>{p.ctaText}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      // Collapsed Preview Bar
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-[#C5A880] tracking-widest">{p.number}</span>
                        <h4 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
                          {p.id}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">Click to explore</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= MOBILE / TABLET VIEW: DYNAMIC INTERACTIVE SHOWCASE ================= */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {(() => {
              const currentPillar = pillars[activePillar];
              const Icon = currentPillar.icon;

              return (
                <motion.div
                  key={currentPillar.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, { offset }) => {
                    if (offset.x < -40) {
                      setActivePillar((prev) => (prev + 1) % pillars.length);
                    } else if (offset.x > 40) {
                      setActivePillar((prev) => (prev - 1 + pillars.length) % pillars.length);
                    }
                  }}
                  className="relative rounded-3xl overflow-hidden border border-[#C5A880]/30 bg-gradient-to-b from-[#131926] via-[#0E131E] to-[#0A0D14] shadow-[0_20px_50px_rgba(0,0,0,0.6)] touch-pan-y"
                >
                  {/* Visual Architectural Image Header */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                    <img
                      src={currentPillar.bgImage}
                      alt={currentPillar.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Atmospheric Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131926] via-[#131926]/40 to-black/60" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-bold tracking-widest uppercase">
                        {currentPillar.tag}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold">
                        {currentPillar.number} / 03
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 pt-0 space-y-3.5">
                    {/* Floating Luxury Icon Squircle - Positioned smoothly over image seam */}
                    <div className="-mt-6 mb-2 relative z-20">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A880] to-[#9E825B] text-[#0C101A] flex items-center justify-center shadow-[0_8px_20px_rgba(197,168,128,0.4)] border-2 border-[#131926]">
                        <Icon size={22} className="stroke-[2.2]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                        {currentPillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {currentPillar.quote}
                      </p>
                    </div>

                    {/* Key Highlights Grid - 2 columns for compact thumb-friendly mobile scanning */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {currentPillar.keyPoints.map((pt, ptIdx) => (
                        <div
                          key={ptIdx}
                          className="flex items-start gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200"
                        >
                          <CheckCircle2 size={13} className="text-[#C5A880] shrink-0 mt-0.5" />
                          <span className="font-medium text-[11px] leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-1">
                      <Link
                        to={currentPillar.ctaLink}
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-[#0C101A] font-bold text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(197,168,128,0.3)] active:scale-[0.99] transition-transform"
                      >
                        <span>{currentPillar.ctaText}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>

                    {/* Bottom Navigation & Thumb Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <button
                        onClick={() => setActivePillar((prev) => (prev - 1 + pillars.length) % pillars.length)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-medium active:bg-white/10 transition-colors"
                        aria-label="Previous proposition"
                      >
                        <ChevronLeft size={15} />
                        <span className="text-[11px]">Prev</span>
                      </button>

                      {/* Dot Step Indicators */}
                      <div className="flex items-center gap-1.5">
                        {pillars.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setActivePillar(dotIdx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              activePillar === dotIdx
                                ? 'w-5 bg-[#C5A880]'
                                : 'w-1.5 bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setActivePillar((prev) => (prev + 1) % pillars.length)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-medium active:bg-white/10 transition-colors"
                        aria-label="Next proposition"
                      >
                        <span className="text-[11px]">Next</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
