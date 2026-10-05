# 🏛️ Saudagar Properties — Client & Admin Frontend

<div align="center">

![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**High-performance luxury real estate interface and dynamic administrative CMS portal.**

</div>

---

## 📖 Overview

The **Frontend** of Saudagar Properties delivers an editorial, high-end experience for prospective investors and buyers in Gurugram, while supplying a modular administrative CMS for updating web copy, banners, and property listings in real time.

Built with **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Vite**, the interface features:
- **100% Dynamic Content Sync**: Managed through `CmsContext` fetching from the Node.js / MongoDB Atlas backend.
- **Interactive 3D Stages**: Dynamic rotating carousel of featured builder floors and penthouses.
- **Editorial Typography & Color Palette**: Tailored `#D09A16` luxury gold, rich navy slates, and high-contrast readable type.
- **Modular Admin Architecture**: Form controls and 12 individual section editors cleanly separated for maintainability.

---

## 📁 Frontend Component Structure

```bash
src/
├── components/
│   ├── admin/
│   │   ├── common/
│   │   │   ├── FormInput.jsx          # Reusable styled text/number/email input
│   │   │   ├── FormTextarea.jsx       # Reusable textarea with subtext helper
│   │   │   └── SectionHeader.jsx      # Reusable section header with Lucide icon
│   │   ├── sections/
│   │   │   ├── NavbarEditor.jsx       # Tab 1: Logo, phones, CTAs, menu links
│   │   │   ├── HeroEditor.jsx         # Tab 2: Hero headlines, badges, stats
│   │   │   ├── TopConsultantEditor.jsx# Tab 3: Authority section & highlight cards
│   │   │   ├── CuratedCorridorsEditor.jsx # Tab 4: Featured properties copy & CTA
│   │   │   ├── ServicesEditor.jsx     # Tab 5: Services, counter, 3-step process
│   │   │   ├── DlfCalloutEditor.jsx   # Tab 6: DLF callout banner & 3D metrics
│   │   │   ├── WhyChooseUsEditor.jsx  # Tab 7: Value proposition & 3 pillars
│   │   │   ├── TestimonialsEditor.jsx # Tab 8: Testimonial header & reviews link
│   │   │   ├── LocationEditor.jsx     # Tab 9: Headquarters & Google map embed
│   │   │   ├── NewsletterEditor.jsx   # Tab 10: Email banner & confirmation
│   │   │   ├── FooterEditor.jsx       # Tab 11: Footer branding, socials, legal
│   │   │   └── FloatingWidgetsEditor.jsx # Tab 12: Floating WhatsApp & Back-to-Top
│   │   └── ProtectedRoute.jsx         # Auth guard for admin routes
│   ├── layout/
│   │   ├── Navbar.jsx                 # Dynamic public navbar with drawer
│   │   └── Footer.jsx                 # Dynamic public footer & socials
│   └── ui/
│       └── FloatingWidgets.jsx        # Persistent WhatsApp & Back-to-top widgets
├── context/
│   ├── AuthContext.jsx                # Admin session & JWT token management
│   └── CmsContext.jsx                 # Global section caching & real-time sync
├── pages/
│   ├── Home.jsx                       # Public landing page
│   └── admin/
│       ├── AdminDashboard.jsx         # Analytics & quick-jump portal
│       ├── AdminSectionsCMS.jsx       # Orchestrator for all 12 section editors
│       ├── AdminProperties.jsx        # Featured luxury properties CRUD
│       ├── AdminTestimonials.jsx      # Client perspectives & reviews CRUD
│       ├── AdminInquiries.jsx         # Lead management & contact submissions
│       └── AdminLogin.jsx             # Admin authentication screen
├── sections/home/                     # Public modular homepage sections
│   ├── Hero.jsx
│   ├── TopConsultantSection.jsx
│   ├── CuratedCorridors.jsx
│   ├── OurServicesSection.jsx
│   ├── WhyChooseUsSection.jsx
│   ├── TestimonialsSection.jsx
│   ├── LocationMap.jsx
│   ├── NewsletterSection.jsx
│   └── services/                      # Services sub-modules
│       ├── ServicesCardsGrid.jsx
│       ├── ExperienceCounter.jsx
│       ├── HowWeWorkProcess.jsx
│       └── DlfPropertyCallout.jsx
├── services/
│   └── api.js                         # Axios/fetch integration with backend
├── App.jsx                            # React Router tree
└── main.jsx                           # Application DOM mount
```

---

## 🛠️ Scripts & Commands

From the `Frontend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://localhost:5173` |
| `npm run build` | Compiles the production bundle with optimized assets |
| `npm run preview`| Previews the production build locally |
| `npm run lint` | Runs ESLint across the codebase |

---

## 🎨 Color Tokens

- **Gold Accent**: `#D09A16`
- **Dark Gold**: `#B39366`
- **Navy Slate (Dark)**: `#0C101A`
- **Card Dark Charcoal**: `#121724`
- **Primary Headings**: `#1D263B`
- **Body Text**: `#334155`

---

For full-stack setup instructions and API documentation, refer to the [Root README.md](../README.md).
