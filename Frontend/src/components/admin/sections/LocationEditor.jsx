import React from 'react';
import { MapPin } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function LocationEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={MapPin}
        title="Office Location, Contact & Interactive Map Settings"
        subtitle="Manage the physical office address, action button labels, Google Maps link, and iframe embed"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Section Badge"
          placeholder="Visit Our Office"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Office Pin Badge"
          placeholder="Headquarters"
          value={formData.officeBadge}
          onChange={(e) => updateField('officeBadge', e.target.value)}
        />
        <FormInput
          label="Title Main"
          placeholder="Where to"
          value={formData.titleMain}
          onChange={(e) => updateField('titleMain', e.target.value)}
        />
        <FormInput
          label="Title Italic"
          placeholder="Find Us"
          value={formData.titleItalic}
          onChange={(e) => updateField('titleItalic', e.target.value)}
        />
        <FormInput
          label="Company / Office Name"
          placeholder="Saudagar Properties Pvt. Ltd"
          value={formData.officeName}
          onChange={(e) => updateField('officeName', e.target.value)}
        />
        <FormInput
          label="Physical Office Address"
          placeholder="38, Akashneem Marg, DLF Phase 2, Gurugram"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
        />
        <FormInput
          label="Open Maps Button Text"
          placeholder="Open in Google Maps"
          value={formData.openMapsText}
          onChange={(e) => updateField('openMapsText', e.target.value)}
        />
        <FormInput
          label="Get Directions Button Text"
          placeholder="Get Directions"
          value={formData.directionsText}
          onChange={(e) => updateField('directionsText', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Header Description"
        rows={2}
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      <FormInput
        label="Google Maps Link (Opens on click)"
        value={formData.gmapsUrl}
        onChange={(e) => updateField('gmapsUrl', e.target.value)}
      />

      <FormInput
        label="Google Maps Iframe Embed URL (Renders interactive map)"
        value={formData.embedUrl}
        onChange={(e) => updateField('embedUrl', e.target.value)}
      />
    </div>
  );
}
