"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap/animations";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Compass,
  Users,
  Key,
  Sparkles,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useCms } from "../../../context/CmsContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================
   DEFAULT ARCHITECTURAL PROPERTY IMAGES
========================================================= */

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
];

/* =========================================================
   DEFAULT CMS DATA
========================================================= */

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    phaseTag: "Discovery & Alignment",
    title: "Understanding your Purpose",
    badge: "Client Purpose & Portfolio Needs",
    icon: Compass,
    image: DEFAULT_IMAGES[0],
    imageText:
      "At Saudagar Properties, your trusted real estate consultant in DLF Gurugram, we help you buy, rent, sell, or lease residential, commercial, and industrial properties. Whether you're looking for a flat, villa, kothi, or office space, we understand your requirements before presenting the right opportunities.",
    chatText:
      "We begin by understanding your objectives, preferred location, budget, property type, and long-term requirements before recommending suitable opportunities.",
  },
  {
    step: "02",
    phaseTag: "Strategic Advisory",
    title: "Planning with our experts",
    badge: "Direct Consultation & Zero Middlemen",
    icon: Users,
    image: DEFAULT_IMAGES[1],
    imageText:
      "Our dedicated team provides personalized guidance, answers your queries, and helps you evaluate suitable residential or commercial properties. We simplify the process while keeping your priorities and budget at the centre of every recommendation.",
    chatText:
      "Our professionals help you compare relevant opportunities, understand the details, complete formalities, and make a confident property decision.",
  },
  {
    step: "03",
    phaseTag: "Execution & Handover",
    title: "Implementation as per plan",
    badge: "Smooth Coordination & Turnkey Delivery",
    icon: Key,
    image: DEFAULT_IMAGES[2],
    imageText:
      "Once your requirements are clear, our experts actively search for the best property options tailored to you. We coordinate the process transparently and keep you informed as the transaction progresses towards completion.",
    chatText:
      "From shortlisting and coordination to documentation and final handover, we remain involved to make the property journey smooth and well coordinated.",
  },
];

/* =========================================================
   LIGHT ARCHITECTURAL BACKDROP (MATCHING EXPERIENCE COUNTER)
========================================================= */

function LightBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blueprint Coordinate Grid Overlay (Light Theme) */}
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#17213D_1px,transparent_1px),linear-gradient(to_bottom,#17213D_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Ambient Warm Gold Radial Glows */}
      <div className="absolute -right-36 -top-36 h-[540px] w-[540px] rounded-full bg-[#C6A24A]/[0.06] blur-[140px]" />
      <div className="absolute -bottom-36 -left-36 h-[500px] w-[500px] rounded-full bg-[#17213D]/[0.035] blur-[130px]" />

      {/* Architectural Vertical Hairline Columns */}
      <div className="absolute left-[14%] top-0 h-full w-px bg-[#17213D]/[0.03]" />
      <div className="absolute left-[36%] top-0 h-full w-px bg-[#17213D]/[0.02]" />
      <div className="absolute right-[28%] top-0 h-full w-px bg-[#17213D]/[0.03]" />
      <div className="absolute right-[8%] top-0 h-full w-px bg-[#17213D]/[0.02]" />

      {/* Top Gold Horizon Beam */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A24A]/40 to-transparent" />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT: HOW WE WORK (FULL SCREEN, LIGHT SHADE)
========================================================= */

