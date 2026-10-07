import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, Building2, Phone, Compass } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | Saudagar Properties',
  description: 'The requested luxury real estate page could not be located. Browse our Gurugram portfolio or editorial journal.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function NotFound() {
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

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#D09A16]/30 text-[#D09A16] text-xs font-semibold uppercase tracking-[0.25em] mb-6">
          <Compass size={13} />
          <span>Error 404 • Destination Not Found</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#F7F5EF] mb-4 tracking-tight">
          Page Not Located
        </h1>
        
        <p className="text-sm sm:text-base text-[#C9CED9] mb-10 leading-relaxed font-sans">
          The property listing, editorial dispatch, or link you requested is unavailable or has been relocated to our updated platform.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link 
            href="/"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#17213D] border border-white/10 hover:border-[#D09A16] transition-all group"
          >
            <Home size={18} className="text-[#D09A16]" />
            <div>
              <span className="block text-xs font-bold text-white group-hover:text-[#D09A16] transition-colors">
                Return to Homepage
              </span>
              <span className="text-[11px] text-[#9DA6B8]">
                Explore prime corridors & services
              </span>
            </div>
          </Link>

          <Link 
            href="/blog"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#17213D] border border-white/10 hover:border-[#D09A16] transition-all group"
          >
            <BookOpen size={18} className="text-[#D09A16]" />
            <div>
              <span className="block text-xs font-bold text-white group-hover:text-[#D09A16] transition-colors">
                Real Estate Journal
              </span>
              <span className="text-[11px] text-[#9DA6B8]">
                Read luxury builder floor analyses
              </span>
            </div>
          </Link>

          <Link 
            href="/properties"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#17213D] border border-white/10 hover:border-[#D09A16] transition-all group"
          >
            <Building2 size={18} className="text-[#D09A16]" />
            <div>
              <span className="block text-xs font-bold text-white group-hover:text-[#D09A16] transition-colors">
                Ready-to-Move Residences
              </span>
              <span className="text-[11px] text-[#9DA6B8]">
                Vetted DLF Phase 1–5 builder floors
              </span>
            </div>
          </Link>

          <Link 
            href="/contact"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#17213D] border border-white/10 hover:border-[#D09A16] transition-all group"
          >
            <Phone size={18} className="text-[#D09A16]" />
            <div>
              <span className="block text-xs font-bold text-white group-hover:text-[#D09A16] transition-colors">
                Private Consultation
              </span>
              <span className="text-[11px] text-[#9DA6B8]">
                Speak directly with senior partners
              </span>
            </div>
          </Link>
        </div>

        <p className="text-xs text-[#8892A6]">
          Saudagar Properties Pvt. Ltd. • DLF Phase 2, Gurugram
        </p>
      </div>
    </div>
  );
}
