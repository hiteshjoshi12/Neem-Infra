"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap/animations";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Quote,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { useCms } from "../../context/CmsContext";
import Image from 'next/image';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================
   DEFAULT TESTIMONIALS (High-Resolution Curated Assets)
========================================================= */

const TESTIMONIALS = [
  {
    id: "01",
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c3.jpg",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    quote: "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory",
  },
  {
    id: "02",
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c2.jpg",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    quote: "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction",
  },
  {
    id: "03",
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "India",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c1.jpg",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
    quote: "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge",
  },
];

/* =========================================================
   STAR RATING
========================================================= */

function Rating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star
          key={index}
          size={14}
          fill="currentColor"
          className="text-[#D09A16]"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* =========================================================
   FEATURED SPLIT TESTIMONIAL CAROUSEL CARD
========================================================= */

function FeaturedSplitTestimonial({
  item,
  activeIndex,
  total,
  onNext,
  onPrev,
  onSelect,
}) {
  if (!item) return null;

  const displayImage = item.image || item.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80";

  return (
    <article
      itemScope
      itemType="https://schema.org/Review"
      className="group relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/10 bg-[#17213D] shadow-[0_25px_70px_rgba(0,0,0,0.45)] transition-all duration-500"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[350px] w-[350px] rounded-full bg-[#D09A16]/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-[#202B4A]/25 blur-[80px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">
        
        {/* ================= LEFT SIDE: CLIENT PHOTO ================= */}
        <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[380px] lg:min-h-full overflow-hidden bg-[#0E162B]">
          <Image
            src={displayImage}
            alt={`${item.name} — Saudagar Properties client`}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
            itemProp="image"
            className="w-full h-full object-cover object-top filter brightness-[0.93] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradients over photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#17213D] via-[#17213D]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#17213D]/70 hidden lg:block" />

          {/* Top-Left Verified Trust Pill */}
          <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E162B]/85 backdrop-blur-md border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold tracking-widest uppercase shadow-md">
            <ShieldCheck size={13} className="text-[#D09A16]" />
            <span>Verified Advisory Client</span>
          </div>

          {/* Bottom Floating Card on Photo */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E162B]/85 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-serif font-bold text-lg sm:text-xl truncate leading-tight">
                    {item.name}
                  </p>
                  
                  {/* BOLD & VISIBLE INVESTOR DUBAI TAGS */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="px-3 py-1 rounded-lg bg-[#D09A16] text-[#0E162B] text-xs font-black uppercase tracking-wider shadow-sm">
                      {item.role}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-[#202B4A] border border-white/20 text-[#F7F5EF] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <MapPin size={12} className="text-[#D09A16] shrink-0" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 bg-[#17213D]/80 p-2 rounded-xl border border-white/10 hidden sm:block">
                  <Rating rating={item.rating || 5} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: TESTIMONIAL REVIEW & CONTROLS ================= */}
        <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-between relative z-10 bg-[#17213D]">
          
          {/* Header Row: Perspective Badge + Carousel Arrows */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center border border-[#D09A16]/30 shrink-0">
                <Quote size={22} className="fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#D09A16] block">
                  Client Perspective
                </span>
                <span className="text-xs font-semibold text-[#C9CED9]">
                  {item.tag || "Gurgaon Real Estate Advisory"}
                </span>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-serif font-bold text-[#D09A16] tracking-wider px-2">
                {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-white/15 bg-[#202B4A]/80 hover:bg-[#D09A16] text-white hover:text-[#0E162B] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-white/15 bg-[#202B4A]/80 hover:bg-[#D09A16] text-white hover:text-[#0E162B] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="my-6 sm:my-8">
            <blockquote
              itemProp="reviewBody"
              className="font-serif text-lg sm:text-xl lg:text-[23px] text-[#F7F5EF] leading-[1.62] font-normal italic tracking-[-0.015em]"
            >
              “{item.quote}”
            </blockquote>
          </div>

          {/* Footer Row: Prominent Badges & Carousel Dots */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <cite
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
                className="not-italic"
              >
                <span itemProp="name" className="text-lg font-serif font-semibold text-white block">
                  {item.name}
                </span>
              </cite>

              {/* BOLD & VISIBLE INVESTOR DUBAI TAGS (Secondary Prominent Display) */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#D09A16]/20 border border-[#D09A16]/60 text-[#F5DE98] font-black text-xs uppercase tracking-wider">
                  {item.role}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#202B4A] border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#D09A16]" />
                  <span>{item.location}</span>
                </span>
              </div>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {Array.from({ length: total }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelect(idx)}
                  aria-label={`Jump to testimonial ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-8 bg-[#D09A16]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Hidden semantic rating */}
      <meta itemProp="ratingValue" content={String(item.rating || 5)} />
      <meta itemProp="bestRating" content="5" />
    </article>
  );
}

/* =========================================================
   COMPACT TESTIMONIAL CARD (FUTURE-PROOF)
========================================================= */

function CompactTestimonial({ item, index, onSelect, active }) {
  const displayAvatar = item.avatar || item.image || "https://saudagarproperties.com/wp-content/uploads/2021/01/c1.jpg";

  return (
    <article
      itemScope
      itemType="https://schema.org/Review"
      onClick={() => onSelect(index)}
      className={`
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        bg-[#17213D]/90
        p-5 sm:p-6
        transition-all
        duration-300
        cursor-pointer
        flex
        flex-col
        justify-between
        h-full
        ${active
          ? "border-[#D09A16] bg-[#202B4A] shadow-[0_15px_45px_rgba(208, 154, 22,0.2)] scale-[1.01]"
          : "border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-[#D09A16]/50 hover:bg-[#1E294B]"
        }
      `}
    >
      {/* Top Gold Hover Accent */}
      <div
        className={`
          absolute
          left-0
          right-0
          top-0
          h-[3px]
          bg-gradient-to-r
          from-transparent
          via-[#D09A16]
          to-transparent
          transition-opacity
          duration-300
          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      <div>
        {/* Header: Rating & Number Index */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Rating rating={item.rating || 5} />
          <span className="text-[10px] font-serif font-bold text-[#D09A16]">
            0{index + 1}
          </span>
        </div>

        {/* Quote Preview */}
        <blockquote
          itemProp="reviewBody"
          className="line-clamp-3 text-xs sm:text-[13px] leading-relaxed text-[#C9CED9] font-light mb-5"
        >
          “{item.quote}”
        </blockquote>
      </div>

      {/* Author & Bold Visible Tags */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden relative border border-[#D09A16]/40">
            <Image
              src={displayAvatar}
              alt={`${item.name} — client`}
              fill
              sizes="40px"
              loading="lazy"
              className="object-cover object-top"
            />
          </div>

          <div className="min-w-0">
            <cite itemProp="author" className="not-italic">
              <span itemProp="name" className="block truncate font-serif text-sm font-semibold text-white">
                {item.name}
              </span>
            </cite>
            
            {/* BOLD & VISIBLE INVESTOR DUBAI TAG */}
            <div className="mt-0.5 flex items-center gap-1.5 truncate">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D09A16]">
                {item.role}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white truncate">
                {item.location}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          aria-label={`View review from ${item.name}`}
          className={`
            w-8
            h-8
            shrink-0
            rounded-full
            flex
            items-center
            justify-center
            border
            transition-all
            duration-300
            ${active
              ? "border-[#D09A16] bg-[#D09A16] text-[#0E162B]"
              : "border-white/15 text-white/70 hover:border-[#D09A16] hover:text-[#D09A16]"
            }
          `}
        >
          <ArrowUpRight size={14} />
        </button>
      </div>

      <meta itemProp="locationCreated" content={item.location || ""} />
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TestimonialsSection() {
  const { testimonials, sections } = useCms();

  const list = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;
  const testData = sections?.testimonials || {};

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featuredRef = useRef(null);
  const railContainerRef = useRef(null);
  const railCardRefs = useRef([]);

  const currentItem = list[activeIndex] || list[0] || {};

  /* =====================================================
     SELECT TESTIMONIAL WITH ANIMATION
  ===================================================== */

  const handleSelect = useCallback((index) => {
    setActiveIndex(index);

    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0.45, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }

    // Scroll corresponding compact card into view if more than 3
    if (railCardRefs.current[index] && list.length > 3) {
      railCardRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [list.length]);

  const handleNext = useCallback(() => {
    if (!list.length) return;
    handleSelect((activeIndex + 1) % list.length);
  }, [activeIndex, list.length, handleSelect]);

  const handlePrev = useCallback(() => {
    if (!list.length) return;
    handleSelect((activeIndex - 1 + list.length) % list.length);
  }, [activeIndex, list.length, handleSelect]);

  /* =====================================================
     AUTO-PLAY CAROUSEL (7s Interval, Pauses on Hover)
  ===================================================== */

  useEffect(() => {
    if (isPaused || list.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, list.length, handleNext]);

  /* =====================================================
     ENTRANCE ANIMATION
  ===================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [list.length]);

  /* =====================================================
     COMPACT RAIL SCROLL CONTROLS (FOR > 3 TESTIMONIALS)
  ===================================================== */

  const scrollRail = (direction) => {
    if (!railContainerRef.current) return;
    const scrollAmount = 340;
    railContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!list.length) return null;

  const isMultiDeck = list.length > 3;

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-labelledby="client-testimonials-heading"
      className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#0E162B] text-[#F7F5EF] py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute right-[-180px] top-[-160px] h-[430px] w-[430px] rounded-full bg-[#D09A16]/[0.04] blur-[110px]" />
      <div className="pointer-events-none absolute left-[-150px] bottom-[-200px] h-[400px] w-[400px] rounded-full bg-[#202B4A]/25 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:100px_100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-7 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div
          ref={headerRef}
          className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D09A16]/30 bg-[#202B4A]/70 px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.23em] text-[#D09A16] shadow-sm">
              <Sparkles size={11} className="text-[#D09A16]" />
              <span>{testData.badge || "Client Perspectives"}</span>
            </div>

            <h2
              id="client-testimonials-heading"
              className="font-serif text-4xl font-normal leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              {testData.titleMain || "Words of"}{" "}
              <span className="italic font-light text-[#D09A16]">
                {testData.titleItalic || "Distinction"}
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-xs leading-6 text-[#C9CED9] sm:text-sm">
              {testData.description ||
                "Hear directly from discerning investors, corporate leaders, and homeowners who have partnered with Saudagar Properties across DLF Gurugram and prime corridors."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 lg:pb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D09A16]/30 bg-[#202B4A] text-[#D09A16] shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="block text-[7px] font-bold uppercase tracking-[0.22em] text-white/40">
                CLIENT EXPERIENCE
              </span>
              <span className="mt-1 block font-serif text-base text-white">
                Gurgaon · Gurugram
              </span>
            </div>
          </div>
        </div>

        {/* ================= FEATURED SPLIT TESTIMONIAL CAROUSEL ================= */}
        <div ref={featuredRef} className="mb-8 sm:mb-10">
          <FeaturedSplitTestimonial
            item={currentItem}
            activeIndex={activeIndex}
            total={list.length}
            onNext={handleNext}
            onPrev={handlePrev}
            onSelect={handleSelect}
          />
        </div>

        {/* ================= FUTURE-PROOF COMPACT TESTIMONIAL CARDS ================= */}
        <div className="mt-6 sm:mt-8">
          
          {/* Header for compact cards rail if multiple testimonials exist */}
          {isMultiDeck && (
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9CED9]">
                  All Client Reviews ({list.length})
                </span>
                <span className="text-[10px] text-[#D09A16] font-semibold">
                  • Swipe or Click to View
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail("left")}
                  aria-label="Scroll left"
                  className="w-8 h-8 rounded-full border border-white/15 bg-[#202B4A] text-white hover:border-[#D09A16] hover:text-[#D09A16] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail("right")}
                  aria-label="Scroll right"
                  className="w-8 h-8 rounded-full border border-white/15 bg-[#202B4A] text-white hover:border-[#D09A16] hover:text-[#D09A16] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Cards Container: Grid for 3 cards, or Scrollable Rail for >3 cards */}
          <div
            ref={railContainerRef}
            className={
              isMultiDeck
                ? "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : "grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
            }
          >
            {list.map((item, index) => (
              <div
                key={item._id || item.id || index}
                ref={(el) => (railCardRefs.current[index] = el)}
                className={
                  isMultiDeck
                    ? "min-w-[280px] sm:min-w-[320px] md:w-[calc(33.333%-11px)] shrink-0 snap-start"
                    : "w-full"
                }
              >
                <CompactTestimonial
                  item={item}
                  index={index}
                  active={index === activeIndex}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>

        </div>

        {/* ================= BOTTOM TRUST TAGS ================= */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center border-t border-white/[0.06] pt-6">
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#C9CED9]/70">
            Residential Property Advisory
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#C9CED9]/70">
            Commercial & Retail Hubs
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#C9CED9]/70">
            NRI Real Estate Portfolio
          </span>
          <span className="h-1 w-1 rounded-full bg-[#D09A16]" />
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#C9CED9]/70">
            Gurugram & NCR
          </span>
        </div>

      </div>
    </section>
  );
}