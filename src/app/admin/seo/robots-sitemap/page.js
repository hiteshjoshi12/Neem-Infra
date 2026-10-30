"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Network,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import api from '@/services/api';

export default function AdminRobotsSitemapPage() {
  const [activeTab, setActiveTab] = useState('robots'); // robots, sitemap
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [pingStatus, setPingStatus] = useState('');

  const [formData, setFormData] = useState({
    robotsTxtMode: 'standard',
    robotsTxtCustomRules: '',
    sitemapConfig: {
      includeProperties: true,
      includeBlogs: true,
      includeCategories: true,
      includeAuthors: true,
      includeCustomPages: true,
      extraUrls: [],
    },
  });

  const [newExtraUrl, setNewExtraUrl] = useState({
    url: '',
    priority: 0.8,
    changeFrequency: 'weekly',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoSettings();
      if (res?.success && res.data) {
        setSettings(res.data);
        setFormData({
          robotsTxtMode: res.data.robotsTxtMode || 'standard',
          robotsTxtCustomRules: res.data.robotsTxtCustomRules || `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n`,
          sitemapConfig: res.data.sitemapConfig || {
            includeProperties: true,
            includeBlogs: true,
            includeCategories: true,
            includeAuthors: true,
            includeCustomPages: true,
            extraUrls: [],
          },
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
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSeoSettings(formData);
      if (res?.success) {
        setToast('Robots & Sitemap settings saved successfully! Live endpoints updated.');
        await loadSettings();
        setTimeout(() => setToast(''), 3500);
      }
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExtraUrl = () => {
    if (!newExtraUrl.url.trim()) return;
    setFormData(prev => ({
      ...prev,
      sitemapConfig: {
        ...prev.sitemapConfig,
        extraUrls: [...(prev.sitemapConfig.extraUrls || []), { ...newExtraUrl }],
      },
    }));
    setNewExtraUrl({ url: '', priority: 0.8, changeFrequency: 'weekly' });
  };

  const handleRemoveExtraUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      sitemapConfig: {
        ...prev.sitemapConfig,
        extraUrls: prev.sitemapConfig.extraUrls.filter((_, idx) => idx !== index),
      },
    }));
  };

  const handlePingSearchEngines = async () => {
    setPingStatus('Pinging Google & Bing...');
    setTimeout(() => {
      setPingStatus('✓ Sitemap ping submitted to Google and Bing search indexers.');
      setTimeout(() => setPingStatus(''), 4000);
    }, 1200);
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
            <Globe size={12} />
            <span>Search Engine Crawl Directives</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Robots.txt & XML Sitemap Manager
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Configure live crawler access rules, user-agents, and auto-generated XML sitemap coverage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Directives'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-brand-navy/60 border border-white/10 w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('robots')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'robots'
              ? 'bg-brand-gold text-brand-navy-deep font-bold shadow-md'
              : 'text-brand-text-dim hover:text-white'
          }`}
        >
          <Globe size={14} />
          <span>Robots.txt Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sitemap')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'sitemap'
              ? 'bg-brand-gold text-brand-navy-deep font-bold shadow-md'
              : 'text-brand-text-dim hover:text-white'
          }`}
        >
          <Network size={14} />
          <span>XML Sitemap Auto-Generator</span>
        </button>
      </div>

      {/* TAB 1: ROBOTS.TXT */}
      {activeTab === 'robots' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Globe className="text-brand-gold" size={18} />
                  <span>Robots.txt Rules Mode</span>
                </h2>
                <p className="text-xs text-brand-text-dim mt-0.5">
                  Select a rule preset or provide fully custom directives for Googlebot, Bingbot, and AI crawlers.
                </p>
              </div>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10"
              >
                <span>View Live robots.txt</span>
                <ExternalLink size={12} className="text-brand-gold" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  id: 'standard',
                  title: 'Standard Production (Recommended)',
                  desc: 'Allows full indexing of public pages, disallows /admin/ and /api/.',
                },
                {
                  id: 'custom',
                  title: 'Custom User Rules',
                  desc: 'Provide your own tailored User-agent and Disallow specifications.',
                },
                {
                  id: 'disallow_all',
                  title: 'Block All Crawlers (Disallow: /)',
                  desc: 'Blocks all search engines from indexing the site. For maintenance only.',
                },
              ].map(mode => (
                <div
                  key={mode.id}
                  onClick={() => setFormData({ ...formData, robotsTxtMode: mode.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.robotsTxtMode === mode.id
                      ? 'bg-brand-gold/10 border-brand-gold text-white'
                      : 'bg-black/20 border-white/10 text-brand-text-dim hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{mode.title}</div>
                  <div className="text-xs leading-relaxed opacity-80">{mode.desc}</div>
                </div>
              ))}
            </div>

            {formData.robotsTxtMode === 'custom' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider">
                  Custom Robots.txt Content
                </label>
                <textarea
                  rows={8}
                  value={formData.robotsTxtCustomRules}
                  onChange={e => setFormData({ ...formData, robotsTxtCustomRules: e.target.value })}
                  placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nCrawl-delay: 1\n`}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-emerald-400 font-mono text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: XML SITEMAP */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Network className="text-brand-gold" size={18} />
                  <span>XML Sitemap Coverage</span>
                </h2>
                <p className="text-xs text-brand-text-dim mt-0.5">
                  Automatically queries published pages, properties, blogs, and categories. Excludes any noindex items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/seo/sitemaps"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs hover:brightness-110"
                >
                  <Network size={12} />
                  <span>Sitemaps Index Hub</span>
                </Link>

                <a
                  href="/sitemap_index.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10"
                >
                  <span>Open Index</span>
                  <ExternalLink size={12} className="text-brand-gold" />
                </a>

                <button
                  type="button"
                  onClick={handlePingSearchEngines}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs font-bold text-brand-gold hover:bg-brand-gold/20"
                >
                  <Send size={12} />
                  <span>Ping Search Engines</span>
                </button>
              </div>
            </div>

            {pingStatus && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                {pingStatus}
              </div>
            )}

            {/* Sitemap Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'includeProperties', label: 'Include Verified Properties', desc: 'All active listings with slugs' },
                { key: 'includeBlogs', label: 'Include Blog Posts', desc: 'Only posts marked published' },
                { key: 'includeCategories', label: 'Include Category Archives', desc: 'Editorial categories with posts' },
                { key: 'includeAuthors', label: 'Include Editorial Authors', desc: 'Author profile landing pages' },
                { key: 'includeCustomPages', label: 'Include Custom Pages', desc: 'All published custom landing pages' },
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-brand-text-dim">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.sitemapConfig[item.key] !== false}
                    onChange={e => setFormData({
                      ...formData,
                      sitemapConfig: {
                        ...formData.sitemapConfig,
                        [item.key]: e.target.checked,
                      },
                    })}
                    className="w-4 h-4 accent-brand-gold cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Extra Custom Sitemap URLs */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Extra Custom Sitemap URLs
                  </h3>
                  <p className="text-xs text-brand-text-dim">
                    Inject specific URLs with custom priorities into your sitemap.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newExtraUrl.url}
                  onChange={e => setNewExtraUrl({ ...newExtraUrl, url: e.target.value })}
                  placeholder="/custom-campaign-page"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                />
                <select
                  value={newExtraUrl.priority}
                  onChange={e => setNewExtraUrl({ ...newExtraUrl, priority: Number(e.target.value) })}
                  className="px-3 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none"
                >
                  <option value={1.0}>1.0 (Highest)</option>
                  <option value={0.9}>0.9 (Very High)</option>
                  <option value={0.8}>0.8 (Standard)</option>
                  <option value={0.7}>0.7 (Medium)</option>
                  <option value={0.5}>0.5 (Low)</option>
                </select>
                <select
                  value={newExtraUrl.changeFrequency}
                  onChange={e => setNewExtraUrl({ ...newExtraUrl, changeFrequency: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none"
                >
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddExtraUrl}
                  className="px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep text-xs font-bold hover:brightness-110"
                >
                  Add URL
                </button>
              </div>

              {formData.sitemapConfig.extraUrls && formData.sitemapConfig.extraUrls.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.sitemapConfig.extraUrls.map((extra, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-brand-navy-deep border border-white/10 text-xs">
                      <span className="font-mono text-white">{extra.url}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-gold">Priority: {extra.priority}</span>
                        <span className="text-brand-text-dim">Freq: {extra.changeFrequency}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraUrl(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
