"use client";

import { useEffect, useRef, useState } from 'react';
import {
  Award,
  ShieldCheck,
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { motion, animate, useInView, stagger, useReducedMotion } from 'framer-motion';
import { useCms } from '../../../context/CmsContext';

/* =========================================================
   DEFAULT STATS DATA (PRESERVED)
========================================================= */
const DEFAULT_STATS_DATA = [
  {
    title: '100% Client Satisfaction',
    desc: 'Putting client interests first with bespoke, personalized property advisory.',
  },
  {
    title: 'DLF Micro-Market Leaders',
    desc: 'Unmatched expertise across DLF Phase 1–5, Sushant Lok, and Cybercity.',
  },
  {
    title: 'Verified Legal Titles',
    desc: 'Comprehensive due diligence ensuring safe and secure transactions.',
  },
  {
    title: 'Discreet & Ethical Advisory',
    desc: "Trusted by India's top corporate executives and high-net-worth families.",
  },
];

const STAT_ICONS = [
  ShieldCheck,
  Layers,
  CheckCircle2,
  TrendingUp,
];

export default function ExperienceCounter() {
  const { sections } = useCms();
  const expData = sections?.services?.experienceCounter || {};

  const target = Number(expData.yearsCount) || 25;

  const badge =
    expData.badge || `${target}+ Years of Unmatched Advisory`;

  const headline =
    expData.headline ||
    'Years of Experience as a Top Real Estate Consultant in DLF Gurugram';

  const description =
    expData.description ||
    'Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property. We are committed to serving our clients with dedication, putting their needs above all else. Providing personalized solutions for all your property-related queries, we know that a satisfied customer is our greatest asset.';

  const statsList = expData.statsList || DEFAULT_STATS_DATA;
  const counterLabel = expData.counterLabel || 'Years of Authority';
  const counterSublabel =
    expData.counterSublabel ||
    "Serving India's Most Discerning Families & Corporates in Gurugram";

  const [count, setCount] = useState(1);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const statRefs = useRef([]);

  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const prefersReducedMotion = useReducedMotion();

  /* =========================================================
     COUNTER & ENTRANCE ANIMATION (PRESERVED)
  ========================================================= */
  useEffect(() => {
    if (isInView) {
      if (contentRef.current) {
        animate(
          contentRef.current,
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.8, ease: "easeOut" }
        );
      }

      animate(1, target, {
        duration: 1.8,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.round(latest)),
      });

      const activeStatEls = statRefs.current.filter(Boolean);
      if (activeStatEls.length) {
        animate(
          activeStatEls,
          { opacity: [0, 1], y: [18, 0] },
          { duration: 0.6, delay: stagger(0.08), ease: "easeOut" }
        );
      }
    }
  }, [isInView, target]);

  /* =========================================================
     SUBTLE MOUSE PARALLAX ON BLUEPRINT (DESKTOP ONLY)
  ========================================================= */
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="experience-heading"
      className="relative my-10 w-full md:my-14"
    >
      {/* =====================================================
          MAIN ARCHITECTURAL AUTHORITY FRAME
          Optimized compact vertical height
      ====================================================== */}
      <div
        ref={contentRef}
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-[#C6A24A]/25
          bg-[#0E162B]
          text-[#F7F5EF]
          shadow-[0_25px_80px_-25px_rgba(14,22,43,0.85)]
          transition-all
          duration-700
          sm:rounded-[36px]
        "
      >
        {/* =====================================================
            LAYER 1: ARCHITECTURAL BLUEPRINT BACKGROUND & GLOWS
        ====================================================== */}

        {/* Blueprint Grid Overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.03]
            [background-image:linear-gradient(to_right,#C6A24A_1px,transparent_1px),linear-gradient(to_bottom,#C6A24A_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />

        {/* Top Gold Horizon Beam */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-[#C6A24A]
            to-transparent
          "
        />

        {/* Subtle Radial Ambient Lighting */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[radial-gradient(circle,rgba(198,162,74,0.12)_0%,transparent_70%)]
            blur-[90px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-32
            -right-32
            h-[450px]
            w-[450px]
            rounded-full
            bg-[radial-gradient(circle,rgba(32,43,74,0.45)_0%,transparent_70%)]
            blur-[90px]
          "
        />

        {/* Floating Parallax Blueprint Geometry */}
        <motion.div
          aria-hidden="true"
          animate={{ x: mouseOffset.x, y: mouseOffset.y }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="pointer-events-none absolute inset-0"
        >
          {/* Large Architectural Drafting Arc */}
          <div
            className="
              absolute
              -left-16
              top-10
              h-[420px]
              w-[420px]
              rounded-full
              border
              border-[#C6A24A]/[0.07]
            "
          />

          {/* Blueprint Drafting Coordinate Tags */}
          <div className="absolute left-7 top-6 select-none font-mono text-[8px] font-semibold tracking-[0.25em] text-[#C6A24A]/40 sm:left-10 sm:top-7">
            + DLF-PHASE-II // LAT: 28.4848° N
          </div>

          <div className="absolute right-7 top-6 select-none font-mono text-[8px] font-semibold tracking-[0.25em] text-[#C6A24A]/40 sm:right-10 sm:top-7">
            ELEV: 220M // EST. 1999 +
          </div>
        </motion.div>

        {/* =====================================================
            MAIN CONTENT COMPOSITION
            Compact architectural layout
        ====================================================== */}
        <div className="relative z-10 p-6 sm:p-9 lg:p-12">

          {/* ---------------------------------------------------
              SECTION EYEBROW
          ---------------------------------------------------- */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="h-px w-8 bg-[#C6A24A] sm:w-10" />

            <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A24A]/30 bg-[#202B4A]/60 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.22em] text-[#D8BD73] shadow-sm sm:text-[9px]">
              <Sparkles size={11} className="text-[#C6A24A]" />
              <span>THE SAUDAGAR ADVANTAGE</span>
            </div>

            <span className="h-px flex-1 max-w-[60px] bg-[#C6A24A]/30" />
          </div>

          {/* ---------------------------------------------------
              TOP TIER: SIDE-BY-SIDE COMPOSITION
              LEFT: COMPACT 3D NUMBER HERO
              RIGHT: EDITORIAL HEADLINE & DESCRIPTION
          ---------------------------------------------------- */}
          <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10">

            {/* =================================================
                LEFT: 3D EXPERIENCE NUMBER HERO (4 COLS)
            ================================================== */}
            <div className="lg:col-span-4">
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-[#17213D]/70 px-6 py-6 text-center backdrop-blur-md sm:px-8 sm:py-7">

                {/* Corner Crosshairs */}
                <div aria-hidden="true" className="pointer-events-none absolute left-2.5 top-2.5 select-none font-mono text-[8px] text-[#C6A24A]/30">
                  +
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute right-2.5 top-2.5 select-none font-mono text-[8px] text-[#C6A24A]/30">
                  +
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 select-none font-mono text-[8px] text-[#C6A24A]/30">
                  +
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 select-none font-mono text-[8px] text-[#C6A24A]/30">
                  +
                </div>

                {/* Concentric Architectural Orbit Ring */}
                <motion.div
                  aria-hidden="true"
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                  className="
                    pointer-events-none
                    absolute
                    h-[210px]
                    w-[210px]
                    rounded-full
                    border
                    border-dashed
                    border-[#C6A24A]/25
                    sm:h-[240px]
                    sm:w-[240px]
                  "
                >
                  <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-[#C6A24A] bg-[#0E162B] shadow-[0_0_10px_rgba(198,162,74,0.9)]" />
                </motion.div>

                {/* 3D Numerical Typography Composition */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-2 inline-flex items-center gap-1.5">
                    <span className="h-px w-4 bg-[#C6A24A]" />
                    <Award size={13} className="text-[#C6A24A]" />
                    <span className="h-px w-4 bg-[#C6A24A]" />
                  </div>

                  {/* Multi-layered 3D Number */}
                  <div className="relative inline-flex items-baseline justify-center">
                    {/* Shadow layer */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        -bottom-2
                        -right-2
                        select-none
                        font-serif
                        text-[82px]
                        font-bold
                        leading-none
                        tracking-[-0.08em]
                        text-[#C6A24A]/10
                        blur-[1px]
                        sm:text-[98px]
                        lg:text-[112px]
                      "
                    >
                      {count}
                    </span>

                    {/* Foreground number */}
                    <span
                      className="
                        relative
                        z-10
                        font-serif
                        text-[82px]
                        font-bold
                        leading-none
                        tracking-[-0.08em]
                        text-[#F7F5EF]
                        drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]
                        sm:text-[98px]
                        lg:text-[112px]
                      "
                    >
                      {count}
                    </span>

                    {/* Gold + sign */}
                    <span
                      className="
                        relative
                        z-10
                        ml-1
                        font-serif
                        text-4xl
                        font-light
                        text-[#C6A24A]
                        drop-shadow-[0_8px_16px_rgba(198,162,74,0.45)]
                        sm:text-5xl
                        lg:text-6xl
                      "
                    >
                      +
                    </span>
                  </div>

                  {/* Authority Label */}
                  <p className="mt-2 font-serif text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] sm:text-sm">
                    {counterLabel}
                  </p>

                  <div className="my-2 h-px w-12 bg-gradient-to-r from-transparent via-[#C6A24A]/40 to-transparent" />

                  <p className="max-w-[220px] text-[11px] leading-4 text-[#C9CED9]/70">
                    {counterSublabel}
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT: EDITORIAL HEADLINE & DESCRIPTION (8 COLS)
            ================================================== */}
            <div className="flex flex-col justify-center lg:col-span-8">
              <div className="inline-flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D8BD73]">
                  {badge}
                </span>
              </div>

              <h3
                id="experience-heading"
                className="
                  mt-2
                  font-serif
                  text-2xl
                  font-normal
                  leading-[1.15]
                  tracking-[-0.025em]
                  text-white
                  sm:text-3xl
                  lg:text-[38px]
                "
              >
                {headline}
              </h3>

              <p className="mt-3.5 max-w-2xl text-xs leading-relaxed text-[#C9CED9] sm:text-[13px] sm:leading-6">
                {description}
              </p>

              {/* Authority tag line */}
              <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9CED9]/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6A24A]" />
                <span>Premier Real Estate Consultancy · DLF Gurugram</span>
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------
              DIVIDER LINE BETWEEN TIERS
          ---------------------------------------------------- */}
          <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-8" />

          {/* ---------------------------------------------------
              BOTTOM TIER: 4 PROOF BOXES IN 1 HORIZONTAL ROW
              Prevents vertical growth by using lg:grid-cols-4
          ---------------------------------------------------- */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">

            {statsList.map((item, idx) => {
              const IconComp =
                STAT_ICONS[idx % STAT_ICONS.length] || ShieldCheck;

              return (
                <article
                  key={idx}
                  ref={(el) => {
                    statRefs.current[idx] = el;
                  }}
                  tabIndex={0}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    justify-between
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#C6A24A]/20
                    bg-[#202B4A]/80
                    p-4.5
                    backdrop-blur-md
                    shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)]
                    transition-all
                    duration-400
                    hover:-translate-y-1.5
                    hover:border-[#C6A24A]/55
                    hover:bg-[#202B4A]/95
                    hover:shadow-[0_20px_50px_-15px_rgba(198,162,74,0.2)]
                    focus:outline-none
                    focus:ring-1
                    focus:ring-[#C6A24A]
                    sm:p-5
                  "
                >
                  {/* Subtle Corner Bracket */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      right-0
                      top-0
                      h-3.5
                      w-3.5
                      border-r
                      border-t
                      border-[#C6A24A]/30
                      transition-all
                      duration-300
                      group-hover:h-5
                      group-hover:w-5
                      group-hover:border-[#C6A24A]
                    "
                  />

                  <div>
                    {/* Header Row: Icon + Index + Arrow */}
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[#C6A24A]/30
                          bg-[#C6A24A]/10
                          text-[#D8BD73]
                          transition-all
                          duration-400
                          group-hover:scale-105
                          group-hover:border-[#C6A24A]
                          group-hover:bg-[#C6A24A]
                          group-hover:text-[#0E162B]
                        "
                      >
                        <IconComp size={16} strokeWidth={1.6} />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-semibold tracking-wider text-[#C6A24A]/50">
                          0{idx + 1}
                        </span>
                        <ArrowUpRight
                          size={13}
                          className="
                            text-[#C6A24A]/40
                            transition-transform
                            duration-300
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            group-hover:text-[#C6A24A]
                          "
                        />
                      </div>
                    </div>

                    {/* Card Title */}
                    <h4 className="mt-3 font-serif text-[15px] font-normal tracking-[-0.01em] text-white transition-colors group-hover:text-[#F7F5EF] sm:text-base">
                      {item.title}
                    </h4>

                    {/* Card Description */}
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#C9CED9]/75 sm:text-xs">
                      {item.desc}
                    </p>
                  </div>

                  {/* Subtle Bottom Gold Trace */}
                  <div
                    aria-hidden="true"
                    className="
                      mt-3.5
                      h-[1px]
                      w-full
                      bg-white/5
                      transition-colors
                      duration-400
                      group-hover:bg-[#C6A24A]/40
                    "
                  />
                </article>
              );
            })}

          </div>

          {/* ---------------------------------------------------
              BOTTOM ARCHITECTURAL GROUNDING RIBBON
          ---------------------------------------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 sm:mt-9 sm:pt-6">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[#C9CED9]/50">
              <span>DLF PHASE 1–5 SPECIALISTS</span>
              <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
              <span>RERA COMPLIANT ADVISORY</span>
              <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
              <span>CONFIDENTIAL TRANSACTIONS</span>
            </div>

            <div className="flex items-center gap-2 text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[#D8BD73]">
              <Award size={12} className="text-[#C6A24A]" />
              <span>SAUDAGAR PROPERTIES PVT LTD</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}