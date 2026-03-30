/**
 * i18n Validate: Cross-locale validation
 *
 * Uses the default locale (en) JSON as structural reference.
 * Reports missing keys, extra keys, and untranslated (empty) values for each locale.
 *
 * Usage:
 *   npm run i18n:validate
 */

import fs from 'fs'
import path from 'path'
import {
  LOCALES_DIR,
  getLocaleCodes,
  getDefaultLocale,
  readLocaleFile,
  flattenKeys,
  c,
} from './lib/i18n-shared.js'

function main() {
  console.log(c.bold('\n🔍 i18n Validate\n'))

  const defaultLocale = getDefaultLocale()
  const allLocales = getLocaleCodes()
  const otherLocales = allLocales.filter((l) => l !== defaultLocale)

  const refData = readLocaleFile(defaultLocale)
  if (!refData) {
    console.error(c.red(`  ✗ Reference file public/locales/${defaultLocale}.json not found`))
    console.error(c.dim('    Run "npm run i18n:export" first to generate locale files.\n'))
    process.exit(1)
  }

  const refFlat = flattenKeys(refData)
  const refKeys = new Set(Object.keys(refFlat))

  console.log(c.blue(`  Reference: ${defaultLocale}.json`) + c.dim(` (${refKeys.size} keys)\n`))

  let hasIssues = false

  for (const locale of otherLocales) {
    const localeData = readLocaleFile(locale)
    if (!localeData) {
      console.log(c.red(`  ✗ [${locale}] `) + `public/locales/${locale}.json not found`)
      hasIssues = true
      continue
    }

    const localeFlat = flattenKeys(localeData)
    const localeKeys = new Set(Object.keys(localeFlat))

    const missing: string[] = []
    const extra: string[] = []
    const untranslated: string[] = []

    for (const key of refKeys) {
      if (!localeKeys.has(key)) {
        missing.push(key)
      } else if (localeFlat[key] === '' || localeFlat[key] === null || localeFlat[key] === undefined) {
        untranslated.push(key)
      }
    }

    for (const key of localeKeys) {
      if (!refKeys.has(key)) {
        extra.push(key)
      }
    }

    const isOk = missing.length === 0 && extra.length === 0 && untranslated.length === 0

    if (isOk) {
      console.log(c.green(`  ✓ [${locale}]`) + c.dim(` ${localeKeys.size} keys — all translated`))
    } else {
      hasIssues = true
      console.log(c.yellow(`  ⚠ [${locale}]`) + c.dim(` ${localeKeys.size} keys`))

      if (missing.length > 0) {
        console.log(c.red(`    Missing (${missing.length}):`))
        for (const key of missing.slice(0, 15)) {
          console.log(c.red(`      - ${key}`))
        }
        if (missing.length > 15) console.log(c.dim(`      ... and ${missing.length - 15} more`))
      }

      if (extra.length > 0) {
        console.log(c.yellow(`    Extra (${extra.length}):`))
        for (const key of extra.slice(0, 15)) {
          console.log(c.yellow(`      + ${key}`))
        }
        if (extra.length > 15) console.log(c.dim(`      ... and ${extra.length - 15} more`))
      }

      if (untranslated.length > 0) {
        console.log(c.yellow(`    Untranslated (${untranslated.length}):`))
        for (const key of untranslated.slice(0, 15)) {
          console.log(c.yellow(`      ~ ${key}`))
        }
        if (untranslated.length > 15) console.log(c.dim(`      ... and ${untranslated.length - 15} more`))
      }
    }
  }

  // Also check if all locale files exist
  const existingFiles = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json')).map((f) => path.basename(f, '.json'))
  const missingFiles = allLocales.filter((l) => !existingFiles.includes(l))
  if (missingFiles.length > 0) {
    hasIssues = true
    console.log(c.red(`\n  Missing locale files: ${missingFiles.join(', ')}`))
  }

  console.log('')
  if (hasIssues) {
    console.log(c.red(c.bold('  ✗ Validation failed — issues found above\n')))
    process.exit(1)
  } else {
    console.log(c.green(c.bold('  ✓ All locales valid\n')))
    process.exit(0)
  }
}

main()
