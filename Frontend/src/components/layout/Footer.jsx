import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa6';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useCms } from '../../context/CmsContext';

const SOCIAL_ICONS_MAP = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  pinterest: FaPinterestP,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube
};

export default function Footer() {
  const { sections } = useCms();
  const footerData = sections?.footer || {};

  const officeTitle = footerData.officeTitle || "Corporate Office";
  const officeName = footerData.officeName || "Address";
  const officeAddress = footerData.officeAddress || "38, Akashneem Marg, DLF-II, Gurgaon-122002";

  const phoneTitle = footerData.phoneTitle || "Direct Line";
  const phoneSubtitle = footerData.phoneSubtitle || "Phone No";
  const phones = footerData.phones || [
    { number: "+91 97185 11207", label: "(IND)", href: "tel:+919718511207" },
    { number: "+91 98112 21207", label: "(IND)", href: "tel:+919811221207" }
  ];

  const emailTitle = footerData.emailTitle || "Confidential Desk";
  const emailSubtitle = footerData.emailSubtitle || "Email";
  const email = footerData.email || "Saudagar.Properties@Yahoo.In";

  const aboutText = footerData.aboutText || "Saudagar Properties helps clients— both families and corporates to find their dream home or commercial space that lives up to their needs and promises a high Return on Investment. Keeping customer satisfaction on top priority, we're highly trusted by our clients which has helped us to be the leaders and the best property dealers in Gurgaon.";

  const menuTitle = footerData.menuTitle || "Menu";
  const menuLinks = footerData.menuLinks || [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Featured Property", href: "/#featured" },
    { label: "Our Team", href: "/about" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact Us", href: "/contact" }
  ];

  const servicesTitle = footerData.servicesTitle || "Services";
  const serviceLinks = footerData.servicesLinks || [
    { label: "Property DLF Phase 1", href: "/services/dlf-phase-1" },
    { label: "Property DLF Phase 2", href: "/services/dlf-phase-2" },
    { label: "Property DLF Phase 3", href: "/services/dlf-phase-3" },
    { label: "Property DLF Phase 4", href: "/services/dlf-phase-4" },
    { label: "Property In Sushant Lok", href: "/services/sushant-lok" },
    { label: "Property In Udyog Vihar", href: "/services/udyog-vihar" }
  ];

  const followTitle = footerData.followTitle || "Follow Us";
  const followDesc = footerData.followDesc || "Connect with our senior partners for off-market builder floors & confidential acquisitions.";
  const callCtaText = footerData.callCtaText || "Call Now";
  const callCtaPhone = footerData.callCtaPhone || "+919718511207";

  const rawSocials = footerData.socialLinks || [
    { platform: "Facebook", href: "#" },
    { platform: "Instagram", href: "#" },
    { platform: "Pinterest", href: "#" },
    { platform: "LinkedIn", href: "#" },
    { platform: "YouTube", href: "#" }
  ];

  const copyright = footerData.copyright || "Copyright © Saudagar Properties";
  const copyrightSuffix = footerData.copyrightSuffix || "All Right Reserved";
  const legalLinks = footerData.legalLinks || [
    { label: "Clients", href: "/clients" },
    { label: "Term Of Service", href: "/terms" },
    { label: "Privacy & Policy", href: "/privacy-policy" }
  ];

  return (
    <footer className="relative w-full bg-[#111622] text-[#E2E8F0] pt-20 pb-10 overflow-hidden border-t border-[#C5A880]/20">

      {/* Background Architectural Ambient Lighting */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-slate-800/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ================= 1. PREMIUM 3D CONTACT CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-18">

          {/* Card 1: Address */}
          <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 sm:p-7 hover:border-[#C5A880]/60 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A880] group-hover:text-[#111622] transition-all duration-300 shadow-sm">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-widest block">
                  {officeTitle}
                </span>
                <h5 className="text-base font-serif font-bold text-white">
                  {officeName}
                </h5>
                <p className="text-xs sm:text-sm text-[#E2E8F0] font-light leading-relaxed">
                  {officeAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 sm:p-7 hover:border-[#C5A880]/60 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A880] group-hover:text-[#111622] transition-all duration-300 shadow-sm">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-widest block">
                  {phoneTitle}
                </span>
                <h5 className="text-base font-serif font-bold text-white">
                  {phoneSubtitle}
                </h5>
                <div className="text-xs sm:text-sm text-[#E2E8F0] font-light flex flex-col gap-0.5">
                  {phones.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href || `tel:${item.number.replace(/\s+/g, '')}`}
                      className="hover:text-[#C5A880] transition-colors"
                    >
                      {item.number} {item.label && <span className="text-[10px] text-[#C5A880]">{item.label}</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 sm:p-7 hover:border-[#C5A880]/60 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A880] group-hover:text-[#111622] transition-all duration-300 shadow-sm">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-widest block">
                  {emailTitle}
                </span>
                <h5 className="text-base font-serif font-bold text-white">
                  {emailSubtitle}
                </h5>
                <a
                  href={`mailto:${email}`}
                  className="text-xs sm:text-sm text-[#E2E8F0] font-light hover:text-[#C5A880] transition-colors block truncate"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Subtle Horizontal Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent mb-16" />

        {/* ================= 2. MAIN 4-COLUMN LUXURY GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">

          {/* Column 1: Brand & Legacy (5 Cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-6">
            <Link to="/" className="inline-block mb-6 group">
              <div className="p-3 sm:p-4 rounded-xl bg-white/95 border border-[#C5A880]/30 shadow-[0_8px_20px_rgba(0,0,0,0.5)] inline-block group-hover:border-[#C5A880] transition-colors">
                <img
                  src={footerData.logoUrl || logoImg}
                  alt="Saudagar Properties Pvt Ltd"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-[#E2E8F0] text-sm font-light leading-relaxed mb-6">
              {aboutText}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {rawSocials.map((social, idx) => {
                const key = (social.platform || '').toLowerCase();
                const IconComponent = SOCIAL_ICONS_MAP[key] || FaFacebookF;
                return (
                  <a
                    key={idx}
                    href={social.href || '#'}
                    aria-label={social.platform || 'Social Link'}
                    className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#C5A880] hover:bg-[#C5A880] text-[#CBD5E1] hover:text-[#111622] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                  >
                    <IconComponent size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Menu (2 Cols on lg) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 h-[1.5px] bg-[#C5A880]" />
              <h4 className="text-base font-serif font-bold text-white tracking-wide">
                {menuTitle}
              </h4>
            </div>
            <ul className="space-y-3.5">
              {menuLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-[#E2E8F0] hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/60 group-hover:bg-[#C5A880] group-hover:scale-125 transition-all" />
                    <span className="font-light">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (3 Cols on lg) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 h-[1.5px] bg-[#C5A880]" />
              <h4 className="text-base font-serif font-bold text-white tracking-wide">
                {servicesTitle}
              </h4>
            </div>
            <ul className="space-y-3.5">
              {serviceLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-[#E2E8F0] hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/60 group-hover:bg-[#C5A880] group-hover:scale-125 transition-all" />
                    <span className="font-light">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Private Consultation & Call Now (2 Cols on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-4 h-[1.5px] bg-[#C5A880]" />
                <h4 className="text-base font-serif font-bold text-white tracking-wide">
                  {followTitle}
                </h4>
              </div>

              <p className="text-xs text-[#E2E8F0] font-light leading-relaxed mb-6">
                {followDesc}
              </p>
            </div>

            {/* Premium Gold Button */}
            <a
              href={`tel:${callCtaPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#C5A880] to-[#E2CEB1] text-[#111622] font-semibold text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300 shadow-[0_10px_25px_rgba(197,168,128,0.3)] active:scale-95 group"
            >
              <Phone size={14} className="text-[#111622] group-hover:rotate-12 transition-transform" />
              <span>{callCtaText}</span>
              <ArrowUpRight size={14} className="text-[#111622] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

        {/* ================= 3. BOTTOM COPYRIGHT & LEGAL STRIP ================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1]">

          <p className="font-light text-center sm:text-left">
            {copyright} {new Date().getFullYear()}, {copyrightSuffix}
          </p>

          <div className="flex items-center gap-6 font-light">
            {legalLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="w-1 h-1 rounded-full bg-slate-700" />}
                <Link to={item.href} className="hover:text-[#C5A880] transition-colors">
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

        </div>

      </div>

    </footer>
  );
}