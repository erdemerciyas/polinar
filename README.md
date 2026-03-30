# Polinar

Corporate website for **Polinar** — a plastic injection mould and pipe fittings manufacturer. Built with **Next.js 15**, **Payload CMS 3**, and **PostgreSQL**.

**Live:** [www.polinar.com.tr](https://www.polinar.com.tr)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 3, Framer Motion |
| CMS | Payload CMS 3 (admin at `/admin`) |
| Database | PostgreSQL via `@payloadcms/db-postgres` |
| Rich Text | Lexical Editor (`@payloadcms/richtext-lexical`) |
| SEO | `@payloadcms/plugin-seo`, JSON-LD, dynamic sitemap |
| AI Chatbot | Anthropic Claude SDK |
| Language | TypeScript 5 |
| Image Processing | Sharp |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **npm** (or compatible package manager)

### Installation

```bash
git clone https://github.com/erdemerciyas/polinar.git
cd polinar
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Secret key for Payload auth/encryption |
| `ANTHROPIC_API_KEY` | Anthropic API key (for chatbot) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://www.polinar.com.tr`) |

### Development

```bash
npm run dev
```

The app starts at [http://localhost:3000](http://localhost:3000) and the admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

### Seed Data

Populate the database with initial content and a default admin user:

```bash
npm run seed
```

> **Warning:** The seed script creates a default admin account. Change credentials before deploying to production.

### Build & Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/[locale]/   # Public pages with locale prefix
│   ├── (payload)/admin/       # Payload CMS admin panel
│   └── api/                   # API routes (contact, chatbot, i18n, etc.)
├── collections/               # Payload collections (Users, Media, News, Pages, …)
├── globals/                   # Payload globals (navigation, footer, site settings, …)
├── components/                # Shared UI components
├── data/                      # Static locale-aware content modules
│   ├── static-labels/         # Shared translatable strings
│   └── locale-loader.ts       # createLocaleLoader utility
├── lib/                       # Utilities (payload client, SEO, chatbot, locales)
└── middleware.ts              # Locale detection & route prefixing

scripts/                       # i18n tooling & page scaffolding
seed/                          # Database seeding
payload.config.ts              # Payload CMS configuration
```

## Internationalization (i18n)

Polinar supports multiple languages — currently **English (en)**, **Turkish (tr)**, **German (de)**, and **Arabic (ar)** — configured in `src/lib/locales.json`.

Content is managed through two systems:

### CMS Content

Translated fields on Payload collections and globals. Managed via the admin panel at `/admin`.

### Static Content

Locale-aware data modules under `src/data/{page-slug}/`:

```
src/data/{page-slug}/
  types.ts    — TypeScript type definition
  en.ts       — English content (source of truth)
  tr.ts       — Turkish translation
  index.ts    — Loader with EN fallback
```

Scaffold a new static page:

```bash
npm run i18n:create-page {slug}
```

### i18n Scripts

| Script | Description |
|--------|-------------|
| `npm run i18n:import` | Import translations into CMS |
| `npm run i18n:export` | Export CMS translations |
| `npm run i18n:validate` | Validate translation completeness |
| `npm run i18n:scaffold` | Scaffold CMS translation keys |
| `npm run i18n:scaffold-static` | Scaffold static translation files |
| `npm run i18n:create-page` | Generate a new static page module |

## Key Features

- **Dynamic CMS Pages** — block-based page builder (hero, rich text, gallery, product grid, video, contact form)
- **Product Pages** — injection moulds, machinery, plastic test equipment
- **News & Articles** — CMS-managed with SEO metadata
- **Contact Form** — with backend submission handling
- **Newsletter** — subscription management
- **AI Chatbot** — Anthropic Claude-powered support widget
- **SEO** — per-page meta, Open Graph, JSON-LD structured data, auto-generated sitemap & robots.txt
- **RTL Support** — automatic `dir="rtl"` for Arabic locale
- **Mega Menu** — CMS-driven navigation with responsive mobile menu

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server on port 3000 |
| `npm run lint` | Run ESLint |
| `npm run generate:types` | Generate Payload TypeScript types |
| `npm run seed` | Seed database with initial data |

## License

All rights reserved.
