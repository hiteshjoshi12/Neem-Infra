"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  ShieldCheck, 
  Building2, 
  Compass, 
  TrendingUp, 
  Globe2, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  Check,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LuxuryTextReveal from '@/components/ui/LuxuryTextReveal';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import { useCms } from '@/context/CmsContext';

const PILLAR_ICONS = [
  Award,
  Building2,
  Compass,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Scale
];

export default function AboutWhyChooseUs({ data }) {
  const { sections } = useCms();
  const cms = data || sections?.page_about?.whyChooseUs || {};
  const pillarsList = (cms?.pillars && Array.isArray(cms.pillars) && cms.pillars.length > 0) 
    ? cms.pillars 
    : [];

  const leadPillar = pillarsList[0] || {
    badge: "Principal Pillar",
    title: "Direct Founder-Led Fiduciary Guidance",
    description: "Every significant residential and commercial portfolio transaction is personally supervised by our executive founders.",
    bullets: ["Zero Junior Delegations", "High-Stakes Advisory"]
  };
  const gridPillars = pillarsList.slice(1);

  return (
    <section className="py-20 md:py-28 bg-brand-ivory-warm text-brand-navy border-t border-brand-cream-border relative overflow-hidden">
      {/* Subtle Luxury Watermark Grid */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:48px_48px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Hooky Word Reveal */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={13} />
            <span>{cms?.badge || "Why Choose Saudagar Properties • Fiduciary Distinction"}</span>
          </div>

          <LuxuryTextReveal
            text={cms?.titleMain || "The Saudagar Distinction: 7 Strategic Pillars of Trust & "}
            highlightText={cms?.titleItalic || "Market Leadership"}
            className="text-3xl sm:text-4xl md:text-5xl text-brand-navy mb-4"
          />

          <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-sans max-w-2xl">
            {cms?.subtitle || "For more than 25 years, high-net-worth families, family offices, and NRI investors have chosen Saudagar Properties for direct founder-led transactions, uncompromising legal title due diligence, and privileged off-market inventory across DLF Gurugram."}
          </p>
        </div>

        {/* 1. LEAD HERO HIGHLIGHT CARD (Pillar 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-navy/10 hover:border-brand-gold/50 shadow-[0_20px_50px_rgba(23,33,61,0.05)] mb-10 relative overflow-hidden group"
        >
          {leadPillar.image && (
            <div className="relative aspect-[21/9] sm:aspect-[28/9] w-full rounded-2xl overflow-hidden mb-8 border border-brand-navy/10 bg-slate-100">
              <Image
                src={leadPillar.image}
                alt={leadPillar.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1100px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 sm:left-6 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-navy-deep text-[10px] font-bold tracking-widest uppercase shadow-md">
                  Pillar 01 • {leadPillar.badge}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              {!leadPillar.image && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[11px] font-bold uppercase tracking-widest">
                  <Award size={13} />
                  <span>Pillar 01 • {leadPillar.badge}</span>
                </div>
              )}

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy tracking-tight">
                {leadPillar.title}
              </h3>

              <p className="text-sm text-brand-slate leading-relaxed font-sans">
                {leadPillar.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-brand-navy/10">
                {leadPillar.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-brand-navy font-medium">
                    <CheckCircle2 size={15} className="text-brand-gold shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Authority Counters Badge */}
            <div className="lg:col-span-4 bg-brand-navy text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Guaranteed Standard
              </span>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-serif font-bold text-white">25+ Years</div>
                  <div className="text-xs text-slate-300">DLF Phase 1–5 Pioneer Authority</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-brand-gold">100% Direct</div>
                  <div className="text-xs text-slate-300">Founders Personally Attend Every Deal</div>
                </div>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-brand-gold transition-colors pt-2 border-t border-white/10"
              >
                <span>Schedule Consultation</span>
                <ArrowRight size={14} className="text-brand-gold" />
              </Link>
            </div>

          </div>
        </motion.div>

        {/* 2. THE 6 PILLARS LUXURY SECTION (Pillars 2 to 7) */}
        <div className="mt-16 pt-16 border-t border-brand-navy/10 mb-16">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <ShieldCheck size={13} />
              <span>{cms?.gridBadge || "Core Strategic Advisory Pillars • Generational Authority"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-3">
              {cms?.gridTitle || "Strategic Pillars of Client Excellence & Asset Protection"}
            </h3>

            <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-sans max-w-2xl">
              {cms?.gridSubtitle || "Beyond founder-level representation, Saudagar Properties adheres to six rigorous advisory disciplines that eliminate transaction vulnerabilities, preserve sovereign family capital, and secure premier freehold estates across Gurugram."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPillars.map((pillar, idx) => {
              const IconComp = PILLAR_ICONS[(idx + 1) % PILLAR_ICONS.length] || ShieldCheck;
              return (
                <motion.div
                  key={pillar.id || idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-brand-navy/10 hover:border-brand-gold/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Pillar Card Image with Glassmorphic Badging */}
                    {pillar.image ? (
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 border border-brand-navy/10">
                        <Image
                          src={pillar.image}
                          alt={pillar.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
                        
                        <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-brand-navy/80 backdrop-blur-md text-brand-gold border border-white/10 flex items-center justify-center font-bold shadow-md">
                          <IconComp size={18} />
                        </div>

                        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-brand-navy bg-brand-ivory/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-brand-gold/20">
                          {pillar.badge}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold group-hover:bg-brand-navy group-hover:text-white transition-colors">
                          <IconComp size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full">
                          {pillar.badge}
                        </span>
                      </div>
                    )}

                    <h4 className="font-serif font-bold text-lg text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-3">
                      {pillar.title}
                    </h4>

                    <p className="text-xs text-brand-slate leading-relaxed font-sans mb-5 line-clamp-3">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-navy/10 space-y-2">
                    {pillar.bullets.slice(0, 2).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-[11px] text-brand-slate">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. FIDUCIARY COMPARISON DOSSIER - BESPOKE EDITORIAL REDESIGN */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-brand-cream-border shadow-[0_20px_50px_rgba(23,33,61,0.06)] relative overflow-hidden text-brand-navy">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-brand-gold/[0.06] blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-brand-gold/[0.04] blur-[100px]"
          />

          {/* Dossier Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-ivory border border-brand-gold/30 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3">
              <Scale size={13} />
              <span>Fiduciary Due Diligence Benchmark</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-navy tracking-tight">
              Traditional Brokerage <span className="text-brand-slate-light font-light font-sans text-xl sm:text-2xl">vs.</span>{" "}
              <span className="italic font-serif text-brand-gold">Saudagar Advisory</span>
            </h3>
            <p className="text-xs sm:text-sm text-brand-slate mt-3 max-w-xl mx-auto leading-relaxed font-sans">
              A transparent side-by-side comparative examination of standard market intermediary practices against Saudagar Properties&apos; rigorous fiduciary representation standard.
            </p>
          </div>

          {/* Side-by-Side Comparative Dossier Matrix */}
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Ledger Column Headers (Desktop) */}
            <div className="hidden md:grid md:grid-cols-12 gap-6 pb-4 mb-2 border-b border-brand-cream-border text-xs font-bold uppercase tracking-[0.2em]">
              <div className="col-span-4 text-brand-slate flex items-center gap-2">
                <span>Advisory Criterion</span>
              </div>
              <div className="col-span-4 text-brand-slate pl-4 border-l border-brand-cream-border">
                <span>Standard Brokerage</span>
              </div>
              <div className="col-span-4 text-brand-gold pl-4 border-l border-brand-gold/30 flex items-center justify-between">
                <span>Saudagar Protocol</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold uppercase font-mono tracking-widest">
                  Fiduciary
                </span>
              </div>
            </div>

            {/* Dossier Comparative Rows */}
            <div className="space-y-4 sm:space-y-3">
              {(cms?.comparisonMatrix && Array.isArray(cms.comparisonMatrix)
                ? cms.comparisonMatrix
                : []
              ).map((item, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl bg-brand-ivory-warm hover:bg-brand-cream border border-brand-cream-border hover:border-brand-gold/40 transition-all duration-300 p-5 sm:p-6 shadow-xs group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                    
                    {/* 1. Feature Criterion */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-brand-cream-border text-brand-gold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <span className="font-mono text-xs font-bold">0{idx + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-serif font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                          {item.feature}
                        </div>
                        <div className="text-[10px] text-brand-slate-light uppercase tracking-wider font-sans">
                          Comparative Standard
                        </div>
                      </div>
                    </div>

                    {/* 2. Traditional Brokerage (Muted, Objective Risk Reality) */}
                    <div className="md:col-span-4 md:pl-4 md:border-l md:border-brand-cream-border">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-slate mb-1.5 md:hidden">
                        Standard Brokerage:
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-brand-slate leading-relaxed font-sans">
                        <div className="w-4 h-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <X size={10} className="text-rose-500" />
                        </div>
                        <span>{item.traditional}</span>
                      </div>
                    </div>

                    {/* 3. Saudagar Advisory (Elevated, Fiduciary Excellence) */}
                    <div className="md:col-span-4 md:pl-4 md:border-l md:border-brand-gold/30">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1.5 md:hidden flex items-center gap-1.5">
                        <Sparkles size={11} />
                        <span>Saudagar Advisory:</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs font-medium text-emerald-900 leading-relaxed font-sans bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} className="text-emerald-700" />
                        </div>
                        <span className="text-emerald-950 font-semibold">{item.saudagar}</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Fiduciary Assurance Banner */}
            <div className="mt-8 p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/25 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-slate">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-gold shrink-0" />
                <span className="font-semibold text-brand-navy">Fiduciary Protocol:</span>
                <span className="text-brand-slate hidden sm:inline">Freehold Conveyance • 30-Year Tehsil Title Chain Due Diligence • Direct Representation</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">
                Verified Due Diligence
              </span>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-brand-cream-border">
              <span className="text-xs text-brand-slate">
                Ready to experience confidential, founder-led property representation in Gurugram?
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919718511207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <WhatsAppIcon size={15} />
                  <span>WhatsApp Principal</span>
                </a>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
