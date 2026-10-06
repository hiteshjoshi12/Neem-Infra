# Saudagar Properties — Modern Next.js SEO, AEO & GEO Architecture

This document is the definitive master specification for **Search Engine Optimization (SEO)**, **Answer Engine Optimization (AEO)**, and **Generative Engine Optimization (GEO)** across the Saudagar Properties web platform.

Whenever developers or AI agents add new pages or modify existing routes, follow this document to ensure 100% compliance.

---

## 🚀 Quick Run: Automated SEO / AEO / GEO Deep Audit

To run a deep audit of the entire site and verify all SEO, AEO, and GEO signals across every route in `src/app`:

```bash
npm run seo:check
```

*(Alternatively: `node scripts/audit-seo.mjs`)*

### What the Audit Verifies:
1. **Technical Crawl Infrastructure**: Dynamic `sitemap.js` (with MongoDB property sync) and `robots.js` (no duplicate/shadowing static files).
2. **Server-Side Metadata**: Every public page exports server-rendered `metadata` or `generateMetadata()`.
3. **Canonical URLs**: Every public page specifies an explicit canonical URL (`alternates.canonical`).
4. **AEO Breadcrumbs**: Every public page implements Schema.org `BreadcrumbList` via `<BreadcrumbJsonLd>`.
5. **GEO Knowledge Graph**: Organization, `RealEstateAgent`, `LocalBusiness`, geo-coordinates, and `sameAs` authority links via `<OrganizationJsonLd>`.
6. **Semantic Integrity**: Exactly one `<h1>` per page, responsive image markup, and protected private routes (`/admin`, `/api`).

---

## 🏛️ Architecture Overview (Next.js 16 App Router)

Next.js App Router relies on **Server Components and native Route Handlers**. Client-side `<head>` manipulation (`<SEOHead>` / `document.createElement`) is obsolete. All metadata must be pre-rendered on the server so AI bots and search engine crawlers receive complete headers on the initial HTTP response.

### Core File Structure
```
src/
├── app/
│   ├── layout.js              # Global metadataBase, default OpenGraph, Twitter, Favicons
│   ├── sitemap.js             # Dynamic sitemap (MongoDB sync + all static routes)
│   ├── robots.js              # Dynamic crawler directives & sitemap pointer
│   └── (marketing)/...        # Public pages with server-rendered metadata
├── lib/
│   └── seo/
│       └── seoConfig.js       # Central source of truth for business NAP, PAGE_SEO & BREADCRUMBS
└── components/
    └── seo/
        ├── JsonLd.jsx         # Secure JSON-LD schema injector (<script type="application/ld+json">)
        ├── OrganizationJsonLd.jsx # RealEstateAgent + LocalBusiness + GEO Coordinates
        ├── BreadcrumbJsonLd.jsx   # BreadcrumbList schema (AEO rich snippets)
        ├── PropertyJsonLd.jsx     # RealEstateListing / SingleFamilyResidence schema
        └── FAQJsonLd.jsx          # FAQPage schema for Voice / Featured Snippets
scripts/
└── audit-seo.mjs              # Deep audit runner (npm run seo:check)
```

---

## 📐 The 3 Optimization Pillars

### Pillar 1: Traditional SEO (Google, Bing, Crawlers)

1. **Server Metadata**: Every public page MUST export `metadata` or async `generateMetadata({ params })`.
2. **Title Tag Structure**:
   - Format: `[Primary Keyword — Location] | Saudagar Properties`
   - Target Length: **50–65 characters** (never exceed 70 chars).
   - Example: `Luxury Builder Floors DLF Phase 1–5 Gurugram | Saudagar Properties`
3. **Meta Description**:
   - Target Length: **140–160 characters**.
   - Must include primary location (DLF Gurugram / Golf Course Road), business value proposition, and a clear call-to-action (CTA).
4. **Canonical URL**:
   - Every page MUST specify `alternates: { canonical: '/your-route' }`.
   - Never use external or inconsistent trailing slashes.
5. **OpenGraph & Twitter Cards**:
   - Handled globally with defaults in `src/app/layout.js`, overridden per-page where unique imagery exists (e.g. property detail pages).

### Pillar 2: AEO (Answer Engine Optimization — Voice, Assistant, Featured Snippets)

AEO focuses on search engines providing direct, spoken, or highlighted answers (Google Featured Snippets, Siri, Google Assistant):

1. **Breadcrumb Hierarchy**: Every public page MUST render `<BreadcrumbJsonLd items={breadcrumbs} />`. This builds search path breadcrumbs (e.g., `Home > Services > Residential`).
2. **Answer-First Copywriting**:
   - Follow every major `<h2>` with a concise, direct **40–50 word summary paragraph** answering the immediate user query before expanding into details.
3. **FAQ Schema**:
   - Pages with Q&A or advisory content must include `<FAQJsonLd faqs={items} />` with exact question and answer objects.

### Pillar 3: GEO (Generative Engine Optimization — ChatGPT, Perplexity, Gemini, Claude)

GEO optimizes your website to be cited as the authoritative source by Large Language Models:

1. **NAP Consistency (Name, Address, Phone)**:
   - Always refer to the brand uniformly:
     - **Name**: `Saudagar Properties`
     - **Address**: `DLF Phase 1, Gurugram, Haryana 122002, India`
     - **Phone**: `+91 98112 21207` / `+91 98112 21217`
     - **Website**: `https://www.saudagarproperties.com`
