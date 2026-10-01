import React from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import SectionHeader from '../common/SectionHeader';

export default function NavbarEditor({ formData, updateField }) {
  const links = formData.links || [];

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

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Globe}
        title="Navbar, Branding & Navigation Settings"
        subtitle="Manage the global logo, contact numbers, CTA button, and top navigation menu links"
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
          <h4 className="text-sm font-serif font-bold text-[#C5A880]">
            Navigation Links ({links.length})
          </h4>
          <button
            type="button"
            onClick={handleAddLink}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus size={13} />
            <span>Add Menu Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {links.map((link, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow w-full md:w-auto">
                <FormInput
                  label="Label"
                  value={link.label}
                  onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                />
                <FormInput
                  label="URL / Anchor"
                  value={link.href}
                  onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveLink(idx)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                title="Delete Link"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
