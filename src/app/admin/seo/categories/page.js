"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tags,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import api from '@/services/api';

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    excludeFromSitemap: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategoriesList();
      if (res?.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', excludeFromSitemap: false });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      excludeFromSitemap: Boolean(cat.excludeFromSitemap),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        await api.updateCategory(editingCategory._id, formData);
        setToast('Category updated successfully');
      } else {
        await api.createCategory(formData);
        setToast('Category created successfully');
      }
      setIsModalOpen(false);
      await fetchCategories();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat._id);
      setToast('Category deleted successfully');
      await fetchCategories();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast */}
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
            <Tags size={12} />
            <span>Editorial Taxonomies</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Blog Categories & Taxonomies
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Organize editorial research, luxury buyer guides, and market intelligence into clean topical clusters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <BookOpen size={14} className="text-brand-gold" />
            <span>Manage Blog Articles</span>
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
          >
            <Plus size={14} />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-brand-text-dim">
            <RefreshCw className="animate-spin inline-block mr-2 text-brand-gold" size={16} />
            <span>Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-brand-text-dim">
            No categories created yet. Click &quot;New Category&quot; above to create one.
          </div>
        ) : (
          categories.map(cat => (
            <div
              key={cat._id}
              className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 hover:border-brand-gold/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-gold/10 text-brand-gold">
                    {cat.postCount || 0} Articles
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-white group-hover:text-brand-gold transition-colors">
                  {cat.name}
                </h3>
                <div className="text-xs font-mono text-brand-text-dim mt-0.5">
                  /blog/category/{cat.slug}
                </div>

                <p className="text-xs text-brand-text-muted mt-3 line-clamp-3 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <a
                  href={`/blog/category/${cat.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-gold hover:underline font-semibold"
                >
                  <span>View Public Archive</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Create/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-brand-navy border border-white/20 shadow-2xl space-y-5">
            <h3 className="text-lg font-serif font-bold text-white">
              {editingCategory ? 'Edit Category' : 'Create New Blog Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Market Research & Trends"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  URL Slug (Optional, auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="market-research-trends"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Description (Used in Category Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="In-depth price analyses, market cycles, and yield forecasts for Gurugram luxury real estate..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold leading-relaxed"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.excludeFromSitemap}
                    onChange={e => setFormData({ ...formData, excludeFromSitemap: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-xs text-amber-300">Exclude from XML Sitemap</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy-deep font-bold hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
