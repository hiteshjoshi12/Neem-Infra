import { getProperties } from '@/services/propertyService';
import PublicLayout from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'All Properties | Saudagar Properties',
  description: 'Browse all luxury properties, builder floors, and commercial spaces in DLF Gurugram.',
};

export default async function PropertiesPage() {
  const properties = await getProperties({ all: false });

  return (
    <PublicLayout>
      <div className="w-full min-h-screen bg-[#FAF8F5] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1D263B] mb-8">All Properties</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <div key={property._id} className="bg-white rounded-2xl shadow-sm border border-[#E8E4DA] overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <Image
                    src={property.img} 
                    alt={property.title}
                    width={600}
                    height={450}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {property.tag && (
                    <div className="absolute top-4 left-4 bg-[#D09A16] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {property.tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1D263B] mb-2">{property.title}</h3>
                  <p className="text-[#475569] text-sm mb-4">{property.location}</p>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#D09A16] font-bold text-lg">{property.price}</span>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{property.category}</span>
                  </div>
                  <Link 
                    href={property.slug ? `/properties/${property.slug}` : property.link || '#'}
                    className="block w-full text-center py-3 rounded-xl border border-[#D09A16] text-[#D09A16] font-semibold hover:bg-[#D09A16] hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
