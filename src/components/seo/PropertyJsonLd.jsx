import React from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS_INFO } from '@/lib/seo/seoConfig';

export default function PropertyJsonLd({ property }) {
  if (!property) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product", // Since RealEstateListing is pending, Product or Residence is often used
    "name": property.title,
    "image": property.img,
    "description": property.desc,
    "sku": property._id,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": property.price.replace(/[^0-9.]/g, ''), // Very rough extraction
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": BUSINESS_INFO.name,
      }
    }
  };

  return <JsonLd data={schema} />;
}
