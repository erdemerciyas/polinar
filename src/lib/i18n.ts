import { DEFAULT_LANGUAGES, DEFAULT_LOCALE_CODES } from '@/lib/default-languages'

// Static fallback values (used by middleware and as defaults)
export const fallbackLocales = DEFAULT_LOCALE_CODES
export type Locale = string
export const defaultLocale = 'en'

// Legacy exports for backward compatibility
export const supportedLocales = fallbackLocales
export const localeLabels: Record<string, string> = Object.fromEntries(
  DEFAULT_LANGUAGES.map((l) => [l.code, l.shortLabel]),
)

export function isValidLocale(locale: string): boolean {
  // Accept any 2-5 char lowercase alpha string as potentially valid
  return /^[a-z]{2,5}$/.test(locale)
}

export function getLocaleFromPathname(pathname: string): string | null {
  const segment = pathname.split('/')[1]
  return isValidLocale(segment) ? segment : null
}

// Language type matching the Languages collection
export type Language = {
  id: string
  code: string
  label: string
  nativeLabel: string
  shortLabel: string
  isDefault: boolean
  isActive: boolean
  isRTL: boolean
  flagEmoji?: string
  sortOrder: number
}

// Server-side: fetch active languages directly from Payload
export async function getActiveLanguages(): Promise<Language[]> {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@/../payload.config')
    const payload = await getPayload({ config: config.default })

    const result = await payload.find({
      collection: 'languages',
      where: { isActive: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
    })

    if (result.docs.length === 0) {
      return DEFAULT_LANGUAGES.map((lang, i) => ({
        id: String(i + 1),
        ...lang,
        flagEmoji: lang.flagEmoji,
      }))
    }

    return result.docs.map((doc: any) => ({
      id: String(doc.id),
      code: doc.code,
      label: doc.label,
      nativeLabel: doc.nativeLabel,
      shortLabel: doc.shortLabel,
      isDefault: doc.isDefault ?? false,
      isActive: doc.isActive ?? true,
      isRTL: doc.isRTL ?? false,
      flagEmoji: doc.flagEmoji || undefined,
      sortOrder: doc.sortOrder ?? 0,
    }))
  } catch (e) {
    console.error("GET ACTIVE LANGUAGES ERROR:", e)
    return DEFAULT_LANGUAGES.map((lang, i) => ({
      id: String(i + 1),
      ...lang,
      flagEmoji: lang.flagEmoji,
    }))
  }
}

// Server-side: get the default language code
export async function getDefaultLanguageCode(): Promise<string> {
  const languages = await getActiveLanguages()
  const defaultLang = languages.find(l => l.isDefault)
  return defaultLang?.code || languages[0]?.code || 'en'
}

// Server-side: get active locale codes as string array
export async function getActiveLocaleCodes(): Promise<string[]> {
  const languages = await getActiveLanguages()
  return languages.map(l => l.code)
}

// Server-side: check if a locale code is active
export async function isActiveLocale(code: string): Promise<boolean> {
  const codes = await getActiveLocaleCodes()
  return codes.includes(code)
}
