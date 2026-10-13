import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import CommercialServiceView from '@/components/services/CommercialServiceView';

export const revalidate = 300; // Cache static payload for fast navigation

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/commercial'];
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
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Grade-A Commercial Real Estate in Cyber City Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

const COMMERCIAL_ASSET_CLASSES = [
  {
    title: 'Grade-A Corporate Office Towers',
    locations: 'Cyber City, Golf Course Road & Udyog Vihar',
    specs: '2,500 to 50,000+ Sq. Ft. • Bare-Shell & Fully Fitted',
    pricing: 'Lease: ₹90 – ₹220 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Grade-A Corporate Office Space in Cyber City Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Floor Plates', val: '15,000 - 35,000 Sq. Ft.' },
      { label: 'Efficiency Ratio', val: '78% - 84% Super-to-Carpet' },
      { label: 'Power Backup', val: '100% N+1 Dual DG Sets' },
      { label: 'Transit', val: 'Direct Rapid Metro Connectivity' }
    ],
    features: ['LEED Gold / Platinum Certified sustainable design', 'High-speed destination-controlled elevators', 'Multi-tier visitor management with RFID turnstiles', 'Integrated multi-cuisine food courts & breakout lounges']
  },
  {
    title: 'Pre-Leased Blue-Chip Investment Assets',
    locations: 'Cyber Park, Golf Course Ext. & Udyog Vihar',
    specs: '₹5 Cr to ₹100+ Cr Ticket Size',
    pricing: 'Assured Net Yield: 7.8% – 9.4% ROI',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    alt: 'Pre-Leased Commercial Investment Assets in Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Tenant Profile', val: 'Fortune 500 MNCs & Scheduled Banks' },
      { label: 'Lease Tenure', val: '9 to 15-Year Registered Lease Deeds' },
      { label: 'Lock-in Period', val: '3 to 5-Year Mandatory Lock-in' },
      { label: 'Escalation', val: '15% Compounded Every 3 Years' }
    ],
    features: ['Immediate quarterly cash flow credited from Day 1', 'Triple Net (NNN) lease structure with tenant maintenance', 'Long-term corporate capital security with low vacancy risk', 'Seamless title transfer with complete escrow protection']
  },
  {
    title: 'High-Street Retail, Showrooms & F&B Hubs',
    locations: 'Galleria Market, Golf Course Road & Sector 29',
    specs: '500 to 10,000 Sq. Ft. • Maximum Footfall Frontage',
    pricing: 'Sale: ₹18,000 – ₹45,000 / Sq. Ft.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    alt: 'High-Street Retail and Showrooms in Galleria Market - Saudagar Properties',
    metrics: [
      { label: 'Catchment', val: '50,000+ Affluent High-Net-Worth Households' },
      { label: 'Frontage', val: '25 to 60 Ft. Glass Display' },
      { label: 'Footfall', val: 'High Weekend & Evening Transit' },
      { label: 'Usage', val: 'Luxury Retail, QSR, Fine Dining & Banks' }
    ],
    features: ['Prime corner frontage visible from arterial expressways', 'Double-height ceiling suitable for internal mezzanines', 'Designated outdoor cafe seating permissions', 'High historical rental appreciation across Gurugram']
  },
  {
    title: 'Shop-Cum-Office (SCO) Commercial Plots',
    locations: 'Golf Course Ext., Dwarka Expressway & Sohna Rd',
    specs: '100 to 250 Sq. Yds • Basement + G + 4 Approvals',
    pricing: '₹4.50 Cr – ₹16.00 Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    alt: 'SCO Commercial Plots along Golf Course Extension Road - Saudagar Properties',
    metrics: [
      { label: 'Land Ownership', val: '100% Freehold Land & Terrace' },
      { label: 'Permissible Floors', val: 'Basement + Ground + 4 Levels' },
      { label: 'Car Parking', val: 'Surface Multi-Car Common Bay' },
      { label: 'Maintenance Fee', val: 'Zero High-Rise Maintenance Surcharges' }
    ],
    features: ['Independent entry for multiple commercial tenants', 'Complete architectural flexibility within Haryana SCO policy', 'High potential rental yield reaching 9.5% - 11% upon completion', 'Prime front-row positioning along high-density residential belts']
  }
];

