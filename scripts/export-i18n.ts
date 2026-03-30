/**
 * i18n Export: Payload DB → JSON files
 *
 * Reads all supported globals from Payload for each locale,
 * strips internal fields, and writes to public/locales/{locale}.json.
 *
 * Usage:
 *   npm run i18n:export
 */

import {
  SUPPORTED_GLOBAL_SLUGS,
  getLocaleCodes,
  writeLocaleFile,
  stripPayloadInternals,
  initPayload,
  c,
} from './lib/i18n-shared.js'

async function main() {
  console.log(c.bold('\n📤 i18n Export: Payload DB → JSON\n'))

  const payload = await initPayload()
  const localeCodes = getLocaleCodes()

  for (const locale of localeCodes) {
    const localeData: Record<string, any> = {}
    let fieldCount = 0

    for (const slug of SUPPORTED_GLOBAL_SLUGS) {
      try {
        const raw = await payload.findGlobal({ slug, locale: locale as any })
        const cleaned = stripPayloadInternals(raw as Record<string, any>)
        localeData[slug] = cleaned
        fieldCount += countFields(cleaned)
      } catch (err) {
        console.log(c.yellow(`  ⚠ Could not read "${slug}" for [${locale}]: ${err instanceof Error ? err.message : err}`))
      }
    }

    writeLocaleFile(locale, localeData)
    console.log(c.green(`  ✓ public/locales/${locale}.json`) + c.dim(` (${Object.keys(localeData).length} globals, ~${fieldCount} fields)`))
  }

  console.log(c.bold('\n✅ Export complete\n'))
  process.exit(0)
}

function countFields(obj: any): number {
  if (obj === null || obj === undefined) return 0
  if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countFields(item), 0)
  if (typeof obj === 'object') return Object.values(obj).reduce((sum: number, v) => sum + countFields(v), 0)
  return 1
}

main().catch((err) => {
  console.error(c.red('\nFatal error:'), err)
  process.exit(1)
})
