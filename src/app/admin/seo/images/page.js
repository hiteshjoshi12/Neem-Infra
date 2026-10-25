"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Save,
  Check,
  Edit2,
  Layers,
  Sparkles,
  Trash2,
  Plus
} from 'lucide-react';
import api from '@/services/api';

export default function AdminImageAltHub() {
  const [images, setImages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, missing, issues, valid
  const [entityFilter, setEntityFilter] = useState('all'); // all, SectionContent, Property, BlogPost, etc.
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState('');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.getImageAltList({ type: typeFilter, entity: entityFilter });
      if (res?.success) {
        setImages(res.data || []);
        setSummary(res.summary || null);
      }
    } catch (err) {
      console.warn('Failed to load image audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [typeFilter, entityFilter]);

  const startInlineEdit = (item) => {
    setEditingId(item.id);
    setEditingValue(item.altText || item.suggestedAlt || '');
  };

  const handleSaveInline = async (item) => {
    try {
      setSavingId(item.id);
      await api.updateImageAlt({
        parentType: item.parentType,
        parentId: item.parentId,
        field: item.field,
        sectionIndex: item.sectionIndex,
        altText: editingValue,
      });

      setToast('Alt text updated successfully');
      setEditingId(null);
      await fetchImages();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update alt text');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteAlt = async (item) => {
    if (!window.confirm(`Clear/delete alt text for this image?`)) return;
    try {
      setSavingId(item.id);
      await api.deleteImageAlt({
        parentType: item.parentType,
        parentId: item.parentId,
        field: item.field,
        sectionIndex: item.sectionIndex,
      });

      setToast('Alt text cleared successfully');
      await fetchImages();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to clear alt text');
    } finally {
      setSavingId(null);
    }
  };

  const filteredImages = useMemo(() => {
    if (!searchQuery) return images;
    return images.filter(img =>
      img.parentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.altText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.imageUrl?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 text-sm font-medium shadow-2xl">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold tracking-widest text-brand-gold uppercase mb-2">
            <ImageIcon size={12} />
            <span>Image SEO & Accessibility</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Image Alt Text Manager
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Audit and manage descriptive alt texts across all website pages, blog posts, and property listings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchImages}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-text-dim hover:text-white transition-colors"
          title="Refresh List"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Summary KPI Badges */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-brand-navy/40 border border-white/10">
            <span className="text-[11px] font-bold text-brand-text-dim uppercase">Total Scanned Images</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.total}</div>
          </div>
          <div className="p-4 rounded-2xl bg-brand-navy/40 border border-white/10">
            <span className="text-[11px] font-bold text-emerald-400 uppercase">Valid & Optimized</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.valid}</div>
          </div>
          <div className="p-4 rounded-2xl bg-brand-navy/40 border border-white/10">
            <span className="text-[11px] font-bold text-rose-400 uppercase">Missing Alt Text</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.missing}</div>
          </div>
          <div className="p-4 rounded-2xl bg-brand-navy/40 border border-white/10">
            <span className="text-[11px] font-bold text-amber-400 uppercase">Warnings / Short</span>
            <div className="text-2xl font-serif font-bold text-white mt-1">{summary.warnings}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by parent title, image alt text, or URL..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Content Types ({summary?.total || 0})</option>
          <option value="SectionContent">Page Sections & Corridors ({summary?.byType?.SectionContent || 0})</option>
          <option value="Property">Property Listings & Galleries ({summary?.byType?.Property || 0})</option>
          <option value="BlogPost">Blog Posts ({summary?.byType?.BlogPost || 0})</option>
          <option value="Testimonial">Testimonials ({summary?.byType?.Testimonial || 0})</option>
          <option value="Author">Author Profiles ({summary?.byType?.Author || 0})</option>
          <option value="Page">Custom SEO Pages ({summary?.byType?.Page || 0})</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Statuses ({summary?.total || 0})</option>
          <option value="missing">Missing Alt Only ({summary?.missing || 0})</option>
          <option value="issues">Issues & Warnings ({summary?.warnings || 0})</option>
          <option value="valid">Valid Alt Only ({summary?.valid || 0})</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-brand-navy/40 border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-brand-text-dim uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Image Preview</th>
                <th className="py-4 px-4">Parent Entity</th>
                <th className="py-4 px-4">Current Alt Text & Inline Editor</th>
                <th className="py-4 px-4">SEO Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-text-dim">
                    <RefreshCw className="animate-spin inline-block mr-2 text-brand-gold" size={16} />
                    <span>Scanning media and alt texts...</span>
                  </td>
                </tr>
              ) : filteredImages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-text-dim">
                    No images found for this filter.
                  </td>
                </tr>
              ) : (
                filteredImages.map(img => {
                  const isEditing = editingId === img.id;
                  const isSaving = savingId === img.id;

                  return (
                    <tr key={img.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-4 px-5">
                        <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.imageUrl}
                            alt={img.altText || 'Thumbnail'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </td>

                      {/* Parent Entity */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                            img.parentType === 'SectionContent'
                              ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                              : img.parentType === 'Property'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : img.parentType === 'BlogPost'
                              ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                              : img.parentType === 'Testimonial'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : img.parentType === 'Author'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : 'bg-white/5 border-white/10 text-brand-gold'
                          }`}>
                            {img.parentType === 'SectionContent'
                              ? 'Page / Section'
                              : img.parentType === 'Property'
                              ? 'Property'
                              : img.parentType === 'BlogPost'
                              ? 'Blog Post'
                              : img.parentType}
                          </span>
                        </div>
                        <div className="text-white font-medium truncate mt-1" title={img.parentTitle}>
                          {img.parentTitle}
                        </div>
                        {img.parentSlug ? (
                          <a
                            href={img.parentSlug}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-brand-text-dim hover:text-brand-gold font-mono truncate mt-0.5 inline-flex items-center gap-1 transition-colors"
                          >
                            <span>{img.parentSlug}</span>
                            <ExternalLink size={9} />
                          </a>
                        ) : (
                          <div className="text-[10px] text-brand-text-dim font-mono truncate mt-0.5">
                            /
                          </div>
                        )}
                      </td>

                      {/* Current Alt Text / Inline Editor */}
                      <td className="py-4 px-4 max-w-md">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={e => setEditingValue(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSaveInline(img)}
                                placeholder={img.suggestedAlt || "Enter descriptive alt text..."}
                                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-brand-gold text-white text-xs focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveInline(img)}
                                disabled={isSaving}
                                className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors shrink-0"
                                title="Save Alt Text (Enter)"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors shrink-0"
                                title="Cancel"
                              >
                                ×
                              </button>
                            </div>
                            {img.suggestedAlt && editingValue !== img.suggestedAlt && (
                              <button
                                type="button"
                                onClick={() => setEditingValue(img.suggestedAlt)}
                                className="text-[10px] text-brand-gold hover:underline flex items-center gap-1 font-medium"
                              >
                                <Sparkles size={10} />
                                <span>Use suggestion: &ldquo;{img.suggestedAlt}&rdquo;</span>
                              </button>
                            )}
                          </div>
                        ) : !img.altText ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startInlineEdit(img)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all group"
                              title="Create and save alt text"
                            >
                              <Plus size={12} className="text-rose-400 group-hover:scale-110 transition-transform" />
                              <span>Create Alt Text</span>
                            </button>
                            {img.suggestedAlt && (
                              <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]" title={img.suggestedAlt}>
                                Suggestion: {img.suggestedAlt}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={() => startInlineEdit(img)}
                            className="cursor-pointer group flex items-center justify-between gap-2 p-2 rounded-xl bg-black/20 border border-transparent hover:border-white/20 transition-all"
                            title="Click to edit alt text"
                          >
                            <span className="text-white">
                              {img.altText}
                            </span>
                            <Edit2 size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                        )}
                        {img.issues && img.issues.length > 0 && (
                          <div className="text-[10px] text-amber-400 mt-1">
                            • {img.issues.join(', ')}
                          </div>
                        )}
                      </td>

                      {/* SEO Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          img.isValid ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                        }`}>
                          {img.isValid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          <span>{img.isValid ? 'Optimal' : 'Needs Attention'}</span>
                        </span>
                      </td>

                      {/* Actions (CRUD: Edit, Delete, View) */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => startInlineEdit(img)}
                            className="p-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit Alt Text"
                          >
                            <Edit2 size={13} />
                          </button>

                          {img.altText && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAlt(img)}
                              disabled={isSaving}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:text-white hover:bg-rose-500/30 transition-colors disabled:opacity-50"
                              title="Clear / Delete Alt Text"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}

                          <a
                            href={img.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white hover:bg-white/10 inline-block transition-colors"
                            title="Open original image"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
