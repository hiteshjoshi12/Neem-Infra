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
  ArrowUpRight
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
  const faqs = corridor.faqs || [];

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
    <div className="w-full min-h-screen bg-[#0A0E17] text-[#F7F5EF] selection:bg-[#D09A16] selection:text-[#0A0E17]">
      {/* =========================================================================
          1. HERO MASTHEAD WITH EDITORIAL TYPOGRAPHY & ATMOSPHERIC VIGNETTE
      ========================================================================= */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 pb-20 md:pb-24 border-b border-white/10">
        {/* Background Image with Cinematic Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
          <Image
            src={hero.bgImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80'}
            alt={`${corridor.corridorName} Real Estate`}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-[0.75] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/90 via-[#0A0E17]/65 to-[#0A0E17]" />
        </div>

        {/* Ambient Golden Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.16) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href="/properties" className="hover:text-[#D09A16] transition-colors">Properties</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16] animate-pulse" />
              <span>{corridor.corridorName}</span>
            </span>
          </div>

          <div className="max-w-4xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-[11px] font-bold uppercase tracking-[0.22em] mb-4 backdrop-blur-md shadow-sm">
              <Sparkles size={12} className="text-[#D09A16]" />
              <span>{hero.badge}</span>
            </div>

            {/* Master Animated Headline with Masked Luxury Sliding Animation */}
            <LuxuryTextReveal
              as="h1"
              text={hero.titleMain}
              highlightText={hero.titleHighlight}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-6"
              delay={0.05}
            />

            {/* Supporting Editorial Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-sans leading-relaxed max-w-3xl mb-8">
              {hero.subtitle}
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${hero.directPhone?.replace(/[\s-]/g, '') || '+919811221207'}`}
                className="px-6 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Phone size={15} />
                <span>Call Direct: {hero.directPhone || '+91 98112 21207'}</span>
              </a>

              <a
                href={quickCallout.whatsappUrl || `https://wa.me/${hero.whatsappNumber || '919718511207'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Advisory</span>
              </a>

              <a
                href="#inquiry-form"
                className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/[0.04] text-slate-300 hover:text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>Request Site Visit</span>
                <ArrowRight size={13} className="text-[#D09A16]" />
              </a>
            </div>
          </div>

          {/* 4 Key Metrics Bar */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-white/10">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:border-[#D09A16]/40 transition-colors group"
                >
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[#D09A16] block leading-none mb-1 group-hover:scale-105 transition-transform origin-left">
                    {m.value}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>
          )}
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
          3. STRATEGIC URBAN EQUILIBRIUM & CAPITAL APPRECIATION
      ========================================================================= */}
      <section className="py-20 bg-[#0A0E17] text-white border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block">
                {locationSection.tag || 'Strategic Urban Balance'}
              </span>

              <LuxuryTextReveal
                as="h2"
                text={locationSection.title}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-snug"
                delay={0.08}
              />

              <div className="text-sm font-serif italic text-[#D09A16]">
                {locationSection.subtitle}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line pt-2">
                {locationSection.description}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                  <CheckCircle2 size={13} className="text-[#D09A16]" />
                  <span>MG Road &amp; Cyber City Access</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                  <CheckCircle2 size={13} className="text-[#D09A16]" />
                  <span>Aravalli Green Canopy</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                  <CheckCircle2 size={13} className="text-[#D09A16]" />
                  <span>100% Freehold Mutation</span>
                </div>
              </div>
            </div>

            {/* Right Quick Callout Banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-b from-[#141E36] to-[#0E162B] border border-[#D09A16]/40 p-7 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
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
          5. NEAREST PLACES & COMMUTE RADAR
      ========================================================================= */}
      <section className="py-20 bg-[#0A0E17] text-white border-b border-white/10 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.12) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
              {nearestPlaces.badge || 'Transit Times'}
            </span>

            <LuxuryTextReveal
              as="h2"
              text={nearestPlaces.title}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white"
              delay={0.08}
            />

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
              {nearestPlaces.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(nearestPlaces.places || []).map((place, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-2xl bg-[#141E36]/90 border border-white/10 backdrop-blur-md hover:border-[#D09A16]/50 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#D09A16]/15 border border-[#D09A16]/30 text-[10px] font-bold uppercase tracking-wider text-[#D09A16]">
                      {place.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{place.time}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white mb-1 group-hover:text-[#D09A16] transition-colors">
                    {place.name}
                  </h3>
                  <div className="text-xs text-[#D09A16] font-medium mb-3">
                    {place.distance}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {place.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. HOW CAN WE HELP YOU & WHY CHOOSE SAUDAGAR PROPERTIES
      ========================================================================= */}
      <section className="py-20 bg-[#0E162B] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* How We Help */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block">
                {howWeHelp.badge || 'Turnkey Acquisition Platform'}
              </span>

              <LuxuryTextReveal
                as="h2"
                text={howWeHelp.title}
                className="text-2xl sm:text-3xl font-serif font-bold text-white"
                delay={0.08}
              />

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                {(howWeHelp.paragraphs || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Checklist */}
              {howWeHelp.servicesChecklist && (
                <div className="space-y-2.5 pt-4">
                  {howWeHelp.servicesChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                      <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why Choose Saudagar */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#141E36] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                  {whyChooseSaudagar.badge || '25+ Years Experience'}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-4">
                  {whyChooseSaudagar.title}
                </h3>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {whyChooseSaudagar.content}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">
                    Arun Sharma &amp; Suneeta Chawla
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Founders, Saudagar Properties Pvt Ltd
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  Contact Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CURATED VERIFIED INVENTORY FOR THIS CORRIDOR
      ========================================================================= */}
      {properties.length > 0 && (
        <section className="py-20 bg-[#0A0E17] text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                  Verified Real Estate
                </span>
                <LuxuryTextReveal
                  as="h2"
                  text={`Available Properties in ${corridor.corridorName}`}
                  className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white"
                  delay={0.08}
                />
              </div>
              <Link
                href={`/properties?location=${corridor.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D09A16] hover:underline"
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
                    className="rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/50 overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
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
                        <div className="text-xl font-serif font-bold text-[#D09A16] mb-2">
                          {p.price}
                        </div>
                        <h3 className="font-serif font-bold text-base text-white hover:text-[#D09A16] transition-colors line-clamp-1 mb-2">
                          <Link href={detailUrl}>{p.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                          {p.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-white/10">
                      <Link
                        href={detailUrl}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#D09A16] hover:text-[#0A0E17] text-white text-xs font-bold uppercase tracking-wider text-center transition-all"
                      >
                        Details
                      </Link>
                      <a
                        href={`https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(p.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-[#25D366] text-white transition-all cursor-pointer"
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
          9. FREQUENTLY ASKED QUESTIONS (INTERACTIVE LUXURY ACCORDION)
      ========================================================================= */}
      {faqs.length > 0 && (
        <section className="py-20 bg-[#0A0E17] text-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                Expert Guidance &amp; Insights
              </span>

              <LuxuryTextReveal
                as="h2"
                text="Frequently Asked Questions"
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white"
                delay={0.08}
              />

              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                Key questions answered regarding acquisitions, pricing benchmarks, and zoning in {corridor.corridorName}.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#141E36]/90 border border-white/10 hover:border-[#D09A16]/40 transition-colors overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <span className="font-serif font-bold text-base sm:text-lg text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#D09A16] transition-transform duration-300 shrink-0 ${
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
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed border-t border-white/5">
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
    </div>
  );
}
