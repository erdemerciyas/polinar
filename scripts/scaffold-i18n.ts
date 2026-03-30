/**
 * i18n Scaffold: Generate empty JSON templates
 *
 * Creates public/locales/{locale}.json with correct structure
 * but empty string values for all localized fields.
 * Does NOT overwrite existing files — use --force to replace.
 *
 * Usage:
 *   npm run i18n:scaffold
 *   npm run i18n:scaffold -- --force
 */

import fs from 'fs'
import path from 'path'
import {
  LOCALES_DIR,
  SUPPORTED_GLOBAL_SLUGS,
  getLocaleCodes,
  c,
} from './lib/i18n-shared.js'

const GLOBAL_TEMPLATES: Record<string, any> = {
  'navigation': {
    mainMenu: [],
    megaMenuCTA: {
      title: '',
      description: '',
      button: '',
    },
  },
  'footer': {
    labels: {
      addressLabel: '',
      phoneFaxLabel: '',
      emailLabel: '',
      newsletterLabel: '',
      subscribeButton: '',
      namePlaceholder: '',
      emailPlaceholder: '',
    },
    copyrightText: '',
    columns: [],
  },
  'ui-labels': {
    learnMore: '',
    readMore: '',
    contentComingSoon: '',
  },
  'homepage-settings': {
    heroSlides: [],
    coreValues: { title: '', description: '' },
    aboutPreviewLabels: { label: '', title: '', description: '' },
    businessSection: { sectionLabel: '', sectionTitle: '' },
    newsSection: { label: '', title: '', empty: '' },
  },
  'about-page-settings': {
    hero: { label: '', title: '', subtitle: '' },
    story: { title: '', paragraph1: '', paragraph2: '', paragraph3: '', ctaText: '' },
    statistics: { cards: [] },
    gallery: { title: '', description: '', images: [] },
    video: { title: '', description: '' },
    certificates: { title: '', description: '', items: [] },
    cta: { title: '', description: '', buttonText: '' },
  },
  'contact-page-settings': {
    hero: { title: '', subtitle: '' },
    form: { nameLabel: '', emailLabel: '', subjectLabel: '', messageLabel: '', sendButton: '', sendingButton: '' },
    messages: { success: '', error: '' },
    info: { addressLabel: '', addressText: '', phoneLabel: '', emailLabel: '' },
  },
  'news-page-settings': {
    hero: { label: '', title: '' },
    labels: { empty: '', breadcrumb: '', allNews: '', cmsPlaceholder: '' },
  },
  'site-settings': {
    defaultSeoDescription: '',
    contact: { address: '' },
    chatbot: {
      labels: {
        title: '',
        welcome: '',
        placeholder: '',
        whatsappLabel: '',
        closeLabel: '',
        errorMessage: '',
        connectionError: '',
      },
    },
    whatsappCTA: { text: '' },
  },
}

function main() {
  console.log(c.bold('\n📝 i18n Scaffold: Generate empty templates\n'))

  const force = process.argv.includes('--force')
  const localeCodes = getLocaleCodes()

  fs.mkdirSync(LOCALES_DIR, { recursive: true })

  for (const locale of localeCodes) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`)
    const exists = fs.existsSync(filePath)

    if (exists && !force) {
      console.log(c.yellow(`  ⚠ ${locale}.json already exists, skipping (use --force to replace)`))
      continue
    }

    const template: Record<string, any> = {}
    for (const slug of SUPPORTED_GLOBAL_SLUGS) {
      template[slug] = GLOBAL_TEMPLATES[slug] || {}
    }

    fs.writeFileSync(filePath, JSON.stringify(template, null, 2) + '\n', 'utf-8')
    console.log(c.green(`  ✓ public/locales/${locale}.json`) + (exists ? c.yellow(' (overwritten)') : c.dim(' (created)')))
  }

  console.log(c.bold('\n✅ Scaffold complete\n'))
}

main()
