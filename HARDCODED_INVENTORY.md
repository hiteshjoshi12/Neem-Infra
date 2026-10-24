# Hardcoded Site Inventory & Admin Migration Blueprint
**Domain:** `https://saudagarproperties.com/`  
**Purpose:** Comprehensive inventory of all site-related literals, constants, content blocks, and configuration values currently hardcoded in code, mapped to their proposed MongoDB collection and admin management field.

---

## 1. Global Site Identity & Canonical Host

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L12) | 12 | `SITE_URL = 'https://www.saudagarproperties.com'` | `SeoSettings.canonicalBaseUrl` |
| [`src/app/layout.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/layout.js#L30) | 30 | `metadataBase: new URL("https://www.saudagarproperties.com")` | `SeoSettings.canonicalBaseUrl` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L13) | 13 | `SITE_NAME = 'Saudagar Properties'` | `SeoSettings.siteName` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L14) | 14 | `SITE_LEGAL_NAME = 'Saudagar Properties Pvt. Ltd.'` | `SeoSettings.legalName` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L15) | 15 | `DEFAULT_LOCALE = 'en_IN'` | `SeoSettings.locale` |
| [`src/app/layout.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/layout.js#L32) | 32-34 | `template: "%s \| Saudagar Properties"` | `SeoSettings.siteTitleTemplate` |
| [`src/app/layout.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/layout.js#L35-L36) | 35-36 | Default layout meta description string | `SeoSettings.defaultMetaDescription` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L81) | 81 | `ogImage: '${SITE_URL}/og-image.jpg'` | `SeoSettings.defaultOgImage` |

---

## 2. Business Entity Profile (NAP, Coordinates, Hours, Socials, Founders)

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L24) | 24 | `foundingYear: 1999` | `BusinessProfile.foundingYear` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L25) | 25 | `founders: ['Mr. Arun Sharma', 'Mrs. Suneeta Chawla']` | `BusinessProfile.founders` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L27-L33) | 27-33 | `'38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002'` | `BusinessProfile.address` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L34-L37) | 34-37 | `geo: { latitude: 28.4847851, longitude: 77.0842655 }` | `BusinessProfile.geoCoordinates` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L38) | 38 | `phone: ['+91 97185 11207', '+91 98112 21207']` | `BusinessProfile.phones` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L39) | 39 | `email: 'Saudagar.Properties@Yahoo.In'` | `BusinessProfile.email` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L41) | 41 | Logo: `'.../branding/logo.png?tr=f-auto,q-80'` | `BusinessProfile.logo` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L44-L48) | 44-48 | `socialProfiles: { facebook: '#', instagram: '#', ... }` | `BusinessProfile.socialLinks` |
| [`src/lib/seo/seoConfig.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/seoConfig.js#L50-L64) | 50-64 | `areaServed: ['Gurugram', 'DLF Phase 1-5', 'Sushant Lok', ...]` | `BusinessProfile.areaServed` |
| [`src/components/ui/FloatingWidgets.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/ui/FloatingWidgets.jsx#L26) | 26 | Google Maps Place URL: `.../Saudagar+Properties+Pvt.Ltd/@28.484...` | `BusinessProfile.googleBusinessProfileUrl` |
| [`src/constants/propertiesData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/propertiesData.js#L34) | 34 | `reraNumber: "Freehold Municipal Sanction • Clean Title"` | `BusinessProfile.reraRegistrationNumber` |

---

## 3. Navigation, Menus & Footer Links

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/components/layout/Navbar.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Navbar.jsx#L35-L65) | 35-65 | Nav items (Residential, Commercial, Industrial, About, Blog, Contact) | `NavigationMenu.headerItems` |
| [`src/components/layout/Navbar.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Navbar.jsx#L80) | 80 | Phone CTA: `+91 97185 11207` | `NavigationMenu.headerPhoneCta` |
| [`src/components/layout/Footer.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Footer.jsx#L104-L110) | 104-110 | Social links with placeholder `#` | `BusinessProfile.socialLinks` |
| [`src/components/layout/Footer.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Footer.jsx#L113-L116) | 113-116 | `'Copyright © Saudagar Properties All Right Reserved'` | `NavigationMenu.footerCopyright` |
| [`src/components/layout/Footer.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Footer.jsx#L118-L123) | 118-123 | Legal links (`/clients`, `/terms`, `/privacy-policy`, `/admin`) | `NavigationMenu.footerLegalLinks` |
| [`src/components/layout/Footer.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/layout/Footer.jsx#L101-L102) | 101-102 | Contact Bar phone number and email | `BusinessProfile.phones` / `email` |

---

## 4. Homepage Sections & Copy

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/sections/home/HeroCopy.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/HeroCopy.jsx#L248) | 248 | Badge: `"DLF Phase 1–4 • Sushant Lok • Golf Course Ext."` | `SectionContent['hero'].badge` |
| [`src/sections/home/HeroCopy.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/HeroCopy.jsx#L260-L265) | 260-265 | Headline: `"Gurgaon's Premier Real Estate Partner."` | `SectionContent['hero'].headline` |
| [`src/sections/home/HeroCopy.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/HeroCopy.jsx#L276) | 276 | Description: `"Discover an exclusive portfolio of luxury..."` | `SectionContent['hero'].description` |
| [`src/sections/home/HeroCopy.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/HeroCopy.jsx#L50) | 50 | Video URL: `.../videos/saudagar-hero.mp4` | `SectionContent['hero'].videoUrl` |
| [`src/sections/home/HeroCopy.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/HeroCopy.jsx#L226) | 226 | Custom poster: `.../videos/poster.jpg?tr=f-auto,q-80` | `SectionContent['hero'].posterImage` |
| [`src/sections/home/CuratedCorridors.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/CuratedCorridors.jsx#L130-L140) | 130-140 | Badge, title (`"Featured Properties"`), and subtitle | `SectionContent['curatedCorridors']` |
| [`src/sections/home/TopConsultantSection.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/TopConsultantSection.jsx#L50-L120) | 50-120 | Consultant narrative, achievements list, YouTube tour embed | `SectionContent['topConsultant']` |
| [`src/sections/home/WhyChooseUsSection.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/WhyChooseUsSection.jsx#L35-L100) | 35-100 | Why choose us cards (zero litigation, founder-led, off-market) | `SectionContent['whyChooseUs']` |
| [`src/sections/home/OurServicesSection.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/OurServicesSection.jsx#L40-L110) | 40-110 | Service cards (Residential, Commercial, Industrial) | `SectionContent['services']` |
| [`src/sections/home/services/ExperienceCounter.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/services/ExperienceCounter.jsx#L49-L56) | 49-56 | `target = 25`, `"25+ Years of Unmatched Advisory"` | `BusinessProfile.yearsExperience` |
| [`src/sections/home/services/DlfPropertyCallout.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/services/DlfPropertyCallout.jsx#L130-L150) | 130-150 | Callout statistics: 500+ Floors, 25+ Years, ₹1000Cr+ | `SectionContent['stats']` |
| [`src/sections/home/TestimonialsSection.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/TestimonialsSection.jsx#L17) | 17 | `DEFAULT_TESTIMONIALS_DATA` fallback import | `Testimonial` collection |
| [`src/sections/home/LocationMap.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/LocationMap.jsx#L45-L80) | 45-80 | Office address, phone numbers, map coordinate pins | `SectionContent['location']` |
| [`src/sections/home/NewsletterSection.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/home/NewsletterSection.jsx#L20-L40) | 20-40 | Newsletter headline, description, and disclaimer copy | `SectionContent['newsletter']` |

---

## 5. Inner Pages (About, Team, Contact, Terms, Privacy)

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/sections/about/AboutHero.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/about/AboutHero.jsx#L20-L24) | 20-24 | Stat cards (`25+ Years Experience`, `500+ Luxury Floors`, `₹1500Cr+`) | `Page['/about'].sections` |
| [`src/sections/about/AboutHero.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/about/AboutHero.jsx#L163) | 163 | `"25+ Years of Leadership in DLF Gurugram"` | `Page['/about'].h1` |
| [`src/sections/about/AboutLeadership.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/about/AboutLeadership.jsx#L30-L80) | 30-80 | Leadership bios for Arun Sharma and Suneeta Chawla | `Author` / `TeamMember` collection |
| [`src/sections/about/AboutWhyChooseUs.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/about/AboutWhyChooseUs.jsx#L71) | 71 | Subtitle copy referencing 25 years and HNW families | `Page['/about'].content` |
| [`src/sections/about/AboutOfferings.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/sections/about/AboutOfferings.jsx#L30-L70) | 30-70 | Real estate advisory service offerings | `Page['/about'].sections` |
| [`src/constants/teamData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/teamData.js#L1-L60) | 1-60 | Team member profiles (Arun Sharma, Suneeta Chawla, Mohit, etc.) | `TeamMember` collection |
| [`src/constants/defaultSections.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/defaultSections.js#L1730-L1770) | 1730-1770 | Terms of Service legal clauses & disclaimers | `Page['/terms'].content` |
| [`src/constants/defaultSections.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/defaultSections.js#L1780-L1820) | 1780-1820 | Privacy Policy data retention & compliance statements | `Page['/privacy-policy'].content` |

---

## 6. Massive Static Data Constants

| File Path | Total Size | Hardcoded Entities | Proposed Admin Collection |
| :--- | :--- | :--- | :--- |
| [`src/constants/defaultSections.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/defaultSections.js) | 92.8 KB | 18 full section presets (hero, stats, services, leadership, etc.) | `SectionContent` (MongoDB) |
| [`src/constants/corridorPagesData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/corridorPagesData.js) | 113.4 KB | Full landing page copy for DLF 1–4, Sushant Lok, Udyog Vihar | `Page` (corridor type in MongoDB) |
| [`src/constants/blogData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/blogData.js) | 585.1 KB | Complete blog article markdown, taxonomy, and FAQs | `BlogPost`, `Category`, `Author` |
| [`src/constants/propertiesData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/propertiesData.js) | 20.8 KB | 8 luxury builder floor catalog listings | `Property` collection |
| [`src/constants/homeData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/homeData.js) | 5.9 KB | Testimonials, consultant quotes, stats | `Testimonial`, `SectionContent` |
| [`src/constants/aboutData.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/constants/aboutData.js) | 5.6 KB | About narrative, milestones, values | `SectionContent['about']` |

---

## 7. Configuration, Schemas & Redirects

| File Path | Line(s) | Hardcoded Value / Type | Proposed Admin Collection & Field |
| :--- | :--- | :--- | :--- |
| [`src/lib/seo/schemaBuilders.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/lib/seo/schemaBuilders.js#L73-L128) | 73-128 | Organization schema reading static `BUSINESS_INFO` | `SeoSettings.organizationSchema` |
| [`src/components/seo/PropertyJsonLd.jsx`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/components/seo/PropertyJsonLd.jsx#L26-L58) | 26-58 | Property schema hardcoded as `@type: "Product"` | Dynamic `RealEstateListing` builder |
| [`next.config.mjs`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/next.config.mjs#L115-L148) | 115-148 | Static corridor redirects (e.g. `/services/dlf-phase-1` -> `/property/dlf-phase-1`) | `Redirect` collection (Admin Redirect Manager) |
| [`next.config.mjs`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/next.config.mjs#L151-L165) | 151-165 | Static aliases (`/ready-to-move` -> `/properties`, `/developers` -> `/about`) | `Redirect` collection |
| [`src/app/robots.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/robots.js#L48-L56) | 48-56 | Hardcoded robots rules for `userAgent: '*'` | `SeoSettings.robotsDirectives` |
| [`src/app/sitemap.js`](file:///d:/Freelancing%20Projects/Saudagar%20Properties%20-%20Copy/src/app/sitemap.js#L43-L44) | 43-44 | Hardcoded frequencies (`daily`, `weekly`) & priorities (`1.0`, `0.9`) | `Page.sitemapPriority` & `frequency` |
