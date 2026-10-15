# Website Migration & Enhancement Plan (Vite/Express -> Next.js 16 App Router)

> **Execution Roadmap & Implementation Status for Saudagar Properties**  
> All 20 execution stages completed and verified for production release.

---

## 🏁 Implementation Status Overview

| Phase | Milestone | Status |
|:---|:---|:---|
| **Phase 1: Codebase Audit & Mapping** | Stages 1 – 3: Architecture & Dependency Setup | ✅ Complete |
| **Phase 2: Core Migration** | Stages 4 – 11: Routing, Components, MongoDB, Forms & APIs | ✅ Complete |
| **Phase 3: Search & Discovery Optimization** | Stages 12 – 14: Dynamic Sitemaps, SEO, AEO & GEO Knowledge Graph | ✅ Complete |
| **Phase 4: Quality & Performance Audits** | Stages 15 – 16: Verification, Typecheck & Next.js Build Pass | ✅ Complete |
| **Phase 5: Lead Pipeline & Security Hardening** | Stage 17: Honeypot Anti-Spam, Rate Limits & Nodemailer Email Alerts | ✅ Complete |
| **Phase 6: Editorial Blog & Taxonomy Engine** | Stage 18: Blog Engine, Taxonomies, Dynamic TOC & Reading Time | ✅ Complete |
| **Phase 7: Advanced Studio CMS & Live Preview** | Stage 19: Split Live Preview Workspace & 1-Click Internal Link Engine | ✅ Complete |
| **Phase 8: Pre-Launch Production Audit** | Stage 20: Deep Audit, Link Validation & Production Build Verification | ✅ Complete |

---

## 📋 Detailed Stage Breakdown

### Stage 1: Codebase Audit
- Analyzed legacy repository: Vite + React frontend, standalone Express server, MongoDB Mongoose models.
- Mapped all endpoints, routes, dependencies, and business logic.

### Stage 2: Target Architecture Design
- Formulated Next.js App Router directory structure (`src/app`).
- Defined boundaries between Server Components (default SSR/SSG) and Client Components (`"use client"`).

### Stage 3: Next.js Project Foundation
- Initialized Next.js 16 with React 19 and Tailwind CSS v4.
- Established path aliases (`@/*` pointing to `src/*`).

### Stage 4: Global Styling & Asset Migration
- Transferred styling into CSS design tokens and Tailwind theme.
- Migrated brand imagery, logos, and vector assets.

### Stage 5: Core Routing Transition
- Migrated standard public routes (`/`, `/about`, `/contact`, `/services`, `/terms`, `/privacy-policy`).
- Established route hierarchy with nested layouts.

### Stage 6: Shared Component Re-architecture
- Created reusable components under `src/components/common` (Navigation, Footer, Contact modals).
- Encapsulated interactive client behaviors in dedicated `"use client"` wrappers.

### Stage 7: Server-Side Property Catalog
- Built `/properties` and dynamic `/properties/[slug]` routes.
- Integrated `propertyService.js` to query MongoDB directly during SSR with zero client-side waterfall delays.

### Stage 8: Curated Corridors & Location Landing Pages
- Built location-based corridor browsing for DLF Phase 1–5, Golf Course Road, and Southern Peripheral Road.

### Stage 9: Serverless MongoDB Connection Layer
- Implemented `src/lib/mongodb.js` with global connection caching for serverless environments.
- Migrated all Mongoose schemas to `src/models`.

### Stage 10: API Handlers Migration
- Replaced Express controllers with Next.js Server Route Handlers under `src/app/api/*`.
- Maintained RESTful parity for frontend CMS consumers.

### Stage 11: Lead Forms & Submissions
- Built contact and inquiry forms submitting to `/api/inquiries`.
- Implemented server-side validation and field sanitization.

### Stage 12: Technical SEO Infrastructure
- Created dynamic `sitemap.js` syncing static pages, active listings, and published blog posts.
- Created `robots.js` granting crawler access to public routes while disallowing `/admin/` and `/api/`.

### Stage 13: Schema.org Structured Data (AEO & GEO)
- Implemented `OrganizationJsonLd` with geo-coordinates, NAP consistency, and social authority links.
- Added `BreadcrumbJsonLd`, `PropertyJsonLd`, and `BlogJsonLd` for rich search snippets and LLM citations.

### Stage 14: Core Web Vitals & Image Optimization
- Replaced raw `<img>` tags with Next.js `<Image />` component with responsive `sizes` and `priority` for hero sections.

### Stage 15: Admin CMS Suite Migration
- Built token-authenticated admin management under `/admin/*` for properties, inquiries, and homepage sections.

### Stage 16: Verification & Build Validation
- Executed linting, typecheck, and build validation suites with zero errors.

---

## 🚀 Post-Migration Enhancements

### Stage 17: Lead Pipeline & Automated Email Dispatch
- Integrated **Nodemailer** transport in `src/lib/email/emailService.js` to dispatch instant branded HTML alert emails to executive inboxes.
- Implemented honeypot bot trap (`website_hp`, `company_fax`) and per-IP rate limiting (10 requests / 10 min) in `src/app/api/inquiries/route.js`.

### Stage 18: Editorial Blog & Taxonomy Engine
- Created public `/blog`, `/blog/[slug]`, and taxonomy archive routes (`/blog/category/*`, `/blog/tag/*`, `/blog/author/*`).
- Added markdown parsing, reading time calculation, and automated Table of Contents extraction.

### Stage 19: Advanced Studio CMS & Live Article Preview
- Upgraded `src/components/admin/BlogEditor.jsx` with **3-mode workspace**: Canvas, Split Live Preview, and Full Preview.
- Created synchronous `LiveArticlePreview.jsx` matching live `/blog/[slug]` typography, hero banners, and tags.
- Built **1-Click Internal Link Engine** (<kbd>Ctrl+K</kbd>) via `InternalLinkModal.jsx` to search and insert links to articles, corridors, properties, and services.

### Stage 20: Pre-Launch Production Audit
- Executed comprehensive audit for live audience traffic.
- Validated SEO signals with `npm run seo:check`.
- Verified clean compilation with `npm run build`.
