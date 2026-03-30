const SUPPORTED_GLOBAL_SLUGS = [
  'navigation',
  'footer',
  'ui-labels',
  'homepage-settings',
  'about-page-settings',
  'contact-page-settings',
  'news-page-settings',
  'site-settings',
] as const

export { SUPPORTED_GLOBAL_SLUGS }
export type GlobalSlug = (typeof SUPPORTED_GLOBAL_SLUGS)[number]

const PAYLOAD_INTERNAL_FIELDS = new Set(['id', 'createdAt', 'updatedAt', 'globalType'])

export type SyncResult = {
  global: string
  locale: string
  updated: number
  skipped: number
  errors: string[]
}

function isMediaObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  return ('filename' in obj && 'mimeType' in obj) || ('url' in obj && 'filesize' in obj)
}

function isRichTextObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  return 'root' in obj && typeof obj.root === 'object' && obj.root?.type === 'root'
}

export function stripInternals(obj: Record<string, any>): Record<string, any> {
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
          return stripInternals(item)
        }
        return item
      }).filter((v) => v !== undefined)
      if (filtered.length > 0) result[key] = filtered
    } else if (typeof value === 'object') {
      const nested = stripInternals(value)
      if (Object.keys(nested).length > 0) result[key] = nested
    } else {
      result[key] = value
    }
  }
  return result
}

function countLeaves(obj: any): number {
  if (obj === null || obj === undefined) return 0
  if (Array.isArray(obj)) return obj.reduce((s, i) => s + countLeaves(i), 0)
  if (typeof obj === 'object') return Object.values(obj).reduce((s: number, v) => s + countLeaves(v), 0)
  return 1
}

/**
 * Deep-merge source (from JSON) into target (from DB).
 *
 * Key principles:
 * - ALL target keys are preserved — source only adds/overwrites, never removes
 * - Media objects, richText objects, internal fields in target pass through untouched
 * - Empty source values ('', null, undefined) are skipped to prevent wiping DB data
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
        const r = deepMerge(target[i], source[i], force)
        merged.push(r.merged)
        updatedCount += r.updatedCount
        skippedCount += r.skippedCount
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
    const targetObj =
      typeof target === 'object' && target !== null && !Array.isArray(target) ? { ...target } : {}

    for (const key of Object.keys(source)) {
      if (PAYLOAD_INTERNAL_FIELDS.has(key)) {
        targetObj[key] = targetObj[key] ?? source[key]
        continue
      }

      if (typeof source[key] === 'object' && source[key] !== null) {
        const r = deepMerge(targetObj[key], source[key], force)
        targetObj[key] = r.merged
        updatedCount += r.updatedCount
        skippedCount += r.skippedCount
      } else {
        const sourceVal = source[key]
        if (sourceVal === '' || sourceVal === undefined || sourceVal === null) continue

        const targetVal = targetObj[key]
        const targetEmpty = targetVal === undefined || targetVal === null || targetVal === ''

        if (force || targetEmpty) {
          if (targetVal !== sourceVal) {
            targetObj[key] = sourceVal
            updatedCount++
          }
        } else {
          if (targetVal !== sourceVal) skippedCount++
        }
      }
    }

    return { merged: targetObj, updatedCount, skippedCount }
  }

  if (source === '' || source === undefined || source === null) {
    return { merged: target, updatedCount: 0, skippedCount: 0 }
  }

  const targetEmpty = target === undefined || target === null || target === ''
  if (force || targetEmpty) {
    if (target !== source) {
      return { merged: source, updatedCount: 1, skippedCount: 0 }
    }
  } else if (target !== source) {
    return { merged: target, updatedCount: 0, skippedCount: 1 }
  }
  return { merged: target, updatedCount: 0, skippedCount: 0 }
}

export async function importLocaleData(
  payload: any,
  locale: string,
  data: Record<string, any>,
  force: boolean,
): Promise<SyncResult[]> {
  const results: SyncResult[] = []

  for (const slug of SUPPORTED_GLOBAL_SLUGS) {
    const sourceData = data[slug]
    if (!sourceData) continue

    const result: SyncResult = { global: slug, locale, updated: 0, skipped: 0, errors: [] }

    try {
      const current = await payload.findGlobal({ slug, locale: locale as any })
      const raw = current as Record<string, any>
      const { merged, updatedCount, skippedCount } = deepMerge(raw, sourceData, force)

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

  return results
}

export async function exportLocaleData(
  payload: any,
  locale: string,
): Promise<Record<string, any>> {
  const localeData: Record<string, any> = {}

  for (const slug of SUPPORTED_GLOBAL_SLUGS) {
    try {
      const raw = await payload.findGlobal({ slug, locale: locale as any })
      localeData[slug] = stripInternals(raw as Record<string, any>)
    } catch {
      // skip globals that fail
    }
  }

  return sortKeysDeep(localeData)
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

export function summarizeResults(results: SyncResult[]) {
  const totalUpdated = results.reduce((s, r) => s + r.updated, 0)
  const totalSkipped = results.reduce((s, r) => s + r.skipped, 0)
  const totalErrors = results.reduce((s, r) => s + r.errors.length, 0)
  return { totalUpdated, totalSkipped, totalErrors, success: totalErrors === 0 }
}
