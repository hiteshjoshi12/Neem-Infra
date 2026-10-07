"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, Pencil, Trash2, CheckCircle2, FileText, BarChart3, 
  Layers, Link2, AlertTriangle, ShieldCheck, Compass, ArrowRight, RefreshCw,
  MapPin, ExternalLink, X, Search, Building2, Globe
} from 'lucide-react';
import api from '@/services/api';

export default function AdminBlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'locations' | 'audit'

  // Audit state
  const [auditReport, setAuditReport] = useState(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditFilter, setAuditFilter] = useState('all'); // 'all' | 'orphans' | 'deadends' | 'issues'

  // Locations state (Location-Based Market Intelligence)
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locSearchTerm, setLocSearchTerm] = useState('');
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLocId, setEditingLocId] = useState(null);
  const [submittingLoc, setSubmittingLoc] = useState(false);
  const [locFormData, setLocFormData] = useState({
    name: '',
    slug: '',
    description: '',
    avgPriceRange: '',
    typicalPlotSizes: '',
    inventoryType: '',
    keyStrengths: '',
    connectivity: '',
    seoTitle: '',
    seoDescription: ''
  });

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

  const fetchLocations = useCallback(async () => {
    try {
      setLoadingLocations(true);
      const res = await api.getLocations();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  const fetchAuditReport = useCallback(async () => {
    try {
      setLoadingAudit(true);
      const res = await fetch('/api/blog/orphan-report');
      const data = await res.json();
      if (data.success) {
        setAuditReport(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orphan audit report:', err);
    } finally {
      setLoadingAudit(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [blogRes, locRes] = await Promise.allSettled([
          api.getBlogs(),
          api.getLocations()
        ]);
        if (!ignore && blogRes.status === 'fulfilled' && blogRes.value?.success) {
          setBlogs(blogRes.value.data || []);
        }
        if (!ignore && locRes.status === 'fulfilled' && locRes.value?.success) {
          setLocations(locRes.value.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (activeTab !== 'audit' || auditReport) return;
    let ignore = false;
    async function loadAudit() {
      try {
        setLoadingAudit(true);
        const res = await fetch('/api/blog/orphan-report');
        const data = await res.json();
        if (!ignore && data.success) {
          setAuditReport(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orphan audit report:', err);
      } finally {
        if (!ignore) setLoadingAudit(false);
      }
    }
    loadAudit();
    return () => { ignore = true; };
  }, [activeTab, auditReport]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteBlog(id);
      setToast('Blog deleted successfully');
      await fetchBlogs();
      if (auditReport) await fetchAuditReport();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  // Location Handlers
  const handleOpenAddLocation = () => {
    setEditingLocId(null);
    setLocFormData({
      name: '',
      slug: '',
      description: '',
      avgPriceRange: '',
      typicalPlotSizes: '',
      inventoryType: '',
      keyStrengths: '',
      connectivity: '',
      seoTitle: '',
      seoDescription: ''
    });
    setIsLocModalOpen(true);
  };

  const handleOpenEditLocation = (loc) => {
    setEditingLocId(loc._id);
    setLocFormData({
      name: loc.name || '',
      slug: loc.slug || '',
      description: loc.description || '',
      avgPriceRange: loc.marketOverview?.avgPriceRange || '',
      typicalPlotSizes: (loc.marketOverview?.typicalPlotSizes || []).join(', '),
      inventoryType: loc.marketOverview?.inventoryType || '',
      keyStrengths: (loc.marketOverview?.keyStrengths || []).join(', '),
      connectivity: (loc.marketOverview?.connectivity || []).join(', '),
      seoTitle: loc.seoTitle || '',
      seoDescription: loc.seoDescription || ''
    });
    setIsLocModalOpen(true);
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locFormData.name.trim()) {
      alert('Please provide a corridor name.');
      return;
    }

    setSubmittingLoc(true);
    try {
      const payload = {
        name: locFormData.name.trim(),
        slug: locFormData.slug.trim() || undefined,
        description: locFormData.description.trim(),
        marketOverview: {
          avgPriceRange: locFormData.avgPriceRange.trim(),
          typicalPlotSizes: locFormData.typicalPlotSizes
            ? locFormData.typicalPlotSizes.split(',').map(s => s.trim()).filter(Boolean)
            : [],
          inventoryType: locFormData.inventoryType.trim(),
          keyStrengths: locFormData.keyStrengths
            ? locFormData.keyStrengths.split(',').map(s => s.trim()).filter(Boolean)
            : [],
          connectivity: locFormData.connectivity
            ? locFormData.connectivity.split(',').map(s => s.trim()).filter(Boolean)
            : []
        },
        seoTitle: locFormData.seoTitle.trim() || undefined,
        seoDescription: locFormData.seoDescription.trim() || undefined
      };

      if (editingLocId) {
        await api.updateLocation(editingLocId, payload);
        setToast(`Corridor "${payload.name}" updated successfully!`);
      } else {
        await api.createLocation(payload);
        setToast(`New corridor "${payload.name}" created successfully!`);
      }

      setIsLocModalOpen(false);
      await fetchLocations();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save location corridor');
    } finally {
      setSubmittingLoc(false);
    }
  };

  const handleDeleteLocation = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete corridor "${name}"? This will remove its presence from the Location-Based Market Intelligence section.`)) return;

    try {
      await api.deleteLocation(id);
      setToast(`Corridor "${name}" deleted successfully`);
      await fetchLocations();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete corridor');
    }
  };

  const metrics = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
    scheduled: blogs.filter(b => b.status === 'scheduled').length,
    archived: blogs.filter(b => b.status === 'archived').length,
  };

  const filteredLocations = useMemo(() => {
    if (!locSearchTerm.trim()) return locations;
    const q = locSearchTerm.toLowerCase().trim();
    return locations.filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.slug && l.slug.toLowerCase().includes(q)) ||
      (l.description && l.description.toLowerCase().includes(q))
    );
  }, [locations, locSearchTerm]);

  const filteredAuditArticles = auditReport?.articles?.filter(art => {
    if (auditFilter === 'orphans') return art.isOrphan;
    if (auditFilter === 'deadends') return art.isDeadEnd;
    if (auditFilter === 'issues') return art.issues?.length > 0;
    return true;
  }) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[10px] font-bold tracking-wider text-[#D09A16] uppercase mb-1.5">
            <Layers size={12} />
            <span>Topical Authority & Corridors</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Blog & Content Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage published articles, micro-market intelligence corridors, and topical authority clusters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/seo"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-xs flex items-center justify-center gap-2 transition-all"
          >
            <BarChart3 size={14} className="text-[#D09A16]" />
            <span>SEO Dashboard</span>
          </Link>

          {activeTab === 'locations' ? (
            <button
              onClick={handleOpenAddLocation}
              className="px-4 py-2 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>New Corridor</span>
            </button>
          ) : (
            <Link
              href="/admin/blog/new"
              className="px-4 py-2 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Plus size={15} />
              <span>New Article</span>
            </Link>
          )}
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-[#D09A16] text-[#0E162B] shadow-sm'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <FileText size={14} />
          <span>All Articles ({metrics.total})</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-[#D09A16] text-[#0E162B] shadow-sm'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <MapPin size={14} />
          <span>Location Corridors ({locations.length})</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/20">
            Market Intelligence
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-[#D09A16] text-[#0E162B] shadow-sm'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Link2 size={14} />
          <span>Topical & Orphan Audit</span>
          {auditReport && auditReport.summary?.totalOrphans > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300 text-[10px]">
              {auditReport.summary.totalOrphans}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
         TAB 1: ARTICLES
      ========================================================================= */}
      {activeTab === 'articles' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08] flex flex-col gap-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Posts</span>
              <span className="text-2xl text-white font-serif">{metrics.total}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08] flex flex-col gap-0.5">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Published</span>
              <span className="text-2xl text-white font-serif">{metrics.published}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08] flex flex-col gap-0.5">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Drafts</span>
              <span className="text-2xl text-white font-serif">{metrics.drafts}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08] flex flex-col gap-0.5">
              <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Scheduled</span>
              <span className="text-2xl text-white font-serif">{metrics.scheduled}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08] flex flex-col gap-0.5">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Archived</span>
              <span className="text-2xl text-white font-serif">{metrics.archived}</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#0E1424] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">Loading articles...</div>
            ) : blogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">No articles found. Create one!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/[0.02] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Title & Slug</th>
                      <th className="px-5 py-3.5 font-semibold">Pillar / Cluster</th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                      <th className="px-5 py-3.5 font-semibold">Author</th>
                      <th className="px-5 py-3.5 font-semibold">Updated</th>
                      <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {blogs.map(blog => (
                      <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-serif font-bold text-white mb-0.5">{blog.title}</p>
                          <p className="text-[10px] text-slate-500">/{blog.slug}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {blog.isPillar ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D09A16]/20 text-[#D09A16] border border-[#D09A16]/30">
                              Master Pillar
                            </span>
                          ) : blog.parentPillarSlug ? (
                            <span className="text-[10px] text-slate-400">
                              Child of: <span className="text-[#D09A16]">/{blog.parentPillarSlug}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Standard Post</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            blog.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                            blog.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                            blog.status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">
                          {blog.author?.name || 'Unassigned'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">
                          {new Date(blog.updatedAt || blog.publishedAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/admin/blog/${blog._id}/edit`} className="p-2 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0E162B] text-slate-300 transition-colors">
                              <Pencil size={13} />
                            </Link>
                            <button onClick={() => handleDelete(blog._id, blog.title)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 transition-colors cursor-pointer">
                              <Trash2 size={13} />
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
        </>
      )}

      {/* =========================================================================
         TAB 2: LOCATION CORRIDORS (LOCATION-BASED MARKET INTELLIGENCE)
      ========================================================================= */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          {/* Section Description & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E1424] border border-white/[0.08]">
            <div className="space-y-1">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <MapPin size={16} className="text-[#D09A16]" />
                <span>Location-Based Market Intelligence Hub</span>
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                This section directly manages the micro-market cards shown under <strong className="text-white">&ldquo;Location-Based Market Intelligence&rdquo;</strong> on the public <Link href="/blog" target="_blank" className="text-[#D09A16] underline">/blog</Link> page, as well as the full corridor landing pages (<span className="text-slate-300">/blog/location/[slug]</span>).
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={locSearchTerm}
                onChange={(e) => setLocSearchTerm(e.target.value)}
                placeholder="Search corridors..."
                className="w-full bg-[#090D16] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D09A16]"
              />
            </div>
          </div>

          {/* Corridors Grid */}
          {loadingLocations ? (
            <div className="p-16 text-center text-slate-400 text-xs">Loading corridor entities...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0E1424] border border-white/[0.08] space-y-2">
              <p className="text-sm font-semibold text-white">No location corridors match your search.</p>
              <p className="text-xs text-slate-400">Click &ldquo;New Corridor&rdquo; above to create a micro-market profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((loc) => {
                const articleCount = blogs.filter(
                  b => b.locationSlugs?.includes(loc.slug) || b.location?.some(l => l.slug === loc.slug || l._id === loc._id)
                ).length;

                return (
                  <div
                    key={loc._id || loc.slug}
                    className="p-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] hover:border-[#D09A16]/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 border border-[#D09A16]/25 text-[#D09A16] flex items-center justify-center shrink-0">
                            <MapPin size={15} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-white text-base truncate group-hover:text-[#D09A16] transition-colors">
                              {loc.name}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">
                              /blog/location/{loc.slug}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300 shrink-0">
                          {articleCount} {articleCount === 1 ? 'Article' : 'Articles'}
                        </span>
                      </div>

                      {/* Description displayed on the blog card */}
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                        {loc.description || <span className="italic text-slate-500">No corridor description set. Click Edit to add one.</span>}
                      </p>

                      {/* Key stats badges */}
                      <div className="pt-2 border-t border-white/[0.04] space-y-1.5 text-[11px]">
                        {loc.marketOverview?.avgPriceRange && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Price Benchmark:</span>
                            <span className="font-semibold text-[#E6C673]">{loc.marketOverview.avgPriceRange}</span>
                          </div>
                        )}
                        {loc.marketOverview?.typicalPlotSizes && loc.marketOverview.typicalPlotSizes.length > 0 && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Plot Sizes:</span>
                            <span className="text-slate-200 truncate max-w-[160px]">{loc.marketOverview.typicalPlotSizes.join(', ')}</span>
                          </div>
                        )}
                        {loc.marketOverview?.inventoryType && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Inventory:</span>
                            <span className="text-slate-200 truncate max-w-[160px]">{loc.marketOverview.inventoryType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <Link
                        href={`/blog/location/${loc.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        <span>Live Page</span>
                        <ExternalLink size={11} className="text-[#D09A16]" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditLocation(loc)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0E162B] text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc._id, loc.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors cursor-pointer"
                          title="Delete Corridor"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         TAB 3: TOPICAL AUTHORITY & ORPHAN AUDIT
      ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-white mb-0.5">
                Knowledge Graph & Orphan Articles Audit
              </h2>
              <p className="text-xs text-slate-400">
                Live audit of inbound internal links, outbound cross-references, and taxonomy relationships.
              </p>
            </div>
            <button
              onClick={fetchAuditReport}
              disabled={loadingAudit}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={loadingAudit ? 'animate-spin' : ''} />
              <span>Re-run Audit</span>
            </button>
          </div>

          {loadingAudit ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Analyzing internal link graph and computing orphan nodes...
            </div>
          ) : auditReport ? (
            <>
              {/* Audit Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08]">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Total Crawled</span>
                  <p className="text-2xl font-serif text-white">{auditReport.summary.totalArticles}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08]">
                  <span className="text-red-400 text-[10px] font-bold uppercase">Orphan Articles</span>
                  <p className="text-2xl font-serif text-red-400">{auditReport.summary.totalOrphans}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08]">
                  <span className="text-amber-400 text-[10px] font-bold uppercase">Dead Ends</span>
                  <p className="text-2xl font-serif text-amber-400">{auditReport.summary.totalDeadEnds}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-white/[0.08]">
                  <span className="text-blue-400 text-[10px] font-bold uppercase">Internal Links</span>
                  <p className="text-2xl font-serif text-blue-400">{auditReport.summary.totalInternalLinks}</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2">
                {['all', 'orphans', 'deadends', 'issues'].map(f => (
                  <button
                    key={f}
                    onClick={() => setAuditFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                      auditFilter === f ? 'bg-[#D09A16] text-[#0E162B]' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="bg-[#0E1424] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/[0.02] border-b border-white/[0.08] text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Article</th>
                        <th className="px-5 py-3 text-center">Inbound</th>
                        <th className="px-5 py-3 text-center">Outbound</th>
                        <th className="px-5 py-3">Status / Issues</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredAuditArticles.map(art => (
                        <tr key={art.slug} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-3">
                            <p className="font-serif font-bold text-white">{art.title}</p>
                            <p className="text-[10px] text-slate-500">/{art.slug}</p>
                          </td>
                          <td className="px-5 py-3 text-center font-bold text-white">{art.inboundCount}</td>
                          <td className="px-5 py-3 text-center font-bold text-white">{art.outboundCount}</td>
                          <td className="px-5 py-3">
                            {art.issues?.length === 0 ? (
                              <span className="text-emerald-400 text-xs">Healthy</span>
                            ) : (
                              <div className="space-y-1">
                                {art.issues.map((iss, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded mr-1">
                                    <AlertTriangle size={11} />
                                    <span>{iss}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              href={`/admin/blog/${art._id}/edit`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0E162B] text-slate-300 transition-colors text-[11px] font-bold"
                            >
                              <span>Edit</span>
                              <ArrowRight size={11} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit report available. Click &ldquo;Re-run Audit&rdquo; above.
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         CORRIDOR LOCATION EDIT / CREATE MODAL
      ========================================================================= */}
      {isLocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0E1424] border border-white/[0.1] rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-[#D09A16]" />
                  <span>{editingLocId ? 'Edit Location Corridor' : 'Create Location Corridor'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Updates visible data in &ldquo;Location-Based Market Intelligence&rdquo; and dedicated corridor pages
                </p>
              </div>
              <button
                onClick={() => setIsLocModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Corridor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={locFormData.name}
                    onChange={(e) => setLocFormData({ ...locFormData, name: e.target.value })}
                    placeholder="e.g. DLF Phase 2"
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={locFormData.slug}
                    onChange={(e) => setLocFormData({ ...locFormData, slug: e.target.value })}
                    placeholder="e.g. dlf-phase-2 (auto-generated if empty)"
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Corridor Description * (Displayed on Blog Card)
                </label>
                <textarea
                  rows={3}
                  required
                  value={locFormData.description}
                  onChange={(e) => setLocFormData({ ...locFormData, description: e.target.value })}
                  placeholder="Concise micro-market overview explaining zoning, luxury floors, and capital growth drivers..."
                  className="w-full bg-[#090D16] border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D09A16] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Avg Price Benchmark
                  </label>
                  <input
                    type="text"
                    value={locFormData.avgPriceRange}
                    onChange={(e) => setLocFormData({ ...locFormData, avgPriceRange: e.target.value })}
                    placeholder="e.g. ₹4.2 Cr – ₹16.5 Cr"
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Typical Plot Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={locFormData.typicalPlotSizes}
                    onChange={(e) => setLocFormData({ ...locFormData, typicalPlotSizes: e.target.value })}
                    placeholder="215, 300, 500, 1000 Sq. Yds"
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inventory Types
                </label>
                <input
                  type="text"
                  value={locFormData.inventoryType}
                  onChange={(e) => setLocFormData({ ...locFormData, inventoryType: e.target.value })}
                  placeholder="e.g. Luxury Independent Floors, Freehold Plots"
                  className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={locFormData.seoTitle}
                    onChange={(e) => setLocFormData({ ...locFormData, seoTitle: e.target.value })}
                    placeholder="e.g. DLF Phase 2 Real Estate Guide"
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    value={locFormData.seoDescription}
                    onChange={(e) => setLocFormData({ ...locFormData, seoDescription: e.target.value })}
                    placeholder="Meta description for search engines..."
                    className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D09A16]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLocModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLoc}
                  className="px-5 py-2 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submittingLoc ? 'Saving...' : editingLocId ? 'Update Corridor' : 'Create Corridor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
