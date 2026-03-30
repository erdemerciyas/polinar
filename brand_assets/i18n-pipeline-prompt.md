# i18n Automation Pipeline — Claude Code Prompt

> **Role:** You are a senior full-stack engineer specializing in Next.js 15, Payload CMS 3, and TypeScript.
>
> **Context:** I already have a working i18n system in my **Next.js 15** project (App Router, TypeScript, Payload CMS 3 with `localization` config). All translations live as `localized: true` fields on Payload globals and collections. Components receive translated strings as **props** from server-side Payload queries — there is **no `t()` function**, no i18next, no next-intl. **Do NOT create a new i18n runtime. Do NOT replace or modify my existing Payload localization setup.** Your job is to build a **translation management pipeline on top of** my current system.

---

## Goal

Build a complete, production-ready i18n automation pipeline that:

- Maintains `public/locales/{locale}.json` files as the developer-editable **source of truth** (one file per language, all globals combined)
- Syncs JSON content into Payload DB via the Local API (`import` / `generate`)
- Can export current DB state back to JSON (`export`)
- Validates translation completeness across all locales (`validate`)
- Provides a **Payload CMS admin custom view** with a "Generate i18n" button that triggers the sync from the admin panel

---

## Architecture

```
public/locales/en.json  ──┐
public/locales/tr.json  ──┤──▶  scripts/import-i18n.ts  ──▶  Payload DB (globals)  ──▶  React Components (via props)
public/locales/de.json  ──┘         ▲                              │
                                    │                              ▼
                          Admin "Generate" button          scripts/export-i18n.ts  ──▶  public/locales/*.json
```

**Key principle:** JSON files are the source of truth. Developers edit JSON, then "generate" pushes changes into Payload DB. The export command does the reverse (DB → JSON) for bootstrapping or backup.

---

## Requirements

### 1. JSON File Structure

Location: `public/locales/` (browser-accessible, git-tracked)

One file per locale. Top-level keys are Payload **global slugs** — this provides namespace separation.

**Example `public/locales/en.json`:**

```json
{
  "ui-labels": {
    "learnMore": "Learn More",
    "readMore": "Read More",
    "contentComingSoon": "Content coming soon."
  },
  "footer": {
    "labels": {
      "addressLabel": "Address",
      "phoneFaxLabel": "Phone / Fax",
      "emailLabel": "Email",
      "newsletterLabel": "Newsletter",
      "subscribeButton": "SUBSCRIBE",
      "namePlaceholder": "Name",
      "emailPlaceholder": "E-mail"
    },
    "copyrightText": "Copyright © 2024 All Rights Reserved by Polinar"
  },
  "navigation": {
    "mainMenu": [
      { "label": "HOME" },
      { "label": "ABOUT US" },
      {
        "label": "OUR BUSINESS",
        "megaMenuColumns": [
          {
            "links": [
              { "label": "Injection Moulds", "description": "..." },
              { "label": "Machinery", "description": "..." },
              { "label": "Plastic Testing Equipment", "description": "..." }
            ]
          }
        ]
      },
      { "label": "NEWS" },
      { "label": "CONTACT" }
    ],
    "megaMenuCTA": {
      "title": "Get in Touch",
      "description": "We offer custom solutions for your projects. Contact us today.",
      "button": "Contact Us"
    }
  },
  "homepage-settings": {
    "heroSlides": [
      {
        "title": "DURABLE MOULDS AND CUSTOMIZED PRODUCTS",
        "subtitle": "High quality plastic injection moulds for the global market since 2000"
      }
    ],
    "aboutPreviewLabels": {
      "label": "About",
      "title": "US",
      "description": "POLINAR is one of the dynamic and leading companies..."
    },
    "businessSection": {
      "sectionLabel": "Our Business",
      "sectionTitle": "What We Do"
    },
    "newsSection": {
      "label": "Latest News",
      "title": "Fair Agenda",
      "empty": "News coming soon"
    }
  },
  "about-page-settings": {
    "hero": { "label": "About", "title": "ABOUT US", "subtitle": "..." },
    "story": { "title": "About Polinar", "paragraph1": "...", "ctaText": "Contact Us" },
    "statistics": { "cards": [ { "label": "Founded Year" }, { "label": "Export Countries" } ] },
    "gallery": { "title": "Photos from Production Area", "description": "..." },
    "video": { "title": "Promotion Video", "description": "..." },
    "certificates": { "title": "Our Certificates", "description": "..." },
    "cta": { "title": "Need Detailed Information?", "description": "...", "buttonText": "Contact via WhatsApp" }
  },
  "contact-page-settings": {
    "hero": { "title": "CONTACT US", "subtitle": "Get in Touch" },
    "form": { "nameLabel": "Your Name", "emailLabel": "Your Email", "subjectLabel": "Subject", "messageLabel": "Your Message", "sendButton": "SEND MESSAGE", "sendingButton": "SENDING..." },
    "messages": { "success": "Message sent successfully!", "error": "Failed to send message. Please try again." },
    "info": { "addressLabel": "Address", "phoneLabel": "Phone / Fax", "emailLabel": "Email" }
  },
  "news-page-settings": {
    "hero": { "label": "Latest Updates", "title": "NEWS & EXHIBITIONS" },
    "labels": { "empty": "News coming soon", "breadcrumb": "News", "allNews": "All News" }
  },
  "site-settings": {
    "chatbot": {
      "labels": {
        "title": "Polinar Support",
        "welcome": "Hello! How can I help you today?",
        "placeholder": "Type your message...",
        "whatsappLabel": "Continue on WhatsApp",
        "closeLabel": "Close",
        "errorMessage": "Sorry, an error occurred.",
        "connectionError": "Connection error. Please try again."
      }
    },
    "whatsappCTA": {
      "text": "Need detailed information, contact our customer support via whatsapp"
    }
  }
}
```

