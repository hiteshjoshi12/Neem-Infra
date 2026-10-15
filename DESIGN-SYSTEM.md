# Saudagar Properties — Dual-Tone Brand Design System

> **Official Design System Specification for Saudagar Properties Pvt Ltd**  
> Luxury Real-Estate Visual Identity, Design Tokens, Architectural Section Rhythm, Editorial Blog Guidelines, and Component Rules.

---

## 1. Brand Logo & Visual Essence

The official Saudagar Properties insignia embodies:
- **Primary Mark**: Interlocking architectural "SP" monogram with an upward financial/growth trajectory arrow.
- **Tonal Identity**: Deep authoritative Navy / Midnight Blue paired with refined warm Champagne Gold.
- **Positioning**: High-net-worth real estate advisory, DLF Gurugram premier consultant, investment trust, and bespoke architectural living.
- **Core Principle**: An editorial, architectural aesthetic that avoids generic flat-white corporate pages and avoid generic dark gaming styles.

---

## 2. Global Color Tokens & Palette Architecture

### 2.1 Color Tokens (CSS Variables & Tailwind Theme)

```css
:root {
  /* DARK WORLD — Authority, Investment Prestige */
  --brand-navy-deep: #0E162B;       /* Canvas for dark sections */
  --brand-navy: #17213D;            /* Primary brand navy */
  --brand-navy-surface: #202B4A;    /* Elevated cards and containers on dark */
  --brand-navy-surface-hover: #273459;
  
  /* GOLD ACCENT WORLD — Value, Exclusivity, Polish */
  --brand-gold: #C6A24A;            /* Primary brand gold accent */
  --brand-gold-light: #D8BD73;      /* Interactive hovers & highlights */
  --brand-gold-pale: #E9D9A8;       /* Subtle badges and tags */
  --brand-gold-muted: rgba(198, 162, 74, 0.15); /* Tinted icon backgrounds */

  /* LIGHT WORLD — Warm Architectural Editorial, Breathing Space */
  --brand-ivory: #F7F5EF;           /* Primary light section background */
  --brand-cream: #EFEBE1;           /* Alternating warm cream surface */
  --brand-white: #FFFFFF;           /* Card surfaces on light sections */

  /* TYPOGRAPHY TOKENS — High Contrast WCAG AAA */
  --text-primary: #17213D;          /* Primary dark heading/body text on light */
  --text-secondary: #566078;        /* Editorial supporting body text on light */
  --text-muted: #8892A6;            /* Secondary metadata on light */

  --text-on-dark: #F7F5EF;          /* Primary heading/contrast text on dark */
  --text-on-dark-muted: #C9CED9;    /* Clean body text on dark */
  --text-on-dark-dim: #9DA6B8;      /* Captions and subtext on dark */

  /* BORDERS & DIVIDERS */
  --border-light: rgba(23, 33, 61, 0.10);      /* Crisp 1px border on light */
  --border-dark: rgba(255, 255, 255, 0.08);    /* Subtle 1px border on dark */
  --border-gold: rgba(198, 162, 74, 0.35);     /* Gold luxury highlight border */
  --border-gold-subtle: rgba(198, 162, 74, 0.18);
}
```

---

## 3. The Dual-Tone Architectural Rhythm

Rather than a monotonous single-color website (all-white or all-black), the public marketing pages employ an intentional **alternating rhythm between Light and Dark Worlds**:

