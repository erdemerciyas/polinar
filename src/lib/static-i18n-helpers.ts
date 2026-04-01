import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')

export function getStaticDataModules(): string[] {
  const dirs: string[] = []
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (fs.existsSync(path.join(DATA_DIR, entry.name, 'en.ts'))) {
      dirs.push(entry.name)
    }
  }
  return dirs.sort()
}

export function exportStaticLocaleData(locale: string): Record<string, any> {
  const modules = getStaticDataModules()
  const result: Record<string, any> = {}

  for (const mod of modules) {
    const filePath = path.join(DATA_DIR, mod, `${locale}.ts`)
    if (!fs.existsSync(filePath)) continue

    const data = loadTSModule(filePath)
    if (data !== null) {
      result[mod] = stripNonTranslatable(data)
    }
  }

  return result
}

function loadTSModule(filePath: string): any {
  const content = fs.readFileSync(filePath, 'utf-8')
  return evalTSData(content) ?? extractDataFromTS(content)
}

function evalTSData(content: string): any {
  try {
    let js = content
      .replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')
      .replace(/export\s+default\s+\w+\s*;?/g, '')
      .replace(/:\s*\w+\s*=/g, ' =')

    const match = js.match(/(?:const|let|var)\s+\w+\s*=\s*([\s\S]+)/)
    if (!match) return null

    let expr = match[1].trim()
    if (expr.endsWith(';')) expr = expr.slice(0, -1)

    const fn = new Function(`"use strict"; return (${expr})`)
    return fn()
  } catch {
    return null
  }
}

function stripNonTranslatable(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj

  if (Array.isArray(obj)) {
    return obj.map(stripNonTranslatable)
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && (value.startsWith('/images/') || value.startsWith('/videos/') || value.startsWith('https://res.cloudinary.com/'))) continue
      if (typeof value === 'string' && value.endsWith('.pdf') && (value.startsWith('/') || value.startsWith('https://'))) continue
      result[key] = stripNonTranslatable(value)
    }
    return result
  }

  return obj
}

function extractDataFromTS(content: string): any {
  let cleaned = content
    .replace(/^\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')
    .replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"]\s*;?/g, '')

  const constMatch = cleaned.match(/const\s+\w+\s*(?::\s*\w+)?\s*=\s*([\s\S]+)/)
  if (!constMatch) return null

  let dataStr = constMatch[1]
    .replace(/export\s+default\s+\w+\s*;?/, '')
    .trim()

  if (dataStr.endsWith(';')) dataStr = dataStr.slice(0, -1).trim()

  dataStr = dataStr.replace(/,(\s*[}\]])/g, '$1')
  dataStr = dataStr.replace(/'/g, '"')

  try {
    return JSON.parse(dataStr)
  } catch {
    try {
      dataStr = cleaned
      const match = dataStr.match(/=\s*(\{[\s\S]*\})\s*;?\s*(?:export\s+default|\s*$)/)
      if (!match) return null

      let obj = match[1]
      obj = obj.replace(/'/g, '"')
      obj = obj.replace(/,(\s*[}\]])/g, '$1')
      obj = obj.replace(/\/\/[^\n]*/g, '')
      obj = obj.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')

      return JSON.parse(obj)
    } catch {
      return null
    }
  }
}

export function importStaticLocaleData(
  locale: string,
  data: Record<string, any>,
): { module: string; status: 'created' | 'updated' | 'error'; error?: string }[] {
  const results: { module: string; status: 'created' | 'updated' | 'error'; error?: string }[] = []

  for (const [mod, modData] of Object.entries(data)) {
    const modDir = path.join(DATA_DIR, mod)
    if (!fs.existsSync(modDir) || !fs.existsSync(path.join(modDir, 'en.ts'))) {
      results.push({ module: mod, status: 'error', error: `Module '${mod}' not found in src/data/` })
      continue
    }

    const typesPath = path.join(modDir, 'types.ts')
    const typeName = extractTypeName(typesPath)

    // Load existing EN data to merge image/pdf paths back in
    const enPath = path.join(modDir, 'en.ts')
    const enData = loadTSModule(enPath)
    const mergedData = enData ? mergeWithPaths(enData, modData) : modData

    try {
      const tsContent = generateTSFile(locale, mergedData, typeName)
      const filePath = path.join(modDir, `${locale}.ts`)
      const existed = fs.existsSync(filePath)
      fs.writeFileSync(filePath, tsContent, 'utf-8')
      results.push({ module: mod, status: existed ? 'updated' : 'created' })
    } catch (err) {
      results.push({ module: mod, status: 'error', error: err instanceof Error ? err.message : String(err) })
    }
  }

  return results
}

function mergeWithPaths(en: any, translated: any): any {
  if (translated === null || translated === undefined) return en
  if (typeof en !== 'object' || en === null) return translated ?? en

  if (Array.isArray(en)) {
    if (!Array.isArray(translated)) return en
    return en.map((item, i) => {
      if (i < translated.length) return mergeWithPaths(item, translated[i])
      return item
    })
  }

  const result: any = {}
  for (const key of Object.keys(en)) {
    if (key in translated) {
      result[key] = mergeWithPaths(en[key], translated[key])
    } else {
      result[key] = en[key]
    }
  }
  return result
}

function extractTypeName(typesPath: string): string | null {
  if (!fs.existsSync(typesPath)) return null
  const content = fs.readFileSync(typesPath, 'utf-8')
  const exports = [...content.matchAll(/export\s+type\s+(\w+)\s*=/g)]
  if (exports.length === 0) return null
  const mainType = exports.find((m) => m[1].endsWith('Data')) || exports[exports.length - 1]
  return mainType[1]
}

function generateTSFile(locale: string, data: any, typeName: string | null): string {
  const lines: string[] = []

  if (typeName) {
    lines.push(`import type { ${typeName} } from './types'`)
    lines.push('')
    lines.push(`const ${locale}: ${typeName} = ${jsonToTS(data, 0)}`)
  } else {
    lines.push(`const ${locale} = ${jsonToTS(data, 0)}`)
  }

  lines.push('')
  lines.push(`export default ${locale}`)
  lines.push('')

  return lines.join('\n')
}

function jsonToTS(value: any, indent: number): string {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (value === null || value === undefined) return 'null'
  if (typeof value === 'string') return quoteString(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (value.every((v) => typeof v === 'string') && value.length <= 5) {
      const items = value.map((v) => quoteString(v)).join(', ')
      if (items.length < 80) return `[${items}]`
    }
    const items = value.map((v) => `${innerPad}${jsonToTS(v, indent + 1)},`).join('\n')
    return `[\n${items}\n${pad}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    const items = entries
      .map(([k, v]) => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : quoteString(k)
        return `${innerPad}${key}: ${jsonToTS(v, indent + 1)},`
      })
      .join('\n')
    return `{\n${items}\n${pad}}`
  }

  return String(value)
}

function quoteString(s: string): string {
  if (s.includes("'") && !s.includes('`') && (s.includes('\n') || s.includes('${'))) {
    return '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`') + '`'
  }
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"
}
