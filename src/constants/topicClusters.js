/**
 * Topic Clusters & Knowledge Graph Architecture
 * Primary Topic: Gurugram Real Estate
 */

export const TOPIC_CLUSTERS = [
  {
    id: 'dlf-gurugram',
    name: 'DLF Gurugram',
    slug: 'dlf-gurugram',
    description: 'Flagship freehold corridors, builder floors, and luxury residential phases across DLF Phase 1–5.',
    primaryPillarSlug: 'luxury-builder-floors-dlf-phase-1-5-guide',
    keywords: ['DLF Phase 1-5', 'DLF builder floors', 'freehold plots', 'Akashneem Marg', 'Golf Course Road']
  },
  {
    id: 'gurgaon-market-insights',
    name: 'Gurgaon Market Insights',
    slug: 'gurgaon-market-insights',
    description: 'Quantitative capital appreciation metrics, quarterly yield benchmarks, and micro-market growth trajectories.',
    primaryPillarSlug: 'gurugram-real-estate-market-outlook-2026',
    keywords: ['Gurugram real estate outlook', 'capital appreciation', 'rental yields', 'circle rates', 'institutional absorption']
  },
  {
    id: 'nri-property',
    name: 'NRI Property',
    slug: 'nri-property',
    description: 'Cross-border capital deployment, FEMA compliance, NRE/NRO banking channels, repatriation limits, and consular POA.',
    primaryPillarSlug: 'nri-investment-guide-fema-repatriation-luxury-real-estate',
    keywords: ['NRI property investment', 'FEMA guidelines', 'repatriation 1 million', 'Form 15CA 15CB', 'consular POA']
  },
  {
    id: 'commercial-real-estate',
    name: 'Commercial Real Estate',
    slug: 'commercial-real-estate',
    description: 'Grade-A office suites in Cyber City, pre-leased yields (7–9%), NNN lease structures, and blue-chip corporate covenants.',
    primaryPillarSlug: 'commercial-grade-a-office-spaces-cyber-city-yield-dynamics',
    keywords: ['pre-leased commercial', 'Cyber City office space', 'NNN lease', 'commercial cap rates', 'attornment of lease']
  },
  {
    id: 'locality-guides',
    name: 'Locality Guides',
    slug: 'locality-guides',
    description: 'Corridor-by-corridor head-to-head analysis between Golf Course Road, Golf Course Extension, Cyber City, and SPR.',
    primaryPillarSlug: 'golf-course-road-vs-golf-course-extension-comparison',
    keywords: ['Golf Course Road', 'Golf Course Extension', 'Billionaires Boulevard', 'SPR corridor', 'micro-market comparison']
  },
  {
    id: 'luxury-residential',
    name: 'Luxury Residential',
    slug: 'luxury-residential',
    description: 'Super-luxury penthouses, private sky mansions, cantilevered pools, double-height salons, and golf-facing estates.',
    primaryPillarSlug: 'bespoke-architectural-trends-ultra-luxury-penthouses-gurugram',
    keywords: ['luxury penthouses Gurugram', 'DLF Phase 5 penthouses', 'cantilevered pools', 'sky mansions', 'biophilic terraces']
  },
  {
    id: 'property-investment',
    name: 'Property Investment',
    slug: 'property-investment',
    description: 'Institutional and high-net-worth investment strategies, wealth preservation, and risk-adjusted capital modeling.',
    primaryPillarSlug: 'gurugram-real-estate-market-outlook-2026',
    keywords: ['real estate portfolio', 'wealth preservation', 'luxury asset allocation', 'Gurugram investment']
  },
  {
    id: 'property-buying-guides',
    name: 'Property Buying Guides',
    slug: 'property-buying-guides',
    description: 'Practical buyer advisory covering builder floor configurations, specification standards, and negotiation tactics.',
    primaryPillarSlug: 'luxury-builder-floors-dlf-phase-1-5-guide',
    keywords: ['builder floor buying guide', 'stilt parking allocation', 'terrace rights', 'DLF property buying']
  },
  {
    id: 'property-legal-process-guides',
    name: 'Property Legal/Process Guides',
    slug: 'property-legal-process-guides',
    description: 'DTCP Haryana stilt+4 zoning norms, MCG occupancy certificates, Jamabandi revenue searches, and conveyance registration.',
    primaryPillarSlug: 'luxury-builder-floors-dlf-phase-1-5-guide',
    keywords: ['DTCP Haryana', 'MCG occupancy certificate', 'Jamabandi title search', '30 year title chain']
  },
  {
    id: 'property-financing',
    name: 'Property Financing',
    slug: 'property-financing',
    description: 'High-value mortgage structuring, circle rate stamp duties in Haryana, and escrow mechanisms for luxury acquisitions.',
    primaryPillarSlug: 'nri-investment-guide-fema-repatriation-luxury-real-estate',
    keywords: ['property financing Gurugram', 'stamp duty Haryana', 'high value mortgages', 'escrow advisory']
  },
  {
    id: 'luxury-lifestyle-trends',
    name: 'Luxury Lifestyle / Real Estate Trends',
    slug: 'luxury-lifestyle-trends',
    description: 'Private concierge infrastructure, integrated smart automation, multi-tier security, and ultra-high-net-worth amenities.',
    primaryPillarSlug: 'bespoke-architectural-trends-ultra-luxury-penthouses-gurugram',
    keywords: ['luxury lifestyle Gurugram', 'smart homes DLF', 'acoustic glazing', 'private elevators']
  }
];

export function getTopicClusterById(id) {
  if (!id) return null;
  return TOPIC_CLUSTERS.find(c => c.id === id || c.slug === id) || null;
}
