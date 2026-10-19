"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Globe,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import api from '@/services/api';

export default function AdminIntegrationsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    googleAnalyticsId: '',
    enableGa4: true,
    googleTagManagerId: '',
    enableGtm: true,
    googleSearchConsoleCode: '',
    enableGsc: true,
    siteTitleTemplate: '%s | Saudagar Properties',
    defaultMetaTitle: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
    defaultMetaDescription: '',
    defaultOgImage: '',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoSettings();
      if (res?.success && res.data) {
        setSettings(res.data);
        setFormData({
          googleAnalyticsId: res.data.googleAnalyticsId || '',
          enableGa4: res.data.enableGa4 !== false,
          googleTagManagerId: res.data.googleTagManagerId || '',
          enableGtm: res.data.enableGtm !== false,
          googleSearchConsoleCode: res.data.googleSearchConsoleCode || '',
          enableGsc: res.data.enableGsc !== false,
          siteTitleTemplate: res.data.siteTitleTemplate || '%s | Saudagar Properties',
          defaultMetaTitle: res.data.defaultMetaTitle || 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
          defaultMetaDescription: res.data.defaultMetaDescription || '',
          defaultOgImage: res.data.defaultOgImage || '',
        });
      }
    } catch (err) {
      console.warn('Failed to load SEO settings:', err);
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
      const res = await api.updateSeoSettings(formData);
      if (res?.success) {
        setToast('Tracking & verification tokens saved successfully! Active immediately on live site.');
        await loadSettings();
        setTimeout(() => setToast(''), 3500);
      }
    } catch (err) {
      alert(err.message || 'Failed to save integrations');
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
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
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
            <Activity size={12} />
            <span>Search & Tracking Integrations</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Google Analytics, Search Console & GTM
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Configure measurement tags and verification tokens without touching code or redeploying the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Module 1: Google Search Console */}
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Search Console Verification</h3>
                <p className="text-[11px] text-brand-text-dim">Domain ownership verification for Google Search indexation & search performance tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                formData.googleSearchConsoleCode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {formData.googleSearchConsoleCode ? 'VERIFIED' : 'NOT CONFIGURED'}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
              HTML Verification Token or Full Meta Tag
            </label>
            <input
              type="text"
              value={formData.googleSearchConsoleCode}
              onChange={e => setFormData({ ...formData, googleSearchConsoleCode: e.target.value })}
              placeholder="e.g. google-site-verification=abc123xyz456 or abc123xyz456"
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-brand-gold"
            />
            <p className="text-[11px] text-brand-text-dim mt-1.5">
              Injected into the live website <code>&lt;head&gt;</code> automatically as <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>.
            </p>
          </div>
        </div>

        {/* Module 2: Google Analytics 4 */}
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Analytics 4 (GA4)</h3>
                <p className="text-[11px] text-brand-text-dim">Audience demographics, luxury property pageviews, and inquiry goal tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                formData.googleAnalyticsId ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {formData.googleAnalyticsId ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                GA4 Measurement ID
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId}
                onChange={e => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                Tracking State
              </label>
              <select
                value={formData.enableGa4 ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, enableGa4: e.target.value === 'true' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none"
              >
                <option value="true">Enabled (Firing)</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module 3: Google Tag Manager */}
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Tag Manager (GTM)</h3>
                <p className="text-[11px] text-brand-text-dim">Deploy conversion tags, Meta Pixel, and marketing event trackers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                formData.googleTagManagerId ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {formData.googleTagManagerId ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                GTM Container ID
              </label>
              <input
                type="text"
                value={formData.googleTagManagerId}
                onChange={e => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                Tag Manager State
              </label>
              <select
                value={formData.enableGtm ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, enableGtm: e.target.value === 'true' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none"
              >
                <option value="true">Enabled (Inject Container)</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Fallback Defaults */}
        <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Global Title Template & Fallbacks
          </h3>

          <div>
            <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
              Browser Title Template
            </label>
            <input
              type="text"
              value={formData.siteTitleTemplate}
              onChange={e => setFormData({ ...formData, siteTitleTemplate: e.target.value })}
              placeholder="%s | Saudagar Properties"
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
              Default Fallback Meta Title
            </label>
            <input
              type="text"
              value={formData.defaultMetaTitle}
              onChange={e => setFormData({ ...formData, defaultMetaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
