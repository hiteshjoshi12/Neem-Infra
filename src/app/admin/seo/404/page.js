"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  Compass,
  Home,
  BookOpen,
  Building2,
  Phone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import api from '@/services/api';

export default function AdminCustom404Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    badgeText: 'Error 404 • Destination Not Found',
    title: 'Page Not Located',
    subtitle:
      'The property listing, editorial dispatch, or link you requested is unavailable or has been relocated to our updated platform.',
    showQuickLinks: true,
    ctaTitle: 'Looking to acquire or invest in DLF Gurugram?',
    ctaButtonText: 'Request Private Consultation',
    ctaButtonLink: '/contact',
    quickLinks: [
      {
        title: 'Return to Homepage',
        desc: 'Explore prime corridors & services',
        url: '/',
        iconName: 'Home',
      },
      {
        title: 'Real Estate Journal',
        desc: 'Read luxury builder floor analyses',
        url: '/blog',
        iconName: 'BookOpen',
      },
      {
        title: 'Ready-to-Move Residences',
        desc: 'Vetted DLF Phase 1–5 builder floors',
        url: '/properties',
        iconName: 'Building2',
      },
      {
        title: 'Private Consultation',
        desc: 'Speak directly with senior partners',
        url: '/contact',
        iconName: 'Phone',
      },
    ],
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoSettings();
      if (res?.success && res.data?.custom404) {
        setFormData({
          badgeText: res.data.custom404.badgeText || 'Error 404 • Destination Not Found',
          title: res.data.custom404.title || 'Page Not Located',
          subtitle: res.data.custom404.subtitle || '',
          showQuickLinks: res.data.custom404.showQuickLinks !== false,
          ctaTitle: res.data.custom404.ctaTitle || 'Looking to acquire or invest in DLF Gurugram?',
          ctaButtonText: res.data.custom404.ctaButtonText || 'Request Private Consultation',
          ctaButtonLink: res.data.custom404.ctaButtonLink || '/contact',
          quickLinks: Array.isArray(res.data.custom404.quickLinks) && res.data.custom404.quickLinks.length > 0
            ? res.data.custom404.quickLinks
            : formData.quickLinks,
        });
      }
    } catch (err) {
      console.warn('Failed to load 404 settings:', err);
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
        custom404: formData,
      });
      setToast('Custom 404 Experience updated successfully!');
      await loadSettings();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save 404 settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuickLink = () => {
    setFormData(prev => ({
      ...prev,
      quickLinks: [
        ...prev.quickLinks,
        { title: '', desc: '', url: '/', iconName: 'Compass' }
      ]
    }));
  };

  const handleUpdateQuickLink = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.quickLinks];
      copy[index][field] = value;
      return { ...prev, quickLinks: copy };
    });
  };

  const handleRemoveQuickLink = (index) => {
    setFormData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, idx) => idx !== index)
    }));
  };

  if (loading) {
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
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 text-sm font-medium shadow-2xl">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold tracking-widest text-brand-gold uppercase mb-2">
            <AlertCircle size={12} />
            <span>Error Page Experience</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Custom 404 Page Manager
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Customize the destination-not-found page messaging, navigation shortcuts, and advisory call-to-action.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/non-existent-page-test-404"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={14} className="text-brand-gold" />
            <span>Test Live 404</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save 404 Experience'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form Fields */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Compass className="text-brand-gold" size={16} />
              <span>Headline & Guidance Messaging</span>
            </h2>

            <div>
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                Top Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                Main H1 Heading
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                Explanatory Subtitle
              </label>
              <textarea
                rows={3}
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Links Manager */}
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recommended Quick Links
                </h3>
                <p className="text-[11px] text-brand-text-dim">Cards displayed to guide lost visitors back into primary corridors</p>
              </div>
              <button
                type="button"
                onClick={handleAddQuickLink}
                className="px-3 py-1.5 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-xs font-bold hover:bg-brand-gold/20"
              >
                + Add Card
              </button>
            </div>

            <div className="space-y-3">
              {formData.quickLinks.map((link, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-brand-navy-deep border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={link.title}
                      onChange={e => handleUpdateQuickLink(idx, 'title', e.target.value)}
                      placeholder="Title e.g. Return to Homepage"
                      className="w-1/2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white font-semibold text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={e => handleUpdateQuickLink(idx, 'url', e.target.value)}
                      placeholder="/properties"
                      className="w-1/2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuickLink(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={link.desc}
                    onChange={e => handleUpdateQuickLink(idx, 'desc', e.target.value)}
                    placeholder="Short subtitle description"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-brand-text-dim text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Consultation CTA Banner */}
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bottom Advisory Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  CTA Headline Text
                </label>
                <input
                  type="text"
                  value={formData.ctaTitle}
                  onChange={e => setFormData({ ...formData, ctaTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonText}
                  onChange={e => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right: Live Visual Preview */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
            <Eye size={14} />
            <span>Live 404 Preview</span>
          </span>

          <div className="p-8 rounded-3xl bg-brand-navy-deep border border-brand-gold/30 text-center text-brand-ivory relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-brand-gold/30 text-brand-gold text-[10px] font-bold uppercase tracking-wider mb-4">
              <Compass size={11} />
              <span>{formData.badgeText}</span>
            </div>

            <h2 className="text-3xl font-serif font-bold text-brand-ivory mb-2">
              {formData.title}
            </h2>

            <p className="text-xs text-brand-text-on-dark-muted max-w-sm mx-auto mb-6 leading-relaxed">
              {formData.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left mb-6">
              {formData.quickLinks.slice(0, 4).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-brand-navy border border-white/10">
                  <div className="text-xs font-bold text-white">{item.title || 'Untitled'}</div>
                  <div className="text-[10px] text-brand-text-dim truncate">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-brand-text-dim">
              <span>{formData.ctaTitle}</span>
              <span className="px-3 py-1.5 rounded-lg bg-brand-gold text-brand-navy-deep font-bold text-xs">
                {formData.ctaButtonText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
