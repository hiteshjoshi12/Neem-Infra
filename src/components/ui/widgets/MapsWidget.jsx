"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function MapsWidget({ gmapsUrl }) {
  if (!gmapsUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group pointer-events-auto relative flex items-center"
    >
      {/* =====================================================
          MAIN BUTTON
      ====================================================== */}

      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get directions to Saudagar Properties"
        className="
          relative
          z-20
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-brand-gold/60
          bg-brand-navy-gradient
          text-brand-gold
          shadow-[0_10px_30px_rgba(24,35,69,0.28)]
          transition-all
          duration-300
          hover:border-brand-gold
          hover:bg-brand-gold
          hover:text-brand-navy-gradient
          hover:shadow-[0_12px_35px_rgba(208,154,22,0.28)]
          hover:scale-105
          active:scale-95
        "
      >
        {/* Inner ring */}
        <span
          aria-hidden="true"
          className="
            absolute
            inset-[4px]
            rounded-full
            border
            border-brand-gold/20
            transition-all
            duration-300
            group-hover:border-brand-navy-gradient/20
          "
        />

        <MapPin
          size={18}
          strokeWidth={1.6}
          className="relative z-10"
        />

        {/* Tiny gold indicator */}
        <span
          aria-hidden="true"
          className="
            absolute
            right-[8px]
            top-[8px]
            h-1.5
            w-1.5
            rounded-full
            bg-brand-gold
            transition-colors
            duration-300
            group-hover:bg-brand-navy-gradient
          "
        />
      </a>

      {/* =====================================================
          HOVER LABEL
      ====================================================== */}

      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-full
          z-10
          ml-3
          flex
          translate-x-2
          items-center
          gap-3
          whitespace-nowrap
          rounded-lg
          border
          border-brand-gold/20
          bg-brand-navy-gradient/95
          px-4
          py-2.5
          opacity-0
          shadow-[0_12px_35px_rgba(24,35,69,0.28)]
          backdrop-blur-md
          transition-all
          duration-300
          group-hover:pointer-events-auto
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      >
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Location
          </p>

          <span className="mt-0.5 block text-[11px] font-medium text-white">
            Get Directions
          </span>
        </div>

        <ArrowUpRight
          size={13}
          strokeWidth={1.6}
          className="text-brand-gold"
        />
      </a>
    </motion.div>
  );
}