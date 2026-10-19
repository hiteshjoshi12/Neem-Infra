"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, Building2, MapPin, ArrowUpRight, Sparkles, Check } from 'lucide-react';


import Tilt3DCard from '../../components/ui/Tilt3DCard';
import Image from 'next/image';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';

export default function AboutOfferings() {
  const { sections } = useCms();
  const cms = sections?.page_about?.offerings || DEFAULT_SECTIONS.page_about.offerings;
  const defaultOfferings = [
    {
      id: 'kothis-flats',
      icon: Home,
      tag: 'Residential Distinction',
      title: 'Kothis / Flats',
      description: 'Want to stay in a lavish independent house or a premium apartment where you can get all the facilities and comforts? Let us find this for you in your desirable location.',
      features: [
        'Luxury Independent Builder Floors',
        'Grand Kothis & Mansions in DLF Phase 1–5',
        'Sky Penthouses on Golf Course Road',
        'Vastu-compliant architectural layouts'
      ],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Explore Residential',
      ctaLink: '/services/residential'
    },
    {
      id: 'office-spaces',
      icon: Building2,
      tag: 'Commercial Elite',
      title: 'Office Spaces',
      description: 'Switch to modern office spaces with us which are spacious and extremely classy. We’ll help you to find the right space for you depending on the requirements and budget.',
      features: [
        'Grade-A Corporate Floor Plates',
        'Cyber City & Cyber Hub Proximity',
        'Flexible Leasing & Purchase Terms',
        'Strategic High-Footfall Commercial Hubs'
      ],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Inquire Office Spaces',
      ctaLink: '/services/commercial'
    },
    {
      id: 'plots-land',
      icon: MapPin,
      tag: 'Capital Growth & ROI',
      title: 'Plots & Strategic Land',
      description: 'Looking for an optimum investment opportunity? Well, what could be better than investing your money on land and earn higher ROIs for all the coming years ahead with the property values increasing every year.',
      features: [
        'Freehold Residential Plots in DLF',
        'Commercial SCO (Shop-cum-Office) Plots',
        'Exponential Annual Capital Appreciation',
        'Thorough Due Diligence & Clean Titles'
      ],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Discover Land Deals',
      ctaLink: '/services/industrial'
    }
  ];

  const offerings = (cms?.items && cms.items.length > 0)
    ? cms.items.map((item, idx) => ({
        ...defaultOfferings[idx],
        ...item,
        icon: defaultOfferings[idx]?.icon || Home
      }))
    : defaultOfferings;

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

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

      // 2. Cards Staggered 3D Entrance
      if (cardRefs.current.length > 0) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 55, rotateX: 14, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRefs.current[0],
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-brand-ivory text-brand-navy overflow-hidden border-t border-brand-cream-border">
      {/* Background accents */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.08) 0%, rgba(208, 154, 22, 0) 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-gold/40 text-brand-gold text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-xs">
            <Sparkles size={13} className="text-brand-gold" />
            <span>{cms.badge || "Prime Real Estate Portfolio"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy leading-tight mb-4">
            {cms.titleMain || "Our Core Property "} <span className="italic font-serif text-brand-gold">{cms.titleItalic || "Categories"}</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-slate font-normal leading-relaxed">
            {cms.subtitle || "Whether you seek an illustrious residential address, high-end commercial headquarters, or strategic investment land, we curate the finest options in DLF Gurugram."}
          </p>
        </div>

        {/* 3D Cards Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          style={{ perspective: '1200px' }}
        >
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="h-full"
              >
                <Tilt3DCard
                  maxTilt={6}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-brand-cream-border hover:border-brand-gold/60 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(23,33,61,0.08)] h-full text-brand-navy"
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-56 overflow-hidden bg-brand-ivory-warm">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                      {/* Tag Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-cream-border text-brand-navy text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
                          {item.tag}
                        </span>
                      </div>

                      {/* Category Icon */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-cream-border text-brand-navy group-hover:bg-brand-gold group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-md">
                        <Icon size={22} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-7">
                      <h3 className="text-2xl font-serif font-bold text-brand-navy mb-3 group-hover:text-brand-gold transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-brand-slate font-normal leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Key Highlights Checklist */}
                      <div className="space-y-2.5 pt-4 border-t border-brand-cream-border mb-6">
                        {(item.features || []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-brand-navy">
                            <Check size={14} className="text-brand-gold shrink-0 mt-0.5" />
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA Button */}
                  <div className="p-7 pt-0">
                    <Link href={item.ctaLink}
                      className="w-full py-3.5 px-4 rounded-xl bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group/btn cursor-pointer"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowUpRight size={14} className="text-brand-gold group-hover/btn:text-brand-navy group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </Tilt3DCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
