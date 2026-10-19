"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X} from 'lucide-react';

import Image from 'next/image';

const logoImg = 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?tr=f-auto,q-80';
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
        className="relative w-full max-w-md h-full bg-brand-navy-deep text-brand-ivory shadow-2xl flex flex-col border-l border-white/10"
      >
        {/* Header with prominent logo */}
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white px-2 py-1.5 shadow-sm">
              <Image
                width={120}
                height={40}
                src={logoImg}
                alt="Saudagar Properties"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold text-white tracking-tight leading-none">
                Saudagar
              </span>
              <span className="text-[9px] font-bold tracking-[0.24em] uppercase text-brand-gold mt-1 leading-none">
                Properties
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-brand-gold cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <h2 className="text-2xl sm:text-3xl font-serif mb-6 text-white">About Saudagar Properties Realty</h2>
          <p className="text-sm text-brand-text-on-dark-muted leading-loose mb-10 font-light">
            Founded with the vision of offering strategic, transparent, and relationship-driven property advisory services. With deep market understanding and years of experience in Gurgaon’s dynamic real estate landscape, we help clients navigate property decisions with clarity and confidence.
          </p>

          <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-2 text-brand-gold">Our Core Services</h3>
          <ul className="space-y-5 text-sm text-brand-ivory font-light mb-10">
            {CORE_SERVICES.map((service, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Area */}
        <div className="p-8 bg-brand-navy border-t border-white/10">
          <button className="w-full py-4 mb-6 bg-brand-gold text-brand-navy-deep text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors rounded-xl shadow-lg">
            Get A Free Consultation
          </button>
          
          <div className="flex items-center justify-between text-brand-text-on-dark-muted/60">
            <span className="text-xs font-light">DLF Phase 2 · Gurugram</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}