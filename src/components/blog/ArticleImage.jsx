import React from 'react';
import Image from 'next/image';
import { Camera, ShieldCheck } from 'lucide-react';

/**
 * Validates if a string is a valid Next.js image source.
 * Must be either a root-relative path (starts with '/') or an absolute HTTP/HTTPS URL.
 */
function isValidImageSrc(src) {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * ArticleImage Component
 * ============================================================================
 * Production-ready, CLS-safe semantic image component for Saudagar Properties.
 * Meets Google Discover visual guidelines, Image SEO standards, and accessibility.
 * Completely crash-resilient against invalid markdown image URLs or unconfigured hosts.
 */
export default function ArticleImage({
  src,
  alt,
  caption,
  credit,
  source,
  width = 1600,
  height = 900,
  aspectRatio = '16/9',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px',
  className = ''
}) {
  if (!src) return null;

  // Clean and sanitize alt text
  const cleanAlt = (alt || caption || 'Saudagar Properties luxury real estate analysis').trim();

  // Map aspect ratio string to CSS style or tailwind class
  const aspectClass = aspectRatio === '4/3' 
    ? 'aspect-[4/3]' 
    : aspectRatio === '1/1' 
    ? 'aspect-square' 
    : 'aspect-[16/9]';

  const trimmedSrc = typeof src === 'string' ? src.trim() : '';

  // If the provided src is not a valid URL or path (e.g. "Subsection Heading"),
  // render a graceful placeholder instead of crashing next/image.
  if (!isValidImageSrc(trimmedSrc)) {
    return (
      <figure className={`my-8 sm:my-10 group ${className}`}>
        <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl md:rounded-3xl border border-dashed border-[#17213D]/20 bg-[#F7F5EF] flex flex-col items-center justify-center p-6 text-center shadow-xs`}>
          <div className="w-12 h-12 rounded-2xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mb-3">
            <Camera size={22} />
          </div>
          <p className="font-serif font-bold text-sm text-[#17213D] max-w-md">
            {cleanAlt}
          </p>
          <span className="text-[11px] text-[#8892A6] mt-1.5 font-mono">
            {trimmedSrc ? `[Unverified image path: ${trimmedSrc.slice(0, 40)}]` : '[Visual asset placeholder]'}
          </span>
        </div>

        {(caption || credit || source) && (
          <figcaption className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-[#566078]">
            {caption && (
              <span className="font-sans italic text-[#566078] leading-relaxed">
                {caption}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    );
  }

  // Check if remote host is in configured domains
  let isUnoptimized = false;
  if (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://')) {
    try {
      const hostname = new URL(trimmedSrc).hostname;
      const configuredHosts = ['images.unsplash.com', 'saudagarproperties.com', 'www.saudagarproperties.com'];
      if (!configuredHosts.includes(hostname)) {
        isUnoptimized = true;
      }
    } catch {
      isUnoptimized = true;
    }
  }

  return (
    <figure className={`my-8 sm:my-10 group ${className}`}>
      {/* 
        Container with explicit aspect ratio to ensure ZERO Cumulative Layout Shift (CLS)
        during image loading and decoding
      */}
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl md:rounded-3xl border border-[#17213D]/10 bg-slate-100 shadow-md transition-all duration-300 group-hover:shadow-lg`}>
        <Image
          src={trimmedSrc}
          alt={cleanAlt}
          fill
          unoptimized={isUnoptimized}
          priority={priority}
          sizes={sizes}
          quality={92}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
        {/* Subtle Luxury Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Semantic Captions, Photographer Credits & Verified Source */}
      {(caption || credit || source) && (
        <figcaption className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-[#566078]">
          {caption && (
            <span className="font-sans italic text-[#566078] leading-relaxed">
              {caption}
            </span>
          )}

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-[#8892A6]">
            {credit && (
              <span className="inline-flex items-center gap-1">
                <Camera size={11} className="text-[#D09A16]" />
                <span>Photo: {credit}</span>
              </span>
            )}
            {source && (
              <span className="inline-flex items-center gap-1 font-medium text-[#17213D]/70">
                <ShieldCheck size={11} className="text-[#D09A16]" />
                <span>Source: {source}</span>
              </span>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  );
}
