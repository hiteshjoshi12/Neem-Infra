import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, CheckCircle2, RotateCw, ArrowUpRight, PhoneCall, Award, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../../../context/CmsContext';

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    phase: "STEP 01",
    title: "Understanding your Purpose",
    tagline: "Tailored to your budget & aspirations",
    shortDesc: "At Saudagar Properties, your trusted top real estate consultant in DLF Gurugram, we serve as a reliable platform to buy, rent, sell, or lease residential, commercial, and industrial properties.",
    fullDesc: "Whether you’re looking for a flat, villa, or kothi in Gurgaon or DLF Phase 2, or office space in Udyog Vihar, we are your one-stop solution to meet all your property needs within your budget and convenience.",
    highlights: ["Detailed requirement discovery", "Budget & location alignment", "Exclusive off-market inventory check"]
  },
  {
    step: "02",
    phase: "STEP 02",
    title: "Planning with our experts",
    tagline: "Direct consultation without middlemen",
    shortDesc: "Our dedicated team of professionals provides personalized guidance, answering all your queries and helping you avoid the hassle of middlemen like brokers and financers.",
    fullDesc: "We assist you in selecting the perfect property whether residential or commercial and handle the formalities efficiently, ensuring you stay within your budget.",
    highlights: ["Direct consultation with directors", "Zero hidden broker fees", "Clear financial & legal roadmap"]
  },
  {
    step: "03",
    phase: "STEP 03",
    title: "Implementation as per plan",
    tagline: "Transparent execution & smooth closing",
    shortDesc: "Once your needs are clear, our experts actively search for the best property options tailored to you. We pride ourselves on dedication and transparency.",
    fullDesc: "We ensure smooth coordination and keep you informed throughout the process. Reach out to us today, and let’s discuss how we can help you find your ideal property in DLF Gurugram.",
    highlights: ["Hand-picked property site tours", "Title verification & due diligence", "Seamless registration & handover"]
  }
];

const STEP_ICONS = [Compass, Users, CheckCircle2];

export default function HowWeWorkProcess() {
  const { sections } = useCms();
  const howData = sections?.services?.howWeWork || {};

  const badge = howData.badge || "Process & Methodology";
  const titleMain = howData.titleMain || "How Do We";
  const titleItalic = howData.titleItalic || "Work?";
  const description = howData.description || "Want to know how we get started with your property journey? Here’s a simple overview of our process:";
  const steps = howData.steps || DEFAULT_PROCESS_STEPS;

  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (stepNum) => {
    setExpandedCards(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  return (
    <div className="relative my-16 md:my-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-14 md:mb-18"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-8 h-[2px] bg-[#C5A880]" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
            {badge}
          </span>
          <span className="w-8 h-[2px] bg-[#C5A880]" />
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-[1.15] mb-4">
          {titleMain} <span className="italic font-light text-[#C5A880]">{titleItalic}</span>
        </h2>

        <p className="text-[#334155] text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Interactive 3D Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch mb-16">
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
              className="relative group flex flex-col justify-between"
            >
              {/* Outer Decorative 3D Corner Glow */}
              <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-[#C5A880]/50 rounded-tr-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

              <div
                className={`h-full rounded-3xl p-7 sm:p-8 bg-white border transition-all duration-500 flex flex-col justify-between relative shadow-[0_12px_35px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_20px_45px_-10px_rgba(197,168,128,0.25)] hover:-translate-y-1.5 ${isExpanded
                    ? 'border-[#C5A880] ring-1 ring-[#C5A880]/30 bg-gradient-to-b from-white to-[#FAF8F5]'
                    : 'border-[#E8E2D8] hover:border-[#C5A880]/60'
                  }`}
              >
                <div>
                  {/* Top Step Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#A27B48] text-[11px] font-bold tracking-[0.2em] uppercase">
                      {step.phase}
                    </span>

                    <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#1D263B] group-hover:bg-[#C5A880] group-hover:text-[#1D263B] group-hover:border-[#C5A880] flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                      <StepIcon size={20} />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1D263B] mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] font-semibold tracking-wide uppercase text-[#C5A880] mb-5">
                    {step.tagline}
                  </p>

                  {/* Body Paragraph */}
                  <p className="text-[#334155] text-xs sm:text-sm font-normal leading-relaxed mb-6">
                    {isExpanded ? step.fullDesc : step.shortDesc}
                  </p>

                  {/* Interactive Highlights checklist */}
                  <div className="pt-4 border-t border-[#F1F5F9] space-y-2 mb-6">
                    {(step.highlights || [])
                      .filter(h => typeof h === 'string' && h.trim().length > 0)
                      .map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#1D263B]">
                          <Check size={13} className="text-[#C5A880] shrink-0 mt-0.5" />
                          <span className="font-medium">{h}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Toggle / Expand Button */}
                <button
                  onClick={() => toggleCard(step.step)}
                  className="w-full py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#1D263B] text-[#1D263B] hover:text-white border border-[#E8E2D8] hover:border-[#1D263B] text-xs font-semibold flex items-center justify-between transition-all duration-300 group/btn"
                >
                  <span className="flex items-center gap-2">
                    <RotateCw size={13} className={`text-[#C5A880] transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                    <span>{isExpanded ? (howData.briefViewText || 'Show Brief View') : (howData.fullViewText || 'Read Full Overview')}</span>
                  </span>
                  <ChevronRight size={14} className="text-[#C5A880] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