export default function HowWeWorkProcess() {
  const { sections } = useCms();

  const howData =
    sections?.services?.howWeWork || {};

  const badge =
    howData.badge ||
    "Private Property Advisory";

  const titleMain =
    howData.titleMain ||
    "How Do We";

  const titleItalic =
    howData.titleItalic ||
    "Work?";

  const description =
    howData.description ||
    "Experience our seamless, three-stage property advisory tailored for discerning buyers, investors, and corporate leaders across DLF Gurugram.";

  const steps = useMemo(() => {
    const rawSteps = howData.steps;

    if (
      !rawSteps ||
      !Array.isArray(rawSteps) ||
      rawSteps.length === 0
    ) {
      return DEFAULT_PROCESS_STEPS;
    }

    return DEFAULT_PROCESS_STEPS.map(
      (defaultStep, index) => ({
        ...defaultStep,
        ...(rawSteps[index] || {}),
        image:
          rawSteps[index]?.image ||
          defaultStep.image ||
          DEFAULT_IMAGES[index],
      })
    );
  }, [howData.steps]);

  const sectionRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  /* =====================================================
     GSAP SCROLLTRIGGER ENTRANCE ANIMATION
  ===================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      if (reduceMotion) return;

      /* Header Reveal */
      gsap.fromTo(
        ".process-editorial-header > *",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-editorial-header",
            start: "top 85%",
            once: true,
          },
        }
      );

      /* Gold Horizon Line Reveal */
      gsap.fromTo(
        ".process-gold-line",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".process-strip-container",
            start: "top 88%",
            once: true,
          },
        }
      );

      /* Steps Items Upward Stagger */
      gsap.fromTo(
        ".process-step-col",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-strip-container",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [steps]);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#F7F5EF]
        text-[#17213D]
        py-16
        sm:py-20
        md:py-24
        border-t
        border-b
        border-[#17213D]/[0.08]
      "
    >
      <LightBackdrop />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">

        {/* =====================================================
            EDITORIAL INTRO HEADER
        ====================================================== */}

        <header className="process-editorial-header mx-auto mb-14 max-w-3xl text-center lg:mb-16">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C6A24A]/30 bg-[#C6A24A]/10 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles size={11} className="text-[#A87505]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#A87505]">
              {badge}
            </span>
          </div>

          {/* Location Annotation */}
          <div className="mt-4 flex items-center justify-center gap-2.5 text-[8px] font-bold uppercase tracking-[0.24em] text-[#17213D]/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A24A]" />
            <span>THE THREE-STAGE PROTOCOL</span>
            <span>·</span>
            <span className="text-[#A87505]">DLF GURUGRAM DESK</span>
          </div>

          {/* Large Serif Title */}
          <h2
            id="how-we-work-heading"
            className="mt-4 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#17213D] sm:text-5xl lg:text-6xl"
          >
            {titleMain}{" "}
            <span className="font-light italic text-[#A87505]">
              {titleItalic}
            </span>
          </h2>

          {/* Editorial Description */}
          <p className="mt-5 text-sm font-light leading-relaxed text-[#17213D]/65 sm:text-base">
            {description}
          </p>

          {/* Brand Philosophy Anchor */}
          <div className="mt-6 flex items-center justify-center gap-3 text-[7px] font-semibold uppercase tracking-[0.28em] text-[#17213D]/30">
            <span>CURATED</span>
            <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
            <span>CONSIDERED</span>
            <span className="h-1 w-1 rounded-full bg-[#C6A24A]" />
            <span>TRANSPARENT</span>
          </div>

        </header>

        {/* =====================================================
            THREE-STAGE PROCESS STRIP (ZERO WHITE SHADOW BOXES)
        ====================================================== */}

        <div className="process-strip-container relative">

          {/* Top Architectural Gold Hairline */}
          <div className="h-px w-full overflow-hidden bg-[#17213D]/10">
            <div className="process-gold-line h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#C6A24A] via-[#C6A24A]/40 to-transparent" />
          </div>

          {/* Process Strip Columns: Direct on Light Luxury Canvas */}
          <div className="grid grid-cols-1 divide-y divide-[#17213D]/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon || Compass;

              return (
                <div
                  key={step.step}
                  className="
                    process-step-col
                    group relative
                    px-0 py-8
                    transition-colors duration-500
                    hover:bg-[#17213D]/[0.015]
                    sm:py-10
                    lg:px-8 lg:py-12
                    xl:px-10
                  "
                >
                  {/* Step Header: Numeral & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-3xl font-light leading-none text-[#C6A24A] sm:text-4xl">
                        {step.step}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#17213D]/50">
                        {step.phaseTag}
                      </span>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C6A24A]/30 bg-[#C6A24A]/[0.08] text-[#A87505] transition-colors duration-300 group-hover:border-[#C6A24A] group-hover:bg-[#C6A24A] group-hover:text-white">
                      <Icon size={16} strokeWidth={1.7} />
                    </div>
                  </div>

                  {/* Architectural Photo Window */}
                  <div className="relative my-6 h-48 w-full overflow-hidden rounded-xl border border-[#17213D]/10 transition-colors duration-500 group-hover:border-[#C6A24A]/40 sm:h-52">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Architectural Vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17213D]/80 via-transparent to-transparent" />

                    {/* Metadata Watermark inside image */}
                    <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.22em] text-white/90">
                      <span className="text-[#E0C070]">{step.badge}</span>
                      <span className="text-white/60">DLF GURUGRAM</span>
                    </div>
                  </div>

                  {/* Stage Headline */}
                  <h3 className="font-serif text-xl font-normal leading-tight text-[#17213D] transition-colors duration-300 group-hover:text-[#A87505] sm:text-2xl">
                    {step.title}
                  </h3>

                  {/* Stage Description */}
                  <p className="mt-3 text-xs font-light leading-relaxed text-[#17213D]/70 sm:text-[13px]">
                    {step.imageText}
                  </p>

                  {/* Expandable Protocol Brief Drawer */}
                  <div className="mt-6 border-t border-[#17213D]/10 pt-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(index)}
                      aria-expanded={expandedIndex === index}
                      className="flex w-full cursor-pointer items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-[#17213D] transition-colors duration-300 hover:text-[#A87505]"
                    >
                      <span>
                        {expandedIndex === index
                          ? "Close Protocol Brief"
                          : "Explore Stage Protocol"}
                      </span>

                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C6A24A]/30 text-[#A87505] transition-all duration-300 group-hover:border-[#C6A24A]">
                        <ArrowUpRight
                          size={12}
                          className={`transition-transform duration-300 ${
                            expandedIndex === index ? "rotate-90" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {expandedIndex === index && (
                      <div className="mt-3.5 rounded-xl border border-[#17213D]/10 bg-[#EFEBE1]/70 p-4 transition-all duration-300">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="h-px w-5 bg-[#C6A24A]" />
                          <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#A87505]">
                            ADVISORY DIRECTIVE
                          </span>
                        </div>
                        <p className="text-[11px] font-normal leading-relaxed text-[#17213D]/75">
                          {step.chatText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Architectural Blueprint Footer */}
                  <div className="mt-6 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.22em] text-[#17213D]/35">
                    <span>SAUDAGAR PROPERTIES</span>
                    <span className="text-[#A87505]">
                      STAGE {step.step} / 03
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Architectural Hairline */}
          <div className="h-px w-full bg-[#17213D]/10" />

        </div>

        {/* Minimal Micro Trust Statement */}
        <div className="mt-10 flex items-center justify-center gap-3 text-center text-[8px] uppercase tracking-[0.24em] text-[#17213D]/40">
          <Check size={11} className="text-[#A87505]" />
          <span>Client Confidentiality Guaranteed Throughout All 3 Stages</span>
        </div>

      </div>
    </section>
  );
}