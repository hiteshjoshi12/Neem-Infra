import React from 'react';
import { Sparkles } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function HeroEditor({ formData, updateField }) {
  const trendingTagsString = Array.isArray(formData.trendingTags)
    ? formData.trendingTags.join(', ')
    : formData.trendingTags || '';

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
    updateField('trendingTags', tags);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sparkles}
        title="Hero Section Settings"
        subtitle="Manage hero headline, background image, search bar options, trending tags, and floating spotlight property"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Top Gold Tag/Badge"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Background Image URL"
          value={formData.bgImage}
          onChange={(e) => updateField('bgImage', e.target.value)}
        />
        <FormInput
          label="Headline (White Text Prefix)"
          value={formData.headlinePrefix}
          onChange={(e) => updateField('headlinePrefix', e.target.value)}
        />
        <FormInput
          label="Headline Highlight (Gold Text)"
          value={formData.headlineHighlight}
          onChange={(e) => updateField('headlineHighlight', e.target.value)}
        />
        <FormInput
          label="Headline Suffix"
          value={formData.headlineSuffix}
          onChange={(e) => updateField('headlineSuffix', e.target.value)}
        />
        <FormInput
          label="Search Button Text"
          placeholder="Explore"
          value={formData.searchButtonText}
          onChange={(e) => updateField('searchButtonText', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Hero Subtitle Description"
        rows={3}
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      {/* Search Bar & Trending Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <FormInput
          label="Search Bar Placeholder"
          placeholder="Search builder floors, DLF villas..."
          value={formData.searchPlaceholder}
          onChange={(e) => updateField('searchPlaceholder', e.target.value)}
        />
        <FormInput
          label="Trending Pill Label"
          placeholder="Trending"
          value={formData.trendingLabel}
          onChange={(e) => updateField('trendingLabel', e.target.value)}
        />
      </div>

      <FormInput
        label="Trending Tags (Comma separated)"
        placeholder="DLF Phase 1 Floors, Sushant Lok Villas, Golf Course Ext., Under 5 Cr"
        value={trendingTagsString}
        onChange={handleTagsChange}
      />

      {/* Floating Spotlight Card */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-sm font-serif font-bold text-[#C5A880] mb-4">
          Floating Spotlight Card (Right Side on Hero)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Spotlight Badge"
            value={formData.spotlight?.badge}
            onChange={(e) => updateField('spotlight.badge', e.target.value)}
          />
          <FormInput
            label="Category Tag"
            value={formData.spotlight?.tag}
            onChange={(e) => updateField('spotlight.tag', e.target.value)}
          />
          <FormInput
            label="Title"
            value={formData.spotlight?.title}
            onChange={(e) => updateField('spotlight.title', e.target.value)}
          />
          <FormInput
            label="Price Tag"
            value={formData.spotlight?.price}
            onChange={(e) => updateField('spotlight.price', e.target.value)}
          />
          <FormInput
            label="Specs Details"
            value={formData.spotlight?.specs}
            onChange={(e) => updateField('spotlight.specs', e.target.value)}
          />
          <FormInput
            label="Enquire Button Phone"
            value={formData.spotlight?.phone}
            onChange={(e) => updateField('spotlight.phone', e.target.value)}
          />
          <div className="md:col-span-2">
            <FormInput
              label="Spotlight Image URL"
              value={formData.spotlight?.image}
              onChange={(e) => updateField('spotlight.image', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
