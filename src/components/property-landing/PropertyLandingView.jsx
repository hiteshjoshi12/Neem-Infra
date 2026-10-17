"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Navigation,
  Clock,
  Send,
  Home,
  Check,
  Award,
  Layers,
  ArrowUpRight,
  Maximize2,
  X
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import LuxuryTextReveal from '@/components/ui/LuxuryTextReveal';
import api from '@/services/api';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

export default function PropertyLandingView({ corridor, properties = [] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentCorridorSlug, setCurrentCorridorSlug] = useState(corridor.slug);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  if (currentCorridorSlug !== corridor.slug) {
    setCurrentCorridorSlug(corridor.slug);
    setActiveImageIndex(0);
  }

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: 'Luxury Builder Floor',
    budget: '₹5 Cr - ₹10 Cr',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: 'corridor_inquiry',
        propertyTitle: corridor.corridorName,
        message: `[Corridor Inquiry: ${corridor.corridorName}] Requirement: ${formData.requirement} | Budget: ${formData.budget} | Note: ${formData.message}`,
        source: `Corridor Page - ${corridor.corridorName}`
      };

      const res = await api.createInquiry(payload);
      if (res?.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res?.message || 'Failed to submit inquiry. Please call us directly.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error. Please call our direct hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  const hero = corridor.hero || {};
  const metrics = corridor.metrics || [];
  const overview = corridor.overview || {};
  const locationSection = corridor.locationSection || {};
  const quickCallout = corridor.quickCallout || {};
  const whyLiveHere = corridor.whyLiveHere || {};
  const nearestPlaces = corridor.nearestPlaces || {};
  const howWeHelp = corridor.howWeHelp || {};
  const whyChooseSaudagar = corridor.whyChooseSaudagar || {};
  const mapShowcase = corridor.mapShowcase || {};
  const faqs = corridor.faqs || [];

  const galleryImages = (hero.galleryImages && hero.galleryImages.length > 0)
    ? hero.galleryImages
    : [
        {
          url: hero.bgImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
          title: `${corridor.corridorName} Premium Architecture`,
          tag: 'Featured Estate'
        }
      ];
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];
  const keyHighlights = hero.keyHighlights || [];

  const handleSelectTypology = (typologyTitle) => {
    setFormData((prev) => ({
      ...prev,
      requirement: typologyTitle || prev.requirement
    }));
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#17213D] selection:bg-[#D09A16] selection:text-[#0A0E17]">
      {/* =========================================================================
          1. HERO MASTHEAD: LUXURY EDITORIAL LIGHT CANVAS & PROPERTY SHOWCASE
      ========================================================================= */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 lg:pb-20 bg-[#FAF8F5] text-[#17213D] border-b border-[#E8E2D9]">
        {/* Subtle Architectural Grid Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(#17213D_1px,transparent_1px),linear-gradient(90deg,#17213D_1px,transparent_1px)] [background-size:40px_40px]"
        />

        {/* Radiant Warm Gold Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-1/4 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(208,154,22,0.08) 0%, rgba(208,154,22,0) 70%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/properties" className="hover:text-[#D09A16] transition-colors">Properties</Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#B48216] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_6px_#D09A16]" />
              <span>{corridor.corridorName}</span>
            </span>
          </nav>

          {/* Hero 2-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Narrative Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Pill + Starting Price Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#9E6E00] text-[11px] font-bold uppercase tracking-[0.2em] shadow-xs">
                  <Sparkles size={12} className="text-[#D09A16]" />
                  <span>{hero.badge}</span>
                </div>

                {hero.priceStarting && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5DFD5] text-[#17213D] text-[11px] font-bold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-500 font-medium">Starting at:</span>
                    <span className="text-[#B48216]">{hero.priceStarting}</span>
                  </div>
                )}
              </div>

              {/* Master Headline with Luxury Reveal */}
              <LuxuryTextReveal
                as="h1"
                text={hero.titleMain}
                highlightText={hero.titleHighlight}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-[#111827] tracking-tight leading-[1.14]"
                delay={0.05}
              />

              {/* Supporting Editorial Paragraph */}
              <p className="text-sm sm:text-base md:text-[1.06rem] text-slate-600 font-sans leading-relaxed max-w-2xl">
                {hero.subtitle}
              </p>

              {/* Key Micro-Market Feature Chips (Horizontal, Modern, Replaces clunky 4 cards) */}
              {keyHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {keyHighlights.map((highlight, hIdx) => (
                    <div
                      key={hIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#E2DBD0] text-[#1E293B] text-xs font-semibold shadow-xs hover:border-[#D09A16]/60 transition-colors"
                    >
                      <CheckCircle2 size={13} className="text-[#D09A16] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href={`tel:${hero.directPhone?.replace(/[\s-]/g, '') || '+919811221207'}`}
                  className="px-6 py-3.5 rounded-xl bg-[#17213D] hover:bg-[#223055] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer hover:shadow-lg"
                >
                  <Phone size={14} className="text-[#D09A16]" />
                  <span>Call Direct: {hero.directPhone || '+91 98112 21207'}</span>
                </a>

                <a
                  href={quickCallout.whatsappUrl || `https://wa.me/${hero.whatsappNumber || '919718511207'}?text=Hello%20Saudagar%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(corridor.corridorName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#0A5C28] hover:text-white border border-[#25D366]/35 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp Advisory</span>
                </a>

                <a
                  href="#inquiry-form"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Schedule Visit</span>
                  <ArrowRight size={13} className="text-[#D09A16]" />
                </a>
              </div>

              {/* Micro Trust Credentials Line */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#D09A16]" />
                  <span>25+ Years Authority</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Award size={14} className="text-[#D09A16]" />
                  <span>100% Freehold Title Vetted</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#D09A16]" />
                  <span>Direct Seller Mandates</span>
                </span>
              </div>
            </div>

            {/* Right Gallery Showcase Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Ambient Behind-Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#D09A16]/20 to-transparent blur-xl opacity-60 pointer-events-none"
                />

                {/* Main Stage Image Card */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-white shadow-[0_20px_50px_rgba(23,33,61,0.18)]">
                  {/* Photo Display with Framer Motion AnimatePresence */}
                  <div className="relative h-[360px] sm:h-[420px] w-full overflow-hidden bg-slate-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeImage.url}
                          alt={`${corridor.corridorName} - ${activeImage.title}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          priority
                          className="object-cover object-center"
                        />
                        {/* Subtle bottom vignette to ensure caption readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </motion.div>
                    </AnimatePresence>

                    {/* Top Badge: Floating Pill */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#17213D] shadow-md border border-white/60 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#D09A16]" />
                        <span>{activeImage.tag || 'Verified Architecture'}</span>
                      </span>
                    </div>

                    {/* Top-Right Badge: Corridor Tag */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white tracking-wider uppercase border border-white/20">
                        {corridor.corridorName}
                      </span>
                    </div>

                    {/* Bottom Overlay Card */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-lg flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B48216] block">
                          Featured Property View • 0{activeImageIndex + 1}/0{galleryImages.length}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-[#17213D] truncate">
                          {activeImage.title}
                        </h4>
                      </div>

                      {hero.priceStarting && (
                        <div className="shrink-0 text-right">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                            Guideline
                          </span>
                          <span className="text-xs font-serif font-bold text-[#B48216]">
                            {hero.priceStarting}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Thumbnail Gallery Strip (3 Perspectives) */}
                  {galleryImages.length > 1 && (
                    <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2.5 overflow-x-auto">
                      {galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`group relative flex-1 min-w-[90px] h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left ${
                            activeImageIndex === idx
                              ? 'border-[#D09A16] shadow-sm ring-2 ring-[#D09A16]/20 scale-[1.02]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.title}
                            fill
                            sizes="100px"
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute bottom-1 left-1.5 right-1.5">
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider drop-shadow-sm truncate block">
                              {img.tag || `View 0${idx + 1}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Market Intelligence Strip */}
          <div className="mt-12 pt-6 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <Navigation size={13} className="text-[#D09A16]" />
              <span>{corridor.corridorName} Micro-Market Intelligence</span>
            </div>
            <div className="hidden sm:flex items-center gap-5 text-slate-500 text-[11px] font-medium">
              <span>✦ Direct Builder &amp; Resale Mandates</span>
              <span className="text-slate-300">•</span>
              <span>✦ Real-Time On-Ground Inventory</span>
              <span className="text-slate-300">•</span>
              <span>✦ Zero Conflict of Interest</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. LOCALITY PROFILE & 3 CORE PROPERTY TYPOLOGIES
      ========================================================================= */}
      <section className="py-20 bg-[#0E162B] text-white border-b border-white/10 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:48px_48px]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#D09A16] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              <Award size={13} />
              <span>{overview.tag || 'Locality Profile'}</span>
            </div>

            <LuxuryTextReveal
              as="h2"
              text={overview.title}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-snug mb-4"
              delay={0.1}
            />

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {(overview.paragraphs || []).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* 3 Core Typology Cards */}
          {overview.typologies && overview.typologies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {overview.typologies.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  custom={idx}
                  variants={fadeUpVariant}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl bg-[#141E36]/90 p-6 sm:p-7 border border-white/10 hover:border-[#D09A16]/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_45px_rgba(208,154,22,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Top Accent Hairline */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D09A16]/40 to-transparent group-hover:via-[#D09A16] transition-all duration-500" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center font-bold border border-[#D09A16]/30 group-hover:scale-110 transition-transform">
                        <Building2 size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">
                        Tier 1 Asset
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-[#D09A16] block uppercase tracking-wider mb-1.5">
                      {t.specs}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-white mb-3 leading-snug group-hover:text-[#D09A16] transition-colors">
                      {t.title}
                    </h3>
                    <div className="text-2xl font-serif font-bold text-white mb-5">
                      {t.price}
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      {t.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 size={13} className="text-[#D09A16] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTypology(t.title)}
                    className="mt-6 w-full py-3 rounded-xl bg-white/[0.08] group-hover:bg-[#D09A16] text-white group-hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border border-white/10 group-hover:border-[#D09A16]"
                  >
                    <span>Inquire Property</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          3. STRATEGIC URBAN EQUILIBRIUM & CAPITAL APPRECIATION (LIGHT)
      ========================================================================= */}
      <section className="py-20 bg-white text-[#17213D] border-b border-[#E8E2D9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B48216] block">
                {locationSection.tag || 'Strategic Urban Balance'}
              </span>

              <LuxuryTextReveal
                as="h2"
                text={locationSection.title}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111827] tracking-tight leading-snug"
                delay={0.08}
              />

              <div className="text-sm font-serif italic text-[#B48216]">
                {locationSection.subtitle}
              </div>

              <div className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed whitespace-pre-line pt-2">
                {locationSection.description}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                {(locationSection.highlights && locationSection.highlights.length > 0
                  ? locationSection.highlights
                  : [
                      'MG Road & Cyber City Access',
                      'Aravalli Green Canopy',
                      '100% Freehold Mutation'
                    ]
                ).map((hl, hlIdx) => (
                  <div key={hlIdx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-xs text-slate-700 font-medium shadow-xs">
                    <CheckCircle2 size={13} className="text-[#D09A16]" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Quick Callout Banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-b from-[#141E36] to-[#0E162B] border border-[#D09A16]/40 p-7 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D09A16]/20 text-[#D09A16] text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>{quickCallout.badge || 'Advisory Desk'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                  {quickCallout.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {quickCallout.subtitle}
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href={`tel:${quickCallout.phone?.replace(/[\s-]/g, '') || '+919811221207'}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Phone size={14} />
                    <span>Call On: {quickCallout.phone || '+91 98112 21207'}</span>
                  </a>

                  <a
                    href={quickCallout.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon size={15} />
                    <span>WhatsApp Direct Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 8 STRATEGIC REASONS TO LIVE IN THIS CORRIDOR
      ========================================================================= */}
      <section className="py-20 bg-[#0E162B] text-white border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
              {whyLiveHere.badge || 'Location Supremacy'}
            </span>

            <LuxuryTextReveal
              as="h2"
              text={whyLiveHere.title}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white"
              delay={0.1}
            />

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
              {whyLiveHere.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(whyLiveHere.pillars || []).map((pillar, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl bg-[#141E36]/90 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#D09A16]/50 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Architectural Numeral Watermark */}
                <span className="absolute right-4 top-3 text-5xl font-serif font-bold text-white/[0.04] pointer-events-none select-none">
                  0{idx + 1}
                </span>

                {/* Subtle Top Accent Hairline */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D09A16]/30 to-transparent group-hover:via-[#D09A16] transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-[#D09A16]">
                      {pillar.number}
                    </span>
                    <ShieldCheck size={16} className="text-[#D09A16]" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white mb-2 leading-snug group-hover:text-[#D09A16] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. NEAREST PLACES & COMMUTE RADAR (LIGHT) WITH IMAGES
      ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#FAF8F5] text-[#17213D] border-b border-[#E8E2D9] relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.08) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B48216] block mb-2">
              {nearestPlaces.badge || 'Transit Times & Connectivity'}
            </span>

            <LuxuryTextReveal
              as="h2"
              text={nearestPlaces.title}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111827]"
              delay={0.08}
            />

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-sans">
              {nearestPlaces.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(nearestPlaces.places || []).map((place, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-white border border-[#E5DFD5] hover:border-[#D09A16]/60 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(23,33,61,0.06)] hover:shadow-[0_16px_35px_rgba(208,154,22,0.14)] overflow-hidden"
              >
                <div>
                  {/* Landmark Photographic Banner - Full Bleed Edge-to-Edge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={place.image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'}
                      alt={place.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                    {/* Category Tag on Top Left */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white/40 text-[10px] font-bold uppercase tracking-wider text-[#17213D] shadow-xs">
                      {place.category}
                    </div>

                    {/* Transit Time on Top Right */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-900/85 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                      <Clock size={12} />
                      <span>{place.time}</span>
                    </div>

                    {/* Distance Tag on bottom */}
                    <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                      <Navigation size={13} className="text-[#D09A16]" />
                      <span>{place.distance} away</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif font-bold text-lg text-[#111827] mb-2 group-hover:text-[#B48216] transition-colors leading-snug">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                      {place.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom gold hairline */}
                <div className="px-5 sm:px-6 pb-5 pt-0">
                  <div className="h-[2px] w-10 bg-[#D09A16]/30 group-hover:w-full group-hover:bg-[#D09A16] transition-all duration-300 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6A. HOW CAN WE HELP YOU? (TURNKEY ADVISORY & ACQUISITION PLATFORM)
      ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#0E162B] text-white border-b border-white/10 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(208, 154, 22, 0.08) 0%, rgba(0,0,0,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Narrative & Checklist Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block">
                {howWeHelp.badge || 'Turnkey Advisory & Acquisition Platform'}
              </span>

              <LuxuryTextReveal
                as="h2"
                text={howWeHelp.title}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight"
                delay={0.08}
              />

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                {(howWeHelp.paragraphs || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Verified Services Checklist */}
              {howWeHelp.servicesChecklist && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {howWeHelp.servicesChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 text-xs text-slate-200 font-medium hover:border-[#D09A16]/40 transition-colors"
                    >
                      <CheckCircle2 size={16} className="text-[#D09A16] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#inquiry-form"
                  className="px-6 py-3 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                >
                  <span>Request Private Consultation</span>
                  <ArrowRight size={14} />
                </a>
                <a
                  href="https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20would%20like%20to%20consult%20regarding%20property%20acquisitions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all inline-flex items-center gap-2"
                >
                  <WhatsAppIcon size={15} />
                  <span>Direct Desk Hotline</span>
                </a>
              </div>
            </div>

            {/* Feature Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#D09A16]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full">
                  <Image
                    src={howWeHelp.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85'}
                    alt="Saudagar Properties Turnkey Acquisition Advisory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E162B] via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Floating Glassmorphism Advisory Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#141E36]/90 backdrop-blur-md border border-[#D09A16]/30 text-white flex items-center gap-3.5 shadow-xl">
                  <div className="p-2.5 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider">
                      Turnkey Due Diligence
                    </span>
                    <span className="text-[11px] text-slate-300 leading-tight block">
                      Title clearance, registry representation &amp; architect consultation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6B. WHY CHOOSE SAUDAGAR PROPERTIES FOR THIS CORRIDOR
      ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#FAF8F5] text-[#17213D] border-b border-[#E8E2D9] relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(208, 154, 22, 0.07) 0%, rgba(250,248,245,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Corridor Legacy Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-[#E5DFD5] shadow-[0_16px_40px_rgba(23,33,61,0.08)] group bg-white">
                <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full">
                  <Image
                    src={whyChooseSaudagar.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85'}
                    alt={whyChooseSaudagar.title || 'Why Choose Saudagar Properties'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#17213D]/90 backdrop-blur-md text-[#D09A16] border border-[#D09A16]/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Award size={14} />
                  <span>25+ Years Legacy</span>
                </div>

                {/* Bottom Signature Note */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5DFD5] text-[#17213D] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#111827]">
                      {whyChooseSaudagar.founderName || 'Arun Sharma & Suneeta Chawla'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {whyChooseSaudagar.founderTitle || 'Founders, Saudagar Properties Pvt Ltd'}
                    </span>
                  </div>
                  <Link
                    href="/contact"
                    className="px-3.5 py-1.5 rounded-lg bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Direct Desk
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Authority Narrative */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B48216] block">
                {whyChooseSaudagar.badge || 'Market Leadership & Uncompromising Integrity'}
              </span>

              <LuxuryTextReveal
                as="h2"
                text={whyChooseSaudagar.title}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111827] leading-tight"
                delay={0.08}
              />

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                {whyChooseSaudagar.content}
              </div>

              {/* Three Institutional Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-lg font-serif font-bold text-[#B48216] block">25+ Yrs</span>
                  <span className="text-[11px] font-semibold text-slate-700">Micro-Market Authority</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-lg font-serif font-bold text-[#B48216] block">100%</span>
                  <span className="text-[11px] font-semibold text-slate-700">Clean Freehold Titles</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-lg font-serif font-bold text-[#B48216] block">₹500+ Cr</span>
                  <span className="text-[11px] font-semibold text-slate-700">Transactions Facilitated</span>
                </div>
              </div>

              {/* Connect Button */}
              <div className="pt-2">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B48216] hover:text-[#9E6E00] group"
                >
                  <span>Meet Our Leadership &amp; Corridor Advisory Team</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CURATED VERIFIED INVENTORY FOR THIS CORRIDOR (LIGHT)
      ========================================================================= */}
      {properties.length > 0 && (
        <section className="py-20 bg-white text-[#17213D] border-b border-[#E8E2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B48216] block mb-2">
                  Verified Real Estate
                </span>
                <LuxuryTextReveal
                  as="h2"
                  text={`Available Properties in ${corridor.corridorName}`}
                  className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111827]"
                  delay={0.08}
                />
              </div>
              <Link
                href={`/properties?location=${corridor.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B48216] hover:text-[#9E6E00] hover:underline"
              >
                <span>View Full Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((p, idx) => {
                const detailUrl = `/properties/${p.slug || p._id}`;
                return (
                  <motion.article
                    key={p._id || idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={idx}
                    variants={fadeUpVariant}
                    className="rounded-3xl bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#D09A16]/60 shadow-[0_4px_20px_rgba(23,33,61,0.06)] hover:shadow-[0_12px_35px_rgba(208,154,22,0.12)] overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={p.img || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D09A16] border border-[#D09A16]/40 text-[10px] font-bold uppercase tracking-wider">
                          {p.category || 'Luxury Residence'}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="text-xl font-serif font-bold text-[#B48216] mb-2">
                          {p.price}
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#111827] hover:text-[#B48216] transition-colors line-clamp-1 mb-2">
                          <Link href={detailUrl}>{p.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {p.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-[#E5DFD5]">
                      <Link
                        href={detailUrl}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#17213D] hover:bg-[#23335D] text-white text-xs font-bold uppercase tracking-wider text-center transition-all shadow-xs"
                      >
                        Details
                      </Link>
                      <a
                        href={`https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-[#0A5C28] hover:text-white border border-emerald-200 transition-all cursor-pointer shadow-xs"
                        title="WhatsApp"
                      >
                        <WhatsAppIcon size={16} />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          8. DIRECT PROPERTY INQUIRY & CONSULTATION FORM
      ========================================================================= */}
      <section id="inquiry-form" className="py-20 bg-[#0E162B] text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#141E36] p-8 sm:p-12 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                Confidential Inquiry Desk
              </span>

              <LuxuryTextReveal
                as="h2"
                text={`Consult Directly for ${corridor.corridorName}`}
                className="text-2xl sm:text-3xl font-serif font-bold text-white"
                delay={0.08}
              />

              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-emerald-200">
                  Inquiry Received Successfully
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300 max-w-md mx-auto">
                  Thank you for connecting with Saudagar Properties. A senior partner will reach out to you shortly on {formData.phone || 'your phone'}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajiv Kapoor"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E17] border border-white/15 focus:border-[#D09A16] text-white placeholder-slate-500 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E17] border border-white/15 focus:border-[#D09A16] text-white placeholder-slate-500 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rajiv@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E17] border border-white/15 focus:border-[#D09A16] text-white placeholder-slate-500 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Property Requirement
                    </label>
                    <select
                      value={formData.requirement}
                      onChange={(e) => handleInputChange('requirement', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0E17] border border-white/15 focus:border-[#D09A16] text-white text-xs outline-none transition-colors cursor-pointer"
                    >
                      <option value="Modern Builder Floors (Stilt + 4)" className="bg-[#0A0E17] text-white">Luxury Builder Floor (Stilt+4)</option>
                      <option value="Independent Kothis & Bespoke Mansions" className="bg-[#0A0E17] text-white">Independent Kothi / Villa</option>
                      <option value="Freehold Residential Plots" className="bg-[#0A0E17] text-white">Freehold Residential Plot</option>
                      <option value="Commercial Office / Retail" className="bg-[#0A0E17] text-white">Commercial Office / Retail</option>
                      <option value="Industrial Plot / Warehouse" className="bg-[#0A0E17] text-white">Industrial Plot / Warehouse</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Message / Preferred Plot Size or Timeline
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Tell us about your requirement in ${corridor.corridorName}...`}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0E17] border border-white/15 focus:border-[#D09A16] text-white placeholder-slate-500 text-xs outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#D09A16]" />
                    <span>Strict client confidentiality. Zero spam.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FREQUENTLY ASKED QUESTIONS (LIGHT ACCORDION)
      ========================================================================= */}
      {faqs.length > 0 && (
        <section className="py-20 bg-[#FAF8F5] text-[#17213D] relative border-b border-[#E8E2D9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B48216] block mb-2">
                Expert Guidance &amp; Insights
              </span>

              <LuxuryTextReveal
                as="h2"
                text="Frequently Asked Questions"
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111827]"
                delay={0.08}
              />

              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans">
                Key questions answered regarding acquisitions, pricing benchmarks, and zoning in {corridor.corridorName}.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-white border-[#D09A16]/50 shadow-md ring-1 ring-[#D09A16]/15'
                        : 'bg-white border-[#E5DFD5] hover:border-[#D09A16]/40 shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <span className="font-serif font-bold text-base sm:text-lg text-[#111827]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#B48216] transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* =========================================================================
          10. DUAL MAP SHOWCASE: LIVE GOOGLE MAP & HIGH-RES STATIC MASTER PLAN
      ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#0A0E17] text-white relative overflow-hidden border-t border-white/10">
        {/* Architectural Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(208, 154, 22, 0.08) 0%, rgba(0,0,0,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
              {mapShowcase.badge || 'Strategic Cartography & Master Planning'}
            </span>

            <LuxuryTextReveal
              as="h2"
              text={mapShowcase.title || `${corridor.corridorName} Strategic Location & Master Plan`}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white"
              delay={0.08}
            />

            <p className="text-xs sm:text-sm text-slate-300 mt-3 font-sans leading-relaxed">
              {mapShowcase.description || `Explore the geographic positioning of ${corridor.corridorName} alongside the official sector master layout planning and arterial road grid.`}
            </p>
          </div>

          {/* Dual Maps Grid: Google Map & Static Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Map 1: Interactive Live Google Map */}
            <div className="rounded-3xl bg-[#141E36] border border-white/10 p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group hover:border-[#D09A16]/50 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/20">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                        Live Geographic Navigation
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Interactive Google Maps satellite &amp; transit network
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Live GPS
                  </span>
                </div>

                {/* Google Map Iframe Container */}
                <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0A0E17]">
                  {mapShowcase.googleMapEmbed ? (
                    <iframe
                      src={mapShowcase.googleMapEmbed}
                      title={`${corridor.corridorName} Google Map Embed`}
                      className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                      loading="lazy"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <MapPin size={32} className="text-[#D09A16] mb-2" />
                      <p className="text-xs">Live map navigation active for {corridor.corridorName}.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Navigation size={13} className="text-[#D09A16]" />
                  <span>Interactive pinch-to-zoom &amp; route planning</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(corridor.corridorName + ' Gurugram Haryana')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D09A16] hover:text-[#E5AC2B] transition-colors"
                >
                  <span>Open Full Map</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Map 2: High-Resolution Static Master Plan / Layout Blueprint */}
            <div className="rounded-3xl bg-[#141E36] border border-white/10 p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group hover:border-[#D09A16]/50 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/20">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                        Sector Master Layout Plan
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Official zoning blueprint &amp; plot cartography
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] text-[10px] font-bold uppercase tracking-wider">
                    Master Blueprint
                  </span>
                </div>

                {/* Static Map Image Preview with Click-To-Enlarge - Full Bleed */}
                <div
                  onClick={() => setIsMapModalOpen(true)}
                  className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0A0E17] group/img cursor-pointer"
                >
                  <Image
                    src={mapShowcase.staticMapImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80'}
                    alt={`${corridor.corridorName} Master Plan Map`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover/img:bg-black/15 transition-colors flex items-center justify-center">
                    <div className="px-4 py-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-[#D09A16]/50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg group-hover/img:scale-105 transition-transform">
                      <Maximize2 size={14} className="text-[#D09A16]" />
                      <span>Click to Inspect High-Res</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Tap image to inspect full sector blueprint
                </span>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D09A16] hover:text-[#E5AC2B] transition-colors cursor-pointer"
                >
                  <span>Enlarge Blueprint</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Master Plan Lightbox Modal */}
        <AnimatePresence>
          {isMapModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
              onClick={() => setIsMapModalOpen(false)}
            >
              <div
                className="relative max-w-6xl w-full max-h-[92vh] bg-[#141E36] rounded-3xl border border-[#D09A16]/40 overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0E162B]">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      {corridor.corridorName} — Official Master Layout &amp; Zoning Blueprint
                    </h3>
                    <p className="text-xs text-slate-400">High-resolution cartographic survey</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <X size={16} />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                </div>
                <div className="relative w-full h-[72vh] bg-[#0A0E17] overflow-auto flex items-center justify-center p-4">
                  <img
                    src={mapShowcase.staticMapImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=85'}
                    alt={`${corridor.corridorName} Master Plan`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
