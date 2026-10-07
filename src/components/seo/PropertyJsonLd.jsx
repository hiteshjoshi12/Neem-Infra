import React from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS_INFO } from '@/lib/seo/seoConfig';

export default function PropertyJsonLd({ property }) {
  if (!property) return null;

  let numericPrice = '';
  if (property.price) {
    const rawPrice = String(property.price).toLowerCase();
    const match = rawPrice.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      if (rawPrice.includes('cr') || rawPrice.includes('crore')) {
        numericPrice = String(Math.round(num * 10000000));
      } else if (rawPrice.includes('lakh') || rawPrice.includes('lac')) {
        numericPrice = String(Math.round(num * 100000));
      } else {
        numericPrice = String(Math.round(num));
      }
    }
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "image": property.img,
    "description": property.desc || property.title,
    "sku": String(property._id || property.id || property.slug || 'saudagar-property'),
    ...(numericPrice ? {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": numericPrice,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "RealEstateAgent",
          "name": BUSINESS_INFO.name,
        }
      }
    } : {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "0",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "description": "Price on Request"
        },
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "RealEstateAgent",
          "name": BUSINESS_INFO.name,
        }
      }
    })
  };

  return <JsonLd data={schema} />;
}