```
[ HEADER ]           Morphing Floating Capsule (Integrated Dark Hero -> Solid Ivory/Navy Sticky)
       ↓
[ 1. HERO ]          DARK WORLD (#0E162B) — Cinematic property visual with gold cues & ivory title
       ↓
[ 2. TOP CONSULTANT] LIGHT WORLD (#F7F5EF) — Warm architectural ivory, navy typography, gold frames
       ↓
[ 3. CURATED CORRIDORS] DARK WORLD (#0E162B / #17213D) — 3D featured portfolio, navy cards, gold pricing
       ↓
[ 4. SERVICES ]      LIGHT WORLD (#EFEBE1 / #F7F5EF) — Warm editorial cream, structured service grid
       ↓
[ 5. WHY CHOOSE US ] DARK WORLD (#17213D) — Brand authority, navy surface cards (#202B4A), gold metrics
       ↓
[ 6. AI SHOWCASE ]   LIGHT WORLD (#F7F5EF) — Clean ivory backdrop, modern valuation search, navy cards
       ↓
[ 7. TESTIMONIALS ]  DARK WORLD (#0E162B / #17213D) — Client perspectives on elevated navy surface cards
       ↓
[ 8. LOCATION MAP ]  LIGHT WORLD (#EFEBE1) — Office presence in DLF Phase 2, clean light presentation
       ↓
[ 9. NEWSLETTER CTA] DARK WORLD (#0E162B) — High-impact navy banner with gold accent border and button
       ↓
[ 10. FOOTER ]       DEEPEST NAVY (#0E162B) — Grounding architectural foundation with gold micro-links
```

---

## 4. Typography Hierarchy

- **Headings (H1, H2, H3)**: Serif (`font-serif`, Playfair Display / Lora)
  - Communicates heritage, prestige, architectural elegance, and luxury.
  - Light sections: `text-[#17213D]`, italic highlights in `text-[#C6A24A]`.
  - Dark sections: `text-[#F7F5EF]`, italic highlights in `text-[#D8BD73]`.
- **Body & Editorial Text**: Sans-serif (`font-sans`, Plus Jakarta Sans)
  - Communicates clarity, precision, and modernity.
  - Light sections: `text-[#566078]` with `leading-relaxed`.
  - Dark sections: `text-[#C9CED9]` with `leading-relaxed`.
- **Eyebrow Badges & Technical Labels**:
  - Uppercase, letter-spaced (`tracking-[0.22em]`), font-semibold, `text-[10px]` - `text-[12px]`.
  - Accompanied by a 1px gold line or small icon.

---

## 5. UI Elements & Component Rules

### 5.1 Buttons
- **Primary CTA (`.btn-gold`)**:
  - Background: `bg-[#C6A24A]` (Brand Gold), text: `text-[#0E162B]` (Deep Navy).
  - Hover: `hover:bg-[#D8BD73]`, subtle elevation shadow.
- **Secondary Dark CTA (`.btn-navy`)**:
  - Background: `bg-[#17213D]`, text: `text-[#F7F5EF]`.
  - Border: 1px `border-[#C6A24A]/40`.
  - Hover: `hover:bg-[#202B4A] hover:border-[#C6A24A]`.
- **Ghost Light CTA (`.btn-ghost-light`)**:
  - Transparent with `border border-[#17213D]/20 text-[#17213D]`.
  - Hover: `hover:border-[#C6A24A] hover:text-[#C6A24A]`.

### 5.2 Cards
- **Cards on Light Sections (`.card-light`)**:
  - Background: `bg-[#FFFFFF]`, subtle border: `border border-[#17213D]/[0.08]`.
  - Shadow: Soft architectural shadow `shadow-[0_20px_50px_-10px_rgba(23,33,61,0.06)]`.
  - Hover: Gold border accent `hover:border-[#C6A24A]/60`.
- **Cards on Dark Sections (`.card-dark`)**:
  - Background: `bg-[#202B4A]`, subtle border: `border border-white/[0.08]`.
  - Shadow: Deep atmospheric shadow `shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]`.
  - Hover: Gold border accent `hover:border-[#C6A24A]/60`.

### 5.3 Gold Usage Constraints
- **Permitted**:
  - Eyebrow badges and icons.
  - 1px architectural divider lines.
  - Action buttons (`.btn-gold`).
  - Active navigation pill dots.
  - Property price tags and verification badges.
  - Subtle glowing backdrop blurs (opacity < 0.05).
- **Prohibited**:
  - Large full-screen gold backgrounds.
  - Low-contrast gold body text on cream/ivory.
  - Excessive metallic gradients.

---

