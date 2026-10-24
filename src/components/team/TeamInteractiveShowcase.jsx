"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';

const PILLAR_ICONS = {
  ShieldCheck,
  Users,
  FileCheck,
  Compass,
};

export default function TeamInteractiveShowcase({ founders, teamMembers, advisoryPillars, cta }) {
  const [advisorIndex, setAdvisorIndex] = useState(0);
  const safeTeam = Array.isArray(teamMembers) ? teamMembers : [];
  const maxAdvisorIndex = Math.max(0, safeTeam.length - 3);

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 2: LIGHT — INTERACTIVE 3D SPLIT SHOWCASE (FOUNDERS & PORTFOLIO WORK)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-brand-ivory text-brand-navy relative overflow-hidden">
        {/* Subtle architectural grid pattern */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:48px_48px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16 pb-6 border-b border-brand-navy/10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              <Award size={13} />
              <span>Executive Leadership &amp; Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy tracking-tight leading-tight">
              Principal Advisory <span className="italic font-serif text-brand-gold">Executive Leadership</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-slate font-sans mt-3 leading-relaxed">
              Direct founder-led mandate representation. Both principal directors personally oversee registry vetting, valuation benchmarks, and confidential negotiations across DLF Gurugram.
            </p>
          </motion.div>

          {/* ================= DUAL EXECUTIVE SHOWCASE (BOTH LEADERS VISIBLE) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {(founders || []).map((leader, idx) => (
              <motion.div
                key={leader.name || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-navy/10 hover:border-brand-gold/60 shadow-[0_20px_50px_rgba(23,33,61,0.06)] hover:shadow-[0_25px_60px_rgba(208,154,22,0.12)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Portrait & Core Identity Row */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-7">
                    {/* 3D Elevated Portrait Frame */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-brand-gold/30 via-brand-gold/15 to-transparent blur-md group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-brand-gold/40 shadow-xl bg-brand-navy">
                        {leader.image ? (
                          <>
                            <Image
                              src={leader.image}
                              alt={leader.name}
                              fill
                              sizes="(max-width: 640px) 150px, 180px"
                              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent pointer-events-none" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy-deep to-slate-900 text-brand-gold p-4 text-center">
                            <span className="font-serif font-bold text-3xl tracking-wider text-brand-gold">
                              {leader.name ? leader.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'SP'}
                            </span>
                            <span className="text-[10px] tracking-widest uppercase text-slate-300 font-sans mt-2">
                              Principal Partner
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Floating Experience Badge */}
                      <div className="absolute -top-2.5 -left-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-brand-gold/40 text-brand-gold-deep text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles size={11} className="text-brand-gold-deep" />
                        <span>{leader.experience || leader.experienceBadge || '20+ Yrs'}</span>
                      </div>

                      {/* Floating Gold Award Seal */}
                      <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-light text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Award size={16} />
                      </div>
                    </div>

                    {/* Titles & Accolades */}
                    <div className="text-center sm:text-left flex-1 min-w-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold tracking-wider uppercase mb-2">
                        {leader.badge || 'Executive Leader'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy leading-tight mb-1">
                        {leader.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">
                        {leader.role}
                      </p>

                      {/* Philosophy Quote */}
                      {leader.quote && (
                        <div className="p-3 rounded-xl bg-brand-ivory border-l-4 border-l-brand-gold text-xs italic text-brand-slate leading-relaxed">
                          &ldquo;{leader.quote}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Biography */}
                  <p className="text-xs sm:text-sm text-brand-slate font-sans leading-relaxed mb-6">
                    {leader.bio}
                  </p>

                  {/* Highlights / Competencies */}
                  {Array.isArray(leader.highlights) && leader.highlights.length > 0 && (
                    <div className="pt-4 border-t border-brand-navy/10 space-y-2 mb-6">
                      {leader.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-brand-navy font-medium">
                          <CheckCircle2 size={14} className="text-brand-gold shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Connect Action Row */}
                <div className="pt-5 border-t border-brand-navy/10 flex flex-wrap items-center gap-2.5">
                  <a
                    href={leader?.whatsappUrl || cta?.whatsappUrl || "https://wa.me/919718511207"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[150px] px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <WhatsAppIcon size={15} />
                    <span>WhatsApp Direct</span>
                  </a>

                  <a
                    href={`tel:${(leader?.phone || cta?.phone || '+919811221207').replace(/[^0-9+]/g, '')}`}
                    className="px-4 py-2.5 rounded-xl bg-brand-ivory hover:bg-brand-cream border border-brand-navy/15 text-brand-navy text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Phone size={13} className="text-brand-gold" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LIGHT — SENIOR ADVISORY & TRANSACTION SPECIALISTS (CAROUSEL)
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-brand-ivory-warm text-brand-navy relative overflow-hidden border-y border-brand-cream-border">
        
        {/* Ambient Gold Beams */}
        <div 
          className="absolute top-1/3 right-1/4 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(197,154,39,0.12) 0%, rgba(197,154,39,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
            <div className="text-center sm:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-brand-gold/40 text-brand-gold-deep text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
                <Briefcase size={13} className="text-brand-gold-deep" />
                <span>Specialized Transaction Desks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy tracking-tight leading-tight">
                Senior Advisors &amp; <span className="italic font-serif text-brand-gold-deep">Corridor Specialists</span>
              </h2>
              <p className="text-sm sm:text-base text-brand-slate font-sans mt-3">
                Direct mandate representation across DLF Phase 1–5 kothis, Golf Course Road sky penthouses, and Cybercity Grade-A commercial leasing.
              </p>
            </div>

            {/* Carousel Navigation Buttons (Visible when teamMembers.length > 3) */}
            {safeTeam.length > 3 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setAdvisorIndex((prev) => Math.max(0, prev - 1))}
                  disabled={advisorIndex === 0}
                  aria-label="Previous Advisors"
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${
                    advisorIndex === 0
                      ? 'border-brand-cream-border text-brand-slate-light/40 cursor-not-allowed bg-white/40'
                      : 'border-brand-gold/50 text-brand-gold-deep hover:bg-brand-gold hover:text-white bg-white shadow-sm cursor-pointer'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setAdvisorIndex((prev) => Math.min(maxAdvisorIndex, prev + 1))}
                  disabled={advisorIndex >= maxAdvisorIndex}
                  aria-label="Next Advisors"
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${
                    advisorIndex >= maxAdvisorIndex
                      ? 'border-brand-cream-border text-brand-slate-light/40 cursor-not-allowed bg-white/40'
                      : 'border-brand-gold/50 text-brand-gold-deep hover:bg-brand-gold hover:text-white bg-white shadow-sm cursor-pointer'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* 3D Tilt Carousel Viewport */}
          <div className="overflow-hidden py-2">
            <div 
              className="flex transition-transform duration-500 ease-out gap-8"
              style={{
                transform: `translateX(calc(-${advisorIndex} * (100% / 3 + 32px / 3)))`
              }}
            >
              {safeTeam.map((member, idx) => (
                <div
                  key={member.name || idx}
                  className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] shrink-0 group relative rounded-3xl bg-white border border-brand-cream-border hover:border-brand-gold/60 p-6 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(197,154,39,0.12)] hover:-translate-y-2"
                >
                  <div>
                    {/* Photo Container with 3D Depth */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-brand-navy mb-6 border border-brand-cream-border group-hover:border-brand-gold/40 transition-colors">
                      {member.image ? (
                        <>
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy-deep to-slate-900 text-brand-gold p-4 text-center">
                          <span className="font-serif font-bold text-2xl tracking-wider text-brand-gold">
                            {member.name ? member.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'SP'}
                          </span>
                          <span className="text-[10px] tracking-widest uppercase text-slate-300 font-sans mt-1">
                            Advisory Specialist
                          </span>
                        </div>
                      )}
                      
                      {/* Focus Badge */}
                      <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-brand-cream-border text-[11px] font-semibold text-brand-gold-deep flex items-center gap-1.5 truncate shadow-sm">
                        <MapPin size={12} className="shrink-0 text-brand-gold-deep" />
                        <span className="truncate">{member.focus || 'DLF Phase 1–5'}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-brand-navy group-hover:text-brand-gold-deep transition-colors mb-1">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold-deep block mb-3">
                      {member.designation}
                    </span>
                    <p className="text-xs text-brand-slate leading-relaxed font-sans line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Direct Action Strip */}
                  <div className="pt-6 mt-6 border-t border-brand-cream-border flex items-center justify-between">
                    <a
                      href="tel:+919811221207"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold-deep hover:text-brand-navy transition-colors"
                    >
                      <Phone size={12} />
                      <span>Connect Direct</span>
                    </a>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-slate-light">
                      Verified Advisor
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots (Visible when teamMembers.length > 3) */}
          {safeTeam.length > 3 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: maxAdvisorIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setAdvisorIndex(dotIdx)}
                  aria-label={`Go to advisor slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    advisorIndex === dotIdx ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-cream-border hover:bg-brand-slate-light'
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LIGHT — THE 4 FIDUCIARY ADVISORY PILLARS
      ========================================================================= */}
      <section className="py-20 md:py-24 bg-brand-ivory text-brand-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold block mb-2">
              Our Working Principles
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy">
              Why Discerning Families <span className="italic font-serif text-brand-gold">Trust Our Team</span>
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
                  className="bg-white p-7 rounded-3xl border border-brand-navy/10 hover:border-brand-gold/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-5 font-bold">
                      <IconComp size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-brand-navy mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-brand-slate leading-relaxed font-sans">
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
          SECTION 5: LIGHT — CONFIDENTIAL PRIVATE MANDATE CTA
      ========================================================================= */}
      <section className="py-20 bg-brand-ivory-warm text-brand-navy relative overflow-hidden border-t border-brand-cream-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold-deep block mb-3">
            {cta?.badge || "Principal Direct Line"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4">
            {cta?.titleMain || "Consult Directly with Our "}{' '}
            <span className="italic font-serif text-brand-gold-deep">{cta?.titleItalic || "Managing Partners"}</span>
          </h2>
          <p className="text-brand-slate text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans">
            {cta?.subtitle || "Whether inquiring about prime freehold plots in DLF Phase 1, off-market builder floors in Phase 2, or commercial pre-leased assets, connect with Mr. Arun Sharma & senior leadership today."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light hover:brightness-105 text-white font-bold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(197,154,39,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Private Consultation</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href={cta?.whatsappUrl || "https://wa.me/919718511207"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <WhatsAppIcon size={16} />
              <span>WhatsApp Our Founders</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
