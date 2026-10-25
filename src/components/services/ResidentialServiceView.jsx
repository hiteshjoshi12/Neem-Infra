"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Key, 
  Award,
  ChevronRight,
  Send,
  FileCheck,
  Layers,
  Check
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { useCms } from '@/context/CmsContext';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function ResidentialServiceView({ 
  initialData = null,
  residentialListings = [], 
  breadcrumbs = [],
  typologies = [],
  microMarkets = [],
  dueDiligenceSteps = [],
  specificationStandards = []
}) {
  const { sections } = useCms();
  const cms = sections?.page_residential || initialData || {};
  const heroData = cms?.hero || {};
  const activeMetrics = (cms?.metrics && cms.metrics.length > 0)
    ? cms.metrics
    : [];
  const heroCardData = heroData?.heroCard || {};
  const rawTypologies = (cms?.assetClasses && cms.assetClasses.length > 0)
    ? cms.assetClasses
    : (typologies && typologies.length > 0 ? typologies : []);

  const activeTypologies = (rawTypologies || []).map((item) => ({
    ...item,
    metrics: (item?.metrics && item.metrics.length > 0) ? item.metrics : [],
    features: (item?.features && item.features.length > 0) ? item.features : [],
    price: item?.price || item?.pricing || '',
  }));

  const rawMicroMarkets = (cms?.microMarkets && cms.microMarkets.length > 0)
    ? cms.microMarkets
    : (microMarkets && microMarkets.length > 0 ? microMarkets : []);

  const activeMicroMarkets = (rawMicroMarkets || []).map((market) => ({
    ...market,
    highlights: (market?.highlights && market.highlights.length > 0) ? market.highlights : []
  }));

  const activeDueDiligenceSteps = (cms?.dueDiligenceSteps && cms.dueDiligenceSteps.length > 0)
    ? cms.dueDiligenceSteps
    : (dueDiligenceSteps && dueDiligenceSteps.length > 0 ? dueDiligenceSteps : []);

  const activeSpecificationStandards = (cms?.specificationStandards && cms.specificationStandards.length > 0)
    ? cms.specificationStandards
    : (specificationStandards && specificationStandards.length > 0 ? specificationStandards : []);
  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy">
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-brand-obsidian text-white pt-32 sm:pt-36 pb-20 md:pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <Image
            src={heroData?.bgImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"}
            alt={heroData?.bgImageAlt || heroData?.imageAlt || "Luxury Residential Real Estate Architecture in DLF Gurugram"}
            fill
            priority
            fetchPriority="high"
            className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.05]"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian/85 via-brand-obsidian/50 to-transparent z-0 pointer-events-none" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.15) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href="/#services" className="hover:text-brand-gold transition-colors">Services</Link>
            <span className="text-slate-600">/</span>
            <span className="text-brand-gold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
              <span>Residential Advisory</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-brand-gold/40 text-brand-gold text-[11px] font-bold tracking-widest uppercase mb-5 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
                <Sparkles size={12} className="text-brand-gold" />
                <span>{heroData?.badge || "Premier Residential Advisory • DLF Gurugram"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-[1.12] mb-6">
                {heroData?.titleMain || "Luxury Builder Floors & "}{' '}
                <span className="italic font-light text-brand-gold">{heroData?.titleItalic || "Bespoke Villas in Gurgaon"}</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                {heroData?.subtitle || "From freehold residential plots and newly constructed independent floors in DLF Phase 1–4 to bespoke villas in Sushant Lok, Saudagar Properties delivers verified legal titles and confidential private advisory for discerning families."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#inventory"
                  className="px-7 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy-deep font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore Residential Portfolio</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href={`tel:${(heroData?.ctaPhone || "+91 98112 21207").replace(/\s+/g, '')}`}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <PhoneCall size={14} className="text-brand-gold" />
                  <span>Call {heroData?.ctaPhone || "+91 98112 21207"}</span>
                </a>
              </div>
            </motion.div>

            {/* Right Hero Feature Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-brand-navy/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs uppercase tracking-wider text-brand-text-dim">
                    {heroCardData.tag || "Advisory Authority"}
                  </span>
                  <span className="text-xs font-semibold text-brand-gold flex items-center gap-1">
                    <ShieldCheck size={14} /> {heroCardData.badge || "DLF Authorized Desk"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Key size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {heroCardData.feature1Title || "100% Clear & Verified Titles"}
                      </h4>
                      <p className="text-xs text-brand-text-dim mt-0.5">
                        {heroCardData.feature1Desc || "Every builder floor and plot undergoes 3-tier legal verification before listing."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {heroCardData.feature2Title || "Off-Market Builder Floors"}
                      </h4>
                      <p className="text-xs text-brand-text-dim mt-0.5">
                        {heroCardData.feature2Desc || "Direct access to pre-launch and confidential floors not listed on open public portals."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {heroCardData.feature3Title || "25+ Years DLF Leadership"}
                      </h4>
                      <p className="text-xs text-brand-text-dim mt-0.5">
                        {heroCardData.feature3Desc || "Trusted advisors to Gurgaon’s leading business families, doctors, and CXOs."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-brand-text-on-dark-muted">
                  <span>{heroCardData.statLabel || "Average Turnaround"}</span>
                  <span className="text-brand-gold font-semibold">
                    {heroCardData.statValue || "Seamless 14-Day Closure"}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= 4 KEY PERFORMANCE METRICS STRIP ================= */}
      {activeMetrics && activeMetrics.length > 0 && (
        <section className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 -mt-8 sm:-mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-brand-navy-deep/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {activeMetrics.map((m, idx) => (
                <div key={idx} className={`flex flex-col justify-between ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                      {m.value}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-0.5">
                      {m.label}
                    </h4>
                    <p className="text-[11px] text-brand-text-dim leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ================= RESIDENTIAL ASSET CLASSES ================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2.5">
            Architectural Living Typologies
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-navy font-bold">
            Prime Residential Asset Profiles
          </h2>
          <p className="text-brand-slate text-sm sm:text-base mt-4 leading-relaxed">
            Beyond standard listings, we curate high-value residential properties built with uncompromising structural engineering, clear title lineages, and distinctive luxury aesthetics.
          </p>
        </motion.div>

        <div className="space-y-10">
          {activeTypologies.map((item, index) => (
            <motion.div 
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              custom={index}
              variants={fadeUpVariant}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-brand-cream-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
            >
              {/* Image Column */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.alt || `${item.title} - Saudagar Properties`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden pointer-events-none" />
                <div className="absolute top-5 left-5 z-20 bg-brand-navy-deep/85 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-brand-gold uppercase tracking-wider">
                  {item.locations}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white lg:hidden z-20">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-brand-gold font-medium">{item.specs}</p>
                </div>
              </div>

              {/* Specifications Column */}
              <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between">
                <div>
                  <div className="hidden lg:flex items-center justify-between pb-4 border-b border-brand-cream-border mb-5">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-brand-navy group-hover:text-brand-gold transition-colors">{item.title}</h3>
                      <p className="text-xs text-brand-slate-light mt-0.5">{item.specs}</p>
                    </div>
                    <span className="text-lg font-bold text-brand-gold font-serif whitespace-nowrap ml-4">{item.price}</span>
                  </div>

                  {item.metrics && item.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-brand-ivory p-4 rounded-2xl border border-brand-cream-border">
                      {item.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate-light block mb-0.5">{m.label}</span>
                          <span className="text-xs font-bold text-brand-navy">{m.val || m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.features && item.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {item.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-brand-slate">
                          <CheckCircle2 size={14} className="text-brand-gold shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-brand-cream-border flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-brand-slate-light">Available in 300, 500 &amp; 1000 Sq. Yd Formats</span>
                  <a
                    href="#contact-desk"
                    className="py-2.5 px-6 rounded-xl bg-brand-navy-deep hover:bg-brand-gold text-brand-ivory hover:text-brand-navy-deep text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer"
                  >
                    <span>Inquire Asset Availability</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MICRO-MARKET CORRIDOR MATRIX ================= */}
      <section className="py-20 md:py-24 bg-brand-cream/60 border-y border-brand-cream-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2">
                Micro-Market Valuation Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-navy">
                DLF &amp; Gurugram Residential Corridor Intelligence
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate max-w-md">
              Comparative capital values, net rental yields, and urban livability indicators across Gurugram’s prime residential sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMicroMarkets.map((market, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-brand-cream-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-brand-cream-border mb-4">
                    <h3 className="font-serif text-xl font-bold text-brand-navy">{market.phase}</h3>
                    <span className="px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold text-[11px] font-bold">
                      Livability: {market.livabilityScore}
                    </span>
                  </div>

                  <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider mb-4">
                    {market.character}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-brand-ivory rounded-xl border border-brand-cream-border mb-5">
                    <div>
                      <span className="text-[10px] text-brand-slate-light uppercase block font-semibold">Plot Valuation</span>
                      <span className="text-xs font-bold text-brand-navy">{market.priceRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-slate-light uppercase block font-semibold">Rental Yield</span>
                      <span className="text-xs font-bold text-brand-navy">{market.rentalYield}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {(market.highlights || []).map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-brand-slate">
                        <Check size={12} className="text-brand-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/properties?search=${encodeURIComponent(market.phase)}`}
                  className="w-full py-2.5 rounded-lg bg-brand-ivory hover:bg-brand-navy-deep text-brand-navy-deep hover:text-white border border-brand-cream-border text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore {market.phase} Listings</span>
                  <ChevronRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7-POINT DUE DILIGENCE ROADMAP ================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2.5">
            Institutional Conveyance Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-navy font-bold">
            The Saudagar 7-Point Due Diligence &amp; Conveyance Roadmap
          </h2>
          <p className="text-brand-slate text-sm sm:text-base mt-4 leading-relaxed">
            Real estate in Gurugram demands uncompromising legal scrutiny. Every residential asset we represent undergoes a rigorous 7-stage title and municipal clearance audit before entering our client portfolio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDueDiligenceSteps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx}
              variants={fadeUpVariant}
              whileHover={{ y: -3 }}
              className={`p-7 rounded-2xl bg-white border border-brand-cream-border shadow-sm hover:border-brand-gold hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                idx === 6 ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-r from-white via-white to-brand-ivory-warm' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-brand-gold">{step.step}</span>
                  <FileCheck size={18} className="text-brand-gold" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-xs text-brand-slate leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ARCHITECTURAL & ENGINEERING SPECIFICATIONS ================= */}
      <section className="py-20 bg-brand-obsidian text-white border-y border-white/10 relative overflow-hidden">
        <div 
          aria-hidden="true" 
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.12) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2.5">
              Engineering Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">
              Bespoke Builder Floor Technical Standards
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              We exclusively represent builder floors engineered to ultra-luxury specifications, from thermal glass façades to dedicated smart infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeSpecificationStandards || []).map((spec, sIdx) => (
              <motion.div 
                key={sIdx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={sIdx}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-4">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-4">{spec.category}</h3>
                  <div className="space-y-3">
                    {spec.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-brand-gold shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED INVENTORY GRID ================= */}
      <section id="inventory" className="py-20 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2">
              Verified Properties
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-navy">
              Featured Residential Listings
            </h2>
          </div>
          <Link
            href="/properties?category=residential"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy hover:text-brand-gold uppercase tracking-wider transition-colors"
          >
            <span>View All Residential Properties</span>
            <ArrowRight size={14} className="text-brand-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {residentialListings.map((prop, i) => (
            <motion.div 
              key={prop._id || prop.id || i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUpVariant}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-brand-cream-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={prop.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                  alt={prop.imgAlt || prop.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-20 bg-brand-obsidian/90 backdrop-blur-md border border-white/15 text-brand-gold px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                  {prop.tag || "For Sale"}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif font-bold text-base text-brand-navy group-hover:text-brand-gold transition-colors mb-1 truncate">{prop.title}</h3>
                  <p className="text-xs text-brand-slate flex items-center gap-1 mb-2">
                    <MapPin size={12} className="text-brand-gold shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </p>
                  <p className="text-xs text-brand-slate-light mb-3 line-clamp-1">{prop.specs}</p>
                </div>

                <div className="pt-3 border-t border-brand-cream-border flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-gold font-serif">{prop.price}</span>
                  <Link
                    href={prop.slug ? `/properties/${prop.slug}` : prop.link || "/contact"}
                    className="px-3 py-1.5 rounded-lg bg-brand-navy-deep text-white text-[11px] font-semibold hover:bg-brand-gold hover:text-brand-obsidian transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PRIVATE CONSULTATION ACTION BANNER ================= */}
      <section id="contact-desk" className="py-16 bg-brand-navy-deep text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold block mb-3">
            {cms?.cta?.badge || "Confidential Real Estate Desk"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-brand-ivory mb-4">
            {cms?.cta?.titleMain || "Looking for an Exclusive Residential Property?"}{' '}
            {cms?.cta?.titleItalic && <span className="italic text-brand-gold">{cms.cta.titleItalic}</span>}
          </h2>
          <p className="text-brand-text-on-dark-muted text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {cms?.cta?.subtitle || "Share your preferred phase, plot size, and budget with our senior partners. We arrange private, discreet site viewings with complete title verification."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy-deep font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book Private Consultation</span>
              <Send size={13} />
            </Link>

            <a
              href={cms?.cta?.whatsappUrl || "https://wa.me/919718511207"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <WhatsAppIcon size={16} />
              <span>WhatsApp Us Direct</span>
            </a>

            {cms?.cta?.phone && (
              <a
                href={`tel:${cms.cta.phone.replace(/\s+/g, '')}`}
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall size={14} className="text-brand-gold" />
                <span>Call {cms.cta.phone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
