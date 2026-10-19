"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CornerUpRight,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Play,
  ArrowRight,
  Check
} from 'lucide-react';
import api from '@/services/api';

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState(null);
  const [formData, setFormData] = useState({
    fromPath: '',
    toPath: '',
    statusCode: 301,
    isActive: true,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Test Redirect State
  const [testPath, setTestPath] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const res = await api.getRedirects();
      if (res?.success) {
        setRedirects(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load redirects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const openCreateModal = () => {
    setEditingRedirect(null);
    setFormData({
      fromPath: '',
      toPath: '',
      statusCode: 301,
      isActive: true,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingRedirect(item);
    setFormData({
      fromPath: item.fromPath,
      toPath: item.toPath,
      statusCode: item.statusCode || 301,
      isActive: item.isActive !== false,
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!formData.fromPath.trim() || !formData.toPath.trim()) {
      alert('Source Path and Target URL are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingRedirect) {
        await api.updateRedirect(editingRedirect._id, formData);
        setToast('Redirect updated successfully');
      } else {
        await api.createRedirect(formData);
        setToast('Redirect created successfully');
      }
      setIsModalOpen(false);
      await fetchRedirects();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save redirect');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, fromPath) => {
    if (!window.confirm(`Are you sure you want to delete redirect for "${fromPath}"?`)) return;
    try {
      await api.deleteRedirect(id);
      setToast('Redirect deleted successfully');
      await fetchRedirects();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete redirect');
    }
  };

  const handleTestRedirect = async (e) => {
    e.preventDefault();
    if (!testPath.trim()) return;

    try {
      setTesting(true);
      setTestResult(null);
      const res = await api.testRedirect(testPath.trim());
      setTestResult(res?.redirect || { notFound: true });
    } catch (err) {
      setTestResult({ error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const filteredRedirects = useMemo(() => {
    return redirects.filter(r => {
      const matchSearch =
        !searchQuery ||
        r.fromPath?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.toPath?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && r.isActive) ||
        (statusFilter === 'inactive' && !r.isActive);

      return matchSearch && matchStatus;
    });
  }, [redirects, searchQuery, statusFilter]);

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
            <CornerUpRight size={12} />
            <span>Link Equity & Traffic Retention</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            301 / 302 Redirect Manager
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Intercept old URLs, prevent 404 broken links, and preserve Google PageRank authority seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchRedirects}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-text-dim hover:text-white transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
          >
            <Plus size={14} />
            <span>Add New Redirect</span>
          </button>
        </div>
      </div>

      {/* Live Redirect Tester Box */}
      <div className="p-5 rounded-3xl bg-brand-navy/40 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
          <Play size={13} />
          <span>Test URL Resolution</span>
        </div>
        <form onSubmit={handleTestRedirect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testPath}
            onChange={e => setTestPath(e.target.value)}
            placeholder="Type any path e.g. /old-properties or /blog/dlf-guide..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
          />
          <button
            type="submit"
            disabled={testing}
            className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/15 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Destination'}
          </button>
        </form>

        {testResult && (
          <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
            {testResult.toPath ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>
                  Redirects ({testResult.statusCode}) to: <strong className="font-mono text-white">{testResult.toPath}</strong>
                </span>
              </div>
            ) : testResult.notFound ? (
              <div className="text-brand-text-dim">
                No custom redirect rule found for this path. Request will follow standard page routing.
              </div>
            ) : (
              <div className="text-rose-400">Error: {testResult.error}</div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by source path, target URL, or notes..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Redirects Table */}
      <div className="rounded-3xl bg-brand-navy/40 border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-brand-text-dim uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Source URL (From)</th>
                <th className="py-4 px-4">Target Destination (To)</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Hits</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Notes</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-text-dim">
                    <RefreshCw className="animate-spin inline-block mr-2 text-brand-gold" size={16} />
                    <span>Loading redirects...</span>
                  </td>
                </tr>
              ) : filteredRedirects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-text-dim">
                    No redirect rules found.
                  </td>
                </tr>
              ) : (
                filteredRedirects.map(redir => (
                  <tr key={redir._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-mono text-white font-medium">
                      {redir.fromPath}
                    </td>

                    <td className="py-4 px-4 font-mono text-brand-gold">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight size={12} className="text-gray-500 shrink-0" />
                        <span>{redir.toPath}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        redir.statusCode === 301 ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {redir.statusCode} {redir.statusCode === 301 ? 'Permanent' : 'Temporary'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-white">
                      {redir.hits || 0}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        redir.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-600/30 text-gray-400'
                      }`}>
                        {redir.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-brand-text-dim truncate max-w-xs">
                      {redir.notes || '—'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(redir)}
                          className="p-2 rounded-xl bg-white/5 text-brand-text-dim hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit Redirect"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(redir._id, redir.fromPath)}
                          className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete Redirect"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-brand-navy border border-white/20 shadow-2xl space-y-5">
            <h3 className="text-lg font-serif font-bold text-white">
              {editingRedirect ? 'Edit Redirect Rule' : 'Create 301/302 Redirect'}
            </h3>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Source Path (From) *
                </label>
                <input
                  type="text"
                  value={formData.fromPath}
                  onChange={e => setFormData({ ...formData, fromPath: e.target.value })}
                  placeholder="/old-landing-page"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Target Destination URL (To) *
                </label>
                <input
                  type="text"
                  value={formData.toPath}
                  onChange={e => setFormData({ ...formData, toPath: e.target.value })}
                  placeholder="/property/dlf-phase-1 or full https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white font-mono focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                    Status Code
                  </label>
                  <select
                    value={formData.statusCode}
                    onChange={e => setFormData({ ...formData, statusCode: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value={301}>301 Moved Permanently</option>
                    <option value={302}>302 Temporary Redirect</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                    Active State
                  </label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-text-dim uppercase tracking-wider mb-1.5">
                  Notes / Context
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Migration from old WordPress portal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white focus:outline-none focus:border-brand-gold"
                />
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
                  {submitting ? 'Saving...' : 'Save Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
