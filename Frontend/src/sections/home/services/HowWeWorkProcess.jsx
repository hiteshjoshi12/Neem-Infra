import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Users,
  CheckCircle2,
  Key,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Tilt3DCard from '../../../components/ui/Tilt3DCard';
import { useCms } from '../../../context/CmsContext';

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    phase: "PHASE 01",
    phaseTag: "Discovery & Alignment",
    title: "Understanding Your Purpose",
    tagline: "Tailored to your budget & aspirations",
    shortDesc: "We begin with a deep discovery session to map your exact residential, commercial, or industrial aspirations across DLF Gurugram.",
    fullDesc: "Whether you’re looking for a luxury kothi in DLF Phase 1–5, an ultra-penthouse on Golf Course Road, or corporate office spaces in Cybercity, we align with your financial goals, lifestyle needs, and investment timelines.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    guarantee: "Exclusive off-market DLF inventory access",
    highlights: [
      "In-depth requirement discovery session",
      "Budget & corridor location mapping",
      "Off-market & pre-vetted property access"
    ]
  },
  {
    step: "02",
    phase: "PHASE 02",
    phaseTag: "Strategic Advisory",
    title: "Planning with Our Experts",
    tagline: "Direct consultation without middlemen",
    shortDesc: "Engage in direct, confidential consultations with our founders and senior advisors, eliminating broker hassles and hidden fees.",
    fullDesc: "Our leadership personally evaluates legal titles, zoning clearances, and high-ROI potential to craft a tailored acquisition roadmap. We answer every question with absolute transparency.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    guarantee: "100% transparent negotiations with zero broker fees",
    highlights: [
      "Direct consultation with managing directors",
      "Zero hidden brokerages or duplicate markups",
      "Comprehensive legal & financial due diligence"
    ]
  },
  {
    step: "03",
    phase: "PHASE 03",
    phaseTag: "Turnkey Closing",
    title: "Implementation As Per Plan",
    tagline: "Transparent execution & smooth handover",
    shortDesc: "From private VIP site inspections to registered deed handovers, we deliver a frictionless closing experience.",
    fullDesc: "We coordinate private property viewings, handle all developer and government documentation, and guarantee clean freehold registry. Your keys are delivered with enduring peace of mind.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    guarantee: "Seamless registration & verified freehold title",
    highlights: [
      "Private escorted VIP estate tours",
      "End-to-end title deed & RERA compliance",
      "Turnkey registration & physical possession"
    ]
  }
];

const STEP_ICONS = [Compass, Users, Key];

