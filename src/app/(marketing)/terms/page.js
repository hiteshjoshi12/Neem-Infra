import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

export async function generateMetadata() {
  const seoData = PAGE_SEO['/terms'];
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default function Terms() {
  const breadcrumbs = BREADCRUMBS['/terms'] || [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E8E4DA]">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D263B] mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-[#475569]">
          <p className="lead text-xl text-[#1D263B] mb-8">
            Please read these terms of service carefully before using Saudagar Properties website or engaging with our consulting services.
          </p>
          
          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.
          </p>

          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">2. Property Information</h2>
          <p className="mb-4">
            The property information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, pricing, or related graphics.
          </p>

          <h2 className="text-xl font-bold text-[#1D263B] mt-8 mb-4">3. Advisory Services</h2>
          <p className="mb-4">
            Any advisory or consulting services provided by Saudagar Properties are subject to separate definitive agreements. Website content does not constitute binding legal, financial, or real estate advice.
          </p>
        </div>
      </div>
    </div>
  );
}
