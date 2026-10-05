"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, CheckCircle2 } from 'lucide-react';




export default function AboutVideoShowcase() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cinemaBoxRef = useRef(null);
  const playButtonGlowRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const videoUrl = "https://saudagarproperties.com/wp-content/uploads/2025/06/FINAL-ONE_2.mp4";

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(err => console.warn(err));
    } else {
      document.exitFullscreen?.().catch(err => console.warn(err));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(formatTime(current));
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

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

      // 2. Cinema Frame 3D Entrance
      gsap.fromTo(
        cinemaBoxRef.current,
        { opacity: 0, y: 50, scale: 0.95, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cinemaBoxRef.current,
            start: "top 85%",
            once: true
          },
          clearProps: "transform"
        }
      );

      // 3. Play Button Glow Pulse (Optimized for performance by disabling infinite loop)
      if (playButtonGlowRef.current) {
        gsap.set(playButtonGlowRef.current, { opacity: 0.5 }); // Static glow instead
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="video-tour"
      className="relative py-16 md:py-24 bg-[#0C101A] text-white overflow-hidden"
    >
      {/* Ambient Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(197,168,128,0.18) 0%, rgba(197,168,128,0) 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(179,147,102,0.12) 0%, rgba(179,147,102,0) 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D09A16] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Film size={13} className="text-[#D09A16]" />
            <span>Cinematic Film & Legacy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            Inside Saudagar Properties: <br />
            <span className="italic font-light text-[#D09A16]">Two Decades of Excellence</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Take an exclusive inside look at our bespoke advisory, hands-on founder dedication, and turnkey property acquisitions across DLF Gurugram.
          </p>
        </div>

        {/* 3D Cinema Frame Container */}
        <div
          ref={cinemaBoxRef}
          className="max-w-5xl mx-auto"
          style={{ perspective: 1200 }}
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="group relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#D09A16]/30 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(197,168,128,0.2)] aspect-video flex items-center justify-center cursor-pointer select-none"
            onClick={togglePlay}
          >
            {/* The Video Element */}
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              muted={isMuted}
              loop
              preload="none"
              poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Center Big Play Button */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="relative">
                {!isPlaying && (
                  <div
                    ref={playButtonGlowRef}
                    className="absolute -inset-4 rounded-full bg-[#D09A16]/40 pointer-events-none"
                  />
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#D09A16] text-[#0C101A] flex items-center justify-center shadow-[0_0_40px_rgba(197,168,128,0.6)] transform transition-transform group-hover:scale-105 active:scale-95">
                  {isPlaying ? (
                    <Pause size={34} className="fill-[#0C101A]" />
                  ) : (
                    <Play size={34} className="fill-[#0C101A] ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Top Badges Bar */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-[#D09A16]/40 text-[#D09A16] text-[10px] font-bold tracking-widest uppercase">
                <CheckCircle2 size={12} />
                <span>Official Walkthrough</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 uppercase">
                DLF Phase 1–5 Portfolio
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {/* Progress Scrub Bar */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer transition-all duration-200 relative group/bar"
              >
                <div
                  className="h-full bg-[#D09A16] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-sm" />
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <span className="font-mono text-[11px] text-slate-300">
                    {currentTime} / {duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
