import JsonLd from './JsonLd';

/**
 * FAQJsonLd — Schema.org FAQPage structured data
 * =============================================================
 * Accepts an array of FAQ items and renders FAQPage JSON-LD.
 *
 * Usage:
 *   <FAQJsonLd faqs={[
 *     { question: 'What is Saudagar Properties?', answer: 'We are a luxury real estate consultancy.' },
 *     { question: 'Where are you located?', answer: 'Our office is in DLF Phase 2, Gurugram.' }
 *   ]} />
 */
export default function FAQJsonLd({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
