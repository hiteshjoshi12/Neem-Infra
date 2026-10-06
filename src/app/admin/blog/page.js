"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, CheckCircle2, FileText, BarChart3, Clock, Archive } from 'lucide-react';
import api from '@/services/api';

export default function AdminBlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getBlogs();
      if (res.success) {
        setBlogs(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteBlog(id);
      setToast('Blog deleted successfully');
      await fetchBlogs();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const metrics = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
    scheduled: blogs.filter(b => b.status === 'scheduled').length,
    archived: blogs.filter(b => b.status === 'archived').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">
            <FileText size={12} />
            <span>Content Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Blog & Articles
          </h1>
          <p className="text-xs text-slate-400">
            Manage your SEO, AEO, and GEO optimized editorial content.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>New Article</span>
        </Link>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/10 flex flex-col gap-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Posts</span>
          <span className="text-2xl text-white font-serif">{metrics.total}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/10 flex flex-col gap-1">
          <span className="text-emerald-400 text-xs font-semibold uppercase">Published</span>
          <span className="text-2xl text-white font-serif">{metrics.published}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/10 flex flex-col gap-1">
          <span className="text-amber-400 text-xs font-semibold uppercase">Drafts</span>
          <span className="text-2xl text-white font-serif">{metrics.drafts}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/10 flex flex-col gap-1">
          <span className="text-blue-400 text-xs font-semibold uppercase">Scheduled</span>
          <span className="text-2xl text-white font-serif">{metrics.scheduled}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/10 flex flex-col gap-1">
          <span className="text-slate-500 text-xs font-semibold uppercase">Archived</span>
          <span className="text-2xl text-white font-serif">{metrics.archived}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121724] border border-white/10 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No articles found. Create one!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title & Slug</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold">Updated</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {blogs.map(blog => (
                  <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-serif text-sm text-white mb-1">{blog.title}</p>
                      <p className="text-[10px] text-slate-500">/{blog.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        blog.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                        blog.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                        blog.status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {blog.author?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${blog._id}/edit`} className="p-2 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0C101A] text-slate-300 transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleDelete(blog._id, blog.title)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 transition-colors">
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
