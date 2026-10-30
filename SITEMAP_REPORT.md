# XML Sitemap Index Architecture & Verification Report
**Platform:** Saudagar Properties Gurugram (Next.js 16 App Router + MongoDB Atlas)  
**Execution Timestamp:** 2026-10-30T19:35:00+05:30  
**Verification Environment:** Next.js Production Build (`next build --webpack` + `next start`)

---

## 1. Executive Summary

The single-file sitemap has been rebuilt into an admin-governed, **Yoast-style XML Sitemap Index architecture**. The root entrypoint `/sitemap_index.xml` (mirrored by `/sitemap.xml`) lists isolated child sitemaps categorized strictly by content typology.

Every URL included is an absolute HTTPS URL derived dynamically from the Canonical Base URL stored in MongoDB (`SeoSettings.canonicalBaseUrl`). No URLs are duplicated across child sitemaps, no dead or redirected URLs are included, and empty child sitemaps are omitted from the index until valid indexable entries exist.

---

## 2. Sitemap Index Hierarchy & Typology Mapping

| Sitemap File | Content Scope | Database Source | Live URL Count | Last Modified |
| :--- | :--- | :--- | :---: | :--- |
| **`/sitemap_index.xml`** | Master Index File | Auto-aggregated | **6 Child Sitemaps** | `2026-10-30T12:19:33+00:00` |
| **`/page-sitemap.xml`** | Core Pages (`/`, `/about`, `/contact`, `/team`, `/terms`, `/privacy-policy`, `/properties`, `/blog`) | `Page` (custom/system) | **8** | `2026-10-30T12:19:33+00:00` |
| **`/service-sitemap.xml`** | Service Landing Pages (`/services/residential`, `/services/commercial`, `/services/industrial`) | `Page` (`/services/*`) | **3** | `2026-10-30T12:19:33+00:00` |
| **`/property-sitemap.xml`** | Verified Luxury Property Listings (`/properties/[slug]`) | `Property` (`isActive: true`) | **9** | `2026-10-30T11:46:34+00:00` |
| **`/corridor-sitemap.xml`** | Micro-Market Corridor Landing Pages (`/property/[slug]`) | `Page` / `SectionContent` | **6** | `2026-10-30T12:19:33+00:00` |
| **`/blog-sitemap.xml`** | Editorial Real Estate Journal Articles (`/blog/[slug]`) | `BlogPost` (`status: published`) | **38** | `2026-10-30T11:46:35+00:00` |
| **`/blog-category-sitemap.xml`** | Editorial Category Archive Pages (`/blog/category/[slug]`) | `Category` (non-thin) | **4** | `2026-10-30T11:46:35+00:00` |
| **`/blog-tag-sitemap.xml`** | Tag Archive Pages (`/blog/tag/[slug]`) | `Tag` (indexable only) | *0 (Toggle OFF)* | *Omitted from Index* |
| **`/author-sitemap.xml`** | Editorial Author Profiles (`/blog/author/[slug]`) | `Author` (quality-gated) | *0 (No Photos Yet)* | *Omitted from Index* |

> **Total Verified URLs Indexed:** **68 URLs**  
> **Cross-Sitemap URL Duplication:** **0 duplicates** (100% mutually exclusive partitions).

---

## 3. Strict Rules & Protocols Enforced

1. **Dynamic Canonical Domain:** Absolute `https://` URLs are dynamically constructed using `SeoSettings.canonicalBaseUrl`. Never hardcoded, never HTTP, and never localhost.
2. **Quality & Indexability Filtering:**
   - Only HTTP 200 URLs are included.
   - Any document marked `robots.index: false` or `noindex` is automatically excluded.
   - Draft, deactivated (`isActive: false`), or archived documents are excluded.
   - Any URL with an active redirect in the `Redirect` collection is excluded (e.g., `/services` redirects to `/#services` and is omitted; `/property/sushant-lok` 301 redirects to `/property/shushant-lok` and only the canonical target is included).
   - Only URLs whose canonical points to themselves are included.
3. **Genuine Real-Time `<lastmod>`:**
   - `<lastmod>` represents the document's real `updatedAt` date in W3C ISO 8601 with timezone (`YYYY-MM-DDTHH:mm:ss+00:00`).
   - For `/sitemap_index.xml`, each child sitemap's `<lastmod>` is dynamically computed as the newest `<lastmod>` among the URLs contained in that child.
4. **Google Compliance:**
   - Obsolete `<priority>` and `<changefreq>` tags are omitted per Google Search Console guidelines.
   - Proper XML declaration `<?xml version="1.0" encoding="UTF-8"?>`, namespace `http://www.sitemaps.org/schemas/sitemap/0.9`, and XML entity escaping (`&amp;`, `&lt;`, etc.).
   - Header: `Content-Type: application/xml; charset=utf-8`.
