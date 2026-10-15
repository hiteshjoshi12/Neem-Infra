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
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function ResidentialServiceView({ 
  residentialListings = [], 
  breadcrumbs = [],
  typologies = [],
  microMarkets = [],
  dueDiligenceSteps = [],
  specificationStandards = []
}) {
  const { sections } = useCms();
  const cms = sections?.page_residential || DEFAULT_SECTIONS.page_residential;
  const heroData = cms?.hero || DEFAULT_SECTIONS.page_residential.hero;
  const rawTypologies = cms?.assetClasses && cms.assetClasses.length > 0 ? cms.assetClasses : typologies;
  const activeTypologies = (rawTypologies || []).map((item, idx) => {
    const base = typologies[idx] || {};
    return {
      ...base,
      ...item,
      metrics: item?.metrics || base?.metrics || [],
      features: item?.features || base?.features || [],
      price: item?.price || item?.pricing || base?.price || base?.pricing || '',
    };
  });
  const activeMicroMarkets = cms?.microMarkets && cms.microMarkets.length > 0 ? cms.microMarkets : microMarkets;
  const activeDueDiligenceSteps = cms?.dueDiligenceSteps && cms.dueDiligenceSteps.length > 0 ? cms.dueDiligenceSteps : dueDiligenceSteps;
  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D]">
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-[#0A0E17] text-white pt-32 sm:pt-36 pb-20 md:pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <Image
            src={heroData?.bgImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"}
            alt="Luxury Residential Real Estate Architecture in DLF Gurugram"
            fill
            priority
            fetchPriority="high"
            className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.05]"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17]/85 via-[#0A0E17]/50 to-transparent z-0 pointer-events-none" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.15) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href="/#services" className="hover:text-[#D09A16] transition-colors">Services</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-[11px] font-bold tracking-widest uppercase mb-5 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
                <Sparkles size={12} className="text-[#D09A16]" />
                <span>{heroData?.badge || "Premier Residential Advisory • DLF Gurugram"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-[1.12] mb-6">
                {heroData?.titleMain || "Luxury Builder Floors & "}{' '}
                <span className="italic font-light text-[#D09A16]">{heroData?.titleItalic || "Bespoke Villas in Gurgaon"}</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                {heroData?.subtitle || "From freehold residential plots and newly constructed independent floors in DLF Phase 1–4 to bespoke villas in Sushant Lok, Saudagar Properties delivers verified legal titles and confidential private advisory for discerning families."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#inventory"
                  className="px-7 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#b8850f] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore Residential Portfolio</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href={`tel:${(heroData?.ctaPhone || "+91 98112 21207").replace(/\s+/g, '')}`}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <PhoneCall size={14} className="text-[#D09A16]" />
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
              <div className="bg-[#17213D]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs uppercase tracking-wider text-[#9DA6B8]">Advisory Authority</span>
                  <span className="text-xs font-semibold text-[#D09A16] flex items-center gap-1">
                    <ShieldCheck size={14} /> DLF Authorized Desk
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <Key size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">100% Clear &amp; Verified Titles</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Every builder floor and plot undergoes 3-tier legal verification before listing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Off-Market Builder Floors</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Direct access to pre-launch and confidential floors not listed on open public portals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">25+ Years DLF Leadership</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Trusted advisors to Gurgaon’s leading business families, doctors, and CXOs.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#C9CED9]">
                  <span>Average Turnaround</span>
                  <span className="text-[#D09A16] font-semibold">Seamless 14-Day Closure</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= RESIDENTIAL ASSET CLASSES ================= */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2.5">
            Architectural Living Typologies
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#17213D] font-bold">
            Prime Residential Asset Profiles
          </h2>
          <p className="text-[#566078] text-sm sm:text-base mt-4 leading-relaxed">
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
              className="bg-white rounded-3xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
            >
              {/* Image Column */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt || `${item.title} - Saudagar Properties`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                <div className="absolute top-5 left-5 bg-[#0E162B]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-[#D09A16] uppercase tracking-wider">
                  {item.locations}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white lg:hidden">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#D09A16] font-medium">{item.specs}</p>
                </div>
              </div>

              {/* Specifications Column */}
              <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between">
                <div>
                  <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#F0ECE1] mb-5">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">{item.title}</h3>
                      <p className="text-xs text-[#8A95A7] mt-0.5">{item.specs}</p>
                    </div>
                    <span className="text-lg font-bold text-[#D09A16] font-serif whitespace-nowrap ml-4">{item.price}</span>
                  </div>

                  {item.metrics && item.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-[#F9F8F5] p-4 rounded-2xl border border-[#EDE8DF]">
                      {item.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A95A7] block mb-0.5">{m.label}</span>
                          <span className="text-xs font-bold text-[#17213D]">{m.val || m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.features && item.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {item.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#334155]">
                          <CheckCircle2 size={14} className="text-[#D09A16] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#8A95A7]">Available in 300, 500 &amp; 1000 Sq. Yd Formats</span>
                  <a
                    href="#contact-desk"
                    className="py-2.5 px-6 rounded-xl bg-[#0E162B] hover:bg-[#D09A16] text-[#F7F5EF] hover:text-[#0E162B] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer"
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
      <section className="py-20 md:py-24 bg-[#ECE8DF]/60 border-y border-[#DCD6C9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                Micro-Market Valuation Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17213D]">
                DLF &amp; Gurugram Residential Corridor Intelligence
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#566078] max-w-md">
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
                className="bg-white rounded-2xl border border-[#E2DDD5] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#F0ECE1] mb-4">
                    <h3 className="font-serif text-xl font-bold text-[#17213D]">{market.phase}</h3>
                    <span className="px-2.5 py-1 rounded bg-[#D09A16]/10 text-[#D09A16] text-[11px] font-bold">
                      Livability: {market.livabilityScore}
                    </span>
                  </div>

                  <p className="text-xs text-[#D09A16] font-semibold uppercase tracking-wider mb-4">
                    {market.character}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#F9F8F5] rounded-xl border border-[#EDE8DF] mb-5">
                    <div>
                      <span className="text-[10px] text-[#8A95A7] uppercase block font-semibold">Plot Valuation</span>
                      <span className="text-xs font-bold text-[#17213D]">{market.priceRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8A95A7] uppercase block font-semibold">Rental Yield</span>
                      <span className="text-xs font-bold text-[#17213D]">{market.rentalYield}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {(market.highlights || []).map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-[#566078]">
                        <Check size={12} className="text-[#D09A16] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/properties?search=${encodeURIComponent(market.phase)}`}
                  className="w-full py-2.5 rounded-lg bg-[#F7F5EF] hover:bg-[#0E162B] text-[#0E162B] hover:text-white border border-[#E2DDD5] text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
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
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2.5">
            Institutional Conveyance Assurance
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#17213D] font-bold">
            The Saudagar 7-Point Due Diligence &amp; Conveyance Roadmap
          </h2>
          <p className="text-[#566078] text-sm sm:text-base mt-4 leading-relaxed">
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
              className={`p-7 rounded-2xl bg-white border border-[#E2DDD5] shadow-sm hover:border-[#D09A16] hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                idx === 6 ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-r from-white via-white to-[#FAF8F5]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-[#D09A16]">{step.step}</span>
                  <FileCheck size={18} className="text-[#D09A16]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17213D] mb-2">{step.title}</h3>
                <p className="text-xs text-[#566078] leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ARCHITECTURAL & ENGINEERING SPECIFICATIONS ================= */}
      <section className="py-20 bg-[#0A0E17] text-white border-y border-white/10 relative overflow-hidden">
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
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2.5">
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
            {specificationStandards.map((spec, sIdx) => (
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
                  <div className="w-10 h-10 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center mb-4">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-4">{spec.category}</h3>
                  <div className="space-y-3">
                    {spec.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-[#D09A16] shrink-0 mt-0.5" />
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
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
              Verified Properties
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17213D]">
              Featured Residential Listings
            </h2>
          </div>
          <Link
            href="/properties?category=residential"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#17213D] hover:text-[#D09A16] uppercase tracking-wider transition-colors"
          >
            <span>View All Residential Properties</span>
            <ArrowRight size={14} className="text-[#D09A16]" />
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
              className="bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <Image
                  src={prop.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                  alt={prop.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0A0E17]/90 backdrop-blur-md border border-white/15 text-[#D09A16] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                  {prop.tag || "For Sale"}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#17213D] group-hover:text-[#D09A16] transition-colors mb-1 truncate">{prop.title}</h3>
                  <p className="text-xs text-[#566078] flex items-center gap-1 mb-2">
                    <MapPin size={12} className="text-[#D09A16] shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </p>
                  <p className="text-xs text-[#8A95A7] mb-3 line-clamp-1">{prop.specs}</p>
                </div>

                <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                  <span className="text-sm font-bold text-[#D09A16] font-serif">{prop.price}</span>
                  <Link
                    href={prop.slug ? `/properties/${prop.slug}` : prop.link || "/contact"}
                    className="px-3 py-1.5 rounded-lg bg-[#0E162B] text-white text-[11px] font-semibold hover:bg-[#D09A16] hover:text-[#0A0E17] transition-colors"
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
      <section id="contact-desk" className="py-16 bg-[#0E162B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D09A16] block mb-3">
            Confidential Real Estate Desk
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5EF] mb-4">
            Looking for an Exclusive Residential Property?
          </h2>
          <p className="text-[#C9CED9] text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light">
            Share your preferred phase, plot size, and budget with our senior partners. We arrange private, discreet site viewings with complete title verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#b8850f] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
            >
              <span>Book Private Consultation</span>
              <Send size={13} />
            </Link>

            <a
              href="https://wa.me/919718511207"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              <WhatsAppIcon size={16} />
              <span>WhatsApp Us Direct</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
