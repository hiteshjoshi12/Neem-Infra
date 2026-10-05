# Website Migration Plan (React/Express -> Next.js App Router)

## Stage 1: Codebase Audit
- **Frontend**: Vite + React, React Router.
- **Backend**: Express.js + MongoDB.
- **Goal**: Analyze the entire project to map existing functionalities.

## Stage 2: Architecture Design
- Map existing routes and endpoints.
- Design target Next.js App Router directory structure.
- Define a strategy for Server vs. Client Components.

## Stage 3: Setup Next.js Project
- Initialize the Next.js App Router project (or modify the existing one).
- Configure Tailwind CSS, environment variables.

## Stage 4: Migrate Global Styling & Assets
- Move `index.css` to `app/globals.css`.
- Move images and fonts from `public/` and `src/assets/`.

## Stage 5: Migrate Routing
- Create the standard routes: `/`, `/about`, `/contact`, `/terms`, `/privacy-policy`.
- Migrate Admin dashboard routes under `/admin/...`.
- Implement dynamic routing for properties (`/properties/[slug]`) and locations (`/locations/[slug]`).

## Stage 6: Migrate Shared Components
- Move layouts, UI components (navigation, footer, loaders), forms, and context providers to `components/`.
- Ensure components are properly marked as `"use client"` where interactivity is required.

## Stage 7: Migrate Property Pages (Server-Side)
- Implement `/properties` and `/properties/[slug]`.
- Fetch data from MongoDB directly in Server Components using a `propertyService`.
- Add SEO metadata generation.

## Stage 8: Migrate Location Pages
- Implement `/locations/[slug]`.
- Build the foundation for location-based SEO landing pages.

## Stage 9: Migrate MongoDB Layer
- Implement `lib/mongodb.js` for stable connection caching in Serverless/Next.js environment.
- Move Mongoose models to `models/`.
- Adapt `Property.js` to potentially include a slug field for SEO, while keeping the rest identical.

## Stage 10: Migrate Backend / API
- Migrate Express endpoints to Next.js Route Handlers (`app/api/...`) where client components still need to fetch data.
- Refactor data access into reusable services (e.g., `services/propertyService.js`).

## Stage 11: Migrate Forms
- Refactor contact and inquiry forms to use Server Actions or Route Handlers.
- Ensure strict server-side validation.

## Stage 12: SEO Foundation
- Implement dynamic `sitemap.js` and `robots.js`.
- Add meta titles, descriptions, canonicals, and OpenGraph tags to all pages.

## Stage 13: Structured Data
- Add JSON-LD snippets for Organization, WebSite, LocalBusiness, and RealEstate/Property entities.

## Stage 14: Performance Optimization
- Transition images to `next/image`.
- Verify caching and optimize LCP/CLS/INP.

## Stage 15 & 16: Testing & Audits
- Functional testing of forms, CMS, admin sections, routing.
- Final SEO / HTML audit for server-rendered content verification.
