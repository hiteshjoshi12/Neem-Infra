"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Eye,
  Globe,
  Share2,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Search,
  Compass,
  Code,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Heading,
  Bold,
  Italic,
  List,
  Quote,
  Table,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '@/services/api';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function SeoPageEditor({ pageId = null, isNew = false }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('general'); // general, meta, robots, social, schema, breadcrumbs, faq, preview
  const [serpView, setSerpView] = useState('desktop'); // desktop, mobile
  const [socialView, setSocialView] = useState('facebook'); // facebook, twitter

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    pageType: 'custom',
    status: 'published',
    h1: '',
    h2: '',
    content: '',
    sections: [],
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    focusKeywords: [],
    robots: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
    },
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogImageAlt: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    breadcrumbs: [
      { name: 'Home', url: '/' },
    ],
    schemaType: 'WebPage',
    customSchemaJson: '',
    faq: [],
    internalLinks: [],
    featuredImage: '',
    featuredImageAlt: '',
    createRedirectOnSlugChange: true,
  });

  const [initialSlug, setInitialSlug] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  // Load existing page data if editing
  useEffect(() => {
    if (!isNew && pageId) {
      async function loadPage() {
        try {
          setLoading(true);
          const res = await api.getSeoPage(pageId);
          if (res?.success && res.data) {
            const d = res.data;
            setFormData({
              title: d.title || '',
              slug: d.slug || '',
              pageType: d.pageType || 'custom',
              status: d.status || 'published',
              h1: d.h1 || '',
              h2: d.h2 || '',
              content: d.content || '',
              sections: Array.isArray(d.sections) ? d.sections : [],
              metaTitle: d.metaTitle || '',
              metaDescription: d.metaDescription || '',
              canonicalUrl: d.canonicalUrl || '',
              focusKeywords: Array.isArray(d.focusKeywords) ? d.focusKeywords : [],
              robots: {
                index: d.robots?.index !== false,
                follow: d.robots?.follow !== false,
                noarchive: Boolean(d.robots?.noarchive),
                nosnippet: Boolean(d.robots?.nosnippet),
              },
              ogTitle: d.ogTitle || '',
              ogDescription: d.ogDescription || '',
              ogImage: d.ogImage || '',
              ogImageAlt: d.ogImageAlt || '',
              ogType: d.ogType || 'website',
              twitterCard: d.twitterCard || 'summary_large_image',
              breadcrumbs: Array.isArray(d.breadcrumbs) && d.breadcrumbs.length > 0 ? d.breadcrumbs : [{ name: 'Home', url: '/' }],
              schemaType: d.schemaType || 'WebPage',
              customSchemaJson: d.customSchemaJson || '',
              faq: Array.isArray(d.faq) ? d.faq : [],
              internalLinks: Array.isArray(d.internalLinks) ? d.internalLinks : [],
              featuredImage: d.featuredImage || '',
              featuredImageAlt: d.featuredImageAlt || '',
              createRedirectOnSlugChange: true,
            });
            setInitialSlug(d.slug || '');
          }
        } catch (err) {
          showToast('error', err.message || 'Failed to load page');
        } finally {
          setLoading(false);
        }
      }
      loadPage();
    }
  }, [pageId, isNew]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  const handleSlugify = () => {
    if (!formData.title) return;
    const auto = '/' + formData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-/]+/g, '')
      .replace(/-+/g, '-');
    setFormData(prev => ({ ...prev, slug: auto }));
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const clean = newKeyword.trim();
    if (!formData.focusKeywords.includes(clean)) {
      setFormData(prev => ({ ...prev, focusKeywords: [...prev.focusKeywords, clean] }));
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      focusKeywords: prev.focusKeywords.filter((_, idx) => idx !== index)
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.faq];
      copy[index][field] = value;
      return { ...prev, faq: copy };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, idx) => idx !== index)
    }));
  };

  // Breadcrumbs Handlers
  const handleAddBreadcrumb = () => {
    setFormData(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, { name: '', url: '' }]
    }));
  };

  const handleUpdateBreadcrumb = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.breadcrumbs];
      copy[index][field] = value;
      return { ...prev, breadcrumbs: copy };
    });
  };

  const handleRemoveBreadcrumb = (index) => {
    setFormData(prev => ({
      ...prev,
      breadcrumbs: prev.breadcrumbs.filter((_, idx) => idx !== index)
    }));
  };

  // Structured Sections Handlers
  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: '', subtitle: '', content: '', image: '', imageAlt: '', buttonText: '', buttonLink: '' }
      ]
    }));
  };

  const handleUpdateSection = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.sections];
      copy[index][field] = value;
      return { ...prev, sections: copy };
    });
  };

  const handleRemoveSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== index)
    }));
  };

  // Form Submit
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast('error', 'Page Title and Slug are required');
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        const res = await api.createSeoPage(formData);
        if (res.success) {
          showToast('success', 'Page created successfully!');
          setTimeout(() => {
            router.push('/admin/seo/pages');
          }, 1000);
        }
      } else {
        const res = await api.updateSeoPage(pageId, formData);
        if (res.success) {
          showToast('success', 'Page & SEO settings updated successfully!');
          setInitialSlug(formData.slug);
        }
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  // Character counters & SERP analysis
  const titleLength = formData.metaTitle.length;
  const descLength = formData.metaDescription.length;

  const titleStatus = useMemo(() => {
    if (titleLength === 0) return { label: 'Empty', color: 'text-gray-400' };
    if (titleLength < 40) return { label: 'Too short (min 40)', color: 'text-amber-400' };
    if (titleLength <= 60) return { label: 'Optimal (50–60)', color: 'text-emerald-400' };
    return { label: 'Too long (may truncate)', color: 'text-rose-400' };
  }, [titleLength]);

  const descStatus = useMemo(() => {
    if (descLength === 0) return { label: 'Empty', color: 'text-gray-400' };
    if (descLength < 120) return { label: 'Short (aim 140–160)', color: 'text-amber-400' };
    if (descLength <= 165) return { label: 'Optimal (140–160)', color: 'text-emerald-400' };
    return { label: 'Too long (will truncate)', color: 'text-rose-400' };
  }, [descLength]);

  const displayTitle = formData.metaTitle || (formData.title ? `${formData.title} | Saudagar Properties` : 'Saudagar Properties — Luxury Real Estate');
  const displayDesc = formData.metaDescription || 'Explore premier luxury builder floors, kothis, and commercial office spaces across DLF Phase 1–5, Sushant Lok, and Golf Course Road Gurugram.';
  const displayUrl = `https://www.saudagarproperties.com${formData.slug === '/' ? '' : formData.slug}`;
  const displayOgImage = formData.ogImage || formData.featuredImage || 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/og-default.jpg';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <RefreshCw className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Toast Alert */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/30'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/seo/pages"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-brand-text-dim hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                {isNew ? 'Create New Page' : `Editing Page • ${formData.pageType}`}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                formData.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {formData.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">
              {formData.title || 'Untitled Page'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && formData.slug && (
            <a
              href={formData.slug}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={14} />
              <span>View Live Page</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-navy/60 border border-white/10 overflow-x-auto text-xs font-medium">
        {[
          { id: 'general', label: '1. General & Content', icon: Layers },
          { id: 'meta', label: '2. Meta Tags & SERP', icon: Search },
          { id: 'robots', label: '3. Meta Robots', icon: Globe },
          { id: 'social', label: '4. Social & Open Graph', icon: Share2 },
          { id: 'schema', label: '5. Schema (JSON-LD)', icon: Code },
          { id: 'breadcrumbs', label: '6. Breadcrumbs', icon: Compass },
          { id: 'faq', label: '7. FAQ & Accordion', icon: HelpCircle },
          { id: 'sections', label: '8. Structured Sections', icon: FileCode },
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-gold text-brand-navy-deep font-bold shadow-md'
                  : 'text-brand-text-dim hover:text-white hover:bg-white/5'
              }`}
            >
              <IconComponent size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GENERAL & CONTENT                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Layers className="text-brand-gold" size={18} />
                <span>Primary Page Identifiers</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Page Internal Name / Label *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Golf Course Road Luxury Penthouses"
                  className="w-full px-4 py-3 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider">
                    URL Slug Path *
                  </label>
                  {isNew && (
                    <button
                      type="button"
                      onClick={handleSlugify}
                      className="text-[11px] text-brand-gold hover:underline font-semibold"
                    >
                      Auto-generate from Title
                    </button>
                  )}
                </div>
                <div className="flex items-center rounded-xl bg-brand-navy-deep border border-white/15 overflow-hidden">
                  <span className="px-3 text-xs text-brand-text-dim border-r border-white/10 select-none">
                    saudagarproperties.com
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="/luxury-penthouses-gurgaon"
                    className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-mono"
                  />
                </div>
                {!isNew && initialSlug && formData.slug !== initialSlug && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    <Info size={14} className="shrink-0" />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.createRedirectOnSlugChange}
                        onChange={e => setFormData({ ...formData, createRedirectOnSlugChange: e.target.checked })}
                        className="accent-brand-gold"
                      />
                      <span>Create automatic 301 Permanent Redirect from <code>{initialSlug}</code> to <code>{formData.slug}</code></span>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                    Primary H1 Page Heading
                  </label>
                  <input
                    type="text"
                    value={formData.h1}
                    onChange={e => setFormData({ ...formData, h1: e.target.value })}
                    placeholder="Main headline displayed at the top"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                    Secondary H2 Sub-Heading
                  </label>
                  <input
                    type="text"
                    value={formData.h2}
                    onChange={e => setFormData({ ...formData, h2: e.target.value })}
                    placeholder="Subtitle supporting the H1"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Heading className="text-brand-gold" size={18} />
                  <span>Main Body Content (Markdown Supported)</span>
                </h2>
                <span className="text-xs text-brand-text-dim">Supports standard Markdown & HTML</span>
              </div>

              <textarea
                rows={12}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your editorial page copy, paragraphs, bullet points, and asset overviews here..."
                className="w-full px-4 py-3 rounded-2xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold font-mono text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Status & Images */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Publication Settings
              </h3>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold text-sm"
                >
                  <option value="published">Published (Live & Indexable)</option>
                  <option value="draft">Draft (Hidden from Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Page Type
                </label>
                <select
                  value={formData.pageType}
                  onChange={e => setFormData({ ...formData, pageType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold text-sm"
                >
                  <option value="custom">Custom Landing Page</option>
                  <option value="system">Core System Page</option>
                  <option value="service">Service Line Page</option>
                  <option value="corridor">Corridor Landing Page</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="text-brand-gold" size={16} />
                <span>Featured Hero Image</span>
              </h3>

              <ImageUploadInput
                label="Hero Image URL"
                value={formData.featuredImage}
                onChange={url => setFormData({ ...formData, featuredImage: url })}
                folder="pages"
              />

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.featuredImageAlt}
                  onChange={e => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                  placeholder="e.g. Panoramic aerial view of luxury builder floors in DLF Phase 1"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: META TAGS & LIVE SERP PREVIEW                                       */}
      {/* ========================================================================= */}
      {activeTab === 'meta' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Meta Fields */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Search className="text-brand-gold" size={18} />
                <span>Search Engine Meta Tags</span>
              </h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-brand-text-dim uppercase tracking-wider">
                    Meta Title (Browser Tab & Google Snippet)
                  </label>
                  <span className={`text-xs font-bold ${titleStatus.color}`}>
                    {titleLength}/60 chars • {titleStatus.label}
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Saudagar Properties — Premier Real Estate Consultant DLF Gurugram"
                  className="w-full px-4 py-3 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-brand-text-dim uppercase tracking-wider">
                    Meta Description (SERP Summary Snippet)
                  </label>
                  <span className={`text-xs font-bold ${descStatus.color}`}>
                    {descLength}/160 chars • {descStatus.label}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.metaDescription}
                  onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Find luxury builder floors, independent villas, penthouses, and commercial offices in DLF Phase 1–5, Sushant Lok & Golf Course Road. 25+ years of trusted advisory in Gurugram."
                  className="w-full px-4 py-3 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Canonical URL (Preferred Master URL)
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://www.saudagarproperties.com/your-slug"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm font-mono"
                />
                <span className="text-[11px] text-brand-text-dim mt-1.5 block">
                  Leave empty to default to the canonical production URL for this slug.
                </span>
              </div>

              {/* Focus Keywords */}
              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Focus Target Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="e.g. DLF Phase 1 Builder Floor"
                    className="w-full px-4 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep text-xs font-bold hover:brightness-110"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.focusKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white text-xs"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real-time Live Google Search SERP Simulator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} />
                <span>Google SERP Live Simulator</span>
              </span>
              <div className="flex items-center gap-1 bg-brand-navy/60 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSerpView('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    serpView === 'desktop' ? 'bg-white/15 text-white' : 'text-brand-text-dim'
                  }`}
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpView('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                    serpView === 'mobile' ? 'bg-white/15 text-white' : 'text-brand-text-dim'
                  }`}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-3xl bg-[#202124] border border-[#3c4043] shadow-2xl transition-all ${
              serpView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center text-xs font-bold text-brand-gold">
                  SP
                </div>
                <div>
                  <div className="text-[13px] text-[#dadce0] font-sans">Saudagar Properties</div>
                  <div className="text-[11px] text-[#9aa0a6] font-mono truncate max-w-[280px]">
                    {displayUrl}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-sans text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-2">
                {displayTitle}
              </h3>

              <p className="text-[13px] text-[#bdc1c6] font-sans mt-1.5 leading-relaxed line-clamp-2">
                {displayDesc}
              </p>

              {formData.faq && formData.faq.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#3c4043] space-y-2">
                  <div className="text-[11px] text-[#9aa0a6] uppercase tracking-wider font-semibold">
                    People Also Ask Snippet:
                  </div>
                  {formData.faq.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="text-xs text-[#8ab4f8] flex items-center gap-2">
                      <span>•</span>
                      <span className="truncate">{item.question || 'FAQ Question'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-brand-text-dim space-y-1">
              <div className="font-semibold text-white">Google Snippet Best Practices:</div>
              <div>• Ideal title: 50–60 characters. Always includes primary keyword and brand suffix.</div>
              <div>• Ideal description: 140–160 characters. Clearly states value proposition & CTA.</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: META ROBOTS DIRECTIVES                                              */}
      {/* ========================================================================= */}
      {activeTab === 'robots' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-6">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Globe className="text-brand-gold" size={18} />
              <span>Crawl & Indexing Directives (robots meta)</span>
            </h2>

            <div className="divide-y divide-white/10">
              {/* Index vs Noindex */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white text-sm">Search Engine Indexing</div>
                  <div className="text-xs text-brand-text-dim">
                    {formData.robots.index ? 'Allow search engines to index this page (index)' : 'Block search engines from indexing this page (noindex)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    robots: { ...formData.robots, index: !formData.robots.index }
                  })}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                    formData.robots.index ? 'bg-emerald-500 justify-end' : 'bg-rose-500/80 justify-start'
                  }`}
                >
                  <div className="bg-white w-6 h-6 rounded-full shadow-md" />
                </button>
              </div>

              {/* Follow vs Nofollow */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white text-sm">Link Following (Page Authority Flow)</div>
                  <div className="text-xs text-brand-text-dim">
                    {formData.robots.follow ? 'Follow outbound and internal links on this page (follow)' : 'Instruct crawlers not to follow links on this page (nofollow)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    robots: { ...formData.robots, follow: !formData.robots.follow }
                  })}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                    formData.robots.follow ? 'bg-emerald-500 justify-end' : 'bg-gray-600 justify-start'
                  }`}
                >
                  <div className="bg-white w-6 h-6 rounded-full shadow-md" />
                </button>
              </div>

              {/* Noarchive */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white text-sm">Prevent Cached Copies (noarchive)</div>
                  <div className="text-xs text-brand-text-dim">
                    Prevents search engines from showing a cached copy in search results.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    robots: { ...formData.robots, noarchive: !formData.robots.noarchive }
                  })}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                    formData.robots.noarchive ? 'bg-brand-gold justify-end' : 'bg-gray-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-6 h-6 rounded-full shadow-md" />
                </button>
              </div>

              {/* Nosnippet */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white text-sm">Prevent Search Snippets (nosnippet)</div>
                  <div className="text-xs text-brand-text-dim">
                    Do not show a text snippet or video preview in search engine results.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    robots: { ...formData.robots, nosnippet: !formData.robots.nosnippet }
                  })}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                    formData.robots.nosnippet ? 'bg-brand-gold justify-end' : 'bg-gray-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-6 h-6 rounded-full shadow-md" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-brand-gold">
                Live output: &lt;meta name=&quot;robots&quot; content=&quot;
                {[
                  formData.robots.index ? 'index' : 'noindex',
                  formData.robots.follow ? 'follow' : 'nofollow',
                  formData.robots.noarchive ? 'noarchive' : null,
                  formData.robots.nosnippet ? 'nosnippet' : null,
                ].filter(Boolean).join(', ')}
                &quot; /&gt;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOCIAL SHARING & OPEN GRAPH                                         */}
      {/* ========================================================================= */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-4">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Share2 className="text-brand-gold" size={18} />
                <span>Open Graph & Social Cards</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Social Title (og:title)
                </label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={e => setFormData({ ...formData, ogTitle: e.target.value })}
                  placeholder={displayTitle}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                  Social Description (og:description)
                </label>
                <textarea
                  rows={3}
                  value={formData.ogDescription}
                  onChange={e => setFormData({ ...formData, ogDescription: e.target.value })}
                  placeholder={displayDesc}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm leading-relaxed"
                />
              </div>

              <ImageUploadInput
                label="Social Share Image (og:image • 1200×630px recommended)"
                value={formData.ogImage}
                onChange={url => setFormData({ ...formData, ogImage: url })}
                folder="social"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                    Open Graph Type
                  </label>
                  <select
                    value={formData.ogType}
                    onChange={e => setFormData({ ...formData, ogType: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                    Twitter Card Type
                  </label>
                  <select
                    value={formData.twitterCard}
                    onChange={e => setFormData({ ...formData, twitterCard: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs"
                  >
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Social Preview Card */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} />
              <span>Facebook & LinkedIn Social Share Card Preview</span>
            </span>

            <div className="rounded-2xl overflow-hidden bg-[#242526] border border-[#3e4042] shadow-2xl">
              <div className="relative aspect-[1.91/1] w-full bg-[#18191a] overflow-hidden">
                {displayOgImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayOgImage}
                    alt="Social Card Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No image uploaded
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#b0b3b8] font-mono">
                  saudagarproperties.com
                </span>
                <h4 className="text-sm font-bold text-[#e4e6eb] line-clamp-2">
                  {formData.ogTitle || displayTitle}
                </h4>
                <p className="text-xs text-[#b0b3b8] line-clamp-2">
                  {formData.ogDescription || displayDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SCHEMA MARKUP (JSON-LD)                                             */}
      {/* ========================================================================= */}
      {activeTab === 'schema' && (
        <div className="max-w-4xl space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Code className="text-brand-gold" size={18} />
                <span>Structured Data Schema (JSON-LD)</span>
              </h2>
              <span className="text-xs text-brand-text-dim">Google Rich Results & Answer Ready</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                Primary Schema Entity Type
              </label>
              <select
                value={formData.schemaType}
                onChange={e => setFormData({ ...formData, schemaType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold text-sm"
              >
                <option value="WebPage">WebPage (General Page Schema)</option>
                <option value="RealEstateAgent">RealEstateAgent / LocalBusiness Schema</option>
                <option value="AboutPage">AboutPage (Company Narrative & Leadership)</option>
                <option value="ContactPage">ContactPage (Channels, Location & Desks)</option>
                <option value="Article">Article (Editorial Journal)</option>
                <option value="FAQPage">FAQPage (Generates from FAQ Tab)</option>
                <option value="Custom">Custom Raw JSON-LD Schema</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text-dim uppercase tracking-wider mb-2">
                Custom JSON-LD Injection (Optional Raw Schema)
              </label>
              <textarea
                rows={8}
                value={formData.customSchemaJson}
                onChange={e => setFormData({ ...formData, customSchemaJson: e.target.value })}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "RealEstateListing",\n  "name": "Luxury DLF Villa"\n}`}
                className="w-full px-4 py-3 rounded-2xl bg-brand-navy-deep border border-white/15 text-emerald-400 font-mono text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
              />
              <span className="text-[11px] text-brand-text-dim mt-1.5 block">
                Any valid JSON-LD provided here will be validated and automatically injected into the live page &lt;head&gt;.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: BREADCRUMBS MANAGEMENT                                              */}
      {/* ========================================================================= */}
      {activeTab === 'breadcrumbs' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Compass className="text-brand-gold" size={18} />
                <span>Breadcrumbs Trail & Schema Generator</span>
              </h2>
              <button
                type="button"
                onClick={handleAddBreadcrumb}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold hover:bg-brand-gold/20"
              >
                <Plus size={14} />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.breadcrumbs.map((b, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-brand-navy-deep border border-white/10">
                  <span className="text-xs font-bold text-brand-gold w-6 text-center select-none">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={b.name}
                    onChange={e => handleUpdateBreadcrumb(idx, 'name', e.target.value)}
                    placeholder="Step Label (e.g. Services)"
                    className="w-1/2 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                  <input
                    type="text"
                    value={b.url}
                    onChange={e => handleUpdateBreadcrumb(idx, 'url', e.target.value)}
                    placeholder="/services"
                    className="w-1/2 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                  />
                  {formData.breadcrumbs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBreadcrumb(idx)}
                      className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Live Breadcrumb Preview */}
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-brand-text-dim block mb-2 font-semibold">Visual Preview:</span>
              <div className="flex items-center gap-2 text-xs text-brand-text-on-dark-muted flex-wrap">
                {formData.breadcrumbs.map((b, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="opacity-40">/</span>}
                    <span className={idx === formData.breadcrumbs.length - 1 ? 'text-brand-gold font-bold' : ''}>
                      {b.name || 'Untitled'}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: FAQ & ACCORDION                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'faq' && (
        <div className="max-w-4xl space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <HelpCircle className="text-brand-gold" size={18} />
                  <span>Frequently Asked Questions & Schema Generator</span>
                </h2>
                <p className="text-xs text-brand-text-dim mt-1">
                  Adds interactive Q&A accordion to the page and automatically generates Google FAQPage JSON-LD schema!
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep text-xs font-bold hover:brightness-110"
              >
                <Plus size={14} />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.faq.length === 0 && (
                <div className="text-center py-8 text-xs text-brand-text-dim bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No FAQs added yet. Click &quot;Add Question&quot; above to add your first question and answer pair.
                </div>
              )}

              {formData.faq.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-brand-navy-deep border border-white/10 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-brand-gold">Q{idx + 1}.</span>
                    <input
                      type="text"
                      value={item.question}
                      onChange={e => handleUpdateFaq(idx, 'question', e.target.value)}
                      placeholder="e.g. What is the average price per sq. yd in DLF Phase 1?"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={e => handleUpdateFaq(idx, 'answer', e.target.value)}
                    placeholder="Provide a comprehensive, authoritative answer for buyers and search engines..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: STRUCTURED SECTIONS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="max-w-4xl space-y-6">
          <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <FileCode className="text-brand-gold" size={18} />
                  <span>Structured Page Sections / Modules</span>
                </h2>
                <p className="text-xs text-brand-text-dim mt-1">
                  Add rich callout cards, feature blocks, and multi-column modules to this landing page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep text-xs font-bold hover:brightness-110"
              >
                <Plus size={14} />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.sections.length === 0 && (
                <div className="text-center py-8 text-xs text-brand-text-dim bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No custom structured sections added yet.
                </div>
              )}

              {formData.sections.map((sec, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-brand-navy-deep border border-white/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                      Section #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                        Section Subtitle / Eyebrow
                      </label>
                      <input
                        type="text"
                        value={sec.subtitle}
                        onChange={e => handleUpdateSection(idx, 'subtitle', e.target.value)}
                        placeholder="e.g. Asset Typology"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={e => handleUpdateSection(idx, 'title', e.target.value)}
                        placeholder="e.g. Luxury Builder Floors (400–1000 Sq. Yds)"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                      Section Content
                    </label>
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={e => handleUpdateSection(idx, 'content', e.target.value)}
                      placeholder="Section descriptive copy..."
                      className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploadInput
                      label="Section Image URL"
                      value={sec.image}
                      onChange={url => handleUpdateSection(idx, 'image', url)}
                      folder="pages"
                    />
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={sec.imageAlt}
                        onChange={e => handleUpdateSection(idx, 'imageAlt', e.target.value)}
                        placeholder="Descriptive image alt text"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                        Action Button Label
                      </label>
                      <input
                        type="text"
                        value={sec.buttonText}
                        onChange={e => handleUpdateSection(idx, 'buttonText', e.target.value)}
                        placeholder="e.g. Inquire on Private Portfolio"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-text-dim uppercase mb-1">
                        Action Button Link
                      </label>
                      <input
                        type="text"
                        value={sec.buttonLink}
                        onChange={e => handleUpdateSection(idx, 'buttonLink', e.target.value)}
                        placeholder="/contact"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
