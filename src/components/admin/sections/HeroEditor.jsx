import React from 'react';
import { Sparkles } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';
import ImageUploadInput from '../ImageUploadInput';

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
        subtitle="Manage hero headline, background video, fallback image, search console, and trending filters"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Top Gold Eyebrow Badge"
          placeholder="DLF Phase 1–4 • Sushant Lok • Golf Course Ext."
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Headline Line 1"
          placeholder="Gurgaon's Premier"
          value={formData.headlinePrefix}
          onChange={(e) => updateField('headlinePrefix', e.target.value)}
        />
        <FormInput
          label="Headline Italic (Gold Accent)"
          placeholder="Real Estate"
          value={formData.headlineHighlight}
          onChange={(e) => updateField('headlineHighlight', e.target.value)}
        />
        <FormInput
          label="Headline Line 2 Suffix"
          placeholder="Partner."
          value={formData.headlineSuffix}
          onChange={(e) => updateField('headlineSuffix', e.target.value)}
        />
        <FormInput
          label="Search Button Label"
          placeholder="Explore"
          value={formData.searchButtonText}
          onChange={(e) => updateField('searchButtonText', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Hero Subtitle / Description"
        rows={3}
        placeholder="Discover an exclusive portfolio of luxury builder floors..."
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      {/* Hero Media: Desktop Video, Mobile Video, & Fallback/Poster */}
      <div className="pt-6 border-t border-white/10 space-y-5">
        <div>
          <h4 className="text-sm font-serif font-bold text-brand-gold">
            Hero Media &amp; Streaming Background Videos
          </h4>
          <p className="text-xs text-slate-400">
            Upload cinematic MP4/WebM videos directly to ImageKit CDN for ultra-fast, zero-latency streaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadInput
            label="Desktop Background Video (MP4/WebM)"
            value={formData.videoUrl}
            onChange={(val) => updateField('videoUrl', val)}
            folder="/saudagar-properties/videos"
            acceptVideo={true}
            mediaType="video"
            description="Landscape (16:9) cinematic walkthrough video for desktop displays"
          />

          <ImageUploadInput
            label="Mobile Background Video (Optional MP4)"
            value={formData.videoMobileUrl}
            onChange={(val) => updateField('videoMobileUrl', val)}
            folder="/saudagar-properties/videos"
            acceptVideo={true}
            mediaType="video"
            description="Vertical (9:16) lightweight video stream optimized for mobile smartphones"
          />
        </div>

        <ImageUploadInput
          label="Hero Poster &amp; Fallback Image"
          value={formData.bgImage}
          onChange={(val) => updateField('bgImage', val)}
          folder="/saudagar-properties/hero"
          recommendedRatio="16:9"
          description="High-resolution poster displayed while video streams load, or for devices with reduced motion"
        />
      </div>

      {/* Search Console & Trending Filters */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h4 className="text-sm font-serif font-bold text-brand-gold">
          Search Console &amp; Quick-Filter Capsules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Search Input Placeholder"
            placeholder="Search DLF builder floors, villas..."
            value={formData.searchPlaceholder}
            onChange={(e) => updateField('searchPlaceholder', e.target.value)}
          />
          <FormInput
            label="Trending Capsule Label"
            placeholder="Trending:"
            value={formData.trendingLabel}
            onChange={(e) => updateField('trendingLabel', e.target.value)}
          />
        </div>

        <FormInput
          label="Trending Quick-Filter Tags (Comma-separated)"
          placeholder="DLF Phase 1 Floors, Sushant Lok Villas, Golf Course Ext., Under 5 Cr"
          value={trendingTagsString}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  );
}
