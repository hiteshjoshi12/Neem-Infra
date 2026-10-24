# Database Migration & Seed Guide — Single Source of Truth

**Branch:** `seo-aeo-geo-overhaul`  
**Target Database:** MongoDB (via Mongoose)  
**Migration Script:** `src/scripts/seedCmsFromHardcoded.mjs`  

---

## 1. Overview & Safety Guarantees

This migration transitions all hardcoded marketing copy, SEO configurations, business entity details, corridor landing data, and legacy redirects into MongoDB as the single source of truth.

### Key Guarantees:
- **100% Idempotent:** Safe to run repeatedly. Uses `$setOnInsert` and checks for existing documents before creating.
- **Non-Destructive:** Does NOT drop or overwrite existing customized CMS records or admin accounts.
- **Dry-Run Mode Available:** Run with `--test` or `--dry-run` to preview operations without writing to MongoDB.
- **Zero Downtime:** Changes take effect immediately; Server-Only DAL falls back gracefully if connection is momentarily interrupted.

---

## 2. Prerequisites

Verify that your `.env.local` file contains valid credentials:

```bash
# Required Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/saudagar-properties?retryWrites=true&w=majority

# Required for Authentication
JWT_SECRET=your_jwt_secret_key_here

# Optional: Google Analytics 4 (can also be configured via Admin > SEO)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 3. Step 1: Run Dry-Run Verification

Before executing any database modifications, test the connection and preview changes:

```bash
npm run seed:cms:test
```

*Expected output:*
```
🌱 IDEMPOTENT CMS & SEO SEED MIGRATION
⚠️  MODE: DRY RUN / TEST (No database writes will occur)
✓ Connected to MongoDB.
1. Checking Global SeoSettings...
2. Checking BusinessProfile...
3. Upserting CMS Sections (SectionContent)...
4. Upserting System & Corridor Pages (Page)...
5. Checking Property Catalog...
6. Upserting Standard 301 Redirects...
🎉 IDEMPOTENT CMS & SEO MIGRATION COMPLETED
```

---

## 4. Step 2: Execute the Live Migration

Run the live seed migration:

```bash
npm run seed:cms
```

*Or directly with node:*
```bash
node --env-file=.env.local src/scripts/seedCmsFromHardcoded.mjs
```

---

## 5. Collections Seeded & Document Structures

| Collection | Model | Records Seeded / Managed |
|---|---|---|
| `seosettings` | `SeoSettings` | Global singleton (`singletonKey: 'global_seo_settings'`). Seeds apex canonical base URL (`https://saudagarproperties.com`), default titles, descriptions, AI bot rules, organization schema, and verification codes. |
| `businessprofiles` | `BusinessProfile` | Business singleton (`singletonKey: 'primary_business_profile'`). Seeds official NAP, phone numbers, WhatsApp, founding year (1999), founders, and social profile links. |
| `sectioncontents` | `SectionContent` | 28 CMS section records covering navbar, footer, hero, stats, top consultant, curated corridors, why choose us, testimonials, and micro-market corridor content (`corridor_dlf-phase-1`, etc.). |
| `pages` | `Page` | 11 core system and corridor pages (`/`, `/about`, `/team`, `/contact`, `/properties`, `/property/dlf-phase-1`, `/property/dlf-phase-2`, `/property/dlf-phase-3`, `/property/dlf-phase-4`, `/property/shushant-lok`, `/property/udyog-vihar`) with complete H1, H2, meta titles, descriptions, breadcrumbs, FAQs, and AEO summaries. |
| `properties` | `Property` | 9 verified luxury builder floors and villas with specifications, high-res images, pricing in INR, and verified amenities (only seeded if collection is empty). |
| `redirects` | `Redirect` | Standard technical SEO 301 redirects (`/feed`, `/feed/`, `/category`, `/tag`, `/properties/`). |

---

## 6. Post-Migration Verification

1. **Verify Database Content:**
   Connect via MongoDB Compass or mongosh and run:
   ```javascript
   use saudagar-properties;
   db.seosettings.findOne({ singletonKey: "global_seo_settings" });
   db.businessprofiles.findOne({ singletonKey: "primary_business_profile" });
   db.sectioncontents.countDocuments(); // Expected: 28
   db.pages.countDocuments(); // Expected: >= 11
   db.properties.countDocuments(); // Expected: >= 9
   ```

2. **Verify Frontend Live Rendering:**
   Start the application locally or deploy:
   ```bash
   npm run dev
   ```
   - Check `http://localhost:3000/robots.txt` (verify apex canonical sitemap URL).
   - Check `http://localhost:3000/sitemap.xml` (verify all apex URLs).
   - Check `http://localhost:3000/llms.txt` and `http://localhost:3000/llms-full.txt`.
   - Check `http://localhost:3000/admin` (log in and verify all sections and pages are editable).

---

## 7. Rollback & Disaster Recovery

If you ever need to restore previous data:

### Automated Admin Backups:
Go to **Admin Panel > SEO > Backups** where snapshots can be exported or restored with a single click.

### Manual Backup (Pre-Migration):
```bash
mongodump --uri="YOUR_MONGODB_URI" --out="./backup-pre-migration"
```

### Manual Rollback:
```bash
mongorestore --uri="YOUR_MONGODB_URI" --drop "./backup-pre-migration"
```
