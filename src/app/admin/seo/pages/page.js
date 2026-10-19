"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCode,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';
import api from '@/services/api';

export default function AdminSeoPagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft
  const [typeFilter, setTypeFilter] = useState('all'); // all, system, custom, service, corridor
  const [toast, setToast] = useState('');

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoPages();
      if (res?.success) {
        setPages(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load SEO pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleToggleStatus = async (page) => {
    const nextStatus = page.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateSeoPage(page._id, { status: nextStatus });
      setToast(`Page "${page.title}" changed to ${nextStatus.toUpperCase()}`);
      await fetchPages();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update page status');
    }
  };

  const handleDelete = async (page) => {
    if (page.pageType === 'system') {
      alert('System core pages cannot be deleted. You can unpublish or modify them instead.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the page "${page.title}" (${page.slug})?`)) {
      return;
    }

    try {
      await api.deleteSeoPage(page._id);
      setToast(`Page "${page.title}" deleted successfully`);
      await fetchPages();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete page');
    }
  };

  const filteredPages = useMemo(() => {
    return pages.filter(p => {
      const matchesSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.metaTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.h1?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesType = typeFilter === 'all' || p.pageType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [pages, searchQuery, statusFilter, typeFilter]);

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
            <FileCode size={12} />
            <span>Search & Meta Index</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Pages & Meta Tags Hub
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Manage titles, descriptions, H1, H2, canonicals, and robots indexing across all {pages.length} website pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPages}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-text-dim hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/admin/seo/pages/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
          >
            <Plus size={14} />
            <span>Create New Page</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, meta title, or H1 headline..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Page Types</option>
          <option value="system">Core System Pages</option>
          <option value="custom">Custom Landing Pages</option>
          <option value="service">Service Line Pages</option>
          <option value="corridor">Corridor Landing Pages</option>
        </select>
      </div>

      {/* Pages Table */}
      <div className="rounded-3xl bg-brand-navy/40 border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-brand-text-dim uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Page & Route</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Meta Title & SERP</th>
                <th className="py-4 px-4">H1 Headline</th>
                <th className="py-4 px-4">Robots</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-text-dim">
                    <RefreshCw className="animate-spin inline-block mr-2 text-brand-gold" size={16} />
                    <span>Loading SEO pages index...</span>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-text-dim">
                    No pages found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPages.map(page => {
                  const isIndex = page.robots?.index !== false;
                  const isPublished = page.status === 'published';
                  const titleChars = page.metaTitle ? page.metaTitle.length : 0;

                  return (
                    <tr key={page._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm group-hover:text-brand-gold transition-colors">
                          {page.title}
                        </div>
                        <div className="text-[11px] text-brand-text-dim font-mono mt-0.5">
                          {page.slug}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                          {page.pageType}
                        </span>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-white font-medium truncate" title={page.metaTitle}>
                          {page.metaTitle || <span className="text-amber-400 italic">Missing Custom Title</span>}
                        </div>
                        <div className="text-[10px] text-brand-text-dim mt-0.5">
                          {titleChars > 0 ? (
                            <span className={titleChars >= 40 && titleChars <= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                              {titleChars}/60 chars
                            </span>
                          ) : 'Default template'}
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-brand-text-on-dark-muted truncate" title={page.h1}>
                          {page.h1 || <span className="text-gray-500 italic">Not specified</span>}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isIndex ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                        }`}>
                          {isIndex ? 'index, follow' : 'noindex'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(page)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            isPublished
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {page.status}
                        </button>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={page.slug}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white hover:bg-white/10 transition-colors"
                            title="View on Live Website"
                          >
                            <ExternalLink size={14} />
                          </a>

                          <Link
                            href={`/admin/seo/pages/${page._id}`}
                            className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                            title="Edit Page SEO & Content"
                          >
                            <Edit3 size={14} />
                          </Link>

                          {page.pageType !== 'system' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(page)}
                              className="p-2 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition-colors"
                              title="Delete Page"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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
