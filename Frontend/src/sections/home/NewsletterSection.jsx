import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
    }, 700);
  };

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#FAF8F5] overflow-hidden border-t border-[#EFECE6]">
      {/* Background Architectural Ambient Elements */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1D263B_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">

        {/* 3D Glassmorphic Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-[#1D263B] text-white p-8 sm:p-12 md:p-16 shadow-[0_25px_60px_-15px_rgba(29,38,59,0.35)] border border-white/10 overflow-hidden"
        >
          {/* Subtle Outer Corner Decorative Accents */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-[#C5A880]/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-[#C5A880]/50 rounded-br-xl pointer-events-none" />

          {/* Ambient Gold Radial Sheen */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#C5A880]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#C5A880]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

            {/* Left Content Area */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-[0.25em] text-[#C5A880] uppercase mb-5">
                <Sparkles size={12} className="text-[#C5A880]" />
                <span>Market Intelligence</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif text-white leading-[1.2] mb-4">
                Subscribe To <span className="italic font-light text-[#C5A880]">Saudagar Properties</span> Newsletter
              </h2>

              <p className="text-[#A0ABBB] text-sm sm:text-base font-light leading-relaxed">
                Sign up with your email address to receive curated off-market opportunities, DLF price trends, and the latest Gurgaon real estate updates.
              </p>
            </div>

            {/* Right Interactive Form Area */}
            <div className="w-full lg:max-w-md">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-xl border border-[#C5A880]/40 p-6 text-center flex flex-col items-center justify-center gap-3 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 border border-[#C5A880] text-[#C5A880] flex items-center justify-center">
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-white mb-1">
                        Thank You for Subscribing!
                      </h4>
                      <p className="text-xs text-[#CBD5E1] font-light max-w-xs">
                        You have been added to our private advisory list. Expect exclusive DLF & Gurgaon real estate insights in your inbox.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 text-[11px] text-[#C5A880] hover:underline uppercase tracking-wider font-semibold"
                    >
                      Subscribe another email
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Input Container with 3D Luxury Elevation */}
                    <div className="relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 border border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-[#C5A880] transition-all duration-300">

                      {/* Email Input Field */}
                      <div className="flex items-center gap-3 px-4 py-3 sm:py-2 flex-grow min-w-0">
                        <Mail className="text-[#C5A880] w-5 h-5 flex-shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address..."
                          className="w-full bg-transparent border-none outline-none text-[#1D263B] placeholder-[#9CA3AF] text-sm font-light truncate"
                        />
                      </div>

                      {/* Sign Up Action Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-7 py-3.5 sm:py-3 rounded-xl bg-[#1D263B] hover:bg-[#C5A880] text-white hover:text-[#1D263B] font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer shadow-md active:scale-95 group/btn disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Sign Up</span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Trust and Privacy Guarantee */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 px-2 text-[11px] text-[#A0ABBB] font-light">
                      <ShieldCheck size={13} className="text-[#C5A880] flex-shrink-0" />
                      <span>Zero spam. Complete confidentiality. Unsubscribe at any time.</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
