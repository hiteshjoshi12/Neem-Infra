import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';
import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTermsData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_terms' }).lean();
    if (doc?.data) return doc.data;
  } catch (err) {
    console.warn('[Terms] DB fetch fallback:', err?.message);
  }
  return DEFAULT_SECTIONS.page_terms;
}

export async function generateMetadata() {
  const seoData = PAGE_SEO['/terms'];
  return {
    title: { absolute: seoData.title },
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default async function Terms() {
  const breadcrumbs = BREADCRUMBS['/terms'] || [];
  const termsData = await getTermsData();

  const hero = termsData?.hero || DEFAULT_SECTIONS.page_terms.hero;
  const sections = termsData?.sections || DEFAULT_SECTIONS.page_terms.sections;

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
            <span>Terms of Service</span>
          </span>
        </div>

        {hero.badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-[#D09A16]/10 text-[#D09A16] text-[11px] font-bold uppercase tracking-widest mb-3">
            {hero.badge}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D263B] mb-4">
          {hero.title || "Terms of Service"}
        </h1>

        {hero.subtitle && (
          <p className="text-base text-[#566078] mb-8 font-sans">
            {hero.subtitle}
          </p>
        )}
        
        <div className="prose prose-lg text-[#475569] space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-[#E8E4DA]/60 pb-6 last:border-b-0 last:pb-0">
              <h2 className="text-xl font-bold text-[#1D263B] mb-3">
                {section.heading}
              </h2>
              <p className="leading-relaxed text-[#475569]">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
