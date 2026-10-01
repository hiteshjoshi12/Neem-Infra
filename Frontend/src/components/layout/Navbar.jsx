import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowUpRight, Building2 } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useCms } from '../../context/CmsContext';

export default function Navbar() {
  const { sections } = useCms();
  const navData = sections?.navbar || {};
  const navLinks = navData.links || [];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownTimerRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
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
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'pt-0 px-0' : 'pt-3 md:pt-5 px-3 md:px-8'
          }`}
      >
        <div className="w-full flex justify-center pointer-events-auto">
          <div
            className={`relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/95 backdrop-blur-xl ${isScrolled
                ? 'w-full max-w-full rounded-none py-3 px-6 md:px-12 border-b border-black/[0.06] shadow-[0_10px_30px_-10px_rgba(20,25,35,0.08)] ring-0'
                : 'w-full max-w-5xl xl:max-w-6xl rounded-full py-2.5 px-5 md:px-7 border border-white/80 shadow-[0_20px_45px_-8px_rgba(20,25,35,0.1),_0_8px_20px_-4px_rgba(0,0,0,0.03),_inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.04]'
              }`}
          >
            {/* Left: Clean Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group relative select-none flex-shrink-0"
              aria-label="Saudagar Properties Home"
            >
              <img
                src={navData.logoUrl || logo}
                alt="Saudagar Properties"
                className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-9 md:h-11' : 'h-11 md:h-13'
                  }`}
              />
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;

                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 ${activeDropdown === link.label
                          ? 'text-[#B5986D] bg-[#B5986D]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]'
                          : 'text-[#1D263B] hover:text-[#B5986D] hover:bg-neutral-100/60'
                          }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#B5986D]' : 'opacity-70'
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
                            <div className="bg-white/98 backdrop-blur-2xl border border-[#EFECE6] rounded-2xl p-2.5 shadow-[0_20px_50px_-10px_rgba(20,25,35,0.18),_0_1px_2px_rgba(0,0,0,0.06),_inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-black/[0.03]">
                              <div className="px-3 pt-2 pb-1.5 border-b border-[#F4F1EA] mb-1.5 flex items-center justify-between">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#A89069]">{corridorsBadge}</span>
                                <Building2 size={13} className="text-[#A89069]" />
                              </div>
                              <div className="space-y-0.5">
                                {link.dropdown.map((item) => (
                                  <Link
                                    key={item.label}
                                    to={item.href}
                                    className="group flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-[#F9F8F5] transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-[#1D263B] group-hover:text-[#B5986D] transition-colors">
                                        {item.label}
                                      </span>
                                      <ArrowUpRight
                                        size={13}
                                        className="text-[#999] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#B5986D] transition-all duration-200"
                                      />
                                    </div>
                                    {item.desc && (
                                      <span className="text-[10px] text-[#7E8590] group-hover:text-[#5F6570] transition-colors mt-0.5">
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
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative px-3.5 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 ${isActive
                      ? 'text-[#1D263B] bg-[#F4F1EA]/80 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-[#1D263B] hover:text-[#B5986D] hover:bg-neutral-100/60'
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#B5986D] rounded-full"
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
                className="hidden xl:flex items-center gap-2 px-3 py-2 text-[11px] font-medium tracking-wider text-[#666] hover:text-[#1D263B] transition-colors"
                title="Call Directly"
              >
                <div className="w-7 h-7 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#B5986D] shadow-inner">
                  <Phone size={12} />
                </div>
                <span>{displayPhone}</span>
              </a>

              {/* 3D Tactile CTA Button */}
              <Link
                to={ctaHref}
                className="relative group hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D263B] text-white text-[11px] font-semibold tracking-[0.16em] uppercase overflow-hidden shadow-[0_4px_14px_rgba(29,38,59,0.25),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_22px_rgba(29,38,59,0.35),_inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(29,38,59,0.25)] transition-all duration-300"
              >
                <span className="relative z-10 text-white">{ctaText}</span>
                <ArrowUpRight
                  size={14}
                  className="relative z-10 text-[#C5A880] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Link>

              {/* Mobile Phone Quick Action */}
              <a
                href={`tel:${rawPhone}`}
                className="flex sm:hidden w-9 h-9 rounded-full bg-[#F4F1EA] items-center justify-center text-[#1D263B] shadow-sm border border-[#E8E4DA]"
                aria-label="Call Saudagar Properties"
              >
                <Phone size={14} className="text-[#B5986D]" />
              </a>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isMobileMenuOpen
                  ? 'bg-[#1D263B] text-white shadow-md'
                  : 'bg-[#F4F1EA] text-[#1D263B] hover:bg-[#EAE5DA] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_6px_rgba(0,0,0,0.06)]'
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
            className="fixed inset-x-3 top-20 z-40 max-h-[85vh] overflow-y-auto rounded-3xl bg-white/98 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(20,25,35,0.25)] p-6 flex flex-col ring-1 ring-black/[0.05]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#B5986D] uppercase">Navigation</span>
              <span className="text-[10px] tracking-wider text-[#888]">{mobileNavHeader}</span>
            </div>

            <nav className="flex flex-col divide-y divide-[#F5F2EA] py-2">
              {navLinks.map((link) => {
                if (link.dropdown && link.dropdown.length > 0) {
                  return (
                    <div key={link.label} className="py-3">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold tracking-[0.12em] text-[#1D263B] uppercase"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={16}
                          className={`text-[#B5986D] transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''
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
                            className="overflow-hidden mt-3 pl-3 space-y-2 border-l-2 border-[#B5986D]/30"
                          >
                            {link.dropdown.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                className="block py-1.5 text-xs text-[#555] hover:text-[#B5986D] transition-colors"
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
                  <Link
                    key={link.label}
                    to={link.href}
                    className="py-3 text-sm font-semibold tracking-[0.12em] text-[#1D263B] uppercase hover:text-[#B5986D] transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={14} className="text-[#CCC]" />
                  </Link>
                );
              })}

              <Link
                to={ctaHref}
                className="py-3 text-sm font-semibold tracking-[0.12em] text-[#B5986D] uppercase hover:text-[#1D263B] transition-colors flex items-center justify-between"
              >
                <span>{ctaText.toUpperCase()}</span>
                <ArrowUpRight size={14} className="text-[#B5986D]" />
              </Link>
            </nav>

            {/* Quick Contact Footnote */}
            <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex flex-col gap-3 bg-[#FAF8F5] -mx-6 -mb-6 p-6 rounded-b-3xl">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#888]">{mobileConsultationTitle}</span>
              <a
                href={`tel:${rawPhone}`}
                className="flex items-center gap-3 text-sm font-semibold text-[#1D263B]"
              >
                <div className="w-8 h-8 rounded-full bg-[#1D263B] text-white flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <div>
                  <div className="text-[10px] text-[#999] uppercase">Call Direct</div>
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


