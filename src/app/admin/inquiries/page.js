"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Mail, Trash2, Inbox, Calendar, User, Phone, CheckCircle2, 
  RefreshCw, Search, Filter, AlertCircle, ExternalLink 
} from 'lucide-react';
import api from '@/services/api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getInquiries();
      if (res.success && res.data) {
        setInquiries(res.data);
      }
    } catch (err) {
      console.warn('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await api.getInquiries();
        if (!ignore && res.success && res.data) {
          setInquiries(res.data);
        }
      } catch (err) {
        console.warn('Error fetching inquiries:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete lead from "${email || 'this contact'}"?`)) return;

    try {
      setDeletingId(id);
      await api.deleteInquiry(id);
      setToast('Inquiry record deleted successfully');
      // Optimistic update
      setInquiries(prev => prev.filter(item => item._id !== id));
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const q = searchTerm.toLowerCase().trim();
      if (!q) return matchesType;

      const matchesSearch = 
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.propertyTitle && item.propertyTitle.toLowerCase().includes(q));

      return matchesType && matchesSearch;
    });
  }, [inquiries, typeFilter, searchTerm]);

  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      newsletter: inquiries.filter(i => i.type === 'newsletter').length,
      general_contact: inquiries.filter(i => i.type === 'general_contact' || i.type === 'contact_form').length,
      property_inquiry: inquiries.filter(i => i.type === 'property_inquiry' || i.type === 'consultation').length
    };
  }, [inquiries]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[10px] font-bold tracking-wider text-[#D09A16] uppercase mb-1.5">
            <Inbox size={12} />
            <span>Lead Captures</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time subscriber list and client inquiries captured from the website
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-[#D09A16]' : ''} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email, name, phone, or keyword..."
            className="w-full bg-[#0E1424] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D09A16] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0E1424] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === 'all'
                ? 'bg-[#D09A16] text-[#0A0E1A] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setTypeFilter('newsletter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === 'newsletter'
                ? 'bg-[#D09A16] text-[#0A0E1A] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Newsletter ({counts.newsletter})
          </button>
          <button
            onClick={() => setTypeFilter('general_contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === 'general_contact'
                ? 'bg-[#D09A16] text-[#0A0E1A] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct Inquiries ({counts.general_contact})
          </button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-2xl bg-[#0E1424] border border-white/[0.08] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#D09A16]" />
            <span>Fetching lead captures...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox size={20} />
            </div>
            <p className="text-sm font-semibold text-white">No inquiries found</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchTerm 
                ? `No leads matched your search for "${searchTerm}". Try a different keyword.` 
                : 'No customer inquiries recorded yet. Sign up for the newsletter on the website to see incoming leads.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
                <tr>
                  <th className="p-3.5 pl-5">Email & Contact</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Message / Details</th>
                  <th className="p-3.5">Received Date</th>
                  <th className="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {filteredInquiries.map((inq) => {
                  const isDeleting = deletingId === inq._id;
                  const typeLabel = (inq.type || 'newsletter').replace(/_/g, ' ');

                  return (
                    <tr key={inq._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 border border-[#D09A16]/20">
                            <Mail size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">{inq.email}</div>
                            {inq.name && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <User size={11} className="text-slate-500" />
                                <span>{inq.name}</span>
                              </div>
                            )}
                            {inq.phone && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone size={11} className="text-slate-500" />
                                <span>{inq.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          inq.type === 'newsletter'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : 'bg-[#D09A16]/10 border-[#D09A16]/30 text-[#E6C673]'
                        }`}>
                          {typeLabel}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-xs sm:max-w-md">
                        <p className="line-clamp-2 text-slate-300 text-xs">
                          {inq.message || inq.propertyTitle || (
                            <span className="text-slate-500 italic">Newsletter Subscription Lead</span>
                          )}
                        </p>
                      </td>

                      <td className="p-3.5 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={12} className="text-slate-500" />
                          <span>{new Date(inq.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <button
                          onClick={() => handleDelete(inq._id, inq.email)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Lead Record"
                        >
                          <Trash2 size={14} className={isDeleting ? 'animate-spin' : ''} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
