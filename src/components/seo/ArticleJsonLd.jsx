import React from 'react';
import JsonLd from './JsonLd';
import { buildArticleGraph } from '@/lib/seo/schemaBuilders';

/**
 * ArticleJsonLd — Schema.org Connected Graph for Published Blog Articles
 * =======================================================================
 * Generates a connected JSON-LD graph linking:
 * - WebPage (#webpage)
 * - BreadcrumbList (#breadcrumb)
 * - Person / Author (#author)
 * - BlogPosting (#article)
 * - FAQPage (only when real, visible FAQs exist on the page)
 *
 * All image and author URLs are crawlable absolute URLs.
 * Never fabricates missing data.
 */
export default function ArticleJsonLd({ post, breadcrumbs, faqs }) {
  if (!post) return null;

  const graph = buildArticleGraph({
    post,
    breadcrumbs,
    faqs: faqs || post.faq,
    includeGlobalEntities: true,
  });

  if (!graph) return null;

  return <JsonLd data={graph} />;
}
