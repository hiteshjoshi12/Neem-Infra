import PublicLayout from '@/layouts/PublicLayout';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ')} | Saudagar Properties Blog`,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  return (
    <PublicLayout>
      <div className="w-full min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E8E4DA] text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D263B] mb-8 capitalize">{slug.replace(/-/g, ' ')}</h1>
          <p className="text-[#475569] text-lg">
            This article is part of our upcoming blog system. Stay tuned!
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
