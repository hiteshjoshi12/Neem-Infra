"use client";
import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa6';
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from 'lucide-react';

const logoImg = 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?tr=f-auto,q-80';
import { useCms } from '../../context/CmsContext';
import Image from 'next/image';

const SOCIAL_ICONS_MAP = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  pinterest: FaPinterestP,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

export default function Footer() {
  const { sections } = useCms();
  const footerData = sections?.footer || {};

  const officeTitle = footerData.officeTitle;
  const officeName = footerData.officeName;
  const officeAddress = footerData.officeAddress;

  const phoneTitle = footerData.phoneTitle;
  const phoneSubtitle = footerData.phoneSubtitle;
  const phones = (footerData.phones && Array.isArray(footerData.phones) && footerData.phones.length > 0) ? footerData.phones : [];

  const emailTitle = footerData.emailTitle;
  const emailSubtitle = footerData.emailSubtitle;
  const email = footerData.email;

  const aboutText = footerData.aboutText;

  const menuTitle = footerData.menuTitle || 'Menu';

  const menuLinks = footerData.menuLinks || [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Featured Property', href: '/#featured' },
    { label: 'Our Team', href: '/team' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const rawServicesTitle = footerData.servicesTitle;
  const isCombinedTitle = !rawServicesTitle || rawServicesTitle === 'Portfolio & Services' || rawServicesTitle === 'Locations';

  const portfolioTitle = footerData.portfolioTitle || (isCombinedTitle ? 'Portfolio' : rawServicesTitle);
  const advisoryTitle = footerData.advisoryTitle || footerData.servicesHeading || 'Services & Advisory';

  const defaultPortfolioLinks = [
    { label: 'DLF Phase 1 Floors & Plots', href: '/property/dlf-phase-1' },
    { label: 'DLF Phase 2 Luxury Kothis', href: '/property/dlf-phase-2' },
    { label: 'DLF Phase 3 Builder Floors', href: '/property/dlf-phase-3' },
    { label: 'DLF Phase 4 Prime Residences', href: '/property/dlf-phase-4' },
    { label: 'Sushant Lok 1 Portfolio', href: '/property/shushant-lok' },
    { label: 'Udyog Vihar Industrial Plots', href: '/property/udyog-vihar' },
  ];

  const defaultAdvisoryLinks = [
    { label: 'Residential Advisory', href: '/services/residential' },
    { label: 'Commercial Real Estate', href: '/services/commercial' },
    { label: 'Industrial & Warehousing', href: '/services/industrial' },
    { label: 'Vetted Property Catalog', href: '/properties' },
    { label: 'Market Research & Blog', href: '/blog' },
    { label: 'Corporate Desk', href: '/contact' },
  ];

  const defaultServiceLinks = [
    ...defaultPortfolioLinks,
    ...defaultAdvisoryLinks,
  ];

  const rawServiceLinks = Array.isArray(footerData.servicesLinks) && footerData.servicesLinks.length > 0
    ? footerData.servicesLinks.filter(l => !l.href?.includes('/blog/location'))
    : [];

  // Guarantee that all 6 prime corridors and key services are ALWAYS present in footer navigation
  const seenHrefs = new Set();
  const allServiceLinks = [];
  for (const item of [...defaultServiceLinks, ...rawServiceLinks]) {
    if (item?.href && !seenHrefs.has(item.href)) {
      seenHrefs.add(item.href);
      allServiceLinks.push(item);
    }
  }

  // Partition links at "Residential Advisory" into Portfolio and Advisory columns
  const splitIndex = allServiceLinks.findIndex(
    (item) =>
      item.label?.toLowerCase().includes('residential advisory') ||
      item.href?.includes('/services/residential')
  );

  const isCorridorOrProperty = (item) =>
    item.href?.startsWith('/property') ||
    item.label?.toLowerCase().includes('dlf') ||
    item.label?.toLowerCase().includes('sushant') ||
    item.label?.toLowerCase().includes('plots') ||
    item.label?.toLowerCase().includes('kothis') ||
    item.label?.toLowerCase().includes('floors');

  const portfolioLinks = splitIndex !== -1
    ? allServiceLinks.slice(0, splitIndex)
    : allServiceLinks.filter(isCorridorOrProperty);

  const advisoryLinks = splitIndex !== -1
    ? allServiceLinks.slice(splitIndex)
    : allServiceLinks.filter((item) => !isCorridorOrProperty(item));

  const followTitle = footerData.followTitle;

  const followDesc = footerData.followDesc;

  const callCtaText = footerData.callCtaText;
  const callCtaPhone = footerData.callCtaPhone;

  const rawSocials = footerData.socialLinks || [
    { platform: 'Facebook', href: '#' },
    { platform: 'Instagram', href: '#' },
    { platform: 'Pinterest', href: '#' },
    { platform: 'LinkedIn', href: '#' },
    { platform: 'YouTube', href: '#' },
  ];

  const copyright = footerData.copyright;
  const copyrightSuffix = footerData.copyrightSuffix;

  const rawLegalLinks = footerData.legalLinks || [
    { label: 'Clients', href: '/about' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ];

  // Strictly filter out any admin links from public rendering to prevent crawler indexing
  const legalLinks = rawLegalLinks.filter(
    (l) => !l.href?.startsWith('/admin')
  );

  return (
    <footer
      className="relative overflow-hidden bg-brand-ivory-warm text-brand-navy border-t border-brand-navy/10"
      aria-label="Saudagar Properties footer"
    >
      {/* =====================================================
          SUBTLE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(var(--color-brand-navy)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-navy)_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-brand-gold/[0.06] blur-[110px]" />

        <div className="absolute -bottom-40 left-1/3 h-[350px] w-[350px] rounded-full bg-brand-gold/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            TOP CONTACT BAR
        ====================================================== */}

        <div className="border-b border-brand-navy/10 py-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-0">

            {/* Office */}
            <div className="flex items-start gap-3 md:border-r md:border-brand-navy/10 md:pr-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-brand-gold/30 bg-white text-brand-gold shadow-xs">
                <MapPin size={15} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
                  {officeTitle}
                </p>

                <p className="mt-1 text-sm font-bold text-black">
                  {officeName}
                </p>

                <address className="mt-0.5 max-w-xs not-italic text-xs leading-5 text-black font-medium">
                  {officeAddress}
                </address>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 md:px-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-brand-gold/30 bg-white text-brand-gold shadow-xs">
                <Phone size={14} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
                  {phoneTitle}
                </p>

                <p className="mt-1 text-sm font-bold text-black">
                  {phoneSubtitle}
                </p>

                <div className="mt-0.5 flex flex-wrap gap-x-3">
                  {phones.map((item, idx) => (
                    <a
                      key={idx}
                      href={
                        item.href ||
                        `tel:${item.number.replace(/\s+/g, '')}`
                      }
                      className="text-xs font-bold text-black transition-colors hover:text-brand-gold"
                    >
                      {item.number}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 md:border-l md:border-brand-navy/10 md:pl-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-brand-gold/30 bg-white text-brand-gold shadow-xs">
                <Mail size={14} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
                  {emailTitle}
                </p>

                <p className="mt-1 text-sm font-bold text-black">
                  {emailSubtitle}
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-0.5 block truncate text-xs font-bold text-black transition-colors hover:text-brand-gold"
                >
                  {email}
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">

          {/* BRAND */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 lg:pr-8">

            <Link
              href="/"
              aria-label="Saudagar Properties home"
              className="inline-flex items-center gap-3.5 group select-none"
            >
              <div className="rounded-2xl bg-white px-4 py-3 shadow-md border border-brand-gold/30 transition-transform duration-300 group-hover:scale-105">
                <Image
                  width={220}
                  height={80}
                  loading="lazy"
                  src={footerData.logoUrl || logoImg}
                  alt={footerData?.logoAlt || "Saudagar Properties"}
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col font-serif">
                <span className="text-lg sm:text-xl font-bold tracking-wider uppercase text-black group-hover:text-brand-gold transition-colors leading-tight">
                  Saudagar
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-brand-gold-deep mt-0.5 leading-none">
                  Properties
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mt-1">
                  DLF Gurugram Premier Advisory
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-xs leading-5 text-black font-medium">
              {aboutText}
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {rawSocials.map((social, idx) => {
                const key = (social.platform || '').toLowerCase();
                const IconComponent =
                  SOCIAL_ICONS_MAP[key] || FaFacebookF;

                return (
                  <a
                    key={idx}
                    href={social.href || '#'}
                    aria-label={social.platform || 'Social Link'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-navy/20 bg-white text-black shadow-xs transition-all hover:border-brand-gold hover:bg-brand-gold hover:text-white"
                  >
                    <IconComponent size={11} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* EXPLORE / MENU */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
              {menuTitle}
            </h2>

            <ul className="space-y-2.5">
              {menuLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-black transition-colors hover:text-brand-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PORTFOLIO (PRIME CORRIDORS) */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
              {portfolioTitle}
            </h2>

            <ul className="space-y-2.5">
              {portfolioLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-black transition-colors hover:text-brand-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES & ADVISORY */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
              {advisoryTitle}
            </h2>

            <ul className="space-y-2.5">
              {advisoryLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-black transition-colors hover:text-brand-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PRIVATE ADVISORY */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold-deep">
              {followTitle}
            </h2>

            <p className="text-xs leading-5 text-black font-medium">
              {followDesc}
            </p>

            <a
              href={`tel:${callCtaPhone.replace(/\s+/g, '')}`}
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold hover:bg-brand-gold-light px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-navy shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Phone size={12} />

              <span>{callCtaText}</span>

              <ArrowUpRight
                size={12}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="flex flex-col gap-3 border-t border-brand-navy/15 py-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[11px] font-medium text-black">
            {copyright} {new Date().getFullYear()}, {copyrightSuffix}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                <Link href={item.href}
                  className="text-[11px] font-medium text-black transition-colors hover:text-brand-gold"
                >
                  {item.label}
                </Link>

                {idx < legalLinks.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-black/40" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}