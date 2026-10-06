import { getPropertyBySlug } from '@/services/propertyService';
import PublicLayout from '@/layouts/PublicLayout';
import { notFound } from 'next/navigation';
import PropertyJsonLd from '@/components/seo/PropertyJsonLd';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  
  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: `${property.title} | Saudagar Properties`,
    description: property.desc.substring(0, 160),
    alternates: {
      canonical: `/properties/${slug}`,
    },
    openGraph: {
      images: [property.img],
    }
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <PublicLayout>
      <PropertyJsonLd property={property} />
      <div className="w-full min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-[#E8E4DA] overflow-hidden">
            <div className="w-full h-[40vh] md:h-[60vh] relative">
              <Image
                src={property.img} 
                alt={property.title}
                fill
                priority
                sizes="100vw"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="flex gap-3 mb-4">
                  {property.tag && (
                    <span className="bg-[#D09A16] text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider">
                      {property.tag}
                    </span>
                  )}
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border border-white/30">
                    {property.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{property.title}</h1>
                <p className="text-white/90 flex items-center gap-2 text-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {property.location}
                </p>
              </div>
            </div>
            
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#1D263B] mb-4">Overview</h2>
                  <p className="text-[#475569] leading-relaxed whitespace-pre-wrap">{property.desc}</p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-[#1D263B] mb-4">Specifications</h2>
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DA]">
                    <p className="text-[#1D263B] font-medium">{property.specs}</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-[#1D263B] rounded-2xl p-6 text-white sticky top-32">
                  <h3 className="text-xl font-bold mb-2">Interested?</h3>
                  <div className="text-3xl font-serif text-[#D09A16] mb-6">{property.price}</div>
                  <p className="text-sm text-slate-300 mb-8">Contact us to schedule a site visit or get more details about this property.</p>
                  <a 
                    href="/contact"
                    className="block w-full text-center py-4 rounded-xl bg-[#D09A16] hover:bg-[#B39366] text-white font-bold tracking-wider uppercase text-sm transition-colors"
                  >
                    Inquire Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
