import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, Building2, Factory, ArrowUpRight, Play, Pause, ShieldCheck, Award, PhoneCall } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function TopConsultantSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full py-16 md:py-20 bg-[#FAF8F5] overflow-hidden">
      {/* Background Architectural Accent lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1D263B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-[#C5A880]" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
                Bespoke Real Estate Advisory
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-[1.15]">
              Top Real Estate Consultant <br />
              <span className="italic font-light text-[#C5A880]">In DLF Gurugram</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#334155] font-normal max-w-md leading-relaxed border-l-2 border-[#C5A880] pl-4">
            Authorized advisor and trusted partner for DLF Phase 1–4, Sushant Lok, and Cybercity’s most exclusive residential & commercial estates.
          </p>
        </motion.div>

        {/* Main 3D Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Left Column: Signature 3D Gold Framed Content Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative group"
          >
            {/* Outer Decorative Double-Gold Frame Corner */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#C5A880] rounded-tl-2xl pointer-events-none z-20" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#C5A880] rounded-br-2xl pointer-events-none z-20" />

            <div className="h-full bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-10px_rgba(20,25,35,0.08)] border border-[#EFECE6] flex flex-col justify-between relative z-10 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(20,25,35,0.12)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E4D9] text-[11px] font-semibold tracking-widest text-[#1D263B] uppercase mb-6">
                  <ShieldCheck size={14} className="text-[#C5A880]" />
                  <span>DLF Authorized & Verified</span>
                </div>

                <p className="text-base md:text-lg text-[#1D263B] font-normal leading-relaxed mb-8">
                  At <strong className="font-semibold text-[#1D263B]">Saudagar Properties</strong>, we are proud to be recognized as the premier real estate consultant in DLF Gurugram. We provide personalized, end-to-end solutions across residential, commercial, and industrial sectors with maximum ROI.
                </p>

                <p className="text-sm md:text-base text-[#334155] font-normal leading-relaxed mb-10">
                  Whether you are seeking an ultra-luxury builder floor in DLF Phase 1–4, a high-street commercial office in Udyog Vihar, or an investment-ready plot, our veteran team guides you through transparent transactions and seamless legal title verification.
                </p>
              </div>

              {/* 3 Categories Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#F0ECE1]">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:border-[#C5A880] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#1D263B] text-[#C5A880] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D263B] uppercase tracking-wider">Residential</h4>
                    <p className="text-[11px] text-[#475569] font-medium">Floors & Villas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:border-[#C5A880] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#1D263B] text-[#C5A880] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D263B] uppercase tracking-wider">Commercial</h4>
                    <p className="text-[11px] text-[#475569] font-medium">Offices & Retail</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:border-[#C5A880] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#1D263B] text-[#C5A880] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Factory size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D263B] uppercase tracking-wider">Industrial</h4>
                    <p className="text-[11px] text-[#475569] font-medium">Plots & Assets</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Cinematic Video Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col"
          >
            <div className="relative flex-1 min-h-[360px] lg:min-h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(20,25,35,0.2)] border border-[#EFECE6] bg-[#1D263B] group">
              {/* Background Luxury Architectural Image / Video Poster */}
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="Luxury Sushant Lok Estate"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75]"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D263B] via-[#1D263B]/30 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-widest text-[#1D263B] uppercase shadow-md">
                  Sushant Lok & DLF Tour
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Center Play CTA */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 backdrop-blur-xl text-[#1D263B] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:scale-110 hover:bg-[#C5A880] hover:text-white transition-all duration-300 cursor-pointer group/btn"
                  aria-label="Play Property Tour Video"
                >
                  {isPlaying ? (
                    <Pause size={28} className="translate-x-0" />
                  ) : (
                    <Play size={28} className="translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Details Banner */}
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <h3 className="text-xl font-serif mb-1">Exclusive DLF & Sushant Lok Walkthrough</h3>
                <p className="text-xs text-[#D1D5DB] font-light">Experience Gurgaon's finest properties with curated virtual walkthroughs.</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Trust & Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-[#1D263B] text-white p-8 md:p-12 shadow-[0_20px_50px_rgba(29,38,59,0.2)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Ambient Sheen */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-6 z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center flex-shrink-0">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                Ready to Invest or Buy in DLF Gurugram?
              </h3>
              <p className="text-xs md:text-sm text-slate-200 font-normal max-w-xl">
                Get priority access to off-market inventory, bespoke site visits, and personalized ROI projections from our executive directors.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0 z-10">
            <a
              href="tel:+919811221207"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
            >
              <PhoneCall size={14} className="text-[#C5A880]" />
              <span>+91 98112 21207</span>
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#B5986D] text-[#1D263B] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(197,168,128,0.3)] hover:shadow-[0_6px_20px_rgba(197,168,128,0.4)]"
            >
              <span>Connect Now</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
