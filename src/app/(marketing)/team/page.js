import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import TeamClientView from '@/components/team/TeamClientView';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';
import { getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';
import { connectDB } from '@/lib/mongodb';
import SectionContent from '@/models/SectionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return await getDynamicPageSeo('/team', {
    title: PAGE_SEO['/team']?.title,
    description: PAGE_SEO['/team']?.description,
    canonical: '/team',
  });
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

export default async function TeamPage() {
  const pageData = await getTeamData();
  const breadcrumbs = BREADCRUMBS['/team'] || [
    { name: 'Home', url: '/' },
    { name: 'Our Team', url: '/team' }
  ];

  const defaultFounders = [
    { name: 'Arun Sharma', role: 'Founder & Managing Director' },
    { name: 'Suneeta Chawla', role: 'Co-Founder & Director' }
  ];

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-obsidian">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <OrganizationJsonLd />
      <TeamClientView
        initialData={pageData}
        defaultFounders={pageData?.founders?.length ? pageData.founders : defaultFounders}
        teamMembers={pageData?.teamMembers?.length ? pageData.teamMembers : []}
        advisoryPillars={pageData?.advisoryPillars?.length ? pageData.advisoryPillars : []}
      />
    </div>
  );
}
