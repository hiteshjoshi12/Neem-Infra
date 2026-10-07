import React from 'react';
import JsonLd from './JsonLd';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schemaBuilders';

/**
 * OrganizationJsonLd — Renders Organization + LocalBusiness + WebSite Connected Graph
 * ====================================================================================
 * Connects WebSite (#website) and Organization/RealEstateAgent (#organization)
 * into a single unified Schema.org graph for authoritative business entity discovery.
 * Uses real, verified Saudagar Properties business data with zero fabricated fields.
 */
export default function OrganizationJsonLd() {
  const organization = buildOrganizationSchema();
  const website = buildWebSiteSchema();

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [website, organization].filter(Boolean),
  };

  return <JsonLd data={graph} />;
}
