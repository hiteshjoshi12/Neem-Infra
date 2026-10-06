"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const CinematicHeroBackground = forwardRef(function CinematicHeroBackground(
  {
    customPoster,
    videoUrl,
    className = "",
    videoRef: externalVideoRefProp,
    isPlaying: controlledIsPlaying,
    isMuted: controlledIsMuted,
    onPlay,
    onPause,
    onMuteChange,
    showControls = false,
  },
  forwardedRef
) {
  const internalVideoRef = useRef(null);
  const [internalPlaying, setInternalPlaying] = useState(true);
  const [internalMuted, setInternalMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Derive active states: controlled if passed, otherwise internal
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalPlaying;
  const isMuted = controlledIsMuted !== undefined ? controlledIsMuted : internalMuted;

  // Sync ref with parent forwardedRef
  useImperativeHandle(forwardedRef, () => internalVideoRef.current, []);

  // Sync with videoRef prop if parent passed videoRef as a prop
  useEffect(() => {
    if (externalVideoRefProp) {
      if (typeof externalVideoRefProp === "function") {
        externalVideoRefProp(internalVideoRef.current);
      } else {
        externalVideoRefProp.current = internalVideoRef.current;
      }
    }
  }, [externalVideoRefProp]);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Ensure autoplay on mount if video is present and not reduced motion
  useEffect(() => {
    if (prefersReducedMotion || !internalVideoRef.current) return;
    const playPromise = internalVideoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setInternalPlaying(true);
          if (onPlay) onPlay();
        })
        .catch(() => {
          // Autoplay policy fallback
        });
    }
  }, [prefersReducedMotion, onPlay]);

  // Controlled Play/Pause Sync
  useEffect(() => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (controlledIsPlaying === true) {
      if (video.paused) {
        video.play().catch(() => {});
      }
    } else if (controlledIsPlaying === false) {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [controlledIsPlaying]);

  // Controlled Mute Sync
  useEffect(() => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (typeof controlledIsMuted === "boolean") {
      video.muted = controlledIsMuted;
    }
  }, [controlledIsMuted]);

  // Direct Control Toggles
  const togglePlay = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setInternalPlaying(true);
        if (onPlay) onPlay();
      }).catch(() => {});
    } else {
      video.pause();
      setInternalPlaying(false);
      if (onPause) onPause();
    }
  };

  const toggleMute = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
    }
    setInternalMuted(nextMuted);
    if (onMuteChange) onMuteChange(nextMuted);
  };

  const posterSrc = customPoster || "/videos/saudagar/poster.jpg";

  // Callback ref to attach video element to all refs immediately
  const handleVideoRef = (el) => {
    internalVideoRef.current = el;
    if (forwardedRef) {
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else {
        forwardedRef.current = el;
      }
    }
    if (externalVideoRefProp) {
      if (typeof externalVideoRefProp === "function") {
        externalVideoRefProp(el);
      } else {
        externalVideoRefProp.current = el;
      }
    }
  };

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* 1. LCP Instant Poster Image Fallback */}
      <Image
        src={posterSrc}
        alt="Saudagar Luxury Properties Architecture"
        fill
        priority
        quality={88}
        sizes="100vw"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isVideoLoaded && !prefersReducedMotion ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. Cinematic Remotion Video Layer */}
      {!prefersReducedMotion && (
        <video
          ref={handleVideoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          poster={posterSrc}
          onLoadedData={() => setIsVideoLoaded(true)}
          onPlaying={() => {
            setIsVideoLoaded(true);
            setInternalPlaying(true);
            if (onPlay) onPlay();
          }}
          onPause={() => {
            setInternalPlaying(false);
            if (onPause) onPause();
          }}
          onVolumeChange={() => {
            if (internalVideoRef.current) {
              const muted = internalVideoRef.current.muted;
              setInternalMuted(muted);
              if (onMuteChange) onMuteChange(muted);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-1000 filter brightness-[1.03] contrast-[1.02] saturate-[1.03] ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {videoUrl ? (
            <source src={videoUrl} type="video/mp4" />
          ) : (
            <>
              {/* Mobile vertical optimized streams */}
              <source
                src="/videos/saudagar/saudagar-hero-mobile.mp4"
                type="video/mp4"
                media="(max-width: 768px)"
              />
              {/* Desktop high-resolution streams */}
              <source src="/videos/saudagar/saudagar-hero.mp4" type="video/mp4" />
            </>
          )}
        </video>
      )}

      {/* 3. Subtle Neutral Vignette Overlays (Significantly reduced blue tint to let vibrant video shine) */}
      {/* Light ambient film tint to keep sunny daylight while ensuring text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Soft directional gradient for editorial headline clarity (neutral, non-blue) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />

      {/* Delicate top vignette for floating navbar readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Delicate bottom vignette for dock & section transition */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070B16]/80 via-[#070B16]/20 to-transparent pointer-events-none" />

      {/* 4. Optional Built-in Floating Discreet Video Controls */}
      {showControls && (
        <div className="absolute bottom-6 left-6 md:left-12 z-40 pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070B16]/85 backdrop-blur-xl border border-white/20 text-white text-[11px] shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#C9CED9] tracking-wide font-light hidden sm:inline">
            Cinematic Architecture Tour
          </span>
          <div className="h-3 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="text-[#C6A24A] hover:text-white transition-colors p-1 cursor-pointer"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="text-[#C6A24A] hover:text-white transition-colors p-1 cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      )}
    </div>
  );
});

export default CinematicHeroBackground;