### 2. Import / Generate Command (Core Feature)

Create `scripts/import-i18n.ts`:

```bash
npm run i18n:import
```

This command (also invoked by the admin "Generate" button):

1. Read `public/locales/{locale}.json` for each locale file found
2. Parse top-level keys as Payload global slugs
3. For each global slug + locale:
   - Fetch current DB state via `payload.findGlobal({ slug, locale })`
   - Deep-merge JSON content with current DB state
   - **Never overwrite a non-empty DB value** unless the `--force` flag is passed
   - Call `payload.updateGlobal({ slug, locale, data })`
4. Print summary per global per locale: fields updated / skipped / errors
5. Exit with code `0` on success, `1` on any error

**Merge behavior (without `--force`):**
- If DB field has a non-empty value and JSON has a different value → **skip** (preserve DB)
- If DB field is empty/missing and JSON has a value → **update**
- With `--force` → always overwrite DB with JSON values

### 3. Export Command

Create `scripts/export-i18n.ts`:

```bash
npm run i18n:export
```

This command:

1. Connect to Payload via Local API
2. Read active locales from `src/lib/locales.json`
3. For each active locale:
   - For each supported global: `payload.findGlobal({ slug, locale })`
   - Extract only the localized field values (skip internal Payload fields like `id`, `createdAt`, `updatedAt`, `globalType`)
   - Combine all globals into a single object keyed by global slug
   - Write to `public/locales/{locale}.json` (pretty-printed, sorted keys)
4. Print summary: files written, total fields per locale

### 4. Validation Command

Create `scripts/validate-i18n.ts`:

```bash
npm run i18n:validate
```

This command:

1. Use `en` (default locale) JSON file as structural reference
2. Flatten all keys in `public/locales/en.json` to dot-notation paths
3. For each other locale file (`tr.json`, `de.json`, etc.):
   - Report **missing keys** — keys in `en.json` but not in the target
   - Report **extra keys** — keys in the target but not in `en.json`
   - Report **untranslated keys** — keys whose value is still `""`
4. Exit with code `1` if any issues are found (CI-friendly)
5. Print clear, color-coded CLI output (green = OK, yellow = warning, red = error)

### 5. Admin "Generate i18n" Button

Create a custom Payload admin view accessible at `/admin/i18n-generate`:

**Server/API side — `src/app/(payload)/api/i18n/generate/route.ts`:**

- A Next.js API route that runs the same import logic as `scripts/import-i18n.ts`
- Reads `public/locales/*.json` files from disk
- Parses top-level keys as global slugs
- Iterates globals × locales, updates Payload DB
- Returns a JSON response with sync summary (per global, per locale: updated / skipped / errors)
- Protected: require authenticated Payload admin user

**Client side — `src/components/admin/I18nGenerateView.tsx`:**

- A React client component registered as a Payload 3 custom admin view
- UI elements:
  - A prominent "Generate i18n" button
  - Loading/progress indicator during sync
  - Summary display after completion (per global, per locale: what was updated)
  - Error display if anything fails
- Calls the API endpoint (`POST /api/i18n/generate`) on button click

**Registration in `payload.config.ts`:**

