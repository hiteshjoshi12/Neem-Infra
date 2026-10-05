import React, { useState, useEffect } from 'react';
import { Sparkles, Building2, Compass, ShieldCheck } from 'lucide-react';

const LOADING_STATUSES = [
  "Mapping DLF Phase 1–5 Luxury Portfolios...",
  "Calibrating Architectural Blueprints...",
  "Curating High-ROI Residential & Commercial Assets...",
  "Connecting to Saudagar Private Client Desk..."
];

export default function PageLoader() {
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Cycle status text every 1.8 seconds
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 1800);

    // Smooth faux progress count
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const jump = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + jump, 95);
      });
    }, 250);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A11] text-white overflow-hidden select-none">
      {/* 3D Dynamic Keyframe Styles */}
      <style>{`
        @keyframes rotateTower3D {
          0% {
            transform: perspective(1000px) rotateX(-22deg) rotateY(0deg);
          }
          100% {
            transform: perspective(1000px) rotateX(-22deg) rotateY(360deg);
          }
        }
        @keyframes orbitRing {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes scanLight {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .anim-tower-3d {
          animation: rotateTower3D 9s linear infinite;
        }
        .anim-orbit-ring {
          animation: orbitRing 12s linear infinite;
        }
        .anim-orbit-ring-rev {
          animation: orbitRing 8s linear infinite reverse;
        }
      `}</style>

      {/* Ambient Lighting Orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(197,168,128,0.12) 0%, rgba(197,168,128,0.02) 50%, transparent 70%)'
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)'
        }}
      />

      {/* Blueprint Architectural Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(197,168,128,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(197,168,128,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ================= 3D HOLOGRAPHIC ARCHITECTURAL SKYSCRAPER ================= */}
      <div className="relative w-48 h-56 flex items-center justify-center mb-8">
        
        {/* Orbital Gold Rings (Floor Horizon) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-44 h-44 rounded-full border border-[#D09A16]/30 anim-orbit-ring"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D09A16] shadow-[0_0_12px_#D09A16]" />
          </div>
          <div
            className="w-32 h-32 rounded-full border border-dashed border-[#D09A16]/20 anim-orbit-ring-rev"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
        </div>

        {/* 3D Isometric Skyscraper Tower */}
        <div
          className="relative w-16 h-28 anim-tower-3d"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
        >
          {/* Internal Glowing Gold Core */}
          <div
            className="absolute inset-x-2 inset-y-4 rounded-xl bg-gradient-to-t from-[#D09A16] to-amber-300 opacity-75 blur-md"
            style={{
              transform: 'translateZ(0px)',
              animation: 'pulseGlow 2.5s ease-in-out infinite'
            }}
          />

          {/* FRONT FACE (Glass Curtain Wall) */}
          <div
            className="absolute inset-0 rounded-lg border border-[#D09A16]/60 bg-gradient-to-b from-[#151C2C]/90 via-[#0E1420]/90 to-[#070A11]/95 backdrop-blur-md overflow-hidden p-1.5 flex flex-col justify-between shadow-[0_0_15px_rgba(197,168,128,0.3)]"
            style={{ transform: 'translateZ(32px)' }}
          >
            {/* Windows Pattern */}
            <div className="grid grid-cols-2 gap-1 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xs bg-[#D09A16]/15 border border-[#D09A16]/25" />
              ))}
            </div>
            {/* Floor separator lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_11px,rgba(197,168,128,0.3)_12px)] bg-[size:100%_12px] pointer-events-none" />
          </div>

          {/* BACK FACE */}
          <div
            className="absolute inset-0 rounded-lg border border-[#D09A16]/40 bg-[#0C101A]/90 backdrop-blur-md overflow-hidden p-1.5 flex flex-col justify-between"
            style={{ transform: 'rotateY(180deg) translateZ(32px)' }}
          >
            <div className="grid grid-cols-2 gap-1 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xs bg-[#D09A16]/10 border border-[#D09A16]/20" />
              ))}
            </div>
          </div>

          {/* RIGHT FACE */}
          <div
            className="absolute inset-0 rounded-lg border border-[#D09A16]/50 bg-gradient-to-b from-[#101524]/90 via-[#0A0E18]/90 to-[#070A11]/95 backdrop-blur-md overflow-hidden p-1.5 flex flex-col justify-between"
            style={{ transform: 'rotateY(90deg) translateZ(32px)' }}
          >
            <div className="grid grid-cols-2 gap-1 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xs bg-[#D09A16]/15 border border-[#D09A16]/25" />
              ))}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_11px,rgba(197,168,128,0.25)_12px)] bg-[size:100%_12px] pointer-events-none" />
          </div>

          {/* LEFT FACE */}
          <div
            className="absolute inset-0 rounded-lg border border-[#D09A16]/40 bg-[#0C101A]/90 backdrop-blur-md overflow-hidden p-1.5 flex flex-col justify-between"
            style={{ transform: 'rotateY(-90deg) translateZ(32px)' }}
          >
            <div className="grid grid-cols-2 gap-1 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xs bg-[#D09A16]/10 border border-[#D09A16]/20" />
              ))}
            </div>
          </div>

          {/* TOP FACE (Penthouse Terrace / Spire) */}
          <div
            className="absolute inset-x-0 top-0 h-16 rounded-md border border-[#D09A16]/80 bg-gradient-to-br from-[#D09A16]/40 to-amber-400/20 backdrop-blur-md flex items-center justify-center shadow-lg"
            style={{
              transform: 'rotateX(90deg) translateZ(16px)',
              transformOrigin: 'top'
            }}
          >
            {/* Spire Beacon */}
            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#FFF] animate-ping" />
          </div>

          {/* BOTTOM BASE SHADOW */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 rounded-md bg-black/80 blur-md pointer-events-none"
            style={{
              transform: 'rotateX(-90deg) translateZ(16px)',
              transformOrigin: 'bottom'
            }}
          />
        </div>

        {/* 3D Blueprint Foundation Platform */}
        <div
          className="absolute -bottom-4 w-36 h-36 rounded-2xl border border-[#D09A16]/30 bg-gradient-to-tr from-[#D09A16]/10 to-transparent pointer-events-none"
          style={{
            transform: 'rotateX(72deg) rotateZ(45deg)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 0 35px rgba(197,168,128,0.2)'
          }}
        >
          <div className="absolute inset-2 border border-dashed border-[#D09A16]/30 rounded-xl" />
        </div>
      </div>

      {/* ================= BRANDING & EDITORIAL DETAILS ================= */}
      <div className="text-center space-y-3 z-10 max-w-sm px-4">
        {/* Prestige Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#D09A16]/35 text-[#D09A16] text-[10px] font-bold font-mono tracking-[0.25em] uppercase shadow-sm">
          <Sparkles size={11} className="text-[#D09A16]" />
          <span>Saudagar Properties • Est. 1999</span>
        </div>

        {/* Brand Headline */}
        <h2 className="text-xl sm:text-2xl font-serif tracking-wide text-white leading-tight">
          Pioneering <span className="italic font-light text-[#D09A16]">DLF Gurugram</span> Real Estate
        </h2>

        {/* Status Text Ticker */}
        <div className="h-5 flex items-center justify-center">
          <p className="text-xs text-slate-400 font-medium transition-opacity duration-300">
            {LOADING_STATUSES[statusIdx]}
          </p>
        </div>

        {/* High-End Champagne Gold Progress Bar */}
        <div className="w-56 mx-auto pt-2 space-y-1.5">
          <div className="relative w-full h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/5">
            {/* Animated Fill Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D09A16] via-[#E6D5BC] to-[#B39366] transition-all duration-300 shadow-[0_0_12px_#D09A16]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>VIP EXPERIENCE</span>
            <span className="text-[#D09A16] font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & Credibility */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-mono text-slate-600 tracking-widest uppercase">
        <Compass size={11} className="text-[#D09A16]/60" />
        <span>DLF Phase 2 • 28.4595° N, 77.0266° E</span>
      </div>
    </div>
  );
}