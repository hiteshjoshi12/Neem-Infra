# Website Owner Checklist — Pre & Post-Deployment SEO, AEO & MilesWeb Production Verification

**Website:** `https://saudagarproperties.com`  
**Audience:** Website Owner, Executive Directors & Technical Leads  
**Hosting Environment:** MilesWeb (cPanel Node.js / VPS PM2)  
**Status:** Pre-Deployment Audit Completed Locally. Zero Production Database Writes.

---

## 1. Owner-Confirmed Decisions & Architecture Baseline

All parameters below have been confirmed by the business owner and implemented across the staging environment:

| Parameter | Confirmed Value | Implementation Status |
| :--- | :--- | :--- |
| **Authoritative Canonical Host** | `https://saudagarproperties.com` (Apex) | Enforced in `seoConfig.js`, sitemaps, JSON-LD, and robots |
| **Founding Year** | `1999` (yielding dynamically calculated years) | Implemented via server token `{{yearsExperience}}` |
| **Official Corporate Email** | `Saudagar.Properties@Yahoo.In` | Synced in NAP, footer, contact schema, and `llms.txt` |
| **Primary Telephone** | `+91 97185 11207` | Synced in telephone schema and call triggers |
| **Secondary Telephone** | `+91 98112 21207` | Synced across all secondary touchpoints |
| **Office Address** | `38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002` | **100% purged of legacy "Sector 25"** across code and DB |
| **DLF Authorized & Verified Badge** | **ON** (`isDlfAuthorized: true`) | Active in DB default, BusinessProfile, and header views |
| **RERA Registration Claims** | Displayed **only** when official number is present | Unsourced "RERA compliant" slogans purged |
| **Market Statistics** | Sourced stats only via `MarketStat` component | Unsourced claims purged; seeded empty awaiting owner data |
| **Database Isolation** | `saudagar_properties_staging` | Strictly isolated; zero writes to production database |
| **HSTS Policy** | `max-age=31536000` | `preload` and `includeSubDomains` safely removed |
| **Schema Integrity** | Schema.org compliant | `priceRange` purged; `legalName` pending formal certificate |

---

## 2. Database Backup & Isolation Protocol

Before executing any database migration or deployment, ensure isolation and backups:

### A. MongoDB Atlas Snapshot & Offline Dump
Run this command from Windows PowerShell using your isolated staging or production MongoDB URI:
```powershell
mongodump --uri="<YOUR_MONGODB_URI>" --out="./backup-pre-deploy-$(Get-Date -Format 'yyyy-MM-dd')"
```
*To restore if necessary:*
```powershell
mongorestore --uri="<YOUR_MONGODB_URI>" --drop "./backup-pre-deploy-$(Get-Date -Format 'yyyy-MM-dd')/<DATABASE_NAME>"
```

### B. Admin SEO JSON Snapshot
In your browser, navigate to **Admin Panel > SEO > Automatic Website Backups** (`/admin/seo/backups`). Click **Create SEO Snapshot** to download a complete JSON backup of all metadata, redirect rules, custom settings, and business profile records.

---

## 3. Owner Actions & Information Pending Sign-Off [ACTION REQUIRED]

Please review and provide inputs for these 4 specific items prior to final public launch:

- [ ] **1. Legal Corporate Entity Name (`legalName`):**
  - *Current Status:* Omitted from Schema.org JSON-LD to prevent unverified corporate claims.
  - *Action:* If registered as a private limited company or registered partnership (e.g., *Saudagar Properties Private Limited*), provide the exact certificate legal name to populate `legalName`. If operating as a sole proprietorship, standard practice is to omit `legalName` and use `Saudagar Properties`.

- [ ] **2. Sourced Market Statistics:**
  - *Current Status:* All unsourced claims (e.g. "+7.4% YOY", "₹180+ Cr off-market", "100% legal", "100% satisfaction") have been removed from the platform. The new `MarketStat` component renders **only** when all 5 fields (`value`, `label`, `sourceName`, `sourceUrl`, `asOfDate`) are filled.
  - *Action:* Provide verified figures for any of the 6 recommended market topics:
    1. *Average Price per Sq Ft in DLF Phase 1–5* (Source: JLL / PropTiger / Circle Rates)
    2. *Gross Rental Yield across Golf Course Road Corridor* (Source: Knight Frank)
    3. *Builder Floor vs High-Rise Apartment Price Gap* (Source: Anarock Research)
    4. *Tehsil Deed Registrations in DLF Gurugram* (Source: Haryana Revenue Dept)
    5. *Average Plot Sizes in DLF Phase 2* (Source: Town & Country Planning)
    6. *Ready-to-Move vs Under-Construction Preference* (Source: 99acres Insight)

