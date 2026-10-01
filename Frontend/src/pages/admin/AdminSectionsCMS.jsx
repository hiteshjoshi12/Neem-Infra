import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Building,
  MapPin,
  Mail,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import api from '../../services/api';

const TABS = [
  { id: 'hero', label: '1. Hero' },
  { id: 'topConsultant', label: '2. Top Consultant' },
  { id: 'curatedCorridors', label: '3. Curated Corridors' },
  { id: 'services', label: '4. Our Services' },
  { id: 'whyChooseUs', label: '5. Why Choose Us' },
  { id: 'location', label: '6. Location & Map' },
  { id: 'newsletter', label: '7. Newsletter' }
];

export default function AdminSectionsCMS() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'hero';

  const { sections, refetch } = useCms();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Load current section data when activeTab or sections change
  useEffect(() => {
    if (sections[activeTab]) {
      setFormData(sections[activeTab]);
    } else {
      setFormData({});
    }
    setStatusMsg({ type: '', text: '' });
  }, [activeTab, sections]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await api.updateSection(activeTab, formData, `${activeTab.toUpperCase()} Section`);
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Section '${activeTab}' successfully updated and published!` });
        await refetch();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Failed to update section' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Error saving to backend' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase mb-2">
            <Layers size={12} />
            <span>Homepage Modular CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Section-by-Section Editor
          </h1>
          <p className="text-xs text-slate-400">
            Edit text, links, banners, and parameters for all homepage components
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(197,168,128,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
        >
          {saving ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>{saving ? 'Publishing...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C5A880] text-[#0C101A] shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Notification */}
      {statusMsg.text && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </motion.div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className="rounded-3xl bg-[#121724] border border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* ======================= TAB 1: HERO ======================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Hero Section Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Top Gold Tag/Badge
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => updateField('badge', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={formData.bgImage || ''}
                  onChange={(e) => updateField('bgImage', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Headline (White Text Prefix)
                </label>
                <input
                  type="text"
                  value={formData.headlinePrefix || ''}
                  onChange={(e) => updateField('headlinePrefix', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Headline Highlight (Gold Text)
                </label>
                <input
                  type="text"
                  value={formData.headlineHighlight || ''}
                  onChange={(e) => updateField('headlineHighlight', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl p-4 text-sm text-white outline-none"
              />
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-sm font-serif font-bold text-[#C5A880] mb-4">
                Floating Spotlight Card (Right Side on Hero)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Spotlight Title</label>
                  <input
                    type="text"
                    value={formData.spotlight?.title || ''}
                    onChange={(e) => updateField('spotlight.title', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Price Tag</label>
                  <input
                    type="text"
                    value={formData.spotlight?.price || ''}
                    onChange={(e) => updateField('spotlight.price', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Specs</label>
                  <input
                    type="text"
                    value={formData.spotlight?.specs || ''}
                    onChange={(e) => updateField('spotlight.specs', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Spotlight Image URL</label>
                  <input
                    type="text"
                    value={formData.spotlight?.image || ''}
                    onChange={(e) => updateField('spotlight.image', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: TOP CONSULTANT ======================= */}
        {activeTab === 'topConsultant' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Top Consultant in DLF Gurugram Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={formData.headlineMain || ''}
                  onChange={(e) => updateField('headlineMain', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Italic Subhead
                </label>
                <input
                  type="text"
                  value={formData.headlineItalic || ''}
                  onChange={(e) => updateField('headlineItalic', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Side Summary Quote
              </label>
              <textarea
                rows={2}
                value={formData.summaryQuote || ''}
                onChange={(e) => updateField('summaryQuote', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Card Paragraph 1
              </label>
              <textarea
                rows={3}
                value={formData.paragraph1 || ''}
                onChange={(e) => updateField('paragraph1', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Card Paragraph 2
              </label>
              <textarea
                rows={3}
                value={formData.paragraph2 || ''}
                onChange={(e) => updateField('paragraph2', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-sm font-serif font-bold text-[#C5A880] mb-4">
                Video Tour Showcase Card
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={formData.videoTour?.title || ''}
                    onChange={(e) => updateField('videoTour.title', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Image Poster URL</label>
                  <input
                    type="text"
                    value={formData.videoTour?.image || ''}
                    onChange={(e) => updateField('videoTour.image', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: CURATED CORRIDORS ======================= */}
        {activeTab === 'curatedCorridors' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Curated Corridors (Featured Properties) Section Copy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gold Badge
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => updateField('badge', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={formData.titleMain || ''}
                  onChange={(e) => updateField('titleMain', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Header Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
              <span className="font-bold text-[#C5A880]">Note:</span> To add, edit, or delete individual property cards shown in the 3D slider, visit the <a href="/admin/properties" className="text-[#C5A880] underline font-bold">Properties Manager</a>.
            </div>
          </div>
        )}

        {/* ======================= TAB 4: OUR SERVICES ======================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Our Services Section Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Header Description
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-serif font-bold text-[#C5A880]">
                25+ Years Experience Counter Spotlight
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Counter Years Count</label>
                  <input
                    type="number"
                    value={formData.experienceCounter?.yearsCount || 25}
                    onChange={(e) => updateField('experienceCounter.yearsCount', Number(e.target.value))}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formData.experienceCounter?.headline || ''}
                    onChange={(e) => updateField('experienceCounter.headline', e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.experienceCounter?.description || ''}
                  onChange={(e) => updateField('experienceCounter.description', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-serif font-bold text-[#C5A880]">
                DLF Property Callout Banner
              </h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.dlfCallout?.headline || ''}
                  onChange={(e) => updateField('dlfCallout.headline', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Banner Description</label>
                <textarea
                  rows={2}
                  value={formData.dlfCallout?.description || ''}
                  onChange={(e) => updateField('dlfCallout.description', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: WHY CHOOSE US ======================= */}
        {activeTab === 'whyChooseUs' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Why Choose Our Company Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Header Description
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-sm font-serif font-bold text-[#C5A880]">
                Featured Trust Card (Left Side)
              </h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                <input
                  type="text"
                  value={formData.trustCard?.title || ''}
                  onChange={(e) => updateField('trustCard.title', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Paragraph 1</label>
                <textarea
                  rows={2}
                  value={formData.trustCard?.p1 || ''}
                  onChange={(e) => updateField('trustCard.p1', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Paragraph 2</label>
                <textarea
                  rows={2}
                  value={formData.trustCard?.p2 || ''}
                  onChange={(e) => updateField('trustCard.p2', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 6: LOCATION & MAP ======================= */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Office Location, Contact & Map Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Company / Office Name
                </label>
                <input
                  type="text"
                  value={formData.officeName || ''}
                  onChange={(e) => updateField('officeName', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Physical Office Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Google Maps External Link
              </label>
              <input
                type="text"
                value={formData.gmapsUrl || ''}
                onChange={(e) => updateField('gmapsUrl', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Google Maps Iframe Embed URL
              </label>
              <input
                type="text"
                value={formData.embedUrl || ''}
                onChange={(e) => updateField('embedUrl', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        )}

        {/* ======================= TAB 7: NEWSLETTER ======================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Newsletter Subscription Banner Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.titleMain || ''}
                onChange={(e) => updateField('titleMain', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Privacy / Guarantee Subtext
              </label>
              <input
                type="text"
                value={formData.guaranteeText || ''}
                onChange={(e) => updateField('guaranteeText', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Button Bar */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish This Section'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
