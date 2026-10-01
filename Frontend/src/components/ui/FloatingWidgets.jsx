import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

export default function FloatingWidgets() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      if (currentScroll > 320) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // WhatsApp prefilled message
  const whatsappUrl =
    "https://wa.me/919718511207?text=" +
    encodeURIComponent("Hello Saudagar Properties, I am interested in luxury properties in DLF Gurugram.");

  // Circular progress calculations for 44px widget (radius 18)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-6 right-5 sm:right-7 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* 1. Luxury Go To Top Widget with Scroll Progress Ring */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto group relative flex items-center"
          >
            {/* Hover Tooltip */}
            <span className="hidden sm:block absolute right-full mr-3.5 px-3 py-1 rounded-full bg-[#1D263B]/90 backdrop-blur-md text-[11px] font-medium tracking-wide text-[#E2E8F0] shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              Back to top
            </span>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="relative w-12 h-12 rounded-full bg-[#1D263B]/95 backdrop-blur-xl text-[#C5A880] flex items-center justify-center shadow-[0_10px_25px_rgba(20,25,35,0.3)] hover:shadow-[0_15px_30px_rgba(197,168,128,0.35)] border border-[#C5A880]/30 hover:border-[#C5A880] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 group/btn"
            >
              {/* SVG Circular Progress Track */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[2px]" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-white/10"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-[#C5A880] transition-all duration-150"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <ArrowUp
                size={18}
                className="transform group-hover/btn:-translate-y-0.5 transition-transform duration-300 relative z-10"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Ultra-Premium WhatsApp Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pointer-events-auto group relative flex items-center"
      >
        {/* Luxury Expandable Badge on Hover (Desktop) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex absolute right-full mr-3.5 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D263B]/95 backdrop-blur-xl border border-[#25D366]/40 text-white shadow-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[#E2E8F0]">
            Chat with DLF Advisory
          </span>
        </a>

        {/* WhatsApp Floating Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Saudagar Properties on WhatsApp at 919718511207"
          className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" />

          {/* Green Status Dot Badge */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-white flex items-center justify-center shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          <FaWhatsapp size={26} className="relative z-10 drop-shadow-md" />
        </a>
      </motion.div>

    </aside>
  );
}
