"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Compass, 
  FileCheck,
  Sparkles,
  Award,
  Building2,
  TrendingUp,
  MapPin,
  MessageCircle,
  Briefcase
} from 'lucide-react';

const PILLAR_ICONS = {
  ShieldCheck,
  Users,
  FileCheck,
  Compass,
};

export default function TeamInteractiveShowcase({ founders, teamMembers, advisoryPillars }) {
  const [activeFounderIndex, setActiveFounderIndex] = useState(0);
  const activeFounder = founders[activeFounderIndex] || founders[0];

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 2: LIGHT — INTERACTIVE 3D SPLIT SHOWCASE (FOUNDERS & PORTFOLIO WORK)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#F7F5EF] text-[#17213D] relative overflow-hidden">
        {/* Subtle architectural grid pattern */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(#D09A16_1px,transparent_1px),linear-gradient(90deg,#D09A16_1px,transparent_1px)] [background-size:48px_48px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#17213D]/10"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#D09A16] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                <Award size={13} />
                <span>Executive Leadership &amp; Track Record</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] tracking-tight leading-tight">
                Principal Advisory <span className="italic font-serif text-[#D09A16]">Split Showcase</span>
              </h2>
            </div>

            {/* Founder Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#17213D]/10 shadow-sm">
              {founders.map((f, idx) => {
                const isActive = activeFounderIndex === idx;
                return (
                  <button
                    key={f.name}
                    onClick={() => setActiveFounderIndex(idx)}
                    className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#17213D] text-white shadow-md' 
                        : 'text-[#566078] hover:text-[#17213D] hover:bg-[#F7F5EF]'
                    }`}
                  >
                    <span>{f.name.replace('Mr. ', '').replace('Mrs. ', '')}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ================= 3D SPLIT VIEW COMPONENT ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFounder.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#17213D]/10 shadow-[0_20px_50px_rgba(23,33,61,0.06)]"
            >
              {/* LEFT COLUMN: 3D Perspective Photo & Floating Verified Badges */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none [perspective:1200px]">
                  
                  {/* Outer Ambient Glow Ring */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#D09A16]/20 via-transparent to-[#17213D]/10 blur-xl pointer-events-none" />

                  {/* 3D Elevated Card */}
                  <motion.div 
                    whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#D09A16]/40 shadow-[0_25px_60px_-15px_rgba(208,154,22,0.25)] bg-[#0A0E17]"
                  >
                    <Image
                      src={activeFounder.image}
                      alt={activeFounder.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover object-top filter brightness-95 contrast-105"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/20 to-transparent" />

                    {/* Floating Experience Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-[#0A0E17]/90 backdrop-blur-md border border-[#D09A16]/40 text-[#D09A16] text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Sparkles size={12} />
                      <span>{activeFounder.experience}</span>
                    </div>

                    {/* Bottom Floating Identity Card */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-2xl bg-[#0A0E17]/85 backdrop-blur-md border border-white/10 text-white">
                      <h3 className="text-xl font-serif font-bold text-white mb-0.5">
                        {activeFounder.name}
                      </h3>
                      <p className="text-xs text-[#D09A16] font-medium tracking-wide">
                        {activeFounder.role}
                      </p>
                    </div>
                  </motion.div>

                  {/* Floating 3D Metric Stamp (Bottom Right) */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -bottom-5 -right-3 sm:-right-5 z-20 px-4 py-3 rounded-2xl bg-white border border-[#17213D]/15 shadow-xl flex items-center gap-3 text-[#17213D]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center font-bold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#17213D]">
                        100% Freehold
                      </span>
                      <span className="block text-[10px] text-[#566078]">
                        Clean Title Mandates
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* RIGHT COLUMN: Highlighted Work, Career Mandates & Fiduciary Record */}
              <div className="lg:col-span-7 space-y-6">
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-2">
                    {activeFounder.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#17213D] leading-tight mb-4">
                    Architect of Premier Transactions &amp; Family Wealth
                  </h3>
                  <p className="text-sm sm:text-base text-[#566078] leading-relaxed font-sans">
                    {activeFounder.bio}
                  </p>
                </div>

                {/* Highlighted Quote Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF] border-l-4 border-[#D09A16] italic text-[#17213D] text-sm sm:text-base font-serif">
                  &ldquo;{activeFounder.quote}&rdquo;
                </div>

                {/* Key Portfolio Highlights & Work Accomplishments */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A95A7]">
                    Highlighted Track Record &amp; Mandates:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeFounder.highlights.map((item, hIdx) => (
                      <div 
                        key={hIdx} 
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F5EF] border border-[#17213D]/5 text-xs text-[#17213D] font-medium"
                      >
                        <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Connect Action Row */}
                <div className="pt-4 border-t border-[#17213D]/10 flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/919718511207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#17213D] hover:bg-[#D09A16] text-[#F7F5EF] hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Direct Mandate</span>
                  </a>

                  <a
                    href="tel:+919811221207"
                    className="px-6 py-3 rounded-xl bg-[#F7F5EF] hover:bg-[#EFEBE1] border border-[#17213D]/15 text-[#17213D] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Phone size={14} className="text-[#D09A16]" />
                    <span>Call Desk (+91 98112 21207)</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DARK — SENIOR ADVISORY & TRANSACTION SPECIALISTS (3D TILT CARDS)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#0A0E17] text-white relative overflow-hidden border-y border-white/10">
        
        {/* Ambient Gold Beams */}
        <div 
          className="absolute top-1/3 right-1/4 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.12) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
              <Briefcase size={13} className="text-[#D09A16]" />
              <span>Specialized Transaction Desks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Senior Advisors &amp; <span className="italic font-serif text-[#D09A16]">Corridor Specialists</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans mt-4 max-w-xl mx-auto">
              Direct mandate representation across DLF Phase 1–5 kothis, Golf Course Road sky penthouses, and Cybercity Grade-A commercial leasing.
            </p>
          </motion.div>

          {/* 3D Tilt Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/60 p-6 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_20px_40px_rgba(208,154,22,0.15)]"
              >
                <div>
                  {/* Photo Container with 3D Depth */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#17213D]/60 mb-6 border border-white/10 group-hover:border-[#D09A16]/40 transition-colors">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent opacity-80" />
                    
                    {/* Focus Badge */}
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-[#0A0E17]/85 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-[#D09A16] flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{member.focus}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D09A16] transition-colors mb-1">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                    {member.designation}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>

                {/* Direct Action Strip */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <a
                    href="tel:+919811221207"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D09A16] hover:text-white transition-colors"
                  >
                    <Phone size={12} />
                    <span>Connect Direct</span>
                  </a>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Verified Advisor
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LIGHT — THE 4 FIDUCIARY ADVISORY PILLARS
      ========================================================================= */}
      <section className="py-20 md:py-24 bg-[#F7F5EF] text-[#17213D] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-2">
              Our Working Principles
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D]">
              Why Discerning Families <span className="italic font-serif text-[#D09A16]">Trust Our Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisoryPillars.map((pillar, pIdx) => {
              const IconComp = (typeof pillar.icon === 'string' ? PILLAR_ICONS[pillar.icon] : pillar.icon) || ShieldCheck;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: pIdx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white p-7 rounded-3xl border border-[#17213D]/10 hover:border-[#D09A16]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center mb-5 font-bold">
                      <IconComp size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#17213D] mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#566078] leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: DARK — CONFIDENTIAL PRIVATE MANDATE CTA
      ========================================================================= */}
      <section className="py-20 bg-[#0A0E17] text-white relative overflow-hidden border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D09A16] block mb-3">
            Principal Direct Line
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Consult Directly with Our <span className="italic font-serif text-[#D09A16]">Managing Partners</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans">
            Whether inquiring about prime freehold plots in DLF Phase 1, off-market builder floors in Phase 2, or commercial pre-leased assets, connect with Mr. Arun Sharma &amp; senior leadership today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0A0E17] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(208,154,22,0.3)] transition-all flex items-center gap-2"
            >
              <span>Schedule Private Consultation</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href="https://wa.me/919718511207"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs uppercase tracking-wider backdrop-blur-md transition-colors"
            >
              WhatsApp Our Founders
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