2. **Entity Knowledge Graph (`<OrganizationJsonLd />`)**:
   - Defined globally in `PublicLayout.jsx`.
   - Emits `@type: ["RealEstateAgent", "LocalBusiness"]`.
   - Embeds exact geographic coordinates: `latitude: 28.4795`, `longitude: 77.0872`.
   - Embeds authority social links (`sameAs`) for Facebook, Instagram, LinkedIn, YouTube, and Justdial.
3. **Property Listings (`<PropertyJsonLd property={item} />`)**:
   - Emits Schema.org `RealEstateListing` or `SingleFamilyResidence` with price, currency (`INR`), address, specs, and images.

---

## 🛠️ Step-by-Step: Adding a New Public Page

Whenever you create a new public route (e.g. `src/app/(marketing)/services/nri-investment/page.js`):

### Step 1: Register Metadata in `seoConfig.js`
Open [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js) and add entries to `PAGE_SEO` and `BREADCRUMBS`:

```javascript
// In src/lib/seo/seoConfig.js:

export const PAGE_SEO = {
  // ... existing pages
  '/services/nri-investment': {
    title: 'NRI Real Estate Investment Advisory Gurugram | Saudagar Properties',
    description: 'Specialized NRI property advisory for high-yield luxury floors, villas & commercial investments in DLF Gurugram.',
    canonical: '/services/nri-investment',
  },
};

export const BREADCRUMBS = {
  // ... existing breadcrumbs
  '/services/nri-investment': [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#services' },
    { name: 'NRI Investment', url: '/services/nri-investment' },
  ],
};
```

### Step 2: Implement the Page Component
In `src/app/(marketing)/services/nri-investment/page.js`:

```javascript
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '@/lib/seo/seoConfig';

// 1. Server-rendered Metadata
export async function generateMetadata() {
  const seoData = PAGE_SEO['/services/nri-investment'];
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

// 2. Page Component with AEO Breadcrumbs & Single H1
export default function NriInvestmentPage() {
  const breadcrumbs = BREADCRUMBS['/services/nri-investment'];

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      {/* Schema.org BreadcrumbList for AEO & rich snippets */}
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Exactly ONE H1 per page */}
      <h1 className="text-4xl md:text-5xl font-serif text-[#1D263B]">
        NRI Real Estate Investment Advisory in Gurugram
      </h1>

      {/* Direct Answer Paragraph for AI / Voice Search */}
      <p className="text-lg text-[#475569] mt-4">
        Saudagar Properties offers comprehensive end-to-end real estate advisory for Non-Resident Indians (NRIs) seeking prime residential floors and commercial investments in DLF Phase 1–5 and Golf Course Road.
      </p>

      {/* Additional page sections */}
    </div>
  );
}
```

### Step 3: Add the Route to `sitemap.js`
Open [`src/app/sitemap.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/sitemap.js) and append the new path to `staticRoutes`:

```javascript
const staticRoutes = [
  // ... existing routes
  '/services/nri-investment',
].map(...)
```

### Step 4: Run the Automated Audit
Execute the deep check:
```bash
npm run seo:check
```
Verify that all checks pass with **0 errors and 0 warnings**.

---

## 🔒 Private & Admin Routes Rule

Pages under `src/app/admin/*` and `src/app/api/*` must **never** be indexed by search engines.

1. **Dynamic `robots.js` Safeguard**:
   [`src/app/robots.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/robots.js) automatically blocks `/admin/` and `/api/`:
   ```javascript
   disallow: ['/admin/', '/api/']
   ```
2. **Metadata Defense-in-Depth**:
   In `src/app/admin/layout.js`, include:
   ```javascript
   export const metadata = {
     robots: {
       index: false,
       follow: false,
     },
   };
   ```

---

## 🖼️ Image SEO & Core Web Vitals Rules

1. **Always Use `next/image`**: Never use raw `<img>` tags for content assets.
2. **Descriptive `alt` Text**:
   - ✅ `alt="Luxury 4 BHK Independent Builder Floor DLF Phase 2 Gurugram"`
   - ❌ `alt="property"` or `alt="image"`
3. **Responsive `sizes` Attribute**: Always provide a `sizes` attribute when using `fill` or responsive layout:
   ```javascript
   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
   ```
4. **LCP Hero Priority**:
   - The primary above-the-fold image on any page MUST include `priority` (or `fetchpriority="high"`).
   - Below-the-fold images default to lazy loading automatically.

---

## 📋 Comprehensive New Page Checklist

Before deploying or submitting any new page, ensure:

- [ ] **Route File**: Created in `src/app/.../page.js` as a Server Component.
- [ ] **Metadata**: Exports `metadata` or async `generateMetadata()`.
- [ ] **Title**: 50–65 characters, includes location (Gurugram / DLF) and `| Saudagar Properties`.
- [ ] **Description**: 140–160 characters with clear value proposition and CTA.
- [ ] **Canonical URL**: Specified via `alternates: { canonical: '...' }`.
- [ ] **Breadcrumbs**: Emits `<BreadcrumbJsonLd items={breadcrumbs} />`.
- [ ] **Entity Schema**: Covered by `<OrganizationJsonLd>` (in layout) or `<PropertyJsonLd>`.
- [ ] **Headings**: Contains exactly **one** `<h1>` tag followed by logical `<h2>` and `<h3>` hierarchy.
- [ ] **Answer Block**: First paragraph after H1/H2 gives a concise, authoritative answer (for AEO/GEO).
- [ ] **Images**: All images use `next/image` with informative `alt` text and `sizes`.
- [ ] **Sitemap**: Static route added to `src/app/sitemap.js` (dynamic properties are synced automatically).
- [ ] **Verification**: Run `npm run seo:check` and ensure 0 warnings/errors.
