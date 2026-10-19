"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const DEFAULT_DESKTOP_VIDEO = "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/saudagar-hero.mp4";
const DEFAULT_MOBILE_VIDEO = "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/saudagar-hero-mobile.mp4";
const DEFAULT_DESKTOP_POSTER = "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/poster.jpg?tr=f-auto,q-80";
const DEFAULT_MOBILE_POSTER = "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/poster-mobile.jpg?tr=f-auto,q-80";

const CinematicHeroBackground = forwardRef(function CinematicHeroBackground(
  {
    customPoster,
    videoUrl,
    videoMobileUrl,
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
  const [isMobile, setIsMobile] = useState(false);

  // Derive active states: controlled if passed, otherwise internal
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalPlaying;
  const isMuted = controlledIsMuted !== undefined ? controlledIsMuted : internalMuted;

  // Sync ref with parent forwardedRef
  useImperativeHandle(forwardedRef, () => internalVideoRef.current, []);

  // Sync with external videoRef prop if passed
  useEffect(() => {
    if (externalVideoRefProp) {
      if (typeof externalVideoRefProp === "function") {
        externalVideoRefProp(internalVideoRef.current);
      } else {
        externalVideoRefProp.current = internalVideoRef.current;
      }
    }
  }, [externalVideoRefProp]);

  // Check mobile viewport width
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Compute active video source and poster
  const activeVideoSrc = isMobile && videoMobileUrl
    ? videoMobileUrl
    : (videoUrl || DEFAULT_DESKTOP_VIDEO);

  const posterSrc = customPoster || (isMobile ? DEFAULT_MOBILE_POSTER : DEFAULT_DESKTOP_POSTER);

  // Helper to ensure autoplay runs cleanly across all browser security policies
  const attemptPlayback = (videoEl) => {
    if (!videoEl || prefersReducedMotion) return;

    // Explicitly enforce muted DOM properties (bypasses browser autoplay restrictions)
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.setAttribute("muted", "");
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("webkit-playsinline", "true");

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setInternalPlaying(true);
          setIsVideoLoaded(true);
          if (onPlay) onPlay();
        })
        .catch(() => {
          // If browser policy deferred autoplay, resume on first user interaction anywhere
          const resumeOnInteraction = () => {
            if (videoEl && videoEl.paused) {
              videoEl.play()
                .then(() => {
                  setInternalPlaying(true);
                  setIsVideoLoaded(true);
                  if (onPlay) onPlay();
                })
                .catch(() => {});
            }
            window.removeEventListener("pointerdown", resumeOnInteraction);
            window.removeEventListener("touchstart", resumeOnInteraction);
            window.removeEventListener("scroll", resumeOnInteraction);
            window.removeEventListener("keydown", resumeOnInteraction);
          };

          window.addEventListener("pointerdown", resumeOnInteraction, { once: true, passive: true });
          window.addEventListener("touchstart", resumeOnInteraction, { once: true, passive: true });
          window.addEventListener("scroll", resumeOnInteraction, { once: true, passive: true });
          window.addEventListener("keydown", resumeOnInteraction, { once: true, passive: true });
        });
    }
  };

  // Trigger playback whenever active source changes or component mounts
  useEffect(() => {
    const video = internalVideoRef.current;
    if (video) {
      attemptPlayback(video);
    }
  }, [activeVideoSrc, prefersReducedMotion]);

  // Controlled Play/Pause Sync
  useEffect(() => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (controlledIsPlaying === true) {
      if (video.paused) {
        attemptPlayback(video);
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

  // Callback ref to attach video element and trigger autoplay immediately
  const handleVideoRef = (el) => {
    internalVideoRef.current = el;
    if (el) {
      attemptPlayback(el);
    }
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

  const handleMediaReady = () => {
    setIsVideoLoaded(true);
    if (internalVideoRef.current && internalVideoRef.current.paused && isPlaying) {
      attemptPlayback(internalVideoRef.current);
    }
  };

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* 1. LCP Instant Poster Image Fallback (Exact First Frame of Video) */}
      <Image
        src={posterSrc}
        alt="Saudagar Luxury Properties Architecture"
        fill
        priority
        quality={90}
        sizes="100vw"
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isVideoLoaded && !prefersReducedMotion ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. Cinematic Remotion Video Layer */}
      {!prefersReducedMotion && (
        <video
          key={activeVideoSrc}
          ref={handleVideoRef}
          src={activeVideoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster={posterSrc}
          onLoadedMetadata={handleMediaReady}
          onCanPlay={handleMediaReady}
          onLoadedData={handleMediaReady}
          onPlaying={() => {
            setIsVideoLoaded(true);
            setInternalPlaying(true);
            if (onPlay) onPlay();
          }}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.05 && !isVideoLoaded) {
              setIsVideoLoaded(true);
            }
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
          className="w-full h-full object-cover filter brightness-[1.03] contrast-[1.02] saturate-[1.03]"
        >
          <source src={activeVideoSrc} type="video/mp4" />
        </video>
      )}

      {/* 3. Subtle Neutral Vignette Overlays (Delicate film tint) */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Soft directional gradient for editorial headline clarity */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none" />

      {/* Delicate top vignette for floating navbar readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Delicate bottom vignette for dock & section transition */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-obsidian/80 via-brand-obsidian/20 to-transparent pointer-events-none" />

      {/* 4. Optional Built-in Floating Discreet Video Controls */}
      {showControls && (
        <div className="absolute bottom-6 left-6 md:left-12 z-40 pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-obsidian/85 backdrop-blur-xl border border-white/20 text-white text-[11px] shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-brand-text-on-dark-muted tracking-wide font-light hidden sm:inline">
            Cinematic Architecture Tour
          </span>
          <div className="h-3 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="text-brand-gold hover:text-white transition-colors p-1 cursor-pointer"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="text-brand-gold hover:text-white transition-colors p-1 cursor-pointer"
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
