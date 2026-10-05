import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Award, Building, TrendingUp, CheckCircle2, Play } from 'lucide-react';

import { animate, inView, stagger } from 'framer-motion';

const dummyTimeline = { 
  to: function(target, vars) { gsap.to(target, vars); return this; }, 
  from: function() { return this; }, 
  fromTo: function(target, fromVars, toVars) { gsap.fromTo(target, fromVars, toVars); return this; } 
};
const gsap = { 
  to: (target, vars) => {
    if (!target) return;
    try {
      const options = { duration: vars.duration || 0.4, delay: vars.delay || 0 };
      if (vars.stagger) options.delay = stagger(vars.stagger);
      const safeVars = { ...vars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => delete safeVars[p]);
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;

      if (vars.scrollTrigger) {
         inView(vars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeVars, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeVars, options);
      }
    } catch(e){}
  }, 
  from: () => {}, 
  fromTo: (target, fromVars, toVars) => {
    if (!target) return;
    try {
      const options = { duration: toVars.duration || 1, delay: toVars.delay || 0 };
      if (toVars.stagger) options.delay = stagger(toVars.stagger);
      const safeFrom = { ...fromVars }; const safeTo = { ...toVars };
      ['duration','delay','stagger','ease','scrollTrigger','clearProps','transformPerspective','transformStyle'].forEach(p => { delete safeFrom[p]; delete safeTo[p]; });
      
      const elements = Array.isArray(target) ? target.filter(Boolean) : (typeof target === 'string' || target instanceof Element ? target : null);
      if (!elements || (Array.isArray(elements) && elements.length === 0)) return;
      
      animate(elements, safeFrom, { duration: 0 });
      if (toVars.scrollTrigger) {
         inView(toVars.scrollTrigger.trigger || (Array.isArray(elements) ? elements[0] : elements), () => { animate(elements, safeTo, options); }, { once: true, margin: "0px 0px -10% 0px" });
      } else {
         animate(elements, safeTo, options);
      }
    } catch(e){}
  }, 
  context: (cb) => { if(cb) { try { cb(); } catch(e){} } return { revert: () => {} }; }, 
  registerPlugin: () => {},
  timeline: () => dummyTimeline 
};
const ScrollTrigger = {};
import Tilt3DCard from '../../components/ui/Tilt3DCard';
import AnimatedCounter from '../../components/ui/AnimatedCounter';


