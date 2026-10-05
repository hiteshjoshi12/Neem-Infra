import React from 'react';
import { Share2, Plus, Trash2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function FooterEditor({ formData, updateField }) {
  const phones = formData.phones || [];
  const socialLinks = formData.socialLinks || [];

  const handleAddPhone = () => {
    updateField('phones', [...phones, { number: '+91 97185 11207', label: '(IND)', href: 'tel:+919718511207' }]);
  };

  const handleRemovePhone = (index) => {
    updateField('phones', phones.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (index, field, value) => {
    const copy = [...phones];
    copy[index] = { ...copy[index], [field]: value };
    updateField('phones', copy);
  };

  const handleAddSocial = () => {
    updateField('socialLinks', [...socialLinks, { platform: 'Instagram', href: 'https://instagram.com' }]);
  };

  const handleRemoveSocial = (index) => {
    updateField('socialLinks', socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index, field, value) => {
    const copy = [...socialLinks];
    copy[index] = { ...copy[index], [field]: value };
    updateField('socialLinks', copy);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Share2}
        title="Footer, Corporate Info & Social Links Settings"
        subtitle="Manage official footer branding, corporate email, addresses, social channels, and copyright notice"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Footer Logo URL (Leave blank for default)"
          placeholder="https://example.com/logo.png"
          value={formData.logoUrl}
          onChange={(e) => updateField('logoUrl', e.target.value)}
        />
        <FormInput
          type="email"
          label="Official Email"
          placeholder="Saudagar.Properties@Yahoo.In"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        <FormInput
          label="Office Address"
          placeholder="38, Akashneem Marg, DLF-II, Gurgaon-122002"
          value={formData.officeAddress}
          onChange={(e) => updateField('officeAddress', e.target.value)}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Call CTA Text & Direct Number
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FormInput
              placeholder="Call Now"
              value={formData.callCtaText}
              onChange={(e) => updateField('callCtaText', e.target.value)}
            />
            <FormInput
              placeholder="+919718511207"
              value={formData.callCtaPhone}
              onChange={(e) => updateField('callCtaPhone', e.target.value)}
            />
          </div>
        </div>
      </div>

      <FormTextarea
        label="About Saudagar Properties Paragraph"
        rows={3}
        value={formData.aboutText}
        onChange={(e) => updateField('aboutText', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <FormInput
          label="Copyright Notice"
          placeholder="Copyright © Saudagar Properties"
          value={formData.copyright}
          onChange={(e) => updateField('copyright', e.target.value)}
        />
        <FormInput
          label="Copyright Suffix"
          placeholder="All Right Reserved"
          value={formData.copyrightSuffix}
          onChange={(e) => updateField('copyrightSuffix', e.target.value)}
        />
      </div>

      {/* Direct Phone Numbers List */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-[#D09A16]">
            Direct Telephone Lines
          </h4>
          <button
            type="button"
            onClick={handleAddPhone}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Phone</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phones.map((ph, pIdx) => (
            <div key={pIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3">
              <div className="flex-grow space-y-1">
                <FormInput
                  value={ph.number}
                  onChange={(e) => handlePhoneChange(pIdx, 'number', e.target.value)}
                />
                <FormInput
                  placeholder="Tag: (IND)"
                  value={ph.label}
                  onChange={(e) => handlePhoneChange(pIdx, 'label', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemovePhone(pIdx)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-[#D09A16]">
            Social Media Profiles
          </h4>
          <button
            type="button"
            onClick={handleAddSocial}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Social</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {socialLinks.map((soc, sIdx) => (
            <div key={sIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <FormInput
                  placeholder="Platform (e.g. Instagram)"
                  value={soc.platform}
                  onChange={(e) => handleSocialChange(sIdx, 'platform', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(sIdx)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <FormInput
                placeholder="https://..."
                value={soc.href}
                onChange={(e) => handleSocialChange(sIdx, 'href', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