export default function HowWeWorkProcess() {
  const { sections } = useCms();
  const howData = sections?.services?.howWeWork || {};

  const badge = howData.badge || "Process & Methodology";
  const titleMain = howData.titleMain || "How Do We";
  const titleItalic = howData.titleItalic || "Work?";
  const description = howData.description || "Experience our seamless, three-stage property advisory tailored for discerning buyers, investors, and corporate leaders.";
  const rawSteps = howData.steps || DEFAULT_PROCESS_STEPS;

  // Merge CMS steps with images & metadata if not present in CMS
  const steps = rawSteps.map((step, idx) => ({
    ...DEFAULT_PROCESS_STEPS[idx % DEFAULT_PROCESS_STEPS.length],
    ...step,
    image: step.image || DEFAULT_PROCESS_STEPS[idx % DEFAULT_PROCESS_STEPS.length].image
  }));

  const [expandedCards, setExpandedCards] = useState({});
  const [activeHoverStep, setActiveHoverStep] = useState(null);

  const toggleCard = (stepNum) => {
    setExpandedCards(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  return (
    <div className="relative my-16 md:my-24">
      {/* Background Soft Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(197,168,128,0.08) 0%, transparent 70%)' }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-12 md:mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#A27B48] text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-xs">
          <Sparkles size={13} className="text-[#C5A880]" />
          <span>{badge}</span>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-[1.15] mb-4">
          {titleMain} <span className="italic font-light text-[#C5A880]">{titleItalic}</span>
        </h2>

        <p className="text-[#334155] text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>

        {/* 3D Runway Timeline Bridge (Desktop) */}
        <div className="hidden lg:flex items-center justify-center gap-6 mt-8">
          {steps.map((st, i) => (
            <React.Fragment key={st.step}>
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 text-xs font-mono tracking-wider ${
                  activeHoverStep === i
                    ? 'bg-[#1D263B] text-[#C5A880] shadow-md scale-105'
                    : 'bg-[#FAF8F5] text-slate-500 border border-[#E8E2D8]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span className="font-bold">Step {st.step}</span>
                <span className="text-[10px] uppercase font-sans text-slate-400">({st.phaseTag.split(' ')[0]})</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-10 h-[2px] bg-gradient-to-r from-[#C5A880]/60 to-[#C5A880]/20" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* 3D Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch relative z-10">
        {steps.map((step, idx) => {
          const StepIcon = STEP_ICONS[idx % STEP_ICONS.length] || Compass;
          const isExpanded = !!expandedCards[step.step];

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActiveHoverStep(idx)}
              onMouseLeave={() => setActiveHoverStep(null)}
              className="flex flex-col h-full"
            >
              <Tilt3DCard maxTilt={7} className="h-full">
                <div
                  className={`h-full rounded-3xl overflow-hidden bg-white border transition-all duration-500 flex flex-col justify-between relative shadow-[0_15px_40px_-15px_rgba(29,38,59,0.08)] hover:shadow-[0_25px_60px_-15px_rgba(197,168,128,0.3)] ${
                    isExpanded
                      ? 'border-[#C5A880] ring-1 ring-[#C5A880]/40'
                      : 'border-[#E8E2D8] hover:border-[#C5A880]/70'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* Visual Image Window with Specular Sheen (translateZ 20px) */}
                  <div
                    className="relative h-48 sm:h-52 overflow-hidden bg-slate-900 group/img"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    
                    {/* Floating Phase Pill on Image (translateZ 40px) */}
                    <div
                      className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-bold font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-md"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
                      <span>{step.phase}</span>
                    </div>

                    {/* Step Icon Badge on Image (translateZ 45px) */}
                    <div
                      className="absolute top-3.5 right-3.5 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-white text-[#1D263B] flex items-center justify-center shadow-lg"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <StepIcon size={18} className="text-[#A27B48]" />
                    </div>

                    {/* Phase Tag over Bottom of Image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[11px] font-mono tracking-wider uppercase text-[#C5A880]">
                        {step.phaseTag}
                      </div>
                      <div className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
                        {step.title}
                      </div>
                    </div>
                  </div>

                  {/* Body Content Container */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Tagline */}
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A27B48] mb-3">
                        <Sparkles size={12} className="text-[#C5A880]" />
                        <span>{step.tagline}</span>
                      </div>

                      {/* Crisp Description */}
                      <p className="text-[#334155] text-xs sm:text-sm font-normal leading-relaxed mb-5">
                        {step.shortDesc}
                      </p>

                      {/* Scannable Feature Highlights */}
                      <div className="pt-3 border-t border-[#F1F5F9] space-y-2 mb-4">
                        {(step.highlights || []).slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-[#1D263B]">
                            <div className="w-4 h-4 rounded-full bg-[#C5A880]/15 text-[#A27B48] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={10} strokeWidth={3} />
                            </div>
                            <span className="font-medium text-slate-700">{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Smooth Deep Dive Accordion */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden mb-4"
                          >
                            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
                              <p className="text-xs text-[#334155] leading-relaxed">
                                {step.fullDesc}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#A27B48]">
                                <ShieldCheck size={14} className="text-[#C5A880] shrink-0" />
                                <span>{step.guarantee}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Action Toggle Button */}
                    <button
                      onClick={() => toggleCard(step.step)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#1D263B] text-[#1D263B] hover:text-white border border-[#E8E2D8] hover:border-[#1D263B] text-xs font-semibold flex items-center justify-between transition-all duration-300 group/btn cursor-pointer mt-2"
                    >
                      <span className="flex items-center gap-2">
                        <span>{isExpanded ? 'Show Summary' : 'View Deep Dive'}</span>
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-[#C5A880] transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                </div>
              </Tilt3DCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
