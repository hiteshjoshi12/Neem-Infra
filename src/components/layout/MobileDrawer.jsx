"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X} from 'lucide-react';

const CORE_SERVICES = [
  "Luxury Residential Advisory",
  "Commercial Real Estate",
  "Strategic Investment Opportunities",
  "End-to-End Transaction Support"
];

export default function MobileDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Blurred Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        className="relative w-full max-w-md h-full bg-[#0E162B] text-[#F7F5EF] shadow-2xl flex flex-col border-l border-white/10"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
           <h2 className="text-xl font-serif tracking-widest uppercase text-white">Saudagar Properties</h2>
           <button 
             onClick={onClose} 
             className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-[#D09A16]"
             aria-label="Close menu"
           >
             <X size={20} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <h2 className="text-2xl sm:text-3xl font-serif mb-6 text-white">About Saudagar Properties Realty</h2>
          <p className="text-sm text-[#C9CED9] leading-loose mb-10 font-light">
            Founded with the vision of offering strategic, transparent, and relationship-driven property advisory services. With deep market understanding and years of experience in Gurgaon’s dynamic real estate landscape, we help clients navigate property decisions with clarity and confidence.
          </p>

          <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-2 text-[#D09A16]">Our Core Services</h3>
          <ul className="space-y-5 text-sm text-[#F7F5EF] font-light mb-10">
            {CORE_SERVICES.map((service, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#D09A16] rounded-full"></span>
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Area */}
        <div className="p-8 bg-[#17213D] border-t border-white/10">
          <button className="w-full py-4 mb-6 bg-[#D09A16] text-[#0E162B] text-xs uppercase tracking-widest font-bold hover:bg-[#D09A16] transition-colors rounded-xl shadow-lg">
            Get A Free Consultation
          </button>
          
          <div className="flex items-center justify-between text-[#C9CED9]/60">
            <span className="text-xs font-light">DLF Phase 2 · Gurugram</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}