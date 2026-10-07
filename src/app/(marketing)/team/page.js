import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Compass,
  FileCheck
} from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import TeamInteractiveShowcase from '@/components/team/TeamInteractiveShowcase';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

export async function generateMetadata() {
  const seoData = PAGE_SEO['/team'] || {
    title: 'Our Leadership & Advisory Team | Saudagar Properties Gurugram',
    description: 'Meet the founders, leadership, and senior luxury real estate specialists behind Saudagar Properties with 25+ years of authority in DLF Phase 1–5.',
    canonical: '/team',
  };

  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: 'https://www.saudagarproperties.com/team',
      type: 'website',
    },
  };
}

export default function TeamPage() {
  const breadcrumbs = BREADCRUMBS['/team'] || [
    { name: 'Home', url: '/' },
    { name: 'Our Team', url: '/team' }
  ];

  const founders = [
    {
      name: "Mr. Arun Sharma",
      role: "Founder & Managing Director",
      badge: "Founder • 20+ Years Authority",
      experience: "25+ Years in DLF Gurugram",
      image: "https://saudagarproperties.com/wp-content/uploads/2025/12/Arun-Sharma-img.webp",
      bio: "Mr. Arun Sharma is the founding visionary and driving force behind Saudagar Properties Pvt Ltd. With a distinguished real estate advisory career spanning over two decades, his expertise encompasses strategic capital allocation, title due diligence, and an uncompromising fiduciary work ethic. He personally oversees major acquisitions across DLF Phase 1–5, Sushant Lok, and Golf Course Road.",
      highlights: [
        "Over two decades of premier luxury real estate advisory",
        "Personal involvement in high-value private transactions",
        "Pioneering authority across DLF Phase 1–5 freehold estates",
        "Unblemished record of clean titles and trusted closures"
      ],
      quote: "Quality, consistency, and personal dedication are the bedrock of lasting real estate value."
    },
    {
      name: "Mrs. Suneeta Chawla",
      role: "Co-Founder",
      badge: "Co-Founder • 10+ Years Veteran",
      experience: "15+ Years Transaction Specialist",
      image: "https://saudagarproperties.com/wp-content/uploads/2021/01/WhatsApp-Image-2020-09-24-at-6.34.26-PM.jpeg",
      bio: "Our co-founder and esteemed veteran in the Gurugram luxury market, Suneeta Chawla combines pragmatic market intelligence with sharp negotiation instincts. Her ability to match discerning families with bespoke residences has forged lifelong advisory relationships with ultra-high-net-worth clients and corporate leaders.",
      highlights: [
        "Over a decade of high-ticket residential transactions",
        "Specialized in luxury builder floors and private kothis",
        "Pragmatic advisory ensuring high-ROI capital appreciation",
        "Pillar of resourcefulness, client care, and confidentiality"
      ],
      quote: "Resourcefulness and integrity turn property decisions into lifelong generational wealth."
    }
  ];

  const teamMembers = [
    {
      name: "Ankit Sharma",
      designation: "Senior Client Advisory",
      focus: "DLF Phase 1 & 2 Luxury Floors",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/Mohit-2-copy.png",
      bio: "Specializing in prime freehold floor acquisitions and client mandate representation across DLF Phase 1 & 2."
    },
    {
      name: "Bhavishya Sharma",
      designation: "Luxury Investment Specialist",
      focus: "Golf Course Rd Penthouses & Villas",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/Bhavishyasharma-1.png",
      bio: "Advising family offices and NRI investors on high-yield residential assets and premium duplex residences."
    },
    {
      name: "Shyam Upreti",
      designation: "Commercial & Portfolio Lead",
      focus: "Cybercity & Udyog Vihar Grade-A",
      image: "https://saudagarproperties.com/wp-content/uploads/2020/09/shyam-upreti.png",
      bio: "Leading commercial leasing, pre-leased investment desks, and corporate headquarters relocations in Gurugram."
    }
  ];

  const advisoryPillars = [
    {
      icon: 'ShieldCheck',
      title: "100% Freehold Title Verification",
      desc: "Every asset in our catalog undergoes rigorous 30-year registry scrutiny, encumbrance verification, and municipal sanction vetting."
    },
    {
      icon: 'Users',
      title: "Principal-Led Attention",
      desc: "Unlike volume brokerages, every client is directly advised by our senior leadership from site inspection through final deed registration."
    },
    {
      icon: 'FileCheck',
      title: "Zero-Conflict Negotiations",
      desc: "We operate with total fiduciary clarity, providing transparent market benchmarks and authentic seller-direct pricing."
    },
    {
      icon: 'Compass',
      title: "Confidential Off-Market Access",
      desc: "Private access to discreet, unlisted DLF Phase 1–5 kothis and penthouse residences not found on public portals."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#121A2F]">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <OrganizationJsonLd />

      {/* =========================================================================
          1. EDITORIAL HEADER & TEAM MISSION (DARK LUXURY OPENING SCREEN)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A0E17] text-white pt-32 sm:pt-36 pb-20 md:pb-24 border-b border-white/10">
        {/* Background Architectural Vignette & Parallax Depth */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
            alt="DLF Luxury Estate Architecture"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0A0E17]/80 to-[#0A0E17]" />
        </div>

        {/* Ambient Golden Glow Beams */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208,154,22,0.15) 0%, rgba(208,154,22,0) 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Illuminated Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
              <span>Our Team</span>
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D09A16]/40 text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(208,154,22,0.15)]">
              <Users size={14} className="text-[#D09A16]" />
              <span>Saudagar Properties Advisory Board</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight mb-6">
              Our Leadership &amp; <span className="italic font-serif text-[#D09A16]">Advisory Principals</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl mx-auto">
              For more than 25 years, Saudagar Properties has provided confidential, principal-led counsel to discerning families, corporate leaders, and NRI investors acquiring prime estates across DLF Phase 1–5, Sushant Lok, and Golf Course Road.
            </p>

            {/* Quick Metrics Bar in Dark Luxury Theme */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center hover:border-[#D09A16]/40 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">25+</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Years of Trust</span>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center hover:border-[#D09A16]/40 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D09A16]">₹100 Cr+</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Saved for Clients</span>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center hover:border-[#D09A16]/40 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">1,000+</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Families Advised</span>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center hover:border-[#D09A16]/40 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D09A16]">100%</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Title-Cleared</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE 3D SPLIT SHOWCASE (SECTIONS 2-5: LIGHT & DARK ALTERNATING)
      ========================================================================= */}
      <TeamInteractiveShowcase
        founders={founders}
        teamMembers={teamMembers}
        advisoryPillars={advisoryPillars}
      />

    </div>
  );
}
