import React, { useState } from 'react';
import { Globe, Plus, Trash2, ChevronDown, ChevronRight, Layers, Link2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import SectionHeader from '../common/SectionHeader';

export default function NavbarEditor({ formData, updateField }) {
  const links = formData.links || [];
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  const toggleDropdownExpand = (index) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddLink = () => {
    updateField('links', [...links, { label: 'NEW LINK', href: '/' }]);
  };

  const handleRemoveLink = (index) => {
    updateField('links', links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, field, value) => {
    const copy = [...links];
    copy[index] = { ...copy[index], [field]: value };
    updateField('links', copy);
  };

  // Dropdown Sub-items management
  const handleAddDropdownItem = (linkIndex) => {
    const copy = [...links];
    const targetLink = { ...copy[linkIndex] };
    const currentDropdown = targetLink.dropdown ? [...targetLink.dropdown] : [];
    currentDropdown.push({
      label: 'New Corridor Location',
      href: '/blog/location/dlf-phase-1',
      desc: 'Prime residential locality'
    });
    targetLink.dropdown = currentDropdown;
    copy[linkIndex] = targetLink;
    updateField('links', copy);

    // Auto-expand this dropdown
    setExpandedDropdowns(prev => ({ ...prev, [linkIndex]: true }));
  };

  const handleRemoveDropdownItem = (linkIndex, subIndex) => {
    const copy = [...links];
    const targetLink = { ...copy[linkIndex] };
    if (!targetLink.dropdown) return;
    targetLink.dropdown = targetLink.dropdown.filter((_, i) => i !== subIndex);
    copy[linkIndex] = targetLink;
    updateField('links', copy);
  };

  const handleDropdownItemChange = (linkIndex, subIndex, field, value) => {
    const copy = [...links];
    const targetLink = { ...copy[linkIndex] };
    if (!targetLink.dropdown) return;
    const currentDropdown = [...targetLink.dropdown];
    currentDropdown[subIndex] = {
      ...currentDropdown[subIndex],
      [field]: value
    };
    targetLink.dropdown = currentDropdown;
    copy[linkIndex] = targetLink;
    updateField('links', copy);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Globe}
        title="Navbar, Branding & Navigation Settings"
        subtitle="Manage the global logo, contact numbers, CTA button, and top navigation menu links with interactive dropdown items"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Custom Logo Image URL (Leave blank to use default)"
          placeholder="https://example.com/logo.png"
          value={formData.logoUrl}
          onChange={(e) => updateField('logoUrl', e.target.value)}
        />
        <FormInput
          label="Display Phone Number"
          placeholder="+91 98112 21207"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <FormInput
          label="Dialable Raw Phone (tel: link)"
          placeholder="+919811221207"
          value={formData.phoneRaw}
          onChange={(e) => updateField('phoneRaw', e.target.value)}
        />
        <FormInput
          label="CTA Button Text"
          placeholder="Contact Us"
          value={formData.ctaText}
          onChange={(e) => updateField('ctaText', e.target.value)}
        />
        <FormInput
          label="CTA Button Link Destination"
          placeholder="/contact"
          value={formData.ctaHref}
          onChange={(e) => updateField('ctaHref', e.target.value)}
        />
        <FormInput
          label="Dropdown Corridors Badge Text"
          placeholder="Prime Corridors"
          value={formData.corridorsBadge}
          onChange={(e) => updateField('corridorsBadge', e.target.value)}
        />
        <FormInput
          label="Mobile Menu Header Brand Text"
          placeholder="Saudagar Properties"
          value={formData.mobileNavHeader}
          onChange={(e) => updateField('mobileNavHeader', e.target.value)}
        />
        <FormInput
          label="Mobile Consultation Card Title"
          placeholder="Private Consultation"
          value={formData.mobileConsultationTitle}
          onChange={(e) => updateField('mobileConsultationTitle', e.target.value)}
        />
      </div>

      {/* Navigation Links Array Manager */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-serif font-bold text-[#D09A16]">
              Navigation Menu Links ({links.length})
            </h4>
            <p className="text-xs text-slate-400">
              Configure top-level menu items and expand to manage their dropdown sub-items.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="px-3 py-1.5 rounded-lg bg-[#D09A16]/20 hover:bg-[#D09A16]/30 border border-[#D09A16]/40 text-xs text-[#D09A16] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus size={13} />
            <span>Add Menu Link</span>
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link, idx) => {
            const hasDropdown = Array.isArray(link.dropdown) && link.dropdown.length > 0;
            const isExpanded = !!expandedDropdowns[idx] || (hasDropdown && expandedDropdowns[idx] === undefined);

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 transition-colors hover:border-white/20"
              >
                {/* Main Link Controls */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow w-full md:w-auto">
                    <FormInput
                      label="Menu Label"
                      value={link.label}
                      onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                    />
                    <FormInput
                      label="URL / Anchor Destination"
                      value={link.href}
                      onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleDropdownExpand(idx)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        hasDropdown
                          ? 'bg-[#D09A16]/15 border-[#D09A16]/40 text-[#D09A16]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title="Manage Dropdown Sub-menu"
                    >
                      <Layers size={13} />
                      <span>Dropdown ({link.dropdown?.length || 0})</span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Dropdown Items Sub-Manager (Always visible when expanded or has items) */}
                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-[#0B0F19]/90 border border-[#D09A16]/20 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#D09A16]">
                        <Layers size={14} />
                        <span>Dropdown Items for &ldquo;{link.label || 'Link'}&rdquo;</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddDropdownItem(idx)}
                        className="px-2.5 py-1 rounded-lg bg-[#D09A16]/20 hover:bg-[#D09A16]/30 text-[#D09A16] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Dropdown Item</span>
                      </button>
                    </div>

                    {(!link.dropdown || link.dropdown.length === 0) ? (
                      <div className="py-3 text-center text-xs text-slate-500 italic">
                        No dropdown items configured for this menu link. Click &ldquo;Add Dropdown Item&rdquo; above to create sub-links.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {link.dropdown.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-grow w-full">
                              <div>
                                <label className="block text-[10px] text-slate-400 font-medium mb-1">Item Label</label>
                                <input
                                  type="text"
                                  value={sub.label || ''}
                                  onChange={(e) => handleDropdownItemChange(idx, sIdx, 'label', e.target.value)}
                                  placeholder="Property in DLF Phase 1"
                                  className="w-full bg-[#121724] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#D09A16]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 font-medium mb-1">Link URL</label>
                                <input
                                  type="text"
                                  value={sub.href || ''}
                                  onChange={(e) => handleDropdownItemChange(idx, sIdx, 'href', e.target.value)}
                                  placeholder="/blog/location/dlf-phase-1"
                                  className="w-full bg-[#121724] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#D09A16]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 font-medium mb-1">Subtitle / Description</label>
                                <input
                                  type="text"
                                  value={sub.desc || ''}
                                  onChange={(e) => handleDropdownItemChange(idx, sIdx, 'desc', e.target.value)}
                                  placeholder="Ultra-luxury villas & floors"
                                  className="w-full bg-[#121724] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#D09A16]"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveDropdownItem(idx, sIdx)}
                              className="p-1.5 mt-4 sm:mt-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs shrink-0 transition-colors cursor-pointer"
                              title="Delete Dropdown Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
