import { getProperties } from '@/services/propertyService';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';
import IndustrialServiceView from '@/components/services/IndustrialServiceView';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const revalidate = 300; // Cache static payload for fast navigation

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/industrial'];
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
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Industrial Warehouses and Plots in Gurugram - Saudagar Properties',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

const INDUSTRIAL_ASSET_CLASSES = [
  {
    title: 'Grade-A Logistics Parks & Modern Warehouses',
    locations: 'NH-48, Bilaspur, Farrukhnagar & Pataudi',
    specs: '50,000 to 500,000+ Sq. Ft. • 12m Clear Height',
    pricing: 'Lease: ₹22 – ₹38 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    alt: 'Grade-A Industrial Logistics Warehouses in Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Clear Height', val: '10.5m to 12.5m Clear Eaves' },
      { label: 'Flooring', val: 'FM2 Superflat 5 to 7 Ton/m²' },
      { label: 'Dock Ratio', val: '1 Dock per 10,000 Sq. Ft.' },
      { label: 'Apron Depth', val: '35m Concrete Truck Apron' }
    ],
    features: ['FM2 laser-screeded flooring with heavy multi-tier racking capacity', 'Automated hydraulic dock levelers with canopy weather seals', 'NFPA 13 compliant with K-14/K-25 ESFR roof sprinkler heads', 'Direct connectivity to Western Dedicated Freight Corridor (WDFC)']
  },
  {
    title: 'Industrial Freehold & HSIIDC Sanctioned Plots',
    locations: 'Udyog Vihar Phase 1–5, IMT Manesar',
    specs: '500 to 5,000+ Sq. Yds • Ready for Construction',
    pricing: 'Sale: ₹80,000 – ₹1.60 Lakh / Sq. Yd',
    image: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
    alt: 'Industrial Freehold Plots in Udyog Vihar and IMT Manesar - Saudagar Properties',
    metrics: [
      { label: 'Zoning', val: 'HSIIDC Industrial Sanctioned' },
      { label: 'FAR Allowance', val: '150% - 200% Permissible FAR' },
      { label: 'Road Width', val: '18m to 30m Arterial Access' },
      { label: 'Power Grid', val: '11kV / 33kV Dedicated Line' }
    ],
    features: ['100% Clear titles with immediate HSIIDC transfer permissions', 'Heavy HT electricity substation access with dedicated feeders', 'Wide arterial roads engineered for 40ft multi-axle freight trailers', 'Suitable for light engineering, electronics, auto ancillaries & data centers']
  },
  {
    title: 'Manufacturing Factories, Sheds & PEB Plants',
    locations: 'Udyog Vihar, IMT Manesar Sector 3–8',
    specs: '10,000 to 100,000 Sq. Ft. • Multi-Level Options',
    pricing: 'Lease: ₹35 – ₹70 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    alt: 'Manufacturing Factories and Industrial Sheds in Gurugram - Saudagar Properties',
    metrics: [
      { label: 'Gantry Cranes', val: '5 to 20 Ton Overhead Crane Rails' },
      { label: 'Power Capacity', val: '250 kVA to 2,000 kVA Sanctioned' },
      { label: 'Pollution Status', val: 'HSPCB Green & Orange Clearances' },
      { label: 'Structure', val: 'Heavy PEB Steel Frame & RCC' }
    ],
    features: ['Pre-installed heavy overhead gantry cranes for precision handling', 'Integrated Effluent Treatment Plant (ETP / STP) compliance', 'Dedicated on-site staff dormitories, canteens & administrative wings', 'Heavy machine bed foundations ready for immediate commissioning']
  },
  {
    title: 'Build-to-Suit (BTS) Industrial Parks & Land',
    locations: 'KMP Expressway, Sohna & Manesar Hubs',
    specs: 'Custom Land Parcels from 2 to 50 Acres',
    pricing: 'Bespoke Institutional Turnkey Mandates',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    alt: 'Build-to-Suit Industrial Facilities and Warehouses - Saudagar Properties',
    metrics: [
      { label: 'Land Area', val: '2 to 50+ Contiguous Acres' },
      { label: 'Delivery Model', val: 'Long-Term Lease or Outright Sale' },
      { label: 'Timeline', val: 'Fast-Track 9 to 14-Month Handover' },
      { label: 'Clearance Desk', val: 'CLU & Environmental Approvals' }
    ],
    features: ['Custom design tailored for temperature-controlled cold chains or assembly lines', 'Long-term 15 to 20-year institutional anchor lease structuring', 'Complete statutory change of land use (CLU) and forest department clearances', 'Full project lifecycle management from land acquisition to final CC']
  }
];

