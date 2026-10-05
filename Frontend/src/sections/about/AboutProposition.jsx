import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Briefcase, Factory, ArrowUpRight, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { animate, inView, stagger } from 'framer-motion';

const dummyTimeline = { 
  to: function(target, vars) { gsap.to(target, vars); return this; }, 
  from: function() { return this; }, 
  fromTo: function(target, fromVars, toVars) { gsap.fromTo(target, fromVars, toVars); return this; } 
};
const gsap = { 
  to: (target, vars) => {
    if (!target) return;
    try {
      const options = { duration: vars.duration || 0.4, delay: vars.delay || 0 };
      if (vars.stagger) options.delay = stagger(vars.stagger);
      const safeVars = { ...vars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => delete safeVars[p]);
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;

      if (vars.scrollTrigger) {
         inView(vars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeVars, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeVars, options);
      }
    } catch(e){}
  }, 
  from: () => {}, 
  fromTo: (target, fromVars, toVars) => {
    if (!target) return;
    try {
      const options = { duration: toVars.duration || 1, delay: toVars.delay || 0 };
      if (toVars.stagger) options.delay = stagger(toVars.stagger);
      const safeFrom = { ...fromVars }; const safeTo = { ...toVars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => { delete safeFrom[p]; delete safeTo[p]; });
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;
      
      animate(elements, safeFrom, { duration: 0 });
      if (toVars.scrollTrigger) {
         inView(toVars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeTo, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeTo, options);
      }
    } catch(e){}
  }, 
  context: (cb) => { if(cb) { try { cb(); } catch(e){} } return { revert: () => {} }; }, 
  registerPlugin: () => {},
  timeline: () => dummyTimeline 
};
const ScrollTrigger = {};


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

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 2. Stage Reveal
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 45, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="proposition" 
      className="relative py-16 md:py-24 bg-[#0C101A] text-white overflow-hidden"
    >
      {/* Ambient Lighting */}
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
        <div
          ref={headerRef}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D09A16] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles size={13} className="text-[#D09A16]" />
            <span>Our Proposition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            Where Our <span className="italic font-light text-[#D09A16]">Expertise Lies</span>
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
                      className="absolute inset-0 bg-gradient-to-r from-[#D09A16] to-[#E2CEB4] rounded-xl shadow-[0_4px_20px_rgba(197,168,128,0.4)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 font-mono text-[9px] sm:text-[10px] opacity-75">{p.number}</span>
                  <span className="relative z-10 truncate">{p.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= INTERACTIVE 3D EXPANDING SHOWCASE STAGE ================= */}
        <div 
          ref={stageRef}
          className="hidden lg:flex gap-4 h-[560px] items-stretch"
        >
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
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-colors duration-300 border ${
                  isExpanded
                    ? 'flex-[3.5] border-[#D09A16] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,168,128,0.25)]'
                    : 'flex-[1] border-white/10 hover:border-[#D09A16]/50 hover:brightness-110'
                }`}
              >
                {/* Background Image with Zoom on Active */}
                <div className="absolute inset-0">
                  <img
                    src={p.bgImage}
                    alt={p.title}
                    width="1400"
                    height="900"
                    loading="lazy"
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
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#D09A16] flex items-center justify-center shadow-md">
                      <Icon size={22} />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold tracking-widest uppercase">
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
                              <CheckCircle2 size={13} className="text-[#D09A16]" />
                              <span className="font-medium text-[11px]">{pt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-3">
                          <Link
                            to={p.ctaLink}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(197,168,128,0.3)] hover:-translate-y-0.5"
                          >
                            <span>{p.ctaText}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-[#D09A16] uppercase tracking-wider">
                          Phase {p.number}
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white line-clamp-1">
                          {p.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View (below lg) */}
        <div className="lg:hidden mt-8">
          {(() => {
            const current = pillars[activePillar];
            const Icon = current.icon;
            return (
              <div className="relative rounded-3xl overflow-hidden border border-[#D09A16]/50 bg-slate-900 p-6 shadow-2xl">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={current.bgImage}
                    alt={current.title}
                    width="800"
                    height="500"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-[#D09A16] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Icon size={12} />
                    <span>{current.tag}</span>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-2">{current.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{current.quote}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {current.keyPoints.map((pt, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 text-white flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#D09A16]" />
                      <span>{pt}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Link
                    to={current.ctaLink}
                    className="px-5 py-2.5 rounded-xl bg-[#D09A16] text-[#0C101A] font-bold text-xs uppercase tracking-wider"
                  >
                    {current.ctaText}
                  </Link>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActivePillar((prev) => (prev - 1 + pillars.length) % pillars.length)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white"
                      aria-label="Previous proposition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActivePillar((prev) => (prev + 1) % pillars.length)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white"
                      aria-label="Next proposition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </section>
  );
}
