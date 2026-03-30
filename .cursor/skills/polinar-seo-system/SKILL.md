---
name: polinar-seo-system
description: >-
  Polinar project SEO architecture: metadata generation, admin panel SEO fields,
  structured data, sitemap, and multi-locale configuration. Use when editing SEO
  fields, adding new pages, fixing metadata, debugging Open Graph tags, updating
  structured data, or troubleshooting search engine indexing.
---

# Polinar SEO System

## Architecture Overview

SEO is managed through two layers:

1. **Admin panel (Payload CMS)** — editors control meta title, description, OG image per page/locale
2. **Code fallbacks** — when CMS fields are blank, metadata auto-generates from page content

Priority chain for every page:
```
CMS seo.title → content-based title → static label → root metadata
CMS seo.description → content-based desc → SiteSettings.defaultSeoDescription → static label
CMS seo.image → content image → /brand_assets/og-default.jpg
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/seo.tsx` | Central SEO helper: `generateSEO()`, `getSiteDefaultDescription()`, JSON-LD builders, `alternateLanguages()` |
| `src/fields/seoFields.ts` | Reusable Payload field group (`seo.title`, `seo.description`, `seo.image`) added to all page globals |
| `src/app/sitemap.ts` | Dynamic sitemap with per-locale `hreflang` alternates |
| `src/app/robots.ts` | Robots.txt configuration |
| `src/app/layout.tsx` | Root `metadataBase` from `NEXT_PUBLIC_SITE_URL` |
| `src/app/(frontend)/[locale]/layout.tsx` | Organization JSON-LD on all pages |
| `scripts/seed-seo.ts` | One-time script to populate all SEO fields across globals and collections for all locales |

## SEO Fields on Globals

Every page global has a `seo` group field (imported from `src/fields/seoFields.ts`):

| Global slug | Admin location | Fields |
|-------------|---------------|--------|
| `homepage-settings` | Layout → Homepage → SEO | `seo.title`, `seo.description`, `seo.image` |
| `about-page-settings` | Pages → About Page → SEO | same |
| `contact-page-settings` | Pages → Contact Page → SEO | same |
| `news-page-settings` | Pages → News Page → SEO | same |
| `our-business-page-settings` | Pages → Our Business Page → SEO | same |

All fields are **localized**. Editors fill in each language independently via the locale switcher.

## SEO Fields on Collections

`@payloadcms/plugin-seo` adds `meta.title`, `meta.description`, `meta.image` to:

- **`news`** — individual articles
- **`pages`** — CMS-managed pages
- **`product-categories`** — product category pages

Configured in `payload.config.ts` → `seoPlugin({ collections: [...] })`.

## SiteSettings.defaultSeoDescription

`SiteSettings` global has a `defaultSeoDescription` (localized textarea). This is the **site-wide fallback** description used when a page has no specific description. Fetched via `getSiteDefaultDescription(locale)` in `src/lib/seo.tsx`.

## How generateMetadata Works Per Page

Each `page.tsx` exports `generateMetadata()` that:

1. Fetches page-specific global/collection from Payload CMS
2. Reads `seo.title` / `seo.description` / `seo.image` (CMS override)
3. Falls back to content fields (hero title, excerpt, paragraph1, etc.)
4. Falls back to `getSiteDefaultDescription(locale)` for description
5. Passes everything to `generateSEO()` which builds the full `Metadata` object

### Page → Data source mapping

| Route | Global/Collection | Title fallback | Description fallback |
|-------|-------------------|----------------|---------------------|
| `/[locale]` | `homepage-settings` | `labels.seo.defaultTitle` | `coreValues.description` |
| `/[locale]/about` | `about-page-settings` | `hero.title` | `story.paragraph1` |
| `/[locale]/contact` | `contact-page-settings` | `hero.title` | `hero.subtitle` |
| `/[locale]/news` | `news-page-settings` | `hero.title` | site default |
| `/[locale]/our-business` | `our-business-page-settings` + `navigation` | mega menu label | site default |
| `/[locale]/our-business/[slug]` | Static data (`getInjectionMouldsData`, etc.) or `pages` collection | `data.ui.heroTitle` or `page.heroTitle` | `data.ui.heroSubtitle` or `page.excerpt` |
| `/[locale]/news/[slug]` | `news` collection | `article.title` | `article.excerpt` |
| `/[locale]/[slug]` | `pages` collection | `page.heroTitle` | `page.excerpt` |

