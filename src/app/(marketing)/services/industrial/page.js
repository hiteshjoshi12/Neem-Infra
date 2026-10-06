import Image from 'next/image';
import Link from 'next/link';
import { 
  Factory, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Home, 
  Truck, 
  Boxes, 
  ChevronRight, 
  Send, 
  Cpu 
} from 'lucide-react';
import { getProperties } from '@/services/propertyService';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';

export const revalidate = 300; // Cache static payload for fast navigation

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/industrial'];
  return {
    title: seoData.title,
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
    title: 'Grade-A Logistics & Warehouses',
    locations: 'NH-48, Bilaspur, Farrukhnagar & Pataudi',
    specs: '50,000 to 500,000+ Sq. Ft. • 12m Clear Height',
    pricing: 'Lease: ₹22 – ₹38 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    alt: 'Grade-A Industrial Logistics Warehouses in Gurugram - Saudagar Properties',
    features: ['FM2 Flooring with Heavy Floor Load Capacity', 'Automated Dock Levelers & Wide Aprons', 'NFPA Fire Compliant with ESFR Sprinklers', 'Prime Access to Western Dedicated Freight Corridor']
  },
  {
    title: 'Industrial Freehold Plots',
    locations: 'Udyog Vihar Phase 1–5, IMT Manesar',
    specs: '500 to 5,000+ Sq. Yds • Ready for Construction',
    pricing: 'Sale: ₹80,000 – ₹1.60 Lakh / Sq. Yd',
    image: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
    alt: 'Industrial Freehold Plots in Udyog Vihar and IMT Manesar - Saudagar Properties',
    features: ['HSIIDC & Freehold Sanctioned Titles', 'High-Tension Heavy Power Grid Access', 'Wide Arterial Roads for 40ft Trailers', 'Immediate Transfer & Registry Compliant']
  },
  {
    title: 'Manufacturing Factories & Sheds',
    locations: 'Udyog Vihar, IMT Manesar Sector 3–8',
    specs: '10,000 to 100,000 Sq. Ft. • Multi-Level Options',
    pricing: 'Lease: ₹35 – ₹70 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    alt: 'Manufacturing Factories and Industrial Sheds in Gurugram - Saudagar Properties',
    features: ['Overhead Gantry Cranes Installed', 'Effluent Treatment & Pollution Sanctioned', 'Dedicated Staff Accommodations', 'Heavy Machinery Structural Approvals']
  },
  {
    title: 'Build-to-Suit (BTS) Industrial Facilities',
    locations: 'KMP Expressway, Sohna & Manesar Hubs',
    specs: 'Custom Land Parcels from 2 to 50 Acres',
    pricing: 'Bespoke Turnkey Industrial Mandates',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    alt: 'Build-to-Suit Industrial Facilities and Warehouses - Saudagar Properties',
    features: ['Custom Architectural & Cold-Storage Specs', 'Long-Term Corporate Anchor Leases', 'Complete Statutory & Environmental Approvals', 'Fast-Track Turnaround & Commissioning']
  }
];

const INDUSTRIAL_CORRIDORS = [
  { name: 'Udyog Vihar Phase 1–5', desc: 'Gurgaon’s iconic urban industrial hub adjacent to DLF Cybercity and Delhi border. Perfect for light manufacturing, IT hardware, and corporate headquarters.' },
  { name: 'IMT Manesar', desc: 'Integrated Industrial Modern Township housing global automotive leaders, heavy engineering, and electronics giants over 3,000+ acres.' },
  { name: 'NH-48 Logistics Belt', desc: 'The golden logistics artery connecting Delhi and Mumbai. Primary warehousing cluster for e-commerce, FMCG, and 3PL leaders.' },
  { name: 'KMP Expressway Hub', desc: 'Western Peripheral Expressway providing zero-octroi transit around NCR with massive industrial land opportunities.' },
  { name: 'Farrukhnagar & Pataudi Road', desc: 'The newest logistics nerve center with modern Grade-A institutional warehousing facilities.' },
  { name: 'Sohna Industrial Corridor', desc: 'High-speed connectivity to Delhi-Mumbai Expressway and dedicated industrial development zones.' }
];

