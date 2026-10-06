"use client";

import React, { useState, useEffect } from 'react';
import { AlignLeft, ChevronDown } from 'lucide-react';

export default function TableOfContents({ items = [] }) {
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden my-8 w-full">
        <details 
          open={mobileOpen}
          onToggle={(e) => setMobileOpen(e.currentTarget.open)}
          className="group bg-[#F7F5EF] border border-[#17213D]/10 rounded-2xl overflow-hidden transition-all shadow-xs"
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-serif text-[#17213D] font-semibold text-sm list-none">
            <span className="flex items-center gap-2.5">
              <AlignLeft size={16} className="text-[#C6A24A]" />
              <span>Table of Contents ({items.length} Sections)</span>
            </span>
            <ChevronDown size={16} className="text-[#C6A24A] transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <nav aria-label="Mobile table of contents" className="px-4 pb-4 pt-1 border-t border-[#17213D]/10">
            <ul className="space-y-2 text-xs">
              {items.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'ml-3' : ''}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-1 transition-colors hover:text-[#C6A24A] ${
                      activeId === item.id ? 'text-[#C6A24A] font-semibold' : 'text-[#566078]'
                    }`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>

      {/* Desktop Sticky TOC */}
      <nav 
        aria-label="Table of contents" 
        className="hidden lg:block sticky top-28 self-start w-full bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#17213D]/10 shadow-[0_10px_30px_-10px_rgba(23,33,61,0.04)]"
      >
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#17213D]/10">
          <AlignLeft size={16} className="text-[#C6A24A]" />
          <h2 className="font-serif font-bold text-sm text-[#17213D] tracking-wide uppercase">
            Contents
          </h2>
        </div>
        <ul className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 text-xs leading-relaxed text-[#566078] scrollbar-thin">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li 
                key={item.id} 
                className={`${item.level === 3 ? 'ml-3 text-[11px]' : 'font-medium'} transition-all`}
              >
                <a
                  href={`#${item.id}`}
                  className={`block py-0.5 border-l-2 pl-3 transition-all duration-200 hover:text-[#17213D] hover:border-[#C6A24A] ${
                    isActive 
                      ? 'border-[#C6A24A] text-[#17213D] font-bold bg-[#C6A24A]/5 rounded-r-md' 
                      : 'border-transparent text-[#566078]'
                  }`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
