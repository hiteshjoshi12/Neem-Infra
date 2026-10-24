import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: 'primary_business_profile',
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: 'Saudagar Properties',
    },
    legalName: {
      type: String,
      default: 'Saudagar Properties',
    },
    tagline: {
      type: String,
      default: 'Premier Real Estate Consultancy in DLF Gurugram',
    },
    shortDescription: {
      type: String,
      default:
        '25+ years of dedicated authority in luxury builder floors, independent villas & corporate assets in DLF Gurugram.',
    },
    fullDescription: {
      type: String,
      default:
        'Saudagar Properties is Gurugram’s premier real estate consultancy specializing in luxury builder floors, DLF Phase 1–5 villas, penthouses, and commercial spaces across Golf Course Road and Cyber City. Founded in 1999.',
    },
    primaryPhone: {
      type: String,
      default: '+91 97185 11207',
    },
    secondaryPhone: {
      type: String,
      default: '+91 98100 02447',
    },
    whatsappNumber: {
      type: String,
      default: '+91 97185 11207',
    },
    primaryEmail: {
      type: String,
      default: 'info@saudagarproperties.com',
    },
    secondaryEmail: {
      type: String,
      default: '',
    },
    address: {
      streetAddress: { type: String, default: 'DLF Phase 2, Sector 25' },
      addressLocality: { type: String, default: 'Gurugram' },
      addressRegion: { type: String, default: 'Haryana' },
      postalCode: { type: String, default: '122002' },
      addressCountry: { type: String, default: 'IN' },
    },
    geo: {
      latitude: { type: Number, default: 28.4815 },
      longitude: { type: Number, default: 77.0863 },
    },
    googleBusinessProfileUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Saudagar+Properties+DLF+Gurugram',
    },
    googlePlaceId: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/saudagarproperties' },
      instagram: { type: String, default: 'https://instagram.com/saudagarproperties' },
      linkedin: { type: String, default: 'https://linkedin.com/company/saudagarproperties' },
      youtube: { type: String, default: 'https://youtube.com/@saudagarproperties' },
      twitter: { type: String, default: '' },
    },
    operatingHours: {
      type: String,
      default: 'Mo-Sa 09:30-19:30',
    },
    foundingYear: {
      type: Number,
      default: 1999,
    },
    founders: [
      {
        name: { type: String, default: 'Raman Saudagar' },
        role: { type: String, default: 'Founder & Managing Director' },
      },
    ],
    reraNumber: {
      type: String,
      default: '',
      trim: true,
    },
    gstin: {
      type: String,
      default: '',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '/logo.png',
    },
    faviconUrl: {
      type: String,
      default: '/favicon.ico',
    },
    corridorsServed: [
      { type: String, default: 'DLF Phase 1' },
      { type: String, default: 'DLF Phase 2' },
      { type: String, default: 'DLF Phase 3' },
      { type: String, default: 'DLF Phase 4' },
      { type: String, default: 'DLF Phase 5' },
      { type: String, default: 'Golf Course Road' },
      { type: String, default: 'Sushant Lok 1' },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema);
