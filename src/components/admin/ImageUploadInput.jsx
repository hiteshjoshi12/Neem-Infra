"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Play,
  Film,
  ExternalLink
} from 'lucide-react';

export default function ImageUploadInput({
  label = "Upload Image",
  value = "",
  onChange,
  folder = "/saudagar-properties/general",
  description = "Browse file from your computer to upload directly to ImageKit.io CDN",
  recommendedRatio = "",
  cardContext = "",
  required = false,
  acceptVideo = false,
  mediaType = "image" // "image" | "video" | "all"
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [imageMeta, setImageMeta] = useState(null);
  const fileInputRef = useRef(null);

  // Determine whether this input accepts videos
  const allowsVideo = acceptVideo || mediaType === 'video' || mediaType === 'all';

  // Check if current value represents a video file
  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.toLowerCase().split('?')[0];
    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.ogg') ||
      cleanUrl.endsWith('.mkv') ||
      url.includes('/videos/') ||
      url.includes('fileType=video')
    );
  };

  const isCurrentValueVideo = isVideoUrl(value);

  // Measure natural dimensions and calculate aspect ratio for images
  useEffect(() => {
    if (!value || typeof window === 'undefined' || isCurrentValueVideo) {
      setImageMeta(null);
      return;
    }

    const img = new window.Image();
    img.src = value;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;
      const r = w / h;

      let detectedLabel = `${r.toFixed(2)}:1`;
      if (Math.abs(r - 16 / 9) < 0.05) detectedLabel = '16:9 (Landscape)';
      else if (Math.abs(r - 16 / 10) < 0.05) detectedLabel = '16:10 (Card)';
      else if (Math.abs(r - 4 / 3) < 0.05) detectedLabel = '4:3 (Standard)';
      else if (Math.abs(r - 3 / 2) < 0.05) detectedLabel = '3:2 (Classic)';
      else if (Math.abs(r - 1) < 0.05) detectedLabel = '1:1 (Square)';
      else if (Math.abs(r - 21 / 9) < 0.08) detectedLabel = '21:9 (Panorama)';
      else if (Math.abs(r - 9 / 16) < 0.05) detectedLabel = '9:16 (Portrait)';
      else if (r > 1) detectedLabel = `${r.toFixed(2)}:1 (Landscape)`;
      else detectedLabel = `${r.toFixed(2)}:1 (Portrait)`;

      let targetRatioNum = 0;
      if (recommendedRatio) {
        if (recommendedRatio === '16:9') targetRatioNum = 16 / 9;
        else if (recommendedRatio === '16:10') targetRatioNum = 16 / 10;
        else if (recommendedRatio === '4:3') targetRatioNum = 4 / 3;
        else if (recommendedRatio === '3:2') targetRatioNum = 3 / 2;
        else if (recommendedRatio === '1:1') targetRatioNum = 1;
        else if (recommendedRatio === '21:9') targetRatioNum = 21 / 9;
        else if (recommendedRatio === '9:16') targetRatioNum = 9 / 16;
        else {
          const parts = recommendedRatio.split(/[:/]/);
          if (parts.length === 2) targetRatioNum = parseFloat(parts[0]) / parseFloat(parts[1]);
        }
      }

      let fitStatus = 'match';
      let fitMessage = 'Perfect aspect ratio. Image will fit with zero cropping!';
      if (targetRatioNum > 0) {
        const diff = Math.abs(r - targetRatioNum);
        if (diff <= 0.08) {
          fitStatus = 'match';
          fitMessage = `Matches target card ratio (${recommendedRatio}) perfectly. No clipping will occur.`;
        } else if (diff <= 0.22) {
          fitStatus = 'slight';
          fitMessage = `Minor ratio deviation from target ${recommendedRatio}. Minimal edge cropping in card.`;
        } else {
          fitStatus = 'mismatch';
          fitMessage = `Crop Warning: Uploaded is ${detectedLabel}, but card expects ${recommendedRatio}. Subject may be cropped.`;
        }
      }

      setImageMeta({
        width: w,
        height: h,
        ratioNum: r,
        detectedLabel,
        fitStatus,
        fitMessage
      });
    };
    img.onerror = () => {
      setImageMeta(null);
    };
  }, [value, recommendedRatio, isCurrentValueVideo]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (mediaType === 'video' && !isVideo) {
      setError('Please select a valid video file (MP4, WebM, MOV, etc.)');
      return;
    }

    if (!allowsVideo && !isImage) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG, etc.)');
      return;
    }

    if (!isVideo && !isImage) {
      setError('Please select a supported image or video file.');
      return;
    }

    // Size limit: 100MB for video, 25MB for images
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${isVideo ? '100MB' : '25MB'}.`);
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      // Auto-assign folder if generic
      let targetFolder = folder;
      if (isVideo && folder === '/saudagar-properties/general') {
        targetFolder = '/saudagar-properties/videos';
      }
      formData.append('folder', targetFolder);

      const token = typeof window !== 'undefined' ? localStorage.getItem('saudagar_admin_token') : null;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.message || 'Failed to upload media to ImageKit');
      }
    } catch (err) {
      setError(err.message || 'Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Determine accept attribute
  let acceptAttr = "image/*";
  if (mediaType === 'video') {
    acceptAttr = "video/mp4,video/webm,video/quicktime,video/*";
  } else if (allowsVideo) {
    acceptAttr = "image/*,video/mp4,video/webm,video/quicktime,video/*";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-200">
          {label} {required && <span className="text-brand-gold">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {allowsVideo && (
            <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 flex items-center gap-1">
              <Film size={10} />
              <span>Video Supported</span>
            </span>
          )}
          {recommendedRatio && !isCurrentValueVideo && (
            <span className="text-[10px] text-brand-gold font-mono bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
              Target: {recommendedRatio}
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
            {folder}
          </span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-brand-gold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon size={11} />
            <span>{showManualInput ? "Hide Link" : "Paste URL"}</span>
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        accept={acceptAttr}
        className="hidden"
      />

      {/* Media Preview / Drop Zone */}
      {value ? (
        <div className="space-y-2">
          {isCurrentValueVideo ? (
            /* Video Preview Component */
            <div className="rounded-2xl overflow-hidden border border-sky-500/30 bg-slate-900/90 p-3.5 space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black/80 aspect-video max-h-56 flex items-center justify-center border border-white/10">
                <video
                  src={value}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
                    <Film size={14} className="text-sky-400 shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                  <p className="text-[11px] text-sky-400/90 mt-0.5 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Hosted on ImageKit.io High-Speed Video Streaming CDN</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={11} />
                    <span>Open</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-2.5 py-1 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Replace Video
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Image Preview Component */
            <div className="relative group rounded-2xl overflow-hidden border border-white/15 bg-slate-900/80 p-2.5 flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                <Image
                  src={value}
                  alt="Uploaded Preview"
                  fill
                  sizes="112px"
                  className="object-cover object-center"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white truncate">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{value}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Optimized &amp; hosted on ImageKit.io
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    <span>View</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Aspect Ratio Diagnostic Inspector Bar for Images */}
          {imageMeta && !isCurrentValueVideo && (
            <div
              className={`p-2.5 rounded-xl border text-[11px] flex flex-wrap items-center justify-between gap-2 ${
                imageMeta.fitStatus === 'match'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : imageMeta.fitStatus === 'slight'
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {imageMeta.fitStatus === 'match' ? (
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                ) : imageMeta.fitStatus === 'slight' ? (
                  <AlertCircle size={14} className="shrink-0 text-amber-400" />
                ) : (
                  <AlertCircle size={14} className="shrink-0 text-rose-400" />
                )}
                <span className="font-semibold font-mono">
                  {imageMeta.width} × {imageMeta.height} px ({imageMeta.detectedLabel})
                </span>
              </div>

              <div className="text-[10px] font-medium">
                {imageMeta.fitMessage}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-gold bg-brand-gold/10 scale-[1.01]'
              : 'border-white/15 hover:border-brand-gold/60 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <RefreshCw size={26} className="text-brand-gold animate-spin mb-2" />
              <p className="text-xs font-semibold text-white">Uploading to ImageKit.io...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Optimizing format and generating CDN streaming links</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-brand-gold mb-3 group-hover:scale-105 transition-transform">
                {allowsVideo ? <Video size={22} /> : <Upload size={20} />}
              </div>
              <p className="text-xs font-semibold text-white">
                <span className="text-brand-gold">Click to browse</span> or drag and drop {allowsVideo ? 'media (image or video)' : 'image'} here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {allowsVideo
                  ? 'MP4, WebM, MOV (up to 100MB) or PNG, JPG, WebP, SVG (up to 25MB)'
                  : 'PNG, JPG, WEBP, SVG up to 25MB'}
                {recommendedRatio && !allowsVideo && (
                  <span className="text-brand-gold font-medium block mt-0.5">
                    Recommended Card Ratio: {recommendedRatio} {cardContext ? `(${cardContext})` : ''}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="pt-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ik.imagekit.io/saudagarproperties/..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors font-mono"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
          <AlertCircle size={13} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export { ImageUploadInput as MediaUploadInput };
