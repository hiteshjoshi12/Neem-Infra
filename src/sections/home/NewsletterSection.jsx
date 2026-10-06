"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";
import { useCms } from "../../context/CmsContext";
import api from "../../services/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NewsletterSection({ isEmbedded = false }) {
  const { sections } = useCms();
  const newsData = sections?.newsletter || {};

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) return;

      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      if (previewRef.current) {
        gsap.fromTo(
          previewRef.current,
          { opacity: 0, scale: 0.96, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) return;

    setIsLoading(true);

    try {
      await api.createInquiry({
        email: email.trim(),
        type: "newsletter",
      });
    } catch (err) {
      console.warn("Newsletter API error:", err?.message);
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }
  };

  const content = (
    <div
      ref={containerRef}
      className="
        group/news
        relative
        overflow-hidden
        rounded-3xl sm:rounded-[36px]
        border border-[#C6A24A]/30
        bg-gradient-to-br from-[#0E162B] via-[#121B35] to-[#0A1020]
        p-7 sm:p-10 lg:p-12
        shadow-[0_30px_90px_rgba(14,22,43,0.35)]
      "
    >
      {/* =====================================================
          BACKGROUND AMBIENT AURORA & ARCHITECTURAL GRID
      ====================================================== */}

      {/* Gold Ambient Glow in Top-Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#C6A24A]/[0.14] blur-[100px] transition-all duration-700 group-hover/news:bg-[#C6A24A]/20"
      />

      {/* Deep Indigo Glow in Bottom-Left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#1F2C54]/40 blur-[100px]"
      />

      {/* Architectural Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#C6A24A_1px,transparent_1px),linear-gradient(to_bottom,#C6A24A_1px,transparent_1px)] bg-[size:48px_48px]"
      />

      {/* Top Illuminated Gold Accent Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A24A] to-transparent opacity-85"
      />

      {/* Corner Architectural Crosshairs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 select-none font-mono text-[9px] text-[#C6A24A]/40"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 select-none font-mono text-[9px] text-[#C6A24A]/40"
      >
        +
      </div>

      {/* =====================================================
          MAIN ASYMMETRIC CONTENT GRID
      ====================================================== */}

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">

        {/* LEFT: EDITORIAL COPY & VIP SUBSCRIPTION FORM (7 COLS) */}
        <div className="lg:col-span-7">

          {/* Eyebrow Badge with Pulsing Live Beacon */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C6A24A]/30 bg-[#C6A24A]/10 px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C6A24A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C6A24A]" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#C6A24A]">
              {newsData.badge || "PRIVATE CLIENT INTELLIGENCE"}
            </span>
          </div>

          {/* Majestic Serif Headline */}
          <h2
            id="newsletter-heading"
            className="mt-4 font-serif text-3xl font-normal leading-[1.08] tracking-tight text-[#F7F5EF] sm:text-4xl lg:text-[44px]"
          >
            {newsData.titleMain || "Stay ahead with"}{" "}
            <span className="font-light italic text-[#C6A24A]">
              {newsData.titleItalic || "Saudagar Properties"}
            </span>
          </h2>

          {/* Curated Description */}
          <p className="mt-3.5 max-w-xl text-xs font-light leading-relaxed text-[#C9CED9] sm:text-sm">
            {newsData.description ||
              "Direct micro-market alerts, off-market builder floors in DLF Phase 1–5, and sovereign yield analytics delivered straight to your confidential inbox."}
          </p>

          {/* VIP Benefit Pills */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {[
              { label: "Off-Market Inventory", icon: Lock },
              { label: "Quarterly Price Index", icon: TrendingUp },
              { label: "Confidential Dispatch", icon: ShieldCheck },
            ].map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#C9CED9]/80 backdrop-blur-sm"
                >
                  <Icon size={10} className="text-[#C6A24A]" />
                  <span>{pill.label}</span>
                </div>
              );
            })}
          </div>

          {/* Subscription Interaction Form */}
          <div className="mt-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="relative">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                {/* Frosted Capsule Input Wrapper */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 rounded-2xl border border-[#C6A24A]/35 bg-[#172347]/85 p-2 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 focus-within:border-[#C6A24A] focus-within:shadow-[0_0_35px_rgba(198,162,74,0.3)]">
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-2">
                    <Mail size={17} className="shrink-0 text-[#C6A24A]" />
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        newsData.placeholder ||
                        "Enter your confidential email..."
                      }
                      className="w-full bg-transparent text-xs sm:text-sm text-[#F7F5EF] outline-none placeholder:text-[#8E97AB] font-light"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                      group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl
                      bg-gradient-to-r from-[#C6A24A] via-[#DFC06C] to-[#C6A24A] bg-[length:200%_auto]
                      px-7 py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A1020]
                      shadow-[0_8px_25px_rgba(198,162,74,0.3)] transition-all duration-500
                      hover:bg-[position:right_center] hover:shadow-[0_12px_35px_rgba(198,162,74,0.5)] hover:-translate-y-0.5
                      disabled:opacity-60 cursor-pointer
                    "
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A1020] border-t-transparent" />
                    ) : (
                      <>
                        <span className="relative z-10">
                          {newsData.buttonText || "Request Access"}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                        />
                      </>
                    )}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                  </button>
                </div>

                {/* Privacy & Anti-Spam Guarantee Subtext */}
                <div className="mt-3 flex items-center gap-2 px-1 text-[9px] sm:text-[10px] font-light text-[#C9CED9]/65">
                  <ShieldCheck size={13} className="text-[#C6A24A] shrink-0" />
                  <span>
                    {newsData.disclaimer ||
                      "Zero spam. Complete confidentiality. Unsubscribe at any time."}
                  </span>
                </div>
              </form>
            ) : (
              /* Success Confirmation Panel */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#C6A24A]/40 bg-[#162348]/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C6A24A]/20 text-[#C6A24A]">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F7F5EF]">
                      {newsData.successTitle || "Subscription Confirmed"}
                    </h4>
                    <p className="mt-0.5 text-xs text-[#C9CED9]/80 font-light">
                      {newsData.successMessage ||
                        "You have been added to our private advisory list. Exclusive market briefings are on their way."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C6A24A] hover:text-[#E2C372] underline underline-offset-4 cursor-pointer self-end sm:self-center"
                >
                  {newsData.subscribeAnotherText || "Subscribe Another"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: TANGIBLE "MARKET DISPATCH PREVIEW" CARD (5 COLS) */}
        <div ref={previewRef} className="lg:col-span-5 relative">
          <div className="relative overflow-hidden rounded-2xl border border-[#C6A24A]/25 bg-white/[0.035] p-6 sm:p-7 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

            {/* Document Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#C6A24A]" />
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C6A24A]">
                  SAUDAGAR MARKET REPORT
                </span>
              </div>
              <span className="font-mono text-[8px] text-white/40">
                Q1 · 2026 EDITION
              </span>
            </div>

            {/* Document Body Teaser */}
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-[#121A33]/80 p-3.5">
                <div className="flex items-center justify-between text-[8px] font-semibold uppercase tracking-[0.18em] text-[#C9CED9]/70">
                  <span>DLF Phase 1–5 Average Yield</span>
                  <span className="font-mono text-[#C6A24A]">+7.4% YOY</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-[#C6A24A] to-[#E2C372]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-[#121A33]/80 p-3">
                  <span className="block text-[7px] font-bold uppercase tracking-[0.2em] text-[#C9CED9]/50">
                    Off-Market Assets
                  </span>
                  <span className="mt-1 block font-serif text-lg text-[#F7F5EF]">
                    ₹180+ Cr
                  </span>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#121A33]/80 p-3">
                  <span className="block text-[7px] font-bold uppercase tracking-[0.2em] text-[#C9CED9]/50">
                    Registry Verification
                  </span>
                  <span className="mt-1 block font-serif text-lg text-[#C6A24A]">
                    100% Legal
                  </span>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed text-[#C9CED9]/60 italic font-serif">
                “Discreet institutional intelligence on builder floors, villas, and commercial floors in Golf Course Rd corridor.”
              </p>
            </div>

            {/* Document Stamp Seal */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5 font-mono text-[7px] uppercase tracking-[0.24em] text-white/35">
              <span>DLF GURUGRAM DESK</span>
              <span className="text-[#C6A24A]">CONFIDENTIAL DISPATCH</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  if (isEmbedded) {
    return <div className="w-full mt-12 sm:mt-16">{content}</div>;
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="w-full bg-[#EFEBE1] py-14 sm:py-16 md:py-20 border-t border-[#17213D]/[0.08]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">{content}</div>
    </section>
  );
}