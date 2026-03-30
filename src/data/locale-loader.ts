/**
 * Generic locale data loader with EN fallback.
 *
 * Usage in each data module's index.ts:
 *   import { createLocaleLoader } from '../locale-loader'
 *   import en from './en'
 *   export const getData = createLocaleLoader(en, (locale) => require(`./${locale}`))
 *
 * When a locale file (e.g. tr.ts, de.ts) exists, its values are deep-merged
 * over EN. Missing fields fall back to EN automatically.
 * If no file exists for a locale, EN is returned unchanged.
 */

export function deepMerge<T>(base: T, override: any): T {
  if (override === null || override === undefined) return base
  if (typeof base !== 'object' || base === null) return (override ?? base) as T
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base
    return base.map((item, i) =>
      i < override.length ? deepMerge(item, override[i]) : item,
    ) as T
  }
  const result: any = { ...(base as any) }
  for (const key of Object.keys(base as any)) {
    if (key in override) {
      result[key] = deepMerge((base as any)[key], override[key])
    }
  }
  return result as T
}

export function createLocaleLoader<T>(
  en: T,
  requireFn: (locale: string) => any,
): (locale: string) => T {
  const cache = new Map<string, T>()

  return (locale: string): T => {
    if (locale === 'en') return en
    if (cache.has(locale)) return cache.get(locale)!

    try {
      const mod = requireFn(locale)
      const data = mod.default || mod
      const merged = deepMerge(en, data)
      cache.set(locale, merged)
      return merged
    } catch {
      return en
    }
  }
}
