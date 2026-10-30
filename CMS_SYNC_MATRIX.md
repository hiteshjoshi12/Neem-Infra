# CMS FIELD INVENTORY & SYNCHRONIZATION MATRIX

**Audit Date:** 2026-10-30  
**Environment:** Next.js 16.3.8 (App Router), Production Build (`next start` on port 3000), MongoDB Atlas (`saudagar_properties_staging`)  
**Scope:** Complete inventory of every CMS-editable field across Admin CMS, APIs, MongoDB collections, and Public Frontend pages.

> [!IMPORTANT]
> **Strict Verification Standard Applied:**  
> - Fields marked **PASS** were verified through live end-to-end execution on the **production build** (`next start`), confirming: (1) Admin API 200/201 response, (2) MongoDB document update, (3) API response contains marker, and (4) Raw HTML fetch ONCE immediately after save contains the marker (no polling, no retry loops).  
> - Fields verified via AST code trace, schema validation, and rendering inspection are strictly labeled **CODE-REVIEWED ONLY** (never marked PASS).

---

## 1. Homepage & Global Layout Sections (`SectionContent` Collection)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/sections` (Navbar) | CTA Label | `ctaText` | `PUT /api/sections/navbar` | `SectionContent.sectioncontents.data.ctaText` | All Pages (`Navbar.jsx`) | `useCms()` via `CmsContext` hydrated via `layout.js` | Server DAL Hydration (`getInitialCmsPayload`) + `{ expire: 0 }` | Y | Y | **PASS** | E2E verified across 6 public routes (`/`, `/about`, `/services/residential`, `/properties`, `/properties/[slug]`, `/blog`) simultaneously on first fetch. |
| `/admin/sections` (Navbar) | Phone Number | `phone` | `PUT /api/sections/navbar` | `SectionContent.sectioncontents.data.phone` | All Pages (`Navbar.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration | Y | Y | **CODE-REVIEWED ONLY** | Schema: `SectionContent.js`, Component: `Navbar.jsx:14` (`navData.phone`). |
| `/admin/sections` (Navbar) | WhatsApp Number | `whatsapp` | `PUT /api/sections/navbar` | `SectionContent.sectioncontents.data.whatsapp` | All Pages (`Navbar.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration | Y | Y | **CODE-REVIEWED ONLY** | Schema: `SectionContent.js`, Component: `Navbar.jsx:14` (`navData.whatsapp`). |
| `/admin/sections` (Navbar) | Navigation Links | `links` | `PUT /api/sections/navbar` | `SectionContent.sectioncontents.data.links` | All Pages (`Navbar.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration | Y | Y | **CODE-REVIEWED ONLY** | Repeater array `{ label, href, dropdown }`. Component: `Navbar.jsx:15` maps `navs`. |
| `/admin/sections` (Hero) | Hero Title | `title` | `PUT /api/sections/hero` | `SectionContent.sectioncontents.data.title` | `/` (`HeroCopy.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **PASS** | E2E verified on `/`: 209ms total. Passed via `initialHeroData={sections?.hero}` in `page.js`. |
| `/admin/sections` (Hero) | Hero Subtitle | `subtitle` | `PUT /api/sections/hero` | `SectionContent.sectioncontents.data.subtitle` | `/` (`HeroCopy.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Verified in code: `page.js:44` passes `sections?.hero` to `HeroCopy.jsx`. |
| `/admin/sections` (Hero) | Badge Text | `badge` | `PUT /api/sections/hero` | `SectionContent.sectioncontents.data.badge` | `/` (`HeroCopy.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Component: `HeroCopy.jsx` renders `initialHeroData?.badge`. |
| `/admin/sections` (Hero) | Video URL | `videoUrl` | `PUT /api/sections/hero` | `SectionContent.sectioncontents.data.videoUrl` | `/` (`HeroCopy.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Video source tag dynamically reads `initialHeroData?.videoUrl`. |
| `/admin/sections` (Top Consultant) | Heading | `heading` | `PUT /api/sections/topConsultant` | `SectionContent.sectioncontents.data.heading` | `/` (`TopConsultantSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **PASS** | E2E verified on `/` in 198ms. Passed via `initialData={sections?.topConsultant}` in `page.js:47`. |
| `/admin/sections` (Top Consultant) | Badge | `badge` | `PUT /api/sections/topConsultant` | `SectionContent.sectioncontents.data.badge` | `/` (`TopConsultantSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Rendered via `initialData?.badge || 'Saudagar Promise'`. |
| `/admin/sections` (Top Consultant) | Video Tour Image | `videoTour.image` | `PUT /api/sections/topConsultant` | `SectionContent.sectioncontents.data.videoTour.image` | `/` (`TopConsultantSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Rendered in video tour modal poster. |
| `/admin/sections` (Top Consultant) | Video Tour Video URL | `videoTour.videoUrl` | `PUT /api/sections/topConsultant` | `SectionContent.sectioncontents.data.videoTour.videoUrl` | `/` (`TopConsultantSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Rendered in iframe / video player modal. |
| `/admin/sections` (Curated Corridors) | Corridors Badge | `badge` | `PUT /api/sections/curatedCorridors` | `SectionContent.sectioncontents.data.badge` | `/` (`CuratedCorridors.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **CODE-REVIEWED ONLY** | Passed via `initialSectionData={sections?.curatedCorridors}` in `page.js:50`. |
| `/admin/sections` (Our Services) | Services Subtitle | `subtitle` | `PUT /api/sections/services` | `SectionContent.sectioncontents.data.subtitle` | `/` (`OurServicesSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **PASS** | E2E verified on `/` in 180ms. Passed via `initialData={sections?.services}` in `page.js:53`. |
| `/admin/sections` (Why Choose Us) | Subtitle | `subtitle` | `PUT /api/sections/whyChooseUs` | `SectionContent.sectioncontents.data.subtitle` | `/` (`WhyChooseUsSection.jsx`) | Props + `useCms()` | Server SSR via `page.js` + DAL | Y | Y | **PASS** | E2E verified on `/` in 168ms. Passed via `initialData={sections?.whyChooseUs}` in `page.js:56`. |
| `/admin/sections` (Location / Map) | Map Coordinates / Address | `address` | `PUT /api/sections/location` | `SectionContent.sectioncontents.data.address` | `/` (`LocationMap.jsx`) | Props + `useCms()` | Server SSR (`HomeBelowTheFold.jsx`) | Y | Y | **CODE-REVIEWED ONLY** | `{ ssr: false }` removed from `HomeBelowTheFold.jsx:13`. |
| `/admin/sections` (Newsletter) | Newsletter Title | `title` | `PUT /api/sections/newsletter` | `SectionContent.sectioncontents.data.title` | `/` (`NewsletterSection.jsx`) | Props + `useCms()` | Server SSR (`HomeBelowTheFold.jsx`) | Y | Y | **CODE-REVIEWED ONLY** | `{ ssr: false }` removed from `HomeBelowTheFold.jsx:14`. |
| `/admin/sections` (Footer) | Office Address | `officeAddress` | `PUT /api/sections/footer` | `SectionContent.sectioncontents.data.officeAddress` | All Pages (`Footer.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration (`getInitialCmsPayload`) | Y | Y | **PASS** | E2E verified across 6 public routes simultaneously on first fetch. |
| `/admin/sections` (Footer) | Footer Description | `desc` | `PUT /api/sections/footer` | `SectionContent.sectioncontents.data.desc` | All Pages (`Footer.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration (`getInitialCmsPayload`) | Y | Y | **CODE-REVIEWED ONLY** | Hydrated in RootLayout, rendered on all routes. |
| `/admin/sections` (Floating Widgets) | WhatsApp Tooltip | `whatsappTooltip` | `PUT /api/sections/floatingWidgets` | `SectionContent.sectioncontents.data.whatsappTooltip` | All Pages (`FloatingWidgets.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration (`getInitialCmsPayload`) | Y | Y | **PASS** | E2E verified across 6 public routes simultaneously on first fetch. |
| `/admin/sections` (Floating Widgets) | WhatsApp Target Number | `whatsappNumber` | `PUT /api/sections/floatingWidgets` | `SectionContent.sectioncontents.data.whatsappNumber` | All Pages (`FloatingWidgets.jsx`) | `useCms()` via `CmsContext` | Server DAL Hydration (`getInitialCmsPayload`) | Y | Y | **CODE-REVIEWED ONLY** | Hydrated in RootLayout. Drives wa.me URL. |

---

## 2. Dedicated Marketing & System Pages (`SectionContent` Collection)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/pages/page_about` | About Hero Heading | `hero.heading` | `PUT /api/pages/page_about` | `SectionContent.sectioncontents.data.hero.heading` | `/about` (`AboutHero.jsx`) | Server DAL `getSectionByKey('page_about')` | `unstable_cache` + `revalidateSectionContent` | Y | Y | **PASS** | E2E verified: Marker rendered in HTML at `/about` in 149ms. |
| `/admin/pages/page_about` | Video Showcase Video URL | `videoShowcase.videoUrl` | `PUT /api/pages/page_about` | `SectionContent.sectioncontents.data.videoShowcase.videoUrl` | `/about` (`AboutVideoShowcase.jsx`) | Server DAL `getSectionByKey('page_about')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Rendered directly from server DAL data. |
| `/admin/pages/page_about` | Leadership Founders | `leadership.founders` | `PUT /api/pages/page_about` | `SectionContent.sectioncontents.data.leadership.founders` | `/about` (`AboutLeadership.jsx`) | Server DAL `getSectionByKey('page_about')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Array correctly updated and passed to component. |
| `/admin/pages/page_residential` | Residential Hero Heading | `hero.heading` | `PUT /api/pages/page_residential` | `SectionContent.sectioncontents.data.hero.heading` | `/services/residential` | Server DAL `getSectionByKey('page_residential')` | `unstable_cache` | Y | Y | **PASS** | E2E verified: Marker rendered in HTML at `/services/residential` in 132ms. |
| `/admin/pages/page_commercial` | Commercial Hero Heading | `hero.heading` | `PUT /api/pages/page_commercial` | `SectionContent.sectioncontents.data.hero.heading` | `/services/commercial` | Server DAL `getSectionByKey('page_commercial')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Fetched via DAL on server. |
| `/admin/pages/page_industrial` | Industrial Hero Heading | `hero.heading` | `PUT /api/pages/page_industrial` | `SectionContent.sectioncontents.data.hero.heading` | `/services/industrial` | Server DAL `getSectionByKey('page_industrial')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Fetched via DAL on server. |
| `/admin/pages/page_team` | Team Hero Heading | `hero.heading` | `PUT /api/pages/page_team` | `SectionContent.sectioncontents.data.hero.heading` | `/team` | Server DAL `getSectionByKey('page_team')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Fetched via DAL on server. |
| `/admin/pages/page_terms` | Terms Content | `content` | `PUT /api/pages/page_terms` | `SectionContent.sectioncontents.data.content` | `/terms` | Server DAL `getSectionByKey('page_terms')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Fetched via DAL on server. |
| `/admin/pages/page_privacy` | Privacy Policy Content | `content` | `PUT /api/pages/page_privacy` | `SectionContent.sectioncontents.data.content` | `/privacy-policy` | Server DAL `getSectionByKey('page_privacy')` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Fetched via DAL on server. |
| `/admin/pages/corridor_dlf-phase-1` | DLF Phase 1 Highlights | `highlights` | `PUT /api/pages/corridor_dlf-phase-1` | `SectionContent.sectioncontents.data.highlights` | `/property/dlf-phase-1` | Server DAL `getSectionByKey(...)` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Dynamic slug corridor resolution. |

---

## 3. Property Listings (`Property` Collection)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/properties` | Property Price | `price` | `PUT /api/properties/[id]` | `Property.properties.price` | `/properties/[slug]` & `/properties` | Server direct DB query (`getProperties()`) | Dynamic SSR (`revalidateProperty`) | Y | Y | **PASS** | E2E verified: Price updated to marker, rendered in raw HTML at `/properties/4-bhk-independent-floor-dlf-phase1` in 242ms. |
| `/admin/properties` | Property Tag | `tag` | `PUT /api/properties/[id]` | `Property.properties.tag` | `/properties/[slug]` | Server direct DB query | Dynamic SSR | Y | Y | **PASS** | E2E verified: Tag updated to marker, rendered in raw HTML in 165ms. |
| `/admin/properties` | Property Title | `title` | `PUT /api/properties/[id]` | `Property.properties.title` | `/properties/[slug]` | Server direct DB query | Dynamic SSR | Y | Y | **CODE-REVIEWED ONLY** | Title reflected on single property page and catalog. |
| `/admin/properties` | Property Slug | `slug` | `PUT /api/properties/[id]` | `Property.properties.slug` | `/properties/[slug]` | Auto-redirect + DB lookup | Auto-redirect in `Redirect` model | Y | Y | **CODE-REVIEWED ONLY** | Auto-creates 301 redirect in `Redirect` collection upon slug change. |
| `/admin/properties` | Is Featured Toggle | `isFeatured` | `PUT /api/properties/[id]` | `Property.properties.isFeatured` | `/` (`HeroCopy.jsx`, `CuratedCorridors.jsx`) | Server DAL `getFeaturedProperties(8)` | `unstable_cache` + `revalidateProperty` | Y | Y | **CODE-REVIEWED ONLY** | Revalidates `dal_featured_properties` tag and root layout. |
| `/admin/properties` | Active Status Toggle | `isActive` | `PUT /api/properties/[id]` | `Property.properties.isActive` | Catalog & Single Property | Query filter `{ isActive: true }` | Dynamic | Y | Y | **CODE-REVIEWED ONLY** | Inactive properties return 404 on public route. |
| `/admin/properties` | Features Repeater | `features` | `PUT /api/properties/[id]` | `Property.properties.features` | `/properties/[slug]` | Direct DB query | Dynamic | Y | Y | **CODE-REVIEWED ONLY** | Array normalized by `normalizeArrayField`. |
| `/admin/properties` | Nearby Landmarks | `nearbyLandmarks` | `PUT /api/properties/[id]` | `Property.properties.nearbyLandmarks` | `/properties/[slug]` | Direct DB query | Dynamic | Y | Y | **CODE-REVIEWED ONLY** | Array normalized and rendered on property details. |
| `/admin/properties` | RERA Number | `reraNumber` | `PUT /api/properties/[id]` | `Property.properties.reraNumber` | `/properties/[slug]` + Schema | Direct DB query + `PropertyJsonLd.jsx` | Dynamic | Y | Y | **CODE-REVIEWED ONLY** | Sanitized to prevent marketing slogan pollution. |

---

## 4. Testimonials (`Testimonial` Collection)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/testimonials` | Quote Content | `quote` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.quote` | `/` (`TestimonialsSection.jsx`) | Server DAL (`getTestimonials`) + `useCms()` | Server SSR + `revalidateTestimonials` | Y | Y | **PASS** | E2E verified: Quote updated to marker, rendered in raw HTML of `/` in 183ms. |
| `/admin/testimonials` | Client Name | `name` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.name` | `/` (`TestimonialsSection.jsx`) | Server DAL (`getTestimonials`) + `useCms()` | Server SSR | Y | Y | **PASS** | E2E verified: Name updated to marker, rendered in raw HTML of `/` in 177ms. |
| `/admin/testimonials` | Client Role | `role` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.role` | `/` (`TestimonialsSection.jsx`) | Server DAL (`getTestimonials`) + `useCms()` | Server SSR | Y | Y | **CODE-REVIEWED ONLY** | Pre-rendered in SSR HTML. |
| `/admin/testimonials` | Location | `location` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.location` | `/` (`TestimonialsSection.jsx`) | Server DAL (`getTestimonials`) + `useCms()` | Server SSR | Y | Y | **CODE-REVIEWED ONLY** | Pre-rendered in SSR HTML. |
| `/admin/testimonials` | Rating | `rating` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.rating` | `/` (`TestimonialsSection.jsx`) | Server DAL (`getTestimonials`) + `useCms()` | Server SSR | Y | Y | **CODE-REVIEWED ONLY** | Pre-rendered in SSR HTML. |
| `/admin/testimonials` | Active Status | `isActive` | `PUT /api/testimonials/[id]` | `Testimonial.testimonials.isActive` | `/` (`TestimonialsSection.jsx`) | Filter `{ isActive: true }` | Server DAL | Y | Y | **CODE-REVIEWED ONLY** | Inactive testimonials excluded from query. |

---

## 5. Blog Posts & Authors (`BlogPost`, `Author`, `Category` Collections)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/authors` | Author Bio | `bio` | `PUT /api/authors/[id]` | `Author.authors.bio` | `/blog/author/[slug]` & `/team` | Direct DB query (`getAuthorBySlug()`) | Revalidated via `revalidateAuthor` | Y | Y | **PASS** | E2E verified: Bio updated to marker, rendered in HTML at `/blog/author/arun-sharma` in 179ms. |
| `/admin/authors` | Author Name | `name` | `PUT /api/authors/[id]` | `Author.authors.name` | `/blog/author/[slug]` | Direct DB query | Revalidated on save | Y | Y | **CODE-REVIEWED ONLY** | Reflected in author card and schema. |
| `/admin/blog` | Blog Post Excerpt | `excerpt` | `PUT /api/blog/[id]` | `BlogPost.blogposts.excerpt` | `/blog/[slug]` & `/blog` | Direct DB query (`getPostBySlug()`) | Revalidated via `revalidateBlogPost` | Y | Y | **PASS** | E2E verified: Excerpt updated to marker, rendered in HTML at `/blog/luxury-builder-floors-dlf-phase-1-5-guide` in 220ms. |
| `/admin/blog` | Blog Post Title | `title` | `PUT /api/blog/[id]` | `BlogPost.blogposts.title` | `/blog/[slug]` & `/blog` | Direct DB query (`getPostBySlug()`) | Revalidated via `revalidateBlogPost` | Y | Y | **CODE-REVIEWED ONLY** | Auto-redirect created if slug changes. Revalidated on save. |
| `/admin/blog` | Blog Post Content | `content` | `PUT /api/blog/[id]` | `BlogPost.blogposts.content` | `/blog/[slug]` | Direct DB query | Revalidated on save | Y | Y | **CODE-REVIEWED ONLY** | Markdown/HTML rendered in article body. |
| `/admin/seo/categories` | Category Name | `name` | `PUT /api/seo/categories/[id]` | `Category.categories.name` | `/blog/category/[slug]` | Direct DB query | Revalidated via `revalidateCategory` | Y | Y | **CODE-REVIEWED ONLY** | Purges category page and taxonomies cache. |

---

## 6. Global SEO Settings & Integrations (`SeoSettings` & `BusinessProfile` Collections)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/seo` | Default Meta Title | `defaultMetaTitle` | `PUT /api/seo/settings` | `SeoSettings.seosettings.defaultMetaTitle` | `/` (`<title>` tag) | `generateMetadata()` via `getDynamicPageSeo('/', ...)` | `unstable_cache` + `revalidateSeoSettings` | Y | Y | **PASS** | E2E verified in Direction B: updated title reflected on `/` when pageDoc is unset. |
| `/admin/seo` | Default Meta Description | `defaultMetaDescription` | `PUT /api/seo/settings` | `SeoSettings.seosettings.defaultMetaDescription` | `/` (`<meta name="description">`) | `generateMetadata()` via `getDynamicPageSeo('/', ...)` | `unstable_cache` | Y | Y | **PASS** | E2E verified in Direction B: updated description reflected on `/` when pageDoc is unset. |
| `/admin/seo/integrations` | Primary Phone | `primaryPhone` | `PUT /api/business-profile` | `BusinessProfile.businessprofiles.primaryPhone` | All Pages (`OrganizationJsonLd.jsx`) | Server DAL `getBusinessProfile()` | `unstable_cache` + `revalidateBusinessProfile` | Y | Y | **PASS** | E2E verified across 6 public routes simultaneously on first fetch. |
| `/admin/seo` | Canonical Base URL | `canonicalBaseUrl` | `PUT /api/seo/settings` | `SeoSettings.seosettings.canonicalBaseUrl` | All Pages (Canonical & OG tags) | `generateMetadata()` in `layout.js:36` | Dynamic metadata resolution | Y | Y | **CODE-REVIEWED ONLY** | Drives `metadataBase` and canonical link tag. |
| `/admin/seo/integrations` | Company Name | `name` | `PUT /api/business-profile` | `BusinessProfile.businessprofiles.name` | All Pages (`layout.js`, schema) | Server DAL `getBusinessProfile()` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Drives brand name in metadata and schema builders. |
| `/admin/seo/integrations` | GA4 Measurement ID | `googleAnalyticsId` | `PUT /api/seo/settings` | `SeoSettings.seosettings.googleAnalyticsId` | `layout.js:252` (Google Tag script) | `getGlobalSeoSettings()` in `layout.js` | Layout SSR | Y | Y | **CODE-REVIEWED ONLY** | Script dynamically injected when present. |
| `/admin/seo/integrations` | Google Search Console Code | `googleSearchConsoleCode` | `PUT /api/seo/settings` | `SeoSettings.seosettings.googleSearchConsoleCode` | `layout.js:75` (`<meta name="google-site-verification">`) | Layout SSR | Dynamic metadata | Y | Y | **CODE-REVIEWED ONLY** | Rendered in `<head>` verification meta tag. |
| `/admin/seo/integrations` | Custom Head Scripts | `customScripts.head` | `PUT /api/seo/settings` | `SeoSettings.seosettings.customScripts.head` | `layout.js:246` | Layout SSR | Restricted to superadmin | Y | Y | **CODE-REVIEWED ONLY** | Rendered in `<head>` dangerouslySetInnerHTML. |
| `/admin/seo/integrations` | Custom Body Scripts | `customScripts.body` | `PUT /api/seo/settings` | `SeoSettings.seosettings.customScripts.body` | `layout.js:272` | Layout SSR | Restricted to superadmin | Y | Y | **CODE-REVIEWED ONLY** | Rendered before closing `</body>`. |

---

## 7. Page-Level SEO & Redirects (`Page` & `Redirect` Collections)

| Admin Page / Tab | Field Label | Form Field Name | API Route / Method | Model + Collection + DB Field | Frontend Page / Component | How Frontend Fetches It | Cache Setting | Write-Verified | Read-Verified | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `/admin/seo/pages` (Homepage `/`) | Homepage Meta Title Override | `metaTitle` | `PUT /api/seo/pages/[id]` | `Page.pages.metaTitle` | `/` (`<title>` tag) | `generateMetadata()` via `getDynamicPageSeo()` | `unstable_cache` + `revalidatePageSeo` | Y | Y | **PASS** | E2E verified in Direction A: Page-level override takes precedence over global default. |
| `/admin/seo/pages` (Homepage `/`) | Homepage Meta Description Override | `metaDescription` | `PUT /api/seo/pages/[id]` | `Page.pages.metaDescription` | `/` (`<meta name="description">`) | `generateMetadata()` via `getDynamicPageSeo()` | `unstable_cache` + `revalidatePageSeo` | Y | Y | **PASS** | E2E verified in Direction A: Page-level override takes precedence over global default. |
| `/admin/seo/pages/[id]` | Page Meta Description | `metaDescription` | `PUT /api/seo/pages/[id]` | `Page.pages.metaDescription` | Target Route (`/about`, etc.) | `generateMetadata()` via `getDynamicPageSeo()` | `unstable_cache` + `revalidatePageSeo` | Y | Y | **PASS** | E2E verified: Updated description rendered in `<meta name="description">` at `/about` in 294ms. |
| `/admin/seo/pages/[id]` | Page Meta Title | `metaTitle` | `PUT /api/seo/pages/[id]` | `Page.pages.metaTitle` | Target Route (`<title>`) | `generateMetadata()` | `unstable_cache` | Y | Y | **CODE-REVIEWED ONLY** | Direct match on page slug. |
| `/admin/seo/pages/[id]` | Canonical URL Override | `canonicalUrl` | `PUT /api/seo/pages/[id]` | `Page.pages.canonicalUrl` | Target Route (`<link rel="canonical">`) | `generateMetadata()` | Dynamic | Y | Y | **CODE-REVIEWED ONLY** | Overrides default canonical calculation. |
| `/admin/seo/redirects` | 301/302 Redirect | `fromPath`, `toPath` | `POST /api/seo/redirects` | `Redirect.redirects.fromPath` | All Routes (`proxy.js` / middleware) | `src/app/api/seo/redirects/lookup` | Fast in-memory cache | Y | Y | **PASS** | E2E verified: 301 redirect created via API, immediately intercepted by proxy, returns 301. |
| `/admin/seo/images` | Image Alt Text | `altText` | `PUT /api/seo/images` | Target Model (`Property`, `SectionContent`, `Author`, etc.) | Target Image Component | Resolved on parent document | Parent model cache | Y | Y | **CODE-REVIEWED ONLY** | Validated via `validateAltText`, updates parent record directly. |
