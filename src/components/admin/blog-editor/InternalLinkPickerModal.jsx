"use client";

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  ExternalLink,
  Link2,
  FileText,
  Building2,
  Globe,
  Compass,
  Check
} from 'lucide-react';

const STATIC_SITE_PAGES = [
  { title: 'Homepage / Flagship Portal', url: '/', type: 'Page' },
  { title: 'About Us & Advisory Credentials', url: '/about', type: 'Page' },
  { title: 'Contact & Consultation Desks', url: '/contact', type: 'Page' },
  { title: 'Luxury Properties Catalog', url: '/properties', type: 'Page' },
  { title: 'Residential Advisory Services', url: '/services/residential', type: 'Service' },
  { title: 'Commercial Assets & Leasing', url: '/services/commercial', type: 'Service' },
  { title: 'Industrial & Logistics Infrastructure', url: '/services/industrial', type: 'Service' },
  { title: 'Leadership & Senior Advisory Team', url: '/team', type: 'Page' },
  { title: 'Real Estate Research & Blog Archive', url: '/blog', type: 'Page' },
  { title: 'DLF Phase 1 Corridor', url: '/property/dlf-phase-1', type: 'Corridor' },
  { title: 'DLF Phase 2 Corridor', url: '/property/dlf-phase-2', type: 'Corridor' },
  { title: 'DLF Phase 3 Corridor', url: '/property/dlf-phase-3', type: 'Corridor' },
  { title: 'DLF Phase 4 Corridor', url: '/property/dlf-phase-4', type: 'Corridor' },
  { title: 'Sushant Lok Corridor', url: '/property/shushant-lok', type: 'Corridor' },
  { title: 'Udyog Vihar Cyber Corridor', url: '/property/udyog-vihar', type: 'Corridor' },
  { title: 'Terms of Service', url: '/terms', type: 'Legal' },
  { title: 'Privacy Policy', url: '/privacy-policy', type: 'Legal' },
];

export default function InternalLinkPickerModal({
  isOpen,
  onClose,
  onInsert,
  initialText = '',
  publishedBlogs = [],
  properties = []
}) {
  const [query, setQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [linkText, setLinkText] = useState(initialText || '');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [isNofollow, setIsNofollow] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, blogs, pages, properties, custom

  // Combine items into searchable list
  const allItems = useMemo(() => {
    const blogItems = (publishedBlogs || []).map(b => ({
      title: b.title,
      url: `/blog/${b.slug}`,
      type: 'Blog Article',
      badge: b.category?.name || 'Article'
    }));

    const propItems = (properties || []).map(p => ({
      title: p.title || p.name || 'Luxury Property',
      url: `/properties/${p.slug || p._id}`,
      type: 'Property Listing',
      badge: p.location?.name || p.corridor || 'Gurugram'
    }));

    return [...STATIC_SITE_PAGES, ...blogItems, ...propItems];
  }, [publishedBlogs, properties]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchType =
        activeTab === 'all' ||
        (activeTab === 'blogs' && item.type === 'Blog Article') ||
        (activeTab === 'pages' && (item.type === 'Page' || item.type === 'Service' || item.type === 'Corridor' || item.type === 'Legal')) ||
        (activeTab === 'properties' && item.type === 'Property Listing');

      const matchQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.url.toLowerCase().includes(query.toLowerCase());

      return matchType && matchQuery;
    });
  }, [allItems, activeTab, query]);

  if (!isOpen) return null;

  const handleApply = (e) => {
    if (e) e.preventDefault();
    if (!selectedUrl.trim()) return;

    onInsert({
      url: selectedUrl.trim(),
      text: linkText.trim() || selectedUrl.trim(),
      openInNewTab,
      isNofollow
    });
    onClose();
  };

  const handleSelectItem = (item) => {
    setSelectedUrl(item.url);
    if (!linkText.trim()) {
      setLinkText(item.title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-navy-deep border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center">
              <Link2 size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Insert Internal / External Link</h3>
              <p className="text-[11px] text-slate-400">Search pages, properties, articles, or paste a custom link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-4 sm:p-5 space-y-4 border-b border-white/10 bg-brand-obsidian/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Link Anchor Text
              </label>
              <input
                type="text"
                placeholder="Clickable anchor text..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Destination URL
              </label>
              <input
                type="text"
                placeholder="/properties/... or https://..."
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-brand-gold focus:ring-0"
              />
              <span>Open in new tab (`target="_blank"`)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isNofollow}
                onChange={(e) => setIsNofollow(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-brand-gold focus:ring-0"
              />
              <span>Add `rel="nofollow"` (Preserve PageRank equity)</span>
            </label>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across all 12 site pages, blog articles & properties..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-brand-gold outline-none"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'pages', label: 'Pages' },
                { id: 'blogs', label: 'Articles' },
                { id: 'properties', label: 'Properties' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === t.id
                      ? 'bg-brand-gold text-brand-navy-deep font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-64 rounded-xl border border-white/5 p-1 bg-black/20">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching site pages or properties found. Paste a custom destination URL above.
              </div>
            ) : (
              filteredItems.slice(0, 40).map((item, idx) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-brand-gold/15 border border-brand-gold/30 text-brand-gold'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.type === 'Blog Article' && <FileText size={14} className="text-brand-gold shrink-0" />}
                      {item.type === 'Property Listing' && <Building2 size={14} className="text-emerald-400 shrink-0" />}
                      {item.type === 'Corridor' && <Compass size={14} className="text-amber-400 shrink-0" />}
                      {item.type === 'Page' && <Globe size={14} className="text-blue-400 shrink-0" />}
                      {item.type === 'Service' && <Building2 size={14} className="text-indigo-400 shrink-0" />}
                      {item.type === 'Legal' && <FileText size={14} className="text-slate-400 shrink-0" />}

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{item.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                        {item.type}
                      </span>
                      {isSelected && <Check size={14} className="text-brand-gold" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-brand-obsidian/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!selectedUrl.trim()}
            className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40 cursor-pointer transition-all shadow-md"
          >
            Insert Link
          </button>
        </div>

      </div>
    </div>
  );
}

