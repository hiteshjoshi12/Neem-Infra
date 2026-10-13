"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import api from '@/services/api';

export default function AdminBlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getBlogs();
      if (res.success) {
        setBlogs(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteBlog(id);
      setToast('Article deleted successfully');
      await fetchBlogs();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete article');
    }
  };

  const metrics = useMemo(() => ({
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
  }), [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchesSearch = !searchQuery || 
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[10px] font-bold tracking-wider text-[#D09A16] uppercase mb-2">
            <BookOpen size={12} />
            <span>Blog & Article CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Editorial Articles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, and publish luxury market reports, micro-market guides, and investment advisories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBlogs}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh articles"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            href="/admin/blog/new"
            className="px-5 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#b8850f] text-[#0A0E17] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Plus size={15} />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E162B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Total Articles</span>
            <span className="text-2xl font-serif font-bold text-white mt-1 block">{metrics.total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
            <FileText size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E162B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block">Live & Published</span>
            <span className="text-2xl font-serif font-bold text-white mt-1 block">{metrics.published}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E162B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-amber-400 text-[11px] font-bold uppercase tracking-wider block">Drafts</span>
            <span className="text-2xl font-serif font-bold text-white mt-1 block">{metrics.drafts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Pencil size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0E162B] border border-white/10 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or slug..."
            className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${metrics.total})` },
            { id: 'published', label: `Published (${metrics.published})` },
            { id: 'draft', label: `Drafts (${metrics.drafts})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#D09A16] text-[#0A0E17]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#0E162B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-[#D09A16] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-3">
            <p>No articles found matching your query.</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D09A16] text-[#0A0E17] font-bold text-xs"
            >
              <Plus size={14} />
              <span>Create New Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Article & Slug</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Author</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Published</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-serif font-bold text-white text-sm group-hover:text-[#D09A16] transition-colors line-clamp-1 mb-0.5">
                        {blog.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        /blog/{blog.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {blog.category?.name ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/20">
                          {blog.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-slate-300 text-xs">
                        {blog.author?.name || 'Saudagar Desk'}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span>{blog.status}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '—'}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {blog.slug && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="View on live site"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}

                        <Link
                          href={`/admin/blog/${blog._id}/edit`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D09A16] text-slate-300 hover:text-[#0A0E17] transition-all"
                          title="Edit article"
                        >
                          <Pencil size={14} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
