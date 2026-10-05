import React from 'react';
import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found — Saudagar Properties',
  robots: {
    index: false,
    follow: false,
  }
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-[#D09A16] text-sm font-bold tracking-[0.3em] uppercase mb-4">
        Error 404
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif text-[#1D263B] mb-6">
        Page Not Found
      </h1>
      
      <p className="text-[#555] max-w-md mx-auto mb-10 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="flex items-center gap-2 px-8 py-3.5 bg-[#1D263B] text-white rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-[#B5986D] transition-colors"
        >
          <Home size={16} />
          <span>Return Home</span>
        </Link>
        
        <Link 
          href="/about"
          className="flex items-center gap-2 px-8 py-3.5 border border-[#E8E4DA] text-[#1D263B] rounded-full text-xs font-semibold tracking-widest uppercase hover:border-[#B5986D] hover:text-[#B5986D] transition-colors"
        >
          <span>About Us</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
