"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Mail,
  Share2,
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { api } from '@/services/api';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function AdminAuthorCMS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetAuthorSlug = searchParams.get('author') || 'arun-sharma';

  const [authors, setAuthors] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(targetAuthorSlug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    jobTitle: '',
    bio: '',
    image: '',
    email: '',
    excludeFromSitemap: false,
    expertise: [],
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  // Fetch Authors from API
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await api.getAuthors();
      if (res && res.success && Array.isArray(res.data)) {
        setAuthors(res.data);

        // Find active author
        const current = res.data.find(a => a.slug === selectedSlug) || res.data[0];
        if (current) {
          setSelectedSlug(current.slug);
          setFormData({
            ...current,
            expertise: Array.isArray(current.expertise) ? current.expertise : [],
            socialProfiles: current.socialProfiles || { linkedin: '', twitter: '', facebook: '', instagram: '' }
          });
        }
      }
    } catch (err) {
      console.error('[AdminAuthorCMS] Fetch error:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load authors: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // When selected slug changes
  const handleSelectAuthor = (author) => {
    setIsCreatingNew(false);
    setSelectedSlug(author.slug);
    setFormData({
      ...author,
      expertise: Array.isArray(author.expertise) ? author.expertise : [],
      socialProfiles: author.socialProfiles || { linkedin: '', twitter: '', facebook: '', instagram: '' }
    });
    setStatusMsg({ type: '', text: '' });
  };

  const handleStartNewAuthor = () => {
    setIsCreatingNew(true);
    setSelectedSlug('new-author');
    setFormData({
      name: '',
      slug: '',
      jobTitle: 'Senior Luxury Property Consultant',
      bio: '',
      image: '',
      email: '',
      excludeFromSitemap: false,
      expertise: ['DLF Corridors', 'Luxury Builder Floors'],
      socialProfiles: { linkedin: '', twitter: '', facebook: '', instagram: '' }
    });
    setStatusMsg({ type: '', text: '' });
  };

  // Add specialty badge
  const handleAddSpecialty = (e) => {
    if (e) e.preventDefault();
    if (!newSpecialty.trim()) return;
    if (!formData.expertise.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newSpecialty.trim()]
      }));
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (idx) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== idx)
    }));
  };

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      if (!formData.name.trim()) {
        throw new Error('Author name is required');
      }

      let res;
      if (isCreatingNew) {
        res = await api.createAuthor(formData);
      } else {
        const idOrSlug = formData._id || formData.slug || selectedSlug;
        res = await api.updateAuthor(idOrSlug, formData);
      }

      if (res && res.success) {
        setStatusMsg({
          type: 'success',
          text: `Author profile "${formData.name}" successfully updated & live in MongoDB!`
        });
        setIsCreatingNew(false);
        // Refresh author list
        await fetchAuthors();
      } else {
        throw new Error(res?.message || 'Failed to update author');
      }
    } catch (err) {
      console.error('[AdminAuthorCMS] Save error:', err);
      setStatusMsg({
        type: 'error',
        text: err.message || 'Error saving author changes'
      });
    } finally {
      setSaving(false);
    }
  };

  const currentLiveUrl = `/blog/author/${formData.slug || selectedSlug}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <span>← All Pages Hub</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider">
              <Award size={12} />
              <span>Editorial Author Profile CMS</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {isCreatingNew ? 'Create New Editorial Author' : `${formData.name || 'Author'} Profile CMS`}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Update biography, portrait, designation, specialized credentials, and social channels. Changes immediately reflect on <span className="text-brand-gold font-mono">{currentLiveUrl}</span> and in all article <span className="text-brand-gold">AuthorCards</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCreatingNew && (
            <a
              href={currentLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={14} className="text-brand-gold" />
              <span>View Live Page</span>
            </a>
          )}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-obsidian text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Author Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {statusMsg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Author Selector Bar */}
      <div className="bg-brand-navy-surface/90 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto luxury-scrollbar py-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-2 pr-1 shrink-0 flex items-center gap-1.5">
            <User size={13} className="text-brand-gold" />
            <span>Select Author:</span>
          </span>

          {authors.map((auth) => {
            const isSelected = !isCreatingNew && selectedSlug === auth.slug;
            return (
              <button
                key={auth._id || auth.slug}
                onClick={() => handleSelectAuthor(auth)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-gold text-brand-obsidian shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-brand-navy shrink-0 relative">
                  {auth.image ? (
                    <Image src={auth.image} alt={auth.name} fill className="object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-[10px] text-white">
                      {auth.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <span>{auth.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-brand-obsidian/20 text-brand-obsidian' : 'bg-white/10 text-slate-400'
                }`}>
                  /blog/author/{auth.slug}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleStartNewAuthor}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            isCreatingNew
              ? 'bg-brand-gold text-brand-obsidian'
              : 'bg-white/5 hover:bg-white/10 text-brand-gold hover:text-white border border-brand-gold/30'
          }`}
        >
          <Plus size={14} />
          <span>Add New Contributor</span>
        </button>
      </div>

      {/* Main Grid: Form (7 cols) + Live AuthorCard Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: EDIT FORM (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Panel 1: Identity & Role */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <User size={16} className="text-brand-gold" />
              <h2 className="text-base font-serif font-bold text-white">
                Personal Identity &amp; Title
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: isCreatingNew
                        ? name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
                        : prev.slug
                    }));
                  }}
                  placeholder="e.g. Arun Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  URL Slug <span className="text-slate-400 font-mono text-[10px]">(/blog/author/slug)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().trim() }))}
                  placeholder="e.g. arun-sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-brand-gold text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Designation / Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g. Founder & Managing Director"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Direct Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. arun@saudagarproperties.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.excludeFromSitemap}
                    onChange={(e) => setFormData(prev => ({ ...prev, excludeFromSitemap: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-xs text-amber-300">Exclude from XML Sitemap</span>
                </label>
              </div>
            </div>
          </div>

          {/* Panel 2: Portrait / Avatar Photo */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Sparkles size={16} className="text-brand-gold" />
              <h2 className="text-base font-serif font-bold text-white">
                Author Portrait Photo
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Upload a professional high-resolution executive portrait (recommended 1:1 square ratio, min 400x400px).
            </p>

            <ImageUploadInput
              label="Author Executive Portrait"
              value={formData.image}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              folder="/saudagar-properties/authors"
              description="High-resolution headshot displayed on Author profile and all post AuthorCards"
              recommendedRatio="1:1 Square"
            />
          </div>

          {/* Panel 3: Narrative Bio */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <FileText size={16} className="text-brand-gold" />
              <h2 className="text-base font-serif font-bold text-white">
                Author Biography &amp; Narrative
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Detailed professional background, decades of corridor advisory expertise, and credentials.
            </p>

            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="With over 25 years of specialized luxury advisory across DLF Phase 1–5 and Golf Course Road..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* Panel 4: Specialized Real Estate Expertise Badges */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Briefcase size={16} className="text-brand-gold" />
              <h2 className="text-base font-serif font-bold text-white">
                Specialized Corridor &amp; Real Estate Expertise
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Key practice areas and micro-market specialties displayed as pill badges on the author card and profile.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSpecialty();
                  }
                }}
                placeholder="e.g. Freehold Builder Floors, Title Due Diligence"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-obsidian text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>Add Pill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-medium"
                >
                  <span>{exp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(idx)}
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.expertise.length === 0 && (
                <span className="text-xs text-slate-500 italic">No specialties added yet.</span>
              )}
            </div>
          </div>

          {/* Panel 5: Social Profiles */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Share2 size={16} className="text-brand-gold" />
              <h2 className="text-base font-serif font-bold text-white">
                Social Profiles &amp; Executive Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.socialProfiles?.linkedin || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialProfiles: { ...prev.socialProfiles, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/in/arun-sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={formData.socialProfiles?.twitter || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialProfiles: { ...prev.socialProfiles, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/arunsharma_dlf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME DUAL-CARD LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* Header Strip */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-2">
              <Sparkles size={14} />
              <span>Live Visual Previews</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Updates in real-time
            </span>
          </div>

          {/* PREVIEW 1: BLOG POST AUTHORCARD (Exact replica of AuthorCard.jsx) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-navy/15 shadow-2xl text-brand-navy">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-navy/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Preview: In-Article AuthorCard.jsx
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                /blog/[slug]
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-gold bg-brand-navy/5 shadow-sm">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt={formData.name || 'Author'}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-brand-navy">
                    {formData.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    <Award size={12} />
                    Editorial Expert
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-brand-navy mb-0.5">
                  <span className="hover:text-brand-gold transition-colors">
                    {formData.name || 'Author Name'}
                  </span>
                </h3>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-slate mb-2">
                  {formData.jobTitle || 'Senior Luxury Property Consultant'}
                </p>

                <p className="text-xs text-brand-slate leading-relaxed mb-3 line-clamp-3">
                  {formData.bio || 'Advising high-net-worth investors and families on prime real estate assets across DLF Gurugram.'}
                </p>

                {/* Specialties Badges */}
                {formData.expertise && formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {formData.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-brand-ivory border border-brand-navy/10 text-brand-navy"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social and Profile link */}
                <div className="flex items-center justify-between pt-2.5 border-t border-brand-navy/10 text-xs">
                  <div className="flex items-center gap-2.5 text-brand-slate">
                    {formData.socialProfiles?.linkedin && (
                      <span className="text-brand-navy hover:text-brand-gold transition-colors" title="LinkedIn">
                        <LinkedinIcon />
                      </span>
                    )}
                    {formData.socialProfiles?.twitter && (
                      <span className="text-brand-navy hover:text-brand-gold transition-colors" title="Twitter / X">
                        <TwitterIcon />
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors">
                    <span>All Articles</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW 2: AUTHOR PAGE BANNER (/blog/author/[slug]) */}
          <div className="bg-gradient-to-br from-brand-navy via-brand-text-dark to-brand-obsidian rounded-3xl p-6 border border-brand-gold/30 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Preview: Full Profile Page Header
              </span>
              <a
                href={currentLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1"
              >
                <span>{currentLiveUrl}</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold bg-white/10 shrink-0 shadow-md">
                {formData.image ? (
                  <Image src={formData.image} alt={formData.name || ''} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-xl font-bold text-brand-gold">
                    {formData.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block mb-1">
                  Senior Editorial Contributor
                </span>
                <h4 className="text-xl font-serif font-bold text-white mb-0.5">
                  {formData.name || 'Author Name'}
                </h4>
                <p className="text-xs text-slate-300 font-medium mb-2">
                  {formData.jobTitle || 'Executive Advisory Principal'}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {formData.bio || 'Advisory narrative...'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen size={12} className="text-brand-gold" />
                <span>Published Research Dossiers</span>
              </span>
              <span className="text-brand-gold font-bold">
                Live on Website
              </span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-brand-navy-surface/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Ready to Publish?</span>
              <span className="text-[11px] text-slate-400">Saves directly to MongoDB database</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-obsidian font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save size={13} />
              <span>Save Now</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
