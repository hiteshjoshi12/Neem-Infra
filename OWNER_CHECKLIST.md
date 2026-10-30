# Saudagar Properties — Owner & Webmaster Post-Deployment Checklist

**Domain:** `saudagarproperties.com`  
**Target Post-Deployment Indexable Count:** 67 Verified Canonical Pages in Sitemap  
**Compliance Standard:** Google Search Essentials & Search Console Quality Guidelines  
**Status:** Pre-Deployment Fixes Complete. Awaiting Owner Review & Input.

---

## 1. Honest Framing: How Google Indexation Works

> **FUNDAMENTAL PRINCIPLE:**  
> **Indexing is Google's autonomous decision.**  
> Technical SEO fixes remove all crawler road-blocks, eliminate canonical confusion, and ensure valid server responses. However, Google only indexes pages that demonstrate **unique information gain, high editorial quality, and genuine business authority**.

### What This Remediation Does:
1. **Eliminates Technical Failure Modes:** Eliminates host confusion (`www` vs apex), self-referencing canonical discrepancies, redirect chains, 404 errors, and accidental `noindex` tags on valuable pages.
2. **Eliminates Crawl Dilution:** Replaces legacy unmanaged URLs, auto-generated WordPress feeds, empty search queries, and thin tag archives with strictly **67 verified 200 OK canonical assets** in `sitemap.xml`.
3. **Identifies Keyword Cannibalization:** Identifies internal competing pages so search equity can be concentrated into dominant micro-market pillars rather than split among near-identical articles, awaiting owner sign-off.

### Realistic Timeline Expectations:
- **Immediate (1–3 days post-deployment):** Googlebot will detect single-hop 301 redirects from `www` and HTTP requests to the apex domain.
- **Validation Cycles (7–14 days):** GSC "Validate Fix" cycles will process *Page with redirect*, *Not found (404)*, and *Duplicate canonical* buckets.
- **Content Quality Re-evaluation (2–6 weeks):** *Crawled - currently not indexed* (94 pages on the old site) is the slowest bucket to change. Google must re-crawl the URLs, observe the 301 redirects or SSR content, and re-compute its indexation thresholds. Google may still decline thin or duplicate pages until unique business facts are added. Total indexation depends on Google's quality evaluation of each page.

---

## 2. Post-Deployment Google Search Console (GSC) Procedure

Follow these exact steps **immediately after the new codebase is deployed to production**:

### Step 1: Resubmit the Clean XML Sitemap
1. Navigate to **Google Search Console** > **Sitemaps** (left menu).
2. If old sitemaps (`sitemap_index.xml`, `post-sitemap.xml`, or `page-sitemap.xml`) exist, click each and select **Remove sitemap**.
3. Under **Add a new sitemap**, enter:
   ```
   sitemap.xml
   ```
   (Full URL: `https://saudagarproperties.com/sitemap.xml`)
4. Click **Submit**.
5. Verify that GSC reports **Status: Success** and shows **67 Discovered Pages**.

---

### Step 2: Live Test & URL Inspection on 10 Key Pages
Use the top **URL Inspection** search bar in GSC for each of the 10 URLs below. For each URL:
- Enter the URL and press Enter.
- Click **TEST LIVE URL** (top right).
- Verify:
  - **Availability:** *URL is available to Google* (Green checkmark)
  - **HTTP Response:** *HTTP 200*
  - **User-declared canonical:** Matches the inspected URL exactly (Apex `https://saudagarproperties.com/...`)
  - **Google-selected canonical:** *Same as user-declared canonical*
- Click **REQUEST INDEXING** (only for these 10 priority pages; see quota guidelines below).

