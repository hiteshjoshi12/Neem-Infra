# Saudagar Properties — API Documentation & Endpoint Map

> **Complete Server Route Handlers Specification for Saudagar Properties**  
> Covers Next.js App Router API handlers (`/api/*`), data models, authentication guards, security controls, and email notification pipelines.

---

## 📑 Summary Matrix

| METHOD | ENDPOINT | PURPOSE | ACCESS | DATA MODEL | HIGHLIGHTS |
|:---|:---|:---|:---|:---|:---|
| **GET** | `/api/properties` | Fetch property listings | Public | `Property` | Supports filter queries (`type`, `location`, `status`, `featured`) |
| **GET** | `/api/properties/:id` | Fetch single property | Public | `Property` | Populates specs, amenities & image gallery |
| **POST** | `/api/properties` | Create new property | **Admin (JWT)** | `Property` | Strict payload validation, auto slug generation |
| **PUT** | `/api/properties/:id` | Update property | **Admin (JWT)** | `Property` | Updates listing details, cache revalidation |
| **DELETE** | `/api/properties/:id` | Delete property | **Admin (JWT)** | `Property` | Removes listing record and associated references |
| **GET** | `/api/blog` | Fetch blog posts | Public | `BlogPost` | Supports `status=published/draft`, populates taxonomies |
| **POST** | `/api/blog` | Create blog post | **Admin (JWT)** | `BlogPost` | Validates slug, extracts TOC, revalidates cache |
| **GET** | `/api/blog/:id` | Fetch single post by ID | Public / Admin | `BlogPost` | Full populated post with markdown content |
| **PUT** | `/api/blog/:id` | Update post by ID | **Admin (JWT)** | `BlogPost` | Updates post, handles slug sanitization, revalidates |
| **DELETE** | `/api/blog/:id` | Delete post by ID | **Admin (JWT)** | `BlogPost` | Deletes article and cleans related cache |
| **GET** | `/api/taxonomies` | Fetch all taxonomies | Public / Admin | `Author`, `Category`, `Tag`, `Location`, `PropertyType` | Single aggregation payload for fast client dropdowns |
| **GET** | `/api/taxonomies/tags` | Fetch tags | Public / Admin | `Tag` | Returns tag list |
| **POST** | `/api/taxonomies/tags` | Create tag | **Admin (JWT)** | `Tag` | Adds new tag to database |
| **POST** | `/api/inquiries` | Submit client inquiry | Public | `Inquiry` | **Honeypot protection**, IP rate limit, **automated Nodemailer email alert** |
| **GET** | `/api/inquiries` | List all inquiries | **Admin (JWT)** | `Inquiry` | Returns inquiries sorted by most recent |
| **GET** | `/api/inquiries/:id` | Get single inquiry | **Admin (JWT)** | `Inquiry` | Fetches full lead contact details |
| **PUT** | `/api/inquiries/:id` | Update inquiry status | **Admin (JWT)** | `Inquiry` | Updates status (`new`, `contacted`, `closed`, `archived`) |
| **DELETE** | `/api/inquiries/:id` | Delete inquiry | **Admin (JWT)** | `Inquiry` | Removes inquiry record |
| **GET** | `/api/testimonials` | Fetch testimonials | Public | `Testimonial` | Returns verified client testimonials |
| **POST** | `/api/testimonials` | Create testimonial | **Admin (JWT)** | `Testimonial` | Adds client testimonial |
| **PUT** | `/api/testimonials/:id` | Update testimonial | **Admin (JWT)** | `Testimonial` | Modifies testimonial |
| **DELETE** | `/api/testimonials/:id` | Delete testimonial | **Admin (JWT)** | `Testimonial` | Deletes testimonial |
| **GET** | `/api/sections` | Fetch sections content | Public | `SectionContent` | Fetches homepage editable blocks (Hero, About, etc.) |
| **GET** | `/api/sections/:sectionKey` | Fetch section by key | Public | `SectionContent` | Returns specific section JSON data |
| **PUT** | `/api/sections/:sectionKey` | Update section content | **Admin (JWT)** | `SectionContent` | Updates CMS section content and revalidates |
| **GET** | `/api/pages` | Fetch all page contents | Public | `SectionContent` | Aggregates page sections into key-value map |
| **GET** | `/api/pages/:pageKey` | Fetch single page | Public | `SectionContent` | Returns specific page content structure |
| **PUT** | `/api/pages/:pageKey` | Update page data | **Admin (JWT)** | `SectionContent` | Persists edited page metadata |
| **POST** | `/api/media/upload` | Upload media (SEO-aware) | **Admin (JWT)** | Local FS / CDN | Validates MIME type, generates SEO-friendly slugified filename |
| **POST** | `/api/upload` | General upload endpoint | **Admin (JWT)** | Local / ImageKit | Direct image upload handler |
| **POST** | `/api/analytics/event` | Ingest tracking event | Public | In-Memory / Buffer | Tracks article views, scroll depth, CTAs, phone clicks |
| **POST** | `/api/auth/login` | Admin login | Public | `Admin` | Verifies bcrypt password, sets HttpOnly JWT cookie |
| **GET** | `/api/auth/me` | Current admin session | **Admin (JWT)** | `Admin` | Returns authenticated admin profile |

