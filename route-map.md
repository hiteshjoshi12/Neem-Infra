# Saudagar Properties — Next.js App Router Route Map

> **Complete Application Route Hierarchy for Saudagar Properties**  
> Covers all public marketing routes, editorial blog pages, secure admin CMS routes, dynamic parameter patterns, and system SEO routes.

---

## 🏛️ Public Marketing & Commercial Routes

All public routes are pre-rendered on the server (SSR/SSG) with complete metadata, canonical tags, and Schema.org JSON-LD snippets.

| ROUTE | FILE PATH | PURPOSE | ACCESS | SCHEMA.ORG |
|:---|:---|:---|:---|:---|
| `/` | `src/app/(marketing)/page.js` | Main Homepage with alternating Light/Dark rhythm | Public | `Organization`, `RealEstateAgent`, `LocalBusiness` |
| `/about` | `src/app/(marketing)/about/page.js` | Company story, heritage, leadership, and DLF advisory expertise | Public | `AboutPage`, `BreadcrumbList` |
| `/contact` | `src/app/(marketing)/contact/page.js` | Direct consultation channels, phone/WhatsApp links, map & inquiry form | Public | `ContactPage`, `BreadcrumbList` |
| `/privacy-policy` | `src/app/(marketing)/privacy-policy/page.js` | Privacy policy and data handling disclosures | Public | `WebPage`, `BreadcrumbList` |
| `/terms` | `src/app/(marketing)/terms/page.js` | Terms of service and advisory conditions | Public | `WebPage`, `BreadcrumbList` |
| `/services` | `src/app/(marketing)/services/page.js` | Advisory services hub | Public | `Service`, `BreadcrumbList` |
| `/services/residential` | `src/app/(marketing)/services/residential/page.js` | Luxury builder floors, villas & penthouses in DLF Phase 1–5 | Public | `Service`, `BreadcrumbList` |
| `/services/commercial` | `src/app/(marketing)/services/commercial/page.js` | Commercial office spaces, SCO plots & retail hubs | Public | `Service`, `BreadcrumbList` |
| `/services/industrial` | `src/app/(marketing)/services/industrial/page.js` | Industrial land, warehouses & institutional assets | Public | `Service`, `BreadcrumbList` |
| `/team` | `src/app/(marketing)/team/page.js` | Real estate consultants, valuation advisors & legal desk | Public | `AboutPage`, `BreadcrumbList` |
| `/properties` | `src/app/properties/page.js` | Property search catalog with filter bar (corridor, type, price, status) | Public | `CollectionPage`, `BreadcrumbList` |
| `/properties/[slug]` | `src/app/properties/[slug]/page.js` | Dynamic property detail page (galleries, specs, map, schedule viewing) | Public | `RealEstateListing`, `BreadcrumbList` |
| `/property/[slug]` | `src/app/(marketing)/property/[slug]/page.js` | Canonical alias/redirect handler for property detail pages | Public | `RealEstateListing` |

---

## 📰 Editorial Blog & Publication Routes

Full native editorial publishing platform supporting deep internal linking and taxonomy navigation.

| ROUTE | FILE PATH | PURPOSE | ACCESS | SCHEMA.ORG |
|:---|:---|:---|:---|:---|
| `/blog` | `src/app/blog/page.js` | Blog hub with featured articles, search, and category pills | Public | `Blog`, `BreadcrumbList` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.js` | Single article reader with dynamic TOC, reading progress, and author bio | Public | `BlogPosting`, `BreadcrumbList` |
| `/blog/category/[category]` | `src/app/blog/category/[category]/page.js` | Filtered articles by category (e.g. Market Trends, NRI Guide) | Public | `CollectionPage`, `BreadcrumbList` |
| `/blog/tag/[tag]` | `src/app/blog/tag/[tag]/page.js` | Filtered articles by topic tag (e.g. Golf Course Road, DLF Phase 2) | Public | `CollectionPage`, `BreadcrumbList` |
| `/blog/author/[author]` | `src/app/blog/author/[author]/page.js` | Author portfolio showing bio, credentials, and written articles | Public | `ProfilePage`, `BreadcrumbList` |

---

## 🔐 Admin CMS Suite (Secured Routes)

All routes under `/admin/*` are blocked from search engine indexing via `robots.js` (`disallow: ['/admin/']`) and require valid JWT credentials.

| ROUTE | FILE PATH | PURPOSE | ACCESS |
|:---|:---|:---|:---|
| `/admin/login` | `src/app/admin/login/page.js` | Admin authentication portal with bcrypt password verification | Public (login form) |
| `/admin` & `/admin/dashboard` | `src/app/admin/dashboard/page.js` | Dashboard analytics (inquiry volume, property count, published blogs) | **Admin Only** |
| `/admin/properties` | `src/app/admin/properties/page.js` | Real estate listing manager (create, edit, delete, feature flag) | **Admin Only** |
| `/admin/blog` | `src/app/admin/blog/page.js` | Editorial articles management (filter drafts vs published, views, edit) | **Admin Only** |
| `/admin/blog/new` | `src/app/admin/blog/new/page.js` | **Advanced Blog Editor**: Split Live Preview, Internal Linker (<kbd>Ctrl+K</kbd>), Markdown toolbar | **Admin Only** |
| `/admin/blog/[id]/edit` | `src/app/admin/blog/[id]/edit/page.js` | Edit existing blog post with synchronized live article preview | **Admin Only** |
| `/admin/inquiries` | `src/app/admin/inquiries/page.js` | Lead management inbox with status toggles (New, Contacted, Closed) | **Admin Only** |
| `/admin/sections` | `src/app/admin/sections/page.js` | Homepage section content editor (Hero, About, Counters, Locations) | **Admin Only** |
| `/admin/pages` | `src/app/admin/pages/page.js` | List of editable pages | **Admin Only** |
| `/admin/pages/[page]` | `src/app/admin/pages/[page]/page.js` | Page-specific copy and SEO metadata editor | **Admin Only** |
| `/admin/testimonials` | `src/app/admin/testimonials/page.js` | Client reviews and testimonials manager | **Admin Only** |

---

## 🤖 System & Crawler Routes

| ROUTE | FILE PATH | PURPOSE |
|:---|:---|:---|
| `/sitemap.xml` | `src/app/sitemap.js` | Dynamic XML sitemap querying MongoDB properties and published blogs |
| `/robots.txt` | `src/app/robots.js` | Dynamic crawler directives (allows public pages, blocks `/admin/` and `/api/`) |
| `/*` (Not Found) | `src/app/not-found.js` | Luxury branded 404 page with return home & quick assistance links |
