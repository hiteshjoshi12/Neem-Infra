"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Compass,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Gem,
} from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import LuxuryTextReveal from '@/components/ui/LuxuryTextReveal';

const REASON_ICONS = [Compass, TrendingUp, Layers];

function ArchitecturalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-gold/[0.045] blur-[120px]" />
      <div className="absolute right-[15%] top-0 h-full w-px bg-brand-navy-gradient/[0.025]" />
      <div className="absolute right-[30%] top-0 h-full w-px bg-brand-navy-gradient/[0.018]" />
      <div className="absolute left-[12%] top-0 h-full w-px bg-brand-navy-gradient/[0.018]" />
      <div className="absolute -right-40 top-[20%] h-[500px] w-[500px] rounded-full border border-brand-gold/[0.07]" />
      <div className="absolute -right-10 top-[27%] h-[360px] w-[360px] rounded-full border border-brand-navy-gradient/[0.035]" />
      <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(to_right,var(--color-brand-navy-gradient)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-navy-gradient)_1px,transparent_1px)] [background-size:80px_80px]" />
    </div>
  );
}

function TrustCard({ trustCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full min-h-[580px] overflow-hidden rounded-[30px] border border-white/15 bg-brand-obsidian text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-[0_30px_70px_rgba(197,154,39,0.2)]"
    >
      {/* Background Image - Clearly Visible */}
      <div className="absolute inset-0">
        <Image
          src={trustCard.bgImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"}
          alt="Modern Gurgaon Architecture"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          loading="lazy"
          className="h-full w-full object-cover opacity-80 filter brightness-[0.85] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-obsidian/90 via-brand-obsidian/50 to-brand-obsidian/95" />
      </div>

      {/* Gold ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gold/20 blur-[80px] transition-all duration-500 group-hover:bg-brand-gold/30" />

      {/* Architectural Inner Frame */}
      <div className="pointer-events-none absolute inset-5 rounded-[24px] border border-white/10" />
      <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-[30px] border-l-2 border-t-2 border-brand-gold" />
      <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-[30px] border-b-2 border-r-2 border-brand-gold" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/20 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold backdrop-blur-sm">
            <Sparkles size={11} className="text-brand-gold" />
            <span>{trustCard.badge || "Trusted Partner"}</span>
          </div>

          <h3 className="mt-6 font-serif text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
            {trustCard.title || "Property Dealers in Gurgaon You Can Trust"}
          </h3>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px w-12 bg-brand-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            <span className="h-px w-6 bg-white/20" />
          </div>

          <p className="text-xs leading-relaxed text-slate-200 font-medium sm:text-sm">
            {trustCard.p1 || "We help customers buy, sell, and rent residential, commercial, and industrial properties across prime areas of Gurgaon including DLF, Sushant Lok, and Udyog Vihar."}
          </p>

          <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
            {trustCard.p2 || "We're your one-stop platform for smart property solutions combining local expertise with verified off-market opportunities."}
          </p>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Gem size={15} className="text-brand-gold" />
              <div>
                <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">OUR PROMISE</span>
                <span className="block text-[11px] font-medium text-white">Expertise • Transparency • Trust</span>
              </div>
            </div>

            <Link
              href={trustCard.cta || "/about"}
              className="group/link inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-obsidian transition-all hover:brightness-105 shadow-sm hover:shadow-md cursor-pointer shrink-0"
            >
              <span>{trustCard.ctaText || "Learn More About Us"}</span>
              <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReasonCard({ item, index }) {
  const IconComp = REASON_ICONS[index % REASON_ICONS.length] || Compass;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[26px] border border-brand-cream-border bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_20px_45px_rgba(197,154,39,0.1)] sm:p-7"
    >
      {/* Large Decorative Number */}
      <div className="pointer-events-none absolute -right-2 -top-5 font-serif text-[110px] leading-none text-brand-navy/[0.035] transition-all duration-500 group-hover:text-brand-gold/[0.08]">
        {item.id || String(index + 1).padStart(2, "0")}
      </div>

      <div className="absolute left-7 top-0 h-[2px] w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-cream-border bg-brand-ivory text-brand-gold-deep shadow-xs transition-all duration-300 group-hover:bg-brand-navy group-hover:text-brand-ivory">
          <IconComp size={20} strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-brand-gold-deep">
            {item.badge}
          </div>
          <h4 className="font-serif text-lg font-bold leading-snug tracking-tight text-brand-navy sm:text-xl">
            {item.title}
          </h4>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-xs leading-relaxed text-brand-slate sm:text-sm">
        {item.description}
      </p>

      {/* Tags */}
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {(item.tags || []).map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-cream-border bg-brand-ivory px-2.5 py-1 text-[9px] font-medium text-brand-navy"
          >
            <CheckCircle2 size={11} className="text-brand-gold-deep" />
            {tag}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-brand-cream-border pt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold-deep">
        <span>SAUDAGAR ADVANTAGE</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-cream-border text-brand-navy transition-colors group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-white">
          <ArrowUpRight size={12} />
        </div>
      </div>
    </motion.article>
  );
}

export default function WhyChooseUsSection() {
  const { sections } = useCms();
  const whyData = sections?.whyChooseUs || {};

  const badge = whyData.badge || "Why Choose Us";
  const titleMain = whyData.titleMain || "Decades of Unrivaled";
  const titleItalic = whyData.titleItalic || "Gurgaon Mastery";
  const description = whyData.description || "With deep roots in DLF Phases and premier Gurgaon micro-markets, we bring institutional rigor, discretion, and market dominance to every luxury property transaction.";
  const reasons = whyData.reasons || [];
  const trustCard = whyData.trustCard || {
    badge: "Trusted Partner",
    title: "Property Dealers in Gurgaon You Can Trust",
    p1: "We help customers buy, sell, and rent residential, commercial, and industrial properties across prime areas of Gurgaon and Gurugram, including DLF, Sushant Lok, and Udyog Vihar.",
    p2: "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget.",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Learn More About Us",
    cta: "/about"
  };

  return (
    <section className="relative overflow-hidden bg-brand-ivory-warm py-16 text-brand-navy sm:py-24 border-t border-brand-cream-border">
      <ArchitecturalBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Hooky Framer Motion Text Reveal */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            <Sparkles size={12} className="text-brand-gold" />
            <span>{badge}</span>
          </div>

          <LuxuryTextReveal
            text={titleMain}
            highlightText={titleItalic}
            className="text-3xl sm:text-5xl lg:text-6xl text-brand-navy font-bold leading-tight"
          />

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-brand-slate sm:text-sm">
            {description}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <TrustCard trustCard={trustCard} />
          </div>

          <div className="space-y-5 lg:col-span-7">
            {reasons.map((item, index) => (
              <ReasonCard
                key={item.id || index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}