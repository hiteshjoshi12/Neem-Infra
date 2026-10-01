import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, TrendingUp, Layers, Sparkles, ArrowRight, CheckCircle2, Building2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

const DEFAULT_REASONS_DATA = [
  {
    id: "01",
    title: "Understanding Your Requirements",
    badge: "Personalized Discovery",
    description: "We begin by understanding what matters most to you: the location, budget, property type, and your purpose for buying, selling, or renting. Whether you're looking for a flat in Sushant Lok, a builder floor in DLF, or a commercial office in Udyog Vihar, we tailor our approach to match your goals.",
    tags: ["Goal Alignment", "Budget Optimization", "Prime Location Match"]
  },
  {
    id: "02",
    title: "Experience in Real Estate Industry",
    badge: "25+ Years Market Insight",
    description: "With deep insight into Gurgaon's property market, we understand local price trends, demand and supply dynamics, and what makes a location valuable. As an experienced top real estate consultant in DLF Gurugram, we guide you to the right property whether residential, commercial, or industrial with complete transparency and expertise.",
    tags: ["Micro-Market Mastery", "Price Trend Forecasting", "100% Transparency"]
  },
  {
    id: "03",
    title: "Properties by Categories",
    badge: "Comprehensive Portfolio",
    description: "From luxury homes and builder floors to industrial warehouses and commercial spaces, we offer an extensive selection to fit your needs and budget. You'll find options that align perfectly with your lifestyle, investment goals, or business plans.",
    tags: ["DLF Floors & Plots", "Udyog Vihar Commercial", "Industrial Hubs"]
  }
];

const REASON_ICONS = [Compass, TrendingUp, Layers];

export default function WhyChooseUsSection() {
  const { sections } = useCms();
  const whyData = sections?.whyChooseUs || {};

  const badge = whyData.badge || "The Saudagar Advantage";
  const titleMain = whyData.titleMain || "Why Choose";
  const titleItalic = whyData.titleItalic || "Our Company?";
  const description = whyData.description || "Decades of unmatched local authority, ethical advisory, and client-first commitment across Gurgaon.";

  const trustCard = whyData.trustCard || {
    badge: "Trusted Partner",
    title: "Property Dealers in Gurgaon You Can Trust",
    p1: "We help customers buy, sell, and rent residential, commercial, and industrial properties across prime areas of Gurgaon and Gurugram, including DLF, Sushant Lok, and Udyog Vihar.",
    p2: "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget.",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  };

  const reasons = whyData.reasons || DEFAULT_REASONS_DATA;

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#FAF8F5] text-[#1D263B] overflow-hidden border-t border-[#EFECE6]">
      {/* Subtle Background Architectural Ambient Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1D263B_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-18">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#C5A880]/40 shadow-sm text-[11px] font-bold tracking-[0.22em] text-[#A27B48] uppercase mb-4">
            <Sparkles size={13} className="text-[#C5A880]" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1D263B] leading-[1.2] mb-4">
            {titleMain} <span className="italic font-light text-[#C5A880]">{titleItalic}</span>
          </h2>

          <p className="text-[#334155] text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* 3D Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* ==================== LEFT: FEATURED TRUST CARD ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group flex flex-col"
          >
            {/* Outer Decorative Double Gold Corners */}
            <div className="absolute -top-2.5 -left-2.5 w-14 h-14 border-t-2 border-l-2 border-[#C5A880] rounded-tl-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute -bottom-2.5 -right-2.5 w-14 h-14 border-b-2 border-r-2 border-[#C5A880] rounded-br-2xl pointer-events-none z-20 group-hover:scale-105 transition-transform duration-500" />

            {/* 3D Glassmorphic Card with Dark Slate Navy Theme */}
            <div className="h-full rounded-3xl bg-[#1D263B] text-white p-8 sm:p-10 md:p-12 shadow-[0_25px_60px_-15px_rgba(29,38,59,0.4)] flex flex-col justify-between relative overflow-hidden border border-white/15">

              {/* Architectural Image Background Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={trustCard.bgImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"}
                  alt="Modern Gurgaon Architecture"
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D263B] via-[#1D263B]/90 to-[#1D263B]/80" />
              </div>

              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Shield Icon Pill */}
                <div className="w-14 h-14 rounded-2xl bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={28} />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  {trustCard.badge || "Trusted Partner"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6 leading-snug">
                  {trustCard.title || "Property Dealers in Gurgaon You Can Trust"}
                </h3>

                <p className="text-slate-200 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                  {trustCard.p1}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mb-8">
                  {trustCard.p2}
                </p>
              </div>

              {/* CTA Action Button */}
              <div className="relative z-10 pt-6 border-t border-white/10">
                <Link
                  to={trustCard.ctaLink || "/about"}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#B5986D] text-[#1D263B] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(197,168,128,0.35)] group/link"
                >
                  <span>{trustCard.ctaText || "Learn More About Us"}</span>
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </motion.div>

          {/* ==================== RIGHT: 3 PILLAR CARDS ==================== */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            {reasons.map((item, idx) => {
              const IconComp = REASON_ICONS[idx % REASON_ICONS.length] || Compass;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_20px_45px_-10px_rgba(197,168,128,0.25)] hover:border-[#C5A880]/60 transition-all duration-500 overflow-hidden transform-gpu hover:-translate-y-1"
                >
                  {/* Subtle Top Gold Hover Glow Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* 3D Icon Pill */}
                    <div className="w-13 h-13 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#1D263B] group-hover:bg-[#C5A880] group-hover:text-[#1D263B] group-hover:border-[#C5A880] flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                      <IconComp size={24} />
                    </div>

                    <div className="flex-grow space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1D263B]">
                          {item.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#A27B48] text-[10px] font-bold tracking-wider uppercase">
                          {item.badge}
                        </span>
                      </div>

                      <p className="text-[#334155] text-xs sm:text-sm font-normal leading-relaxed">
                        {item.description}
                      </p>

                      {/* Micro Tags */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1D263B]"
                          >
                            <CheckCircle2 size={12} className="text-[#C5A880]" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
