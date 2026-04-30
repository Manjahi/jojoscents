# JojoScents

Luxury fragrance e-commerce and editorial website for a Nairobi-based scent brand. Built as a Next.js App Router site with Sanity CMS, Framer Motion animations, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| CMS | Sanity (separate Studio project) |
| Email / Newsletter | Brevo (Sendinblue) |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — hero, featured scents, newsletter, contact
│   ├── scents/
│   │   ├── page.tsx          # Scents listing — image cards, category badges
│   │   └── [slug]/page.tsx   # Scent detail — image, notes, mood, WhatsApp CTA
│   ├── journal/
│   │   ├── page.tsx          # Journal listing
│   │   └── [slug]/page.tsx   # Journal article
│   ├── about/page.tsx        # Brand story and pillars
│   ├── inquire/page.tsx      # Contact form + contact section
│   └── api/
│       ├── newsletter/       # POST → Brevo contacts API
│       └── inquire/          # POST → Brevo transactional email
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroImageCarousel.tsx
│   ├── ProductGrid.tsx
│   ├── ContactSection.tsx
│   ├── NewsletterSection.tsx
│   ├── Reveal.tsx            # Scroll-triggered fade/slide animation
│   ├── MotionGroup.tsx       # Stagger animation wrapper
│   ├── FullBleed.tsx         # Break out of max-width container
│   └── ThemeProvider.tsx     # Light / dark mode
└── lib/
    ├── sanity/
    │   ├── client.ts         # Sanity createClient
    │   ├── image.ts          # urlFor() image URL helper
    │   ├── queries.ts        # GROQ queries + data-fetching functions
    │   └── types.ts          # SanityProduct, JournalDoc types
    └── mock.ts               # Dev fallback data (used when Sanity is not configured)

studio-schemas/               # Copy these into your Sanity Studio project
├── product.ts
└── index.ts
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.local .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-04-24` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Without `+`, e.g. `254712345678` |
| `BREVO_API_KEY` | From app.brevo.com → Settings → API Keys |
| `BREVO_LIST_ID` | Numeric ID of your Brevo contact list |
| `CONTACT_EMAIL` | Where inquiry form submissions are sent |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Mock mode:** If `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set, the site runs entirely on local mock data. All pages are fully browsable without a CMS connection.

---

## Sanity Studio Setup

The Studio is a **separate project** from this Next.js app.

### Create the Studio

From the parent folder of this project:

```bash
npm create sanity@latest -- --dataset production --template clean --typescript --output-path jojoscents-studio
```

### Copy schemas

```bash
cp studio-schemas/product.ts  ../jojoscents-studio/schemaTypes/product.ts
cp studio-schemas/index.ts    ../jojoscents-studio/schemaTypes/index.ts
```

### Run the Studio

```bash
cd ../jojoscents-studio
npm run dev
# Studio at http://localhost:3333
```

### Deploy the Studio

```bash
npx sanity deploy
# Hosted at https://jojoscents.sanity.studio
```

---

## Product Schema

Each product in Sanity has:

| Field | Type | Notes |
|---|---|---|
| Name | String | Required |
| Slug | Slug | Auto-generated from name |
| Audience | String | Women / Men / Unisex |
| Fragrance Family | String | Floral, Woody, Oud, etc. |
| Mood | String[ ] | Romantic, Bold, Daily Wear, etc. |
| Price | String | e.g. `From KSh 3,500` |
| Short Description | Text | Shown on listing and detail pages |
| Notes | String[ ] | Fragrance ingredients |
| Main Image | Image | With hotspot cropping |
| Gallery | Image[ ] | Additional product images |
| Featured | Boolean | Appears on homepage best sellers |

---

## Scent Categories

**Audience** — Women · Men · Unisex

**Fragrance Family** — Floral · Woody · Fresh · Citrus · Amber · Musk · Vanilla · Oud · Aquatic · Spicy · Powdery · Gourmand · Leather · Green · Fruity

**Mood / Personality** — Soft · Clean · Romantic · Elegant · Bold · Mysterious · Warm · Fresh · Luxury · Daily Wear · Evening · Office · Date Night · Signature Scent

---

## CMS Roadmap

| Content | Status |
|---|---|
| Products (Scents) | Sanity — ready |
| Journal / Blog | Mock data — Sanity schema next |
| Hero Carousel | Static images — CMS last |

---

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Add all `.env.local` variables to your Vercel project's environment settings before deploying.

---

## Local Commands

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build locally
npm run lint     # ESLint
```
