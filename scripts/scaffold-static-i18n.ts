/**
 * Static i18n Scaffold: Auto-generate missing locale files in src/data/
 *
 * Scans every subdirectory under src/data/ that has an en.ts file.
 * For each locale in locales.json (excluding 'en'), creates a {locale}.ts
 * file if one doesn't already exist -- seeded with the EN data as a starting
 * point for translation.
 *
 * Usage:
 *   npm run i18n:scaffold-static
 *   npm run i18n:scaffold-static -- --force   (overwrite existing files)
 */

import fs from 'fs'
import path from 'path'
import { PROJECT_ROOT, getLocaleCodes, c } from './lib/i18n-shared.js'

const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data')

function findDataModules(): string[] {
  const dirs: string[] = []
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const enFile = path.join(DATA_DIR, entry.name, 'en.ts')
    if (fs.existsSync(enFile)) {
      dirs.push(entry.name)
    }
  }
  return dirs.sort()
}

function getMainTypeName(modulePath: string): string | null {
  const typesPath = path.join(modulePath, 'types.ts')
  if (!fs.existsSync(typesPath)) return null
  const content = fs.readFileSync(typesPath, 'utf-8')
  const exports = [...content.matchAll(/export\s+type\s+(\w+)\s*=/g)]
  if (exports.length === 0) return null
  const mainType = exports.find((m) => m[1].endsWith('Data')) || exports[exports.length - 1]
  return mainType[1]
}

function generateLocaleFile(enContent: string, locale: string, moduleName: string): string {
  const typesTypeName = getMainTypeName(path.join(DATA_DIR, moduleName))
  const typeImportMatch = enContent.match(/import\s+type\s+\{([^}]+)\}\s+from\s+['"]\.\/types['"]/)
  const typeName = typesTypeName || (typeImportMatch ? typeImportMatch[1].trim() : null)

  const defaultExportMatch = enContent.match(/const\s+en\s*:\s*\w+\s*=\s*/)
  if (!defaultExportMatch) {
    return enContent
      .replace(/const\s+en\b/g, `const ${locale}`)
      .replace(/export\s+default\s+en/, `export default ${locale}`)
  }

  let result = enContent

  result = result.replace(
    /import\s+type\s+\{[^}]+\}\s+from\s+['"]\.\/types['"]\s*;?/,
    typeName ? `import type { ${typeName} } from './types'` : '',
  )

  result = result
    .replace(/const\s+en\s*:\s*\w+/g, `const ${locale}: ${typeName || 'any'}`)
    .replace(/const\s+en\s*=/g, `const ${locale} =`)
    .replace(/export\s+default\s+en/, `export default ${locale}`)

  const header = `// TODO: Translate this file for locale '${locale}'\n// This was auto-scaffolded from en.ts — replace English strings with ${locale} translations\n\n`
  return header + result
}

function main() {
  console.log(c.bold('\n🏗️  Static i18n Scaffold\n'))

  const force = process.argv.includes('--force')
  const localeCodes = getLocaleCodes().filter((l) => l !== 'en')

  if (localeCodes.length === 0) {
    console.log(c.yellow('  No non-EN locales found in locales.json'))
    return
  }

  const modules = findDataModules()

  if (modules.length === 0) {
    console.log(c.yellow('  No data modules with en.ts found in src/data/'))
    return
  }

  console.log(c.dim(`  Found ${modules.length} data module(s): ${modules.join(', ')}`))
  console.log(c.dim(`  Target locales: ${localeCodes.join(', ')}\n`))

  let created = 0
  let skipped = 0

  for (const mod of modules) {
    const modDir = path.join(DATA_DIR, mod)
    const enFilePath = path.join(modDir, 'en.ts')
    const enContent = fs.readFileSync(enFilePath, 'utf-8')

    for (const locale of localeCodes) {
      const localeFilePath = path.join(modDir, `${locale}.ts`)
      const exists = fs.existsSync(localeFilePath)

      if (exists && !force) {
        console.log(c.dim(`  ⏭ ${mod}/${locale}.ts — already exists`))
        skipped++
        continue
      }

      const content = generateLocaleFile(enContent, locale, mod)
      fs.writeFileSync(localeFilePath, content, 'utf-8')

      if (exists) {
        console.log(c.yellow(`  ♻ ${mod}/${locale}.ts — overwritten`))
      } else {
        console.log(c.green(`  ✓ ${mod}/${locale}.ts — created`))
      }
      created++
    }
  }

  console.log(c.bold(`\n✅ Done: ${created} created, ${skipped} skipped\n`))
}

main()
