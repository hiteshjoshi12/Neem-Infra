import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Home, 
  Key, 
  Award,
  ChevronRight,
  Send
} from 'lucide-react';
import { getProperties } from '@/services/propertyService';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';

export const revalidate = 300; // Cache static payload for fast navigation

export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/residential'];
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

const RESIDENTIAL_SUB_CATEGORIES = [
  {
    title: 'Luxury Builder Floors',
    locations: 'DLF Phase 1, 2, 3, 4 & Sushant Lok',
    specs: '4 BHK • 300 to 500 Sq. Yds • Private Lift & Terrace',
    price: '₹4.50 Cr – ₹12.00 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury Builder Floors in DLF Phase 1 to 4 Gurugram - Saudagar Properties',
    features: ['Stilt Parking (2-3 cars)', 'Separate Staff Quarters', 'Gated Sector Security', 'Zero Maintenance Headaches']
  },
  {
    title: 'Independent Kothis & Mansions',
    locations: 'DLF Phase 1 & 2 Prime Avenues',
    specs: '500 to 1000 Sq. Yds • Bespoke Architecture',
    price: '₹14.00 Cr – ₹35.00 Cr',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    alt: 'Independent Kothis and Mansions in DLF Phase 1 and 2 - Saudagar Properties',
    features: ['Private Land Ownership', 'Swimming Pool & Lawns', 'Multi-Level Luxury', 'High Resale Appreciation']
  },
  {
    title: 'High-Rise Penthouses',
    locations: 'Golf Course Road & Golf Course Ext.',
    specs: '4 & 5 BHK Duplex • 4,500 – 8,000 Sq. Ft.',
    price: '₹8.50 Cr – ₹24.00 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    alt: 'High-Rise Penthouses along Golf Course Road Gurugram - Saudagar Properties',
    features: ['Panoramic Skyline Views', 'Exclusive Clubhouse Access', 'Concierge & Valet', 'Automated Smart Homes']
  },
  {
    title: 'Freehold Residential Plots',
    locations: 'DLF Phase 1 to 5, Sushant Lok 1',
    specs: '215 to 1000 Sq. Yds • Immediate Registry',
    price: '₹3.50 Lakh / Sq. Yd Onwards',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    alt: 'Freehold Residential Plots in DLF Phase 1 to 5 - Saudagar Properties',
    features: ['100% Clear Titles', 'Architectural Freedom', 'Direct DLF Conveyance', 'Immediate Possession']
  }
];

const LOCALITY_CORRIDORS = [
  { name: 'DLF Phase 1', desc: 'Serene tree-lined avenues, golf club proximity, ultra-luxury 500 sq yd floors.' },
  { name: 'DLF Phase 2', desc: 'Immediate Cyber City connectivity, Akashneem Marg, top choice for corporate CXOs.' },
  { name: 'DLF Phase 3', desc: 'Direct access to Rapid Metro, prime rental yields, modern boutique floors.' },
  { name: 'DLF Phase 4', desc: 'Galleria Market hub, Hamilton Court vicinity, highest family livability score.' },
  { name: 'DLF Phase 5', desc: 'Horizon Centre & Golf Course Road epicenter, ultra-luxury high-rises and penthouses.' },
  { name: 'Sushant Lok 1', desc: 'Peaceful residential colony with sprawling parks, bespoke villas, and renowned schools.' }
];

