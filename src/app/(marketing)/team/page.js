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
import TeamClientView from '@/components/team/TeamClientView';
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
      <TeamClientView
        defaultFounders={founders}
        teamMembers={teamMembers}
        advisoryPillars={advisoryPillars}
      />
    </div>
  );
}
