import path from 'path'
import fs from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PROJECT_ROOT = path.resolve(__dirname, '..', '..')
export const LOCALES_DIR = path.join(PROJECT_ROOT, 'public', 'locales')
export const LOCALES_CONFIG_PATH = path.join(PROJECT_ROOT, 'src', 'lib', 'locales.json')

export const SUPPORTED_GLOBAL_SLUGS = [
  'navigation',
  'footer',
  'ui-labels',
  'homepage-settings',
  'about-page-settings',
  'contact-page-settings',
  'news-page-settings',
  'site-settings',
] as const

export type GlobalSlug = (typeof SUPPORTED_GLOBAL_SLUGS)[number]

const PAYLOAD_INTERNAL_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'globalType',
])

function isMediaObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  return ('filename' in obj && 'mimeType' in obj) || ('url' in obj && 'filesize' in obj)
}

export interface LocaleConfig {
  locales: { label: string; code: string }[]
  defaultLocale: string
}

export interface SyncResult {
  global: string
  locale: string
  updated: number
  skipped: number
  errors: string[]
}

export function readLocalesConfig(): LocaleConfig {
  const raw = fs.readFileSync(LOCALES_CONFIG_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function getLocaleCodes(): string[] {
  return readLocalesConfig().locales.map((l) => l.code)
}

export function getDefaultLocale(): string {
  return readLocalesConfig().defaultLocale || 'en'
}

export function readLocaleFile(locale: string): Record<string, any> | null {
  const filePath = path.join(LOCALES_DIR, `${locale}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

export function writeLocaleFile(locale: string, data: Record<string, any>): void {
  const filePath = path.join(LOCALES_DIR, `${locale}.json`)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(sortKeysDeep(data), null, 2) + '\n', 'utf-8')
}

function sortKeysDeep(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep)
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, any>>((acc, key) => {
        acc[key] = sortKeysDeep(obj[key])
        return acc
      }, {})
  }
  return obj
}

/**
 * Strip Payload internal fields, media/upload objects, richText objects, and null values
 * from a global's data so JSON files only contain translatable text content.
 */
export function stripPayloadInternals(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (PAYLOAD_INTERNAL_FIELDS.has(key)) continue
    if (value === null || value === undefined) continue
    if (isMediaObject(value)) continue
    if (isRichTextObject(value)) continue
    if (Array.isArray(value)) {
      const filtered = value.map((item) => {
        if (item === null || item === undefined) return undefined
        if (typeof item === 'object') {
          if (isMediaObject(item)) return undefined
          if (isRichTextObject(item)) return undefined
          return stripPayloadInternals(item)
        }
        return item
      }).filter((v) => v !== undefined)
      if (filtered.length > 0) {
        result[key] = filtered
      }
    } else if (typeof value === 'object') {
      const nested = stripPayloadInternals(value)
      if (Object.keys(nested).length > 0) {
        result[key] = nested
      }
    } else {
      result[key] = value
    }
  }
  return result
}

function isRichTextObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  return 'root' in obj && typeof obj.root === 'object' && obj.root?.type === 'root'
}

/**
 * Deep-merge source into target.
 * - If force=false: only fill in empty/missing values, never overwrite non-empty.
 * - If force=true: overwrite everything with source values.
 * Returns { merged, updatedCount, skippedCount }.
 */
export function deepMerge(
  target: any,
  source: any,
  force: boolean,
): { merged: any; updatedCount: number; skippedCount: number } {
  let updatedCount = 0
  let skippedCount = 0

  if (source === null || source === undefined) {
    return { merged: target, updatedCount, skippedCount }
  }

  if (Array.isArray(source)) {
    if (!Array.isArray(target)) {
      return { merged: source, updatedCount: countLeaves(source), skippedCount: 0 }
    }
    const merged: any[] = []
    for (let i = 0; i < Math.max(target.length, source.length); i++) {
      if (i < source.length && i < target.length) {
        const result = deepMerge(target[i], source[i], force)
        merged.push(result.merged)
        updatedCount += result.updatedCount
        skippedCount += result.skippedCount
      } else if (i < source.length) {
        merged.push(source[i])
        updatedCount += countLeaves(source[i])
      } else {
        merged.push(target[i])
      }
    }
    return { merged, updatedCount, skippedCount }
  }

  if (typeof source === 'object' && source !== null) {
    const targetObj = (typeof target === 'object' && target !== null && !Array.isArray(target))
      ? { ...target }
      : {}
    for (const key of Object.keys(source)) {
      if (PAYLOAD_INTERNAL_FIELDS.has(key)) {
        targetObj[key] = targetObj[key] ?? source[key]
        continue
      }
      if (typeof source[key] === 'object' && source[key] !== null) {
        const result = deepMerge(targetObj[key], source[key], force)
        targetObj[key] = result.merged
        updatedCount += result.updatedCount
        skippedCount += result.skippedCount
      } else {
        const targetEmpty = targetObj[key] === undefined || targetObj[key] === null || targetObj[key] === ''
        if (force || targetEmpty) {
          if (source[key] !== '' && source[key] !== undefined && source[key] !== null) {
            if (targetObj[key] !== source[key]) {
              targetObj[key] = source[key]
              updatedCount++
            }
          }
        } else {
          if (targetObj[key] !== source[key]) {
            skippedCount++
          }
        }
      }
    }
    return { merged: targetObj, updatedCount, skippedCount }
  }

  // Leaf value
  const targetEmpty = target === undefined || target === null || target === ''
  if (force || targetEmpty) {
    if (source !== '' && source !== undefined && source !== null && target !== source) {
      return { merged: source, updatedCount: 1, skippedCount: 0 }
    }
  } else if (target !== source) {
    return { merged: target, updatedCount: 0, skippedCount: 1 }
  }
  return { merged: target, updatedCount: 0, skippedCount: 0 }
}

function countLeaves(obj: any): number {
  if (obj === null || obj === undefined) return 0
  if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countLeaves(item), 0)
  if (typeof obj === 'object') return Object.values(obj).reduce((sum: number, v) => sum + countLeaves(v), 0)
  return 1
}

/**
 * Flatten a nested object to dot-notation paths.
 * Arrays use numeric indices: "mainMenu.0.label"
 */
export function flattenKeys(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  if (obj === null || obj === undefined) return result

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const subPrefix = prefix ? `${prefix}.${i}` : `${i}`
      Object.assign(result, flattenKeys(obj[i], subPrefix))
    }
    return result
  }

  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const subPrefix = prefix ? `${prefix}.${key}` : key
      if (value !== null && typeof value === 'object') {
        Object.assign(result, flattenKeys(value, subPrefix))
      } else {
        result[subPrefix] = value
      }
    }
    return result
  }

  result[prefix] = obj
  return result
}

export async function initPayload() {
  const configPath = path.join(PROJECT_ROOT, 'payload.config.ts')
  process.env.PAYLOAD_CONFIG_PATH = configPath

  if (!process.env.DATABASE_URL) {
    const dotenvPath = path.join(PROJECT_ROOT, '.env')
    if (fs.existsSync(dotenvPath)) {
      const { config } = await import('dotenv')
      config({ path: dotenvPath })
    }
  }

  const { getPayload } = await import('payload')
  const configUrl = pathToFileURL(configPath).href
  const config = await import(configUrl)
  return getPayload({ config: config.default })
}

// CLI colors
export const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
}
