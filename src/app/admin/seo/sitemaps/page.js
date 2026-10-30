"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Network,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileText,
  Building,
  Compass,
  BookOpen,
  Layers,
  Tag as TagIcon,
  Award,
  Info,
  Calendar,
  Layers as LayersIcon
} from 'lucide-react';
import api from '@/services/api';

const CHILD_CONFIG_KEYS = {
  page: 'includePages',
  service: 'includeServices',
  property: 'includeProperties',
  corridor: 'includeCorridors',
  blog: 'includeBlogs',
  'blog-category': 'includeCategories',
  'blog-tag': 'includeTags',
  author: 'includeAuthors',
};

const ICONS = {
  page: FileText,
  service: Layers,
  property: Building,
  corridor: Compass,
  blog: BookOpen,
  'blog-category': LayersIcon,
  'blog-tag': TagIcon,
  author: Award,
};

export default function AdminSitemapsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);
  const [toggles, setToggles] = useState({
    includePages: true,
    includeServices: true,
    includeProperties: true,
    includeCorridors: true,
    includeBlogs: true,
    includeCategories: true,
    includeTags: false,
    includeAuthors: false,
  });
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getSitemapsSummary();
      if (res?.success && res.data) {
        setSummary(res.data);
        if (res.data.config) {
          setToggles({
            includePages: res.data.config.includePages !== false,
            includeServices: res.data.config.includeServices !== false,
            includeProperties: res.data.config.includeProperties !== false,
            includeCorridors: res.data.config.includeCorridors !== false,
            includeBlogs: res.data.config.includeBlogs !== false,
            includeCategories: res.data.config.includeCategories !== false,
            includeTags: Boolean(res.data.config.includeTags),
            includeAuthors: Boolean(res.data.config.includeAuthors),
          });
        }
      }
    } catch (err) {
      console.error('Failed to load sitemaps summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = (id) => {
    const key = CHILD_CONFIG_KEYS[id];
    if (!key) return;
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSitemapsConfig({
        sitemapConfig: toggles,
      });
      if (res?.success) {
        setSummary(res.data);
        setToast('Sitemap toggles saved! Index and child sitemaps revalidated.');
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to save sitemap configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 text-sm font-medium shadow-2xl animate-fade-in">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold tracking-widest text-brand-gold uppercase mb-2">
            <Network size={12} />
            <span>Sitemap Index Architecture</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            XML Sitemap Index & Child Sitemaps
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Admin-driven Yoast-style sitemap index. Each child sitemap contains exclusively its own content type.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-brand-text-dim hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Counts</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Toggles'}</span>
          </button>
        </div>
      </div>

      {/* Master Index Overview Banner */}
      <div className="p-6 rounded-3xl bg-brand-navy/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Live Sitemap Index
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base font-semibold text-white break-all flex items-center gap-2">
              <span>{summary?.indexUrl || '/sitemap_index.xml'}</span>
            </div>
            <p className="text-xs text-brand-text-dim max-w-xl">
              Referenced in robots.txt as the single source of truth for search engines. Empty child sitemaps are automatically omitted from the index.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/sitemap_index.xml"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs font-bold text-brand-gold hover:bg-brand-gold/20 transition-all"
            >
              <span>Open /sitemap_index.xml</span>
              <ExternalLink size={13} />
            </a>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 transition-all"
            >
              <span>/sitemap.xml</span>
              <ExternalLink size={12} className="text-brand-text-dim" />
            </a>
          </div>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <div className="text-[11px] text-brand-text-dim uppercase tracking-wider">Active Child Sitemaps</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {summary?.totalChildSitemaps || 0} <span className="text-xs text-brand-text-dim font-normal">/ {summary?.sitemaps?.length || 8}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-brand-text-dim uppercase tracking-wider">Total Indexed URLs</div>
            <div className="text-xl font-bold text-brand-gold mt-0.5">
              {summary?.totalUrls || 0}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] text-brand-text-dim uppercase tracking-wider">Index Last Modified</div>
            <div className="text-xs font-mono text-white mt-1">
              {summary?.indexLastmod || 'Never'}
            </div>
          </div>
        </div>
      </div>

      {/* Child Sitemaps List & Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Child Sitemaps Hierarchy</h2>
            <p className="text-xs text-brand-text-dim">
              Toggle child sitemaps on or off. URL counts and newest modified dates update dynamically.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {(summary?.sitemaps || []).map((child) => {
            const Icon = ICONS[child.id] || FileText;
            const toggleKey = CHILD_CONFIG_KEYS[child.id];
            const isEnabled = toggles[toggleKey] !== false;
            const inIndex = isEnabled && child.count > 0;

            return (
              <div
                key={child.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEnabled
                    ? 'bg-brand-navy/60 border-white/10 hover:border-white/20'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isEnabled ? 'bg-brand-gold/10 text-brand-gold' : 'bg-white/5 text-white/40'
                    }`}>
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{child.title}</span>
                        
                        {/* Status Badge */}
                        {inIndex ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            In Index
                          </span>
                        ) : isEnabled && child.count === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300" title="Do not list empty child sitemaps in index">
                            Empty (Omitted)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-brand-text-dim">
                            Disabled
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-brand-text-dim truncate mt-0.5">
                        {child.url}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Stats & Toggles */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    {/* Count */}
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase tracking-wider text-brand-text-dim">URLs</div>
                      <div className="text-sm font-bold font-mono text-white">
                        {child.count}
                      </div>
                    </div>

                    {/* Last Modified */}
                    <div className="text-left md:text-right min-w-[140px]">
                      <div className="text-[10px] uppercase tracking-wider text-brand-text-dim">Last Modified</div>
                      <div className="text-xs font-mono text-brand-gold truncate">
                        {child.lastmod ? child.lastmod.replace('T', ' ').slice(0, 19) : '—'}
                      </div>
                    </div>

                    {/* Open link */}
                    <a
                      href={`/${child.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-all shrink-0"
                    >
                      <span>Open</span>
                      <ExternalLink size={12} className="text-brand-gold" />
                    </a>

                    {/* On/Off Switch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-brand-text-dim hidden sm:inline">
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(child.id)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          isEnabled ? 'bg-brand-gold justify-end' : 'bg-white/15 justify-start'
                        }`}
                        title={`Toggle ${child.title} sitemap`}
                      >
                        <span className={`w-4 h-4 rounded-full shadow-md ${
                          isEnabled ? 'bg-brand-navy-deep' : 'bg-white/60'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Info Card */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
        <Info size={18} className="text-brand-gold shrink-0 mt-0.5" />
        <div className="text-xs text-brand-text-dim space-y-1">
          <p className="font-semibold text-white">Yoast-Style Sitemaps Protocol Rules:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Each child sitemap contains exclusively its own content type. No URL appears across multiple sitemaps.</li>
            <li>Any document marked <code className="text-brand-gold">noindex</code> or <code className="text-brand-gold">excludeFromSitemap</code> is automatically omitted.</li>
            <li>Child sitemaps with zero valid URLs are never listed in the index file.</li>
            <li>Each child sitemap&apos;s <code className="text-brand-gold">&lt;lastmod&gt;</code> in the index matches the newest document modified date within that sitemap.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

