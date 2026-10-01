import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Briefcase, Factory, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-lg mx-auto backdrop-blur-md">
            {pillars.map((p, idx) => {
              const isActive = activePillar === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(idx)}
                  className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
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
                  <span className="relative z-10 font-mono text-[10px] opacity-75">{p.number}</span>
                  <span className="relative z-10">{p.id}</span>
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

        {/* ================= MOBILE / TABLET VIEW CARDS ================= */}
        <div className="lg:hidden space-y-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden border border-[#C5A880]/30 bg-slate-950 p-6 sm:p-8"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img src={p.bgImage} alt={p.title} className="w-full h-full object-cover opacity-25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 text-[#C5A880] flex items-center justify-center border border-white/20">
                      <Icon size={20} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-bold tracking-widest uppercase">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    {p.quote}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.keyPoints.map((pt, ptIdx) => (
                      <div
                        key={ptIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white"
                      >
                        <CheckCircle2 size={12} className="text-[#C5A880]" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      to={p.ctaLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-[#0C101A] font-bold text-xs uppercase tracking-wider"
                    >
                      <span>{p.ctaText}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
