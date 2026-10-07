import React from 'react';
import Image from 'next/image';
import { Camera, ShieldCheck } from 'lucide-react';

/**
 * ArticleImage Component
 * ============================================================================
 * Production-ready, CLS-safe semantic image component for Saudagar Properties.
 * Meets Google Discover visual guidelines, Image SEO standards, and accessibility.
 *
 * Props:
 * - src: string (required) - Image URL (absolute HTTPS or local path)
 * - alt: string (required) - Meaningful, non-stuffed alt text
 * - caption: string (optional) - Editorial contextual caption
 * - credit: string (optional) - Photographer or agency credit
 * - source: string (optional) - Source archive (e.g., 'Saudagar Properties Archive')
 * - width: number (optional, default 1600)
 * - height: number (optional, default 900)
 * - aspectRatio: string (optional, default '16/9')
 * - priority: boolean (optional, default false) - Preload for LCP hero images
 * - sizes: string (optional) - Responsive sizes attribute
 * - className: string (optional)
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

  return (
    <figure className={`my-8 sm:my-10 group ${className}`}>
      {/* 
        Container with explicit aspect ratio to ensure ZERO Cumulative Layout Shift (CLS)
        during image loading and decoding
      */}
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl md:rounded-3xl border border-[#17213D]/10 bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-md`}>
        <Image
          src={src}
          alt={cleanAlt}
          fill
          priority={priority}
          sizes={sizes}
          quality={85}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
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
