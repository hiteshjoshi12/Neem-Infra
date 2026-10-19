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
    <div className="min-h-screen bg-brand-navy-deep text-brand-ivory flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-brand-gold selection:text-brand-navy-deep">
      {/* Subtle architectural backdrop */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:40px_40px]" 
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute w-96 h-96 rounded-full bg-brand-gold/10 blur-[120px]"
      />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-6">
          <AlertCircle size={13} />
          <span>Notice • Temporary System Anomaly</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-ivory mb-4 tracking-tight">
          Service Temporarily Interrupted
        </h1>
        
        <p className="text-sm sm:text-base text-brand-text-on-dark-muted mb-8 leading-relaxed font-sans">
          We encountered an unexpected issue while loading this luxury property experience. Our engineering desk has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-gold text-brand-navy-deep font-semibold text-xs tracking-wider uppercase hover:bg-brand-gold-light transition-all shadow-lg shadow-brand-gold/20 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-navy border border-white/10 hover:border-brand-gold text-white text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <Home size={15} className="text-brand-gold" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-brand-muted">
          <Phone size={13} className="text-brand-gold" />
          <span>Need immediate assistance? Call +91 98991 99170</span>
        </div>
      </div>
    </div>
  );
}
