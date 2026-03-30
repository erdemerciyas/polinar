/**
 * Create Static Page i18n Module
 *
 * Given only an en.ts file in src/data/{module}/, this script auto-generates:
 *   1. types.ts  — extracted from the shape of en.ts data
 *   2. index.ts  — with createLocaleLoader wiring
 *   3. {locale}.ts for every non-EN locale in locales.json
 *
 * Usage:
 *   npm run i18n:create-page quality-control
 *   (after you've placed en.ts in src/data/quality-control/)
 *
 *   npm run i18n:create-page --all
 *   (scans all src/data/ modules and generates missing files)
 */

import fs from 'fs'
import path from 'path'
import { PROJECT_ROOT, getLocaleCodes, c } from './lib/i18n-shared.js'

const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data')

function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

function inferType(value: any, indent: number): string {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (value === null || value === undefined) return 'string'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]'
    const itemType = inferType(value[0], indent)
    if (itemType.includes('\n')) return `Array<${itemType}>`
    return `${itemType}[]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return 'Record<string, any>'
    const fields = entries.map(([k, v]) => {
      const fieldType = inferType(v, indent + 1)
      return `${innerPad}${k}: ${fieldType}`
    })
    return `{\n${fields.join('\n')}\n${pad}}`
  }

  return 'any'
}

function generateTypes(data: any, typeName: string): string {
  const fields = Object.entries(data).map(([key, value]) => {
    const fieldType = inferType(value, 1)
    return `  ${key}: ${fieldType}`
  })

  return `export type ${typeName} = {\n${fields.join('\n')}\n}\n`
}

function generateIndex(typeName: string, slug: string): string {
  const fnName = `get${toPascalCase(slug)}Data`
  return [
    `import type { ${typeName} } from './types'`,
    `import { createLocaleLoader } from '../locale-loader'`,
    `import en from './en'`,
    ``,
    `export type { ${typeName} } from './types'`,
    ``,
    `export const ${fnName} = createLocaleLoader<${typeName}>(`,
    `  en,`,
    `  (locale) => require(\`./\${locale}\`),`,
    `)`,
    ``,
  ].join('\n')
}

function generateLocaleFile(enContent: string, locale: string, typeName: string): string {
  let result = enContent
    .replace(
      new RegExp(`import\\s+type\\s+\\{\\s*${typeName}\\s*\\}\\s+from\\s+['\"]\\.\\/types['\"]`),
      `import type { ${typeName} } from './types'`,
    )
    .replace(new RegExp(`const\\s+en\\s*:\\s*${typeName}`), `const ${locale}: ${typeName}`)
    .replace(new RegExp(`const\\s+en\\s*=`), `const ${locale} =`)
    .replace(/export\s+default\s+en/, `export default ${locale}`)

  return `// TODO: Translate this file for locale '${locale}'\n\n${result}`
}

function loadEnData(enPath: string): any {
  const content = fs.readFileSync(enPath, 'utf-8')

  let dataStr = content
    .replace(/^\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')
    .replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')

  const match = dataStr.match(/=\s*([\s\S]+?)(?:\s*;?\s*\n\s*export\s+default)/)
  if (!match) {
    const match2 = dataStr.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/)
    if (!match2) return null
    dataStr = match2[1]
  } else {
    dataStr = match[1]
  }

  dataStr = dataStr.trim()
  if (dataStr.endsWith(';')) dataStr = dataStr.slice(0, -1).trim()

  dataStr = dataStr.replace(/\/\/[^\n]*/g, '')

  dataStr = dataStr.replace(/'/g, '"')

  dataStr = dataStr.replace(/,(\s*[}\]])/g, '$1')

  dataStr = dataStr.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')

  dataStr = dataStr.replace(/"(\w+)"(\s*)"(\w+)":/g, '"$1"$2"$3":')

  try {
    return JSON.parse(dataStr)
  } catch {
    try {
      const fn = new Function(`return (${dataStr})`)
      return fn()
    } catch {
      return null
    }
  }
}

