"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowUpRight, Building2 } from 'lucide-react';
const logoImg = 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?tr=f-auto,q-80';
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
  const corridorsBadge = (navData.corridorsBadge && navData.corridorsBadge !== "Prime Corridors") ? navData.corridorsBadge : "Portfolio & Services";
  const mobileNavHeader = navData.mobileNavHeader || "Saudagar Properties";
  const mobileConsultationTitle = navData.mobileConsultationTitle || "Private Consultation";

  const sanitizeNavHref = (href) => {
    if (!href) return '#';
    if (href.includes('cyber-city') || href.includes('commercial')) return '/services/commercial';
    if (href.startsWith('/blog/location')) return '/services/residential';
    return href;
  };

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
              ? 'w-full max-w-full rounded-none py-2.5 px-4 md:px-8 border-b border-brand-navy/[0.08] shadow-[0_10px_30px_-10px_rgba(14,22,43,0.08)] ring-0'
              : 'w-full lg:w-fit lg:gap-4 xl:gap-8 rounded-full py-2 px-3 md:px-5 border border-white/90 shadow-[0_20px_45px_-8px_rgba(14,22,43,0.12),_inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-brand-navy/[0.06]'
              }`}
          >
            {/* Left: Prominent Luxury Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3.5 group select-none flex-shrink-0"
              aria-label="Saudagar Properties Home"
            >
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  width={200}
                  height={70}
                  priority
                  src={logoImg}
                  alt="Saudagar Properties"
                  className={`w-auto object-contain transition-all duration-500 ${
                    isScrolled ? 'h-9 md:h-11' : 'h-11 md:h-13'
                  }`}
                />
              </div>
              <div className="flex flex-col justify-center font-serif">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase text-brand-navy group-hover:text-brand-gold transition-colors leading-tight">
                  Saudagar
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.28em] uppercase text-brand-gold mt-0.5 leading-none">
                  Properties
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navs.map((link) => {
                const labelUpper = (link.label || '').toUpperCase();
                let isActive = false;
                if (labelUpper === 'FEATURED') {
                  isActive = pathname === '/properties' || pathname.startsWith('/properties');
                } else if (labelUpper === 'SERVICES') {
                  isActive = pathname.startsWith('/services');
                } else if (labelUpper === 'HOME') {
                  isActive = pathname === '/';
                } else if (labelUpper === 'ABOUT US') {
                  isActive = pathname === '/about' || pathname.startsWith('/about');
                } else if (labelUpper === 'OUR TEAM') {
                  isActive = pathname === '/team' || pathname.startsWith('/team');
                } else if (labelUpper === 'BLOG') {
                  isActive = pathname === '/blog' || pathname.startsWith('/blog');
                } else {
                  isActive = link.href === '/' ? pathname === '/' : (link.href ? pathname.startsWith(link.href) : false);
                }

                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`relative flex items-center gap-1 px-3 py-1.5 text-[10px] xl:text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 z-10 cursor-pointer ${
                          isActive
                            ? 'text-white'
                            : activeDropdown === link.label
                            ? 'text-brand-gold bg-brand-gold/10'
                            : 'text-brand-navy hover:text-brand-gold hover:bg-brand-ivory'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="navbarActiveIndicator"
                            className="absolute inset-0 rounded-full bg-brand-navy shadow-sm -z-10"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          />
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
                        )}
                        <span>{link.label}</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${
                            activeDropdown === link.label 
                              ? 'rotate-180 text-brand-gold' 
                              : isActive 
                              ? 'text-brand-gold' 
                              : 'opacity-70'
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
                            <div className="bg-white/98 backdrop-blur-2xl border border-brand-navy/10 rounded-2xl p-2.5 shadow-[0_20px_50px_-10px_rgba(14,22,43,0.18)] ring-1 ring-brand-navy/[0.04]">
                              <div className="px-3 pt-2 pb-1.5 border-b border-brand-navy/[0.08] mb-1.5 flex items-center justify-between">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-gold">{corridorsBadge}</span>
                                <Building2 size={13} className="text-brand-gold" />
                              </div>
                              <div className="space-y-0.5">
                                {link.dropdown.map((item) => {
                                  const isSubActive = pathname === sanitizeNavHref(item.href);
                                  return (
                                    <Link key={item.label}
                                      href={sanitizeNavHref(item.href)}
                                      className={`group flex flex-col px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                                        isSubActive
                                          ? 'bg-brand-ivory border border-brand-gold/30'
                                          : 'hover:bg-brand-ivory'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                          isSubActive ? 'text-brand-gold font-bold' : 'text-brand-navy group-hover:text-brand-gold'
                                        }`}>
                                          {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                                          <span>{item.label}</span>
                                        </span>
                                        <ArrowUpRight
                                          size={13}
                                          className={`transition-all duration-200 ${
                                            isSubActive
                                              ? 'text-brand-gold opacity-100'
                                              : 'text-brand-slate-light opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-brand-gold'
                                          }`}
                                        />
                                      </div>
                                      {item.desc && (
                                        <span className="text-[10px] text-brand-slate group-hover:text-brand-navy transition-colors mt-0.5">
                                          {item.desc}
                                        </span>
                                      )}
                                    </Link>
                                  );
                                })}
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
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] xl:text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-brand-navy hover:text-brand-gold hover:bg-brand-ivory'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbarActiveIndicator"
                        className="absolute inset-0 rounded-full bg-brand-navy shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: 3D Contact CTA & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Call Hotline (Desktop) */}
              <a
                href={`tel:${rawPhone}`}
                className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium tracking-wider text-brand-slate hover:text-brand-navy transition-colors"
                title="Call Directly"
              >
                <div className="w-6 h-6 rounded-full bg-brand-ivory border border-brand-gold/25 flex items-center justify-center text-brand-gold shadow-inner">
                  <Phone size={10} />
                </div>
                <span>{displayPhone}</span>
              </a>

              {/* 3D Tactile CTA Button */}
              <Link href={ctaHref}
                className="relative group hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold text-brand-navy-deep text-[10px] font-bold tracking-[0.16em] uppercase overflow-hidden shadow-[0_4px_14px_rgba(208, 154, 22,0.3)] hover:bg-brand-gold hover:shadow-[0_8px_22px_rgba(208, 154, 22,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10 text-brand-navy-deep font-bold">{ctaText}</span>
                <ArrowUpRight
                  size={12}
                  className="relative z-10 text-brand-navy-deep transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Link>

              {/* Mobile Phone Quick Action */}
              <a
                href={`tel:${rawPhone}`}
                className="flex sm:hidden w-9 h-9 rounded-full bg-brand-ivory items-center justify-center text-brand-navy shadow-sm border border-brand-navy/10"
                aria-label="Call Saudagar Properties"
              >
                <Phone size={14} className="text-brand-gold" />
              </a>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isMobileMenuOpen
                  ? 'bg-brand-navy text-brand-ivory shadow-md'
                  : 'bg-brand-ivory text-brand-navy hover:bg-brand-cream border border-brand-navy/10'
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
            className="fixed inset-x-3 top-20 z-40 max-h-[85vh] overflow-y-auto rounded-3xl bg-white/98 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(14,22,43,0.25)] p-6 flex flex-col ring-1 ring-brand-navy/[0.06]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-navy/[0.08]">
              <span className="text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase">Navigation</span>
              <span className="text-[10px] tracking-wider text-brand-slate">{mobileNavHeader}</span>
            </div>

            <nav className="flex flex-col divide-y divide-brand-navy/[0.06] py-2">
              {navs.map((link) => {
                const labelUpper = (link.label || '').toUpperCase();
                let isActive = false;
                if (labelUpper === 'FEATURED') {
                  isActive = pathname === '/properties' || pathname.startsWith('/properties');
                } else if (labelUpper === 'SERVICES') {
                  isActive = pathname.startsWith('/services');
                } else if (labelUpper === 'HOME') {
                  isActive = pathname === '/';
                } else if (labelUpper === 'ABOUT US') {
                  isActive = pathname === '/about' || pathname.startsWith('/about');
                } else if (labelUpper === 'OUR TEAM') {
                  isActive = pathname === '/team' || pathname.startsWith('/team');
                } else if (labelUpper === 'BLOG') {
                  isActive = pathname === '/blog' || pathname.startsWith('/blog');
                } else {
                  isActive = link.href === '/' ? pathname === '/' : (link.href ? pathname.startsWith(link.href) : false);
                }

                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div key={link.label} className="py-2.5">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className={`w-full flex items-center justify-between text-xs font-bold tracking-[0.12em] uppercase rounded-xl px-2.5 py-1.5 transition-colors ${
                          isActive ? 'text-brand-gold bg-brand-navy' : 'text-brand-navy'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                          <span>{link.label}</span>
                        </span>
                        <ChevronDown
                          size={15}
                          className={`text-brand-gold transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mt-2.5 pl-3 space-y-1.5 border-l-2 border-brand-gold/40"
                          >
                            {link.dropdown.map((sub) => {
                              const isSubActive = pathname === sanitizeNavHref(sub.href);
                              return (
                                <Link key={sub.label}
                                  href={sanitizeNavHref(sub.href)}
                                  className={`block py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                                    isSubActive
                                      ? 'text-brand-gold font-bold bg-brand-navy/5'
                                      : 'text-brand-slate hover:text-brand-gold'
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link key={link.label}
                    href={link.href}
                    className={`py-2.5 px-2.5 rounded-xl text-xs font-bold tracking-[0.12em] uppercase transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'text-brand-navy hover:text-brand-gold'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                      <span>{link.label}</span>
                    </span>
                    <ArrowUpRight size={13} className={isActive ? 'text-brand-gold' : 'text-slate-400'} />
                  </Link>
                );
              })}

              <Link href={ctaHref}
                className="py-3 px-2.5 text-xs font-bold tracking-[0.12em] text-brand-gold uppercase hover:text-brand-navy transition-colors flex items-center justify-between"
              >
                <span>{ctaText.toUpperCase()}</span>
                <ArrowUpRight size={14} className="text-brand-gold" />
              </Link>
            </nav>

            {/* Quick Contact Footnote */}
            <div className="mt-4 pt-4 border-t border-brand-navy/[0.08] flex flex-col gap-3 bg-brand-ivory -mx-6 -mb-6 p-6 rounded-b-3xl">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-slate">{mobileConsultationTitle}</span>
              <a
                href={`tel:${rawPhone}`}
                className="flex items-center gap-3 text-sm font-semibold text-brand-navy"
              >
                <div className="w-8 h-8 rounded-full bg-brand-navy text-brand-ivory flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <div>
                  <div className="text-[10px] text-brand-slate uppercase">Call Direct</div>
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


