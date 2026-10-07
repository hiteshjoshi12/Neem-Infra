import React from 'react';
import JsonLd from './JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo/schemaBuilders';

/**
 * BreadcrumbJsonLd — Schema.org BreadcrumbList structured data
 * =============================================================
 * Accepts an array of real breadcrumb items and renders BreadcrumbList JSON-LD.
 * Uses crawlable absolute URLs for all items and 1-based sequential positioning.
 *
 * Usage:
 *   <BreadcrumbJsonLd items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'About Us', url: '/about' }
 *   ]} />
 */
export default function BreadcrumbJsonLd({ items }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const schema = buildBreadcrumbSchema(items);
  if (!schema) return null;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        ...schema,
      }}
    />
  );
}
