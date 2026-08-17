import { notFound } from 'next/navigation'
import { getActiveLanguages } from '@/lib/i18n'
import { organizationJsonLd, JsonLd } from '@/lib/seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  const languages = await getActiveLanguages()
  return languages.filter((language) => language.isActive).map((language) => ({
    locale: language.code,
  }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  const languages = await getActiveLanguages()
  const currentLang = languages.find(l => l.code === locale)

  if (!currentLang) {
    notFound()
  }

  let navData: any = null
  let uiLabels: any = null
  let footerData: any = null
  let siteSettings: any = null
  try {
    const { getDictionary } = await import('@/lib/getDictionary')
    const dictionary = await getDictionary(locale)

    navData = dictionary['navigation'] || null
    uiLabels = dictionary['ui-labels'] || null
    footerData = dictionary['footer'] || null
    siteSettings = dictionary['site-settings'] || null
  } catch (e) {
    console.error('Failed to load dictionary:', e)
  }

  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <Header
        locale={locale}
        languages={languages}
        navData={navData}
        commonLabels={uiLabels}
      />
      <main>
        {children}
      </main>
      <Footer data={footerData} locale={locale} />
      <ChatWidget labels={siteSettings?.chatbot?.labels} />
    </>
  )
}
