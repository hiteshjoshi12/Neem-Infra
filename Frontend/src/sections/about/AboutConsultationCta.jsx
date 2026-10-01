import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, ArrowRight, ShieldCheck, Sparkles, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from '../../components/ui/AnimatedCounter';

export default function AboutConsultationCta() {
  const whatsappUrl = "https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20would%20like%20to%20request%20a%20consultation%20for%20property%20in%20DLF%20Gurugram.";
  const gmapsUrl = "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z/data=!3m1!4b1!4m6!3m5!1s0x390d193a8eabbb6b:0x3d99d3fce74198d5!8m2!3d28.4847851!4d77.0842655!16s%2Fg%2F11f03pch1x";

  return (
    <section className="relative py-10 md:py-14 bg-[#070A11] text-white overflow-hidden">
      {/* Ambient Luxury Light Beams */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#C5A880]/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Consultation Chassis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl sm:rounded-[36px] p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#101522]/95 via-[#0C101A]/95 to-[#080B12]/98 border border-[#C5A880]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(197,168,128,0.15)] backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle Golden Radial Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* LEFT COLUMN: Editorial Consultation Invitation */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">


              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-[1.15]">
                Request a Private <br />
                <span className="italic font-light text-[#C5A880] drop-shadow-[0_0_30px_rgba(197,168,128,0.35)]">
                  Executive Consultation
                </span>
              </h2>

              {/* Scraped Website Authentic Copy */}
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Reach out to get all support that will help you to make a wise decision and invest in the right property. Our founders and senior consultants personally guide your acquisition with complete legal transparency.
              </p>

              {/* 3 VIP Assurances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#C5A880] shrink-0" />
                  <span>Direct Founder-Led Discussions</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#C5A880] shrink-0" />
                  <span>100% Freehold Title Verification</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#C5A880] shrink-0" />
                  <span>Zero Hidden Brokerage Fees</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 size={15} className="text-[#C5A880] shrink-0" />
                  <span>Off-Market DLF Phase 1–5 Inventory</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href="tel:+919811221207"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A880] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-[0.16em] flex items-center gap-2.5 transition-all shadow-[0_10px_30px_rgba(197,168,128,0.35)] hover:-translate-y-0.5 cursor-pointer"
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
            <div className="lg:col-span-5 space-y-3.5">

              {/* Office Pod */}
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#C5A880]/50 transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                      Headquarters & Lounge
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#C5A880] transition-colors">
                      38, Akashneem Marg, DLF Phase 2
                    </div>
                    <div className="text-[11px] text-slate-400">Gurugram, Haryana 122002</div>
                  </div>
                </div>
                <ExternalLink size={15} className="text-slate-500 group-hover:text-[#C5A880] transition-colors" />
              </a>

              {/* Phone Hotline Pod */}
              <div className="group p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A880]/50 transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
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
                className="group p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#C5A880]/50 transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                      Official Correspondence
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#C5A880] transition-colors">
                      saudagar.properties@yahoo.in
                    </div>
                    <div className="text-[11px] text-slate-400">Direct response within 2 hours</div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-[#C5A880] group-hover:translate-x-1 transition-all" />
              </a>

            </div>

          </div>

          {/* Bottom Micro Metric Strip */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                <AnimatedCounter prefix="₹" value={100} suffix="Cr+" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880] mt-0.5">
                Client Value Saved
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                <AnimatedCounter value={1000} formatComma={true} suffix="+" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880] mt-0.5">
                Happy HNI Families
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                <AnimatedCounter value={25} suffix="+" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880] mt-0.5">
                Years of Trust
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
