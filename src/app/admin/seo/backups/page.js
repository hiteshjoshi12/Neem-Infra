"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import api from '@/services/api';

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [toast, setToast] = useState('');
  const [backupLabel, setBackupLabel] = useState('');

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await api.getSeoBackups();
      if (res?.success) {
        setBackups(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load backups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async (e) => {
    if (e) e.preventDefault();
    try {
      setCreating(true);
      const res = await api.createSeoBackup(backupLabel || 'Manual Website SEO Snapshot');
      if (res?.success) {
        setToast('Website backup created successfully!');
        setBackupLabel('');

        // Trigger automatic browser download of the JSON payload
        if (res.data?.downloadPayload) {
          const blob = new Blob([JSON.stringify(res.data.downloadPayload, null, 2)], {
            type: 'application/json',
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = res.data.filename || `saudagar-backup-${Date.now()}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }

        await fetchBackups();
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreFromId = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore the website SEO configurations and pages to this snapshot? Current unsaved adjustments may be overwritten.')) {
      return;
    }

    try {
      setRestoring(true);
      const res = await api.restoreSeoBackup({ backupId });
      if (res?.success) {
        setToast('Website SEO configurations successfully restored from snapshot!');
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  const handleFileUploadRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!window.confirm(`Restore website from uploaded file "${file.name}"?`)) {
          return;
        }

        setRestoring(true);
        const res = await api.restoreSeoBackup({ snapshotData: json });
        if (res?.success) {
          setToast('Website successfully restored from uploaded JSON snapshot!');
          await fetchBackups();
          setTimeout(() => setToast(''), 4000);
        }
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      } finally {
        setRestoring(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
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
            <Database size={12} />
            <span>Disaster Recovery & Data Protection</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Automatic Website Backups & Snapshots
          </h1>
          <p className="text-xs text-brand-text-dim mt-0.5">
            Take instant full-fidelity snapshots of all SEO settings, pages, redirects, and blog taxonomies with 1-click restore.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBackups}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-text-dim hover:text-white transition-colors"
          title="Refresh List"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Instant Backup Creation Box */}
      <div className="p-6 rounded-3xl bg-brand-navy/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <HardDrive className="text-brand-gold" size={18} />
            <span>Take Instant Website Snapshot</span>
          </h2>
          <p className="text-xs text-brand-text-dim">
            Captures all database configurations into a timestamped JSON file and triggers immediate local download.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={backupLabel}
            onChange={e => setBackupLabel(e.target.value)}
            placeholder="Snapshot label e.g. Pre-campaign..."
            className="px-3.5 py-2.5 rounded-xl bg-brand-navy-deep border border-white/15 text-white text-xs focus:outline-none focus:border-brand-gold w-full sm:w-60"
          />

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={creating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shrink-0 disabled:opacity-50"
          >
            {creating ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
            <span>{creating ? 'Backing Up...' : 'Take Backup'}</span>
          </button>
        </div>
      </div>

      {/* Upload Restore Box */}
      <div className="p-5 rounded-2xl bg-white/5 border border-dashed border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-brand-gold">
            <Upload size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Restore from Local JSON Backup File</div>
            <div className="text-[11px] text-brand-text-dim">Upload an exported JSON snapshot to restore website configurations</div>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 cursor-pointer transition-colors border border-white/10">
          <Upload size={14} />
          <span>Upload JSON Snapshot</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileUploadRestore}
            className="hidden"
          />
        </label>
      </div>

      {/* Backup History Table */}
      <div className="rounded-3xl bg-brand-navy/40 border border-white/10 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Backup History Log ({backups.length})
          </h3>
          <span className="text-xs text-brand-text-dim">Stored in MongoDB Secure Archive</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-brand-text-dim uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Snapshot File & Label</th>
                <th className="py-4 px-4">Item Counts</th>
                <th className="py-4 px-4">File Size</th>
                <th className="py-4 px-4">Timestamp</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-text-dim">
                    <RefreshCw className="animate-spin inline-block mr-2 text-brand-gold" size={16} />
                    <span>Loading backup history...</span>
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-text-dim">
                    No backups created yet. Click &quot;Take Backup&quot; above to capture your first snapshot.
                  </td>
                </tr>
              ) : (
                backups.map(b => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{b.label}</div>
                      <div className="text-[11px] text-brand-text-dim font-mono mt-0.5">{b.filename}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-brand-gold">
                          {b.itemCounts?.pages || 0} Pages
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-blue-400">
                          {b.itemCounts?.redirects || 0} Redirects
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-emerald-400">
                          {b.itemCounts?.blogs || 0} Blogs
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-brand-text-dim">
                      {Math.round((b.sizeBytes || 0) / 1024)} KB
                    </td>

                    <td className="py-4 px-4 text-brand-text-dim">
                      {new Date(b.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestoreFromId(b._id)}
                        disabled={restoring}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold hover:bg-brand-gold/20 transition-all disabled:opacity-50"
                        title="Restore this snapshot"
                      >
                        <RefreshCw size={12} className={restoring ? 'animate-spin' : ''} />
                        <span>Restore</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
