"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import { Building2, Briefcase, Factory, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';


import { useCms } from '../../../context/CmsContext';
import Image from 'next/image';


const DEFAULT_SERVICES_DATA = [
  {
    id: "01",
    category: "RESIDENTIAL REAL ESTATE",
    title: "Residential",
    icon: "Building2",
    badge: "Plots • Builder Floors • Kothis • Apartments",
    description: "From residential plots and builder floors in DLF to apartments in Sushant Lok and premium kothis in Gurgaon, we specialize in properties that fit your lifestyle and your family’s future. Whether you're looking to buy or sell, we recommend options that combine comfort, location, and long-term value.",
    highlights: ["DLF Phase 1–5 Floors", "Sushant Lok & Golf Course", "Verified Legal Titles", "Luxury Kothis"],
    bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    link: "/services/residential",
    ctaText: "Explore Residential"
  },
  {
    id: "02",
    category: "COMMERCIAL REAL ESTATE",
    title: "Commercial",
    icon: "Briefcase",
    badge: "Office Spaces • Retail • Corporate Hubs",
    description: "Great ideas need the right environment to thrive. Our team helps you find and lease office spaces in Gurgaon, including top locations like Udyog Vihar and Golf Course Road. With a deep understanding of commercial real estate in Gurugram, we streamline your search and provide tailored options that suit your business needs.",
    highlights: ["Udyog Vihar Offices", "Golf Course Road Hubs", "Corporate Lease", "High-Yield Assets"],
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    link: "/services/commercial",
    ctaText: "Explore Commercial"
  },
  {
    id: "03",
    category: "INDUSTRIAL REAL ESTATE",
    title: "Industrial",
    icon: "Factory",
    badge: "Warehouses • Industrial Plots • Factories",
    description: "Whether you’re expanding or relocating, we offer smart, reliable options for industrial plots, warehouses, and factory leasing opportunities in Udyog Vihar and surrounding hubs. Our mission is to find industrial properties that support growth, productivity, and scalability for your business.",
    highlights: ["Industrial Warehouses", "Factory Land Leasing", "Scalable Outlets", "Prime Connectivity"],
    bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    link: "/services/industrial",
    ctaText: "Explore Industrial"
  }
];

const ICON_MAP = {
  residential: Building2,
  commercial: Briefcase,
  industrial: Factory,
  building: Building2,
  building2: Building2,
  briefcase: Briefcase,
  factory: Factory
};

const getServiceLink = (service, index) => {
  if (service?.link) return service.link;
  const title = (service?.title || service?.category || '').toLowerCase();
  if (title.includes('resident')) return '/services/residential';
  if (title.includes('commerc')) return '/services/commercial';
  if (title.includes('industr')) return '/services/industrial';
  if (index === 0) return '/services/residential';
  if (index === 1) return '/services/commercial';
  if (index === 2) return '/services/industrial';
  return '/services/residential';
};

export default function ServicesCardsGrid() {
  const { sections } = useCms();
  const servicesList = sections?.services?.cards || DEFAULT_SERVICES_DATA;

  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRefs.current.length > 0) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 55, rotateX: 15, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [servicesList]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-10 mb-16 md:mb-20"
    >
      {servicesList.map((service, index) => {
        const iconKey = (service.icon || service.title || 'building2').toLowerCase();
        const IconComponent = ICON_MAP[iconKey] || Building2;
        const targetUrl = getServiceLink(service, index);

        return (
          <Link
            key={service.id || index}
            href={targetUrl}
            prefetch={true}
            ref={(el) => (cardRefs.current[index] = el)}
            className="group relative flex flex-col h-full rounded-3xl bg-white border border-[#17213D]/10 shadow-[0_12px_35px_-10px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_50px_-10px_rgba(208, 154, 22,0.22)] hover:border-[#D09A16]/50 hover:-translate-y-2 transition-all duration-300 overflow-hidden transform-gpu cursor-pointer no-underline block"
          >
            {/* Top Image Preview with Dark Vignette */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden">
              <Image
                src={service.bgImage}
                alt={service.title}
                width={800}
                height={500}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E162B] via-[#0E162B]/35 to-transparent" />

              {/* Category Badge & Number Indicator */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3.5 py-1 rounded-full bg-[#17213D]/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  {service.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#17213D]/15 text-[#D09A16] flex items-center justify-center text-xs font-bold font-serif shadow-sm">
                  {service.id}
                </span>
              </div>

              {/* Title & Icon overlaid at the bottom of the image */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#D09A16] text-[#0E162B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <IconComponent size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-[#D09A16] font-medium">
                    {service.badge}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow bg-white">
              <p className="text-[#566078] text-xs sm:text-sm font-normal leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Bulleted Micro-Highlights */}
              <div className="pt-4 border-t border-[#17213D]/[0.08] space-y-2 mb-6">
                {service.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#17213D] font-medium">
                    <CheckCircle2 size={14} className="text-[#D09A16] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Explore Service Action Indicator */}
              <div
                className="w-full py-3.5 px-5 rounded-2xl bg-[#F7F5EF] group-hover:bg-[#17213D] text-[#17213D] group-hover:text-[#F7F5EF] border border-[#17213D]/12 group-hover:border-[#17213D] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
              >
                <span>{service.ctaText || `Explore ${service.title}`}</span>
                <ArrowRight size={14} className="text-[#D09A16] group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Champagne Gold Hover Glow Line */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D09A16] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        );
      })}
    </div>
  );
}
