import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Shield, CheckCircle2, Sparkles, Star, TrendingUp, HeartHandshake } from 'lucide-react';
import Tilt3DCard from '../../components/ui/Tilt3DCard';
import AnimatedCounter from '../../components/ui/AnimatedCounter';

export default function AboutLeadership() {
  const founders = [
    {
      name: "Mr. Arun Sharma",
      role: "Founder & Managing Director",
      badge: "Founder • 20+ Years Authority",
      experienceBadge: "20+ Years",
      image: "https://saudagarproperties.com/wp-content/uploads/2025/12/Arun-Sharma-img.webp",
      bio: "Mr. Arun Sharma, the Founder of Saudagar properties Pvt Ltd is the force which drives us. A highly-experienced professional in Real Estate scenario with a career spanning more than two decades, his expertise includes skillful management of resources, and an astute and zealous work ethic. Inspite of years of experience behind him, he still ensures that every client is personally attended by him. His insistence on quality and consistency and his deft approach to the business has helped us scale new heights.",
      highlights: [
        "Over two decades of premier real estate leadership",
        "Personal involvement in every client consultation",
        "Astute & zealous management of resources",
        "Pioneering advisory in DLF Phase 1–5 & Gurugram"
      ],
      quote: "Quality, consistency, and personal dedication are the bedrock of lasting real estate value."
    },
    {
      name: "Mrs. Suneeta Chawla",
      role: "Co-Founder",
      badge: "Co-Founder • 10+ Years Veteran",
      experienceBadge: "10+ Years",
      image: "https://saudagarproperties.com/wp-content/uploads/2021/01/WhatsApp-Image-2020-09-24-at-6.34.26-PM.jpeg",
      bio: "Our co-founder and an esteemed veteran in the Real Estate market, Suneeta Chawla has been in the Real Estate Business for more than a decade now. Her keen instincts in the real estate business are remarkable. Her expertise and pragmatic approach has led to many successful deals in the past. We shall now and forever value her resourcefulness and integrity. She is one of the pillars that hold this venture sturdily.",
      highlights: [
        "Over a decade of astute market transactions",
        "Pragmatic approach delivering high-ROI results",
        "Remarkable instincts in luxury real estate",
        "A foundational pillar of resourcefulness & integrity"
      ],
      quote: "Resourcefulness and integrity turn property decisions into lifelong generational wealth."
    }
  ];

  // Team members matching the exact original website & user screenshot
  const teamMembers = [
    {
      name: "Ankit Sharma",
      designation: "Senior Client Advisory",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/Mohit-2-copy.png"
    },
    {
      name: "Bhavishya Sharma",
      designation: "Luxury Investment Specialist",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/Bhavishyasharma-1.png"
    },
    {
      name: "Shyam Upreti",
      designation: "Commercial & Portfolio Lead",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/shyam-upreti.png"
    }
  ];

  // Milestone counters matching the exact user screenshot
  const impactStats = [
    {
      value: 100,
      suffix: "+",
      label: "CR Saves In Property Investment",
      desc: "Optimized value and negotiations"
    },
    {
      value: 1000,
      formatComma: true,
      suffix: "+",
      label: "Happy Clients",
      desc: "Families & corporate executives"
    },
    {
      value: 25,
      suffix: "+",
      label: "Years of Trust and Experience",
      desc: "DLF Gurugram market authority"
    }
  ];

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-white via-[#FAF8F5] to-white overflow-hidden">
      {/* Decorative Radial Gradients (0 blur, 0 rasterization overhead) */}
      <div
        className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(197,168,128,0.12) 0%, rgba(197,168,128,0) 70%)' }}
      />
      <div
        className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(197,168,128,0.12) 0%, rgba(197,168,128,0) 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#A27B48] text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-sm">
            <Users size={14} className="text-[#C5A880]" />
            <span>Team of Experts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-tight mb-4">
            Visionary <span className="italic font-light text-[#C5A880]">Founders & Leadership</span>
          </h2>

          <p className="text-sm sm:text-base text-[#334155] font-normal leading-relaxed">
            Meet the driving force behind Saudagar Properties, delivering two decades of real estate authority, personal attention, and unwavering integrity.
          </p>
        </motion.div>

        {/* ================= PART 1: THE FOUNDERS (EYE-CATCHY 3D TILT CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-14 md:mb-16">
          {founders.map((leader, idx) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <Tilt3DCard
                maxTilt={8}
                className="group relative rounded-[32px] bg-white border border-[#E8E2D8] hover:border-[#C5A880] p-7 sm:p-10 transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(29,38,59,0.08)] hover:shadow-[0_30px_70px_-15px_rgba(197,168,128,0.3)] h-full flex flex-col justify-between"
              >
                <div>
                  {/* Founder Header: 3D Eye-Catchy Portrait & Tag */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 mb-8">
                    
                    {/* Glowing Animated Ring Around Portrait */}
                    <div className="relative shrink-0">
                      {/* Gold Halo */}
                      <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-tr from-[#C5A880]/30 via-[#E2CEB4]/20 to-[#B39366]/30 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Portrait Frame */}
                      <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                        />
                        {/* Inner Gradient Lighting */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* 3D Floating Gold Seal Pin */}
                      <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A880] to-[#B39366] text-[#0C101A] flex items-center justify-center shadow-[0_6px_20px_rgba(197,168,128,0.5)] border-2 border-white">
                        <Award size={18} />
                      </div>

                      {/* Floating Experience Chip */}
                      <div className="absolute -top-3 -left-3 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] text-[10px] font-bold tracking-wider uppercase shadow-lg">
                        {leader.experienceBadge}
                      </div>
                    </div>

                    {/* Founder Title & Accolades */}
                    <div className="text-center sm:text-left flex-grow">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#A27B48] text-[11px] font-bold tracking-[0.18em] uppercase mb-2 shadow-xs">
                        {leader.badge}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D263B] mb-1 leading-snug">
                        {leader.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#A27B48] uppercase tracking-wider mb-4">
                        {leader.role}
                      </p>

                      {/* Founder Philosophy Quote */}
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs italic text-[#334155] border-l-4 border-l-[#C5A880] shadow-2xs">
                        "{leader.quote}"
                      </div>
                    </div>
                  </div>

                  {/* Scraped Website Biography */}
                  <p className="text-xs sm:text-sm text-[#334155] font-normal leading-relaxed mb-6">
                    {leader.bio}
                  </p>

                  {/* Key Strengths Highlights */}
                  <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 mb-6">
                    {leader.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-[#1D263B]">
                        <CheckCircle2 size={15} className="text-[#C5A880] shrink-0 mt-0.5" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Touchpoint Footnote */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-[#1D263B] font-semibold">
                    <Shield size={14} className="text-[#C5A880]" />
                    <span>Personal Consultation Guaranteed</span>
                  </span>
                  <a
                    href="tel:+919811221207"
                    className="text-[#A27B48] hover:text-[#1D263B] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                  >
                    <span>Direct Call</span>
                    <span>→</span>
                  </a>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>

        {/* ================= PART 2: KEY EXECUTIVE TEAM (FROM SCREENSHOT) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <span className="text-xs font-bold tracking-[0.25em] text-[#C5A880] uppercase mb-2 block">
              Leadership In Action
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D263B]">
              Core Advisory & Operations Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, mIdx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: mIdx * 0.15 }}
                className="group relative rounded-3xl bg-white border border-[#E8E2D8] hover:border-[#C5A880] p-8 text-center transition-all duration-500 shadow-[0_15px_35px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_25px_50px_-10px_rgba(197,168,128,0.25)] hover:-translate-y-2 flex flex-col items-center justify-between"
              >
                <div>
                  {/* Eye-catchy Circular Photo Frame with Golden Orbit */}
                  <div className="relative mb-6">
                    {/* Subtle Gold Accent Ring */}
                    <div className="absolute -inset-2.5 rounded-full border border-dashed border-[#C5A880]/40 group-hover:border-[#C5A880] group-hover:rotate-45 transition-all duration-700" />
                    
                    {/* Circular Image Container */}
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 mx-auto">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Small Badge Pin */}
                    <div className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-[#C5A880] text-[#0C101A] flex items-center justify-center shadow-md border-2 border-white">
                      <Star size={12} className="fill-[#0C101A]" />
                    </div>
                  </div>

                  {/* Team Member Name */}
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#1D263B] mb-1.5 group-hover:text-[#A27B48] transition-colors">
                    {member.name}
                  </h4>

                  {/* Designation */}
                  <p className="text-xs font-semibold text-[#A27B48] uppercase tracking-wider mb-4">
                    {member.designation}
                  </p>
                </div>

                <div className="w-12 h-[2px] bg-[#E8E2D8] group-hover:bg-[#C5A880] group-hover:w-20 transition-all duration-300 mt-2" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================= PART 3: MILESTONE COUNTERS (FROM SCREENSHOT) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-8 border-t border-[#E8E2D8]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            {impactStats.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="group p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#C5A880] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1"
              >
                {/* Big Number with AnimatedCounter */}
                <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#1D263B] mb-2 leading-none">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma || false}
                    className="group-hover:text-[#C5A880] transition-colors"
                  />
                </div>

                {/* Counter Title Matching Screenshot */}
                <div className="text-sm sm:text-base font-bold text-[#A27B48] tracking-wide uppercase mb-1">
                  {stat.label}
                </div>

                {/* Subtext */}
                <div className="text-xs text-slate-500 font-medium">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
