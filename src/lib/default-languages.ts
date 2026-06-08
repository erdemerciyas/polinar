export type DefaultLanguage = {
  code: string
  label: string
  nativeLabel: string
  shortLabel: string
  isDefault: boolean
  isActive: boolean
  isRTL: boolean
  sortOrder: number
  flagEmoji?: string
}

export const DEFAULT_LANGUAGES: DefaultLanguage[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN', isDefault: true, isActive: true, isRTL: false, sortOrder: 0, flagEmoji: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', nativeLabel: 'Türkçe', shortLabel: 'TR', isDefault: false, isActive: true, isRTL: false, sortOrder: 1, flagEmoji: '🇹🇷' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch', shortLabel: 'DE', isDefault: false, isActive: true, isRTL: false, sortOrder: 2, flagEmoji: '🇩🇪' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', shortLabel: 'AR', isDefault: false, isActive: true, isRTL: true, sortOrder: 3, flagEmoji: '🇸🇦' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', shortLabel: 'RU', isDefault: false, isActive: true, isRTL: false, sortOrder: 4, flagEmoji: '🇷🇺' },
]

export const DEFAULT_LOCALE_CODES = DEFAULT_LANGUAGES.map((l) => l.code)
