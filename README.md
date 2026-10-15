# Saudagar Properties — Premier Real Estate Web Platform & CMS

> **Production-grade Next.js 16 App Router platform for Saudagar Properties Pvt Ltd**, premier luxury real-estate advisory in DLF Gurugram & Golf Course Road.

Built with **Next.js 16 (App Router)**, **React 19**, **MongoDB (Mongoose)**, **Tailwind CSS v4**, **Framer Motion**, and **Nodemailer**.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [NPM Scripts](#npm-scripts)
- [Core Subsystems](#core-subsystems)
  - [1. Luxury Dual-Tone Design System](#1-luxury-dual-tone-design-system)
  - [2. Advanced Editorial Blog Engine & Live Preview](#2-advanced-editorial-blog-engine--live-preview)
  - [3. Lead Capture & Email Dispatch Pipeline](#3-lead-capture--email-dispatch-pipeline)
  - [4. SEO, AEO & GEO Knowledge Graph](#4-seo-aeo--geo-knowledge-graph)
  - [5. Admin CMS Suite](#5-admin-cms-suite)
- [Documentation Index](#documentation-index)
- [Production Deployment](#production-deployment)

---

## 🌟 Overview

Saudagar Properties is a bespoke digital real estate platform engineered for high-net-worth individuals (HNWIs) and NRIs seeking premier properties in DLF Phase 1–5, Golf Course Road, Golf Course Extension, and Southern Peripheral Road (SPR) in Gurugram, India.

The platform combines an editorial luxury aesthetic with strict search engine optimization (SEO), answer engine optimization (AEO), and generative engine optimization (GEO), supported by a high-performance MongoDB backend and administrative content management suite.

---

## ✨ Key Features

- **Architectural Dual-Tone Visual Rhythm**: Seamless interplay between Dark World (`#0E162B`) and Light World (`#F7F5EF`) with Champagne Gold (`#C6A24A`) accents.
- **Server-Side Rendered (SSR) Properties Portfolio**: Fast, dynamic property listings with filterable parameters, high-resolution galleries, amenities, and floor plans.
- **Advanced Blog CMS with Split Live Preview**:
  - 3 view modes: **Canvas**, **Split Live Preview** (instant synchronized rendering matching the live `/blog/[slug]` layout), and **Full Preview**.
  - **1-Click Internal Link Engine** (<kbd>Ctrl+K</kbd>) to search and link published articles, curated corridors, properties, and services.
  - Category, author, and tag taxonomy management.
  - Estimated reading time, table of contents generation, and rich markdown formatting.
- **Automated Lead Management & Email Alerts**:
  - Automated inquiry capture across all contact touchpoints.
  - Real-time HTML email notifications to business inboxes powered by Nodemailer.
  - Honeypot anti-spam bot trap and IP-based rate limiting.
- **Complete Admin CMS**:
  - Token-secured administrative dashboard (`/admin`).
  - Management for Properties, Blog Posts, Section Content, Testimonials, Page Metadata, and Inquiries.
- **Triple-Pillar Discovery Architecture (SEO / AEO / GEO)**:
  - 100% Server-rendered metadata on all public routes.
  - Dynamic `sitemap.xml` and crawler-controlled `robots.txt`.
  - Schema.org JSON-LD for `RealEstateAgent`, `LocalBusiness`, `BreadcrumbList`, `RealEstateListing`, and `BlogPosting`.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16.3.8](https://nextjs.org/) (App Router, Server Components & Route Handlers) |
| **Runtime & UI** | [React 19.2.8](https://react.dev/), [React DOM 19.2.8](https://react.dev/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) via [Mongoose 9.10.4](https://mongoosejs.com/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/postcss`, Vanilla CSS Tokens |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), Playfair Display & Plus Jakarta Sans |
| **Animations** | [Framer Motion 14.0.0](https://www.framer.com/motion/) |
| **Email Service** | [Nodemailer 10.0.15](https://nodemailer.com/) (SMTP with HTML notification templates) |
| **Media & CDN** | [ImageKit 6.0.0](https://imagekit.io/) & Next.js Image Optimization |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HttpOnly cookies |

---

## 📁 Project Architecture

```
├── public/                     # Static brand assets, floorplans, badges
├── scripts/                    # Maintenance & verification scripts
│   ├── audit-seo.mjs           # Automated SEO/AEO/GEO test runner (npm run seo:check)
│   ├── seed-all.mjs            # Database seeding script for fresh setups
│   └── verify-*.mjs            # Phase verification suites
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (marketing)/        # Public marketing pages (/, /about, /contact, /services, etc.)
│   │   ├── admin/              # Secured Admin CMS suite
│   │   │   ├── blog/           # Blog manager, new post editor, edit route
│   │   │   ├── dashboard/      # Overview metrics & stats
│   │   │   ├── inquiries/      # Inquiries lead inbox
│   │   │   ├── pages/          # Page metadata editor
│   │   │   ├── properties/     # Property listings CMS
│   │   │   ├── sections/       # Section content editor
│   │   │   └── testimonials/   # Client review manager
│   │   ├── api/                # Next.js Server Route Handlers
│   │   │   ├── analytics/      # Lead event tracking
│   │   │   ├── auth/           # Login, logout, verification
│   │   │   ├── blog/           # Blog CRUD endpoints
│   │   │   ├── inquiries/      # Inquiry submission & email dispatch
│   │   │   ├── media/          # ImageKit upload handling
│   │   │   ├── pages/          # Dynamic page content APIs
│   │   │   ├── properties/     # Properties CRUD
│   │   │   ├── sections/       # Section content APIs
│   │   │   ├── taxonomies/     # Categories and tags
│   │   │   └── testimonials/   # Testimonials CRUD
│   │   ├── blog/               # Public blog hub, article reader, category/tag/author archives
│   │   ├── properties/         # Public property catalog & detail pages
│   │   ├── layout.js           # Root layout with global JSON-LD Knowledge Graph
│   │   ├── robots.js           # Dynamic crawler instructions
│   │   └── sitemap.js          # Dynamic XML sitemap generator
│   ├── components/             # Reusable UI & Layout Components
│   │   ├── admin/              # Admin CMS UI (BlogEditor, LiveArticlePreview, InternalLinkModal, etc.)
│   │   ├── blog/               # Public blog cards, TOC, reading progress, share buttons
│   │   ├── common/             # Navigation, Footer, Contact modal, Inquiry buttons
│   │   ├── home/               # Homepage architectural sections (Hero, Corridors, Services, etc.)
│   │   └── seo/                # Schema.org JSON-LD injectors
│   ├── lib/                    # Core Utilities & Configurations
│   │   ├── auth/               # JWT token utilities & auth guards
│   │   ├── blog/               # Markdown parsers, slug generators, TOC extractors
│   │   ├── email/              # Nodemailer transport & branded HTML email templates
│   │   ├── mongodb.js          # Serverless-cached Mongoose connection
│   │   └── seo/                # Central SEO configuration (NAP, PAGE_SEO, BREADCRUMBS)
│   ├── models/                 # Mongoose Data Models
│   │   ├── Admin.js            # Admin credentials & roles
│   │   ├── Author.js           # Article authors
│   │   ├── BlogPost.js         # Editorial articles & markdown content
│   │   ├── Category.js         # Taxonomies
│   │   ├── Inquiry.js          # Inquiries & lead records
│   │   ├── Location.js         # Geographic corridors
│   │   ├── Property.js         # Real estate listings
│   │   ├── PropertyType.js     # Taxonomy types
│   │   ├── SectionContent.js   # Editable homepage blocks
│   │   ├── Service.js          # Advisory service models
│   │   ├── Tag.js              # Article tags
│   │   └── Testimonial.js      # Client reviews
│   └── services/               # Data access layer for Server Components & API clients
│       ├── api.js              # Client-side API fetch client
│       ├── blogService.js      # Server-side blog database queries
│       └── propertyService.js  # Server-side property database queries
├── DESIGN-SYSTEM.md            # Dual-tone design tokens, colors & typography rules
├── SEO.md                      # Complete SEO, AEO & GEO specification guide
├── api-map.md                  # Comprehensive API documentation
├── route-map.md                # Next.js App Router route hierarchy
├── migration-audit.md          # Full architectural audit report
└── migration-plan.md           # Migration progress & completion status
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Server & App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# MongoDB Database Connection
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/saudagar_properties?retryWrites=true&w=majority"

# Authentication Security
JWT_SECRET="your-super-strong-jwt-secret-key-32-chars-min"

# Email Alert Dispatch (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE="true"
SMTP_USER="your-notification-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
INQUIRY_RECEIVER_EMAIL="leads@saudagarproperties.com"

# Media Uploads (ImageKit - Optional for direct CDN uploads)
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Initial Database Content (Optional for fresh setup)
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Access Admin Portal
Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to log into the CMS dashboard.

---

## 📜 NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev` | Start Next.js local development server |
| `npm run build` | `next build` | Validate & compile optimized production build |
| `npm run start` | `next start` | Start production server |
| `npm run lint` | `eslint` | Run ESLint strict checks |
| `npm run seed` | `node --env-file=.env.local scripts/seed-all.mjs` | Seed initial database collections |
| `npm run seo:check` | `node scripts/audit-seo.mjs` | Automated 6-pillar SEO / AEO / GEO verification |
| `npm run schema:verify` | `node scripts/verify-schema.mjs` | Verify Mongoose schemas and relationships |

---

## 💎 Core Subsystems

### 1. Luxury Dual-Tone Design System
Adheres to the official [DESIGN-SYSTEM.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/DESIGN-SYSTEM.md). Alternates intentionally between:
- **Dark World (`#0E162B`)**: Deep Midnight Navy conveying institutional authority, high-value investment, and privacy.
- **Light World (`#F7F5EF`)**: Architectural warm ivory providing breathing room and high-contrast readability.
- **Champagne Gold (`#C6A24A`)**: Highlights, verification badges, CTAs, and 1px dividers.
- **Typography**: Playfair Display serif headings paired with Plus Jakarta Sans body typography.

### 2. Advanced Editorial Blog Engine & Live Preview
Located at `src/components/admin/BlogEditor.jsx`:
- **Triple-View Workspace**: Switch between Write Canvas, Split Live Preview, and Full Preview.
- **Synchronous Live Article Preview**: Uses `src/components/admin/LiveArticlePreview.jsx` to render markdown in real time matching the public `/blog/[slug]` typography, hero banners, badges, callouts, and author signatures.
- **1-Click Internal Linking Modal**: Shortcut <kbd>Ctrl+K</kbd> to search and insert semantic markdown links to published blog articles, luxury corridors, listings, or service pages.
- **Taxonomy Management**: Supports categories, tags, author attribution, and SEO canonical overrides.

### 3. Lead Capture & Email Dispatch Pipeline
Located at `src/app/api/inquiries/route.js` and `src/lib/email/emailService.js`:
- Inquiries from Contact forms, Property detail viewing requests, and Floating Consultation modals are persisted to MongoDB.
- Instant automated dispatch of a branded HTML notification email to the executive inbox with applicant details, property interest, and direct WhatsApp/Phone call links.
- Protected against bot spam with hidden honeypot fields (`website_hp`, `company_fax`) and per-IP rolling rate limits.

### 4. SEO, AEO & GEO Knowledge Graph
Detailed in [SEO.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/SEO.md):
- **Traditional SEO**: Fully SSR-rendered metadata, dynamic XML sitemaps syncing properties and blog slugs, and custom canonical URLs.
- **AEO (Voice & Answer Engines)**: `BreadcrumbList` schemas and direct 40–50 word answers beneath major headings.
- **GEO (Generative AI Engines)**: Schema.org `RealEstateAgent` Knowledge Graph with geo-coordinates, brand NAP consistency, and `sameAs` entity links for citation by ChatGPT, Perplexity, Claude, and Gemini.

### 5. Admin CMS Suite
Protected under `src/app/admin/`:
- **Dashboard**: High-level metrics for published properties, inquiries, and blogs.
- **Properties Manager**: Add, edit, feature, and archive real estate listings with image upload support.
- **Blog Manager**: Draft, publish, edit, and organize editorial articles.
- **Inquiries Inbox**: Real-time incoming lead management with status updates (New, Contacted, Closed).
- **Sections & Pages CMS**: Update homepage promotional copy, headline texts, and page-specific metadata.

---

## 📚 Documentation Index

For in-depth architectural and development guidelines, refer to:
- [DESIGN-SYSTEM.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/DESIGN-SYSTEM.md) — Comprehensive visual design specifications and color tokens.
- [SEO.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/SEO.md) — Master guide for Search, Answer & Generative Engine Optimization.
- [api-map.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/api-map.md) — Complete endpoint documentation and request/response specifications.
- [route-map.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/route-map.md) — App Router route structure and access permissions.
- [migration-audit.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/migration-audit.md) — Complete technical audit and production-readiness report.
- [migration-plan.md](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/migration-plan.md) — Multi-stage roadmap and implementation history.

---

## 🚢 Production Deployment

The platform is fully optimized for deployment on [Vercel](https://vercel.com/) or any Node.js container environment:

1. Configure environment variables in the production hosting dashboard.
2. Ensure your MongoDB Atlas cluster allows connections from your deployment IPs (`0.0.0.0/0` for serverless environments).
3. Run `npm run build` locally or let the CI/CD pipeline execute `next build`.
4. Run `npm run seo:check` to ensure 100% SEO integrity prior to release.
