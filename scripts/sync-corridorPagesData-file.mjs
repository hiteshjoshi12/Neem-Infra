import fs from 'fs';
import { CORRIDOR_PAGES_DATA } from '../src/constants/corridorPagesData.js';

const PLACE_IMAGES = {
  // DLF Phase 1
  'Golf Course Road': 'https://saudagarproperties.com/wp-content/uploads/2026/07/Luxury-Property-in-Gurgaon.jpg',
  'DLF Cyber City & Cyber Hub': 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',
  'IGI Airport Terminal 3': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  'Gurugram Center via NH-48': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  'New Delhi Railway Station': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
  'Capital City New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',

  // DLF Phase 2
  'Golf Course Road & MG Road': 'https://saudagarproperties.com/wp-content/uploads/2026/07/Luxury-Property-in-Gurgaon.jpg',
  'Top Schools (DPS DLF City & Montessori)': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'Ambience Mall & MGF Metropolitan': 'https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=800&q=80',
  'MG Road Metro Station': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',

  // DLF Phase 3
  'Ambience Mall & Biodiversity Park': 'https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=800&q=80',
  'DLF Cyber City': 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',
  'Metro & Highway Arterials': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Top Prominent Schools': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'Healthcare Super-Specialties': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',

  // DLF Phase 4
  'Galleria Market & Supermart 1 & 2': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'Horizon Centre & DLF Centre Court': 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',
  'Golf Course Road, MG Road & NH-48': 'https://saudagarproperties.com/wp-content/uploads/2026/07/Luxury-Property-in-Gurgaon.jpg',
  'IFFCO Chowk & Huda City Centre': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Max Hospital & Paras Hospital': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'The Shri Ram School & DPS': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'Workplaces in Cyber City & Udyog Vihar': 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',

  // Sushant Lok
  'DPS Sushant Lok & Leading Schools': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'Max, Paras & Fortis Hospitals': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'Leading Banking Institutions': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'HUDA City Centre Metro & MG Road': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Gold Souk Mall & Galleria': 'https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=800&q=80',

  // Udyog Vihar
  'Delhi-Gurgaon Border & Expressway': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  'Indira Gandhi International Airport': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  'DLF Phase 3 Rapid Metro & Sikandarpur': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Prominent NCR Connectivity & Expressways': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  'DLF Cyber City & Ambience Mall': 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg'
};

const CORRIDOR_CONFIGS = {
  'dlf-phase-1': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/01/Property-Dealers-in-Gurugram.png',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/03/4-BHK-Independent-Floor-DLF-Phase-1.jpg',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'DLF Phase 1 Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=DLF+Phase+1+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'dlf-phase-2': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/03/4-BHK-Independent-Floor-DLF-Phase-1.jpg',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/01/Property-Dealers-in-Gurugram.png',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'DLF Phase 2 Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=DLF+Phase+2+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'dlf-phase-3': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/03/Duplex-Villa-in-DLF-Phase-1.jpg',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/07/Luxury-Property-in-Gurgaon.jpg',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'DLF Phase 3 Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=DLF+Phase+3+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'dlf-phase-4': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/07/Luxury-Property-in-Gurgaon.jpg',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/03/Duplex-Villa-in-DLF-Phase-1.jpg',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'DLF Phase 4 Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=DLF+Phase+4+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'shushant-lok': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/03/4-BHK-Independent-Floor-DLF-Phase-1.jpg',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/01/Property-Dealers-in-Gurugram.png',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'Sushant Lok 1 Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=Sushant+Lok+1+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'udyog-vihar': {
    howWeHelpImage: 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',
    whyChooseImage: 'https://saudagarproperties.com/wp-content/uploads/2026/06/Office-Space-in-Gurgaon.jpg',
    mapShowcase: {
      badge: 'Geographic Master Coordinates',
      title: 'Udyog Vihar Master Location & Strategic Map',
      subtitle: 'Interactive Google Maps navigation paired with verified high-resolution master layout plan.',
      googleMapEmbed: 'https://maps.google.com/maps?q=Udyog+Vihar+Gurugram&t=&z=14&ie=UTF8&iwloc=&output=embed',
      staticMapImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'
    }
  }
};

const updatedData = {};

for (const [slug, data] of Object.entries(CORRIDOR_PAGES_DATA)) {
  const cfg = CORRIDOR_CONFIGS[slug] || {};
  const copy = JSON.parse(JSON.stringify(data));

  if (copy.nearestPlaces?.places) {
    copy.nearestPlaces.places = copy.nearestPlaces.places.map(p => ({
      ...p,
      image: p.image || PLACE_IMAGES[p.name] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    }));
  }

  copy.howWeHelp = {
    ...(copy.howWeHelp || {}),
    image: copy.howWeHelp?.image || cfg.howWeHelpImage
  };

  copy.whyChooseSaudagar = {
    ...(copy.whyChooseSaudagar || {}),
    image: copy.whyChooseSaudagar?.image || cfg.whyChooseImage
  };

  copy.mapShowcase = {
    ...cfg.mapShowcase,
    ...(copy.mapShowcase || {})
  };

  updatedData[slug] = copy;
}

const fileContent = `/**
 * Corridor Landing Pages Data
 * ============================================================================
 * Comprehensive content structure for dedicated micro-market property pages
 * (e.g. /property/dlf-phase-1, /property/dlf-phase-2, etc.)
 */

export const CORRIDOR_PAGES_DATA = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync('src/constants/corridorPagesData.js', fileContent, 'utf8');
console.log('✓ Successfully synchronized src/constants/corridorPagesData.js!');
