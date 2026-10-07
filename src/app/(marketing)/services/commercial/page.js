import Image from 'next/image';
import Link from 'next/link';
import { 
  Briefcase, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Home, 
  TrendingUp, 
  Building,
  ChevronRight,
  Send,
  Coins
} from 'lucide-react';
import { getProperties } from '@/services/propertyService';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS, SITE_URL, SITE_NAME } from '@/lib/seo/seoConfig';

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
    title: 'Grade-A Corporate Offices',
    locations: 'Cyber City, Golf Course Road & Udyog Vihar',
    specs: '2,500 to 50,000+ Sq. Ft. • Bare-shell & Fitted',
    pricing: 'Lease: ₹90 – ₹220 / Sq. Ft. / Month',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Grade-A Corporate Office Space in Cyber City Gurugram - Saudagar Properties',
    features: ['LEED Gold/Platinum Certified', 'High-Speed Elevators & 100% Power Backup', 'Multi-Level Car Parking', 'Proximity to Rapid Metro Stations']
  },
  {
    title: 'High-Street Retail & Showrooms',
    locations: 'Galleria Market, Golf Course Road & Sector 29',
    specs: '500 to 10,000 Sq. Ft. • Maximum Footfall Frontage',
    pricing: 'Sale: ₹18,000 – ₹45,000 / Sq. Ft.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    alt: 'High-Street Retail and Showrooms in Galleria Market - Saudagar Properties',
    features: ['Prime Corner Frontage', 'High Catchment of Affluent Residents', 'Ideal for Luxury Brands, Banks & F&B', 'Unmatched Rental Yields']
  },
  {
    title: 'Pre-Leased Investment Assets',
    locations: 'Cyber Park, Golf Course Ext. & Udyog Vihar',
    specs: '₹5 Cr to ₹100+ Cr Ticket Size',
    pricing: 'Assured ROI: 7.5% – 9.2% Net Yield',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    alt: 'Pre-Leased Commercial Investment Assets in Gurugram - Saudagar Properties',
    features: ['Blue-Chip MNC & Bank Tenants', '9 to 15-Year Long Lease Deeds', 'Built-in 15% Escalation Every 3 Years', 'Immediate Cash Flow from Day 1']
  },
  {
    title: 'Shop-Cum-Office (SCO) Commercial Plots',
    locations: 'Golf Course Ext., Dwarka Expressway & Sohna Rd',
    specs: '100 to 250 Sq. Yds • G+4 Building Approvals',
    pricing: '₹4.50 Cr – ₹16.00 Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    alt: 'SCO Commercial Plots along Golf Course Extension Road - Saudagar Properties',
    features: ['100% Land & Terrace Ownership', 'Zero Maintenance Bureaucracy', 'Flexible Multi-Tenant Leasing', 'Rapid Capital Appreciation']
  }
];

const COMMERCIAL_CORRIDORS = [
  { name: 'DLF Cyber City', desc: 'India’s most iconic tech & financial hub. Home to 500+ Fortune 500 enterprises with unmatched metro connectivity.' },
  { name: 'Golf Course Road', desc: 'The Wall Street of Gurugram. Horizon Centre, One Horizon, and ultra-prime corporate headquarters.' },
  { name: 'Udyog Vihar', desc: 'Strategic corporate & tech hub adjacent to NH-48 and Delhi border. Highly viable rental yields.' },
  { name: 'Golf Course Ext. Road', desc: 'The new high-growth commercial corridor with modern Grade-A IT parks and vibrant retail avenues.' },
  { name: 'MG Road Hub', desc: 'Established retail and corporate district with high transit density and prominent showroom visibility.' },
  { name: 'Dwarka Expressway', desc: 'Next-generation commercial and institutional destination with massive connectivity advantages.' }
];

