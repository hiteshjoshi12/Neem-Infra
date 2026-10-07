"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useEffect, useRef } from 'react';
import { Users, Award, Shield, CheckCircle2, Star } from 'lucide-react';


import Tilt3DCard from '../../components/ui/Tilt3DCard';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Image from 'next/image';


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

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const foundersContainerRef = useRef(null);
  const founderCardsRef = useRef([]);
  const teamSectionRef = useRef(null);
  const teamCardsRef = useRef([]);
  const statsSectionRef = useRef(null);
  const statCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 2. Founders 3D Entrance
      if (founderCardsRef.current.length > 0) {
        gsap.fromTo(
          founderCardsRef.current[0],
          { opacity: 0, x: -50, rotateY: 8 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: foundersContainerRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );

        if (founderCardsRef.current[1]) {
          gsap.fromTo(
            founderCardsRef.current[1],
            { opacity: 0, x: 50, rotateY: -8 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: foundersContainerRef.current,
                start: "top 85%",
                once: true
              },
              clearProps: "transform"
            }
          );
        }
      }

      // 3. Team Cards Stagger
      if (teamCardsRef.current.length > 0) {
        gsap.fromTo(
          teamCardsRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: teamSectionRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }

      // 4. Impact Stats Stagger
      if (statCardsRef.current.length > 0) {
        gsap.fromTo(
          statCardsRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsSectionRef.current,
              start: "top 88%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-[#0A0E17] text-white overflow-hidden border-t border-white/10">
      {/* Decorative Radial Gradients */}
      <div
        className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(208, 154, 22,0.12) 0%, rgba(208, 154, 22,0) 70%)' }}
      />
      <div
        className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(208, 154, 22,0.12) 0%, rgba(208, 154, 22,0) 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-bold tracking-[0.25em] uppercase mb-4 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
            <Users size={14} className="text-[#D09A16]" />
            <span>Team of Experts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Visionary <span className="italic font-serif text-[#D09A16]">Founders &amp; Leadership</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Meet the driving force behind Saudagar Properties, delivering two decades of real estate authority, personal attention, and unwavering integrity.
          </p>
        </div>

        {/* ================= PART 1: THE FOUNDERS ================= */}
        <div
          ref={foundersContainerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20"
          style={{ perspective: 1200 }}
        >
          {founders.map((leader, idx) => (
            <div
              key={leader.name}
              ref={(el) => (founderCardsRef.current[idx] = el)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Tilt3DCard
                maxTilt={8}
                className="group relative rounded-[32px] bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/60 p-7 sm:p-10 transition-all duration-300 shadow-xl hover:shadow-[0_20px_50px_rgba(208,154,22,0.2)] h-full flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  {/* Founder Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 mb-8">

                    {/* Portrait Frame with Gold Halo */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-tr from-[#D09A16]/30 via-[#D09A16]/20 to-[#D09A16]/30 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          width={160}
                          height={192}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Floating Gold Seal Pin */}
                      <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-[#D09A16] text-[#0C101A] flex items-center justify-center shadow-lg border-2 border-white/20">
                        <Award size={18} />
                      </div>

                      {/* Floating Experience Chip */}
                      <div className="absolute -top-3 -left-3 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-[#D09A16]/50 text-[#D09A16] text-[10px] font-bold tracking-wider uppercase shadow-lg">
                        {leader.experienceBadge}
                      </div>
                    </div>

                    {/* Founder Title & Accolades */}
                    <div className="text-center sm:text-left flex-grow">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#D09A16] text-[11px] font-bold tracking-[0.18em] uppercase mb-2 shadow-xs">
                        {leader.badge}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 leading-snug">
                        {leader.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#D09A16] uppercase tracking-wider mb-4">
                        {leader.role}
                      </p>

                      {/* Founder Philosophy Quote */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs italic text-slate-300 border-l-4 border-l-[#D09A16] shadow-2xs">
                        &ldquo;{leader.quote}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {leader.bio}
                  </p>

                  {/* Key Strengths Highlights */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5 mb-6">
                    {leader.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Touchpoint Footnote */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Shield size={14} className="text-[#D09A16]" />
                    <span>Personal Consultation Guaranteed</span>
                  </span>
                  <a
                    href="tel:+919811221207"
                    className="text-[#D09A16] hover:text-white font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                  >
                    <span>Direct Call</span>
                    <span>→</span>
                  </a>
                </div>
              </Tilt3DCard>
            </div>
          ))}
        </div>

        {/* ================= PART 2: KEY EXECUTIVE TEAM ================= */}
        <div ref={teamSectionRef} className="mb-16 md:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-[0.25em] text-[#D09A16] uppercase mb-2 block">
              Leadership In Action
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Core Advisory &amp; Operations Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, mIdx) => (
              <div
                key={member.name}
                ref={(el) => (teamCardsRef.current[mIdx] = el)}
                className="group relative rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/60 p-8 text-center transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(208,154,22,0.2)] hover:-translate-y-2 flex flex-col items-center justify-between backdrop-blur-md"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative mb-6">
                    <div className="absolute -inset-2.5 rounded-full border border-dashed border-[#D09A16]/40 group-hover:border-[#D09A16] group-hover:rotate-45 transition-all duration-700" />

                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-slate-900 mx-auto">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={160}
                        height={160}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-[#D09A16] text-[#0C101A] flex items-center justify-center shadow-md border-2 border-white/20">
                      <Star size={12} className="fill-[#0C101A]" />
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5 group-hover:text-[#D09A16] transition-colors">
                    {member.name}
                  </h4>

                  <p className="text-xs font-semibold text-[#D09A16] uppercase tracking-wider mb-4">
                    {member.designation}
                  </p>
                </div>

                <div className="w-12 h-[2px] bg-white/20 group-hover:bg-[#D09A16] group-hover:w-20 transition-all duration-300 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* ================= PART 3: MILESTONE COUNTERS ================= */}
        <div ref={statsSectionRef} className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            {impactStats.map((stat, sIdx) => (
              <div
                key={sIdx}
                ref={(el) => (statCardsRef.current[sIdx] = el)}
                className="group p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/60 transition-all duration-300 shadow-xl hover:shadow-[0_20px_50px_rgba(208,154,22,0.2)] hover:-translate-y-1 backdrop-blur-md"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-2 leading-none">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma || false}
                    className="group-hover:text-[#D09A16] transition-colors"
                  />
                </div>

                <div className="text-sm sm:text-base font-bold text-[#D09A16] tracking-wide uppercase mb-1">
                  {stat.label}
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
