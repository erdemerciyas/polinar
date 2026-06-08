import { cookies, headers } from 'next/headers'
import { DEFAULT_LANGUAGES } from '@/lib/default-languages'
import localesConfig from '@/lib/locales.json'

export async function getRequestLocale(): Promise<{ locale: string; dir: 'ltr' | 'rtl' }> {
  const headersList = await headers()
  const cookieStore = await cookies()

  const locale =
    headersList.get('x-polinar-locale') ||
    cookieStore.get('NEXT_LOCALE')?.value ||
    localesConfig.defaultLocale ||
    'en'

  const lang = DEFAULT_LANGUAGES.find((l) => l.code === locale)
  return { locale, dir: lang?.isRTL ? 'rtl' : 'ltr' }
}
