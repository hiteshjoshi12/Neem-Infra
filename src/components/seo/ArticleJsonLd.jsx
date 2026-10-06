import React from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS_INFO } from '@/lib/seo/seoConfig';

export default function ArticleJsonLd({ post }) {
  if (!post) return null;

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const authorName = post.author?.name || 'Saudagar Properties';
  const authorUrl = post.author?.slug 
    ? `${SITE_URL}/blog/author/${post.author.slug}` 
    : SITE_URL;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: post.title,
    description: post.excerpt || post.seoDescription,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
      jobTitle: post.author?.jobTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    articleSection: post.category?.name || 'Real Estate Advisory',
    keywords: [
      post.focusKeyword,
      ...(post.secondaryKeywords || []),
      ...(post.tags || []).map(t => t.name || t)
    ].filter(Boolean).join(', '),
  };

  return <JsonLd schema={schema} />;
}