export default async function CommercialServicesPage() {
  const commercialListings = await getProperties({ category: 'commercial', limit: 4 });
  const breadcrumbs = BREADCRUMBS['/services/commercial'];

  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D]">
      {/* Schema.org Breadcrumb Structured Data */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* ================= HERO SECTION (DARK OPENING SCREEN) ================= */}
      <section className="relative w-full bg-[#0A0E17] text-white pt-32 sm:pt-36 pb-20 md:pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
            alt="Grade-A Commercial Real Estate Tower in Gurugram - Saudagar Properties"
            fill
            priority
            fetchPriority="high"
            className="w-full h-full object-cover filter brightness-75"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17] via-[#0A0E17]/90 to-transparent z-0 pointer-events-none" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.15) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          
          {/* Illuminated Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <Link href="/#services" className="hover:text-[#D09A16] transition-colors">Services</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
              <span>Commercial Advisory</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-[11px] font-bold tracking-widest uppercase mb-5 shadow-[0_0_20px_rgba(208,154,22,0.15)]">
                <Sparkles size={12} className="text-[#D09A16]" />
                <span>Commercial Advisory • Gurugram</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-[1.12] mb-6">
                Grade-A Offices &amp; <br className="hidden sm:inline" />
                <span className="italic font-light text-[#D09A16]">High-Yield Assets</span> in DLF Cybercity
              </h1>

              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8">
                Empowering Fortune 500 enterprises, corporate tenants, and high-net-worth investors with strategic commercial acquisitions, corporate leasing, and high-ROI pre-leased assets across Gurgaon’s premier corridors.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#asset-classes"
                  className="px-7 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Explore Commercial Assets</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="tel:+919811221207"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <PhoneCall size={14} className="text-[#D09A16]" />
                  <span>Call +91 98112 21207</span>
                </a>
              </div>
            </div>

            {/* Right Hero Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#17213D]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs uppercase tracking-wider text-[#9DA6B8]">Enterprise Advisory</span>
                  <span className="text-xs font-semibold text-[#D09A16] flex items-center gap-1">
                    <ShieldCheck size={14} /> Corporate Tenant Desk
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Pre-Leased High ROI Deals</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Vetted commercial investments yielding 8%–9.5% net annual rental income with blue-chip tenants.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <Building size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Direct Developer Mandates</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Preferred institutional pricing with DLF, Horizon, and top Grade-A builders across Gurugram.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center shrink-0 mt-0.5">
                      <Coins size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">End-to-End Lease Structuring</h4>
                      <p className="text-xs text-[#9DA6B8] mt-0.5">Complete legal lease agreements, lock-in period formulation, and security deposit management.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#C9CED9]">
                  <span>Commercial Portfolio Managed</span>
                  <span className="text-[#D09A16] font-semibold">1,000,000+ Sq. Ft.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= COMMERCIAL ASSET CLASSES ================= */}
      <section id="asset-classes" className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
            Strategic Business Spaces
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#17213D]">
            Commercial Real Estate Portfolio
          </h2>
          <p className="text-[#566078] text-sm sm:text-base mt-3 leading-relaxed">
            From modern Grade-A IT offices to high-footfall retail destinations and pre-leased assets, our specialized team delivers verified opportunities tailored to your enterprise goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMMERCIAL_ASSET_CLASSES.map((item, index) => (
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
                <div className="absolute top-4 left-4 bg-[#0E162B]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#D09A16] uppercase tracking-wider">
                  {item.locations}
                </div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#D09A16] font-medium">{item.specs}</p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div className="mb-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1] mb-4">
                    <span className="text-xs uppercase tracking-wider text-[#8A95A7]">Valuation / Lease Rate</span>
                    <span className="text-base font-bold text-[#D09A16] font-serif">{item.pricing}</span>
                  </div>

                  <div className="space-y-2">
                    {item.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#334155]">
                        <CheckCircle2 size={13} className="text-[#D09A16] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact-desk"
                  className="w-full py-3 px-4 rounded-xl bg-[#F7F5EF] group-hover:bg-[#0E162B] text-[#0E162B] group-hover:text-[#F7F5EF] border border-[#17213D]/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <span>Inquire Commercial Asset</span>
                  <ArrowRight size={13} className="text-[#D09A16]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED COMMERCIAL INVENTORY (DARK ALTERNATING SECTION) ================= */}
      <section id="inventory" className="py-20 md:py-24 bg-[#0A0E17] text-white border-y border-white/10 relative overflow-hidden">
        {/* Ambient Glow */}
        <div 
          aria-hidden="true" 
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.1) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                Enterprise Portfolios
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Featured Commercial Assets
              </h2>
            </div>
            <Link
              href="/properties?category=commercial"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#D09A16] uppercase tracking-wider transition-colors"
            >
              <span>View All Commercial Listings</span>
              <ArrowRight size={14} className="text-[#D09A16]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialListings.length > 0 ? (
              commercialListings.map((prop, i) => (
                <div 
                  key={prop._id || prop.id || i}
                  className="bg-white/[0.04] rounded-2xl border border-white/10 hover:border-[#D09A16]/60 overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(208,154,22,0.15)] transition-all duration-300 flex flex-col backdrop-blur-md group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={prop.img || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0A0E17]/90 backdrop-blur-md border border-white/15 text-[#D09A16] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      {prop.tag || "Commercial"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white group-hover:text-[#D09A16] transition-colors mb-1 truncate">{prop.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                        <MapPin size={12} className="text-[#D09A16] shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </p>
                      <p className="text-xs text-slate-300 mb-3 line-clamp-1">{prop.specs}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#D09A16] font-serif">{prop.price}</span>
                      <Link
                        href={prop.slug ? `/properties/${prop.slug}` : prop.link || "/contact"}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-semibold hover:bg-[#D09A16] hover:text-[#0A0E17] transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <p className="text-sm text-slate-300">Confidential off-market commercial mandates currently available upon private inquiry.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= COMMERCIAL CORRIDORS (LIGHT ALTERNATING SECTION) ================= */}
      <section className="py-16 md:py-20 bg-[#F7F5EF] text-[#17213D] border-y border-[#17213D]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
              Corporate Corridors
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#17213D]">
              Gurugram Commercial Micro-Markets
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMERCIAL_CORRIDORS.map((loc, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-white border border-[#17213D]/10 shadow-sm hover:border-[#D09A16]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center font-bold font-serif text-sm">
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

      {/* ================= PRIVATE CORPORATE CONSULTATION BANNER ================= */}
      <section id="contact-desk" className="py-16 bg-[#0E162B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D09A16] block mb-3">
            Corporate Advisory Mandate
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F7F5EF] mb-4">
            Looking to Lease or Invest in Commercial Real Estate?
          </h2>
          <p className="text-[#C9CED9] text-sm sm:text-base max-w-2xl mx-auto mb-8 font-light">
            Whether you require a multi-floor headquarters or a pre-leased commercial property with high rental yield, connect directly with our veteran commercial partners.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
            >
              <span>Schedule Commercial Briefing</span>
              <Send size={13} />
            </Link>

            <a
              href="tel:+919811221207"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs uppercase tracking-wider backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <PhoneCall size={14} className="text-[#D09A16]" />
              <span>Direct Commercial Line</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
