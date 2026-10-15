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
import Link from 'next/link';
import LuxuryTextReveal from '@/components/ui/LuxuryTextReveal';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import { WHY_CHOOSE_US_PILLARS, TRADITIONAL_VS_SAUDAGAR } from '@/constants/aboutData';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';

const PILLAR_ICONS = [
  Award,
  Building2,
  Compass,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Scale
];

export default function AboutWhyChooseUs() {
  const { sections } = useCms();
  const cms = sections?.page_about?.whyChooseUs || DEFAULT_SECTIONS?.page_about?.whyChooseUs;
  const pillarsList = (cms?.pillars && Array.isArray(cms.pillars) && cms.pillars.length > 0) 
    ? cms.pillars 
    : WHY_CHOOSE_US_PILLARS;

  const leadPillar = pillarsList[0] || WHY_CHOOSE_US_PILLARS[0];
  const gridPillars = pillarsList.slice(1);

  return (
    <section className="py-20 md:py-28 bg-[#F7F5EF] text-[#17213D] border-t border-[#17213D]/10 relative overflow-hidden">
      {/* Subtle Luxury Watermark Grid */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:48px_48px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Hooky Word Reveal */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#D09A16] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={13} />
            <span>{cms?.badge || "Why Choose Saudagar Properties • Fiduciary Distinction"}</span>
          </div>

          <LuxuryTextReveal
            text={cms?.titleMain || "The Saudagar Distinction: 7 Strategic Pillars of Trust & "}
            highlightText={cms?.titleItalic || "Market Leadership"}
            className="text-3xl sm:text-4xl md:text-5xl text-[#17213D] mb-4"
          />

          <p className="text-sm sm:text-base text-[#566078] leading-relaxed font-sans max-w-2xl">
            {cms?.subtitle || "For more than 25 years, high-net-worth families, family offices, and NRI investors have chosen Saudagar Properties for direct founder-led transactions, uncompromising legal title due diligence, and privileged off-market inventory across DLF Gurugram."}
          </p>
        </div>

        {/* 1. LEAD HERO HIGHLIGHT CARD (Pillar 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#17213D]/10 hover:border-[#D09A16]/50 shadow-[0_20px_50px_rgba(23,33,61,0.05)] mb-10 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D09A16]/10 text-[#D09A16] text-[11px] font-bold uppercase tracking-widest">
                <Award size={13} />
                <span>Pillar 01 • {leadPillar.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] tracking-tight">
                {leadPillar.title}
              </h3>

              <p className="text-sm text-[#566078] leading-relaxed font-sans">
                {leadPillar.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#17213D]/10">
                {leadPillar.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#17213D] font-medium">
                    <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Authority Counters Badge */}
            <div className="lg:col-span-4 bg-[#17213D] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D09A16]">
                Guaranteed Standard
              </span>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-serif font-bold text-white">25+ Years</div>
                  <div className="text-xs text-slate-300">DLF Phase 1–5 Pioneer Authority</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-[#D09A16]">100% Direct</div>
                  <div className="text-xs text-slate-300">Founders Personally Attend Every Deal</div>
                </div>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-[#D09A16] transition-colors pt-2 border-t border-white/10"
              >
                <span>Schedule Consultation</span>
                <ArrowRight size={14} className="text-[#D09A16]" />
              </Link>
            </div>

          </div>
        </motion.div>

        {/* 2. THE 6 PILLARS LUXURY GRID (Pillars 2 to 7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {gridPillars.map((pillar, idx) => {
            const IconComp = PILLAR_ICONS[idx + 1] || ShieldCheck;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-3xl p-6 sm:p-7 border border-[#17213D]/10 hover:border-[#D09A16]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center font-bold group-hover:bg-[#17213D] group-hover:text-white transition-colors">
                      <IconComp size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D09A16] bg-[#D09A16]/10 px-2.5 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug mb-3">
                    {pillar.title}
                  </h4>

                  <p className="text-xs text-[#566078] leading-relaxed font-sans mb-5 line-clamp-3">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#17213D]/10 space-y-2">
                  {pillar.bullets.slice(0, 2).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-[11px] text-[#475569]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shrink-0 mt-1.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. FIDUCIARY COMPARISON MATRIX */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#17213D]/10 shadow-[0_15px_35px_rgba(23,33,61,0.04)]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-2">
              Transparency Benchmark
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
              Traditional Brokerage vs. <span className="italic font-serif text-[#D09A16]">Saudagar Advisory</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(cms?.comparisonMatrix && Array.isArray(cms.comparisonMatrix) && cms.comparisonMatrix.length > 0
              ? cms.comparisonMatrix
              : TRADITIONAL_VS_SAUDAGAR
            ).map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#17213D]/10 space-y-3"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[#17213D]">
                  {item.feature}
                </div>
                
                <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200">
                  <X size={14} className="shrink-0 mt-0.5 text-rose-500" />
                  <span>{item.traditional}</span>
                </div>

                <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 font-semibold">
                  <Check size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{item.saudagar}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#17213D]/10">
            <span className="text-xs text-[#566078]">
              Ready to experience fiduciary property representation in Gurugram?
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919718511207"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white border border-[#17213D]/20 hover:border-[#D09A16] text-[#17213D] text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span>WhatsApp Advisor</span>
              </a>
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-xl bg-[#17213D] hover:bg-[#D09A16] text-white hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all"
              >
                Contact Founders
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