Collection pages also check `meta.title` / `meta.description` from the SEO plugin before falling back.

## generateSEO() API

```typescript
import { generateSEO, getSiteDefaultDescription } from '@/lib/seo'

generateSEO({
  title: string,          // Page title (suffix appended automatically)
  description: string,    // Meta description
  locale: string,         // Current locale code
  path: string,           // Path without locale prefix (e.g. '/about')
  image?: string,         // Absolute URL to OG image
  type?: 'website' | 'article',
  noIndex?: boolean,
})
```

Returns full Next.js `Metadata` object with: title, description, canonical, hreflang alternates, Open Graph, Twitter cards, robots.

## JSON-LD Structured Data

| Helper | Where used | Schema type |
|--------|-----------|-------------|
| `organizationJsonLd(locale)` | `[locale]/layout.tsx` (all pages) | Organization |
| `websiteJsonLd()` | Homepage | WebSite |
| `breadcrumbJsonLd(items)` | About, News detail, Our Business | BreadcrumbList |
| `newsArticleJsonLd(article)` | News `[slug]` | NewsArticle |
| `localBusinessJsonLd(locale)` | Contact | LocalBusiness |
| `productJsonLd(locale, product)` | (available, not yet wired) | Product |

Usage: `<JsonLd data={organizationJsonLd(locale)} />`

## Adding a New Page — SEO Checklist

1. **Create or identify the page global** in `src/globals/`
2. **Add `seoFields`** to the global's fields array:
   ```typescript
   import { seoFields } from '@/fields/seoFields'
   fields: [seoFields, ...otherFields]
   ```
3. **Register global** in `payload.config.ts` globals array
4. **Export `generateMetadata`** in the page's `page.tsx`:
   - Fetch the global with `payload.findGlobal({ slug, locale })`
   - Read `settings.seo.title`, `settings.seo.description`, `settings.seo.image?.url`
   - Provide content-based fallbacks
   - Call `getSiteDefaultDescription(locale)` for the final description fallback
   - Return `generateSEO({ ... })`
5. **Add JSON-LD** if appropriate (breadcrumbs at minimum)
6. **Add to sitemap** in `src/app/sitemap.ts`
7. **Run** `npx payload generate:types` to update TypeScript types
8. **Seed SEO data** for the new page using `scripts/seed-seo.ts` pattern or admin panel

## Common Issues & Fixes

### "Revalidation error: static generation store missing"
**Cause**: Running Payload operations (with `revalidatePath` hooks) outside Next.js context (e.g. scripts).
**Impact**: Harmless — data is written, only cache revalidation is skipped.
**Fix**: Rebuild after running scripts: `npm run build`.

### seo.ts vs seo.tsx
The SEO helper file **must** be `.tsx` (not `.ts`) because it contains JSX in the `JsonLd` component. If renamed to `.ts`, the build fails with "Expected '>', got 'type'".

### Collection SEO plugin validation
`@payloadcms/plugin-seo` enforces title 50–60 chars, description 100–150 chars in the admin UI (length indicators only, not hard validation). When seeding via script, the `meta.title` and `meta.description` fields accept any length.

### Collection updates with non-default locales
When updating a collection document for a non-default locale via script, required fields (e.g. `title`, `name`) must be included in the data payload even if unchanged. Fetch with `locale: 'all'` and pass the locale-specific value back.

### Title suffix duplication
`generateSEO()` appends `labels.seo.titleSuffix` (` | Polinar`) to every title. The root `layout.tsx` also has `template: '%s | Polinar'`. Since `generateSEO` returns a full title string (not using the template), there's no duplication — but if you set only a segment-level `title` without `generateSEO`, the template applies.

## Supported Locales

Defined in `src/lib/locales.json`: **en** (default), **tr**, **de**, **ar**.

The `ogLocaleMap` in `seo.tsx` maps these to OG locale tags:
```
en → en_US, tr → tr_TR, de → de_DE, ar → ar_SA
```

When adding a new locale: update `locales.json`, add to `ogLocaleMap`, seed SEO fields for the new locale.

## Seed Script

`scripts/seed-seo.ts` — run with `npx tsx scripts/seed-seo.ts`

Populates all SEO fields across all globals (5) and collections (news, pages, product-categories) for all 4 locales. Safe to re-run (idempotent). See "Revalidation error" note above.