export default async function ResidentialServicesPage() {
  const residentialListings = await getProperties({ category: 'residential', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/residential'];

  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D] pt-28">
      {/* Schema.org Breadcrumb Structured Data */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-[#0E162B] text-white py-16 md:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Residential Real Estate Architecture in DLF Gurugram - Saudagar Properties"
            fill
            priority
            fetchPriority="high"
            className="w-full h-full object-cover filter brightness-75"
          />
        </div>
        
        {/* Ambient Gradient Glows */}
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
            <span className="text-[#C6A24A] font-medium">Residential Real Estate</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17213D] border border-[#C6A24A]/40 text-[#C6A24A] text-[11px] font-bold tracking-widest uppercase mb-5">
                <Sparkles size={12} />
                <span>Premier Residential Advisory • DLF Gurugram</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F7F5EF] leading-[1.12] mb-6">
                Luxury Builder Floors & <br className="hidden sm:inline" />
                <span className="italic font-light text-[#C6A24A]">Bespoke Villas</span> in Gurgaon.
              </h1>

              <p className="text-[#C9CED9] text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                From freehold residential plots and newly constructed independent floors in DLF Phase 1–4 to bespoke villas in Sushant Lok, Saudagar Properties delivers verified legal titles and confidential private advisory for discerning families.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#inventory"
                  className="px-7 py-3.5 rounded-xl bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore Residential Portfolio</span>
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
                  <span className="text-xs uppercase tracking-wider text-[#9DA6B8]">Advisory Authority</span>
                  <span className="text-xs font-semibold text-[#C6A24A] flex items-center gap-1">
                    <ShieldCheck size={14} /> DLF Authorized Desk
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Key size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">100% Clear & Verified Titles</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Every builder floor and plot undergoes 3-tier legal verification before listing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Off-Market Builder Floors</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Direct access to pre-launch and confidential floors not listed on open public portals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C6A24A]/10 text-[#C6A24A] flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">25+ Years DLF Leadership</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Trusted advisors to Gurgaon’s leading business families, doctors, and CXOs.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#C9CED9]">
                  <span>Average Turnaround</span>
                  <span className="text-[#C6A24A] font-semibold">Seamless 14-Day Closure</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CORE RESIDENTIAL ASSET CLASSES ================= */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] block mb-2">
            Curated Living Spaces
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#17213D]">
            Residential Asset Classes We Specialize In
          </h2>
          <p className="text-[#566078] text-sm sm:text-base mt-3 leading-relaxed">
            Whether you seek an independent brand-new terrace floor, a prime plot for custom construction, or a penthouse along Golf Course Road, we tailor our solutions to your exact requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESIDENTIAL_SUB_CATEGORIES.map((item, index) => (
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
                    <span className="text-xs uppercase tracking-wider text-[#8A95A7]">Typical Valuation</span>
                    <span className="text-base font-bold text-[#C6A24A] font-serif">{item.price}</span>
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
                  <span>Inquire About {item.title}</span>
                  <ArrowRight size={13} className="text-[#C6A24A]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED INVENTORY GRID ================= */}
      <section id="inventory" className="py-16 bg-[#EFEBE1] border-y border-[#17213D]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] block mb-2">
                Prime Listings
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#17213D]">
                Featured Residential Inventory
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E162B] hover:text-[#C6A24A] uppercase tracking-wider transition-colors"
            >
              <span>View All Properties</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {residentialListings.map((prop, i) => (
              <div 
                key={prop._id || prop.id || i}
                className="bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={prop.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                    alt={prop.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0E162B]/80 text-[#C6A24A] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                    {prop.tag || "For Sale"}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#17213D] mb-1 truncate">{prop.title}</h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1 mb-2">
                      <MapPin size={12} className="text-[#C6A24A] shrink-0" />
                      <span className="truncate">{prop.location}</span>
                    </p>
                    <p className="text-xs text-[#475569] mb-3 line-clamp-1">{prop.specs}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#C6A24A] font-serif">{prop.price}</span>
                    <Link
                      href={prop.slug ? `/properties/${prop.slug}` : prop.link || "/contact"}
                      className="px-3 py-1.5 rounded-lg bg-[#0E162B] text-white text-[11px] font-semibold hover:bg-[#C6A24A] hover:text-[#0E162B] transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MICRO-MARKET CORRIDORS ================= */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A24A] block mb-2">
            Neighborhood Mastery
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#17213D]">
            DLF Gurugram Residential Corridors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCALITY_CORRIDORS.map((loc, i) => (
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
      </section>

      {/* ================= PRIVATE CONSULTATION ACTION BANNER ================= */}
      <section id="contact-desk" className="py-16 bg-[#0E162B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A24A] block mb-3">
            Confidential Real Estate Desk
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5EF] mb-4">
            Looking for an Exclusive Residential Property?
          </h2>
          <p className="text-[#C9CED9] text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light">
            Share your preferred phase, plot size, and budget with our senior partners. We arrange private, discreet site viewings with complete title verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
            >
              <span>Book Private Consultation</span>
              <Send size={13} />
            </Link>

            <a
              href="https://wa.me/919718511207"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors"
            >
              WhatsApp Us Direct
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
