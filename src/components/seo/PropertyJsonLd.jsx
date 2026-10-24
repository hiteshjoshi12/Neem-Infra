import React from 'react';
import JsonLd from './JsonLd';
import { BUSINESS_INFO } from '@/lib/seo/seoConfig';
import { cleanSchema } from '@/lib/seo/schemaBuilders';

export default function PropertyJsonLd({ property, baseUrl = 'https://saudagarproperties.com' }) {
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

  const propertyUrl = `${baseUrl.replace(/\/+$/, '')}/properties/${property.slug || property._id || property.id}`;
  // Filter out stock or broken image URLs so only authentic assets appear in structured data
  const rawImages = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : (property.img ? [property.img] : []);
  const images = rawImages.filter(
    (img) => typeof img === 'string' && img.trim() && !img.includes('unsplash.com') && !img.includes('/wp-content/uploads/')
  );

  // Determine architectural entity type
  const isCommercial = property.category === 'commercial';
  const isIndustrial = property.category === 'industrial';
  const residenceType = isCommercial
    ? 'CommercialBuilding'
    : isIndustrial
      ? 'Warehouse'
      : (property.title?.toLowerCase().includes('villa') || property.category === 'villa' ? 'SingleFamilyResidence' : 'Apartment');

  // Determine numeric bedrooms, bathrooms, and floor size
  let numericBedrooms = undefined;
  if (property.bhk) {
    const match = String(property.bhk).match(/([0-9]+)/);
    if (match) {
      numericBedrooms = parseInt(match[1], 10);
    }
  }

  let numericBathrooms = undefined;
  if (property.bathrooms) {
    const match = String(property.bathrooms).match(/([0-9]+)/);
    if (match) {
      numericBathrooms = parseInt(match[1], 10);
    }
  }

  let numericFloorSize = undefined;
  const rawArea = property.builtUpArea || property.plotArea;
  if (rawArea) {
    const match = String(rawArea).match(/([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)/);
    if (match) {
      numericFloorSize = parseFloat(match[1].replace(/,/g, ''));
    }
  }

  const schema = cleanSchema({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${propertyUrl}#listing`,
    "name": property.title,
    "description": property.desc || property.title,
    "url": propertyUrl,
    "image": images.length > 0 ? images : undefined,
    // Item D: Remove datePosted/dateModified unless real original date exists in legacy data
    "datePosted": property.legacyOriginalDate ? new Date(property.legacyOriginalDate).toISOString() : undefined,
    "dateModified": property.legacyModifiedDate ? new Date(property.legacyModifiedDate).toISOString() : undefined,
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
      "numberOfBedrooms": numericBedrooms,
      "numberOfBathroomsTotal": numericBathrooms,
      "floorSize": numericFloorSize ? {
        "@type": "QuantitativeValue",
        "value": numericFloorSize,
        "unitCode": "FTK"
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