#### The 10 Priority Inspection URLs:
| # | Priority Route | Category | Purpose of Inspection |
|---|---|---|---|
| 1 | `https://saudagarproperties.com/` | Core Homepage | Verify apex canonical, meta tags, and root organization schema. |
| 2 | `https://saudagarproperties.com/property/dlf-phase-1` | Prime Corridor | Test corridor SSR, breadcrumbs, boundary map, and micro-market schema. |
| 3 | `https://saudagarproperties.com/property/dlf-phase-2` | Prime Corridor | Validate fix for previous "crawled, not indexed" status on DLF Phase 2. |
| 4 | `https://saudagarproperties.com/property/shushant-lok` | Prime Corridor | Verify resolution of previous self-redirect loop; confirm 200 OK. |
| 5 | `https://saudagarproperties.com/properties` | Inventory Catalog | Test catalog grid SSR and ensure faceted query parameters do not leak into canonical. |
| 6 | `https://saudagarproperties.com/properties/4-bhk-independent-floor-dlf-phase1` | Active Listing | Verify RealEstateListing schema, image gallery SSR, and floor plan markup. |
| 7 | `https://saudagarproperties.com/properties/3-bhk-independent-floor-dlf-phase-2` | Active Listing | Confirm fix for "Discovered - currently not indexed" WordPress slug. |
| 8 | `https://saudagarproperties.com/services/residential` | Core Service | Confirm fix for "Duplicate without user-selected canonical" & legacy 404. |
| 9 | `https://saudagarproperties.com/blog/luxury-builder-floors-dlf-phase-1-5-guide` | Editorial Flagship | Verify 2,200+ word SSR markup, FAQ schema, and table rendering. |
| 10 | `https://saudagarproperties.com/blog/tag/builder-floors` | Thin Taxonomy | Verify HTTP 200 with `noindex, follow` robots meta tag (preserves link equity). |

---

### Step 3: Trigger "Validate Fix" on GSC Indexing Buckets
Navigate to **Indexing** > **Pages** in GSC. Open each error bucket and click the **VALIDATE FIX** button:

1. **Duplicate, Google chose different canonical than user (15 URLs):**
   - Click **Validate Fix**.
   - *Why it will pass:* All requests to `www` and HTTP now 301-redirect to apex, and root layout fallback canonical has been removed.
2. **Page with redirect (11 URLs):**
   - Click **Validate Fix**.
   - *Why it will pass:* Every redirected URL is confirmed to execute a single permanent 301 hop directly to its destination apex URL.
3. **Excluded by ‘noindex’ tag (10 URLs):**
   - Click **Validate Fix**.
   - *Why it will pass:* The 8 legacy WordPress feed URLs return 410 Gone; only internal search queries and admin paths retain intentional `noindex`.
4. **Not found (404) (2 URLs):**
   - Click **Validate Fix**.
   - *Why it will pass:* `www.saudagarproperties.com/properties` and `www.saudagarproperties.com/services/residential` are redirected directly via 301 to the apex 200 OK pages.
5. **Alternate page with proper canonical tag (6 URLs):**
   - Click **Validate Fix**.
   - *Why it will pass:* Parameterized search filters and HTTP variants consolidate into clean apex canonicals.
6. **Duplicate without user-selected canonical (1 URL):**
   - Click **Validate Fix**.
   - *Why it will pass:* `https://saudagarproperties.com/services/residential` explicitly declares its own canonical.

---

### Step 4: Strict "Request Indexing" Guidelines
- **Daily Quota Warning:** Google imposes an undisclosed daily quota (typically 10–25 URLs per day) on manual "Request Indexing" submissions. Exceeding this triggers temporary captchas or request rejections.
- **Only Request Indexing for:**
  - The Homepage (`/`)
  - Key corridor pages (`/property/dlf-phase-1`, `/property/dlf-phase-2`, etc.)
  - High-value active property listings
- **NEVER Request Indexing for:**
  - Tag archive URLs (`/blog/tag/*`)
  - Author archive URLs (`/blog/author/*`)
  - Redirecting URLs or old `www` URLs
  - Utility pages (`/privacy-policy`, `/terms`)

---

### Step 5: Monitoring Milestones (2 Weeks & 4 Weeks)

#### Milestone 1: Week 2 Check-in
- **Check Sitemap Processing:** Confirm sitemap shows 67 submitted URLs and zero sitemap fetch errors.
- **Check Validation Progress:** In the **Pages** report, check whether validations for *Page with redirect*, *404*, and *Duplicate canonical* have changed to "Passed".
- **Inspect Search Performance:** Check **Performance** > **Search results** to confirm impressions for branded queries ("Saudagar Properties", "Saudagar Properties DLF") are accumulating on apex URLs.

