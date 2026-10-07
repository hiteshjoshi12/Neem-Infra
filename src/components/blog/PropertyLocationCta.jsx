import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function PropertyLocationCta({ locationName = 'DLF Phase 1–5 Gurugram' }) {
  return (
    <div className="relative overflow-hidden bg-[#0E162B] text-[#F7F5EF] rounded-3xl p-8 sm:p-10 my-12 border border-[#D09A16]/30 shadow-[0_20px_50px_-15px_rgba(14,22,43,0.5)]">
      {/* Subtle architectural background grid */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:32px_32px]" 
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-[#D09A16]/10 blur-[90px]"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#D09A16] mb-3">
          <MapPin size={14} />
          <span>Exclusive Private Portfolio • {locationName}</span>
        </div>

        <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#F7F5EF] mb-3 leading-tight">
          Seeking Luxury Builder Floors or Bespoke Estates in Gurugram?
        </h3>

        <p className="text-sm sm:text-base text-[#C9CED9] max-w-2xl leading-relaxed mb-6 font-sans">
          Saudagar Properties curates off-market independent floors, penthouse duplexes, and prime plots in DLF Phase 1–5, Sushant Lok, and Golf Course Road. Connect with our principal advisors for confidential access.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a
            href="tel:+919811221207"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Phone size={15} />
            <span>Call Advisory (+91 98112 21207)</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:border-[#D09A16] bg-white/5 hover:bg-white/10 text-[#F7F5EF] font-semibold text-xs uppercase tracking-wider transition-all active:scale-95"
          >
            <span>Request Private Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 text-xs text-[#9DA6B8]">
          <ShieldCheck size={14} className="text-[#D09A16]" />
          <span>100% Freehold Title Verification & RERA Compliance Assured</span>
        </div>
      </div>
    </div>
  );
}
