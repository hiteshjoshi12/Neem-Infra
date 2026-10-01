import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PhoneCall, Sparkles, TrendingUp, Users, Award, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ end, suffix = "+", duration = 1800 }) {
  const [val, setVal] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 1;
    const stepTime = Math.max(16, Math.floor(duration / end));
    const stepValue = Math.max(1, Math.floor(end / (duration / 16)));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {end >= 1000 ? val.toLocaleString() : val}
      {suffix}
    </span>
  );
}

const STATS_CARDS = [
  {
    icon: TrendingUp,
    number: 100,
    suffix: "+",
    label: "CR Saves In Property Investment",
    subtext: "Maximized financial yield & smart negotiation"
  },
  {
    icon: Users,
    number: 1000,
    suffix: "+",
    label: "Happy Clients",
    subtext: "Discerning families & corporate enterprises"
  },
  {
    icon: Award,
    number: 25,
    suffix: "+",
    label: "Years of Trust and Experience",
    subtext: "Unbroken leadership in DLF Gurugram"
  }
];

export default function DlfPropertyCallout() {
  return (
    <div className="relative mt-16 md:mt-24 space-y-12">
      
      {/* ==================== 1. 3D LUXURY ANIMATED STATS ROW ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {STATS_CARDS.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative group rounded-3xl bg-white border border-[#E8E2D8] p-8 text-center shadow-[0_12px_35px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_20px_45px_-10px_rgba(197,168,128,0.3)] transition-all duration-500 overflow-hidden transform-gpu hover:-translate-y-1.5"
            >
              {/* Outer Subtle Gold Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Pill */}
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#C5A880] flex items-center justify-center mx-auto mb-5 shadow-xs group-hover:bg-[#1D263B] group-hover:text-[#C5A880] group-hover:border-[#1D263B] transition-all duration-300">
                <IconComponent size={22} />
              </div>

              {/* Animated Big Number */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1D263B] via-[#8C6D40] to-[#C5A880] mb-2 tracking-tight">
                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              </div>

              {/* Title & Description */}
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#1D263B] mb-1">
                {stat.label}
              </h4>
              <p className="text-xs text-[#334155] font-medium">
                {stat.subtext}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== 2. LUXURY 3D CALLOUT BANNER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl bg-[#1D263B] text-white p-8 sm:p-10 md:p-14 shadow-[0_25px_60px_-15px_rgba(29,38,59,0.35)] overflow-hidden border border-white/10"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
          
          {/* Left: Heading & Description */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
              <Sparkles size={12} />
              <span>DLF Gurgaon Dedicated Desk</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white leading-tight">
              Are you looking for a property in <span className="italic font-light text-[#C5A880]">DLF Gurgaon?</span> <br className="hidden sm:inline" />
              Simply connect with us!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
              Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience. Contact us to discuss your requirements and find the perfect property solution.
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0 justify-center">
            <a
              href="tel:+919811221207"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:scale-105"
            >
              <PhoneCall size={15} className="text-[#C5A880]" />
              <span>Call Us</span>
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5A880] hover:bg-[#B5986D] text-[#1D263B] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(197,168,128,0.35)] hover:scale-105"
            >
              <span>Explore Deals</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
