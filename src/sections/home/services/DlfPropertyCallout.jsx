"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap/animations";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  PhoneCall,
  ArrowUpRight,
  Check,
} from "lucide-react";

import { useCms } from "../../../context/CmsContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================
   RELIABLE HIGH-PERFORMANCE NUMERIC COUNTER
   (INTERSECTION OBSERVER + RAF, NEVER STUCK AT 0+)
========================================================= */

function GsapCounter({ end, suffix = "+" }) {
  const numRef = useRef(null);

  const targetEnd =
    typeof end === "number"
      ? end
      : parseInt(String(end).replace(/\D/g, ""), 10) || 0;

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      el.textContent =
        targetEnd >= 1000
          ? targetEnd.toLocaleString("en-IN")
          : String(targetEnd);
      return;
    }

    let hasRun = false;

    const runAnimation = () => {
      if (hasRun || !el) return;
      hasRun = true;

      const duration = 2000;
      const startTime = performance.now();
      const isEndLarge = targetEnd >= 1000;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(targetEnd * ease);

        if (el) {
          el.textContent = isEndLarge
            ? currentVal.toLocaleString("en-IN")
            : String(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else if (el) {
          el.textContent = isEndLarge
            ? targetEnd.toLocaleString("en-IN")
            : String(targetEnd);
        }
      };

      requestAnimationFrame(step);
    };

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
      );

      observer.observe(el);

      // Fallback timer: guarantees execution after 800ms if observer is delayed
      const fallbackTimer = setTimeout(() => {
        runAnimation();
      }, 800);

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    } else {
      runAnimation();
    }
  }, [targetEnd]);

  return (
    <span className="tabular-nums">
      <span ref={numRef}>
        {targetEnd >= 1000
          ? targetEnd.toLocaleString("en-IN")
          : targetEnd}
      </span>
      <span className="ml-0.5 font-light text-[#D09A16]">{suffix}</span>
    </span>
  );
}

/* =========================================================
   FALLBACK CMS DATA
========================================================= */

const DEFAULT_STATS_CARDS = [
  {
    number: 100,
    suffix: "+",
    label: "CR Saves In Property Investment",
    subtext: "Maximized financial yield & smart negotiation for prime acquisitions",
  },
  {
    number: 1000,
    suffix: "+",
    label: "Happy Clients & Enterprises",
    subtext: "Discerning families, HNWIs & multinational corporate clients",
  },
  {
    number: 25,
    suffix: "+",
    label: "Years of Trust & Experience",
    subtext: "Unbroken market leadership across DLF Gurugram corridors",
  },
];

/* =========================================================
   CINEMATIC ARCHITECTURAL BACKDROP (MATCHING CURATED CORRIDORS)
========================================================= */

function DarkBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Architectural Glow matching CuratedCorridors */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#D09A16_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Subtle gold radial ambient illumination */}
      <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#D09A16]/[0.05] blur-[140px]" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#182345]/40 blur-[130px]" />

      {/* Architectural vertical hairline columns */}
      <div className="absolute left-[14%] top-0 h-full w-px bg-white/[0.02]" />
      <div className="absolute left-[36%] top-0 h-full w-px bg-white/[0.015]" />
      <div className="absolute right-[28%] top-0 h-full w-px bg-white/[0.02]" />
      <div className="absolute right-[8%] top-0 h-full w-px bg-white/[0.015]" />

      {/* Circular geometry */}
      <div className="absolute -right-28 top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full border border-[#D09A16]/[0.04]" />
      <div className="absolute -right-10 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/[0.02]" />
      <div className="absolute right-[14%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#D09A16] shadow-[0_0_24px_6px_rgba(208, 154, 22,0.25)]" />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT: DLF GURUGRAM EDITORIAL SECTION
========================================================= */

