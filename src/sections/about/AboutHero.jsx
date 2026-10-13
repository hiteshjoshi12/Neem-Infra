"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Building, TrendingUp, CheckCircle2, Play, MapPin, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import Tilt3DCard from '../../components/ui/Tilt3DCard';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Image from 'next/image';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';
import { FEATURED_PROPERTIES_DATA } from '@/constants';

export default function AboutHero() {
  const { sections } = useCms();
  const cms = sections?.page_about || DEFAULT_SECTIONS.page_about;
  const stats = [
    { icon: Award, value: 25, suffix: "+", label: "Years Experience", subtext: "DLF Phase 1–5 Pioneers" },
    { icon: TrendingUp, value: 500, prefix: "₹", suffix: "Cr+", label: "Transaction Volume", subtext: "Delivered Seamlessly" },
    { icon: ShieldCheck, value: 100, suffix: "%", label: "Direct & Transparent", subtext: "Zero Middlemen Fees" },
    { icon: Building, value: 5000, suffix: "+", formatComma: true, label: "HNI Families & Corporates", subtext: "Enduring Relationships" }
  ];

  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightCardRef = useRef(null);
  const metricStripRef = useRef(null);

  // 5-second automatic property rotation in opening section card
  const [currentPropIndex, setCurrentPropIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPropIndex((prev) => (prev + 1) % FEATURED_PROPERTIES_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeProperty = FEATURED_PROPERTIES_DATA[currentPropIndex] || FEATURED_PROPERTIES_DATA[0];

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
      className="relative min-h-[88vh] flex flex-col justify-center pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden bg-[#0A0E17] text-white"
    >
      {/* 1. Cinematic Background Image - Clearly Visible with Rich Ambient Tones */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-85">
        <Image
          ref={bgImgRef}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt="DLF Luxury Villa Architecture"
          width={2400}
          height={1350}
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center brightness-[0.80] contrast-[1.05] scale-105"
        />
        {/* Layered Scrim for Text Readability without Blacking out Architecture */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17]/85 via-[#0A0E17]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/90 via-transparent to-[#0A0E17]/40" />
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
      <div className="absolute top-24 right-1/4 w-80 h-80 rounded-full border border-[#D09A16]/15 pointer-events-none" />
      <div className="absolute top-36 right-1/4 w-56 h-56 rounded-full border border-dashed border-[#D09A16]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Breadcrumb Navigation */}
        <div className="about-hero-anim flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
          <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#D09A16] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
            <span>About Us</span>
          </span>
        </div>

        {/* 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">

          {/* LEFT COLUMN: Editorial Typography & Authenticated Content */}
          <div ref={leftContentRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Gold Badge */}
            <div className="about-hero-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-[#D09A16]/40 backdrop-blur-xl text-[#D09A16] text-xs font-bold tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(208, 154, 22,0.2)]">
              <Sparkles size={14} className="text-[#D09A16]" />
              <span>{cms.hero?.badge || "About Saudagar Properties • 25+ Years Legacy"}</span>
            </div>

            {/* High-Impact Serif Headline */}
            <h1 className="about-hero-anim text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              {cms.hero?.titleMain || "25+ Years of Leadership in "} <br />
              <span className="italic font-light text-[#D09A16] drop-shadow-[0_0_35px_rgba(208, 154, 22,0.4)]">
                {cms.hero?.titleItalic || "DLF Gurugram"}
              </span>
            </h1>

            {/* Authenticated Copy */}
            <p className="about-hero-anim text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {cms.hero?.description || "At Saudagar Properties, we aim to assist our customers by providing them optimal property solutions across commercial, industrial, and residential sectors in DLF Gurugram."}
            </p>

            {/* Action CTA Buttons */}
            <div className="about-hero-anim flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#video-tour"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(208, 154, 22,0.4)] hover:shadow-[0_15px_40px_rgba(208, 154, 22,0.6)] hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-[#0C101A] text-[#D09A16] flex items-center justify-center">
                  <Play size={10} className="fill-[#D09A16] ml-0.5" />
                </div>
                <span>Watch Corporate Film</span>
              </a>

              <a
                href="#proposition"
                className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 hover:border-[#D09A16] font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Our Proposition</span>
                <ArrowRight size={14} className="text-[#D09A16]" />
              </a>
            </div>

            {/* Direct Verification Micro-badge */}
            <div className="about-hero-anim flex items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-400">
              <CheckCircle2 size={15} className="text-[#D09A16]" />
              <span>Headquartered at 38, Akashneem Marg, DLF Phase 2, Gurugram</span>
            </div>

          </div>

          {/* RIGHT COLUMN: 5-Second Rotating Property Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={rightCardRef}
              className="relative w-full max-w-md"
            >
              {/* Outer 3D Halo Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D09A16]/30 to-[#D09A16]/10 rounded-[36px] blur-2xl pointer-events-none" />

              {/* 3D Tilt Card Container */}
              <Tilt3DCard maxTilt={8} className="w-full">
                <div className="relative rounded-[32px] overflow-hidden border border-[#D09A16]/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(208,154,22,0.25)] flex flex-col justify-between">

                  {/* Header Badge & 5s Live Pulse Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D09A16]/15 border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-[#D09A16] animate-pulse" />
                      <span>Live Portfolio • Rotates Every 5s</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {String(currentPropIndex + 1).padStart(2, '0')}/{String(FEATURED_PROPERTIES_DATA.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Animated Visual Card Header */}
                  <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-950 mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProperty.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeProperty.img}
                          alt={activeProperty.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 450px"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
                        
                        {/* Floating Property Tag */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-[#D09A16]/50 text-[#D09A16] text-[10px] font-bold tracking-widest uppercase shadow-md">
                          {activeProperty.tag}
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
                          <div className="flex items-center gap-1.5 text-[11px] text-[#D09A16] font-medium">
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
                      key={activeProperty.id + '-details'}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3 mb-4"
                    >
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                        <div className="text-xs text-slate-300">
                          <span className="font-semibold text-white block mb-0.5">Specifications:</span>
                          <span className="text-[11px] text-slate-400">{activeProperty.specs}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-[#D09A16]/20 border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold uppercase tracking-wider shrink-0">
                          Verified Title
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 px-1">
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
                      className="h-full bg-gradient-to-r from-[#D09A16] to-[#F1C40F]"
                    />
                  </div>

                  {/* Actions & Carousel Navigation Dots */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
                    {/* Navigation Dots */}
                    <div className="flex items-center gap-1.5">
                      {FEATURED_PROPERTIES_DATA.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPropIndex(idx)}
                          aria-label={`Show property ${idx + 1}`}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            idx === currentPropIndex 
                              ? 'w-6 bg-[#D09A16]' 
                              : 'w-2 bg-white/30 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>

                    {/* View All Link */}
                    <Link
                      href="/properties"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D09A16] hover:text-[#E5AC2B] transition-colors"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                </div>
              </Tilt3DCard>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM 3D METRIC STRIP */}
        <div
          ref={metricStripRef}
          className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#D09A16] transition-colors">
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
