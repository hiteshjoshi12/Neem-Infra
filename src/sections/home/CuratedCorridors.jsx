"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';


import { FEATURED_PROPERTIES_DATA } from '../../constants';
import { useCms } from '../../context/CmsContext';
import Image from 'next/image';


export default function CuratedCorridors() {
  const { properties, sections } = useCms();
  const propertyList = properties && properties.length > 0 ? properties : FEATURED_PROPERTIES_DATA;
  const corridorData = sections?.curatedCorridors || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const ctaRef = useRef(null);

  // Auto-slide effect every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused || propertyList.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % propertyList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, propertyList.length]);

  const handleNext = () => {
    if (propertyList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % propertyList.length);
  };

  const handlePrev = () => {
    if (propertyList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + propertyList.length) % propertyList.length);
  };

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

      // 2. Stage Area Reveal
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 3. CTA Button Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
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
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] pt-8 pb-6 md:pt-10 md:pb-8 overflow-hidden border-t border-[#EFECE6]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Section */}
      <div
        ref={headerRef}
        className="container mx-auto px-5 md:px-12 relative z-10 mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        {/* Left Side: Titles and Description */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-[#D09A16]" />
            <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#D09A16] uppercase font-semibold">
              {corridorData.badge || "Featured Portfolio"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-tight mb-4">
            {corridorData.titleMain || "Featured"} <span className="italic text-[#D09A16] font-light">{corridorData.titleItalic || "Properties"}</span>
          </h2>

          <p className="text-[#334155] font-normal text-sm sm:text-base md:text-lg leading-relaxed">
            {corridorData.description || "Handpicked luxury builder floors and independent villas in DLF Phase 1–4, Sushant Lok & Udyog Vihar."}
          </p>
        </div>

        {/* Right Side: Auto Rotation Status & Navigation Arrows */}
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 lg:pb-2">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {propertyList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${currentIndex === idx ? 'w-6 sm:w-8 bg-[#D09A16]' : 'w-2 bg-[#D1D5DB]'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-[#E8E4DA] bg-white flex items-center justify-center text-[#1D263B] hover:border-[#D09A16] hover:text-[#D09A16] transition-colors duration-300 shadow-sm cursor-pointer"
              aria-label="Previous Property"
            >
              <ChevronLeft strokeWidth={1.8} size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-[#E8E4DA] bg-white flex items-center justify-center text-[#1D263B] hover:border-[#D09A16] hover:text-[#D09A16] transition-colors duration-300 shadow-sm cursor-pointer"
              aria-label="Next Property"
            >
              <ChevronRight strokeWidth={1.8} size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Stage Area */}
      <div
        ref={stageRef}
        className="relative w-full h-[470px] sm:h-[530px] md:h-[580px] flex items-center justify-center perspective-[1200px]"
      >
        <AnimatePresence mode="popLayout">
          {propertyList.map((item, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += propertyList.length;
            if (offset > 2) offset -= propertyList.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: `${offset * 48}%`,
                  z: isCenter ? 0 : -Math.abs(offset) * 120,
                  rotateY: offset * -12,
                  scale: isCenter ? 1 : 0.88,
                  opacity: isCenter ? 1 : 0.35,
                  filter: isCenter ? "blur(0px)" : "blur(3px)",
                  zIndex: 10 - Math.abs(offset),
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute w-[92%] sm:w-[80%] md:w-[60%] max-w-[620px] h-[410px] sm:h-[450px] md:h-[480px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(20,25,35,0.25)] border border-white/40 ${isCenter ? 'cursor-default' : 'cursor-pointer'
                  }`}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
              >
                {/* Background Property Image */}
                <Image
                  src={item.img}
                  alt={item.title}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 60vw, 620px"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

                {/* Content Overlay */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-10 flex flex-col justify-end text-white"
                  animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: isCenter ? 0.15 : 0 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#D09A16] text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase text-white shadow-sm">
                      {item.tag}
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl font-serif text-[#D09A16] font-bold">
                      {item.price}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-4xl font-serif text-white leading-tight mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 sm:gap-2 text-[#CBD5E1] text-[10px] sm:text-xs mb-2 md:mb-3">
                    <MapPin size={12} className="text-[#D09A16] flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                    <span className="mx-0.5">•</span>
                    <span className="truncate">{item.specs}</span>
                  </div>

                  <p className="text-slate-200 font-normal text-[11px] sm:text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/15">
                    <Link href={item.link}
                      className="inline-flex items-center gap-2 bg-white text-[#1D263B] px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-[#D09A16] hover:text-white transition-colors duration-300 shadow-md group"
                    >
                      <span>View Details</span>
                      <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    <div className="text-[9px] sm:text-[10px] text-gray-300 font-mono tracking-wider uppercase">
                      0{currentIndex + 1} / 0{propertyList.length}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Master Directory CTA */}
      <div ref={ctaRef} className="container mx-auto px-5 md:px-12 mt-6 sm:mt-8 flex justify-center">
        <Link href={corridorData.ctaLink || "/ready-to-move"}
          className="group relative px-6 py-3.5 sm:px-8 sm:py-4 bg-[#1D263B] text-white overflow-hidden rounded-full flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="relative z-10 text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
            {corridorData.ctaText || "View Complete Featured Inventory"}
          </span>
          <div className="relative z-10 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#1D263B] transition-colors">
            <ArrowUpRight size={14} />
          </div>
          <div className="absolute inset-0 w-0 bg-[#111827] transition-all duration-500 ease-out group-hover:w-full z-0" />
        </Link>
      </div>
    </section>
  );
}
