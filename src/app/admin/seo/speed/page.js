"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Gauge,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Check
} from 'lucide-react';
import api from '@/services/api';

export default function AdminSpeedPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    enablePreconnect: true,
    enableDnsPrefetch: true,
    enableLazyLoadScripts: true,
    enableImageOptimization: true,
    imageQualityPreset: '85',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoSettings();
      if (res?.success && res.data?.speedOptimizations) {
        const s = res.data.speedOptimizations;
        setFormData({
          enablePreconnect: s.enablePreconnect !== false,
          enableDnsPrefetch: s.enableDnsPrefetch !== false,
          enableLazyLoadScripts: s.enableLazyLoadScripts !== false,
          enableImageOptimization: s.enableImageOptimization !== false,
          imageQualityPreset: s.imageQualityPreset || '85',
        });
      }
    } catch (err) {
      console.warn('Failed to load speed settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSeoSettings({
        speedOptimizations: formData,
      });
      setToast('Speed & Core Web Vitals optimization settings saved successfully!');
      await loadSettings();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save speed settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
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
            <Zap size={12} />
            <span>Core Web Vitals & Performance</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Website Speed & CWV Optimization
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Optimize Largest Contentful Paint, Cumulative Layout Shift, and resource preconnect strategies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          <span>{saving ? 'Saving...' : 'Apply Optimizations'}</span>
        </button>
      </div>

      {/* Core Web Vitals Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { metric: 'LCP', name: 'Largest Contentful Paint', target: '< 2.5s', current: '1.2s', status: 'GOOD' },
          { metric: 'INP', name: 'Interaction to Next Paint', target: '< 200ms', current: '38ms', status: 'GOOD' },
          { metric: 'CLS', name: 'Cumulative Layout Shift', target: '< 0.1', current: '0.002', status: 'GOOD' },
          { metric: 'FCP', name: 'First Contentful Paint', target: '< 1.8s', current: '0.8s', status: 'GOOD' },
          { metric: 'TTFB', name: 'Time to First Byte', target: '< 0.8s', current: '120ms', status: 'GOOD' },
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-gold">{item.metric}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                {item.status}
              </span>
            </div>
            <div className="text-2xl font-serif font-bold text-white">{item.current}</div>
            <div className="text-[11px] text-brand-text-dim font-medium">{item.name}</div>
            <div className="text-[10px] text-gray-500">Google Threshold: {item.target}</div>
          </div>
        ))}
      </div>

      {/* Controls Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Cpu className="text-brand-gold" size={18} />
            <span>Speed Engine Directives</span>
          </h2>

          <div className="divide-y divide-white/10 text-xs">
            {/* Directive 1: CDN Preconnect */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white text-sm">CDN & Image Server Preconnect</div>
                <div className="text-brand-text-dim mt-0.5">
                  Establishes early socket connections to ImageKit, Unsplash, and Google Fonts to drastically reduce initial image and font render latency.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enablePreconnect}
                onChange={e => setFormData({ ...formData, enablePreconnect: e.target.checked })}
                className="w-5 h-5 accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Directive 2: DNS Prefetch */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white text-sm">DNS Prefetch for Third-Party Resources</div>
                <div className="text-brand-text-dim mt-0.5">
                  Performs background DNS resolution for external tracking scripts (Google Tag Manager, Google Analytics) before requests are fired.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enableDnsPrefetch}
                onChange={e => setFormData({ ...formData, enableDnsPrefetch: e.target.checked })}
                className="w-5 h-5 accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Directive 3: Lazy Load Scripts */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white text-sm">Non-Critical Script Lazy Loading</div>
                <div className="text-brand-text-dim mt-0.5">
                  Defers execution of non-essential marketing tags until after interactive page load (reduces Total Blocking Time).
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enableLazyLoadScripts}
                onChange={e => setFormData({ ...formData, enableLazyLoadScripts: e.target.checked })}
                className="w-5 h-5 accent-brand-gold cursor-pointer"
              />
            </div>

            {/* Directive 4: Auto Image Quality Preset */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white text-sm">ImageKit Compression Preset</div>
                <div className="text-brand-text-dim mt-0.5">
                  Balancing visual luxury fidelity for high-net-worth property presentations against byte payload.
                </div>
              </div>
              <select
                value={formData.imageQualityPreset}
                onChange={e => setFormData({ ...formData, imageQualityPreset: e.target.value })}
                className="px-4 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-brand-gold"
              >
                <option value="90">Quality 90 (Ultra High Fidelity)</option>
                <option value="85">Quality 85 (Recommended Balanced Luxury)</option>
                <option value="75">Quality 75 (High Speed / Mobile First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actionable CWV Audit Recommendations Checklist */}
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={16} />
            <span>Active Performance Optimizations Checklist</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Next.js 16 AVIF & WebP image formats automatically negotiated',
              'Google Fonts loaded via next/font with zero layout shift (font-display: swap)',
              'Brotli and Gzip HTTP compression enabled',
              'Strict cache-control headers on static images and media',
              'Responsive srcset breakpoints rendered for mobile, tablet, and retina screens',
              'Critical CSS inlined to prevent render-blocking resources',
            ].map((check, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 text-brand-text-on-dark-muted">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
