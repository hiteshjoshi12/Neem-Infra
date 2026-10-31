import React from 'react';
import Image from 'next/image';
import { Camera, ShieldCheck } from 'lucide-react';

/**
 * Validates if a string is a valid image source.
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
 * Ensures ImageKit URLs utilize CDN edge parameters directly
 * without requiring expensive server-side Next.js node processing.
 */
function formatOptimizedImageUrl(src, width = 1600) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();

  if (trimmed.includes('ik.imagekit.io') && !trimmed.includes('tr=')) {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}tr=f-auto,q-85,w-${width}`;
  }

  return trimmed;
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
  align = 'center',
  size = 'normal',
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

  let rawSrc = typeof src === 'string' ? src.trim() : '';
  let activeCaption = caption;

  // Clean trailing URL-encoded or raw titles like %20%22Caption%22 or %20"Caption"
  const spaceTitleMatch = rawSrc.match(/^([^\s"']+)\s+["']([^"']*)["']$/);
  if (spaceTitleMatch) {
    rawSrc = spaceTitleMatch[1];
    if (!activeCaption) activeCaption = spaceTitleMatch[2];
  }

  const encodedTitleMatch = rawSrc.match(/^(.*?)(?:%20|\s+)(?:%22|")?(.*?)(?:%22|")?$/i);
  if (encodedTitleMatch && encodedTitleMatch[2]) {
    rawSrc = encodedTitleMatch[1];
    if (!activeCaption) {
      try {
        activeCaption = decodeURIComponent(encodedTitleMatch[2]);
      } catch {
        activeCaption = encodedTitleMatch[2];
      }
    }
  }

  rawSrc = rawSrc.replace(/%22/g, '').replace(/["']/g, '').trim();

  // If the provided src is not a valid URL or path (e.g. "Subsection Heading"),
  // render a graceful placeholder instead of crashing next/image.
  if (!isValidImageSrc(rawSrc)) {
    return (
      <figure className={`my-8 sm:my-10 group ${className}`}>
        <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl md:rounded-3xl border border-dashed border-brand-navy/20 bg-brand-ivory flex flex-col items-center justify-center p-6 text-center shadow-xs`}>
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-3">
            <Camera size={22} />
          </div>
          <p className="font-serif font-bold text-sm text-brand-navy max-w-md">
            {cleanAlt}
          </p>
          <span className="text-[11px] text-brand-muted mt-1.5 font-mono">
            {rawSrc ? `[Unverified image path: ${rawSrc.slice(0, 40)}]` : '[Visual asset placeholder]'}
          </span>
        </div>

        {(caption || credit || source) && (
          <figcaption className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-brand-slate">
            {caption && (
              <span className="font-sans italic text-brand-slate leading-relaxed">
                {caption}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    );
  }

  // Format ImageKit URLs for CDN-level optimization
  const finalSrc = formatOptimizedImageUrl(rawSrc, width);

  // Check if remote host is in configured domains
  // Note: For ImageKit, we keep unoptimized={true} so Next.js server avoids redundant CPU resizing
  let isUnoptimized = true;
  if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://')) {
    try {
      const hostname = new URL(rawSrc).hostname;
      const configuredServerHosts = ['images.unsplash.com', 'saudagarproperties.com', 'www.saudagarproperties.com'];
      if (configuredServerHosts.includes(hostname)) {
        isUnoptimized = false;
      }
    } catch {
      isUnoptimized = true;
    }
  }

  // Container styling: Always full in center as requested ("keep in full in center")
  let layoutClass = 'my-8 sm:my-12 w-full max-w-4xl mx-auto clear-both block';
  if (size === 'wide' || align === 'wide') {
    layoutClass = 'my-10 sm:my-14 w-full max-w-5xl mx-auto clear-both block';
  } else if (size === 'full' || align === 'full') {
    layoutClass = 'my-10 sm:my-14 w-full max-w-full -mx-2 sm:-mx-4 lg:-mx-6 clear-both block';
  }

  return (
    <figure className={`group ${layoutClass} ${className}`}>
      {/* 
        Container with explicit aspect ratio to ensure ZERO Cumulative Layout Shift (CLS)
        during image loading and decoding
      */}
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl md:rounded-3xl border border-brand-navy/10 bg-slate-100 shadow-md transition-all duration-300 group-hover:shadow-lg`}>
        <Image
          src={finalSrc}
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
      {(activeCaption || credit || source) && (
        <figcaption className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-brand-slate">
          {activeCaption && (
            <span className="font-sans italic text-brand-slate leading-relaxed">
              {activeCaption}
            </span>
          )}

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-brand-muted">
            {credit && (
              <span className="inline-flex items-center gap-1">
                <Camera size={11} className="text-brand-gold" />
                <span>Photo: {credit}</span>
              </span>
            )}
            {source && (
              <span className="inline-flex items-center gap-1 font-medium text-brand-navy/70">
                <ShieldCheck size={11} className="text-brand-gold" />
                <span>Source: {source}</span>
              </span>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  );
}
