"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, Inbox, Calendar, User, Phone, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '@/services/api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;

    try {
      await api.deleteInquiry(id);
      setToast('Inquiry deleted');
      await fetchInquiries();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">
            <Inbox size={12} />
            <span>Lead Captures & Subscriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Customer Inquiries & Newsletter Leads
          </h1>
          <p className="text-xs text-slate-400">
            Real-time subscriber list and client inquiries captured from the website
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Table / List */}
      <div className="rounded-3xl bg-[#121724] border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#D09A16]" />
            <span>Fetching lead captures...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No inquiries recorded yet. Sign up on the website newsletter or fill an inquiry form to test.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4 pl-6">Email & Contact</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Message / Details</th>
                  <th className="p-4">Received On</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#D09A16]/15 text-[#D09A16] flex items-center justify-center shrink-0">
                          <Mail size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{inq.email}</div>
                          {inq.phone && <div className="text-[11px] text-slate-400">{inq.phone}</div>}
                          {inq.name && <div className="text-[11px] text-slate-400">{inq.name}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-[#D09A16]">
                        {inq.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      {inq.message || inq.propertyTitle || <span className="text-slate-500 italic">Newsletter Subscription</span>}
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
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


