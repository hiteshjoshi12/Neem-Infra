"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Link2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Camera,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];

export default function ImageInsertModal({
  isOpen,
  onClose,
  onInsert,
  initialData = null
}) {
  const [sourceType, setSourceType] = useState('upload'); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState(initialData?.src || '');
  const [altText, setAltText] = useState(initialData?.alt || '');
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [credit, setCredit] = useState(initialData?.credit || '');
  const [source, setSource] = useState(initialData?.source || 'Saudagar Properties Archive');
  const [align, setAlign] = useState(initialData?.align || 'center'); // 'center' | 'left' | 'right' | 'wide' | 'full'
  const [size, setSize] = useState(initialData?.size || 'normal'); // 'normal' | 'wide' | 'full'

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state whenever initialData or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setImageUrl(initialData.src || '');
        setAltText(initialData.alt || '');
        setCaption(initialData.caption || '');
        setCredit(initialData.credit || '');
        setSource(initialData.source || 'Saudagar Properties Archive');
        setAlign(initialData.align || 'center');
        setSize(initialData.size || 'normal');
        setSourceType(initialData.src ? 'url' : 'upload');
      } else {
        setImageUrl('');
        setAltText('');
        setCaption('');
        setCredit('');
        setSource('Saudagar Properties Archive');
        setAlign('center');
        setSize('normal');
        setSourceType('upload');
      }
      setErrorMsg('');
      setUploadProgress(0);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMsg('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg(`Unsupported file type (${file.type}). Allowed: JPG, PNG, WebP, AVIF, SVG.`);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 25MB limit.`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(20);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', '/saudagar-properties/blogs');
      formData.append('altText', altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

      const token = typeof window !== 'undefined' ? localStorage.getItem('saudagar_admin_token') : null;
      setUploadProgress(50);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      setUploadProgress(85);
      const data = await res.json();

      if (data.success && data.url) {
        setImageUrl(data.url);
        if (!altText.trim()) {
          const autoAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setAltText(autoAlt);
          if (!caption.trim()) setCaption(autoAlt);
        }
        setUploadProgress(100);
      } else {
        throw new Error(data.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('[ImageInsertModal Upload Error]:', err);
      setErrorMsg(err.message || 'Failed to upload image to ImageKit.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    let cleanSrc = imageUrl.trim();
    cleanSrc = cleanSrc.replace(/(?:%20|\s+)(?:%22|")?[^"%'`]*(?:%22|")?$/i, '').replace(/%22/g, '').replace(/["']/g, '').trim();

    if (!cleanSrc) {
      setErrorMsg('Please upload an image or enter a valid image URL.');
      return;
    }

    onInsert({
      src: cleanSrc,
      alt: altText.trim() || 'Saudagar luxury real estate asset',
      caption: caption.trim(),
      credit: credit.trim(),
      source: source.trim(),
      align: 'center',
      size: 'full'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-navy-deep border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center">
              <ImageIcon size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">{initialData ? 'Edit Image Details' : 'Insert Article Image'}</h3>
              <p className="text-[11px] text-slate-400">
                {initialData ? 'Update image position, alignment, caption, and alt text' : 'Embed cloud-optimized images at the exact cursor position'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
          {/* Source Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setSourceType('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                sourceType === 'upload' ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload size={13} />
              <span>Upload to ImageKit</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceType('url')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                sourceType === 'url' ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 size={13} />
              <span>Image URL</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {sourceType === 'upload' ? (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-brand-gold bg-brand-gold/10'
                    : imageUrl
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-white/15 bg-white/[0.02] hover:border-brand-gold/40 hover:bg-white/[0.04]'
                }`}
              >
                {uploading ? (
                  <div className="space-y-3 py-4">
                    <RefreshCw size={24} className="text-brand-gold animate-spin mx-auto" />
                    <p className="text-xs text-brand-gold font-semibold">Uploading to ImageKit ({uploadProgress}%)...</p>
                    <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                      <div
                        className="h-full bg-brand-gold transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-emerald-300">Image successfully uploaded to ImageKit</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-sm">{imageUrl}</p>
                    </div>
                    <span className="text-[11px] underline text-slate-300 ml-2">Click to replace</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-brand-gold flex items-center justify-center mx-auto border border-white/10">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Click to browse or drop an image here</p>
                      <p className="text-[10px] text-slate-400">JPEG, PNG, WebP, AVIF, SVG up to 25MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Image Source URL
              </label>
              <input
                type="text"
                placeholder="https://ik.imagekit.io/... or https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:border-brand-gold outline-none"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Image Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Alt Text <span className="text-brand-gold font-bold">*</span> (Required for SEO)
              </label>
              <input
                type="text"
                placeholder="Descriptive real estate keywords..."
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Accurately describe the visual for Google Image Search</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Caption Text (Shown in &lt;figcaption&gt;)
              </label>
              <input
                type="text"
                placeholder="Editorial caption displayed below image..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Photographer / Credit
              </label>
              <input
                type="text"
                placeholder="e.g. Arun Sharma / Architectural Digest"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Verified Asset Source
              </label>
              <input
                type="text"
                placeholder="e.g. Saudagar Properties Archive"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
            </div>
          </div>

          {/* Streamlined Layout Indicator (Always Full & Centered) */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Layout Presentation:</span>
                <span className="ml-1.5 text-slate-400">Full Width Centered (Auto-responsive 16:9)</span>
              </div>
            </div>
            <span className="text-[10px] text-brand-gold font-mono uppercase tracking-wider bg-brand-gold/10 px-2.5 py-1 rounded-full border border-brand-gold/20">
              Zero CLS
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-brand-obsidian/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!imageUrl.trim() || uploading}
            className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40 cursor-pointer transition-all shadow-md flex items-center gap-2"
          >
            <ImageIcon size={14} />
            <span>{initialData ? 'Update Image' : 'Insert Image'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

