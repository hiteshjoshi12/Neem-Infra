"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function ImageUploadInput({
  label = "Upload Image",
  value = "",
  onChange,
  folder = "/saudagar-properties/general",
  description = "Browse image from your computer to upload directly to ImageKit.io",
  recommendedRatio = "",
  cardContext = "",
  required = false
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [imageMeta, setImageMeta] = useState(null);
  const fileInputRef = useRef(null);

  // Measure natural dimensions and calculate exact aspect ratio
  React.useEffect(() => {
    if (!value || typeof window === 'undefined') {
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
  }, [value, recommendedRatio]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

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
        setError(data.message || 'Failed to upload image to ImageKit');
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-200">
          {label} {required && <span className="text-[#D09A16]">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {recommendedRatio && (
            <span className="text-[10px] text-[#D09A16] font-mono bg-[#D09A16]/10 px-2 py-0.5 rounded border border-[#D09A16]/20">
              Target: {recommendedRatio}
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
            {folder}
          </span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-[#D09A16] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon size={11} />
            <span>{showManualInput ? "Hide Link" : "Paste URL"}</span>
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Image Preview / Drop Zone */}
      {value ? (
        <div className="space-y-2">
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Replace Image
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

          {/* Aspect Ratio Diagnostic Inspector Bar */}
          {imageMeta && (
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
              ? 'border-[#D09A16] bg-[#D09A16]/10 scale-[1.01]'
              : 'border-white/15 hover:border-[#D09A16]/60 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <RefreshCw size={26} className="text-[#D09A16] animate-spin mb-2" />
              <p className="text-xs font-semibold text-white">Uploading to ImageKit.io...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Optimizing format and generating CDN URLs</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#D09A16] mb-3 group-hover:scale-105 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-xs font-semibold text-white">
                <span className="text-[#D09A16]">Click to browse</span> or drag and drop image here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                PNG, JPG, WEBP, SVG up to 15MB
                {recommendedRatio && (
                  <span className="text-[#D09A16] font-medium block mt-0.5">
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
            placeholder="https://ik.imagekit.io/saudagar/..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#D09A16] text-white text-xs outline-none transition-colors font-mono"
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
