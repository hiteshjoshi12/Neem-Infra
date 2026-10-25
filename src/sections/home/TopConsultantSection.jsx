"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building, Building2, Factory, ArrowUpRight, ShieldCheck, Award, PhoneCall, Sparkles, MapPin } from 'lucide-react';


import { useCms } from '../../context/CmsContext';
import Tilt3DCard from '../../components/ui/Tilt3DCard';
import LuxuryTextReveal from '@/components/ui/LuxuryTextReveal';
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
  const paragraph1 = data.paragraph1 || "At Saudagar Properties, we are proud to be recognized as the premier real estate consultant in DLF Gurugram.";
  const paragraph2 = data.paragraph2 || "Whether you are seeking an ultra-luxury builder floor in DLF Phase 1–4, a high-street commercial office in Udyog Vihar, or an investment-ready plot, our veteran team guides you through transparent transactions.";
  const categories = data.categories || [
    { title: "Residential", subtitle: "Floors & Villas", icon: "building", href: "/services/residential" },
    { title: "Commercial", subtitle: "Offices & Retail", icon: "building2", href: "/services/commercial" },
    { title: "Industrial", subtitle: "Plots & Assets", icon: "factory", href: "/services/industrial" }
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
    <section ref={sectionRef} className="relative w-full py-12 md:py-20 bg-brand-ivory text-brand-navy overflow-hidden border-t border-brand-navy/[0.06]">
      {/* Background Architectural Accent lines */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(var(--color-brand-navy)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-brand-gold" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-brand-gold uppercase">
                {badge}
              </span>
            </div>
            <LuxuryTextReveal
              text={headlineMain}
              highlightText={headlineItalic}
              className="text-3xl md:text-5xl lg:text-6xl text-brand-navy leading-[1.15]"
            />
          </div>

          <p className="text-sm md:text-base text-brand-slate font-medium max-w-md leading-relaxed border-l-2 border-brand-gold pl-4">
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
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-brand-gold rounded-tl-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-brand-gold rounded-br-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />

            <div className="h-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-10px_rgba(23,33,61,0.07)] border border-brand-navy/[0.08] flex flex-col justify-between relative z-10 transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(23,33,61,0.12)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-ivory border border-brand-navy/10 text-[11px] font-semibold tracking-widest text-brand-navy uppercase mb-6">
                  <ShieldCheck size={14} className="text-brand-gold" />
                  <span>{cardBadge}</span>
                </div>

                <p className="text-base md:text-lg text-brand-navy font-medium leading-relaxed mb-8">
                  {paragraph1}
                </p>

                <p className="text-sm md:text-base text-brand-slate font-medium leading-relaxed mb-10">
                  {paragraph2}
                </p>
              </div>

              {/* 3 Categories Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-brand-navy/[0.08]">
                {categories.map((cat, idx) => {
                  const iconKey = (cat.icon || 'building').toLowerCase();
                  const IconComp = CATEGORY_ICONS[iconKey] || Building;
                  const href = cat.href || (
                    cat.title?.toLowerCase().includes('residential') ? '/services/residential' :
                    cat.title?.toLowerCase().includes('commercial') ? '/services/commercial' :
                    '/services/industrial'
                  );
                  return (
                    <Link 
                      key={idx} 
                      href={href}
                      className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-brand-ivory border border-brand-navy/[0.08] hover:border-brand-gold hover:bg-white transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-obsidian flex items-center justify-center flex-shrink-0 shadow-sm transition-colors">
                          <IconComp size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-brand-navy group-hover:text-brand-gold uppercase tracking-wider transition-colors truncate">{cat.title}</h3>
                          <p className="text-[11px] text-brand-slate font-medium truncate">{cat.subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={14} className="text-brand-muted group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </Link>
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
                className="relative flex-1 min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(23,33,61,0.25)] border border-brand-navy/10 bg-brand-navy group flex flex-col justify-between"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Luxury Architectural Image */}
                <Image
                  src={videoTour.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"}
                  alt={videoTour.imageAlt || videoTour.title || "Luxury Sushant Lok Estate"}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.80]"
                />

                {/* Layered Luxury Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep via-brand-navy-deep/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep/60 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div
                  className="relative p-6 flex items-center justify-between z-20"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-deep/85 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-[10px] font-bold font-mono tracking-widest uppercase shadow-md">
                    <Sparkles size={11} className="text-brand-gold" />
                    <span>{videoTour.badge || "Signature Collection"}</span>
                  </div>
                </div>

                {/* Bottom Details Banner */}
                <div
                  className="relative p-6 sm:p-8 z-20 text-white"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-brand-gold mb-1">
                    <MapPin size={11} className="text-brand-gold" />
                    <span>DLF Phase 1–4 & Sushant Lok</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5 leading-snug drop-shadow-md">
                    {videoTour.title || "Exclusive DLF & Sushant Lok Walkthrough"}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-text-on-dark-muted font-light leading-relaxed">
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
          className="rounded-3xl bg-brand-navy text-white p-8 md:p-12 shadow-[0_20px_50px_rgba(23,33,61,0.25)] border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Ambient Sheen */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(208, 154, 22,0.15) 0%, transparent 70%)' }}
          />

          <div className="flex items-center gap-6 z-10">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold flex items-center justify-center flex-shrink-0">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                {ctaBanner.title}
              </h3>
              <p className="text-xs md:text-sm text-brand-text-on-dark-muted font-normal max-w-xl">
                {ctaBanner.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0 z-10">
            <a
              href={`tel:${(ctaBanner.phone || '+919811221207').replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-colors duration-300"
            >
              <PhoneCall size={14} className="text-brand-gold" />
              <span>{ctaBanner.phone}</span>
            </a>

            <Link href={ctaBanner.buttonHref || "/contact"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold text-brand-navy-deep text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(208, 154, 22,0.3)] hover:shadow-[0_6px_20px_rgba(208, 154, 22,0.4)]"
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