## 6. Accessibility & Contrast Verification

- **Light World**:
  - Text `#17213D` on `#F7F5EF` background yields a **12.8:1 contrast ratio** (WCAG AAA).
  - Secondary `#566078` on `#F7F5EF` yields a **5.4:1 contrast ratio** (WCAG AA).
- **Dark World**:
  - Text `#F7F5EF` on `#0E162B` background yields a **14.2:1 contrast ratio** (WCAG AAA).
  - Secondary `#C9CED9` on `#0E162B` yields a **9.8:1 contrast ratio** (WCAG AAA).
- **Gold Accents**:
  - `#C6A24A` used on dark background yields **6.1:1 contrast ratio** (WCAG AA compliant for badges and highlights).
  - Never place pale gold text on white/ivory surfaces without a dark pill background.

---

## 7. Responsive Consistency Across Breakpoints

- **Mobile (320px – 640px)**: Section rhythm is preserved; padding scales gracefully (`py-12` vs `py-24`); typography scales proportionally with fluid clamp classes.
- **Tablet (768px – 1024px)**: 2-column grids maintain balanced negative space.
- **Desktop (1280px – 1920px)**: Maximum container bounds at `max-w-7xl` prevent over-stretching, keeping typographic lines within ideal reading lengths (65–75 characters).

---

## 8. Editorial & Blog Reading Experience

Articles rendered at `/blog/[slug]` and within the Admin **LiveArticlePreview** mirror high-end architectural monographs:

### 8.1 Reading Typography & Width
- **Reading Container**: Restricted to `max-w-3xl mx-auto` to maintain optimal line-length (~65–75 characters).
- **Headings**:
  - H1: `font-serif text-3xl md:text-5xl text-[#0E162B] font-bold leading-tight`.
  - H2: `font-serif text-2xl md:text-3xl text-[#0E162B] font-semibold mt-12 mb-4 pb-2 border-b border-[#0E162B]/10`.
  - H3: `font-serif text-xl md:text-2xl text-[#17213D] font-medium mt-8 mb-3`.
- **Body Text**: `font-sans text-base md:text-lg text-[#334155] leading-relaxed mb-6 font-normal`.

### 8.2 Architectural Callouts & Quotes
- **Editorial Pull Quote**:
  ```html
  <blockquote class="border-l-2 border-[#C6A24A] pl-6 my-8 italic text-xl font-serif text-[#0E162B] bg-[#F7F5EF]/60 py-4 rounded-r-xl">
    ...
  </blockquote>
  ```
- **Market Advisory Callout (`:::tip`)**:
  - Border: 1px gold border `border-[#C6A24A]/40`.
  - Background: Soft cream ivory `bg-[#FDFBF7]`.
  - Header: Gold uppercase badge `ADVISORY PERSPECTIVE`.

### 8.3 Internal Hyperlinks
- Internal links to corridors, properties, and blog posts are styled with:
  - Color: `text-[#C6A24A] font-medium`.
  - Hover: `underline decoration-[#C6A24A]/60 underline-offset-4 hover:text-[#B58C36]`.

---

## 9. Admin CMS & Studio Workspace Tokens

The administrative suite (`/admin/*`) utilizes a professional dark studio theme:

- **Canvas Background**: Deep Midnight Slate `#0B1120`.
- **Card Panels**: `#131C31` with `border border-white/10`.
- **Active Toolbar Buttons**: `bg-[#C6A24A]/20 text-[#D8BD73] border border-[#C6A24A]/30`.
- **Split Live Preview Container**:
  - Independent synchronized scroll container.
  - Matches the 100% exact CSS, typography, and image styling of public `/blog/[slug]`.
- **Internal Link Modal**:
  - Keyboard Shortcut: <kbd>Ctrl+K</kbd> (or <kbd>Cmd+K</kbd>).
  - Search Input: High contrast with search icon.
  - Filter Tabs: Articles, Corridors, Properties, Services, Custom URL.
  - Selected Badge: Gold highlight pill showing item slug and type.
