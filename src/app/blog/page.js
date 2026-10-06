import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

export async function generateMetadata() {
  const seoData = PAGE_SEO['/blog'] || { title: 'Blog | Saudagar Properties', description: 'Real estate insights and news.' };
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical || '/blog',
    },
  };
}

export default function BlogIndexPage() {
  const breadcrumbs = BREADCRUMBS['/blog'] || [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  return (
    <PublicLayout>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="w-full min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1D263B] mb-6">Real Estate Insights</h1>
          <p className="text-[#475569] text-lg mb-8">
            Our blog is currently under development. Soon, we will share expert advice, market trends, and property highlights here.
          </p>
          <div className="inline-block px-6 py-2 bg-[#D09A16]/10 text-[#D09A16] rounded-full font-semibold uppercase tracking-wider text-sm border border-[#D09A16]/20">
            Coming Soon
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
