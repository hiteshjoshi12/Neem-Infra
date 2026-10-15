'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, Search, BookOpen, Compass, Building2, Briefcase, 
  Globe, ArrowRight, Check, Link as LinkIcon 
} from 'lucide-react';

const CORRIDOR_LINKS = [
  { name: 'DLF Phase 1 Luxury Properties', path: '/property/dlf-phase-1', desc: 'Builder floors, plots & kothis on Golf Course Rd' },
  { name: 'DLF Phase 2 Prime Residences', path: '/property/dlf-phase-2', desc: 'Heritage sector, Cyber City connectivity' },
  { name: 'DLF Phase 3 Independent Floors', path: '/property/dlf-phase-3', desc: 'High rental yield & immediate transit access' },
  { name: 'DLF Phase 4 Luxury Floors', path: '/property/dlf-phase-4', desc: 'Galleria Market & Supermart prime sector' },
  { name: 'Sushant Lok 1 Freehold Homes', path: '/property/shushant-lok', desc: 'Central Gurugram estate living' },
  { name: 'Udyog Vihar Commercial & Industrial', path: '/property/udyog-vihar', desc: 'Corporate hubs & warehouse parcels' },
];

const SERVICE_LINKS = [
  { name: 'Luxury Residential Services (Stilt+4 Floors)', path: '/services/residential', desc: 'End-to-end conveyance & builder floor due diligence' },
  { name: 'Commercial Corporate Office Advisory', path: '/services/commercial', desc: 'Grade-A leasing & pre-leased investment assets' },
  { name: 'Industrial & Warehousing Portfolio', path: '/services/industrial', desc: 'HSIIDC compliance & industrial plots' },
];

export default function InternalLinkModal({
  isOpen,
  onClose,
  onInsertLink,
  selectedText = '',
  publishedBlogs = [],
  properties = []
}) {
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' | 'corridors' | 'properties' | 'services' | 'custom'
  const [searchTerm, setSearchTerm] = useState('');
  const [customText, setCustomText] = useState(selectedText || '');
  const [customUrl, setCustomUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);



  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return publishedBlogs;
    const q = searchTerm.toLowerCase();
    return publishedBlogs.filter(b => 
      b.title?.toLowerCase().includes(q) || 
      b.slug?.toLowerCase().includes(q) ||
      b.category?.name?.toLowerCase().includes(q)
    );
  }, [publishedBlogs, searchTerm]);

  // Filtered corridors
  const filteredCorridors = useMemo(() => {
    if (!searchTerm) return CORRIDOR_LINKS;
    const q = searchTerm.toLowerCase();
    return CORRIDOR_LINKS.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  }, [searchTerm]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties;
    const q = searchTerm.toLowerCase();
    return properties.filter(p => 
      p.title?.toLowerCase().includes(q) || 
      p.location?.toLowerCase().includes(q) ||
      p.price?.toLowerCase().includes(q)
    );
  }, [properties, searchTerm]);

  const handleSelectLink = (title, url) => {
    const anchorText = selectedText.trim() ? selectedText.trim() : title;
    onInsertLink(`[${anchorText}](${url})`);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customUrl) return;
    const anchorText = customText.trim() || customUrl;
    onInsertLink(`[${anchorText}](${customUrl})`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E162B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#121B35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D09A16]/20 border border-[#D09A16]/30 flex items-center justify-center text-[#D09A16]">
              <LinkIcon size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Insert Internal Link</h3>
              <p className="text-[11px] text-slate-400">
                Connect your editorial text to existing articles, micro-markets, or luxury properties.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Text Notification */}
        {selectedText && (
          <div className="px-5 py-2 bg-[#D09A16]/10 border-b border-[#D09A16]/20 text-[11px] text-[#D09A16] flex items-center gap-2">
            <Check size={13} />
            <span>Linking highlighted text: <strong>&ldquo;{selectedText}&rdquo;</strong></span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-[#0E162B] overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blogs' ? 'bg-[#D09A16] text-[#0A0E17] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={13} />
            <span>Blog Articles ({publishedBlogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corridors')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'corridors' ? 'bg-[#D09A16] text-[#0A0E17] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>Corridors ({CORRIDOR_LINKS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'properties' ? 'bg-[#D09A16] text-[#0A0E17] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={13} />
            <span>Properties ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'services' ? 'bg-[#D09A16] text-[#0A0E17] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase size={13} />
            <span>Services</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-[#D09A16] text-[#0A0E17] font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe size={13} />
            <span>Custom URL</span>
          </button>
        </div>

        {/* Search Bar (Shown for lists) */}
        {activeTab !== 'custom' && (
          <div className="p-3 border-b border-white/10 bg-[#121B35]/60">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* 1. Blog Articles Tab */}
          {activeTab === 'blogs' && (
            <div className="space-y-2">
              {filteredBlogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching blog articles found.
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <button
                    key={blog._id || blog.slug}
                    type="button"
                    onClick={() => handleSelectLink(blog.title, `/blog/${blog.slug}`)}
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-[#D09A16]/10 border border-white/10 hover:border-[#D09A16]/50 text-left transition-all flex items-start justify-between gap-3 group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white group-hover:text-[#D09A16] transition-colors leading-snug">
                        {blog.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span className="font-mono text-[#D09A16]">/blog/{blog.slug}</span>
                        {blog.category?.name && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]">
                            {blog.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-[#D09A16] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                ))
              )}
            </div>
          )}

          {/* 2. Corridors Tab */}
          {activeTab === 'corridors' && (
            <div className="space-y-2">
              {filteredCorridors.map((corridor) => (
                <button
                  key={corridor.path}
                  type="button"
                  onClick={() => handleSelectLink(corridor.name, corridor.path)}
                  className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-[#D09A16]/10 border border-white/10 hover:border-[#D09A16]/50 text-left transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                      {corridor.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono text-[#D09A16]">
                      {corridor.path}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {corridor.desc}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-[#D09A16] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}

          {/* 3. Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-2">
              {filteredProperties.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No property listings available.
                </div>
              ) : (
                filteredProperties.map((prop) => {
                  const propSlug = prop.slug || prop._id;
                  const propUrl = `/properties/${propSlug}`;
                  return (
                    <button
                      key={prop._id || propSlug}
                      type="button"
                      onClick={() => handleSelectLink(prop.title, propUrl)}
                      className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-[#D09A16]/10 border border-white/10 hover:border-[#D09A16]/50 text-left transition-all flex items-start justify-between gap-3 group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                          {prop.title}
                        </div>
                        <div className="text-[11px] text-[#D09A16] font-mono mt-0.5">
                          {propUrl} • {prop.price || 'Price upon request'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {prop.location} • {prop.bhk || prop.propertyType || 'Luxury Residence'}
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-[#D09A16] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* 4. Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-2">
              {SERVICE_LINKS.map((serv) => (
                <button
                  key={serv.path}
                  type="button"
                  onClick={() => handleSelectLink(serv.name, serv.path)}
                  className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-[#D09A16]/10 border border-white/10 hover:border-[#D09A16]/50 text-left transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                      {serv.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono text-[#D09A16]">
                      {serv.path}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {serv.desc}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-[#D09A16] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}

          {/* 5. Custom URL Tab */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Anchor / Display Text
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Haryana Town and Country Planning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="e.g. https://tcpharyana.gov.in or /about"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D09A16]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D09A16] hover:bg-[#E5AA1E] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Insert Custom Link
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-white/10 bg-[#121B35] flex items-center justify-between text-xs text-slate-400">
          <span>Click any item to immediately insert formatted Markdown link</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
