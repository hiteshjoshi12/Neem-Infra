import React from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function DlfCalloutEditor({ formData, updateField }) {
  const statsCards = formData.statsCards || [];

  const handleAddStat = () => {
    updateField('statsCards', [
      ...statsCards,
      { number: 50, suffix: '+', label: 'New Metric Stat', subtext: 'Excellence in Gurgaon real estate' }
    ]);
  };

  const handleRemoveStat = (index) => {
    updateField('statsCards', statsCards.filter((_, i) => i !== index));
  };

  const handleStatChange = (index, field, value) => {
    const copy = [...statsCards];
    copy[index] = { ...copy[index], [field]: value };
    updateField('statsCards', copy);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={TrendingUp}
        title="DLF Property Callout & 3D Animated Stats Banner"
        subtitle="Manage the DLF Gurgaon dedicated desk banner and 3D animated metric stat cards"
      />

      {/* Callout Banner Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Banner Badge Text"
          placeholder="DLF Gurgaon Dedicated Desk"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Phone Number (Display)"
          placeholder="+91 98112 21207"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <FormInput
          label="Dialable Phone (tel: link)"
          placeholder="+919811221207"
          value={formData.phoneRaw}
          onChange={(e) => updateField('phoneRaw', e.target.value)}
        />
        <FormInput
          label="Explore Button Text"
          placeholder="Explore Deals"
          value={formData.ctaText}
          onChange={(e) => updateField('ctaText', e.target.value)}
        />
        <div className="md:col-span-2">
          <FormInput
            label="Explore Deals Destination Link"
            placeholder="/contact"
            value={formData.ctaLink}
            onChange={(e) => updateField('ctaLink', e.target.value)}
          />
        </div>
      </div>

      <FormInput
        label="Banner Headline Title"
        placeholder="Are you looking for a property in DLF Gurgaon? Simply connect with us!"
        value={formData.headline}
        onChange={(e) => updateField('headline', e.target.value)}
      />

      <FormTextarea
        label="Banner Description Paragraph"
        rows={3}
        placeholder="Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties..."
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      {/* 3D Animated Metric Stats Cards List */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-serif font-bold text-[#D09A16]">
              3D Animated Metric Stat Cards ({statsCards.length})
            </h4>
            <p className="text-xs text-slate-400">
              Big dynamic numbers with animated counting displayed right above the DLF Callout card
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddStat}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Metric Stat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((stat, sIdx) => (
            <div key={sIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Stat #{sIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(sIdx)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  type="number"
                  label="Number"
                  value={stat.number ?? 0}
                  onChange={(e) => handleStatChange(sIdx, 'number', Number(e.target.value))}
                />
                <FormInput
                  label="Suffix"
                  placeholder="+"
                  value={stat.suffix}
                  onChange={(e) => handleStatChange(sIdx, 'suffix', e.target.value)}
                />
              </div>

              <FormInput
                label="Label"
                value={stat.label}
                onChange={(e) => handleStatChange(sIdx, 'label', e.target.value)}
              />

              <FormInput
                label="Subtext Description"
                value={stat.subtext}
                onChange={(e) => handleStatChange(sIdx, 'subtext', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
