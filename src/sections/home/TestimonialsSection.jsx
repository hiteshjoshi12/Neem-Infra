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
   STAR RATING
========================================================= */

function Rating({ rating = 5 }) {
  return (
    <div role="img" className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star
          key={index}
          size={14}
          fill="currentColor"
          className="text-brand-gold"
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
      className="group relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-brand-navy/10 bg-white shadow-[0_20px_60px_rgba(23,33,61,0.08)] transition-all duration-500"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[350px] w-[350px] rounded-full bg-brand-gold/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-brand-ivory blur-[80px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">

        {/* ================= LEFT SIDE: CLIENT PHOTO ================= */}
        <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[380px] lg:min-h-full overflow-hidden bg-brand-navy-deep">
          <Image
            src={displayImage}
            alt={item.avatarAlt || item.imageAlt || `${item.name} — Saudagar Properties client`}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            loading="lazy"
            className="w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradients over photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50 hidden lg:block" />

          {/* Top-Left Verified Trust Pill */}
          <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-deep/90 backdrop-blur-md border border-brand-gold/50 text-brand-gold text-[10px] font-bold tracking-widest uppercase shadow-md">
            <ShieldCheck size={13} className="text-brand-gold" />
            <span>Verified Advisory Client</span>
          </div>

          {/* Bottom Floating Card on Photo */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-navy-deep/90 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-serif font-bold text-lg sm:text-xl truncate leading-tight">
                    {item.name}
                  </p>

                  {/* BOLD & VISIBLE INVESTOR DUBAI TAGS */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="px-3 py-1 rounded-lg bg-brand-gold text-brand-navy-deep text-xs font-black uppercase tracking-wider shadow-sm">
                      {item.role}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <MapPin size={12} className="text-brand-gold shrink-0" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 bg-white/10 p-2 rounded-xl border border-white/15 hidden sm:block">
                  <Rating rating={item.rating || 5} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: TESTIMONIAL REVIEW & CONTROLS ================= */}
        <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-between relative z-10 bg-white text-brand-navy">

          {/* Header Row: Perspective Badge + Carousel Arrows */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-brand-navy/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/30 shrink-0">
                <Quote size={22} className="fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-gold block">
                  Client Perspective
                </span>
                <span className="text-xs font-semibold text-brand-slate">
                  {item.tag || "Gurgaon Real Estate Advisory"}
                </span>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-serif font-bold text-brand-gold tracking-wider px-2">
                {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-brand-navy/15 bg-brand-ivory hover:bg-brand-gold text-brand-navy hover:text-brand-navy-deep flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-brand-navy/15 bg-brand-ivory hover:bg-brand-gold text-brand-navy hover:text-brand-navy-deep flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="my-6 sm:my-8">
            <blockquote
              className="font-serif text-lg sm:text-xl lg:text-[22px] text-brand-navy leading-[1.65] font-normal italic tracking-[-0.015em]"
            >
              “{item.quote}”
            </blockquote>
          </div>

          {/* Footer Row: Prominent Badges & Carousel Dots */}
          <div className="pt-5 border-t border-brand-navy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <cite
                className="not-italic"
              >
                <span className="text-lg font-serif font-bold text-brand-navy block">
                  {item.name}
                </span>
              </cite>

              {/* BOLD & VISIBLE INVESTOR DUBAI TAGS (Secondary Prominent Display) */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold font-bold text-xs uppercase tracking-wider">
                  {item.role}
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-ivory border border-brand-navy/10 text-brand-slate font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} className="text-brand-gold" />
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
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                    ? "w-8 bg-brand-gold"
                    : "w-2 bg-brand-navy/20 hover:bg-brand-navy/40"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </article>
  );
}

/* =========================================================
   COMPACT TESTIMONIAL CARD (FUTURE-PROOF)
========================================================= */

function CompactTestimonial({ item, index, onSelect, active }) {
  const rawAvatar = item.avatar || item.image;
  const displayAvatar = (rawAvatar && !rawAvatar.includes('/wp-content/'))
    ? rawAvatar
    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80";

  return (
    <article
      onClick={() => onSelect(index)}
      className={`
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        bg-white
        p-5 sm:p-6
        transition-all
        duration-300
        cursor-pointer
        flex
        flex-col
        justify-between
        h-full
        ${active
          ? "border-brand-gold bg-brand-ivory/60 shadow-[0_15px_40px_rgba(197,155,39,0.14)] scale-[1.01]"
          : "border-brand-navy/10 shadow-sm hover:border-brand-gold/40 hover:shadow-md hover:bg-white"
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
          via-brand-gold
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
          <span className="text-[10px] font-serif font-bold text-brand-gold">
            0{index + 1}
          </span>
        </div>

        {/* Quote Preview */}
        <blockquote
          className="line-clamp-3 text-xs sm:text-[13px] leading-relaxed text-brand-slate font-normal mb-5"
        >
          “{item.quote}”
        </blockquote>
      </div>

      {/* Author & Bold Visible Tags */}
      <div className="pt-4 border-t border-brand-navy/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden relative border border-brand-gold/40 shadow-xs">
            <Image
              src={displayAvatar}
              alt={item.avatarAlt || item.imageAlt || `${item.name} — client`}
              fill
              sizes="40px"
              loading="lazy"
              className="object-cover object-top"
            />
          </div>

          <div className="min-w-0">
            <cite className="not-italic">
              <span className="block truncate font-serif text-sm font-bold text-brand-navy">
                {item.name}
              </span>
            </cite>

            {/* BOLD & VISIBLE INVESTOR DUBAI TAG */}
            <div className="mt-0.5 flex items-center gap-1.5 truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                {item.role}
              </span>
              <span className="text-brand-slate/40 text-xs">•</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate truncate">
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
              ? "border-brand-gold bg-brand-gold text-brand-navy-deep"
              : "border-white/15 text-white/70 hover:border-brand-gold hover:text-brand-gold"
            }
          `}
        >
          <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TestimonialsSection({ initialTestimonials = [], initialSectionData = null }) {
  const { testimonials = [], sections = {} } = useCms() || {};
  const list = (testimonials && testimonials.length > 0)
    ? testimonials
    : (initialTestimonials && initialTestimonials.length > 0)
      ? initialTestimonials
      : [];
  const testData = sections?.testimonials || initialSectionData || {};

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
      className="relative w-full overflow-hidden border-t border-brand-navy/[0.06] bg-brand-ivory text-brand-navy py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute right-[-180px] top-[-160px] h-[430px] w-[430px] rounded-full bg-brand-gold/[0.05] blur-[110px]" />
      <div className="pointer-events-none absolute left-[-150px] bottom-[-200px] h-[400px] w-[400px] rounded-full bg-brand-navy/5 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,var(--color-brand-navy)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-navy)_1px,transparent_1px)] [background-size:100px_100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-7 lg:px-8">

        {/* ================= HEADER ================= */}
        <div
          ref={headerRef}
          className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.23em] text-brand-gold shadow-sm">
              <Sparkles size={11} className="text-brand-gold" />
              <span>{testData.badge || "Client Perspectives"}</span>
            </div>

            <h2
              id="client-testimonials-heading"
              className="font-serif text-4xl font-normal leading-[1.05] tracking-[-0.04em] text-brand-navy sm:text-5xl lg:text-6xl"
            >
              {testData.titleMain || "Words of"}{" "}
              <span className="italic font-light text-brand-gold">
                {testData.titleItalic || "Distinction"}
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-xs leading-6 text-brand-slate sm:text-sm">
              {testData.description ||
                "Hear directly from discerning investors, corporate leaders, and homeowners who have partnered with Saudagar Properties across DLF Gurugram and prime corridors."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 lg:pb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/30 bg-white text-brand-gold shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-[0.22em] text-brand-slate">
                CLIENT EXPERIENCE
              </span>
              <span className="mt-1 block font-serif text-base text-brand-navy font-bold">
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy">
                  All Client Reviews ({list.length})
                </span>
                <span className="text-[10px] text-brand-gold font-semibold">
                  • Swipe or Click to View
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail("left")}
                  aria-label="Scroll left"
                  className="w-8 h-8 rounded-full border border-brand-navy/15 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail("right")}
                  aria-label="Scroll right"
                  className="w-8 h-8 rounded-full border border-brand-navy/15 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
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
      </div>
    </section>
  );
}