import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

export async function generateMetadata() {
  const seoData = PAGE_SEO['/privacy-policy'];
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default function PrivacyPolicy() {
  const breadcrumbs = BREADCRUMBS['/privacy-policy'] || [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E8E4DA]">
        {/* Illuminated Breadcrumb Navigation */}
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#566078] mb-6">
          <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
          <span className="text-[#8892A6]">/</span>
          <span className="text-[#D09A16] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
            <span>Privacy Policy</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D263B] mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-[#475569]">
          <p className="lead text-xl text-[#1D263B] mb-8">
            At Saudagar Properties, we are committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal information.
          </p>
          
          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you voluntarily provide to us when expressing an interest in obtaining information about us or our properties, when participating in activities on the website, or otherwise when contacting us. This includes names, phone numbers, email addresses, and property requirements.
          </p>

          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>
        </div>
      </div>
    </div>
  );
}
