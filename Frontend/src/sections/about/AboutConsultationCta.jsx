import { useEffect, useRef } from 'react';
import { Phone, MessageCircle, Mail, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';

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


export default function AboutConsultationCta() {
  const whatsappUrl = "https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20would%20like%20to%20request%20a%20consultation%20for%20property%20in%20DLF%20Gurugram.";
  const gmapsUrl = "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z/data=!3m1!4b1!4m6!3m5!1s0x390d193a8eabbb6b:0x3d99d3fce74198d5!8m2!3d28.4847851!4d77.0842655!16s%2Fg%2F11f03pch1x";

  const containerRef = useRef(null);
  const chassisRef = useRef(null);
  const leftColRef = useRef(null);
  const rightPodsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Chassis entrance on scroll
      gsap.fromTo(
        chassisRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 2. Right contact pods stagger
      if (rightPodsRef.current) {
        gsap.fromTo(
          rightPodsRef.current.children,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-12 md:py-16 bg-[#070A11] text-white overflow-hidden">
      {/* Ambient Luxury Light Beams */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#D09A16]/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Consultation Chassis */}
        <div
          ref={chassisRef}
          className="relative rounded-3xl sm:rounded-[36px] p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#101522]/95 via-[#0C101A]/95 to-[#080B12]/98 border border-[#D09A16]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(197,168,128,0.15)] backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle Golden Radial Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D09A16]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* LEFT COLUMN: Editorial Consultation Invitation */}
            <div ref={leftColRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-[1.15]">
                Request a Private <br />
                <span className="italic font-light text-[#D09A16] drop-shadow-[0_0_30px_rgba(197,168,128,0.35)]">
                  Executive Consultation
                </span>
              </h2>

              {/* Authentic Copy */}
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Reach out to get all support that will help you to make a wise decision and invest in the right property. Our founders and senior consultants personally guide your acquisition with complete legal transparency.
              </p>

              {/* 3 VIP Assurances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#D09A16] shrink-0" />
                  <span>Direct Founder-Led Discussions</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#D09A16] shrink-0" />
                  <span>100% Freehold Title Verification</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#D09A16] shrink-0" />
                  <span>Zero Hidden Brokerage Fees</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#D09A16] shrink-0" />
                  <span>Off-Market DLF Phase 1–5 Inventory</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href="tel:+919811221207"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D09A16] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 transition-all shadow-[0_10px_30px_rgba(197,168,128,0.35)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <Phone size={15} />
                  <span>Call Direct: +91 98112 21207</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 transition-all shadow-[0_10px_25px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Luxury Contact Pods */}
            <div ref={rightPodsRef} className="lg:col-span-5 space-y-3.5">

              {/* Office Pod */}
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D09A16]/50 transition-colors duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#D09A16] uppercase">
                      Headquarters & Lounge
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                      38, Akashneem Marg, DLF Phase 2
                    </div>
                    <div className="text-[11px] text-slate-400">Gurugram, Haryana 122002</div>
                  </div>
                </div>
                <ExternalLink size={15} className="text-slate-500 group-hover:text-[#D09A16] transition-colors" />
              </a>

              {/* Phone Hotline Pod */}
              <div className="group p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D09A16]/50 transition-colors duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#D09A16] uppercase">
                      Founders' Direct Hotlines
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      +91 98112 21207 / +91 97185 11207
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Pod */}
              <a
                href="mailto:saudagar.properties@yahoo.in"
                className="group p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D09A16]/50 transition-colors duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#D09A16] uppercase">
                      Direct Email Inquiries
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                      saudagar.properties@yahoo.in
                    </div>
                  </div>
                </div>
                <ExternalLink size={15} className="text-slate-500 group-hover:text-[#D09A16] transition-colors" />
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
