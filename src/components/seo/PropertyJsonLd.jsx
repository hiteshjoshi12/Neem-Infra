import React from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS_INFO } from '@/lib/seo/seoConfig';
import { cleanSchema } from '@/lib/seo/schemaBuilders';

export default function PropertyJsonLd({ property, baseUrl = SITE_URL }) {
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

  const propertyUrl = `${baseUrl}/properties/${property.slug || property._id || property.id}`;
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : (property.img ? [property.img] : []);

  // Determine architectural entity type
  const isCommercial = property.category === 'commercial';
  const isIndustrial = property.category === 'industrial';
  const residenceType = isCommercial
    ? 'CommercialBuilding'
    : isIndustrial
      ? 'Warehouse'
      : (property.title?.toLowerCase().includes('villa') || property.category === 'villa' ? 'SingleFamilyResidence' : 'Apartment');

  const schema = cleanSchema({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${propertyUrl}#listing`,
    "name": property.title,
    "description": property.desc || property.title,
    "url": propertyUrl,
    "image": images.length > 0 ? images : undefined,
    "datePosted": property.createdAt ? new Date(property.createdAt).toISOString() : undefined,
    "dateModified": property.updatedAt ? new Date(property.updatedAt).toISOString() : undefined,
    "category": property.category || "residential",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": numericPrice || "0",
      ...(numericPrice ? {} : {
        "priceSpecification": {
          "@type": "PriceSpecification",
          "description": "Price on Request"
        }
      }),
      "availability": "https://schema.org/InStock",
      "businessFunction": "https://schema.org/SellAction",
      "seller": {
        "@type": "RealEstateAgent",
        "@id": `${baseUrl}/#organization`,
        "name": BUSINESS_INFO.name,
        "telephone": BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
        "url": baseUrl,
      }
    },
    "mainEntity": {
      "@type": residenceType,
      "@id": `${propertyUrl}#property`,
      "name": property.title,
      "description": property.desc || property.title,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.location || "DLF Phase 2",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122002",
        "addressCountry": "IN"
      },
      "numberOfRooms": property.bhk ? String(property.bhk) : undefined,
      "numberOfBathroomsTotal": property.bathrooms ? Number(property.bathrooms) : undefined,
      "floorSize": property.builtUpArea || property.plotArea ? {
        "@type": "QuantitativeValue",
        "value": property.builtUpArea || property.plotArea,
        "unitText": property.plotArea?.includes('Yard') ? 'Square Yards' : 'Square Feet'
      } : undefined,
      "amenityFeature": (property.features || []).map((feat) => ({
        "@type": "LocationFeatureSpecification",
        "name": feat,
        "value": true
      })),
    }
  });

  return <JsonLd data={schema} />;
}
