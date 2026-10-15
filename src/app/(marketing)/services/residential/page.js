import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import ResidentialServiceView from '@/components/services/ResidentialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const revalidate = 300; // Cache static payload for fast navigation

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/residential'];
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: `${SITE_URL}${seoData.canonical}`,
    },
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: `${SITE_URL}${seoData.canonical}`,
      type: 'website',
      siteName: SITE_NAME,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Luxury Residential Real Estate in DLF Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

const RESIDENTIAL_TYPOLOGIES = [
  {
    title: 'Luxury Builder Floors (Stilt + 4)',
    locations: 'DLF Phase 1, 2, 3, 4 & Sushant Lok',
    specs: '4 BHK • 300 to 500 Sq. Yds • Private Lift & Terrace',
    price: '₹4.50 Cr – ₹12.00 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury Builder Floors in DLF Phase 1 to 4 Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Built-Up Area', val: '2,800 - 4,500 Sq. Ft.' },
      { label: 'Stilt Parking', val: '2 - 3 Dedicated Covered Bays' },
      { label: 'Ownership', val: 'Freehold with Independent Registry' },
      { label: 'Terrace Rights', val: 'Exclusive 4th Floor / Pro-rata' }
    ],
    features: ['Private OTIS/Kone elevator with access control', 'Separate staff quarters with private washroom', 'Gated sector security with 24/7 boom barriers', 'Zero society maintenance disputes']
  },
  {
    title: 'Independent Kothis & Bespoke Mansions',
    locations: 'DLF Phase 1 & 2 Prime Avenues',
    specs: '500 to 1,000 Sq. Yds • Bespoke Architecture',
    price: '₹14.00 Cr – ₹35.00 Cr',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    alt: 'Independent Kothis and Mansions in DLF Phase 1 and 2 - Saudagar Properties',
    metrics: [
      { label: 'Plot Footprint', val: '500 to 1,000 Sq. Yds' },
      { label: 'Frontage', val: '50 to 80 Ft. Road Facing' },
      { label: 'Title Structure', val: 'Sole Owner 100% Freehold' },
      { label: 'Redevelopment', val: 'FAR Sanction for Stilt+4 Floors' }
    ],
    features: ['100% Land & Sky ownership with title certainty', 'Sprawling private front lawns & rear courtyards', 'Multi-car driveway with basement entertainment den', 'Unrivaled generational capital preservation']
  },
  {
    title: 'High-Rise Luxury Penthouses & Duplexes',
    locations: 'Golf Course Road & Golf Course Ext.',
    specs: '4 & 5 BHK Duplex • 4,500 – 8,000 Sq. Ft.',
    price: '₹8.50 Cr – ₹24.00 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    alt: 'High-Rise Penthouses along Golf Course Road Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Ceiling Height', val: '12 Ft. Double-Height Living' },
      { label: 'Balcony Decks', val: 'Wraparound Aravalli Views' },
      { label: 'Clubhouse', val: '50,000 Sq. Ft. World-Class Amenities' },
      { label: 'Security', val: '5-Tier Biometric & Concierge' }
    ],
    features: ['Unobstructed skyline and DLF Golf Course vistas', 'Private plunge pool and heated Jacuzzi decks', 'Integrated home automation (Crestron/Lutron)', 'Designated concierge, valet, and butler services']
  },
  {
    title: 'Freehold Plotted Land & Bungalow Plots',
    locations: 'DLF Phase 1 to 5, Sushant Lok 1',
    specs: '215 to 1,000 Sq. Yds • Immediate Registry',
    price: '₹3.50 Lakh / Sq. Yd Onwards',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    alt: 'Freehold Residential Plots in DLF Phase 1 to 5 - Saudagar Properties',
    metrics: [
      { label: 'Dimensions', val: 'Standard & Corner Rectangular' },
      { label: 'Clearance', val: 'Clear Chain of Title with DLF NOC' },
      { label: 'Water & Power', val: 'Direct DHBVN & MCG Underground Grid' },
      { label: 'Possession', val: 'Immediate Physical Possession' }
    ],
    features: ['100% Verified ownership history & encumbrance-free', 'Complete freedom of custom architectural design', 'Direct DLF conveyance deed and immediate registry', 'Highest long-term land value appreciation in NCR']
  }
];

