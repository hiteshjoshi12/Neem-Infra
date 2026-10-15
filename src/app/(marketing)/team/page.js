import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import TeamClientView from '@/components/team/TeamClientView';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function getTeamData() {
  try {
    await connectDB();
    const doc = await SectionContent.findOne({ sectionKey: 'page_team' }).lean();
    return doc?.data || null;
  } catch (err) {
    console.error('Error fetching page_team from DB:', err?.message);
    return null;
  }
}

import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export default async function TeamPage() {
  const pageData = await getTeamData();
  const breadcrumbs = BREADCRUMBS['/team'] || [
    { name: 'Home', url: '/' },
    { name: 'Our Team', url: '/team' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D] selection:bg-[#D09A16] selection:text-[#0A0E17]">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <OrganizationJsonLd />
      <TeamClientView
        initialData={pageData}
        defaultFounders={pageData?.founders?.length ? pageData.founders : DEFAULT_SECTIONS.page_team.founders}
        teamMembers={pageData?.teamMembers?.length ? pageData.teamMembers : DEFAULT_SECTIONS.page_team.teamMembers}
        advisoryPillars={pageData?.advisoryPillars?.length ? pageData.advisoryPillars : DEFAULT_SECTIONS.page_team.advisoryPillars}
      />
    </div>
  );
}
