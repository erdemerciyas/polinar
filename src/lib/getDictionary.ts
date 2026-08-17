import fs from 'fs/promises'
import path from 'path'
import { SHELL_TRANSLATIONS } from '@/lib/shell-translations'

// Cache dictionary in memory for the lifetime of the server process.
const dictionaryCache: Record<string, Record<string, any>> = {}

// Globals we need to fetch from Payload as fallback
const GLOBAL_SLUGS = [
  'navigation',
  'ui-labels',
  'footer',
  'site-settings',
  'homepage-settings',
  'about-page-settings',
  'contact-page-settings',
  'news-page-settings',
  'our-business-page-settings',
]

async function loadJsonFile(locale: string): Promise<Record<string, any> | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`)
    const file = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(file)
  } catch {
    return null
  }
}

/**
 * Deep-merge: overlay text values from `overlay` onto `base`.
 * - Media/objects with `url`+`filesize` (or `filename`+`mimeType`) in base are preserved.
 * - Strings/numbers/booleans from overlay replace base values.
 * - Arrays are merged index-by-index (overlay can fill in translations into matching items).
 */
function isMediaLike(v: any): boolean {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  return ('filename' in v && 'mimeType' in v) || ('url' in v && 'filesize' in v)
}

export function overlayTranslations(base: any, overlay: any): any {
  if (overlay === null || overlay === undefined) return base
  if (isMediaLike(base)) return base
  if (Array.isArray(overlay)) {
    if (!Array.isArray(base)) return overlay
    return base.map((item, i) =>
      i < overlay.length ? overlayTranslations(item, overlay[i]) : item,
    )
  }
  if (typeof overlay === 'object') {
    if (typeof base !== 'object' || base === null || Array.isArray(base)) {
      return overlay
    }
    const result: Record<string, any> = { ...base }
    for (const key of Object.keys(overlay)) {
      result[key] = overlayTranslations(base[key], overlay[key])
    }
    return result
  }
  if (overlay === '') return base
  return overlay
}

function applyShellTranslations(locale: string, result: Record<string, any>) {
  const shell = SHELL_TRANSLATIONS[locale]
  if (!shell) return

  for (const [slug, overlay] of Object.entries(shell)) {
    result[slug] = overlayTranslations(result[slug] || {}, overlay)
  }
}

/**
 * Returns the merged dictionary for a locale.
 *
 * Strategy:
 *  - Fetch full data from Payload (this includes media URLs and full structure)
 *  - Overlay translation text from the locale's JSON file in public/locales
 *  - Apply stable shell translations for shared UI (nav/homepage)
 *  - Static-content (src/data/*) is read from JSON as-is
 */
export async function getDictionary(locale: string): Promise<Record<string, any>> {
  if (dictionaryCache[locale]) {
    return dictionaryCache[locale]
  }

  const jsonData = (await loadJsonFile(locale)) || {}

  const result: Record<string, any> = {}

  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()

    await Promise.all(
      GLOBAL_SLUGS.map(async (slug) => {
        try {
          const base = await payload.findGlobal({ slug: slug as any, locale: locale as any })
          const overlay = jsonData[slug]
          result[slug] = overlay ? overlayTranslations(base, overlay) : base
        } catch {
          if (jsonData[slug]) result[slug] = jsonData[slug]
        }
      }),
    )
  } catch {
    Object.assign(result, jsonData)
  }

  if (jsonData['static-content']) {
    result['static-content'] = jsonData['static-content']
  }

  applyShellTranslations(locale, result)

  dictionaryCache[locale] = result
  return result
}

/** Clear the in-memory cache (useful after CMS/JSON updates) */
export function clearDictionaryCache(locale?: string) {
  if (locale) {
    delete dictionaryCache[locale]
  } else {
    for (const key of Object.keys(dictionaryCache)) {
      delete dictionaryCache[key]
    }
  }
}