- [ ] **3. Executive Leadership Photography:**
  - *Current Status:* Executive portraits for `Mr. Arun Sharma` and `Mrs. Suneeta Chawla` display elegant gold monograms (`AS`, `SC`) to prevent publishing unverified stock photography.
  - *Action:* Upload high-resolution professional portraits via **Admin Panel > Team / Leadership**.

- [ ] **4. Individual Resale Property RERA IDs (Where Applicable):**
  - *Clarification:* Secondary market builder floors and private resale residences in DLF Phases typically do not have individual project RERA registration IDs (HARERA primarily issues agent licenses and promoter project registrations for new construction). 
  - *Action:* In **Admin Panel > Properties**, only enter a HARERA registration number if a specific new-build project registration or official agent registration identifier applies. Otherwise, leave blank—the system will cleanly omit the badge without penalizing the listing.

---

## 4. Google Search Console & Search Engine Setup

*To be completed once DNS points to MilesWeb:*

1. **Domain Property Setup (Recommended):**
   - Visit [Google Search Console](https://search.google.com/search-console).
   - Add property as a **Domain property** (`saudagarproperties.com`).
   - Add the DNS TXT verification record in your MilesWeb cPanel / DNS Zone Editor.
2. **XML Sitemap Submission:**
   - In GSC, click **Sitemaps**.
   - Submit `https://saudagarproperties.com/sitemap.xml`.
   - Verify status reports `Success` and all routes are discovered. Note: Sitemaps contain `lastmod` only for real admin-edited documents.
3. **Bing Webmaster Tools & IndexNow:**
   - Add site to [Bing Webmaster Tools](https://www.bing.com/webmasters).
   - In **Admin Panel > SEO > Global Settings**, enter your Bing verification token.
   - Note: IndexNow instantly notifies Microsoft Bing, Yandex, and Seznam. Google does not use IndexNow; Google relies on your XML sitemap.
4. **Google Business Profile (GBP) Alignment:**
   - Confirm your GBP primary website URL points to apex `https://saudagarproperties.com` (not `http` or `www`).
   - Verify NAP consistency: Phone `+91 97185 11207`, Address `38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002`.

---

## 5. MilesWeb Deployment Runbook

### Step 1: MilesWeb Hosting Environment Setup
- **Hosting Tier:** MilesWeb VPS (Recommended with Ubuntu 22.04 LTS + Nginx + PM2) or cPanel "Setup Node.js App" (Passenger/CloudLinux).
- **Node.js Version:** `Node.js 20.x LTS` (Required: >= 18.18.0).
- **Build Memory:** Building Next.js requires minimum 2GB RAM. If running on shared cPanel with 1GB memory cap:
  - Run `npm run build` locally on your workstation.
  - Upload the production bundle (`.next/standalone`, `.next/static`, and `public/`) to MilesWeb.
- **Image Optimization:** Ensure `sharp` is installed in `node_modules` (`npm install --platform=linux --arch=x64 sharp`).
- **Process Manager:** For VPS, configure PM2:
  ```bash
  pm2 start .next/standalone/server.js --name "saudagar-next" -i max
  pm2 save
  pm2 startup
  ```

### Step 2: Production Environment Variables (.env)
Configure these variables directly in MilesWeb cPanel / PM2 environment (never commit to git):
```ini
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<ATLAS_HOST>/saudagar_properties_prod?retryWrites=true&w=majority
JWT_SECRET=<STRONG_RANDOM_SECRET_64_CHARS>
NEXT_PUBLIC_BASE_URL=https://saudagarproperties.com
```

### Step 3: MongoDB Atlas IP Whitelist
- Log into MongoDB Atlas > **Network Access**.
- Add the **MilesWeb server's dedicated static IP address**.
- Do NOT leave `0.0.0.0/0` (allow from anywhere) open in production.

### Step 4: Reverse Proxy & Single-Layer Redirect Configuration
Direct all protocol and subdomain canonicalization in **ONE layer only** (Nginx / Apache) to prevent redirect loops:

*For Nginx Reverse Proxy (`/etc/nginx/sites-available/saudagarproperties.com`):*
```nginx
# 1. HTTP to HTTPS & WWW to Apex redirect (Single Hop 301)
server {
    listen 80;
    listen [::]:80;
    server_name saudagarproperties.com www.saudagarproperties.com;
    return 301 https://saudagarproperties.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.saudagarproperties.com;
    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;
    return 301 https://saudagarproperties.com$request_uri;
}

# 2. Authoritative Apex Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name saudagarproperties.com;

    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;

    # Gzip / Brotli Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Immutable static assets caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Pass all traffic to Next.js with forwarded headers
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Windows PowerShell Post-Deploy Verification Script

Save this script as `verify-production.ps1` and execute from Windows PowerShell after pointing DNS to MilesWeb:

```powershell
<#
.SYNOPSIS
  Post-Deploy Verification Script for Saudagar Properties on MilesWeb
.DESCRIPTION
  Automated tests for HTTP->HTTPS, WWW->Apex, HSTS headers, robots, sitemaps, API security, and raw SSR text.
#>

$TargetHost = "saudagarproperties.com"
$BaseUrl = "https://$TargetHost"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " STARTING PRODUCTION VERIFICATION FOR $TargetHost" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Test HTTP to HTTPS Redirect
Write-Host "[1/7] Testing HTTP -> HTTPS Redirect..." -NoNewline
$httpRes = & curl.exe -s -o /dev/null -w "%{http_code} %{redirect_url}" "http://$TargetHost"
if ($httpRes -match "301" -and $httpRes -match "https://$TargetHost") {
    Write-Host " [PASS] (Returned 301 -> $BaseUrl)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Returned $httpRes)" -ForegroundColor Red
}

# 2. Test WWW to Apex Redirect
Write-Host "[2/7] Testing WWW -> Apex Redirect..." -NoNewline
$wwwRes = & curl.exe -s -o /dev/null -w "%{http_code} %{redirect_url}" "https://www.$TargetHost"
if ($wwwRes -match "301" -and $wwwRes -match "https://$TargetHost") {
    Write-Host " [PASS] (Returned 301 -> $BaseUrl)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Returned $wwwRes)" -ForegroundColor Red
}

# 3. Test Security Headers (HSTS, etc.)
Write-Host "[3/7] Testing HSTS & Security Headers..." -NoNewline
$headers = & curl.exe -s -I "$BaseUrl"
if ($headers -match "strict-transport-security:\s*max-age=31536000" -and $headers -notmatch "includeSubDomains" -and $headers -notmatch "preload") {
    Write-Host " [PASS] (HSTS max-age=31536000 confirmed without preload/includeSubdomains)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (HSTS header mismatch in: $headers)" -ForegroundColor Yellow
}

# 4. Test Robots.txt
Write-Host "[4/7] Testing /robots.txt..." -NoNewline
$robots = & curl.exe -s "$BaseUrl/robots.txt"
if ($robots -match "Disallow:\s*/admin/" -and $robots -match "Disallow:\s*/api/" -and $robots -match "sitemap.xml") {
    Write-Host " [PASS] (Properly allows public routes, disallows /admin/ and /api/)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Unexpected robots.txt content)" -ForegroundColor Red
}

# 5. Test Sitemap.xml
Write-Host "[5/7] Testing /sitemap.xml..." -NoNewline
$sitemap = & curl.exe -s "$BaseUrl/sitemap.xml"
if ($sitemap -match "<urlset" -and $sitemap -match "https://$TargetHost") {
    Write-Host " [PASS] (Valid XML sitemap emitted with apex URLs)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Sitemap failed to return valid XML)" -ForegroundColor Red
}

# 6. Test Security Guard on Mutating Admin APIs
Write-Host "[6/7] Testing Security Guards on Protected APIs..." -NoNewline
$apiGuard = & curl.exe -s -o /dev/null -w "%{http_code}" -X POST "$BaseUrl/api/seo/settings" -H "Content-Type: application/json" -d "{}"
if ($apiGuard -match "401") {
    Write-Host " [PASS] (Protected route returned 401 Unauthorized)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Expected 401, got $apiGuard)" -ForegroundColor Red
}

# 7. Test Raw SSR Content Visibility (Above-The-Fold Text)
Write-Host "[7/7] Testing SSR HTML Content Visibility (No-JS Check)..." -NoNewline
$html = & curl.exe -s "$BaseUrl"
if ($html -match "38, Akashneem Marg, DLF Phase 2" -and $html -notmatch "Sector 25") {
    Write-Host " [PASS] (NAP address present in server HTML; Sector 25 absent)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] (Address missing from SSR HTML or Sector 25 detected)" -ForegroundColor Red
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " POST-DEPLOY VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
```

---

## 7. Rollback Plan

If unexpected downtime or blocking issues occur post-launch on MilesWeb:
1. **DNS Fallback:** Immediately revert DNS A-record to the previous IP address or maintenance placeholder.
2. **Database Rollback:** If data was altered, restore from the pre-deploy dump using `mongorestore --drop`.
3. **Application Rollback:** In MilesWeb PM2, run `pm2 revert <app-name>` or redeploy the previous stable build artifact from `.next/standalone.bak`.
4. **Cache Invalidation:** In cPanel / Nginx, purge server cache and notify search engines of clean HTTP 200 responses.
