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

const logoImg = '/logo.png';
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

  const officeTitle = footerData.officeTitle || 'Corporate Office';
  const officeName = footerData.officeName || 'Saudagar Properties';
  const officeAddress =
    footerData.officeAddress ||
    '38, Akashneem Marg, DLF-II, Gurgaon-122002';

  const phoneTitle = footerData.phoneTitle || 'Direct Line';
  const phoneSubtitle = footerData.phoneSubtitle || 'Phone';
  const phones = footerData.phones || [
    {
      number: '+91 97185 11207',
      label: '(IND)',
      href: 'tel:+919718511207',
    },
    {
      number: '+91 98112 21207',
      label: '(IND)',
      href: 'tel:+919811221207',
    },
  ];

  const emailTitle = footerData.emailTitle || 'Confidential Desk';
  const emailSubtitle = footerData.emailSubtitle || 'Email';
  const email =
    footerData.email || 'Saudagar.Properties@Yahoo.In';

  const aboutText =
    footerData.aboutText ||
    "Saudagar Properties helps clients— both families and corporates to find their dream home or commercial space that lives up to their needs and promises a high Return on Investment. Keeping customer satisfaction on top priority, we're highly trusted by our clients which has helped us to be the leaders and the best property dealers in Gurgaon.";

  const menuTitle = footerData.menuTitle || 'Explore';

  const menuLinks = footerData.menuLinks || [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Featured Property', href: '/#featured' },
    { label: 'Our Team', href: '/about' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const servicesTitle = footerData.servicesTitle || 'Locations';

  const serviceLinks = footerData.servicesLinks || [
    { label: 'Property DLF Phase 1', href: '/services/dlf-phase-1' },
    { label: 'Property DLF Phase 2', href: '/services/dlf-phase-2' },
    { label: 'Property DLF Phase 3', href: '/services/dlf-phase-3' },
    { label: 'Property DLF Phase 4', href: '/services/dlf-phase-4' },
    { label: 'Property In Sushant Lok', href: '/services/sushant-lok' },
    { label: 'Property In Udyog Vihar', href: '/services/udyog-vihar' },
  ];

  const followTitle = footerData.followTitle || 'Private Advisory';

  const followDesc =
    footerData.followDesc ||
    'Connect with our senior partners for off-market builder floors and confidential acquisitions.';

  const callCtaText = footerData.callCtaText || 'Speak With Us';
  const callCtaPhone =
    footerData.callCtaPhone || '+919718511207';

  const rawSocials = footerData.socialLinks || [
    { platform: 'Facebook', href: '#' },
    { platform: 'Instagram', href: '#' },
    { platform: 'Pinterest', href: '#' },
    { platform: 'LinkedIn', href: '#' },
    { platform: 'YouTube', href: '#' },
  ];

  const copyright =
    footerData.copyright || 'Copyright © Saudagar Properties';

  const copyrightSuffix =
    footerData.copyrightSuffix || 'All Right Reserved';

  const legalLinks = footerData.legalLinks || [
    { label: 'Clients', href: '/clients' },
    { label: 'Term Of Service', href: '/terms' },
    { label: 'Privacy & Policy', href: '/privacy-policy' },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-[#0E162B] text-[#F7F5EF]"
      aria-label="Saudagar Properties footer"
    >
      {/* =====================================================
          SUBTLE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(#C6A24A_1px,transparent_1px),linear-gradient(90deg,#C6A24A_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#C6A24A]/[0.045] blur-[110px]" />

        <div className="absolute -bottom-40 left-1/3 h-[350px] w-[350px] rounded-full bg-black/40 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            TOP CONTACT BAR
        ====================================================== */}

        <div className="border-b border-white/10 py-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-0">

            {/* Office */}
            <div className="flex items-start gap-3 md:border-r md:border-white/10 md:pr-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#C6A24A]/30 bg-[#202B4A] text-[#C6A24A]">
                <MapPin size={15} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
                  {officeTitle}
                </p>

                <p className="mt-1 text-xs font-medium text-white">
                  {officeName}
                </p>

                <address className="mt-0.5 max-w-xs not-italic text-[10px] leading-4 text-[#C9CED9]/60">
                  {officeAddress}
                </address>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 md:px-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#C6A24A]/30 bg-[#202B4A] text-[#C6A24A]">
                <Phone size={14} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
                  {phoneTitle}
                </p>

                <p className="mt-1 text-xs font-medium text-white">
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
                      className="text-[10px] text-[#C9CED9]/70 transition-colors hover:text-[#C6A24A]"
                    >
                      {item.number}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 md:border-l md:border-white/10 md:pl-8">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#C6A24A]/30 bg-[#202B4A] text-[#C6A24A]">
                <Mail size={14} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
                  {emailTitle}
                </p>

                <p className="mt-1 text-xs font-medium text-white">
                  {emailSubtitle}
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-0.5 block truncate text-[10px] text-[#C9CED9]/70 transition-colors hover:text-[#C6A24A]"
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

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* BRAND */}
          <div className="lg:col-span-5 lg:pr-12">

            <Link href="/"
              aria-label="Saudagar Properties home"
              className="inline-block"
            >
              <div className="rounded-xl bg-white/95 px-3.5 py-2.5 shadow-sm border border-white/20">
                <Image
                  width={160}
                  height={45}
                  loading="lazy"
                  src={footerData.logoUrl || logoImg}
                  alt="Saudagar Properties"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-md text-[11px] leading-5 text-[#C9CED9]/70">
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
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-[#C9CED9] transition-all hover:border-[#C6A24A]/60 hover:bg-[#C6A24A] hover:text-[#0E162B]"
                  >
                    <IconComponent size={11} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* EXPLORE */}
          <div className="lg:col-span-2">
            <h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
              {menuTitle}
            </h2>

            <ul className="space-y-2.5">
              {menuLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[11px] text-[#C9CED9]/70 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#C6A24A]/50 transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LOCATIONS */}
          <div className="lg:col-span-3">
            <h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
              {servicesTitle}
            </h2>

            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {serviceLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[11px] text-[#C9CED9]/70 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#C6A24A]/50 transition-transform group-hover:scale-125" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PRIVATE ADVISORY */}
          <div className="lg:col-span-2">
            <h2 className="mb-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C6A24A]">
              {followTitle}
            </h2>

            <p className="text-[11px] leading-5 text-[#C9CED9]/70">
              {followDesc}
            </p>

            <a
              href={`tel:${callCtaPhone.replace(/\s+/g, '')}`}
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C6A24A] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0E162B] transition-all hover:bg-[#D8BD73]"
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

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[9px] text-[#C9CED9]/40">
            {copyright} {new Date().getFullYear()}, {copyrightSuffix}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                <Link href={item.href}
                  className="text-[9px] text-[#C9CED9]/40 transition-colors hover:text-[#C6A24A]"
                >
                  {item.label}
                </Link>

                {idx < legalLinks.length - 1 && (
                  <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}