#### Milestone 2: Week 4 Check-in
- **Evaluate "Crawled - currently not indexed":** Review the 94 legacy URLs in this bucket. Verify that legacy feed URLs have disappeared from the report and been reclassified under 410 or redirects.
- **Evaluate Indexation Status:** Review indexed canonical URLs across corridors, active property listings, and editorial blog posts. Note any pages Google continues to hold in "Crawled - currently not indexed" for content enhancement.
- **Review Search Queries:** Identify queries driving clicks and note which property listings need more detail to rank for specific terms like "4 BHK DLF Phase 1 builder floor".

---

## 3. Mandatory Business Fact Rule: Zero Fabrication Policy

> **MANDATORY EDITORIAL RULE:**  
> Every published market figure, circle rate, stamp duty percentage, or financial yield **must cite an official government or institutional source and state an as-of date**. Fabricated benchmarks are strictly prohibited.

---

## 4. Comprehensive Checklist of OWNER INPUT NEEDED

To provide genuine E-E-A-T signals and unique transactional utility that warrants indexation, real business facts must be supplied by the business owner.

### Category A: Author & Founder Identity (E-E-A-T Compliance)
*Author archive pages (`/blog/author/*`) currently emit `noindex, follow` to prevent search engines from indexing thin content archives. To enhance E-E-A-T signals across editorial articles and index author profiles, provide:*

- [ ] **Arun Sharma (Founder & Principal Broker):**
  - **High-Resolution Portrait Photo:** Minimum 800x800px, professional attire, solid or office background (PNG/JPG).
  - **Professional Biography (150–250 words):** Years of experience in Gurugram real estate, specific expertise (e.g. DLF Phase 1–5 kothis, builder floors, plot acquisitions), professional affiliations, and real estate licenses.
  - **Social & Professional Profiles:** LinkedIn profile URL, Twitter/X URL.
- [ ] **Suneeta Chawla (Senior Real Estate Consultant):**
  - **High-Resolution Portrait Photo:** Minimum 800x800px.
  - **Professional Biography (150–250 words):** Specialization in Sushant Lok 1, Golf Course Road residential properties, client advisory track record.
  - **Social & Professional Profiles:** LinkedIn profile URL.

---

### Category B: Property Listings Audit & Data Collection (All 9 Active Sitemap Listings)

All 9 listings below match the `sitemap.xml` exactly, audited directly from MongoDB:

| # | Slug | Listing Title | Plot Size | Floor Level | Words | Highest Similarity Pair | Flags & Recommendations |
|---|---|---|---|---|---|---|---|
| 1 | `4-bhk-independent-floor-dlf-phase1` | 4 BHK Independent Floor DLF Phase 1 | 500 Sq. Yds. | 4th of 4 (Stilt+4) | 127w | 59.9% with #2 | Slug has `phase1` without hyphen. Retain as canonical; legacy `phase-1` redirects here. |
| 2 | `4-bhk-independent-floor-dlf-phase-2` | 4 BHK Independent Floor DLF Phase 2 | 502 Sq. Yds. | 4th of 4 (Stilt+4) | 122w | 58.2% with #4 | Primary Phase 2 listing. |
| 3 | `villa-in-sushant-lok-1` | Villa in Sushant Lok 1 | 302 Sq. Yds. | Ground + 2 Floors | 117w | 30.1% with #7 | Distinct villa typology. |
| 4 | `4-bhk-independent-floor-dlf-phase-2-2` | 4 BHK Independent Floor DLF Phase 2 | 402 Sq. Yds. | 4th of 4 (Stilt+4) | 115w | 58.2% with #2 | **Flagged duplicate slug (`-2-2`).** Recommend updating title to *"4 BHK Independent Floor (402 Yard) DLF Phase 2"* to differentiate intent, or 301 merge into #2 awaiting owner approval. |
| 5 | `3-bhk-independent-floor-dlf-phase-2` | 3 BHK Independent Floor DLF Phase 2 | 251 Sq. Yds. | 2nd of 4 Floors | 111w | 37.6% with #2 | Primary 3 BHK listing in Phase 2. |
| 6 | `4-bhk-independent-floor-dlf-phase-1-2` | 4 BHK Independent Floor (502 Yard) DLF Phase 1 | 502 Sq. Yds. | 1st of 4 Floors | 118w | 40.6% with #1 | **Flagged duplicate slug (`-1-2`).** Differentiated by plot size (502 Yard) and 1st floor level. |
| 7 | `4-bhk-independant-floor-in-sushant-lok-phase-1` | 4 BHK Independent Floor Sushant Lok Phase 1 | 300 Sq. Yds. | 3rd of 4 Floors | 113w | 35.4% with #8 | **Flagged typo slug (`independant`).** Retain 301 alias from `independent` to avoid broken backlink equity while keeping canonical. |
| 8 | `3-bhk-independent-floor-dlf-phase-2-2` | 3 BHK Independent Floor (215 Yard) DLF Phase 2 | 215 Sq. Yds. | 1st of 4 Floors | 110w | 35.4% with #7 | **Flagged duplicate slug (`-2-2`).** Differentiated by plot size (215 Yard) and 1st floor level. |
| 9 | `duplex-villa-in-dlf-phase-1` | Duplex Villa in DLF Phase 1 | 500 Sq. Yds. | Ground + 1 + Basement | 108w | 33.3% with #7 | Distinct duplex villa typology. |