export default async function IndustrialServicesPage() {
  const industrialListings = await getProperties({ category: 'industrial', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/industrial'];

  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D] pt-28">
      {/* Schema.org Breadcrumb Structured Data */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-[#0E162B] text-white py-16 md:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80"
            alt="Industrial and Warehousing Real Estate in Gurugram - Saudagar Properties"
            fill
            priority
            fetchPriority="high"
            className="w-full h-full object-cover filter brightness-75"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0E162B] via-[#0E162B]/85 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#C6A24A_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#9DA6B8]">
            <Link href="/" className="hover:text-[#C6A24A] transition-colors flex items-center gap-1">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <Link href="/#services" className="hover:text-[#C6A24A] transition-colors">
              Services
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#C6A24A] font-medium">Industrial Real Estate</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17213D] border border-[#C6A24A]/40 text-[#C6A24A] text-[11px] font-bold tracking-widest uppercase mb-5">
                <Sparkles size={12} />
                <span>Industrial & Logistics Advisory • Udyog Vihar & NCR</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F7F5EF] leading-[1.12] mb-6">
                Warehouses, Industrial Plots & <br className="hidden sm:inline" />
                <span className="italic font-light text-[#C6A24A]">Factory Leasing</span> in Gurugram.
              </h1>

              <p className="text-[#C9CED9] text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                Guiding manufacturing giants, logistics leaders, and corporate enterprises through strategic industrial land acquisition, factory leasing, and build-to-suit logistics hubs across Udyog Vihar and IMT Manesar.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#asset-classes"
                  className="px-7 py-3.5 rounded-xl bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore Industrial Assets</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="tel:+919811221207"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <PhoneCall size={14} className="text-[#C6A24A]" />
                  <span>Call +91 98112 21207</span>
                </a>
              </div>
            </div>

            {/* Right Hero Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#17213D]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs uppercase tracking-wider text-[#9DA6B8]">Industrial Desk</span>
                  <span className="text-xs font-semibold text-[#C6A24A] flex items-center gap-1">
                    <ShieldCheck size={14} /> HSIIDC & Legal Diligence
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Boxes size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Turnkey Logistics Facilities</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Immediate occupancy for modern 3PL, e-commerce, cold-storage, and supply chain hubs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Zoning & Compliance Audits</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Pollution board NOC, electricity load sanctions, fire safety, and industrial zoning verification.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Arterial Freight Proximity</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Plots located with direct connectivity to NH-48, KMP Expressway, and Delhi International Airport.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#C9CED9]">
                  <span>Industrial Land Transacted</span>
                  <span className="text-[#C6A24A] font-semibold">100+ Acres in NCR</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INDUSTRIAL ASSET CLASSES ================= */}
      <section id="asset-classes" className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] block mb-2">
            Infrastructure & Supply Chain
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#17213D]">
            Industrial Asset Classes We Specialize In
          </h2>
          <p className="text-[#566078] text-sm sm:text-base mt-3 leading-relaxed">
            From industrial plots in Udyog Vihar to heavy manufacturing plants and build-to-suit logistics parks, our veteran team identifies verified assets that optimize your operational scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INDUSTRIAL_ASSET_CLASSES.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt || `${item.title} - Saudagar Properties`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-[#0E162B]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#C6A24A] uppercase tracking-wider">
                  {item.locations}
                </div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#E9D9A8] font-medium">{item.specs}</p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div className="mb-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1] mb-4">
                    <span className="text-xs uppercase tracking-wider text-[#8A95A7]">Rate / Valuation</span>
                    <span className="text-base font-bold text-[#C6A24A] font-serif">{item.pricing}</span>
                  </div>

                  <div className="space-y-2">
                    {item.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#334155]">
                        <CheckCircle2 size={13} className="text-[#C6A24A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact-desk"
                  className="w-full py-3 px-4 rounded-xl bg-[#F7F5EF] group-hover:bg-[#0E162B] text-[#0E162B] group-hover:text-[#F7F5EF] border border-[#17213D]/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <span>Inquire Industrial Facility</span>
                  <ArrowRight size={13} className="text-[#C6A24A]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INDUSTRIAL CORRIDORS ================= */}
      <section className="py-16 md:py-20 bg-[#EFEBE1] border-y border-[#17213D]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] block mb-2">
              Strategic Industrial Belts
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#17213D]">
              Gurugram & NCR Industrial Corridors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIAL_CORRIDORS.map((loc, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-white border border-[#E2DDD5] shadow-sm hover:border-[#C6A24A]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center font-bold font-serif text-sm">
                    0{i + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#17213D]">{loc.name}</h3>
                </div>
                <p className="text-xs text-[#566078] leading-relaxed">{loc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRIVATE INDUSTRIAL CONSULTATION BANNER ================= */}
      <section id="contact-desk" className="py-16 bg-[#0E162B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A24A] block mb-3">
            Industrial Mandate Desk
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5EF] mb-4">
            Looking for an Industrial Plot, Factory or Warehouse?
          </h2>
          <p className="text-[#C9CED9] text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light">
            Share your power requirement, land size, and desired corridor with our industrial specialists. We present verified, immediately available assets with full statutory clearance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
            >
              <span>Schedule Industrial Briefing</span>
              <Send size={13} />
            </Link>

            <a
              href="tel:+919811221207"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <PhoneCall size={14} className="text-[#C6A24A]" />
              <span>Direct Industrial Line</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
