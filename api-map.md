# API Map

| METHOD | ENDPOINT | PURPOSE | DATABASE | AUTH | FRONTEND CONSUMER | TARGET NEXT.JS IMPLEMENTATION |
|--------|----------|---------|----------|------|-------------------|-------------------------------|
| GET | `/api/properties` | Fetch all properties | MongoDB `Property` | None | Public Website, Admin | `services/propertyService.js` (Server Component) & `app/api/properties/route.js` (for client) |
| GET | `/api/properties/:id` | Fetch single property | MongoDB `Property` | None | Public Website, Admin | `services/propertyService.js` (Server Component) & `app/api/properties/[id]/route.js` |
| POST | `/api/properties` | Create property | MongoDB `Property` | Yes | Admin Properties CMS | Server Action or `app/api/properties/route.js` |
| PUT | `/api/properties/:id` | Update property | MongoDB `Property` | Yes | Admin Properties CMS | Server Action or `app/api/properties/[id]/route.js` |
| DELETE | `/api/properties/:id` | Delete property | MongoDB `Property` | Yes | Admin Properties CMS | Server Action or `app/api/properties/[id]/route.js` |
| GET | `/api/sections` | Fetch all sections content | MongoDB `SectionContent` | None | Public Website | `services/sectionService.js` (Server Component) |
| GET | `/api/sections/:sectionKey` | Fetch single section | MongoDB `SectionContent` | None | Public Website, Admin | `services/sectionService.js` (Server Component) |
| PUT | `/api/sections/:sectionKey` | Update section content | MongoDB `SectionContent` | Yes | Admin Sections CMS | Server Action or `app/api/sections/[sectionKey]/route.js` |
| POST | `/api/inquiries` | Create new inquiry | MongoDB `Inquiry` | None | Public Forms | Server Action or `app/api/inquiries/route.js` |
| GET | `/api/inquiries` | Fetch all inquiries | MongoDB `Inquiry` | Yes | Admin Inquiries CMS | `services/inquiryService.js` (Server Component) |
| DELETE | `/api/inquiries/:id` | Delete inquiry | MongoDB `Inquiry` | Yes | Admin Inquiries CMS | Server Action or `app/api/inquiries/[id]/route.js` |
| GET | `/api/testimonials` | Fetch all testimonials | MongoDB `Testimonial` | None | Public Website | `services/testimonialService.js` (Server Component) |
| GET | `/api/testimonials/:id` | Fetch single testimonial| MongoDB `Testimonial` | None | Admin CMS | `services/testimonialService.js` |
| POST | `/api/testimonials` | Create testimonial | MongoDB `Testimonial` | Yes | Admin CMS | Server Action or `app/api/testimonials/route.js` |
| PUT | `/api/testimonials/:id` | Update testimonial | MongoDB `Testimonial` | Yes | Admin CMS | Server Action or `app/api/testimonials/[id]/route.js` |
| DELETE | `/api/testimonials/:id` | Delete testimonial | MongoDB `Testimonial` | Yes | Admin CMS | Server Action or `app/api/testimonials/[id]/route.js` |
| POST | `/api/auth/login` | Admin login | MongoDB `Admin` | None | Admin Login Page | `app/api/auth/login/route.js` (JWT/Cookies) |
| GET | `/api/auth/verify` | Verify token | - | Yes | Protected Admin Routes| Next.js Middleware or Server Component check |
