"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import TeamInteractiveShowcase from '@/components/team/TeamInteractiveShowcase';
import TeamAdvisoryAuthority from '@/components/team/TeamAdvisoryAuthority';

export default function TeamClientView({ 
  initialData,
  defaultFounders = [], 
  teamMembers = [], 
  advisoryPillars = [] 
}) {
  const { sections, properties } = useCms();
  const cms = sections?.page_team || initialData || {};
  const heroData = cms?.hero || {};
  const currentYears = Math.max(1, new Date().getFullYear() - 1999);
  const activePropsCount = properties?.length || 23;
  const heroStats = heroData?.stats || [
    { value: `${currentYears}+`, label: "Years in Gurugram", highlight: false },
    { value: `${activePropsCount}+`, label: "Properties Listed", highlight: true },
    { value: "7", label: "Micro-Markets", highlight: false },
    { value: "5", label: "DLF Phases Covered", highlight: true }
  ];
  const activeFounders = (cms?.founders && cms.founders.length > 0)
    ? cms.founders
    : (defaultFounders && defaultFounders.length > 0 ? defaultFounders : [
        { name: "Arun Sharma", role: "Founder & Managing Director" },
        { name: "Suneeta Chawla", role: "Co-Founder & Director" }
      ]);

  const activeTeamMembers = (cms?.teamMembers && cms.teamMembers.length > 0)
    ? cms.teamMembers
    : (teamMembers && teamMembers.length > 0 ? teamMembers : []);

  const activeAdvisoryPillars = (cms?.advisoryPillars && cms.advisoryPillars.length > 0)
    ? cms.advisoryPillars
    : (advisoryPillars && advisoryPillars.length > 0 ? advisoryPillars : []);
  const activeCta = cms?.cta || { title: "Speak Directly with Leadership", buttonText: "Schedule Consultation", buttonHref: "/contact" };

  return (
    <>
      {/* =========================================================================
          1. EDITORIAL HEADER & TEAM MISSION (DARK LUXURY OPENING SCREEN)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-brand-obsidian text-white pt-32 sm:pt-36 pb-20 md:pb-24 border-b border-white/10">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
          <Image
            src={heroData?.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"}
            alt={heroData?.bgImageAlt || heroData?.imageAlt || "DLF Luxury Estate Architecture"}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-obsidian/80 via-brand-obsidian/45 to-brand-obsidian/95" />
        </div>

        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.15) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-brand-gold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
              <span>Our Team</span>
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-brand-gold/40 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(208,154,22,0.15)]">
              <Users size={14} className="text-brand-gold" />
              <span>{heroData?.badge || "Saudagar Properties Advisory Board"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight mb-6">
              {heroData?.titleMain || "Our Leadership & "}{' '}
              <span className="italic font-serif text-brand-gold">{heroData?.titleItalic || "Advisory Principals"}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl mx-auto">
              {heroData?.subtitle || "For more than 25 years, Saudagar Properties has provided confidential, principal-led counsel to discerning families, corporate leaders, and NRI investors acquiring prime estates across DLF Phase 1–5, Sushant Lok, and Golf Course Road."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              {heroStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center hover:border-brand-gold/40 transition-colors">
                  <span className={`block text-2xl sm:text-3xl font-serif font-bold ${stat.highlight ? 'text-brand-gold' : 'text-white'}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE 3D SPLIT SHOWCASE
      ========================================================================= */}
      <TeamInteractiveShowcase
        founders={activeFounders}
        teamMembers={activeTeamMembers}
        advisoryPillars={activeAdvisoryPillars}
        cta={activeCta}
      />

      {/* =========================================================================
          7 STRATEGIC ADVISORY PROTOCOLS & SEO KEYWORD KNOWLEDGE BASE
      ========================================================================= */}
      <TeamAdvisoryAuthority />
    </>
  );
}
