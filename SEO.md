# Saudagar Properties — SEO Documentation & Guidelines

This document outlines the SEO infrastructure implemented for Saudagar Properties. As the project grows, developers must follow these guidelines to ensure maximum search visibility, technical health, and AI/AEO readiness.

---

## 1. The SEO Infrastructure

The website uses a modular SEO system built for React/Vite SPAs.

### Key Components

- **`seoConfig.js`** (`/src/lib/seo/seoConfig.js`)
  The Single Source of Truth. Contains business entity info, default metadata, per-page SEO titles/descriptions, and breadcrumbs. **Update this file when adding new routes.**
  
- **`<SEOHead>`** (`/src/components/seo/SEOHead.jsx`)
  The core metadata injector. Automatically sets `<title>`, `<meta name="description">`, canonical URLs, Open Graph, and Twitter Cards.
  
- **`<JsonLd>`** (`/src/components/seo/JsonLd.jsx`)
  Injects structured data into the DOM safely.
  
- **`<OrganizationJsonLd>`** (`/src/components/seo/OrganizationJsonLd.jsx`)
  Establishes the business entity (LocalBusiness/RealEstateAgent). Loaded globally in `PublicLayout`.
  
- **`<BreadcrumbJsonLd>`** (`/src/components/seo/BreadcrumbJsonLd.jsx`)
  Adds BreadcrumbList schema for rich search results.

---

## 2. How to Create a New Public Page

Whenever you add a new route (e.g., `/services/commercial`), you MUST configure its SEO:

### Step 1: Update `seoConfig.js`
Add the page's metadata to `PAGE_SEO` and `BREADCRUMBS`:

```javascript
export const PAGE_SEO = {
  // ... existing routes
  '/services/commercial': {
    title: 'Commercial Real Estate Gurugram — Saudagar Properties',
    description: 'Explore premium commercial office spaces in Udyog Vihar and Golf Course Road.',
    canonical: '/services/commercial',
  }
};

export const BREADCRUMBS = {
  // ... existing breadcrumbs
  '/services/commercial': [
    { name: 'Home', url: '/' },
    { name: 'Commercial', url: '/services/commercial' }
  ]
};
```

### Step 2: Add `<SEOHead>` to the Component
Inside the new page component, use `useLocation` to fetch and inject the metadata:

```javascript
import { useLocation } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '../../lib/seo/seoConfig';

export default function CommercialPage() {
  const currentPath = useLocation().pathname;

  return (
    <div>
      <SEOHead {...(PAGE_SEO[currentPath] || PAGE_SEO['/'])} />
      <BreadcrumbJsonLd items={BREADCRUMBS[currentPath]} />
      {/* Page Content */}
    </div>
  );
}
```

### Step 3: Add to `sitemap.xml`
Manually add the new URL to `/public/sitemap.xml` to ensure Google crawls it immediately.

---

## 3. Creating Private / Admin Pages

Admin dashboards, API endpoints, or user portal pages MUST NOT be indexed.

Use the `noindex` prop in `<SEOHead>`:

```javascript
<SEOHead title="Dashboard" noindex={true} />
```

*(Note: `/admin/*` is already blocked in `/public/robots.txt`, but adding `noindex` is good defense-in-depth).*

---

## 4. URL & Routing Conventions

URLs represent the site architecture. Follow these rules:
- **Lowercase only**: `/services/dlf-phase-1` (not `/Services/DLF`)
- **Hyphen separated**: Use hyphens, never underscores or spaces.
- **Hierarchical**: `/blog/real-estate-trends` (not `/blog-real-estate-trends`)
- **No trailing slashes**: Vite handles trailing slashes, but canonical URLs in `seoConfig.js` should omit them for consistency (except the root `/`).

---

## 5. Image SEO Rules

Search engines and Web Vitals rely heavily on image markup.

1. **Descriptive `alt` tags**: 
   - ✅ `alt="DLF Phase 1 Luxury Builder Floor Interior"`
   - ❌ `alt="house"`
2. **Width and Height**: Always provide `width` and `height` attributes to prevent Cumulative Layout Shift (CLS).
3. **LCP Prioritization**: The largest above-the-fold image (Hero image) MUST have `fetchpriority="high"`.
4. **Lazy Loading**: Below-the-fold images should have `loading="lazy"`.

---

## 6. AEO (Answer Engine Optimization) & GEO Rules

With AI search engines (Perplexity, ChatGPT, Gemini) growing, content must be machine-readable:

- **Entity Clarity**: Always refer to the company as "Saudagar Properties" or "Saudagar Properties Pvt. Ltd."
- **Direct Answers**: When writing content, use concise `<p>` tags immediately following a heading.
- **FAQ Schema**: If a page has FAQs, use the `<FAQJsonLd>` component to add FAQPage schema.

```javascript
import FAQJsonLd from '../../components/seo/FAQJsonLd';

<FAQJsonLd faqs={[
  { question: 'What is Saudagar Properties?', answer: 'We are a luxury real estate consultancy.' }
]} />
```

---

## ✅ New Page SEO Development Checklist

Before merging a PR or deploying a new public page, verify:

- [ ] **URL Structure**: Is the URL lowercase and hyphen-separated?
- [ ] **SEOConfig**: Has `PAGE_SEO` been updated with a unique title and description?
- [ ] **Breadcrumbs**: Has `BREADCRUMBS` been updated?
- [ ] **SEOHead**: Is `<SEOHead>` rendering on the page?
- [ ] **H1 Tag**: Is there exactly ONE `<h1>` on the page?
- [ ] **Heading Hierarchy**: Do headings logically follow H1 → H2 → H3 without skipping?
- [ ] **Image Alt Text**: Do all meaningful `<img>` tags have descriptive `alt` text?
- [ ] **Image CLS**: Do all images have `width` and `height` attributes?
- [ ] **LCP Priority**: Does the main hero image have `fetchpriority="high"`?
- [ ] **Sitemap**: Was the URL added to `/public/sitemap.xml`?
- [ ] **Mobile**: Does the page render properly on mobile screens?
