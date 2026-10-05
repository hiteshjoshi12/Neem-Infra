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
          border-[#D09A16]/60
          bg-[#182345]
          text-[#D09A16]
          shadow-[0_10px_30px_rgba(24,35,69,0.28)]
          transition-all
          duration-300
          hover:border-[#D09A16]
          hover:bg-[#D09A16]
          hover:text-[#182345]
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
            border-[#D09A16]/20
            transition-all
            duration-300
            group-hover:border-[#182345]/20
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
            bg-[#D09A16]
            transition-colors
            duration-300
            group-hover:bg-[#182345]
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
          border-[#D09A16]/20
          bg-[#182345]/95
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
          <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#D09A16]">
            Location
          </p>

          <span className="mt-0.5 block text-[11px] font-medium text-white">
            Get Directions
          </span>
        </div>

        <ArrowUpRight
          size={13}
          strokeWidth={1.6}
          className="text-[#D09A16]"
        />
      </a>
    </motion.div>
  );
}