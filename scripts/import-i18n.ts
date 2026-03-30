/**
 * i18n Import: JSON files → Payload DB
 *
 * Reads public/locales/{locale}.json, parses top-level keys as global slugs,
 * and syncs each global's data into Payload DB.
 *
 * Usage:
 *   npm run i18n:import            # safe merge (never overwrite non-empty)
 *   npm run i18n:import -- --force  # overwrite all DB values with JSON
 */

import {
  SUPPORTED_GLOBAL_SLUGS,
  getLocaleCodes,
  readLocaleFile,
  deepMerge,
  stripPayloadInternals,
  initPayload,
  c,
  type SyncResult,
  type GlobalSlug,
} from './lib/i18n-shared.js'

export async function runImport(options?: { force?: boolean }): Promise<SyncResult[]> {
  const force = options?.force ?? false
  const payload = await initPayload()
  const localeCodes = getLocaleCodes()
  const results: SyncResult[] = []

  for (const locale of localeCodes) {
    const fileData = readLocaleFile(locale)
    if (!fileData) {
      console.log(c.yellow(`⚠ No file found for locale "${locale}", skipping`))
      continue
    }

    for (const slug of SUPPORTED_GLOBAL_SLUGS) {
      const sourceData = fileData[slug]
      if (!sourceData) continue

      const result: SyncResult = { global: slug, locale, updated: 0, skipped: 0, errors: [] }

      try {
        const current = await payload.findGlobal({ slug, locale: locale as any })
        const cleaned = stripPayloadInternals(current as Record<string, any>)
        const { merged, updatedCount, skippedCount } = deepMerge(cleaned, sourceData, force)

        result.updated = updatedCount
        result.skipped = skippedCount

        if (updatedCount > 0) {
          await payload.updateGlobal({ slug, locale: locale as any, data: merged })
        }
      } catch (err) {
        result.errors.push(err instanceof Error ? err.message : String(err))
      }

      results.push(result)
    }
  }

  return results
}

export function printResults(results: SyncResult[], force: boolean): void {
  console.log('\n' + c.bold('═══ i18n Import Summary ═══') + '\n')

  if (results.length === 0) {
    console.log(c.yellow('No locale files found or no globals to sync.'))
    return
  }

  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0

  const byLocale = new Map<string, SyncResult[]>()
  for (const r of results) {
    const arr = byLocale.get(r.locale) || []
    arr.push(r)
    byLocale.set(r.locale, arr)
  }

  for (const [locale, localeResults] of byLocale) {
    console.log(c.blue(`  [${locale}]`))
    for (const r of localeResults) {
      const parts: string[] = []
      if (r.updated > 0) parts.push(c.green(`${r.updated} updated`))
      if (r.skipped > 0) parts.push(c.yellow(`${r.skipped} skipped`))
      if (r.errors.length > 0) parts.push(c.red(`${r.errors.length} errors`))
      if (parts.length === 0) parts.push(c.dim('no changes'))

      console.log(`    ${r.global.padEnd(25)} ${parts.join(', ')}`)
      for (const err of r.errors) {
        console.log(`      ${c.red('→ ' + err)}`)
      }

      totalUpdated += r.updated
      totalSkipped += r.skipped
      totalErrors += r.errors.length
    }
  }

  console.log('')
  console.log(c.bold('  Total: ') + c.green(`${totalUpdated} updated`) + ', ' +
    c.yellow(`${totalSkipped} skipped`) + ', ' + c.red(`${totalErrors} errors`))
  if (force) console.log(c.yellow('  (--force mode: DB values were overwritten)'))
  console.log('')
}

// CLI entry point
const isDirectRun = process.argv[1]?.includes('import-i18n')
if (isDirectRun) {
  const force = process.argv.includes('--force')

  console.log(c.bold('\n🔄 i18n Import: JSON → Payload DB'))
  if (force) console.log(c.yellow('  Force mode enabled — will overwrite existing DB values'))

  runImport({ force })
    .then((results) => {
      printResults(results, force)
      const hasErrors = results.some((r) => r.errors.length > 0)
      process.exit(hasErrors ? 1 : 0)
    })
    .catch((err) => {
      console.error(c.red('\nFatal error:'), err)
      process.exit(1)
    })
}
