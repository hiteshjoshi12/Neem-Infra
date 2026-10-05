"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopWidget({ isHidden }) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const progressCircleRef = useRef(null);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

          if (progressCircleRef.current && totalScroll > 0) {
            const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
            const offset = circumference - progress * circumference;
            progressCircleRef.current.style.strokeDashoffset = `${offset}px`;
          }

          const shouldShow = currentScroll > 320;
          setShowTopBtn((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [circumference]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If externally hidden (e.g., chatbot is open), don't render
  const isVisible = showTopBtn && !isHidden;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto group relative flex items-center mb-4"
        >
          <span className="hidden sm:block absolute right-full mr-3.5 px-3 py-1 rounded-full bg-[#1D263B]/90 backdrop-blur-md text-[11px] font-medium tracking-wide text-[#E2E8F0] shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Back to top
          </span>
          <button
            onClick={scrollToTop}
            className="relative w-11 h-11 rounded-full bg-[#1D263B]/95 backdrop-blur-xl text-[#D09A16] flex items-center justify-center shadow-[0_5px_15px_rgba(20,25,35,0.3)] border border-[#D09A16]/30 hover:border-[#D09A16] transition-all duration-300 hover:scale-105 active:scale-95 group/btn cursor-pointer"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[2px]" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r={radius} className="stroke-white/10" strokeWidth="2.5" fill="none" />
              <circle ref={progressCircleRef} cx="22" cy="22" r={radius} className="stroke-[#D09A16]" strokeWidth="2.5" strokeDasharray={circumference} strokeDashoffset={circumference} strokeLinecap="round" fill="none" />
            </svg>
            <ArrowUp size={16} className="transform group-hover/btn:-translate-y-0.5 transition-transform duration-300 relative z-10" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