const COMMERCIAL_YIELD_BENCHMARKS = [
  {
    hub: 'DLF Cyber City (DLF Phase 2 & 3)',
    category: 'Institutional IT / Corporate Campuses',
    leaseRate: '₹135 - ₹185 / Sq.Ft / Mo',
    netYield: '7.8% - 8.4%',
    occupancy: '97.2%',
    highlights: ['India’s premier corporate destination housing 500+ MNCs', 'Direct Rapid Metro and NH-48 connectivity', 'Preferred choice for financial institutions & tech leaders']
  },
  {
    hub: 'Golf Course Road (Horizon Corridor)',
    category: 'Ultra-Prime Corporate Headquarters',
    leaseRate: '₹175 - ₹245 / Sq.Ft / Mo',
    netYield: '7.2% - 8.0%',
    occupancy: '98.5%',
    highlights: ['Home to Horizon Centre, Two Horizon, and American Express', '16-lane signal-free corridor with high corporate prestige', 'Highest capital value retention across NCR']
  },
  {
    hub: 'Udyog Vihar (Phases 1 to 5)',
    category: 'Standalone Corporate & Tech Buildings',
    leaseRate: '₹65 - ₹95 / Sq.Ft / Mo',
    netYield: '8.4% - 9.2%',
    occupancy: '92.0%',
    highlights: ['Adjacent to Cyber City at 50% more economical lease costs', 'Generous independent plot footprints for single-tenant occupiers', 'Zero reliance on high-density high-rise overheads']
  },
  {
    hub: 'Golf Course Extension Road',
    category: 'New-Generation Mixed-Use IT & Retail',
    leaseRate: '₹85 - ₹120 / Sq.Ft / Mo',
    netYield: '8.2% - 9.0%',
    occupancy: '89.4%',
    highlights: ['Modern LEED-certified developments with large floor plates', 'High future capital appreciation driven by Southern Peripheral Rd', 'Rapid residential catchment expansion']
  },
  {
    hub: 'SCO Commercial Corridors (Dwarka Exp & Sec 29)',
    category: 'Freehold Shop-Cum-Office Plotted Retail',
    leaseRate: '₹120 - ₹210 / Sq.Ft / Mo (Ground)',
    netYield: '9.2% - 11.0%',
    occupancy: '94.0%',
    highlights: ['Full land ownership without builder society control', 'Multiple rental revenue streams from retail ground to upper office', 'Highest overall cash-on-cash yield for private investors']
  }
];

const LEASE_STRUCTURING_FRAMEWORK = [
  {
    step: '01',
    title: 'Space Efficiency & Floor Plate Optimization',
    desc: 'Conducting micro-market space programming audits, analyzing core-to-perimeter depth, column grids, and super-to-carpet area ratios to ensure client leases achieve 80%+ usable operational efficiency.'
  },
  {
    step: '02',
    title: 'Tripartite Lease Deed & Term Sheet Formulation',
    desc: 'Drafting structured lease covenants covering lock-in terms (typically 3 to 5 years), rent-free fitout grace periods (60 to 120 days), and sub-leasing rights with clear escalation caps.'
  },
  {
    step: '03',
    title: 'Common Area Maintenance (CAM) & Expense Audits',
    desc: 'Auditing developer CAM charges, validating chilled-water BTU air-conditioning metering, and ensuring operational expenses are capped with transparent open-book reconciliation.'
  },
  {
    step: '04',
    title: 'Power Load Sanction & Dual-Feeder Redundancy',
    desc: 'Verifying high-tension (HT) electricity load sanctions, automatic transfer switchgear (ATS), 100% DG backup redundancy, and 1kVA per 100 sq ft provisioning for mission-critical corporate operations.'
  },
  {
    step: '05',
    title: 'Security Deposit Escrow & Exit Protocols',
    desc: 'Securing bank guarantee frameworks or interest-bearing escrow structures for security deposits, complete with fair dilapidation guidelines and guaranteed refund timelines.'
  },
  {
    step: '06',
    title: 'Statutory Fit-Out Clearances & Municipal Fire NOC',
    desc: 'Facilitating end-to-end approvals with DTCP, Haryana Fire Services, and local municipal corporations for interior fitouts, structural alterations, and life-safety certifications.'
  }
];

const INSTITUTIONAL_COMPLIANCE_STANDARDS = [
  {
    title: 'Sustainability & Green Building',
    metrics: 'LEED Platinum / Gold / IGBC',
    desc: 'Double-glazed low-E façades, energy recovery ventilators, rainwater harvesting, and solar PV offset systems.'
  },
  {
    title: 'Life Safety & Fire Protection',
    metrics: 'NFPA 13 & NBC 2016 Compliant',
    desc: 'ESFR and addressable sprinkler grids, dual pressurised fire stairwells, and automated smoke evacuation systems.'
  },
  {
    title: 'Indoor Air Quality & Wellness',
    metrics: 'ASHRAE 62.1 & MERV 13 Filters',
    desc: 'Continuous treated fresh air (TFA) circulation, UVGI germicidal lamps, and indoor CO2 sensor automation.'
  },
  {
    title: 'Transit & Multi-Level Parking',
    metrics: '1 Car per 500 Sq. Ft. Leased',
    desc: 'Automated multi-level basements, dedicated EV fleet charging stations, and direct covered walkways to Rapid Metro.'
  }
];

export default async function CommercialServicesPage() {
  const commercialListings = await getProperties({ category: 'commercial', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/commercial'];

  return (
    <CommercialServiceView
      commercialListings={commercialListings}
      breadcrumbs={breadcrumbs}
      assetClasses={COMMERCIAL_ASSET_CLASSES}
      yieldBenchmarks={COMMERCIAL_YIELD_BENCHMARKS}
      leaseFramework={LEASE_STRUCTURING_FRAMEWORK}
      complianceStandards={INSTITUTIONAL_COMPLIANCE_STANDARDS}
    />
  );
}
