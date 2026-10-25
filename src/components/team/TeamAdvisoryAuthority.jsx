"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  Compass, 
  TrendingUp, 
  Globe2, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

const PROTOCOL_ICONS = {
  UserCheck,
  Award,
  Building2,
  Compass,
  TrendingUp,
  Globe2,
  Scale,
  ShieldCheck,
  Sparkles
};

export default function TeamAdvisoryAuthority({ advisoryDomains, domainsSection }) {
  const [activeTab, setActiveTab] = useState(0);

  const defaultAdvisoryDomains = [
    {
      id: "founder-oversight",
      badge: "Principal Leadership",
      title: "Principal-Led Deal Execution: Founders Personally Attend Every Negotiation",
      subtitle: "Uncompromising 25-Year Tradition of Direct Client Mandate Representation",
      icon: UserCheck,
      content: [
        "At Saudagar Properties, high-value real estate advisory is never delegated to junior relationship managers or telecallers. Founders Mr. Arun Sharma and Mrs. Suneeta Chawla personally evaluate every asset, lead all seller negotiations, and accompany clients to site inspections.",
        "With over two decades of dedicated service across Gurugram, our founders have cultivated direct relationships with ancestral plot owners, prominent developers, and institutional investors.",
        "This principal-first philosophy ensures total confidentiality, unvarnished market advice, and direct seller-to-buyer transactions completely free from middlemen markups."
      ],
      highlights: [
        "Founders personally present at every high-ticket contract closure",
        "Direct seller-to-buyer negotiations without broker chain commissions",
        "Confidential advisory protocols safeguarding HNI family privacy",
        "Bespoke pricing benchmarks backed by 25 years of local registry data"
      ]
    },
    {
      id: "dlf-registry-intelligence",
      badge: "Corridor Specialization",
      title: "DLF Phase 1–5 Hyper-Local Registry Intelligence & Master File Scrutiny",
      subtitle: "Navigating Freehold Conveyance, Municipal Allotments & Ancestral Titles",
      icon: Award,
      content: [
        "Every sector across DLF Phase 1, Phase 2, Phase 3, Phase 4, and Phase 5 possesses unique historical zoning norms, floor-area ratios (FAR), and municipal deed structures.",
        "Our advisory team maintains an exhaustive repository of original master allotments, mutation documents, and ownership chain traces across all DLF blocks.",
        "From prime Akashneem Marg and Jacaranda Marg in DLF Phase 2 to Arjun Marg and Silver Oak in DLF Phase 1, we provide clients with micro-market pricing data, historical appreciation curves, and forthcoming infrastructure impacts."
      ],
      highlights: [
        "Exhaustive micro-market intelligence across DLF Phase 1, 2, 3, 4 & 5",
        "Master allotment file validation and Tehsil mutation tracing",
        "Accurate per-square-yard land valuation benchmarks",
        "Guidance on building height permissions, setbacks, and stilt norms"
      ]
    },
    {
      id: "builder-floor-approvals",
      badge: "Independent Living",
      title: "Independent Builder Floor Specialization: Stilt + 4 Approvals & Occupation Certificates",
      subtitle: "Comprehensive Vetting of Structure Sanctions, Private Elevators & Gated Security",
      icon: Building2,
      content: [
        "Gurugram's modern builder floors require specialized architectural and statutory understanding. An independent floor purchase is only as secure as its municipal approvals.",
        "Our team conducts rigorous verification of structural drawings, Directorate of Town & Country Planning (DTCP) sanctions, and Haryana Shahari Vikas Pradhikaran (HSVP) occupation certificates.",
        "We inspect basement/stilt parking allocations, dedicated terrace demarcations, electrical load sanctions, and automated private elevator safety certifications before recommending any floor."
      ],
      highlights: [
        "Strict verification of Occupation Certificates (OC) and fire safety norms",
        "Independent demarcation of terrace rights and stilt parking slots",
        "300 to 1,000 sq. yard floor plates in DLF Phase 1–4 & Sushant Lok 1",
        "Full structural inspection including private lift and backup power"
      ]
    },
    {
      id: "super-luxury-condos",
      badge: "Ultra-HNI Estates",
      title: "Golf Course Road & Super-Luxury High-Rise Condominium Representation",
      subtitle: "Discreet Access to Trophy Penthouses in The Camellias, Aralias & Magnolias",
      icon: Compass,
      content: [
        "North India's premier residential corridor—Golf Course Road—demands discreet advisory tailored for sovereign wealth, top industrial leaders, and diaspora principals.",
        "Our senior investment advisors specialize in confidential resales and mandates within flagship super-luxury communities including DLF The Camellias, DLF The Aralias, and DLF The Magnolias.",
        "We analyze view corridors, private lift lobbies, penthouses, clubhouse privileges, and projected capital liquidity to ensure your capital allocation generates enduring prestige and value."
      ],
      highlights: [
        "Confidential advisory for DLF Golf Links super-luxury condominiums",
        "Comprehensive floor-by-floor view analysis and bespoke fit-out audits",
        "Access to unlisted penthouses and duplex residences on Golf Course Road",
        "Rental yield advisory for Fortune 500 CXO leasing mandates"
      ]
    },
    {
      id: "commercial-asset-desk",
      badge: "Institutional Yield",
      title: "Commercial Leasing & Pre-Leased Investment Desk: Institutional Yield Optimization",
      subtitle: "Grade-A Corporate Assets in DLF Cyber City Delivering 8% to 10% Stable Cash Flows",
      icon: TrendingUp,
      content: [
        "Saudagar Properties' commercial division represents multinational corporations, high-growth enterprises, and family offices seeking high-yield pre-leased commercial real estate.",
        "We curate institutional-grade office spaces in DLF Cyber City, Cyber Hub, Horizon Center, and Udyog Vihar, ensuring blue-chip tenants, long lease lock-ins (minimum 3 to 9 years), and built-in 15% escalation clauses.",
        "Our commercial specialists also guide investors through Shop-Cum-Office (SCO) commercial plot acquisitions along high-footfall growth corridors across new Gurugram."
      ],
      highlights: [
        "Pre-leased Grade-A office floors delivering 8%–10% net rental ROI",
        "Corporate leasing advisory across Cyber City and Golf Course Road",
        "Thorough tenant creditworthiness audits and lease covenant scrutiny",
        "SCO (Shop-Cum-Office) commercial plots with high footfall potential"
      ]
    },
    {
      id: "nri-fema-advisory",
      badge: "Global Client Desk",
      title: "NRI Cross-Border Property Advisory: FEMA Guidelines, NRE/NRO Banking & Power of Attorney",
      subtitle: "Fiduciary Assurance for Diaspora Families in the USA, UK, UAE & Singapore",
      icon: Globe2,
      content: [
        "For non-resident Indian (NRI) families living abroad, navigating property investments in Gurugram requires a trusted local partner who guarantees transparency and adherence to international legal norms.",
        "Our team manages the entire acquisition lifecycle: remote high-definition 4K video walkthroughs, digital document vetting, Special Power of Attorney (PoA) validation, and compliance with Reserve Bank of India (RBI) FEMA guidelines.",
        "When selling ancestral or investment properties, we orchestrate smooth capital repatriation into foreign currency bank accounts under Form 15CA and Form 15CB certifications."
      ],
      highlights: [
        "End-to-end FEMA and RBI regulatory compliance advisory",
        "Power of Attorney (PoA) drafting, attestation, and local registration",
        "Seamless funds transfer via NRE, NRO, and FCNR bank accounts",
        "Turnkey tenancy management and rental collection for overseas owners"
      ]
    },
    {
      id: "fiduciary-title-clearance",
      badge: "100% Clean Titles",
      title: "Zero-Conflict Fiduciary Standard: Transparent Valuations & Clean Conveyancing",
      subtitle: "Unblemished 25-Year Heritage of Flawless Title Clearance and Zero Litigation",
      icon: Scale,
      content: [
        "Real estate value is inseparable from the legal sanctity of its title. In an industry often clouded by conflicting incentives, Saudagar Properties maintains a strict zero-conflict fiduciary standard.",
        "Every single residential and commercial listing is subjected to exhaustive scrutiny: 30-year deed tracing at the local Tehsil, Non-Encumbrance Certificate (NEC) acquisition, tax receipt validation, and RERA registration checks.",
        "We do not represent speculative, disputed, or legally encumbered properties. Our reputation has been built over 25 years on delivering only 100% clean, verified, and ready-to-convey assets."
      ],
      highlights: [
        "Zero-litigation guarantee backed by 30-year local Tehsil registry searches",
        "Full HRERA (Haryana Real Estate Regulatory Authority) compliance check",
        "HSVP and DTCP zoning verification for every recommended property",
        "Transparent, benchmark-driven valuation advisory with zero hidden charges"
      ]
    }
  ];

  const domains = (Array.isArray(advisoryDomains) && advisoryDomains.length > 0)
    ? advisoryDomains
    : defaultAdvisoryDomains;

  const safeActiveTab = Math.min(activeTab, Math.max(0, domains.length - 1));
  const currentDomain = domains[safeActiveTab] || domains[0] || {};
  const contentParagraphs = Array.isArray(currentDomain.content)
    ? currentDomain.content
    : (typeof currentDomain.content === 'string' ? currentDomain.content.split('\n').filter(Boolean) : []);
  const highlightsList = Array.isArray(currentDomain.highlights)
    ? currentDomain.highlights
    : (typeof currentDomain.highlights === 'string' ? currentDomain.highlights.split('\n').filter(Boolean) : []);

  return (
    <section className="py-20 md:py-28 bg-brand-ivory text-brand-navy border-t border-brand-navy/10 relative overflow-hidden">
      {/* Subtle Luxury Watermark Grid */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:48px_48px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={13} />
            <span>{domainsSection?.badge || "Advisory Frameworks • SEO Keyword Authority"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy tracking-tight leading-tight mb-4">
            {domainsSection?.titleMain || "Our Core Competencies & "}{' '}
            <span className="italic font-serif text-brand-gold">{domainsSection?.titleItalic || "Fiduciary Advisory Protocols"}</span>
          </h2>
          <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-sans">
            {domainsSection?.subtitle || "Review the 7 specialized legal, strategic, and corridor advisory domains that define Saudagar Properties' leadership across Gurugram luxury real estate."}
          </p>
        </div>

        {/* Interactive Domain Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation: Structured Pillars */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-2">
              Advisory Protocol Areas (1–{domains.length})
            </div>
            {domains.map((domain, idx) => {
              const IconComp = (typeof domain.icon === 'string' ? PROTOCOL_ICONS[domain.icon] : domain.icon) || UserCheck;
              const isActive = safeActiveTab === idx;
              return (
                <button
                  key={domain.id || idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer ${
                    isActive
                      ? 'bg-brand-navy text-white border-brand-navy shadow-lg shadow-brand-navy/10'
                      : 'bg-white text-brand-navy border-brand-navy/10 hover:border-brand-gold/50 hover:bg-white/80'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isActive ? 'bg-brand-gold text-brand-obsidian' : 'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                      isActive ? 'text-brand-gold' : 'text-slate-500'
                    }`}>
                      {domain.badge}
                    </span>
                    <h3 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                      isActive ? 'text-white' : 'text-brand-navy'
                    }`}>
                      {domain.title}
                    </h3>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 mt-3 transition-transform ${
                    isActive ? 'text-brand-gold translate-x-1' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Detailed Semantic Content Display */}
          <div className="lg:col-span-7">
            <article className="bg-white rounded-3xl border border-brand-navy/10 p-6 sm:p-8 md:p-10 shadow-[0_15px_35px_rgba(23,33,61,0.04)]">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/25 text-[11px] font-bold uppercase tracking-widest mb-4">
                <span>Protocol 0{safeActiveTab + 1} of 0{domains.length}</span>
                <span>•</span>
                <span>{currentDomain.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy tracking-tight leading-snug mb-3">
                {currentDomain.title}
              </h3>

              <div className="text-xs sm:text-sm text-brand-gold font-semibold tracking-wide mb-6 pb-4 border-b border-brand-navy/10">
                {currentDomain.subtitle}
              </div>

              {/* In-Depth Keyword Content Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-brand-slate leading-relaxed font-sans mb-8">
                {contentParagraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Bulleted Highlights */}
              <div className="bg-brand-ivory rounded-2xl p-5 border border-brand-navy/5 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-gold" />
                  <span>Execution Deliverables &amp; Guarantees:</span>
                </h4>
                <ul className="space-y-2.5">
                  {highlightsList.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5 text-xs text-brand-slate">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-navy/10">
                <div className="text-[11px] text-brand-slate">
                  Speak directly with Mr. Arun Sharma or senior team:
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-gold hover:text-brand-obsidian text-white text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <span>Request Private Briefing</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

            </article>
          </div>

        </div>

      </div>
    </section>
  );
}
