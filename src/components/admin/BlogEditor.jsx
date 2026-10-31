"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Upload,
  Trash2,
  X,
  ExternalLink,
  Search,
  Code,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Plus,
  HelpCircle,
  Lightbulb,
  Check,
  AlertTriangle,
  Calendar,
  Globe,
  ArrowUp
} from 'lucide-react';

import api from '@/services/api';
import PreviewModal from './blog-editor/PreviewModal';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

// Dynamically import Tiptap WYSIWYG editor (admin only, zero bundle on public site)
const RichTextEditor = dynamic(() => import('./blog-editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-3xl bg-[#0B101E] border border-white/10 flex items-center justify-center text-slate-500 text-sm">
      <RefreshCw size={20} className="animate-spin text-brand-gold mr-2" />
      <span>Loading visual editor...</span>
    </div>
  )
});

export default function BlogEditor({ initialData = null, isEdit = false }) {
  const router = useRouter();

  // Form State
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
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    author: initialData?.author?._id || initialData?.author || '',
    category: initialData?.category?._id || initialData?.category || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.map(t => t?._id || t) : [],
    directAnswer: initialData?.directAnswer || '',
    keyTakeaways: Array.isArray(initialData?.keyTakeaways) ? initialData.keyTakeaways : [],
    faq: Array.isArray(initialData?.faq) ? initialData.faq : [],
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    focusKeyword: initialData?.focusKeyword || '',
    canonicalUrl: initialData?.canonicalUrl || '',
    excludeFromSitemap: Boolean(initialData?.excludeFromSitemap)
  });

  const [initialSlug, setInitialSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(isEdit));
  const [isRawMarkdown, setIsRawMarkdown] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Autosave & Save state
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'dirty' | 'error'
  const [lastSavedTime, setLastSavedTime] = useState(initialData?.updatedAt ? new Date(initialData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
  const [draftRecoveryFound, setDraftRecoveryFound] = useState(false);
  const [draftRecoveryData, setDraftRecoveryData] = useState(null);

  // Accordion Sections State
  const [accordionState, setAccordionState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('saudagar_blog_editor_accordion');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { publish: true, cover: false, seo: false, aeo: false, advanced: false };
  });

  const toggleAccordion = (key) => {
    setAccordionState(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('saudagar_blog_editor_accordion', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Taxonomies & References
  const [taxonomies, setTaxonomies] = useState({
    authors: [],
    categories: [],
    tags: []
  });
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [properties, setProperties] = useState([]);

  // UI helpers
  const [toast, setToast] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');

  // Check draft revision on load for crash recovery
  useEffect(() => {
    if (initialData?.draftRevision && initialData.draftRevision.savedAt) {
      const rev = initialData.draftRevision;
      const revTime = new Date(rev.savedAt).getTime();
      const postTime = new Date(initialData.updatedAt || 0).getTime();
      if (revTime > postTime && (rev.content !== initialData.content || rev.title !== initialData.title)) {
        setDraftRecoveryFound(true);
        setDraftRecoveryData(rev);
      }
    }
  }, [initialData]);

  // Load Taxonomies & References
  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const [taxRes, blogsRes, propsRes] = await Promise.allSettled([
          api.getTaxonomies(),
          api.getBlogs(),
          api.getProperties()
        ]);

        if (!ignore && taxRes.status === 'fulfilled' && taxRes.value?.success && taxRes.value?.data) {
          const d = taxRes.value.data;
          setTaxonomies({
            authors: d.authors || [],
            categories: d.categories || [],
            tags: d.tags || []
          });

          // Set default author/category if creating new
          if (!isEdit && d.authors?.length > 0) {
            setFormData(prev => ({
              ...prev,
              author: prev.author || d.authors[0]._id,
              category: prev.category || d.categories[0]?._id || ''
            }));
          }
        }

        if (!ignore && blogsRes.status === 'fulfilled' && blogsRes.value?.success && Array.isArray(blogsRes.value.data)) {
          setPublishedBlogs(blogsRes.value.data.filter(b => b.status === 'published'));
        }

        if (!ignore && propsRes.status === 'fulfilled' && propsRes.value?.success && Array.isArray(propsRes.value.data)) {
          setProperties(propsRes.value.data);
        }
      } catch (err) {
        console.warn('Failed to load taxonomies:', err);
      }
    }
    loadData();
    return () => { ignore = true; };
  }, [isEdit]);

  // Word count & Reading time calculation
  const wordCount = useMemo(() => {
    const raw = (formData.content || '').replace(/[#*`>|~[\]()-]/g, ' ');
    return raw.trim().split(/\s+/).filter(Boolean).length;
  }, [formData.content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const directAnswerWords = useMemo(() => {
    return (formData.directAnswer || '').trim().split(/\s+/).filter(Boolean).length;
  }, [formData.directAnswer]);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => {
      const updates = { title: newTitle };
      if (!slugManuallyEdited) {
        updates.slug = newTitle
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return { ...prev, ...updates };
    });
    markDirty();
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setFormData(prev => ({
      ...prev,
      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    }));
    markDirty();
  };

  const markDirty = () => {
    setIsDirty(true);
    setSaveStatus('dirty');
  };

  // Warn before leaving if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Autosave Draft (Debounced 3000ms after last modification)
  useEffect(() => {
    if (!isDirty || !isEdit || !initialData?._id) return;

    const timer = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        let currentContent = formData.content;
        if (typeof window !== 'undefined' && window.__TIPTAP_EDITOR__ && !isRawMarkdown) {
          try {
            const liveMd = window.__TIPTAP_EDITOR__.storage?.markdown?.getMarkdown();
            if (liveMd) currentContent = liveMd;
          } catch (e) {}
        }

        await api.updateBlog(initialData._id, {
          ...formData,
          content: currentContent,
          readingTime,
          _isAutosave: true
        });
        setSaveStatus('saved');
        setIsDirty(false);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.warn('Autosave error:', err);
        setSaveStatus('error');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDirty, formData, isEdit, initialData, readingTime]);

  // Global Ctrl+S / Cmd+S Keyboard Shortcut to save without scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveArticle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, isEdit, saveStatus, isRawMarkdown, readingTime]);

  // Handle explicit Save / Publish
  const handleSaveArticle = async (targetStatus = null) => {
    setErrorBanner('');

    // Validation
    if (!formData.title.trim()) {
      setErrorBanner('Article Title is required.');
      return;
    }

    if (!formData.slug.trim()) {
      setErrorBanner('URL slug is required.');
      return;
    }

    if (!formData.featuredImage) {
      setErrorBanner('Cover image is required. Please upload or select a cover image in the Cover Image section.');
      return;
    }

    let articleContent = formData.content;
    if (typeof window !== 'undefined' && window.__TIPTAP_EDITOR__ && !isRawMarkdown) {
      try {
        const liveMd = window.__TIPTAP_EDITOR__.storage?.markdown?.getMarkdown();
        if (liveMd) articleContent = liveMd;
      } catch (e) {}
    }

    const payload = {
      ...formData,
      content: articleContent,
      readingTime,
      status: targetStatus || formData.status,
      publishedAt: (targetStatus === 'published' && formData.status !== 'published')
        ? new Date().toISOString()
        : formData.publishedAt,
      _isAutosave: false
    };

    try {
      setSaveStatus('saving');
      let res;
      if (isEdit && initialData?._id) {
        res = await api.updateBlog(initialData._id, payload);
      } else {
        res = await api.createBlog(payload);
      }

      if (res?.success) {
        setIsDirty(false);
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setToast(isEdit ? 'Article updated and published live!' : 'Article created successfully!');
        setInitialSlug(payload.slug);

        if (!isEdit && res.data?._id) {
          setTimeout(() => {
            router.push(`/admin/blog/${res.data._id}/edit`);
          }, 800);
        } else {
          setTimeout(() => setToast(''), 4000);
        }
      } else {
        throw new Error(res?.message || 'Failed to save article.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setErrorBanner(err.message || 'Error saving article to database.');
      setSaveStatus('error');
    }
  };

  // Restore draft recovery
  const handleRestoreDraft = () => {
    if (draftRecoveryData) {
      setFormData(prev => ({
        ...prev,
        title: draftRecoveryData.title || prev.title,
        slug: draftRecoveryData.slug || prev.slug,
        excerpt: draftRecoveryData.excerpt || prev.excerpt,
        content: draftRecoveryData.content || prev.content
      }));
      setDraftRecoveryFound(false);
      setToast('Auto-saved draft content restored to canvas.');
    }
  };

  const handleDiscardDraft = () => {
    setDraftRecoveryFound(false);
  };

  // SEO Checklist items
  const seoChecklist = useMemo(() => {
    const kw = (formData.focusKeyword || '').toLowerCase().trim();
    if (!kw) return [];

    const titleHas = (formData.title || '').toLowerCase().includes(kw);
    const contentHas = (formData.content || '').toLowerCase().slice(0, 500).includes(kw);
    const metaHas = (formData.seoDescription || '').toLowerCase().includes(kw);
    const slugHas = (formData.slug || '').toLowerCase().includes(kw.replace(/\s+/g, '-'));
    const altHas = (formData.featuredImageAlt || '').toLowerCase().includes(kw);
    const internalLinkHas = (formData.content || '').includes('saudagarproperties.com') || (formData.content || '').includes('/properties') || (formData.content || '').includes('/property') || (formData.content || '').includes('/blog/');
    const wordCountOk = wordCount >= 800;

    return [
      { label: `Focus keyword in Title`, pass: titleHas },
      { label: `Focus keyword in first 500 characters`, pass: contentHas },
      { label: `Focus keyword in Meta Description`, pass: metaHas },
      { label: `Focus keyword in URL Slug`, pass: slugHas },
      { label: `Cover image has descriptive Alt text`, pass: Boolean(formData.featuredImageAlt.trim()) },
      { label: `At least one internal link included`, pass: internalLinkHas },
      { label: `Comprehensive depth (${wordCount}/800 words)`, pass: wordCountOk },
    ];
  }, [formData, wordCount]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col antialiased">
      
      {/* ===================== SLIM TOP BAR ===================== */}
      <header className="sticky top-0 z-40 bg-[#0C1222]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xl">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Return to Articles List"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm font-serif font-bold text-white truncate max-w-xs sm:max-w-md">
              {formData.title || 'Untitled Article'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className={`inline-block w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-400' :
                saveStatus === 'saving' ? 'bg-brand-gold animate-pulse' :
                saveStatus === 'dirty' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span>
                {saveStatus === 'saved' && (lastSavedTime ? `Saved at ${lastSavedTime}` : 'All changes saved')}
                {saveStatus === 'saving' && 'Saving changes...'}
                {saveStatus === 'dirty' && 'Unsaved edits'}
                {saveStatus === 'error' && 'Failed to save'}
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono">{wordCount} words</span>
              <span className="text-white/20">•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Raw Markdown Toggle */}
          <button
            type="button"
            onClick={() => setIsRawMarkdown(!isRawMarkdown)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRawMarkdown
                ? 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Switch between Visual WYSIWYG and Raw Markdown editor"
          >
            <Code size={13} />
            <span className="hidden sm:inline">{isRawMarkdown ? 'Visual Editor' : 'Raw Markdown'}</span>
          </button>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View article in identical public website renderer"
          >
            <Eye size={14} className="text-brand-gold" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSaveArticle('draft')}
            disabled={saveStatus === 'saving'}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save size={13} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Publish / Update Live Article */}
          <button
            type="button"
            onClick={() => handleSaveArticle(formData.status === 'published' ? 'published' : 'published')}
            disabled={saveStatus === 'saving'}
            className="px-5 py-2 rounded-xl bg-brand-gold hover:brightness-110 text-brand-navy-deep font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            <span>{formData.status === 'published' ? 'Update Live' : 'Publish Live'}</span>
          </button>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Hide settings drawer' : 'Open settings drawer'}
          >
            {isSidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
        </div>
      </header>

      {/* Toast & Error Alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/90 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {errorBanner && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2.5 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner('')} className="p-1 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Draft Recovery Notification */}
      {draftRecoveryFound && (
        <div className="bg-brand-gold/15 border-b border-brand-gold/30 px-6 py-3 text-brand-gold text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="shrink-0" />
            <span>
              Unsaved draft revision found from {new Date(draftRecoveryData.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Restore your edits?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1 rounded-lg bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase hover:brightness-110 cursor-pointer"
            >
              Restore Draft
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* ===================== MAIN CANVAS & SETTINGS DRAWER ===================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Main Central Writing Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-14 py-8 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Big Editorial Title Input */}
          <div>
            <input
              type="text"
              placeholder="Article Title..."
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white bg-transparent border-0 outline-none placeholder:text-slate-600 tracking-tight leading-tight"
            />
          </div>

          {/* Subtitle / Excerpt field directly below title */}
          <div>
            <textarea
              rows={2}
              placeholder="Add an editorial dek or short executive subtitle..."
              value={formData.excerpt}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, excerpt: e.target.value }));
                markDirty();
              }}
              className="w-full text-sm sm:text-base text-slate-300 bg-transparent border-b border-white/10 pb-3 outline-none placeholder:text-slate-600 resize-none font-sans leading-relaxed focus:border-brand-gold/50"
            />
          </div>

          {/* Prose Body Editor */}
          <div className="pt-2">
            <RichTextEditor
              content={formData.content}
              onChange={(newMd) => {
                setFormData(prev => ({ ...prev, content: newMd }));
                markDirty();
              }}
              publishedBlogs={publishedBlogs}
              properties={properties}
              isRawMarkdown={isRawMarkdown}
            />
          </div>

          {/* Footer Metadata Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-white/5">
            <div>
              <span>Markdown stored safely in database</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{wordCount} Words</span>
              <span>{readingTime} Min Reading Time</span>
            </div>
          </div>
        </main>

        {/* ===================== RIGHT-SIDE SETTINGS PANEL ===================== */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-96 bg-[#090E1A] border-l border-white/10 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-57px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 select-none">
            
            {/* 1. PUBLISH & TAXONOMY ACCORDION */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleAccordion('publish')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-brand-gold" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Publish &amp; Taxonomy</span>
                </div>
                {accordionState.publish ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {accordionState.publish && (
                <div className="p-4 pt-0 space-y-4 text-xs">
                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, status: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold cursor-pointer"
                    >
                      <option value="draft" className="bg-brand-navy-deep">Draft (Internal Only)</option>
                      <option value="published" className="bg-brand-navy-deep">Published (Live &amp; Indexed)</option>
                      <option value="scheduled" className="bg-brand-navy-deep">Scheduled (Auto-Publish at Date)</option>
                      <option value="archived" className="bg-brand-navy-deep">Archived (Unlisted)</option>
                    </select>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, publishedAt: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Editorial Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {taxonomies.categories.map(c => (
                        <option key={c._id} value={c._id} className="bg-brand-navy-deep">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Author Profile
                    </label>
                    <select
                      value={formData.author}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, author: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold cursor-pointer"
                    >
                      <option value="">Select Author...</option>
                      {taxonomies.authors.map(a => (
                        <option key={a._id} value={a._id} className="bg-brand-navy-deep">
                          {a.name} ({a.role || 'Advisory Desk'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Article Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-xl border border-white/10 bg-black/20">
                      {taxonomies.tags.map(t => {
                        const isSelected = formData.tags.includes(t._id);
                        return (
                          <button
                            key={t._id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                tags: isSelected ? prev.tags.filter(id => id !== t._id) : [...prev.tags, t._id]
                              }));
                              markDirty();
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-brand-gold text-brand-navy-deep font-bold'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            #{t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:border-brand-gold outline-none"
                    />
                    <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                      https://saudagarproperties.com/blog/{formData.slug || 'slug'}
                    </p>

                    {/* 301 Warning if modifying published slug */}
                    {isEdit && initialSlug && formData.slug !== initialSlug && formData.status === 'published' && (
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2 mt-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>Changing the URL of a published article will automatically generate an active 301 redirect from `/blog/{initialSlug}` to preserve link equity.</span>
                      </div>
                    )}
                  </div>

                  {/* Exclude From Sitemap */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.excludeFromSitemap}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, excludeFromSitemap: e.target.checked }));
                        markDirty();
                      }}
                      className="rounded border-white/20 bg-white/5 text-brand-gold focus:ring-0"
                    />
                    <span className="text-slate-300">Exclude from XML sitemap (`noindex`)</span>
                  </label>
                </div>
              )}
            </div>

            {/* 2. COVER IMAGE ACCORDION */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleAccordion('cover')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Upload size={15} className="text-brand-gold" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Cover Image</span>
                </div>
                {accordionState.cover ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {accordionState.cover && (
                <div className="p-4 pt-0 space-y-3 text-xs">
                  <ImageUploadInput
                    label="Hero Masthead Cover Image"
                    value={formData.featuredImage}
                    onChange={(url) => {
                      setFormData(prev => ({ ...prev, featuredImage: url }));
                      markDirty();
                    }}
                    folder="/saudagar-properties/blogs"
                  />

                  {formData.featuredImage && (
                    <>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Cover Image Alt Text <span className="text-brand-gold font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="DLF Phase 2 luxury apartment facade..."
                          value={formData.featuredImageAlt}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, featuredImageAlt: e.target.value }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            placeholder="Caption..."
                            value={formData.featuredImageCaption}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, featuredImageCaption: e.target.value }));
                              markDirty();
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Credit
                          </label>
                          <input
                            type="text"
                            placeholder="Credit..."
                            value={formData.featuredImageCredit}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, featuredImageCredit: e.target.value }));
                              markDirty();
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 3. SEARCH & SHARING (SEO) ACCORDION */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleAccordion('seo')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search size={15} className="text-brand-gold" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Search &amp; Sharing (SEO)</span>
                </div>
                {accordionState.seo ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {accordionState.seo && (
                <div className="p-4 pt-0 space-y-4 text-xs">
                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. builder floor in dlf phase 2"
                      value={formData.focusKeyword}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, focusKeyword: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs"
                    />
                  </div>

                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Meta Title
                      </label>
                      <span className={`text-[10px] font-mono ${
                        (formData.seoTitle || formData.title).length > 60 ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {(formData.seoTitle || formData.title).length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={formData.title || 'Custom SEO title...'}
                      value={formData.seoTitle}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, seoTitle: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Meta Description
                      </label>
                      <span className={`text-[10px] font-mono ${
                        (formData.seoDescription || formData.excerpt).length > 160 ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {(formData.seoDescription || formData.excerpt).length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder={formData.excerpt || 'Custom meta snippet...'}
                      value={formData.seoDescription}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, seoDescription: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs resize-none"
                    />
                  </div>

                  {/* Live Google SERP Preview Card */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Google SERP Snippet Preview</p>
                    <p className="text-[11px] text-[#4d5156] font-mono truncate">
                      https://saudagarproperties.com › blog › {formData.slug || 'article-slug'}
                    </p>
                    <p className="text-sm font-medium text-[#8ab4f8] hover:underline cursor-pointer truncate">
                      {formData.seoTitle || formData.title || 'Article Title | Saudagar Properties'}
                    </p>
                    <p className="text-[11px] text-[#bdc1c6] line-clamp-2 leading-relaxed">
                      {formData.seoDescription || formData.excerpt || 'Authoritative insights and luxury property analysis in Gurugram DLF corridors.'}
                    </p>
                  </div>

                  {/* SEO Checklist */}
                  {formData.focusKeyword.trim() && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-brand-gold font-bold">Optimization Checklist</p>
                      <div className="space-y-1.5">
                        {seoChecklist.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            {item.pass ? (
                              <Check size={13} className="text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-slate-500 shrink-0" />
                            )}
                            <span className={item.pass ? 'text-slate-200' : 'text-slate-400'}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. ANSWER BOX & FAQ (AEO) ACCORDION */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleAccordion('aeo')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-brand-gold" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Answer Box &amp; FAQ (AEO)</span>
                </div>
                {accordionState.aeo ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {accordionState.aeo && (
                <div className="p-4 pt-0 space-y-4 text-xs">
                  {/* Direct Answer */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Direct Answer Summary (AI Overview)
                      </label>
                      <span className={`text-[10px] font-mono ${
                        directAnswerWords >= 40 && directAnswerWords <= 60 ? 'text-emerald-400 font-bold' : 'text-slate-500'
                      }`}>
                        {directAnswerWords} words (Target: 40–60)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Concise 40–60 word answer for Google AI Overviews and voice search..."
                      value={formData.directAnswer}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, directAnswer: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs leading-relaxed resize-none"
                    />
                  </div>

                  {/* Key Takeaways */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Key Takeaways (Bullet Highlights)
                    </label>
                    <div className="space-y-1.5 mb-2">
                      {formData.keyTakeaways.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-brand-gold font-bold">•</span>
                          <span className="flex-1 text-[11px] text-slate-200">{item}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== idx) }));
                              markDirty();
                            }}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add key bullet point..."
                        value={newTakeaway}
                        onChange={(e) => setNewTakeaway(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newTakeaway.trim()) {
                              setFormData(prev => ({ ...prev, keyTakeaways: [...prev.keyTakeaways, newTakeaway.trim()] }));
                              setNewTakeaway('');
                              markDirty();
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-brand-gold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTakeaway.trim()) {
                            setFormData(prev => ({ ...prev, keyTakeaways: [...prev.keyTakeaways, newTakeaway.trim()] }));
                            setNewTakeaway('');
                            markDirty();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* FAQ Q&A List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        FAQs (Emitted to Google FAQ Schema)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, faq: [...prev.faq, { question: '', answer: '' }] }));
                          markDirty();
                        }}
                        className="text-[11px] text-brand-gold hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus size={12} />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.faq.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Q{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, faq: prev.faq.filter((_, i) => i !== idx) }));
                                markDirty();
                              }}
                              className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question..."
                            value={item.question}
                            onChange={(e) => {
                              const copy = [...formData.faq];
                              copy[idx].question = e.target.value;
                              setFormData(prev => ({ ...prev, faq: copy }));
                              markDirty();
                            }}
                            className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-brand-gold"
                          />
                          <textarea
                            rows={2}
                            placeholder="Answer..."
                            value={item.answer}
                            onChange={(e) => {
                              const copy = [...formData.faq];
                              copy[idx].answer = e.target.value;
                              setFormData(prev => ({ ...prev, faq: copy }));
                              markDirty();
                            }}
                            className="w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-brand-gold resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. ADVANCED ACCORDION */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('advanced')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-brand-gold" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Advanced Canonical &amp; Overrides</span>
                </div>
                {accordionState.advanced ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {accordionState.advanced && (
                <div className="p-4 pt-0 space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Custom Canonical URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://saudagarproperties.com/blog/..."
                      value={formData.canonicalUrl}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }));
                        markDirty();
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-gold text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Leave blank to default to standard blog post URL</p>
                  </div>
                </div>
              )}
            </div>

          </aside>
        )}
      </div>

      {/* ===================== FLOATING QUICK ACTION DOCK ===================== */}
      {/* Allows saving draft or updating live at ANY scroll position without scrolling to top */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0C1222]/98 backdrop-blur-2xl border-2 border-brand-gold/40 px-4 py-2.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center gap-2 pr-3 border-r border-white/10 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            saveStatus === 'saved' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
            saveStatus === 'saving' ? 'bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(208,154,22,0.8)]' :
            saveStatus === 'dirty' ? 'bg-amber-400' : 'bg-rose-400'
          }`} />
          <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
            {saveStatus === 'saved' && (lastSavedTime ? `Saved ${lastSavedTime}` : 'Saved')}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'dirty' && 'Unsaved'}
            {saveStatus === 'error' && 'Error'}
          </span>
        </div>

        {/* Save Draft */}
        <button
          type="button"
          onClick={() => handleSaveArticle('draft')}
          disabled={saveStatus === 'saving'}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Save Draft (Ctrl+S)"
        >
          <Save size={14} className="text-brand-gold" />
          <span className="hidden sm:inline">Save Draft</span>
        </button>

        {/* Publish / Update Live */}
        <button
          type="button"
          onClick={() => handleSaveArticle(formData.status === 'published' ? 'published' : 'published')}
          disabled={saveStatus === 'saving'}
          className="px-4 py-2 rounded-xl bg-brand-gold hover:brightness-110 text-brand-navy-deep font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          title={formData.status === 'published' ? "Update Live Article" : "Publish Article Live"}
        >
          {saveStatus === 'saving' ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span>{formData.status === 'published' ? 'Update Live' : 'Publish'}</span>
        </button>

        {/* Scroll To Top */}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const main = document.querySelector('main');
            if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
          title="Scroll to Top of Page"
        >
          <ArrowUp size={15} />
        </button>
      </div>

      {/* Preview Modal (Exact Public Renderer) */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        taxonomies={taxonomies}
      />
    </div>
  );
}
