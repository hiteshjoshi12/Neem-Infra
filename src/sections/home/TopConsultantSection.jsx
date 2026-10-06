"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building, Building2, Factory, ArrowUpRight, ShieldCheck, Award, PhoneCall, Sparkles, MapPin } from 'lucide-react';


import { useCms } from '../../context/CmsContext';
import Tilt3DCard from '../../components/ui/Tilt3DCard';
import Image from 'next/image';


const CATEGORY_ICONS = {
  building: Building,
  building2: Building2,
  factory: Factory
};

export default function TopConsultantSection() {
  const { sections } = useCms();
  const data = sections?.topConsultant || {};

  const badge = data.badge || "Bespoke Real Estate Advisory";
  const headlineMain = data.headlineMain || "Top Real Estate Consultant";
  const headlineItalic = data.headlineItalic || "In DLF Gurugram";
  const summaryQuote = data.summaryQuote || "Authorized advisor and trusted partner for DLF Phase 1–4, Sushant Lok, and Cybercity’s most exclusive residential & commercial estates.";
  const cardBadge = data.cardBadge || "DLF Authorized & Verified";
  const paragraph1 = data.paragraph1 || "At Saudagar Properties, we are proud to be recognized as the premier real estate consultant in DLF Gurugram. We provide personalized, end-to-end solutions across residential, commercial, and industrial sectors with maximum ROI.";
  const paragraph2 = data.paragraph2 || "Whether you are seeking an ultra-luxury builder floor in DLF Phase 1–4, a high-street commercial office in Udyog Vihar, or an investment-ready plot, our veteran team guides you through transparent transactions and seamless legal title verification.";

  const categories = data.categories || [
    { title: "Residential", subtitle: "Floors & Villas", icon: "Building" },
    { title: "Commercial", subtitle: "Offices & Retail", icon: "Building2" },
    { title: "Industrial", subtitle: "Plots & Assets", icon: "Factory" }
  ];

  const videoTour = data.videoTour || {
    badge: "Sushant Lok & DLF Tour",
    title: "Exclusive DLF & Sushant Lok Walkthrough",
    subtitle: "Experience Gurgaon's finest properties with curated virtual walkthroughs.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
  };

  const ctaBanner = data.ctaBanner || {
    title: "Ready to Invest or Buy in DLF Gurugram?",
    description: "Get priority access to off-market inventory, bespoke site visits, and personalized ROI projections from our executive directors.",
    phone: "+91 98112 21207",
    buttonText: "Connect Now",
    buttonHref: "/contact"
  };

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const ctaBannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Scroll Reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
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

      // 2. Feature Cards 3D Slide In
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -50, rotateY: 10 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      gsap.fromTo(
        rightCardRef.current,
        { opacity: 0, x: 50, rotateY: -10 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rightCardRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 3. Bottom CTA Banner Lift
      gsap.fromTo(
        ctaBannerRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaBannerRef.current,
            start: "top 90%",
            once: true
          },
          clearProps: "transform"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-12 md:py-20 bg-[#F7F5EF] text-[#17213D] overflow-hidden border-t border-[#17213D]/[0.06]">
      {/* Background Architectural Accent lines */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#17213D_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-[#C6A24A]" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#C6A24A] uppercase">
                {badge}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#17213D] leading-[1.15]">
              {headlineMain} <br />
              <span className="italic font-light text-[#C6A24A]">{headlineItalic}</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#566078] font-normal max-w-md leading-relaxed border-l-2 border-[#C6A24A] pl-4">
            {summaryQuote}
          </p>
        </div>

        {/* Main 3D Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">

          {/* Left Column: Signature 3D Gold Framed Content Card */}
          <div
            ref={leftCardRef}
            className="lg:col-span-7 relative group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Decorative Double-Gold Frame Corner */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#C6A24A] rounded-tl-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#C6A24A] rounded-br-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />

            <div className="h-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-10px_rgba(23,33,61,0.07)] border border-[#17213D]/[0.08] flex flex-col justify-between relative z-10 transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(23,33,61,0.12)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F5EF] border border-[#17213D]/10 text-[11px] font-semibold tracking-widest text-[#17213D] uppercase mb-6">
                  <ShieldCheck size={14} className="text-[#C6A24A]" />
                  <span>{cardBadge}</span>
                </div>

                <p className="text-base md:text-lg text-[#17213D] font-normal leading-relaxed mb-8">
                  {paragraph1}
                </p>

                <p className="text-sm md:text-base text-[#566078] font-normal leading-relaxed mb-10">
                  {paragraph2}
                </p>
              </div>

              {/* 3 Categories Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#17213D]/[0.08]">
                {categories.map((cat, idx) => {
                  const iconKey = (cat.icon || 'building').toLowerCase();
                  const IconComp = CATEGORY_ICONS[iconKey] || Building;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#17213D]/[0.08] hover:border-[#C6A24A] transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-[#17213D] text-[#C6A24A] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#17213D] uppercase tracking-wider">{cat.title}</h3>
                        <p className="text-[11px] text-[#566078] font-medium">{cat.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Signature Architectural Photo Showcase with GSAP 3D Tilt */}
          <div
            ref={rightCardRef}
            className="lg:col-span-5 relative flex flex-col"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Tilt3DCard maxTilt={8} className="h-full">
              <div
                className="relative flex-1 min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(23,33,61,0.25)] border border-[#17213D]/10 bg-[#17213D] group flex flex-col justify-between"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Luxury Architectural Image */}
                <Image
                  src={videoTour.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"}
                  alt={videoTour.title || "Luxury Sushant Lok Estate"}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.80]"
                />

                {/* Layered Luxury Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E162B] via-[#0E162B]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0E162B]/60 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div
                  className="relative p-6 flex items-center justify-between z-20"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E162B]/85 backdrop-blur-md border border-[#C6A24A]/40 text-[#C6A24A] text-[10px] font-bold font-mono tracking-widest uppercase shadow-md">
                    <Sparkles size={11} className="text-[#C6A24A]" />
                    <span>{videoTour.badge || "Signature Collection"}</span>
                  </div>
                </div>

                {/* Bottom Details Banner */}
                <div
                  className="relative p-6 sm:p-8 z-20 text-white"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#C6A24A] mb-1">
                    <MapPin size={11} className="text-[#C6A24A]" />
                    <span>DLF Phase 1–4 & Sushant Lok</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5 leading-snug drop-shadow-md">
                    {videoTour.title || "Exclusive DLF & Sushant Lok Walkthrough"}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#C9CED9] font-light leading-relaxed">
                    {videoTour.subtitle || "Experience Gurgaon's finest properties with curated virtual walkthroughs."}
                  </p>
                </div>
              </div>
            </Tilt3DCard>
          </div>

        </div>

        {/* Bottom Trust & Action Banner */}
        <div
          ref={ctaBannerRef}
          className="rounded-3xl bg-[#17213D] text-white p-8 md:p-12 shadow-[0_20px_50px_rgba(23,33,61,0.25)] border border-[#C6A24A]/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Ambient Sheen */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(198,162,74,0.15) 0%, transparent 70%)' }}
          />

          <div className="flex items-center gap-6 z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#C6A24A]/20 border border-[#C6A24A]/40 text-[#C6A24A] flex items-center justify-center flex-shrink-0">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                {ctaBanner.title}
              </h3>
              <p className="text-xs md:text-sm text-[#C9CED9] font-normal max-w-xl">
                {ctaBanner.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0 z-10">
            <a
              href={`tel:${(ctaBanner.phone || '+919811221207').replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-colors duration-300"
            >
              <PhoneCall size={14} className="text-[#C6A24A]" />
              <span>{ctaBanner.phone}</span>
            </a>

            <Link href={ctaBanner.buttonHref || "/contact"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C6A24A] hover:bg-[#D8BD73] text-[#0E162B] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(198,162,74,0.3)] hover:shadow-[0_6px_20px_rgba(198,162,74,0.4)]"
            >
              <span>{ctaBanner.buttonText || "Connect Now"}</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
