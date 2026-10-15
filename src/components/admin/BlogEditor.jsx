"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Upload,
  Clock,
  HelpCircle,
  Search,
  ExternalLink,
  Link2,
  Code,
  Table,
  Minus,
  Columns,
  FileText,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import api from '@/services/api';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import LiveArticlePreview from '@/components/admin/LiveArticlePreview';
import InternalLinkModal from '@/components/admin/InternalLinkModal';

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

  // Reference data for internal linking
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [properties, setProperties] = useState([]);

  // View Mode: 'write' (Standard Canvas) | 'split' (Side-by-Side Live Preview) | 'preview' (Full Live Preview)
  const [viewMode, setViewMode] = useState('write');

  // Internal Link Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedTextForLink, setSelectedTextForLink] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');

  const textareaRef = useRef(null);
  const inlineImageInputRef = useRef(null);

  // Load Authors, Categories, Published Blogs & Properties
  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [taxRes, blogsRes, propsRes] = await Promise.allSettled([
          api.getTaxonomies(),
          api.getBlogs(),
          api.getProperties()
        ]);

        if (taxRes.status === 'fulfilled' && taxRes.value?.success && taxRes.value?.data) {
          const authors = taxRes.value.data.authors || [];
          const categories = taxRes.value.data.categories || [];
          setTaxonomies({ authors, categories });

          // Set sensible defaults if creating new article
          if (!isEdit && authors.length > 0) {
            setFormData(prev => ({
              ...prev,
              author: prev.author || authors[0]._id,
              category: prev.category || categories[0]?._id || ''
            }));
          }
        }

        if (blogsRes.status === 'fulfilled' && blogsRes.value?.data) {
          setPublishedBlogs(blogsRes.value.data);
        }

        if (propsRes.status === 'fulfilled' && propsRes.value?.data) {
          setProperties(propsRes.value.data);
        }
      } catch (err) {
        console.warn('Failed to load taxonomies or link references:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkspaceData();
  }, [isEdit]);

  // Resolve Author & Category objects for live preview rendering
  const currentAuthor = useMemo(() => {
    return taxonomies.authors.find(a => a._id === formData.author || a.name === formData.author) || null;
  }, [taxonomies.authors, formData.author]);

  const currentCategory = useMemo(() => {
    return taxonomies.categories.find(c => c._id === formData.category || c.name === formData.category) || null;
  }, [taxonomies.categories, formData.category]);

  // Live content stats
  const wordCount = useMemo(() => {
    return (formData.content || '').trim().split(/\s+/).filter(Boolean).length;
  }, [formData.content]);

  const liveReadingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const headingCount = useMemo(() => {
    return (formData.content?.match(/^#{2,3}\s/gm) || []).length;
  }, [formData.content]);

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
  const insertFormatting = (prefix, suffix = '', defaultPlaceholder = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content || '';
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || defaultPlaceholder}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length, 
        start + prefix.length + (selected ? selected.length : defaultPlaceholder.length)
      );
    }, 50);
  };

  const insertSnippet = (snippet) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: `${prev.content || ''}${snippet}` }));
      return;
    }
    const start = textarea.selectionStart;
    const text = formData.content || '';
    const newContent = text.substring(0, start) + snippet + text.substring(start);
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      const newPos = start + snippet.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  const insertTable = () => {
    const tableMd = `\n\n| Specification / Feature | DLF Corridor Standard | Advisory Benchmark |\n| :--- | :--- | :--- |\n| Plot Size | 300 to 500 Sq. Yards | Freehold Allotment |\n| Floor Configuration | 4BHK + Staff Stilt+4 | Independent Registry |\n| Price Index (2026) | ₹5.50 Cr - ₹14.50 Cr | Prime Transit Corridor |\n\n`;
    insertSnippet(tableMd);
  };

  const insertCallout = (type = 'note') => {
    if (type === 'warning') {
      insertSnippet(`\n> ⚠️ **Statutory Due Diligence Notice:** Ensure title verification of Haryana Shahari Vikas Pradhikaran (HSVP) zoning regulations before registry.\n\n`);
    } else {
      insertSnippet(`\n> 💡 **Market Intelligence Takeaway:** DLF Phase 1 builder floors have appreciated 18.4% year-on-year across Golf Course Road arterial stretches.\n\n`);
    }
  };

  // Open Internal Link Modal with highlighted text
  const openInternalLinkModal = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const sel = (formData.content || '').substring(start, end);
      setSelectedTextForLink(sel.trim());
    } else {
      setSelectedTextForLink('');
    }
    setIsLinkModalOpen(true);
  };

  // Insert markdown link from modal
  const handleInsertLink = (markdownLink) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: `${prev.content || ''} ${markdownLink}` }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content || '';
    const newContent = text.substring(0, start) + markdownLink + text.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      const newPos = start + markdownLink.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  // Keyboard shortcut handlers
  const handleTextareaKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openInternalLinkModal();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      insertFormatting('**', '**', 'bold text');
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      insertFormatting('*', '*', 'italic text');
    }
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
        insertSnippet(imageMarkdown);
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
      const payload = {
        ...formData,
        readingTime: liveReadingTime,
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

  // RENDER MARKDOWN TOOLBAR
  const renderToolbar = () => (
    <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-[#121B35] border border-white/10 text-xs text-slate-300 shadow-inner">
      
      {/* Headings */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => insertFormatting('## ', '', 'Major Section Title')}
          title="H2 Major Section (Auto-adds to Table of Contents)"
          className="px-2 py-1 rounded hover:bg-[#D09A16]/20 hover:text-[#D09A16] flex items-center gap-0.5 font-bold transition-colors cursor-pointer"
        >
          <Heading size={13} />
          <span>H2</span>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('### ', '', 'Subsection Title')}
          title="H3 Subheading"
          className="px-2 py-1 rounded hover:bg-[#D09A16]/20 hover:text-[#D09A16] flex items-center gap-0.5 font-medium transition-colors cursor-pointer"
        >
          <Heading size={11} />
          <span>H3</span>
        </button>
      </div>

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* Inline Formatting */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**', 'bold text')}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Bold size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*', 'italic text')}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Italic size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
          title="Underline"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Underline size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('~~', '~~', 'strikethrough text')}
          title="Strikethrough"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Strikethrough size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('`', '`', 'code')}
          title="Inline Code"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Code size={13} />
        </button>
      </div>

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* Lists & Quotes */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => insertFormatting('- ', '', 'List item')}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <List size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('1. ', '', 'Numbered item')}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <ListOrdered size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('> ', '', 'Luxury editorial quote...')}
          title="Callout Quote"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Quote size={13} />
        </button>
      </div>

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* Advanced Callouts & Table */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => insertCallout('note')}
          title="Insert Market Intelligence Callout Box"
          className="p-1.5 rounded hover:bg-[#D09A16]/20 hover:text-[#D09A16] transition-colors cursor-pointer text-amber-400"
        >
          <Lightbulb size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertCallout('warning')}
          title="Insert Regulatory Notice Box"
          className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer text-red-400"
        >
          <AlertTriangle size={13} />
        </button>
        <button
          type="button"
          onClick={insertTable}
          title="Insert Specification Table"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Table size={13} />
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\n\n---\n\n')}
          title="Insert Horizontal Divider"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Minus size={13} />
        </button>
      </div>

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* 1-CLICK INTERNAL LINK TOOL */}
      <button
        type="button"
        onClick={openInternalLinkModal}
        title="Insert Internal Link to Blogs, DLF Corridors, Properties, or Custom URL (Ctrl+K)"
        className="px-3 py-1.5 rounded-lg bg-[#D09A16]/20 hover:bg-[#D09A16]/30 text-[#D09A16] border border-[#D09A16]/40 font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
      >
        <Link2 size={13} />
        <span>Insert Internal Link</span>
        <kbd className="hidden sm:inline text-[9px] px-1 py-0.5 rounded bg-black/30 border border-[#D09A16]/30 text-[#D09A16]">
          ⌘K
        </kbd>
      </button>

      {/* Inline Image Upload */}
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
        title="Upload image to ImageKit and embed directly into article"
        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
      >
        <Upload size={13} />
        <span>Upload & Insert Image</span>
      </button>
    </div>
  );

  return (
    <div className={`mx-auto space-y-6 pb-20 ${viewMode === 'split' ? 'max-w-[1850px] px-2 sm:px-4' : 'max-w-7xl'}`}>
      
      {/* ================= TOP ACTION BAR ================= */}
      <div className="sticky top-0 z-30 bg-[#0E162B]/95 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Nav & Title */}
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
                <Clock size={11} /> {liveReadingTime} min read
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">
                {wordCount} words
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-white truncate max-w-sm sm:max-w-md">
              {formData.title || (isEdit ? 'Edit Article' : 'Compose New Article')}
            </h1>
          </div>
        </div>

        {/* Center: VIEW MODE SWITCHER (Write | Split Live Preview | Full Preview) */}
        <div className="flex items-center bg-[#121B35] p-1 rounded-xl border border-white/10 shadow-inner self-stretch lg:self-auto justify-center">
          <button
            type="button"
            onClick={() => setViewMode('write')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'write'
                ? 'bg-[#D09A16] text-[#0A0E17] shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Write Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
              viewMode === 'split'
                ? 'bg-[#D09A16] text-[#0A0E17] shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns size={13} />
            <span>Split Live Preview</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-[#D09A16] text-[#0A0E17] shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Full Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          {formData.slug && (
            <a
              href={`/blog/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Preview Live</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#D09A16] hover:bg-[#b8850f] text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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

      {/* =========================================================================
          VIEW MODE 1: FULL PREVIEW (Authentic Website Layout)
      ========================================================================== */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#121B35] border border-white/10 text-xs text-slate-300">
            <span>Viewing full-width live replica of <strong>/blog/{formData.slug || 'slug'}</strong></span>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className="text-[#D09A16] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Columns size={13} />
              <span>Switch to Side-by-Side Split View</span>
            </button>
          </div>
          <LiveArticlePreview
            formData={formData}
            author={currentAuthor}
            category={currentCategory}
            isSplitView={false}
          />
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: SPLIT SCREEN (Editor on Left, Live Preview on Right)
      ========================================================================== */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          
          {/* LEFT HALF: THE WRITING CANVAS */}
          <div className="space-y-6">
            
            {/* Title & Slug */}
            <div className="p-5 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
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
                  className="w-full text-xl font-serif font-bold bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Slug Permalink
                  </label>
                  <div className="flex items-center rounded-xl bg-white/[0.03] border border-white/10 px-3 py-1.5 text-xs text-slate-400">
                    <span className="text-slate-500 mr-1">/blog/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-') })}
                      placeholder="dlf-phase-1-guide"
                      className="w-full bg-transparent text-slate-200 outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                  >
                    <option value="" className="bg-[#0E162B] text-white">Select Category...</option>
                    {taxonomies.categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-[#0E162B] text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Lead Excerpt (Italic Golden Dek)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A refined summary of this market guide that appears below the headline with a gold accent..."
                  className="w-full text-xs font-serif italic bg-white/[0.04] border border-white/15 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                />
              </div>
            </div>

            {/* Content Editor Canvas */}
            <div className="p-5 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-white text-base">Article Body (Markdown)</h3>
                  <span className="text-[10px] text-[#D09A16] px-2 py-0.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 font-semibold">
                    Live Parity
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {headingCount} headings • {wordCount} words
                </div>
              </div>

              {/* Enhanced Toolbar */}
              {renderToolbar()}

              {/* Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={22}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={`## 1. Overview of DLF Phase 1 Corridors\n\nBegin your insightful analysis here. Internal links inserted via ⌘K will render with authentic gold accents on the right.\n\n## 2. Title Verification & Freehold Status\n\nDiscuss regulatory clearances and statutory compliance...`}
                  className="w-full font-mono text-xs sm:text-sm leading-relaxed bg-[#0A0F1E] border border-white/15 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#D09A16] resize-y scrollbar-thin"
                />
              </div>

              {/* Editor Bottom Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>💡 Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+K</kbd> to insert internal links</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+B</kbd> Bold</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+I</kbd> Italic</span>
                </div>
                <button
                  type="button"
                  onClick={openInternalLinkModal}
                  className="text-[#D09A16] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Link2 size={12} />
                  <span>Choose Link Target</span>
                </button>
              </div>
            </div>

            {/* Collapsible Accordion: Direct Answer & Key Takeaways */}
            <details className="group rounded-2xl bg-[#0E162B] border border-white/10 p-5 shadow-xl transition-all">
              <summary className="flex items-center justify-between cursor-pointer font-serif font-bold text-white text-sm select-none list-none">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D09A16]" />
                  <span>AEO Direct Answer & Key Takeaways</span>
                </div>
                <span className="text-[11px] text-[#D09A16] group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Direct Answer Summary (Executive Takeaway)
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
                    Key Takeaway Highlights ({formData.keyTakeaways.length})
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
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </details>

            {/* Collapsible Accordion: FAQ Items */}
            <details className="group rounded-2xl bg-[#0E162B] border border-white/10 p-5 shadow-xl transition-all">
              <summary className="flex items-center justify-between cursor-pointer font-serif font-bold text-white text-sm select-none list-none">
                <div className="flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#D09A16]" />
                  <span>Frequently Asked Questions ({formData.faq.length})</span>
                </div>
                <span className="text-[11px] text-[#D09A16] group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Question</span>
                  </button>
                </div>

                {formData.faq.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#D09A16]">FAQ #{idx + 1}</span>
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
                      placeholder="Question..."
                      className="w-full text-xs font-semibold bg-white/[0.04] border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                    />
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                      placeholder="Answer..."
                      className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-lg p-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                    />
                  </div>
                ))}
              </div>
            </details>

            {/* Collapsible Accordion: Media & SEO */}
            <details className="group rounded-2xl bg-[#0E162B] border border-white/10 p-5 shadow-xl transition-all">
              <summary className="flex items-center justify-between cursor-pointer font-serif font-bold text-white text-sm select-none list-none">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-[#D09A16]" />
                  <span>Cover Photo & Search Engine (SEO) Snippet</span>
                </div>
                <span className="text-[11px] text-[#D09A16] group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                <ImageUploadInput
                  label="Upload Featured Cover Image"
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  folder="/saudagar-properties/blogs"
                  placeholder="Browse file to upload cover..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Author Byline
                    </label>
                    <select
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full text-xs bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                    >
                      <option value="" className="bg-[#0E162B] text-white">Select Author...</option>
                      {taxonomies.authors.map((auth) => (
                        <option key={auth._id} value={auth._id} className="bg-[#0E162B] text-white">
                          {auth.name}
                        </option>
                      ))}
                    </select>
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
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Search snippet summary..."
                    className="w-full text-xs bg-white/[0.04] border border-white/15 rounded-xl p-2.5 text-white outline-none focus:border-[#D09A16]"
                  />
                </div>
              </div>
            </details>

          </div>

          {/* RIGHT HALF: STICKY REAL-TIME LIVE ARTICLE PREVIEW */}
          <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border border-white/15 shadow-2xl scrollbar-thin">
            <LiveArticlePreview
              formData={formData}
              author={currentAuthor}
              category={currentCategory}
              isSplitView={true}
            />
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: WRITE CANVAS (Standard 8-col / 4-col Classic Layout)
      ========================================================================== */}
      {viewMode === 'write' && (
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

            {/* Card 3: Main Article Content Editor with Advanced Toolbar */}
            <div className="p-6 rounded-2xl bg-[#0E162B] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif font-bold text-white text-base">Article Content (Markdown)</h3>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Use <code className="text-[#D09A16]">## Heading</code> for auto Table of Contents
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#D09A16]/15 hover:bg-[#D09A16]/25 text-[#D09A16] border border-[#D09A16]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Columns size={12} />
                  <span>Open Split Preview</span>
                </button>
              </div>

              {/* Enhanced Markdown Toolbar */}
              {renderToolbar()}

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={20}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                onKeyDown={handleTextareaKeyDown}
                placeholder={`## 1. Overview of DLF Phase 1 Corridors\n\nBegin your insightful analysis here. Paragraphs are beautifully styled automatically.\n\n## 2. Title Verification & Freehold Status\n\nDiscuss regulatory clearances and statutory compliance...`}
                className="w-full font-mono text-sm leading-relaxed bg-white/[0.03] border border-white/15 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D09A16] resize-y"
              />

              {/* Textarea Footer Stats */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>💡 Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+K</kbd> to insert internal links</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+B</kbd> Bold</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-slate-200">Ctrl+I</kbd> Italic</span>
                </div>
                <span>{headingCount} headings • {wordCount} words • ~{liveReadingTime} min read</span>
              </div>
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
      )}

      {/* =========================================================================
          4. 1-CLICK INTERNAL LINK MODAL (Pop-up with Blogs, Corridors, Properties)
      ========================================================================== */}
      {isLinkModalOpen && (
        <InternalLinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onInsertLink={handleInsertLink}
          selectedText={selectedTextForLink}
          publishedBlogs={publishedBlogs}
          properties={properties}
        />
      )}

    </div>
  );
}