5. **Split Sitemaps (> 50,000 URLs / 50 MB):**
   - Built-in chunking automatically partitions any child collection exceeding 50,000 URLs into numbered parts (e.g. `blog-sitemap-2.xml`) and registers all parts in the index.
6. **Omission of Empty Child Sitemaps:**
   - If a child sitemap is disabled or contains 0 valid URLs, it is omitted from `/sitemap_index.xml` so search engines never crawl empty index files.

---

## 4. Routing, Middleware & Proxy Hardening

- **Route Handlers:** Next.js built-in single-file `src/app/sitemap.js` was deleted. Independent Next.js App Router route handlers were established for `/sitemap_index.xml/route.js`, `/sitemap.xml/route.js`, and each child sitemap.
- **Root `[slug]` Protection:** Added guard clause at the entry point of `src/app/(marketing)/[slug]/page.js` to immediately return `notFound()` if any `.xml` or sitemap pattern reaches it, preventing dynamic catch-all collisions.
- **Proxy & Trailing Slash Resolution:**
  - In `src/proxy.js`, sitemap requests (e.g. `/sitemap_index.xml`, `/page-sitemap.xml`, etc.) are recognized upfront.
  - When requested with a trailing slash (e.g., `/sitemap_index.xml/` or `/page-sitemap.xml/`), proxy internally rewrites them to the clean path, returning HTTP 200 OK directly with zero hops and zero external domain redirection.
- **Robots.txt Single Source of Truth:**
  - `src/app/robots.js` updated to emit exactly one Sitemap directive pointing to the index:
    `Sitemap: https://saudagarproperties.com/sitemap_index.xml`
  - No sitemap URLs are blocked by `robots.txt`.

---

## 5. Admin Controls & Editorial Governance

1. **SEO Admin "XML Sitemaps" Screen (`/admin/seo/sitemaps`):**
   - Integrated into Admin Navigation under **SEO & Growth Engine** (`XML Sitemaps Index`).
   - On/off switch toggles for each of the 8 child sitemaps.
   - Live read-only metrics table displaying each child sitemap's URL, live document count, real last modified timestamp, index status badge (`In Index`, `Empty (Omitted)`, `Disabled`), and direct link to open the raw XML.
   - Master Index card with aggregate counts and instant save/purge controls.
2. **"Exclude from sitemap" Toggles Added Across All Content CMS:**
   - **Website Pages:** Toggle added under Meta Robots tab in `SeoPageEditor.jsx`.
   - **Property Listings:** Toggle added under Publishing Status in `admin/properties/page.js`.
   - **Blog Posts:** Toggle added in editorial sidebar under Status in `BlogEditor.jsx`.
   - **Blog Categories:** Toggle added in category modal in `admin/seo/categories/page.js`.
   - **Editorial Authors:** Toggle added in author profile editor in `admin/pages/authors/page.js`.

---

## 6. Real-Time Freshness & Cache Purging

- Added `revalidateSitemaps()` to `src/lib/cache/revalidateHelper.js`.
- Utilizes `revalidateTag(tag, { expire: 0 })` across tags (`sitemaps`, `sitemap_index`, `sitemap_pages`, `sitemap_blogs`, etc.) and purges sitemap route cache paths.
- Connected to all relevant creation, update, deactivation, slug modification, and deletion API endpoints (`/api/properties`, `/api/blog`, `/api/seo/categories`, `/api/authors`, `/api/seo/pages`, `/api/seo/settings`).
- Route handlers specify `export const dynamic = 'force-dynamic'` and `export const revalidate = 0`, guaranteeing instantaneous updates on the very first request following any admin change.

---

## 7. Verification Test Suite Execution Results

Automated production verification was executed against the compiled server (`next start -p 5000`):

