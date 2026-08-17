import localesConfig from '@/lib/locales.json'

export const KNOWN_LOCALE_CODES = localesConfig.locales.map((locale) => locale.code)
export const DEFAULT_LOCALE_CODE = localesConfig.defaultLocale || 'en'

export function isKnownLocale(locale: string | null | undefined): locale is string {
  return Boolean(locale && KNOWN_LOCALE_CODES.includes(locale))
}
