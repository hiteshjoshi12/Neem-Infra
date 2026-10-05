"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa6';

export default function WhatsAppWidget({ whatsappUrlLink }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="pointer-events-auto group relative flex items-center"
    >
      <a 
        href={whatsappUrlLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Contact us on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer z-10"
      >
        <FaWhatsapp size={26} className="relative z-10 drop-shadow-sm" />
      </a>
      <a 
        href={whatsappUrlLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hidden sm:flex absolute left-full ml-3.5 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D263B]/95 backdrop-blur-xl border border-[#25D366]/40 text-white shadow-xl opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-xs font-semibold tracking-wide text-[#E2E8F0]">Chat on WhatsApp</span>
      </a>
    </motion.div>
  );
}
