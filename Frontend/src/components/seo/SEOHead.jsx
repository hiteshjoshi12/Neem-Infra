import { useEffect } from 'react';
import { DEFAULT_META, SITE_NAME, SITE_URL, DEFAULT_LOCALE } from '../../lib/seo/seoConfig';

/**
 * SEOHead — Declarative metadata management for React SPA
 * ========================================================
 * Dynamically updates <title>, <meta>, <link rel="canonical">, Open Graph,
 * and Twitter Card tags in the document <head>.
 *
 * Usage:
 *   <SEOHead
 *     title="About Us — Saudagar Properties"
 *     description="Learn about our 25+ year legacy..."
 *     canonical="/about"
 *     ogType="website"
 *   />
 *
 * All props are optional — defaults are pulled from seoConfig.js.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogType,
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard,
  noindex = false,
  nofollow = false,
  children,
}) {
  const resolvedTitle = title || DEFAULT_META.title;
  const resolvedDescription = description || DEFAULT_META.description;
  const resolvedCanonical = canonical
    ? `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : `${SITE_URL}/`;
  const resolvedOgType = ogType || DEFAULT_META.ogType;
  const resolvedOgImage = ogImage || DEFAULT_META.ogImage;
  const resolvedOgTitle = ogTitle || resolvedTitle;
  const resolvedOgDescription = ogDescription || resolvedDescription;
  const resolvedTwitterCard = twitterCard || DEFAULT_META.twitterCard;

  // Build robots directive
  const robotsParts = [];
  robotsParts.push(noindex ? 'noindex' : 'index');
  robotsParts.push(nofollow ? 'nofollow' : 'follow');
  const robotsContent = robotsParts.join(', ');

  useEffect(() => {
    // Title
    document.title = resolvedTitle;

    // Helper to set or create a meta tag
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set or create a link tag
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Core meta tags
    setMeta('name', 'description', resolvedDescription);
    setMeta('name', 'robots', robotsContent);

    // Canonical
    setLink('canonical', resolvedCanonical);

    // Open Graph
    setMeta('property', 'og:title', resolvedOgTitle);
    setMeta('property', 'og:description', resolvedOgDescription);
    setMeta('property', 'og:type', resolvedOgType);
    setMeta('property', 'og:url', resolvedCanonical);
    setMeta('property', 'og:image', resolvedOgImage);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', DEFAULT_LOCALE);

    // Twitter Card
    setMeta('name', 'twitter:card', resolvedTwitterCard);
    setMeta('name', 'twitter:title', resolvedOgTitle);
    setMeta('name', 'twitter:description', resolvedOgDescription);
    setMeta('name', 'twitter:image', resolvedOgImage);

    // Cleanup: Reset to defaults on unmount
    return () => {
      document.title = DEFAULT_META.title;
      setMeta('name', 'description', DEFAULT_META.description);
      setMeta('name', 'robots', 'index, follow');
      setLink('canonical', `${SITE_URL}/`);
      setMeta('property', 'og:title', DEFAULT_META.title);
      setMeta('property', 'og:description', DEFAULT_META.description);
      setMeta('property', 'og:type', DEFAULT_META.ogType);
      setMeta('property', 'og:url', `${SITE_URL}/`);
      setMeta('property', 'og:image', DEFAULT_META.ogImage);
    };
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedCanonical,
    resolvedOgType,
    resolvedOgImage,
    resolvedOgTitle,
    resolvedOgDescription,
    resolvedTwitterCard,
    robotsContent,
  ]);

  // This component renders nothing — it only manages <head> side-effects
  return null;
}
