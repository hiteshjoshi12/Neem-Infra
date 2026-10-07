"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowUpRight, Building2 } from 'lucide-react';
const logoImg = '/logo.png';
import { useCms } from '../../context/CmsContext';
import Image from 'next/image';

export default function Navbar() {
  const { sections } = useCms();
  const navData = sections?.navbar || {};
  const navs = navData.links || [];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const dropdownTimerRef = useRef(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const next = window.scrollY > 25;
          setIsScrolled((prev) => (prev !== next ? next : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const displayPhone = navData.phone || "+91 98112 21207";
  const rawPhone = navData.phoneRaw || displayPhone.replace(/\s+/g, '');
  const ctaText = navData.ctaText || "Contact Us";
  const ctaHref = navData.ctaHref || "/contact";
  const corridorsBadge = navData.corridorsBadge || "Prime Corridors";
  const mobileNavHeader = navData.mobileNavHeader || "Saudagar Properties";
  const mobileConsultationTitle = navData.mobileConsultationTitle || "Private Consultation";

  return (
    <>
      {/* Morphing Navbar Container: Floating 3D Capsule at top -> Modern Sticky Header on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'pt-0 px-0' : 'pt-2 md:pt-3 px-3 md:px-6'
          }`}
      >
        <div className="w-full flex justify-center pointer-events-auto">
          <div
            className={`relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/95 backdrop-blur-xl ${isScrolled
              ? 'w-full max-w-full rounded-none py-2.5 px-4 md:px-8 border-b border-[#17213D]/[0.08] shadow-[0_10px_30px_-10px_rgba(14,22,43,0.08)] ring-0'
              : 'w-full lg:w-fit lg:gap-4 xl:gap-8 rounded-full py-2 px-3 md:px-5 border border-white/90 shadow-[0_20px_45px_-8px_rgba(14,22,43,0.12),_inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-[#17213D]/[0.06]'
              }`}
          >
            {/* Left: Clean Brand Logo */}
            <Link href="/"
              className="flex items-center gap-3 group relative select-none flex-shrink-0"
              aria-label="Saudagar Properties Home"
            >
              <Image
                width={160}
                height={44}
                priority
                src={logoImg}
                alt="Saudagar Properties"
                className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-7 md:h-8' : 'h-9 md:h-10'
                  }`}
              />
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navs.map((link) => {
                const isActive = pathname === link.href;

                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] xl:text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 ${activeDropdown === link.label
                          ? 'text-[#D09A16] bg-[#D09A16]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]'
                          : 'text-[#17213D] hover:text-[#D09A16] hover:bg-[#F7F5EF]'
                          }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#D09A16]' : 'opacity-70'
                            }`}
                        />
                      </button>

                      {/* 3D Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-0 top-[calc(100%+8px)] w-80 z-50 pt-1"
                          >
                            <div className="bg-white/98 backdrop-blur-2xl border border-[#17213D]/10 rounded-2xl p-2.5 shadow-[0_20px_50px_-10px_rgba(14,22,43,0.18)] ring-1 ring-[#17213D]/[0.04]">
                              <div className="px-3 pt-2 pb-1.5 border-b border-[#17213D]/[0.08] mb-1.5 flex items-center justify-between">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#D09A16]">{corridorsBadge}</span>
                                <Building2 size={13} className="text-[#D09A16]" />
                              </div>
                              <div className="space-y-0.5">
                                {link.dropdown.map((item) => (
                                  <Link key={item.label}
                                    href={item.href}
                                    className="group flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#F7F5EF] transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                                        {item.label}
                                      </span>
                                      <ArrowUpRight
                                        size={13}
                                        className="text-[#999] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#D09A16] transition-all duration-200"
                                      />
                                    </div>
                                    {item.desc && (
                                      <span className="text-[10px] text-[#566078] group-hover:text-[#17213D] transition-colors mt-0.5">
                                        {item.desc}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={link.label}
                    href={link.href}
                    className={`relative px-2.5 py-1.5 text-[10px] xl:text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 ${isActive
                      ? 'text-[#17213D] bg-[#F7F5EF] font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-[#17213D] hover:text-[#D09A16] hover:bg-[#F7F5EF]'
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#D09A16] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: 3D Contact CTA & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Call Hotline (Desktop) */}
              <a
                href={`tel:${rawPhone}`}
                className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium tracking-wider text-[#566078] hover:text-[#17213D] transition-colors"
                title="Call Directly"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7F5EF] border border-[#D09A16]/25 flex items-center justify-center text-[#D09A16] shadow-inner">
                  <Phone size={10} />
                </div>
                <span>{displayPhone}</span>
              </a>

              {/* 3D Tactile CTA Button */}
              <Link href={ctaHref}
                className="relative group hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D09A16] text-[#0E162B] text-[10px] font-bold tracking-[0.16em] uppercase overflow-hidden shadow-[0_4px_14px_rgba(208, 154, 22,0.3)] hover:bg-[#D09A16] hover:shadow-[0_8px_22px_rgba(208, 154, 22,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10 text-[#0E162B] font-bold">{ctaText}</span>
                <ArrowUpRight
                  size={12}
                  className="relative z-10 text-[#0E162B] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Link>

              {/* Mobile Phone Quick Action */}
              <a
                href={`tel:${rawPhone}`}
                className="flex sm:hidden w-9 h-9 rounded-full bg-[#F7F5EF] items-center justify-center text-[#17213D] shadow-sm border border-[#17213D]/10"
                aria-label="Call Saudagar Properties"
              >
                <Phone size={14} className="text-[#D09A16]" />
              </a>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isMobileMenuOpen
                  ? 'bg-[#17213D] text-[#F7F5EF] shadow-md'
                  : 'bg-[#F7F5EF] text-[#17213D] hover:bg-[#EFEBE1] border border-[#17213D]/10'
                  }`}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Luxury Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-20 z-40 max-h-[85vh] overflow-y-auto rounded-3xl bg-white/98 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(14,22,43,0.25)] p-6 flex flex-col ring-1 ring-[#17213D]/[0.06]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#17213D]/[0.08]">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#D09A16] uppercase">Navigation</span>
              <span className="text-[10px] tracking-wider text-[#566078]">{mobileNavHeader}</span>
            </div>

            <nav className="flex flex-col divide-y divide-[#17213D]/[0.06] py-2">
              {navs.map((link) => {
                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div key={link.label} className="py-3">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold tracking-[0.12em] text-[#17213D] uppercase"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={16}
                          className={`text-[#D09A16] transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mt-3 pl-3 space-y-2 border-l-2 border-[#D09A16]/40"
                          >
                            {link.dropdown.map((sub) => (
                              <Link key={sub.label}
                                href={sub.href}
                                className="block py-1.5 text-xs text-[#566078] hover:text-[#D09A16] transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={link.label}
                    href={link.href}
                    className="py-3 text-sm font-semibold tracking-[0.12em] text-[#17213D] uppercase hover:text-[#D09A16] transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={14} className="text-[#D09A16]/50" />
                  </Link>
                );
              })}

              <Link href={ctaHref}
                className="py-3 text-sm font-semibold tracking-[0.12em] text-[#D09A16] uppercase hover:text-[#17213D] transition-colors flex items-center justify-between"
              >
                <span>{ctaText.toUpperCase()}</span>
                <ArrowUpRight size={14} className="text-[#D09A16]" />
              </Link>
            </nav>

            {/* Quick Contact Footnote */}
            <div className="mt-4 pt-4 border-t border-[#17213D]/[0.08] flex flex-col gap-3 bg-[#F7F5EF] -mx-6 -mb-6 p-6 rounded-b-3xl">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#566078]">{mobileConsultationTitle}</span>
              <a
                href={`tel:${rawPhone}`}
                className="flex items-center gap-3 text-sm font-semibold text-[#17213D]"
              >
                <div className="w-8 h-8 rounded-full bg-[#17213D] text-[#F7F5EF] flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <div>
                  <div className="text-[10px] text-[#566078] uppercase">Call Direct</div>
                  <div className="text-sm font-medium tracking-wide">{displayPhone}</div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


