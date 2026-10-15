"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Heading,
  Bold,
  Italic,
  List,
  Quote,
  Upload,
  Clock,
  HelpCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import api from '@/services/api';
import { MarkdownRenderer } from '@/lib/blog/markdownRenderer';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function BlogEditor({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    featuredImageAlt: initialData?.featuredImageAlt || '',
    featuredImageCaption: initialData?.featuredImageCaption || '',
    featuredImageCredit: initialData?.featuredImageCredit || '',
    status: initialData?.status || 'draft',
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
    author: initialData?.author?._id || initialData?.author || '',
    category: initialData?.category?._id || initialData?.category || '',
    directAnswer: initialData?.directAnswer || '',
    keyTakeaways: Array.isArray(initialData?.keyTakeaways) ? initialData.keyTakeaways : [],
    faq: Array.isArray(initialData?.faq) ? initialData.faq : [],
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    focusKeyword: initialData?.focusKeyword || '',
    readingTime: initialData?.readingTime || 5
  });

  const [taxonomies, setTaxonomies] = useState({
    authors: [],
    categories: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [newTakeaway, setNewTakeaway] = useState('');
  const textareaRef = useRef(null);
  const inlineImageInputRef = useRef(null);

  // Load Authors and Categories
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const res = await api.getTaxonomies();
        if (res.success && res.data) {
          setTaxonomies({
            authors: res.data.authors || [],
            categories: res.data.categories || []
          });

          // Set defaults if creating new article
          if (!isEdit && res.data.authors?.length > 0) {
            setFormData(prev => ({
              ...prev,
              author: prev.author || res.data.authors[0]._id,
              category: prev.category || res.data.categories?.[0]?._id || ''
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to load taxonomies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTaxonomies();
  }, [isEdit]);

  // Auto-generate slug from title if new or slug is empty
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const updates = { title: val };
    if (!isEdit || !formData.slug) {
      updates.slug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (!formData.seoTitle) {
      updates.seoTitle = `${val} | Saudagar Properties`;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Markdown formatting helpers
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 50);
  };

  // Upload inline image and insert into markdown
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setToast('Uploading article image to ImageKit...');
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', '/saudagar-properties/blogs');

      const token = typeof window !== 'undefined' ? localStorage.getItem('saudagar_admin_token') : null;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: uploadData
      });
      const data = await res.json();

      if (data.success && data.url) {
        const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const imageMarkdown = `\n\n![${altText}](${data.url})\n*Photo: ${altText}*\n\n`;
        
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const text = formData.content;
          const newContent = text.substring(0, start) + imageMarkdown + text.substring(start);
          setFormData(prev => ({ ...prev, content: newContent }));
        } else {
          setFormData(prev => ({ ...prev, content: `${prev.content}${imageMarkdown}` }));
        }
        setToast('Image uploaded and inserted into article!');
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setTimeout(() => setToast(''), 3000);
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
    }
  };

  // Key Takeaways handler
  const addTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setFormData(prev => ({
      ...prev,
      keyTakeaways: [...prev.keyTakeaways, newTakeaway.trim()]
    }));
    setNewTakeaway('');
  };

  const removeTakeaway = (index) => {
    setFormData(prev => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== index)
    }));
  };

  // FAQ handler
  const addFaqItem = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const updateFaqItem = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.faq];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faq: updated };
    });
  };

  const removeFaqItem = (index) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  // Save / Publish
  const handleSave = async (statusOverride = null) => {
    setErrorMsg('');
    if (!formData.title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg('Article content cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      const wordCount = (formData.content || '').trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      const payload = {
        ...formData,
        readingTime,
        status: statusOverride || formData.status,
        publishedAt: statusOverride === 'published' ? (formData.publishedAt || new Date().toISOString()) : formData.publishedAt
      };

      let res;
      if (isEdit && initialData?._id) {
        res = await api.updateBlog(initialData._id, payload);
      } else {
        res = await api.createBlog(payload);
      }

      if (res.success) {
        setToast(`Article successfully ${payload.status === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => {
          router.push('/admin/blog');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to save article.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D09A16] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs tracking-wider uppercase">Loading Luxury Article Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* ================= TOP ACTION BAR ================= */}
      <div className="sticky top-0 z-30 bg-[#0E162B]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {formData.status === 'published' ? 'Published Article' : 'Draft Mode'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-[#D09A16] flex items-center gap-1">
                <Clock size={11} /> {formData.readingTime} min read
              </span>
            </div>
            <h1 className="text-lg font-serif font-bold text-white truncate max-w-md">
              {formData.title || (isEdit ? 'Edit Article' : 'Compose New Article')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {formData.slug && (
            <a
              href={`/blog/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Preview Live</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#D09A16] hover:bg-[#b8850f] text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ================= 2-COLUMN LUXURY WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: EDITORIAL CANVAS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Article Title & Slug */}
          <div className="p-6 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D09A16] mb-2">
                Article Headline (H1) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. DLF Phase 1 Luxury Builder Floors: 2026 Price Index & Freehold Registry Guide"
                className="w-full text-xl sm:text-2xl font-serif font-bold bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                URL Permalink (Slug)
              </label>
              <div className="flex items-center rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2 text-xs text-slate-400">
                <span className="text-slate-500 mr-1">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-') })}
                  placeholder="dlf-phase-1-luxury-floors"
                  className="w-full bg-transparent text-slate-200 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Lead Excerpt / Dek (Italic Golden Accent on Detail Page)
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A refined summary of this market guide that appears below the headline with a gold accent..."
                className="w-full text-sm font-serif italic bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
              />
            </div>
          </div>

          {/* Card 2: Key Takeaways & Direct Answer (Luxury Featured Box) */}
          <div className="p-6 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D09A16]" />
                <h3 className="font-serif font-bold text-white text-base">Key Takeaways & Direct Answer Box</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#D09A16] uppercase tracking-wider">
                Google Answer Ready
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Direct Answer Summary (Quick 2-sentence executive takeaway)
              </label>
              <textarea
                rows={2}
                value={formData.directAnswer}
                onChange={(e) => setFormData({ ...formData, directAnswer: e.target.value })}
                placeholder="Ultra-luxury builder floors in DLF Phase 1 are commanding ₹5.5 Cr to ₹14 Cr in 2026..."
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Bulleted Takeaway Highlights ({formData.keyTakeaways.length})
              </label>
              <div className="space-y-2 mb-3">
                {formData.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/[0.03] border border-white/10 p-2.5 rounded-xl text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shrink-0" />
                    <span className="flex-1">{point}</span>
                    <button
                      type="button"
                      onClick={() => removeTakeaway(idx)}
                      className="p-1 hover:text-red-400 text-slate-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTakeaway(); } }}
                  placeholder="e.g. Freehold municipal registry with 100% stilt parking allotment"
                  className="flex-1 text-xs bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                />
                <button
                  type="button"
                  onClick={addTakeaway}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Point</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Main Article Content Editor with Live Preview */}
          <div className="p-6 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h3 className="font-serif font-bold text-white text-base">Article Content (Markdown)</h3>
                <span className="text-[11px] text-slate-400">
                  Use <code className="text-[#D09A16]">## Heading</code> for auto Table of Contents
                </span>
              </div>

              {/* Write vs Preview Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !previewMode ? 'bg-[#D09A16] text-[#0A0E17]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    previewMode ? 'bg-[#D09A16] text-[#0A0E17]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye size={12} />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {/* Markdown Toolbar (Shown in Write Mode) */}
            {!previewMode && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  title="H2 Major Section (Adds to Table of Contents)"
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-[#D09A16] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Heading size={13} />
                  <span className="font-bold">H2</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('### ')}
                  title="H3 Subheading"
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-[#D09A16] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Heading size={11} />
                  <span>H3</span>
                </button>

                <span className="w-px h-4 bg-white/15 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  title="Bold"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Bold size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  title="Italic"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Italic size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  title="Bullet List"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <List size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  title="Callout Quote"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Quote size={13} />
                </button>

                <span className="w-px h-4 bg-white/15 mx-1" />

                {/* Inline ImageKit Upload Button */}
                <input
                  type="file"
                  ref={inlineImageInputRef}
                  onChange={handleInlineImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inlineImageInputRef.current?.click()}
                  title="Browse computer to upload & insert image to ImageKit"
                  className="px-3 py-1.5 rounded-lg bg-[#D09A16]/15 hover:bg-[#D09A16]/25 text-[#D09A16] border border-[#D09A16]/30 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                >
                  <Upload size={13} />
                  <span>Upload & Insert Image</span>
                </button>
              </div>
            )}

            {/* Content Area */}
            {!previewMode ? (
              <textarea
                ref={textareaRef}
                rows={18}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={`## 1. Overview of DLF Phase 1 Corridors\n\nBegin your insightful analysis here. Paragraphs are beautifully styled automatically.\n\n## 2. Title Verification & Freehold Status\n\nDiscuss regulatory clearances and statutory compliance...`}
                className="w-full font-mono text-sm leading-relaxed bg-white/[0.03] border border-white/15 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D09A16] resize-y"
              />
            ) : (
              <div className="bg-[#FAF8F5] text-[#17213D] p-6 sm:p-8 rounded-xl border border-white/15 min-h-[400px] overflow-y-auto">
                <div className="text-xs font-bold uppercase tracking-widest text-[#D09A16] mb-3 pb-2 border-b border-black/10">
                  Article Preview (Exact Presentation on Live Website)
                </div>
                <MarkdownRenderer content={formData.content || '*No content written yet.*'} />
              </div>
            )}
          </div>

          {/* Card 4: Frequently Asked Questions (FAQ) */}
          <div className="p-6 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-[#D09A16]" />
                <h3 className="font-serif font-bold text-white text-base">Frequently Asked Questions (FAQ)</h3>
              </div>
              <button
                type="button"
                onClick={addFaqItem}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Question</span>
              </button>
            </div>

            {formData.faq.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No FAQ items yet. Click &quot;Add Question&quot; to build the schema-rich interactive accordion.
              </p>
            ) : (
              <div className="space-y-3">
                {formData.faq.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#D09A16] uppercase">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaqItem(idx)}
                        className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                      placeholder="e.g. Can NRIs buy freehold builder floors in DLF Gurugram?"
                      className="w-full text-xs font-semibold bg-white/[0.04] border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                    />
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                      placeholder="Detailed answer explaining FEMA regulations, NRE/NRO accounts, and clean title conveyance..."
                      className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: PUBLISHING & MEDIA SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sidebar 1: Publication Card */}
          <div className="p-5 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-white text-sm pb-2 border-b border-white/10">
              Publication Settings
            </h3>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
              >
                <option value="draft" className="bg-[#0E162B] text-white">Draft (Unpublished)</option>
                <option value="published" className="bg-[#0E162B] text-white">Published (Live)</option>
                <option value="archived" className="bg-[#0E162B] text-white">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
              >
                <option value="" className="bg-[#0E162B] text-white">Select Category...</option>
                {taxonomies.categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-[#0E162B] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Author
              </label>
              <select
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full text-xs bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
              >
                <option value="" className="bg-[#0E162B] text-white">Select Author...</option>
                {taxonomies.authors.map((auth) => (
                  <option key={auth._id} value={auth._id} className="bg-[#0E162B] text-white">
                    {auth.name} ({auth.jobTitle || 'Advisory Partner'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sidebar 2: Featured Cover Photo (ImageKit File Upload) */}
          <div className="p-5 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Featured Cover Photo</span>
              <span className="text-[10px] text-[#D09A16] font-bold tracking-wider uppercase">ImageKit</span>
            </h3>

            <ImageUploadInput
              label="Upload Cover Image *"
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
              folder="/saudagar-properties/blogs"
              placeholder="Browse file to upload cover..."
            />

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Image Alt Text (Accessibility & SEO)
              </label>
              <input
                type="text"
                value={formData.featuredImageAlt}
                onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                placeholder="e.g. DLF Phase 1 luxury builder floor architecture"
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Caption / Credit (Optional)
              </label>
              <input
                type="text"
                value={formData.featuredImageCredit}
                onChange={(e) => setFormData({ ...formData, featuredImageCredit: e.target.value })}
                placeholder="e.g. Saudagar Properties Archive"
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
              />
            </div>
          </div>

          {/* Sidebar 3: Search Engine (SEO) Snippet */}
          <div className="p-5 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Search Engine (SEO) Snippet</span>
              <Search size={14} className="text-[#D09A16]" />
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-300">Meta Title</label>
                <span className={`text-[10px] ${(formData.seoTitle?.length || 0) > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {formData.seoTitle?.length || 0}/60
                </span>
              </div>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder={formData.title ? `${formData.title} | Saudagar Properties` : 'Meta Title for Google'}
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-300">Meta Description</label>
                <span className={`text-[10px] ${(formData.seoDescription?.length || 0) > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {formData.seoDescription?.length || 0}/160
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Compelling description summarizing the article for Google search results..."
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl p-2.5 text-white outline-none focus:border-[#D09A16]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                placeholder="e.g. DLF Phase 1 builder floors"
                className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
              />
            </div>

            {/* Google SERP Preview Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Google Search Preview
              </span>
              <p className="text-[#8ab4f8] text-xs font-medium truncate hover:underline cursor-pointer">
                {formData.seoTitle || formData.title || 'Saudagar Properties Blog'}
              </p>
              <p className="text-[#34a853] text-[11px] font-mono truncate">
                https://saudagarproperties.com/blog/{formData.slug || 'article-slug'}
              </p>
              <p className="text-slate-400 text-[11px] line-clamp-2 leading-snug">
                {formData.seoDescription || formData.excerpt || 'Discover luxury real estate advisory and builder floors in DLF Gurugram with Saudagar Properties.'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
