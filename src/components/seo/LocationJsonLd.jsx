import React from 'react';
import JsonLd from './JsonLd';
import { buildLocationGraph } from '@/lib/seo/schemaBuilders';

/**
 * Server-rendered Connected Schema.org JSON-LD Graph for Location Pages
 * Connects WebSite, RealEstateAgent, Place, WebPage, BreadcrumbList, and FAQPage.
 */
export default function LocationJsonLd({ location, breadcrumbs = [], faqs = [] }) {
  if (!location) return null;

  const graph = buildLocationGraph({ location, breadcrumbs, faqs });
  if (!graph) return null;

  return <JsonLd data={graph} id={`schema-location-${location.slug || 'geo'}`} />;
}