```
====================================================
   SAUDAGAR PROPERTIES — SITEMAP SYSTEM TEST SUITE  
====================================================

Canonical Base URL from DB: https://saudagarproperties.com

--- TEST 1: SITEMAP INDEX & MIRROR CHECKS ---
[/sitemap_index.xml] Status: 200 | Content-Type: application/xml; charset=utf-8 | Valid XML: true
[/sitemap.xml] Status: 200 | Content-Type: application/xml; charset=utf-8 | Valid XML: true
[/sitemap_index.xml/] Status: 200 | Content-Type: application/xml; charset=utf-8 | Valid XML: true

--- TEST 2: CHILD SITEMAPS IN INDEX & ISOLATION ---
Discovered 6 child sitemaps in index:
  -> https://saudagarproperties.com/page-sitemap.xml (lastmod: 2026-10-30T12:19:33+00:00)
  -> https://saudagarproperties.com/service-sitemap.xml (lastmod: 2026-10-30T12:19:33+00:00)
  -> https://saudagarproperties.com/property-sitemap.xml (lastmod: 2026-10-30T11:46:34+00:00)
  -> https://saudagarproperties.com/corridor-sitemap.xml (lastmod: 2026-10-30T12:19:33+00:00)
  -> https://saudagarproperties.com/blog-sitemap.xml (lastmod: 2026-10-30T11:46:35+00:00)
  -> https://saudagarproperties.com/blog-category-sitemap.xml (lastmod: 2026-10-30T11:46:35+00:00)

--- TEST 3: CHILD SITEMAP CONTENT & ZERO DUPLICATION ---
Checking page-sitemap.xml: Status: 200 | XML: true | Count: 8 URLs
  ✓ Index lastmod perfectly matches newest child document date
Checking service-sitemap.xml: Status: 200 | XML: true | Count: 3 URLs
  ✓ Index lastmod perfectly matches newest child document date
Checking property-sitemap.xml: Status: 200 | XML: true | Count: 9 URLs
  ✓ Index lastmod perfectly matches newest child document date
Checking corridor-sitemap.xml: Status: 200 | XML: true | Count: 6 URLs
  ✓ Index lastmod perfectly matches newest child document date
Checking blog-sitemap.xml: Status: 200 | XML: true | Count: 38 URLs
  ✓ Index lastmod perfectly matches newest child document date
Checking blog-category-sitemap.xml: Status: 200 | XML: true | Count: 4 URLs
  ✓ Index lastmod perfectly matches newest child document date

--- TEST 4: DATABASE COUNTS RECONCILIATION ---
Pages:      Sitemap = 8  | DB = 8  | Match: ✓
Services:   Sitemap = 3  | DB = 3  | Match: ✓
Properties: Sitemap = 9  | DB = 9  | Match: ✓
Corridors:  Sitemap = 6  | DB = 6  | Match: ✓
Blogs:      Sitemap = 38 | DB = 38 | Match: ✓
Categories: Sitemap = 4  | DB = 4  | Match: ✓

--- TEST 5: HTTP 200 & INDEXABILITY CHECK (68 TOTAL URLS) ---
✓ Tested 68 URLs: 68 Passed, 0 Failed (0 redirects, 0 noindex, all HTTP 200)

--- TEST 6: ROBOTS.TXT VERIFICATION ---
Sitemap lines in robots.txt (1):
Sitemap: https://saudagarproperties.com/sitemap_index.xml
✓ robots.txt points exclusively to the sitemap index

--- TEST 7: ADMIN FRESHNESS & MUTATION LIFECYCLE ---
[7A: Blog Post Lifecycle]
1. Post Created -> In /blog-sitemap.xml on first fetch: ✓ YES
2. Slug Changed -> Old URL gone: ✓ | New URL present: ✓
3. Exclude Toggle ON -> URL excluded: ✓
4. Post Deleted -> Cleaned from sitemap: ✓

[7B: Property Listing Lifecycle]
1. Property Created -> In /property-sitemap.xml: ✓ YES
2. Property Exclude Toggle ON -> Excluded: ✓ YES
3. Property Deactivated (isActive=false) -> Excluded: ✓ YES

[7C: Author Gating & Lifecycle]
1. Quality Author Created (Photo + Bio + Post) -> In /author-sitemap.xml: ✓ YES
2. Non-empty Author Sitemap now visible in /sitemap_index.xml: ✓ YES
3. Author Exclude Toggle ON -> Excluded: ✓ YES
4. Author Cleanup -> Empty child omitted from index: ✓ YES

[7D: Category Lifecycle]
1. Category Created (with post) -> In /blog-category-sitemap.xml: ✓ YES
2. Category Exclude Toggle ON -> Excluded: ✓ YES
3. Category Deleted -> Cleaned from sitemap: ✓ YES

====================================================
  ALL SITEMAP SPECIFICATION TESTS PASSED (100% OK)  
====================================================
```

---

## 8. Current System State & Observations

1. **Tag Archives (`/blog-tag-sitemap.xml`):** By default, `tagArchiveRobots` is set to `noindex,follow` and `includeTags` is disabled (`false`) to protect search crawl budget from thin taxonomy pages. It is omitted from `/sitemap_index.xml` as designed.
2. **Author Profiles (`/author-sitemap.xml`):** In the database, existing author profiles are currently awaiting executive photos from the property owners. Under Google Search Console quality rules, author pages without verified photos render with `noindex`. Consequently, `/author-sitemap.xml` currently has 0 indexable URLs and is dynamically omitted from `/sitemap_index.xml`. As proven in Test 7C, as soon as an author profile receives a verified photo, bio, and published articles, it instantly populates `/author-sitemap.xml` and appears in the master index on the first subsequent fetch.
3. **Continuous Testing:** Added `npm run test:sitemaps` to `package.json` and integrated the sitemap validation into `scripts/test-cms-sync-e2e.mjs`.

