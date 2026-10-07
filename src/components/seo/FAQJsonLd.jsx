import React from 'react';
import JsonLd from './JsonLd';
import { buildFAQSchema } from '@/lib/seo/schemaBuilders';

/**
 * FAQJsonLd — Schema.org FAQPage structured data
 * ===============================================
 * Only generates FAQPage markup when real, visible questions and answers are present.
 * Never outputs empty questions, placeholders, or fabricated answers.
 *
 * Usage:
 *   <FAQJsonLd faqs={[
 *     { question: '...', answer: '...' }
 *   ]} />
 */
export default function FAQJsonLd({ faqs }) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const schema = buildFAQSchema(faqs);
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