---

## 🔒 Authentication & Access Control

Admin routes are secured via `@/lib/auth/authGuard.js`:
- Evaluates the `token` cookie or `Authorization: Bearer <token>` header.
- Verifies the signature with `JWT_SECRET`.
- Validates the token payload against MongoDB `Admin` collection.
- Unauthenticated requests return `401 Unauthorized` (`{ success: false, message: 'Authentication required' }`).

---

## 📬 Automated Inquiry & Lead Notification Pipeline

### `POST /api/inquiries`
Processes public inquiries submitted from the Contact page, property schedule viewing modals, and floating consultation prompts.

#### 1. Security & Bot Prevention
- **Honeypot Trap**: Inspects hidden fields `website_hp`, `honeypot`, `company_fax`. If filled by automated spambots, the endpoint silently returns `200 OK` without creating a record or dispatching emails.
- **In-Memory Rate Limiting**: Max 10 submissions per 10-minute window per IP.
- **Payload Sanitization**: Truncates strings and enforces standard email format regex.

#### 2. Email Dispatch Engine (`@/lib/email/emailService.js`)
Upon storing the inquiry in MongoDB, the route automatically executes `sendInquiryNotification(inquiry)` using **Nodemailer**:
- Sends a formatted HTML email to `INQUIRY_RECEIVER_EMAIL` (default: `leads@saudagarproperties.com`).
- Displays inquiry source (`Contact Page`, `Property Schedule Viewing`, `Floating Consultation Modal`), client name, verified phone number, email address, preferred viewing date, and custom message.
- Provides 1-click action buttons to directly call the applicant or launch a pre-populated WhatsApp chat.

---

## 📝 Blog & Editorial Endpoints

### `GET /api/blog`
- Query parameters:
  - `status`: Optional filter (`published` or `draft`). If omitted, returns all records.
- Output: Returns list of posts populated with `author`, `category`, `tags`, `location`, and `propertyType`.

### `POST /api/blog`
- Requires Admin JWT.
- Automatically handles:
  - Markdown content sanitization.
  - Auto-generated or custom slug formatting (`/^[a-z0-9-]+$/`).
  - Auto-calculation of reading time (words / 200).
  - Cache revalidation across `/blog` and `/blog/[slug]`.

### `GET /api/taxonomies`
- Returns an aggregated bundle of:
  ```json
  {
    "success": true,
    "data": {
      "authors": [...],
      "categories": [...],
      "tags": [...],
      "locations": [...],
      "propertyTypes": [...]
    }
  }
  ```
- Used by `BlogEditor.jsx` and filtering bars to populate dropdowns in a single round-trip.

---

## 🖼️ Media & Asset Management

### `POST /api/media/upload`
- Accepts `multipart/form-data` containing `file`, `title`, `locality`, and `propertyType`.
- Enforces strict MIME validation (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) to avoid SVG XSS vulnerabilities.
- Size ceiling: **10 MB**.
- Transforms raw camera names (e.g. `IMG_0921.jpg`) into descriptive SEO filenames (e.g. `dlf-phase-2-luxury-builder-floor-gurugram.webp`).
