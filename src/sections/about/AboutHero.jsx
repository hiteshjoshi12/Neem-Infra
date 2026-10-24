"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Building, TrendingUp, CheckCircle2, Play, MapPin, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import Tilt3DCard from '../../components/ui/Tilt3DCard';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Image from 'next/image';
import { useCms } from '@/context/CmsContext';

export default function AboutHero({ data }) {
  const { sections, properties } = useCms();
  const rawData = data || sections?.page_about?.hero || sections?.page_about || {};
  const heroContent = rawData.titleMain ? rawData : (rawData.hero || rawData);
  const cms = { hero: heroContent };
  const activePropertyList = properties || [];

  const calculatedYears = Math.max(1, new Date().getFullYear() - 1999);
  const activePropsCount = activePropertyList.length || 23;
  const defaultStats = [
    { icon: Award, value: calculatedYears, suffix: "+", label: "Years in DLF Gurugram", subtext: "Established 1999" },
    { icon: Building, value: activePropsCount, suffix: "+", label: "Properties Cataloged", subtext: "Active Vetted Listings" },
    { icon: ShieldCheck, value: 5, suffix: "", label: "DLF Phases Covered", subtext: "Phases 1, 2, 3, 4 & 5" },
    { icon: TrendingUp, value: 7, suffix: "", label: "Prime Micro-Markets", subtext: "Gurugram Corridors" }
  ];

  const STAT_ICONS = [Award, Building, ShieldCheck, TrendingUp];
  const statsList = (cms?.stats && Array.isArray(cms.stats) && cms.stats.length > 0)
    ? cms.stats
    : (rawData?.hero?.stats || defaultStats);

  const stats = statsList.map((st, idx) => ({
    ...defaultStats[idx % defaultStats.length],
    ...st,
    icon: STAT_ICONS[idx % STAT_ICONS.length]
  }));

  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightCardRef = useRef(null);
  const metricStripRef = useRef(null);

  // 5-second automatic property rotation in opening section card
  const [currentPropIndex, setCurrentPropIndex] = useState(0);

  useEffect(() => {
    if (activePropertyList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPropIndex((prev) => (prev + 1) % activePropertyList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activePropertyList.length]);

  const activeProperty = activePropertyList[currentPropIndex] || activePropertyList[0] || null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".about-hero-anim",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, clearProps: "transform" }
      );

      // 2. Right 3D Showcase Card
      if (rightCardRef.current) {
        gsap.fromTo(
          rightCardRef.current,
          { opacity: 0, scale: 0.92, x: 40, rotateY: -10 },
          { opacity: 1, scale: 1, x: 0, rotateY: 0, duration: 1.1, delay: 0.2, ease: "power3.out", clearProps: "transform" }
        );
      }

      // 3. Metric Strip Entrance
      if (metricStripRef.current) {
        gsap.fromTo(
          metricStripRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out", clearProps: "transform" }
        );
      }

      // 4. Background Parallax
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[88vh] flex flex-col justify-center pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden bg-brand-obsidian text-white border-b border-white/10"
    >
      {/* 1. Cinematic Background Image - Clearly Visible */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <Image
          ref={bgImgRef}
          src={cms.hero?.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"}
          alt="DLF Luxury Villa Architecture"
          width={2400}
          height={1350}
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.05]"
        />
        {/* Soft directional gradient for editorial clarity while keeping image visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian/85 via-brand-obsidian/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-brand-obsidian/60 pointer-events-none" />
      </div>

      {/* 2. Ambient Golden Light Beams */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22,0.18) 0%, rgba(208, 154, 22,0) 70%)' }}
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22,0.12) 0%, rgba(208, 154, 22,0) 70%)' }}
      />

      {/* 3. Architectural Accent Rings */}
      <div className="absolute top-24 right-1/4 w-80 h-80 rounded-full border border-brand-gold/15 pointer-events-none" />
      <div className="absolute top-36 right-1/4 w-56 h-56 rounded-full border border-dashed border-brand-gold/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Breadcrumb Navigation */}
        <div className="about-hero-anim flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <span className="text-brand-gold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
            <span>About Us</span>
          </span>
        </div>

        {/* 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">

          {/* LEFT COLUMN: Editorial Typography & Authenticated Content */}
          <div ref={leftContentRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Gold Badge */}
            <div className="about-hero-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-brand-gold/40 text-brand-gold text-xs font-bold tracking-[0.25em] uppercase shadow-sm backdrop-blur-md">
              <Sparkles size={14} className="text-brand-gold" />
              <span>{cms.hero?.badge || "About Saudagar Properties • 25+ Years Legacy"}</span>
            </div>

            {/* High-Impact Serif Headline */}
            <h1 className="about-hero-anim text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              {cms.hero?.titleMain || "25+ Years of Leadership in "} <br />
              <span className="italic font-light text-brand-gold">
                {cms.hero?.titleItalic || "DLF Gurugram"}
              </span>
            </h1>

            {/* Authenticated Copy */}
            <p className="about-hero-anim text-sm sm:text-base md:text-lg text-slate-200 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {cms.hero?.description || "At Saudagar Properties, we aim to assist our customers by providing them optimal property solutions across commercial, industrial, and residential sectors in DLF Gurugram."}
            </p>

            {/* Action CTA Buttons */}
            <div className="about-hero-anim flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#video-tour"
                className="px-8 py-4 rounded-2xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-extrabold text-xs uppercase tracking-[0.18em] flex items-center gap-3 transition-all duration-300 shadow-[0_10px_25px_rgba(201,160,80,0.35)] hover:shadow-[0_15px_35px_rgba(201,160,80,0.45)] hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={10} className="fill-brand-gold ml-0.5" />
                </div>
                <span>{cms.hero?.watchFilmText || "Watch Corporate Film"}</span>
              </a>

              <a
                href="#proposition"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-brand-obsidian border border-white/20 hover:border-white font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5 backdrop-blur-md"
              >
                <span>{cms.hero?.propositionBtnText || "Our Proposition"}</span>
                <ArrowRight size={14} className="text-brand-gold group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Direct Verification Micro-badge */}
            <div className="about-hero-anim flex items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-300">
              <CheckCircle2 size={15} className="text-brand-gold" />
              <span>{cms.hero?.addressBadge || "Headquartered at 38, Akashneem Marg, DLF Phase 2, Gurugram"}</span>
            </div>

          </div>

          {/* RIGHT COLUMN: 5-Second Rotating Property Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={rightCardRef}
              className="relative w-full max-w-md"
            >
              {/* Outer 3D Halo Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-gold/30 to-brand-gold/10 rounded-[36px] blur-2xl pointer-events-none" />

              {/* 3D Tilt Card Container */}
              <Tilt3DCard maxTilt={8} className="w-full">
                {activeProperty ? (
                  <div className="relative rounded-[32px] overflow-hidden border border-white/15 bg-brand-navy-surface/90 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col justify-between text-white">

                    {/* Header Badge & 5s Live Pulse Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                        <span>Live Portfolio • Rotates Every 5s</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {String(currentPropIndex + 1).padStart(2, '0')}/{String(activePropertyList.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Animated Visual Card Header */}
                    <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden border border-white/15 shadow-sm bg-black/40 mb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeProperty.id || activeProperty._id}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={activeProperty.img || (activeProperty.images && activeProperty.images[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                            alt={activeProperty.title || "Featured Property"}
                            fill
                            sizes="(max-width: 768px) 100vw, 450px"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
                          
                          {/* Floating Property Tag */}
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-brand-gold/50 text-brand-gold text-[10px] font-bold tracking-widest uppercase shadow-md">
                            {activeProperty.tag || "DLF Freehold"}
                          </div>

                          {/* Price Overlay */}
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-serif font-bold shadow-md">
                            {activeProperty.price}
                          </div>

                          {/* Title & Location on Image */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-sm font-serif font-bold text-white leading-snug line-clamp-1 mb-1">
                              {activeProperty.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-brand-gold font-medium">
                              <MapPin size={12} className="shrink-0" />
                              <span className="truncate">{activeProperty.location}</span>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Animated Details & Specs */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={(activeProperty.id || activeProperty._id) + '-details'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-3 mb-4"
                      >
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="text-xs text-white">
                            <span className="font-semibold text-white block mb-0.5">Specifications:</span>
                            <span className="text-[11px] text-slate-300">{activeProperty.specs}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[10px] font-bold uppercase tracking-wider shrink-0">
                            Verified Title
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 px-1">
                          {activeProperty.desc}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* 5-Second Animated Progress Bar */}
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-4">
                      <motion.div
                        key={currentPropIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light"
                      />
                    </div>

                    {/* Actions & Carousel Navigation Dots */}
                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
                      {/* Navigation Dots */}
                      <div className="flex items-center gap-1.5">
                        {activePropertyList.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPropIndex(idx)}
                            aria-label={`Show property ${idx + 1}`}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === currentPropIndex 
                                ? 'w-6 bg-brand-gold' 
                                : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                          />
                        ))}
                      </div>

                      {/* View All Link */}
                      <Link
                        href="/properties"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-gold-light transition-colors"
                      >
                        <span>Explore Catalog</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-[32px] overflow-hidden border border-brand-gold/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 p-6 backdrop-blur-2xl text-center">
                    <span className="text-brand-gold font-serif text-lg font-bold block mb-2">Saudagar Properties</span>
                    <p className="text-xs text-slate-300">DLF Phase 1–5 Premier Real Estate Advisory</p>
                  </div>
                )}
              </Tilt3DCard>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM 3D METRIC STRIP */}
        <div
          ref={metricStripRef}
          className="rounded-3xl p-6 sm:p-8 bg-brand-navy-surface/90 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl text-white"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-brand-gold transition-colors">
                      <AnimatedCounter
                        value={st.value}
                        prefix={st.prefix || ''}
                        suffix={st.suffix || ''}
                        formatComma={st.formatComma || false}
                      />
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">
                      {st.label}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {st.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