#### Input Needed From Owner for Each Property:
Please provide verified factual values (no placeholders or fabricated numbers):

| Property Slug | Plot Area (Sq Yds) | Asking Price / Price on Request | DTCP Haryana Sanction / OC Date | Elevator Brand & Stilt Parking Bays |
|---|---|---|---|---|
| `4-bhk-independent-floor-dlf-phase1` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `4-bhk-independent-floor-dlf-phase-2` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `villa-in-sushant-lok-1` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `4-bhk-independent-floor-dlf-phase-2-2` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `3-bhk-independent-floor-dlf-phase-2` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `4-bhk-independent-floor-dlf-phase-1-2` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `4-bhk-independant-floor-in-sushant-lok-phase-1` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `3-bhk-independent-floor-dlf-phase-2-2` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |
| `duplex-villa-in-dlf-phase-1` | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] | [OWNER INPUT NEEDED: figure, source link, date] |

---

### Category C: Corridor Real Estate Benchmarks & Circle Rates

Supply official circle rates and transaction figures for each corridor hub:

- [ ] **DLF Phase 1 (Sectors 26 & 26A):**
  - Tehsil Wazirabad residential circle rate: **[OWNER INPUT NEEDED: figure, source link, date]**
  - Average transaction price benchmark: **[OWNER INPUT NEEDED: figure, source link, date]**
- [ ] **DLF Phase 2 (Sectors 25 & 25A):**
  - Residential circle rate: **[OWNER INPUT NEEDED: figure, source link, date]**
  - Price per sq ft benchmark for builder floors: **[OWNER INPUT NEEDED: figure, source link, date]**
- [ ] **DLF Phase 3 (Sector 24):**
  - Standard residential circle rate: **[OWNER INPUT NEEDED: figure, source link, date]**
  - Commercialized / rental corridor circle rate: **[OWNER INPUT NEEDED: figure, source link, date]**
- [ ] **DLF Phase 4 (Sector 28):**
  - Residential circle rate: **[OWNER INPUT NEEDED: figure, source link, date]**
  - Galleria / Hamilton Court commercial benchmark: **[OWNER INPUT NEEDED: figure, source link, date]**
- [ ] **Sushant Lok 1 (Sectors 43 & 27):**
  - Circle rate across Blocks A, B, C: **[OWNER INPUT NEEDED: figure, source link, date]**
- [ ] **Udyog Vihar (Phases 1–5):**
  - HSIIDC industrial land circle rate per sq meter: **[OWNER INPUT NEEDED: figure, source link, date]**

---

### Category D: Cannibalization Audit — Decisions Required from Owner
*Our content audit discovered overlapping clusters across 141 article pairs. Review the recommended actions and provide sign-off before any redirect is executed:*

