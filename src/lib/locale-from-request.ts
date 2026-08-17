import { cookies, headers } from 'next/headers'
import { DEFAULT_LANGUAGES } from '@/lib/default-languages'
import { DEFAULT_LOCALE_CODE, isKnownLocale } from '@/lib/locale-config'

export async function getRequestLocale(): Promise<{ locale: string; dir: 'ltr' | 'rtl' }> {
  const headersList = await headers()
  const cookieStore = await cookies()

  const headerLocale = headersList.get('x-polinar-locale')
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

  const locale = isKnownLocale(headerLocale)
    ? headerLocale
    : isKnownLocale(cookieLocale)
      ? cookieLocale
      : DEFAULT_LOCALE_CODE

  const lang = DEFAULT_LANGUAGES.find((l) => l.code === locale)
  return { locale, dir: lang?.isRTL ? 'rtl' : 'ltr' }
}
