"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Search, Layout, Settings, List, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '@/services/api';

export default function BlogEditor({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    title: '', slug: '', excerpt: '', content: '',
    featuredImage: '', featuredImageAlt: '',
    status: 'draft', publishedAt: '',
    author: '', category: '', tags: [], location: [], propertyType: [],
    seoTitle: '', seoDescription: '', focusKeyword: '', canonicalUrl: '',
    faq: []
  });

  const [taxonomies, setTaxonomies] = useState({ authors: [], categories: [], tags: [], locations: [], propertyTypes: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('content'); // content, seo, taxonomy, media, faq
  const textareaRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getTaxonomies();
        if (res.success) {
          setTaxonomies(res.data);
        }
      } catch (err) {
        console.error("Failed to load taxonomies", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = useCallback(async (isAutosave = false) => {
    if (!formData.title || !formData.content) {
      if (!isAutosave) alert("Title and Content are required.");
      return;
    }
    
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateBlog(formData._id, formData);
        if (!isAutosave) setToast('Post updated successfully!');
      } else {
        const res = await api.createBlog(formData);
        if (!isAutosave) {
          setToast('Post created successfully!');
          router.push(`/admin/blog/${res.data._id}/edit`);
        }
      }
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      if (!isAutosave) alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [formData, isEdit, router]);

  // Autosave
  useEffect(() => {
    if (!isEdit || !initialData) return;
    const timer = setTimeout(() => {
      handleSave(true);
    }, 60000); // Autosave every 60s
    return () => clearTimeout(timer);
  }, [formData, isEdit, initialData, handleSave]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, isMulti = false) => {
    if (isMulti) {
      setFormData(prev => {
        const current = prev[field] || [];
        const index = current.indexOf(value);
        if (index > -1) {
          return { ...prev, [field]: current.filter(id => id !== value) };
        }
        return { ...prev, [field]: [...current, value] };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    handleChange('content', `${before}${prefix}${selected || 'text'}${suffix}${after}`);
    
    // reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    }, 0);
  };



  const addFaq = () => {
    handleChange('faq', [...(formData.faq || []), { question: '', answer: '' }]);
  };

  const updateFaq = (index, field, value) => {
    const newFaq = [...formData.faq];
    newFaq[index][field] = value;
    handleChange('faq', newFaq);
  };

  const removeFaq = (index) => {
    const newFaq = formData.faq.filter((_, i) => i !== index);
    handleChange('faq', newFaq);
  };

  // Content Intelligence
  const wordCount = formData.content.split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);
  const warnings = [];
  if (!formData.content.includes('# ')) warnings.push('Missing H1 in content');
  if (!formData.featuredImage) warnings.push('Missing featured image');
  if (!formData.seoDescription) warnings.push('Missing meta description');
  if (!formData.author) warnings.push('Author not assigned');

  if (loading) return <div className="p-10 text-center text-slate-400">Loading editor...</div>;

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-[#121724] p-4 rounded-2xl border border-white/10 sticky top-4 z-50 shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/blog')} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-serif font-bold text-white">{isEdit ? 'Edit Post' : 'New Post'}</h1>
            {saving && <span className="text-[10px] text-[#D09A16] uppercase tracking-widest">Saving...</span>}
            {toast && <span className="text-[10px] text-emerald-400 uppercase tracking-widest">{toast}</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={formData.status} 
            onChange={e => handleChange('status', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Save size={14} />
            <span>{isEdit ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#121724] border border-white/10 rounded-2xl p-6">
            <input
              type="text"
              placeholder="Post Title..."
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full bg-transparent text-3xl font-serif font-bold text-white placeholder-slate-600 outline-none mb-4"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <span>https://saudagarproperties.com/blog/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={e => handleChange('slug', e.target.value)}
                placeholder="auto-generated-slug"
                className="bg-transparent border-b border-dashed border-slate-600 text-slate-400 outline-none w-1/2 focus:border-[#D09A16]"
              />
            </div>
            
            <textarea
              placeholder="Short excerpt for lists and previews..."
              value={formData.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D09A16] mb-6 resize-none h-20"
            />

            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-white/5 p-2 rounded-t-xl border border-white/10 border-b-0">
              <button onClick={() => insertMarkdown('# ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs font-bold">H1</button>
              <button onClick={() => insertMarkdown('## ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs font-bold">H2</button>
              <button onClick={() => insertMarkdown('### ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs font-bold">H3</button>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs font-bold">B</button>
              <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs italic">I</button>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button onClick={() => insertMarkdown('- ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs">List</button>
              <button onClick={() => insertMarkdown('1. ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs">1.</button>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs">Link</button>
              <button onClick={() => insertMarkdown('![alt text](', ')')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs">Image</button>
              <button onClick={() => insertMarkdown('> ', '')} className="p-1.5 hover:bg-white/10 rounded text-slate-300 text-xs">Quote</button>
            </div>
            
            <textarea
              ref={textareaRef}
              placeholder="Write your markdown content here..."
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
              className="w-full bg-[#0C101A] border border-white/10 rounded-b-xl p-4 text-sm text-slate-200 outline-none focus:border-[#D09A16] min-h-[500px] font-mono leading-relaxed"
            />
          </div>

          {/* Intelligence Panel */}
          <div className="bg-[#121724] border border-white/10 rounded-2xl p-4 flex gap-6 text-xs text-slate-400">
            <div><span className="text-white font-bold">{wordCount}</span> words</div>
            <div><span className="text-white font-bold">{readTime}</span> min read</div>
            {warnings.length > 0 && (
              <div className="flex-1 text-right text-amber-400">
                {warnings.length} Optimization Warnings (Check SEO Tab)
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="flex bg-[#121724] border border-white/10 rounded-xl p-1 mb-4">
            <button onClick={() => setActiveTab('seo')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${activeTab === 'seo' ? 'bg-[#D09A16] text-[#0C101A]' : 'text-slate-400 hover:text-white'}`}>SEO</button>
            <button onClick={() => setActiveTab('taxonomy')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${activeTab === 'taxonomy' ? 'bg-[#D09A16] text-[#0C101A]' : 'text-slate-400 hover:text-white'}`}>Data</button>
            <button onClick={() => setActiveTab('media')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${activeTab === 'media' ? 'bg-[#D09A16] text-[#0C101A]' : 'text-slate-400 hover:text-white'}`}>Media</button>
            <button onClick={() => setActiveTab('faq')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${activeTab === 'faq' ? 'bg-[#D09A16] text-[#0C101A]' : 'text-slate-400 hover:text-white'}`}>FAQ</button>
          </div>

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="bg-[#121724] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Search size={14} /> Search Engine Optimization</h3>
              {warnings.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                  <ul className="text-[10px] text-amber-400 list-disc pl-4">
                    {warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={e => handleChange('seoTitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Meta Description</label>
                <textarea rows={3} value={formData.seoDescription} onChange={e => handleChange('seoDescription', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white resize-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Focus Keyword</label>
                <input type="text" value={formData.focusKeyword} onChange={e => handleChange('focusKeyword', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Canonical URL</label>
                <input type="text" value={formData.canonicalUrl} onChange={e => handleChange('canonicalUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="/blog/..." />
              </div>
            </div>
          )}

          {/* Taxonomy Tab */}
          {activeTab === 'taxonomy' && (
            <div className="bg-[#121724] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Layout size={14} /> Organization</h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Author</label>
                <select value={formData.author} onChange={e => handleChange('author', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white">
                  <option value="">Select Author...</option>
                  {taxonomies.authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select value={formData.category} onChange={e => handleChange('category', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white">
                  <option value="">Select Category...</option>
                  {taxonomies.categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Locations (Multi)</label>
                <select multiple value={formData.location} onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, option => option.value);
                  handleChange('location', vals);
                }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white h-24">
                  {taxonomies.locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Property Types (Multi)</label>
                <select multiple value={formData.propertyType} onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, option => option.value);
                  handleChange('propertyType', vals);
                }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white h-24">
                  {taxonomies.propertyTypes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="bg-[#121724] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><ImageIcon size={14} /> Featured Image</h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                <input type="text" value={formData.featuredImage} onChange={e => handleChange('featuredImage', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" />
              </div>
              {formData.featuredImage && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Alt Text</label>
                <input type="text" value={formData.featuredImageAlt} onChange={e => handleChange('featuredImageAlt', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" />
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="bg-[#121724] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><List size={14} /> FAQ Schema</h3>
                <button onClick={addFaq} type="button" className="text-[#D09A16] hover:text-[#B5986D]"><Plus size={16} /></button>
              </div>
              {formData.faq?.length === 0 && <p className="text-xs text-slate-500">No FAQs added yet.</p>}
              {formData.faq?.map((faq, index) => (
                <div key={index} className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10 relative">
                  <button onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-500"><Trash2 size={12} /></button>
                  <input type="text" placeholder="Question..." value={faq.question} onChange={e => updateFaq(index, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-white outline-none focus:border-[#D09A16]" />
                  <textarea rows={2} placeholder="Answer..." value={faq.answer} onChange={e => updateFaq(index, 'answer', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-white outline-none focus:border-[#D09A16] resize-none" />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