#### Cluster 1: DLF Phase 1 Luxury Floors (5 Articles)
1. `luxury-builder-floors-dlf-phase-1-5-guide` (2,246 words) — **Flagship Guide**
2. `builder-floors-dlf-phase-1-prices-amenities` (1,581 words) — 74% similarity
3. `brand-new-floor-in-dlf-phase-1` (1,085 words) — 76% similarity
4. `4-bhk-independent-floor-dlf-phase-1-gurgaon` (1,460 words) — 72% similarity
5. `luxury-floor-in-dlf-phase-1-guide` (1,166 words) — 75% similarity

- [ ] **Option A (Recommended):** Consolidate sub-articles into the flagship guide with 301 redirects, merging unique amenities and price benchmarks.
- [ ] **Option B:** Keep separate by sharply differentiating intent (e.g. Article 2 becomes a *Price Calculator*, Article 3 becomes an *ROI Report*).

#### Cluster 2: DLF Phase 2 Property Dealer vs Kothi Comparison
1. `best-property-dealer-in-dlf-phase-2` (1,380 words)
2. `best-kothi-in-dlf-phase-2` (1,290 words) — 83% text similarity

- [ ] **Option A (Recommended):** 301 redirect `best-kothi-in-dlf-phase-2` to `best-property-dealer-in-dlf-phase-2`.
- [ ] **Option B:** Keep both, rewording the kothi article strictly as an architectural specification checklist.

#### Cluster 3: DLF Phase 3 Investment vs Dealer Articles
1. `kothi-for-sale-in-dlf-phase-3` (2,012 words)
2. `builder-floor-in-dlf-phase-3` (1,540 words) — 78% similarity
3. `rental-property-in-dlf-phase-3` (1,694 words) — 70% similarity
4. `property-dealers-in-dlf-phase-3` (1,280 words) — 69% similarity

- [ ] **Option A (Recommended):** Consolidate dealer & rental post into primary guide.
- [ ] **Option B:** Refocus rental post strictly on Cyber Hub corporate yields.

---

## 5. Summary of Deliverables & Verified Baseline Comparison

| Metric / Category | Baseline (Old Live Server) | New Next.js Architecture | Empirical Verification Status |
|---|---|---|---|
| **Page with redirect** | 11 URLs | 0 (All 1-hop 301 to apex) | **PASS** — Verified via `curl.exe -I` (11/11 resolved in 1 hop to 200 OK) |
| **Excluded by noindex** | 10 URLs | Feeds pruned; search protected | **PASS** — Feeds return 410; search protected with X-Robots-Tag |
| **Alternate with proper canonical** | 6 URLs | 0 (Consolidated into apex) | **PASS** — 0 duplicate canonical conflicts; clean self-referencing apex tags |
| **Not found (404)** | 2 URLs | 0 (301 redirected to apex) | **PASS** — `www` routes 301-redirected directly to 200 OK apex pages |
| **Duplicate without canonical** | 1 URL | 0 (Self-canonical emitted) | **PASS** — `/services/residential` emits explicit self-referencing canonical |
| **Duplicate, Google chose different** | 15 URLs | 0 (Apex only, root fallback removed) | **PASS** — Removed `alternates.canonical: '/'` from root layout |
| **Discovered - not indexed** | 3 URLs | 0 (All 301-mapped & internally linked) | **PASS** — Legacy property slugs 301-redirected to catalog with inlinks |
| **Crawled - currently not indexed** | 94 URLs | 53 host variants 301-redirected; feeds 410'd | **PASS** — Cleaned crawl waste; enriched SSR markup for all active assets |
| **Total Indexable Sitemap Assets** | Unmanaged legacy URLs | **67 Clean Canonical URLs** | **PASS** — Sitemap emits strictly 67 verified 200 OK canonical assets |
| **Internal Links** | Fragmented link graph | 100% sitemap URLs have $\ge$5 inlinks | **PASS** — Full crawl shows 0 orphan URLs; corridors have 60–75 inlinks |

---

*For full technical audit data and classification of all 142 URLs, refer to [INDEXING_REMEDIATION.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/INDEXING_REMEDIATION.md).*
