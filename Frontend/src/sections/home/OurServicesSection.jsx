import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ServicesCardsGrid from './services/ServicesCardsGrid';
import ExperienceCounter from './services/ExperienceCounter';
import HowWeWorkProcess from './services/HowWeWorkProcess';
import DlfPropertyCallout from './services/DlfPropertyCallout';
import { useCms } from '../../context/CmsContext';

export default function OurServicesSection() {
  const { sections } = useCms();
  const data = sections?.services || {};

  const badge = data.badge || "Bespoke Property Solutions";
  const titleMain = data.titleMain || "Our";
  const titleItalic = data.titleItalic || "Services";
  const description = data.description || "As the top real estate consultant in DLF Gurugram, let’s explore where our expertise lies and how it translates into real value for you.";

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#FAF8F5] text-[#1D263B] overflow-hidden border-t border-[#EFECE6]">
      {/* Ambient Radial Subtle Pattern Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1D263B_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-18"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#C5A880]/40 shadow-sm text-[11px] font-bold tracking-[0.22em] text-[#A27B48] uppercase mb-4">
            <Sparkles size={13} className="text-[#C5A880]" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1D263B] leading-[1.2] mb-4">
            {titleMain} <span className="italic font-light text-[#C5A880]">{titleItalic}</span>
          </h2>

          <p className="text-[#334155] text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* 1. Core Services 3D Cards Grid (Residential, Commercial, Industrial) */}
        <ServicesCardsGrid />

        {/* 2. 25+ Years Experience Counter Spotlight (Animated 1-25+ counter, Porcelain & Gold luxury theme) */}
        <ExperienceCounter />

        {/* 3. How Do We Work? Interactive Process Steps */}
        <HowWeWorkProcess />

        {/* 4. DLF Gurgaon Property Callout with 100+ Cr, 1,000+ Clients, 25+ Years stats */}
        <DlfPropertyCallout />

      </div>
    </section>
  );
}