export default function AboutHero() {
  const stats = [
    { icon: Award, value: 25, suffix: "+", label: "Years Experience", subtext: "DLF Phase 1–5 Pioneers" },
    { icon: TrendingUp, value: 500, prefix: "₹", suffix: "Cr+", label: "Transaction Volume", subtext: "Delivered Seamlessly" },
    { icon: ShieldCheck, value: 100, suffix: "%", label: "Direct & Transparent", subtext: "Zero Middlemen Fees" },
    { icon: Building, value: 5000, suffix: "+", formatComma: true, label: "HNI Families & Corporates", subtext: "Enduring Relationships" }
  ];

  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightCardRef = useRef(null);
  const metricStripRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".about-hero-anim",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, clearProps: "transform" }
      );

      // 2. Right 3D Showcase Card
      if (rightCardRef.current) {
        gsap.fromTo(
          rightCardRef.current,
          { opacity: 0, scale: 0.92, x: 40, rotateY: -10 },
          { opacity: 1, scale: 1, x: 0, rotateY: 0, duration: 1.1, delay: 0.2, ease: "power3.out", clearProps: "transform" }
        );
      }

      // 3. Metric Strip Entrance
      if (metricStripRef.current) {
        gsap.fromTo(
          metricStripRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out", clearProps: "transform" }
        );
      }

      // 4. Background Parallax
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[88vh] flex flex-col justify-center pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden bg-[#0A0E17] text-white"
    >
      {/* 1. Cinematic Background Image with Parallax Depth & Gradient Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          ref={bgImgRef}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt="DLF Luxury Villa Architecture"
          width="2400"
          height="1350"
          fetchpriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-[0.35] contrast-[1.1] scale-105"
        />
        {/* Layered Vignettes for Ultra-Luxury Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17] via-[#0A0E17]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-[#0A0E17]/60" />
      </div>

      {/* 2. Ambient Golden Light Beams */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(197,168,128,0.18) 0%, rgba(197,168,128,0) 70%)' }}
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(179,147,102,0.12) 0%, rgba(179,147,102,0) 70%)' }}
      />

      {/* 3. Architectural Accent Rings */}
      <div className="absolute top-24 right-1/4 w-80 h-80 rounded-full border border-[#D09A16]/15 pointer-events-none" />
      <div className="absolute top-36 right-1/4 w-56 h-56 rounded-full border border-dashed border-[#D09A16]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Breadcrumb Navigation */}
        <div className="about-hero-anim flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
          <Link to="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#D09A16] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
            <span>About Us</span>
          </span>
        </div>

        {/* 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          
          {/* LEFT COLUMN: Editorial Typography & Authenticated Content */}
          <div ref={leftContentRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Gold Badge */}
            <div className="about-hero-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-[#D09A16]/40 backdrop-blur-xl text-[#D09A16] text-xs font-bold tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(197,168,128,0.2)]">
              <Sparkles size={14} className="text-[#D09A16]" />
              <span>About Saudagar Properties • 25+ Years Legacy</span>
            </div>

            {/* High-Impact Serif Headline */}
            <h1 className="about-hero-anim text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              Pioneering Luxury & <br />
              <span className="italic font-light text-[#D09A16] drop-shadow-[0_0_35px_rgba(197,168,128,0.4)]">
                Optimal Real Estate
              </span>{" "}
              Solutions
            </h1>

            {/* Authenticated Copy */}
            <p className="about-hero-anim text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              At <strong className="font-semibold text-white">Saudagar Properties</strong>, we aim to assist our customers by providing them optimal property solutions. Any property you need — be it commercial, industrial, or residential, we will guide you throughout the process of buying, selling, renting, or leasing the property. Reach out to get all support that will help you make a wise decision and invest in the right property.
            </p>

            {/* Action CTA Buttons */}
            <div className="about-hero-anim flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#video-tour"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D09A16] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-[0.18em] flex items-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(197,168,128,0.4)] hover:shadow-[0_15px_40px_rgba(197,168,128,0.6)] hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-[#0C101A] text-[#D09A16] flex items-center justify-center">
                  <Play size={10} className="fill-[#D09A16] ml-0.5" />
                </div>
                <span>Watch Corporate Film</span>
              </a>

              <a
                href="#proposition"
                className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 hover:border-[#D09A16] font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Our Proposition</span>
                <ArrowRight size={14} className="text-[#D09A16]" />
              </a>
            </div>

            {/* Direct Verification Micro-badge */}
            <div className="about-hero-anim flex items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-400">
              <CheckCircle2 size={15} className="text-[#D09A16]" />
              <span>Headquartered at 38, Akashneem Marg, DLF Phase 2, Gurugram</span>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Floating Showcase Stage */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={rightCardRef}
              className="relative w-full max-w-md"
            >
              {/* Outer 3D Halo Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D09A16]/30 to-[#B39366]/10 rounded-[36px] blur-2xl pointer-events-none" />

              {/* 3D Tilt Card Container */}
              <Tilt3DCard maxTilt={10} className="w-full">
                <div className="relative rounded-[32px] overflow-hidden border border-[#D09A16]/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(197,168,128,0.25)] space-y-6">
                  
                  {/* Card Visual Header */}
                  <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                      alt="DLF Real Estate Portfolio"
                      width="1200"
                      height="800"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold tracking-widest uppercase">
                      DLF Phase 1–5 Dedicated Desk
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5">
                      <div className="text-xs font-serif font-bold text-white leading-tight">
                        Gurgaon's Premier Real Estate Legacy
                      </div>
                      <div className="text-[10px] text-[#D09A16] font-mono tracking-wide">
                        Founded 1999 • 25+ Years of Authority
                      </div>
                    </div>
                  </div>

                  {/* 3D Floating Highlights Pills */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center font-serif font-bold text-xs">
                          <AnimatedCounter value={25} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Years of Market Leadership</div>
                          <div className="text-[10px] text-slate-400">Founders Personally Attend Every Deal</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#D09A16]">1999–2026</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center font-serif font-bold text-xs">
                          ₹
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            <AnimatedCounter prefix="₹" value={500} suffix="Cr+" /> Transaction Record
                          </div>
                          <div className="text-[10px] text-slate-400">High-ROI Luxury Residential & Land</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#D09A16]">Top 1%</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center font-serif font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            <AnimatedCounter value={100} suffix="%" /> Transparent Legal Titles
                          </div>
                          <div className="text-[10px] text-slate-400">Zero Middlemen • Direct Negotiations</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#D09A16]">Verified</span>
                    </div>
                  </div>

                </div>
              </Tilt3DCard>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM 3D METRIC STRIP */}
        <div
          ref={metricStripRef}
          className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-[#D09A16] transition-colors">
                      <AnimatedCounter
                        value={st.value}
                        prefix={st.prefix || ''}
                        suffix={st.suffix || ''}
                        formatComma={st.formatComma || false}
                      />
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">
                      {st.label}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {st.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