const INDUSTRIAL_CORRIDORS = [
  {
    hub: 'Udyog Vihar (Phases 1 to 5)',
    category: 'Urban Light Industrial & Tech Hardware',
    freightAccess: 'Direct NH-48 & 15 mins to IGI Airport Cargo',
    powerAvailability: 'Dedicated 11kV Urban Underground Grid',
    highlights: ['Adjacent to DLF Cybercity with zero transit delay for engineering leadership', 'Immediate availability of skilled technical workforce from Delhi and Gurgaon', 'Optimal for electronics, precision assembly, corporate logistics & R&D labs']
  },
  {
    hub: 'IMT Manesar (Sectors 1 to 8)',
    category: 'Heavy Manufacturing & Automotive Ancillaries',
    freightAccess: 'NH-48 Golden Quadrilateral & KMP Interchange',
    powerAvailability: 'Dual 66kV / 33kV Dedicated Substations',
    highlights: ['Ecosystem of 1,200+ operating plants including Maruti Suzuki and Honda', 'HSIIDC managed industrial infrastructure with industrial-grade water & drainage', 'Zero municipal red-tape with single-window state industrial facilitation']
  },
  {
    hub: 'NH-48 Bilaspur & Tauru Belt',
    category: 'Regional 3PL, FMCG & E-Commerce Fulfillment',
    freightAccess: 'Direct Expressway & Western DFC Rail Freight Terminal',
    powerAvailability: 'Industrial HT Feeder with 100% Captive DG Backups',
    highlights: ['The distribution spine connecting Delhi, Rajasthan, and Western ports', 'Houses mega-fulfillment centers of Amazon, Flipkart, Reliance & DHL', 'Continuous round-the-clock trailer entry without urban peak-hour bans']
  },
  {
    hub: 'KMP Expressway Logistics Ring',
    category: 'Mega Logistics Parks & Large BTS Acreages',
    freightAccess: 'Circumferential NCR Ring linking NH-44, NH-48 & NE-4',
    powerAvailability: 'Rural Heavy Grid with Solar Hybrid Integration',
    highlights: ['Bypasses all Delhi commercial tolls and environmental entry bans', 'Availability of 10 to 50-acre contiguous land parcels at highly viable rates', 'Strategic gateway to the new Delhi-Mumbai Expressway (NE-4)']
  },
  {
    hub: 'Farrukhnagar & Pataudi Cluster',
    category: 'Modern Grade-A Institutional Logistics Parks',
    freightAccess: 'KMP Expressway & Direct Northern Peripheral Link',
    powerAvailability: 'High Reliability Industrial Lines with Substation Support',
    highlights: ['Home to ESR, Ascendas-Firstspace, and IndoSpace logistics developments', 'High concentration of institutional-grade PEB warehouses with FM2 floors', 'Substantial operational cost efficiencies compared to inner-city warehousing']
  }
];

const HSIIDC_COMPLIANCE_STEPS = [
  {
    step: '01',
    title: 'HSPCB Pollution Clearances (CTE & CTO)',
    desc: 'Conducting environmental impact audits to secure Consent to Establish (CTE) and Consent to Operate (CTO) under Haryana State Pollution Control Board for Green, Orange, and Red industry classifications.'
  },
  {
    step: '02',
    title: 'DHBVN High-Tension (HT) Load Sanction',
    desc: 'Liaison with Dakshin Haryana Bijli Vitran Nigam for industrial power load sanctions (11kV to 33kV), private substation installation, dual-feeder reliability, and captive solar grid tie-ins.'
  },
  {
    step: '03',
    title: 'HSIIDC Plot Transfer & Completion Certificate (CC)',
    desc: 'Securing transfer permissions, dues clearance certificates, plot demarcation certificates, and final Completion Certificates (CC) from HSIIDC offices with complete legal scrutiny.'
  },
  {
    step: '04',
    title: 'DISH Factory Licensing & Structural Stability',
    desc: 'Filing factory building plan sanctions with the Directorate of Industrial Safety and Health (DISH), verifying machinery layout, structural engineer stability certification, and labor safety audits.'
  },
  {
    step: '05',
    title: 'Haryana Fire Services Industrial NOC',
    desc: 'Verification of internal and external fire hydrants, static water storage tanks (minimum 200,000 liters), ESFR sprinkler networks, and periodic fire safety audit certification.'
  },
  {
    step: '06',
    title: 'CGWA Ground Water & Environmental Sanctions',
    desc: 'Securing Central Ground Water Authority borewell extraction permissions, rainwater harvesting injection compliance, and industrial Effluent Treatment Plant (ETP) discharge audits.'
  }
];

const WAREHOUSE_ENGINEERING_STANDARDS = [
  {
    title: 'Laser-Screeded FM2 Flooring',
    metrics: '5 to 7 Ton / m² UDL',
    desc: 'Zero-joint superflat concrete floor designed for high-reach narrow-aisle (VNA) forklifts, resistant to abrasion and impact.'
  },
  {
    title: 'Clear Eaves Height & PEB Steel',
    metrics: '10.5m to 12.5m Clear Height',
    desc: 'Pre-Engineered Building (PEB) design maximizing vertical pallet storage, with bare galvalume standing-seam roof.'
  },
  {
    title: 'Dock Levelers & Trailer Aprons',
    metrics: '1 Dock per 10k Sq. Ft. & 35m Apron',
    desc: 'Hydraulic dock levelers with sectional overhead doors and 35m concrete turning apron for seamless 40ft trailer turnaround.'
  },
  {
    title: 'Fire Suppression & ESFR Sprinklers',
    metrics: 'NFPA 13 & K-14/K-25 Heads',
    desc: 'Early Suppression Fast Response ceiling sprinklers eliminating in-rack sprinkler requirements, supported by dual diesel pumps.'
  }
];

export default async function IndustrialServicesPage() {
  const industrialListings = await getProperties({ category: 'industrial', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/industrial'];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <IndustrialServiceView
        industrialListings={industrialListings}
        breadcrumbs={breadcrumbs}
        assetClasses={INDUSTRIAL_ASSET_CLASSES}
        corridors={INDUSTRIAL_CORRIDORS}
        complianceSteps={HSIIDC_COMPLIANCE_STEPS}
        engineeringStandards={WAREHOUSE_ENGINEERING_STANDARDS}
      />
    </>
  );
}