- Add the custom view via `admin.views` configuration
- Add a nav link to the view (e.g., under Settings group or as a top-level admin action)

### 6. Scaffold Command (Optional)

Create `scripts/scaffold-i18n.ts`:

```bash
npm run i18n:scaffold
```

This command:

1. Read `payload.config.ts` to enumerate all globals with localized fields
2. For each locale, generate `public/locales/{locale}.json` with correct structure but empty string values
3. Useful for bootstrapping or when a new global is added

### 7. File Structure

```
scripts/
├── import-i18n.ts           # JSON → Payload DB sync (also used by Generate button)
├── export-i18n.ts           # Payload DB → JSON dump
├── validate-i18n.ts         # Cross-locale validation
└── scaffold-i18n.ts         # Generate empty JSON templates from schema (optional)

public/locales/              # Source of truth (git-tracked, browser-accessible)
├── en.json                  # All English translations (all globals)
├── tr.json                  # All Turkish translations
└── de.json                  # All German translations

src/components/admin/
└── I18nGenerateView.tsx     # Admin panel "Generate i18n" button UI

src/app/(payload)/api/i18n/
└── generate/route.ts        # API endpoint for Generate action
```

### 8. package.json Scripts

Add the following to `package.json` (use `tsx` — already installed as devDependency):

```json
{
  "scripts": {
    "i18n:import": "tsx scripts/import-i18n.ts",
    "i18n:export": "tsx scripts/export-i18n.ts",
    "i18n:validate": "tsx scripts/validate-i18n.ts",
    "i18n:scaffold": "tsx scripts/scaffold-i18n.ts"
  }
}
```

### 9. Supported Globals

These are the Payload globals with localized fields that the pipeline must handle:

| Global Slug | Config Name | Key Localized Fields |
|---|---|---|
| `navigation` | Navigation | `mainMenu` (nested array with labels), `megaMenuCTA` |
| `footer` | Footer | `labels` (group), `copyrightText` |
| `ui-labels` | UiLabels | `learnMore`, `readMore`, `contentComingSoon` |
| `homepage-settings` | HomepageSettings | `heroSlides`, `aboutPreviewLabels`, `businessSection`, `newsSection` |
| `about-page-settings` | AboutPageSettings | `hero`, `story`, `statistics`, `gallery`, `video`, `certificates`, `cta` |
| `contact-page-settings` | ContactPageSettings | `hero`, `form`, `messages`, `info` |
| `news-page-settings` | NewsPageSettings | `hero`, `labels` |
| `site-settings` | SiteSettings | `chatbot.labels`, `whatsappCTA` |

---

## Technical Constraints

| Constraint | Detail |
|---|---|
| Runtime | Node.js + TypeScript |
| Script runner | `tsx` (already in devDependencies — do NOT use `ts-node`) |
| DB access | Scripts need Payload Local API (requires `DATABASE_URL` env var) |
| JSON format | Nested JSON, top-level keys = global slugs, inner structure matches Payload field schema |
| JSON location | `public/locales/` (browser-accessible, git-tracked) |
| Default locale | `en` (English) — this is the structural reference for validation |
| Active locales | Read from `src/lib/locales.json` (currently: `en`, `tr`, `de`) |
| Compatibility | Must work alongside existing Payload localization without any modifications |
| Payload version | Payload CMS 3 with App Router integration |
| Code quality | Production-grade — proper error handling, typed functions, clean separation of concerns |
| No new i18n libs | Do NOT install i18next, next-intl, react-intl, or any i18n runtime library |

---

## Rules

1. **Do NOT touch my existing Payload runtime** — no modifications to globals, collections, hooks, middleware, or providers
2. **Only extend** — all scripts and components are additive tools that operate on locale JSON files and sync with Payload DB
3. **No pseudo-code** — every file must be complete, runnable, and tested
4. **End-to-end functionality** — running the commands must produce real results on a real project
5. **Idempotent operations** — running the same command twice must produce the same result
6. **Safe by default** — never overwrite a non-empty translation in DB without explicit `--force` flag
7. **Admin Generate button** must provide clear visual feedback: loading state, success summary, error display

---

## Expected Deliverables

1. All script files (complete, with imports and error handling)
2. Admin custom view component (`I18nGenerateView.tsx`)
3. API endpoint (`/api/i18n/generate/route.ts`)
4. Registration snippet for `payload.config.ts` (admin view + nav link)
5. `package.json` script additions
6. Brief usage instructions (how to run, what to expect)

---

*Now implement the full system.*
