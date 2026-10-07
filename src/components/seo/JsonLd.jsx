import React from 'react';
import { cleanSchema } from '@/lib/seo/schemaBuilders';

/**
 * JsonLd — Renders Schema.org JSON-LD structured data in Server & Client Components
 * =================================================================================
 * Injects a crawlable <script type="application/ld+json"> directly into the SSR HTML.
 * Sanitizes input with cleanSchema() to ensure zero undefined/null/empty fields.
 * Safe JSON serialization prevents script tag injection vulnerabilities.
 *
 * Usage:
 *   <JsonLd data={schemaObject} />
 *   or
 *   <JsonLd schema={schemaObject} />
 */
export default function JsonLd({ data, schema }) {
  const payload = cleanSchema(data || schema);
  if (!payload || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
    return null;
  }

  // Escape '<' to prevent script tag injection attacks in HTML parsers
  const jsonString = JSON.stringify(payload).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