function processModule(slug: string, localeCodes: string[]): void {
  const modDir = path.join(DATA_DIR, slug)
  const enPath = path.join(modDir, 'en.ts')

  if (!fs.existsSync(enPath)) {
    console.log(c.red(`  ✗ ${slug}/en.ts not found — create it first`))
    return
  }

  const typeName = `${toPascalCase(slug)}Data`
  const typesPath = path.join(modDir, 'types.ts')
  const indexPath = path.join(modDir, 'index.ts')

  console.log(c.bold(`\n  📦 ${slug}/`))

  if (!fs.existsSync(typesPath)) {
    const data = loadEnData(enPath)
    if (data) {
      const typesContent = generateTypes(data, typeName)
      fs.writeFileSync(typesPath, typesContent, 'utf-8')
      console.log(c.green(`    ✓ types.ts — generated (type ${typeName})`))
    } else {
      console.log(c.yellow(`    ⚠ types.ts — could not auto-generate (complex en.ts)`))
      console.log(c.dim(`      Create types.ts manually, then re-run`))
    }
  } else {
    console.log(c.dim(`    ⏭ types.ts — already exists`))
  }

  if (!fs.existsSync(indexPath)) {
    const actualTypeName = getTypeNameFromFile(typesPath) || typeName
    const indexContent = generateIndex(actualTypeName, slug)
    fs.writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(c.green(`    ✓ index.ts — generated`))
  } else {
    console.log(c.dim(`    ⏭ index.ts — already exists`))
  }

  const enContent = fs.readFileSync(enPath, 'utf-8')
  const actualTypeName = getTypeNameFromFile(typesPath) || typeName

  if (!enContent.includes(`import type {`)) {
    const updatedEn = `import type { ${actualTypeName} } from './types'\n\n${enContent.replace(/const\s+en\s*=/, `const en: ${actualTypeName} =`)}`
    fs.writeFileSync(enPath, updatedEn, 'utf-8')
    console.log(c.green(`    ✓ en.ts — added type annotation`))
  }

  for (const locale of localeCodes) {
    const localePath = path.join(modDir, `${locale}.ts`)
    if (fs.existsSync(localePath)) {
      console.log(c.dim(`    ⏭ ${locale}.ts — already exists`))
    } else {
      const localeContent = generateLocaleFile(enContent, locale, actualTypeName)
      fs.writeFileSync(localePath, localeContent, 'utf-8')
      console.log(c.green(`    ✓ ${locale}.ts — created`))
    }
  }

  const fnName = `get${toPascalCase(slug)}Data`
  console.log(c.dim(`\n    Usage in your page component:`))
  console.log(c.dim(`      import { ${fnName} } from '@/data/${slug}'`))
  console.log(c.dim(`      const data = ${fnName}(locale)`))
}

function getTypeNameFromFile(typesPath: string): string | null {
  if (!fs.existsSync(typesPath)) return null
  const content = fs.readFileSync(typesPath, 'utf-8')
  const exports = [...content.matchAll(/export\s+type\s+(\w+)\s*=/g)]
  if (exports.length === 0) return null
  const mainType = exports.find((m) => m[1].endsWith('Data')) || exports[exports.length - 1]
  return mainType[1]
}

function findModulesWithOnlyEn(): string[] {
  const dirs: string[] = []
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'node_modules') continue
    const enFile = path.join(DATA_DIR, entry.name, 'en.ts')
    if (fs.existsSync(enFile)) {
      dirs.push(entry.name)
    }
  }
  return dirs.sort()
}

function main() {
  console.log(c.bold('\n🚀 Static Page i18n Generator\n'))

  const localeCodes = getLocaleCodes().filter((l) => l !== 'en')
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const isAll = process.argv.includes('--all')

  if (args.length === 0 && !isAll) {
    console.log(`  Usage:`)
    console.log(`    npm run i18n:create-page <slug>     Create module for a specific page`)
    console.log(`    npm run i18n:create-page --all       Process all modules with en.ts`)
    console.log(``)
    console.log(`  Example:`)
    console.log(`    1. Create src/data/quality-control/en.ts with your English content`)
    console.log(`    2. Run: npm run i18n:create-page quality-control`)
    console.log(`    3. types.ts, index.ts, and all locale files are auto-generated`)
    console.log(`    4. Use in your page: import { getQualityControlData } from '@/data/quality-control'`)
    console.log(``)
    const existing = findModulesWithOnlyEn()
    if (existing.length > 0) {
      console.log(c.dim(`  Existing modules: ${existing.join(', ')}`))
    }
    return
  }

  const slugs = isAll ? findModulesWithOnlyEn() : args

  if (slugs.length === 0) {
    console.log(c.yellow('  No modules found'))
    return
  }

  console.log(c.dim(`  Locales: en (source) + ${localeCodes.join(', ')}`))

  for (const slug of slugs) {
    const modDir = path.join(DATA_DIR, slug)
    if (!fs.existsSync(modDir)) {
      fs.mkdirSync(modDir, { recursive: true })
      console.log(c.green(`\n  📁 Created src/data/${slug}/`))
    }
    processModule(slug, localeCodes)
  }

  console.log(c.bold('\n✅ Done! Pages are ready for translation via admin panel.\n'))
}

main()