const MICRO_MARKET_INTELLIGENCE = [
  {
    phase: 'DLF Phase 1',
    character: 'Aravalli Ridge & Heritage Estate Living',
    priceRange: '₹4.00L - ₹5.50L / Sq.Yd',
    rentalYield: '3.6% - 4.2%',
    highlights: ['Immediate connectivity to Golf Course Road & MG Road', 'Dense tree canopy, tranquil residential atmosphere', 'Preferred choice for top industrialists & legacy families'],
    livabilityScore: '9.8 / 10'
  },
  {
    phase: 'DLF Phase 2',
    character: 'Cyber City Epicenter & Corporate CXO Hub',
    priceRange: '₹3.80L - ₹5.20L / Sq.Yd',
    rentalYield: '4.2% - 4.8%',
    highlights: ['Walking distance to DLF Cyber Hub & NH-48', 'Akashneem Marg & Jacaranda Marg prime sectors', 'Highest rental liquidity from Fortune 500 leadership'],
    livabilityScore: '9.7 / 10'
  },
  {
    phase: 'DLF Phase 4',
    character: 'Galleria Market Lifestyle & Central Gurugram',
    priceRange: '₹3.60L - ₹4.80L / Sq.Yd',
    rentalYield: '4.0% - 4.5%',
    highlights: ['Epicenter of upscale retail, cafes & dining', 'Proximity to Hamilton Court, Ridgewood & top schools', 'High pedestrian walkability and family-centric vibe'],
    livabilityScore: '9.6 / 10'
  },
  {
    phase: 'DLF Phase 5 & Golf Course Rd',
    character: 'Ultra-Luxury High-Rise & Horizon Corridor',
    priceRange: '₹38,000 - ₹65,000 / Sq.Ft',
    rentalYield: '3.8% - 4.4%',
    highlights: ['India’s most prestigious residential address', 'Home to The Aralias, The Magnolias & The Camellias', '16-lane signal-free expressway and rapid metro access'],
    livabilityScore: '9.9 / 10'
  },
  {
    phase: 'Sushant Lok 1',
    character: 'Low-Density Green Parks & Broad Avenues',
    priceRange: '₹2.80L - ₹3.80L / Sq.Yd',
    rentalYield: '3.5% - 4.1%',
    highlights: ['Adjacent to Gold Souk, Fortis & Huda City Centre', 'Generous park-facing plots and spacious streets', 'Strong appreciation runway with newly rebuilt floors'],
    livabilityScore: '9.3 / 10'
  }
];

const DUE_DILIGENCE_STEPS = [
  {
    step: '01',
    title: '30-Year Title Search & Encumbrance Audit',
    desc: 'Exhaustive verification of registered sale deeds, will probates, gift deeds, and revenue records (Jamabandi & Mutation) at the Gurugram Tehsildar office to ensure zero undisclosed mortgages or liens.'
  },
  {
    step: '02',
    title: 'Stilt + 4 Sanction & FAR Compliance Check',
    desc: 'Audit of DTCP / MCG approved building plans, verifying FAR (Floor Area Ratio) coverage, setback adherence, height limits, and stilt parking allotments against Haryana building code.'
  },
  {
    step: '03',
    title: 'Occupancy Certificate (OC) Verification',
    desc: 'Physical and documented inspection of the formal Occupancy Certificate issued by the Town and Country Planning Department, confirming the structure is fully legal for habitable possession.'
  },
  {
    step: '04',
    title: 'Boundary Demarcation & Physical Inspection',
    desc: 'On-ground technical survey verifying plot dimensions, road frontage, structural boundary walls, and absence of right-of-way infringements with neighboring properties.'
  },
  {
    step: '05',
    title: 'DLF / HSVP Transfer & Conveyance Clearance',
    desc: 'Securing official No Objection Certificates (NOC), dues clearance certificates, and transfer permissions from DLF Limited or HSVP prior to scheduling sub-registrar execution.'
  },
  {
    step: '06',
    title: 'Sub-Registrar Conveyance Execution',
    desc: 'Drafting bespoke, legally robust Sale Deeds, stamp duty payment facilitation, and biometric execution at the Gurugram Sub-Registrar office with complete legal representation.'
  },
  {
    step: '07',
    title: 'Post-Closure Mutation & MCG Property ID Transfer',
    desc: 'Filing mutation in municipal records (MCG Property Tax ID transfer), endorsement of DHBVN electricity meters, and seamless physical key handover.'
  }
];

const SPECIFICATION_STANDARDS = [
  {
    category: 'Structural & Thermal Engineering',
    items: ['Seismic Zone IV earthquake-resistant RCC frame construction', 'Double-glazed Unit (DGU) acoustic windows by Schüco / Fenesta', 'Waterproofed stilt and terrace foundation with 10-year warranty']
  },
  {
    category: 'Luxury Interior Finishes',
    items: ['Imported Italian Statuario & Botticino marble in living and dining halls', 'Hardwood engineered wooden flooring in primary master suites', 'Solid teakwood entrance doors with digital smart-lock hardware']
  },
  {
    category: 'HVAC & MEP Systems',
    items: ['Daikin / Mitsubishi VRV multi-split central air conditioning', '100% copper concealed piping with zero exposed refrigerant conduits', 'Dedicated high-capacity pressure pumps with solar hot water integration']
  },
  {
    category: 'Private Stilt & Parking Infrastructure',
    items: ['Dedicated 2 to 3 covered stilt parking slots per floor plate', 'High-speed private elevator (OTIS / Kone) opening directly into foyer', 'Pre-wired 11kW EV fast-charging junction box for every floor']
  }
];

export default async function ResidentialServicesPage() {
  const residentialListings = await getProperties({ category: 'residential', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/residential'];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ResidentialServiceView
        residentialListings={residentialListings}
        breadcrumbs={breadcrumbs}
        typologies={RESIDENTIAL_TYPOLOGIES}
        microMarkets={MICRO_MARKET_INTELLIGENCE}
        dueDiligenceSteps={DUE_DILIGENCE_STEPS}
        specificationStandards={SPECIFICATION_STANDARDS}
      />
    </>
  );
}
