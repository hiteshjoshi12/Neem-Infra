'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, Phone } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    // Log unexpected runtime error to console or error tracker in production
    console.error('Unhandled runtime error in page:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0E162B] text-[#F7F5EF] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-[#D09A16] selection:text-[#0E162B]">
      {/* Subtle architectural backdrop */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:40px_40px]" 
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute w-96 h-96 rounded-full bg-[#D09A16]/10 blur-[120px]"
      />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#D09A16]/30 text-[#D09A16] text-xs font-semibold uppercase tracking-[0.25em] mb-6">
          <AlertCircle size={13} />
          <span>Notice • Temporary System Anomaly</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F7F5EF] mb-4 tracking-tight">
          Service Temporarily Interrupted
        </h1>
        
        <p className="text-sm sm:text-base text-[#C9CED9] mb-8 leading-relaxed font-sans">
          We encountered an unexpected issue while loading this luxury property experience. Our engineering desk has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D09A16] text-[#0E162B] font-semibold text-xs tracking-wider uppercase hover:bg-[#E5AA1E] transition-all shadow-lg shadow-[#D09A16]/20 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#17213D] border border-white/10 hover:border-[#D09A16] text-white text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <Home size={15} className="text-[#D09A16]" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#8892A6]">
          <Phone size={13} className="text-[#D09A16]" />
          <span>Need immediate assistance? Call +91 98991 99170</span>
        </div>
      </div>
    </div>
  );
}
