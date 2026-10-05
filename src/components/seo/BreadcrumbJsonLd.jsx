import JsonLd from './JsonLd';
import { SITE_URL } from '../../lib/seo/seoConfig';

/**
 * BreadcrumbJsonLd — Schema.org BreadcrumbList structured data
 * =============================================================
 * Accepts an array of breadcrumb items and renders BreadcrumbList JSON-LD.
 *
 * Usage:
 *   <BreadcrumbJsonLd items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'About Us', url: '/about' }
 *   ]} />
 */
export default function BreadcrumbJsonLd({ items }) {
  if (!items || items.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url === '/' ? '' : item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}
