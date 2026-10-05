# Route Map

| OLD ROUTE | PURPOSE | CURRENT IMPLEMENTATION | TARGET NEXT.JS ROUTE |
|-----------|---------|------------------------|----------------------|
| `/` | Home Page | `Frontend/src/pages/User/Home.jsx` | `app/page.js` |
| `/ready-to-move` | Home Page Filter | `Frontend/src/pages/User/Home.jsx` | `app/page.js` (with query or anchor logic) |
| `/new-launches` | Home Page Filter | `Frontend/src/pages/User/Home.jsx` | `app/page.js` (with query or anchor logic) |
| `/under-construction` | Home Page Filter | `Frontend/src/pages/User/Home.jsx` | `app/page.js` (with query or anchor logic) |
| `/developers` | Home Page Filter | `Frontend/src/pages/User/Home.jsx` | `app/page.js` (with query or anchor logic) |
| `/about` | About Page | `Frontend/src/pages/User/About.jsx` | `app/about/page.js` |
| `/contact` | Contact Page | `Frontend/src/pages/User/Contact.jsx` | `app/contact/page.js` |
| `/terms` | Terms of Service | `Frontend/src/pages/User/Terms.jsx` | `app/terms/page.js` |
| `/privacy-policy` | Privacy Policy | `Frontend/src/pages/User/PrivacyPolicy.jsx` | `app/privacy-policy/page.js` |
| `/admin/login` | Admin Login | `Frontend/src/pages/admin/AdminLogin.jsx` | `app/(admin)/admin/login/page.js` |
| `/admin` | Admin Dashboard | `Frontend/src/pages/admin/AdminDashboard.jsx` | `app/(admin)/admin/page.js` |
| `/admin/dashboard` | Admin Dashboard | `Frontend/src/pages/admin/AdminDashboard.jsx` | `app/(admin)/admin/dashboard/page.js` |
| `/admin/sections` | Admin Sections CMS | `Frontend/src/pages/admin/AdminSectionsCMS.jsx` | `app/(admin)/admin/sections/page.js` |
| `/admin/properties` | Admin Properties CMS| `Frontend/src/pages/admin/AdminProperties.jsx` | `app/(admin)/admin/properties/page.js` |
| `/admin/testimonials` | Admin Testimonials CMS | `Frontend/src/pages/admin/AdminTestimonials.jsx` | `app/(admin)/admin/testimonials/page.js` |
| `/admin/inquiries` | Admin Inquiries CMS | `Frontend/src/pages/admin/AdminInquiries.jsx` | `app/(admin)/admin/inquiries/page.js` |
| `*` | Not Found (404) | `Frontend/src/pages/NotFound.jsx` | `app/not-found.js` |

## NEW ROUTES (SEO/AEO ARCHITECTURE)

| PURPOSE | TARGET NEXT.JS ROUTE |
|---------|----------------------|
| Property Detail Page | `app/properties/[slug]/page.js` |
| All Properties Index | `app/properties/page.js` |
| Location Landing Page | `app/locations/[slug]/page.js` |
| All Locations Index | `app/locations/page.js` |
| Future Blog Index | `app/blog/page.js` |
| Future Blog Post | `app/blog/[slug]/page.js` |
