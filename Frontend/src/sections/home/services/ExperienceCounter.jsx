import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ShieldCheck, Layers, CheckCircle2, TrendingUp, Sparkles, Building } from 'lucide-react';

const STATS_DATA = [
  {
    icon: ShieldCheck,
    title: "100% Client Satisfaction",
    desc: "Putting client interests first with bespoke, personalized property advisory."
  },
  {
    icon: Layers,
    title: "DLF Micro-Market Leaders",
    desc: "Unmatched expertise across DLF Phase 1–5, Sushant Lok, and Cybercity."
  },
  {
    icon: CheckCircle2,
    title: "Verified Legal Titles",
    desc: "Comprehensive due diligence ensuring 100% safe and secure transactions."
  },
  {
    icon: TrendingUp,
    title: "Discreet & Ethical Advisory",
    desc: "Trusted by India's top corporate executives and high-net-worth families."
  }
];

export default function ExperienceCounter() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!isInView) return;

    let current = 1;
    const target = 25;
    const duration = 1600; // ms
    const intervalTime = Math.floor(duration / target);

    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative my-16 md:my-24">
      {/* Decorative Gold Ambient Background Glows */}
      <div className="absolute -top-6 -right-6 w-48 h-48 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Luxury Porcelain 3D Container (No Image, No Heavy Dark Box) */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5EFE6] p-8 sm:p-12 md:p-16 border border-[#E8E2D8] shadow-[0_20px_50px_-15px_rgba(197,168,128,0.22)] overflow-hidden"
      >
        {/* Outer Hairline Gold Border Glow */}
        <div className="absolute inset-0 rounded-3xl border border-[#C5A880]/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5A880]/15 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10">
          
          {/* Top Section Header & Animated Counter Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 pb-10 border-b border-[#E8E2D8]">
            
            {/* Left: Heading & Badge */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#C5A880]/40 shadow-sm text-[11px] font-bold tracking-[0.2em] text-[#A27B48] uppercase">
                <Award size={14} className="text-[#C5A880]" />
                <span>25+ Years of Unmatched Advisory</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1D263B] leading-[1.2]">
                Years of Experience as a Top Real Estate Consultant in <span className="italic text-[#C5A880]">DLF Gurugram</span>
              </h3>

              <p className="text-[#334155] text-xs sm:text-sm font-normal leading-relaxed">
                Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property. We are committed to serving our clients with dedication, putting their needs above all else. Providing personalized solutions for all your property-related queries, we know that a satisfied customer is our greatest asset.
              </p>
            </div>

            {/* Right: Big 3D Counter Display Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E8E2D8] shadow-[0_10px_30px_rgba(197,168,128,0.18)] text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#C5A880]/10 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1D263B] via-[#8C6D40] to-[#C5A880] tabular-nums tracking-tight">
                  {count}
                </span>
                <span className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#C5A880] ml-1">
                  +
                </span>
              </div>

              <span className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#1D263B] mb-1">
                Years of Authority
              </span>
              <span className="text-xs text-[#334155] font-medium max-w-xs">
                Serving India's Most Discerning Families & Corporates in Gurgaon
              </span>
            </div>

          </div>

          {/* Bottom 4 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS_DATA.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-[#E8E2D8] shadow-sm hover:shadow-md hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#1D263B] flex items-center justify-center mb-3 shadow-xs">
                    <IconComp size={18} className="text-[#C5A880]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#1D263B] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#334155] font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
