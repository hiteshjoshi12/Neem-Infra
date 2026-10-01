import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, CheckCircle2 } from 'lucide-react';

export default function AboutVideoShowcase() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
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
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <section id="video-tour" className="relative py-12 md:py-16 bg-[#0C101A] text-white overflow-hidden">
      {/* Ambient Glows (0 blur, 0 rasterization overhead) */}
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Film size={13} className="text-[#C5A880]" />
            <span>Cinematic Film & Legacy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            Inside Saudagar Properties: <br />
            <span className="italic font-light text-[#C5A880]">Two Decades of Excellence</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Take an exclusive inside look at our bespoke advisory, hands-on founder dedication, and turnkey property acquisitions across DLF Gurugram.
          </p>
        </motion.div>

        {/* 3D Cinema Frame Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="group relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#C5A880]/30 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(197,168,128,0.2)] aspect-video flex items-center justify-center cursor-pointer select-none"
            onClick={togglePlay}
          >
            {/* The Video Element */}
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              muted={isMuted}
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Center Big Play Button (shown when paused or hovered) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                !isPlaying || showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative">
                {!isPlaying && (
                  <div className="absolute -inset-4 rounded-full bg-[#C5A880]/30 animate-ping opacity-75" />
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#C5A880] text-[#0C101A] flex items-center justify-center shadow-[0_0_40px_rgba(197,168,128,0.6)] transform transition-transform group-hover:scale-105 active:scale-95">
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200">
                <Sparkles size={13} className="text-[#C5A880]" />
                <span className="text-[11px] uppercase tracking-wider">Corporate Showcase Film</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A880]/20 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] text-[11px] font-bold tracking-wider uppercase">
                <span>4K HD</span>
              </div>
            </div>

            {/* Bottom Glassmorphic Control Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Progress Bar Scrubber */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer transition-all duration-200 relative group/bar"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#C5A880] to-[#E2CEB4] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span className="text-[11px] font-mono hidden sm:inline">
                      {isMuted ? 'Muted' : 'Unmuted'}
                    </span>
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
                    {currentTime} / {duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Under-Video Trust Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#C5A880] shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                Filmed on location in DLF Phase 2 & Gurgaon Prime Corridors
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#C5A880] shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                Direct consultation with founders Arun Sharma & Suneeta Chawla
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#C5A880] shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                Transparent verification of titles, deeds, and high ROI valuations
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