export default function DlfPropertyCallout() {
  const { sections } = useCms();

  const callout =
    sections?.dlfCallout ||
    sections?.services?.dlfCallout ||
    {};

  const statsCards =
    callout.statsCards || DEFAULT_STATS_CARDS;

  const badge =
    callout.badge ||
    "DLF GURGAON · PRIVATE PROPERTY DESK";

  const headline =
    callout.headline ||
    "Are you looking for a property in DLF Gurgaon? Simply connect with us!";

  const description =
    callout.description ||
    "Our expert advisory team delivers discrete, end-to-end access to premier residential estates, prime commercial headquarters, and high-yielding industrial assets across DLF Gurugram.";

  const phone =
    callout.phone ||
    "+91 98112 21207";

  const phoneRaw =
    callout.phoneRaw ||
    phone.replace(/\s+/g, "");

  const propertyImage =
    callout.image ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85";

  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const statItemRefs = useRef([]);
  const ctaRef = useRef(null);

  /* =====================================================
     GSAP CINEMATIC SCROLLTRIGGER ANIMATIONS
  ===================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      /* A-C. Editorial Hero Typography Sequence */
      gsap.fromTo(
        ".dlf-editorial-hero > *",
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dlf-editorial-hero",
            start: "top 85%",
            once: true,
          },
        }
      );

      /* D-E. Architectural Image Reveal & Parallax */
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            scale: 1.08,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageContainerRef.current || imageRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );

        gsap.to(imageRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: imageContainerRef.current || imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      /* H. Architectural Gold Line Expansion */
      gsap.fromTo(
        ".dlf-gold-line",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".dlf-metrics-strip",
            start: "top 88%",
            once: true,
          },
        }
      );

      /* F-G. Independent Metric Items Upward Reveal */
      const statElements = statItemRefs.current.filter(Boolean);
      if (statElements.length > 0) {
        gsap.fromTo(
          statElements,
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
              trigger: ".dlf-metrics-strip",
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      /* I. Editorial CTA Reveal */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [statsCards]);

  return (
    <section
      ref={containerRef}
      id="dlf-desk"
      aria-label="DLF Gurugram Private Property Desk"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#0E162B]
        text-[#F7F5EF]
        py-16
        sm:py-20
        md:py-24
        border-t
        border-b
        border-white/[0.08]
      "
    >
      <DarkBackdrop />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 md:px-12 max-w-7xl">

        {/* =====================================================
            TOP EDITORIAL HERO & ARCHITECTURAL VISUAL (ASYMMETRIC)
        ====================================================== */}

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">

          {/* LEFT: HERO / EDITORIAL CONTENT */}
          <div className="dlf-editorial-hero flex flex-col justify-center lg:col-span-7">

            {/* Small Gold Eyebrow */}
            <div className="inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#D09A16] sm:text-[10px]">
                {badge}
              </span>
            </div>

            {/* Editorial Location Annotation */}
            <div className="mt-5 inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full border border-[#D09A16] bg-[#D09A16]/20" />
              <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D09A16]">
                DLF GURUGRAM
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#C9CED9]">
                LOCAL PROPERTY EXPERTISE
              </span>
            </div>

            {/* Large Elegant Serif Heading */}
            <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#F7F5EF] sm:text-5xl lg:text-6xl xl:text-7xl">
              DLF Gurugram,
              <br />
              <span className="font-light italic text-[#D09A16]">
                considered differently.
              </span>
            </h2>

            {/* Muted Gray Editorial Description */}
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-[#C9CED9] sm:text-base">
              {description}
            </p>
          </div>

          {/* RIGHT: PREMIUM ARCHITECTURAL VISUAL ELEMENT */}
          <div className="relative lg:col-span-5">
            <div
              ref={imageContainerRef}
              className="
                group/arch
                relative
                h-[320px] w-full
                overflow-hidden
                rounded-2xl
                border border-[#D09A16]/25
                shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                sm:h-[400px]
                lg:h-[450px]
              "
            >
              {/* Parallax Image */}
              <div
                ref={imageRef}
                className="
                  relative -top-[7.5%] h-[115%] w-full
                  transition-transform duration-1000 ease-out
                  group-hover/arch:scale-[1.03]
                "
              >
                <Image
                  src={propertyImage}
                  alt="DLF Gurugram Luxury Architectural Residence"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                  priority={false}
                />
              </div>

              {/* Cinematic Dark Overlays matching #0E162B */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-t from-[#0E162B] via-[#0E162B]/40 to-transparent
                "
              />
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-r from-[#0E162B]/75 via-transparent to-[#0E162B]/30
                "
              />

              {/* Gold Gradient Edge Accents */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  border-l border-t border-[#D09A16]/30
                "
              />
              <div
                className="
                  pointer-events-none absolute right-0 top-0 h-28 w-28
                  bg-gradient-to-bl from-[#D09A16]/15 to-transparent
                "
              />

              {/* Subtle Architectural Coordinate Label */}
              <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.24em] text-[#F7F5EF]/75">
                <span className="text-[#D09A16]">DLF PHASE V · PRIVATE DESK</span>
                <span className="text-white/40">28°27&apos;N 77°05&apos;E</span>
              </div>
            </div>
          </div>

        </div>

        {/* =====================================================
            ONE HORIZONTAL EDITORIAL METRICS STRIP (ZERO CARDS)
        ====================================================== */}

        <div className="dlf-metrics-strip relative my-12 lg:my-16">

          {/* Top Thin Gold Architectural Line */}
          <div className="h-px w-full overflow-hidden bg-white/[0.08]">
            <div className="dlf-gold-line h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#D09A16] via-[#D09A16]/40 to-transparent" />
          </div>

          {/* Metrics Layout: Direct on Dark Canvas, Divided Only by Thin Dividers */}
          <div className="grid grid-cols-1 divide-y divide-white/[0.08] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                ref={(el) => {
                  statItemRefs.current[index] = el;
                }}
                className="
                  group relative
                  px-0 py-8
                  transition-colors duration-300
                  sm:py-9
                  lg:px-8 lg:py-10
                  xl:px-10
                "
              >
                {/* Large Elegant Serif Number */}
                <div className="font-serif text-5xl font-normal leading-none tracking-tight text-[#F7F5EF] transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:text-6xl lg:text-7xl">
                  <GsapCounter end={stat.number} suffix={stat.suffix || "+"} />
                </div>

                {/* Gold Accent Line that Expands on Hover */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#D09A16]/60 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-[#D09A16]" />
                  <span className="h-1 w-1 rounded-full bg-[#D09A16]/50 transition-colors duration-300 group-hover:bg-[#D09A16]" />
                </div>

                {/* Tiny Uppercase Typography with Generous Letter Spacing */}
                <h3 className="mt-3.5 text-[9px] font-bold uppercase leading-snug tracking-[0.24em] text-[#F7F5EF]/75 transition-colors duration-300 group-hover:text-[#F7F5EF] sm:text-[10px]">
                  {stat.label}
                </h3>

                {/* Subtle & Muted Description */}
                <p className="mt-2 max-w-[270px] text-xs font-light leading-relaxed text-[#C9CED9]">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Thin Architectural Hairline */}
          <div className="h-px w-full bg-white/[0.08]" />
        </div>

        {/* =====================================================
            HIGH-IMPACT EDITORIAL CTA PANEL (STAND-OUT LUXURY DESIGN)
        ====================================================== */}

        <div
          ref={ctaRef}
          className="
            group/cta-panel
            relative
            mt-16 sm:mt-20
            overflow-hidden
            rounded-2xl sm:rounded-3xl
            border border-[#D09A16]/30
            bg-gradient-to-br from-[#131D38]/90 via-[#0F182F]/95 to-[#15203D]/90
            p-7 sm:p-10 lg:p-12
            shadow-[0_25px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
            backdrop-blur-xl
          "
        >
          {/* Ambient Gold Radial Glow Behind CTA Controls */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D09A16]/15 blur-[80px] transition-all duration-700 group-hover/cta-panel:bg-[#D09A16]/25" />

          {/* Top Illuminated Gold Accent Line */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D09A16] to-transparent opacity-80" />

          {/* Subtle Architectural Coordinate Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(#D09A16_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Editorial Info */}
            <div className="max-w-2xl">
              {/* Eyebrow badge with live pulse indicator */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D09A16]/30 bg-[#D09A16]/10 px-3.5 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D09A16] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D09A16]" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#D09A16]">
                  PRIVATE PROPERTY DESK · ACTIVE INQUIRIES
                </span>
              </div>

              {/* Bold Editorial Headline */}
              <h3 className="mt-4 font-serif text-2xl font-normal leading-snug text-[#F7F5EF] sm:text-3xl lg:text-4xl">
                {headline}
              </h3>

              {/* Muted description */}
              <p className="mt-3 text-xs sm:text-sm font-light leading-relaxed text-[#C9CED9] max-w-xl">
                Direct access to off-market inventory, verified titles, and bespoke consultation across DLF Phase 1–5, Golf Course Road & Cybercity.
              </p>

              {/* Property types list */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {["Residential Villas", "Luxury Floors", "Commercial HQs", "Industrial Assets"].map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#C9CED9]/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 sm:gap-4 shrink-0">

              {/* Direct Phone Link */}
              <a
                href={`tel:${phoneRaw}`}
                className="
                  group/phone
                  inline-flex items-center justify-center gap-3.5
                  rounded-full
                  border border-[#D09A16]/40
                  bg-[#182345]/70
                  px-7 py-4
                  text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]
                  text-[#F7F5EF]
                  shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                  backdrop-blur-md
                  transition-all duration-300
                  hover:border-[#D09A16] hover:bg-[#D09A16]/15
                  hover:-translate-y-0.5
                "
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D09A16]/15 text-[#D09A16] transition-colors duration-300 group-hover/phone:bg-[#D09A16] group-hover/phone:text-[#0A1020]">
                  <PhoneCall
                    size={12}
                    className="transition-transform duration-300 group-hover/phone:rotate-12"
                  />
                </span>
                <span>{phone}</span>
              </a>

              {/* Gold Editorial CTA Button */}
              <Link
                href={callout.cta || "/contact"}
                className="
                  group/btn
                  relative
                  inline-flex items-center justify-center gap-3
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r from-[#D09A16] via-[#DFC06C] to-[#D09A16]
                  bg-[length:200%_auto]
                  px-8 py-4
                  text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]
                  text-[#0A1020]
                  shadow-[0_12px_35px_rgba(208, 154, 22,0.35)]
                  transition-all duration-500
                  hover:bg-[position:right_center]
                  hover:shadow-[0_18px_50px_rgba(208, 154, 22,0.55)]
                  hover:-translate-y-0.5
                "
              >
                <span className="relative z-10">{callout.ctaText || "Explore Deals"}</span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
              </Link>

              {/* Trust statement */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-[8px] uppercase tracking-[0.2em] text-[#D09A16]/90 font-medium">
                <Check size={11} className="text-[#D09A16]" />
                <span>Confidential Advisory · Verified Titles</span>
              </div>

            </div>

          </div>

          {/* Minimal Brand Stamp Hairline */}
          <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[7px] uppercase tracking-[0.24em] text-white/30">
            <div className="flex items-center gap-2">
              <Check size={9} className="text-[#D09A16]" />
              <span>SAUDAGAR PROPERTIES PVT LTD</span>
            </div>
            <span className="text-[#D09A16]/60">GURUGRAM PRIME DIVISION</span>
          </div>

        </div>

      </div>
    </section>
  );
}