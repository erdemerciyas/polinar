import { notFound } from 'next/navigation'
import { getActiveLanguages } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'
import { organizationJsonLd, JsonLd } from '@/lib/seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppCTABar } from '@/components/layout/WhatsAppCTABar'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { fontClasses } from '@/lib/fonts'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  const languages = await getActiveLanguages()
  const currentLang = languages.find(l => l.code === locale)

  if (!currentLang) {
    notFound()
  }

  const isRTL = currentLang.isRTL
  const dir = isRTL ? 'rtl' : 'ltr'

  let navData: any = null
  let uiLabels: any = null
  let footerData: any = null
  let siteSettings: any = null
  try {
    const payload = await getPayloadClient()
    ;[navData, uiLabels, footerData, siteSettings] = await Promise.all([
      payload.findGlobal({ slug: 'navigation', locale: locale as any }),
      payload.findGlobal({ slug: 'ui-labels', locale: locale as any }),
      payload.findGlobal({ slug: 'footer', locale: locale as any }),
      payload.findGlobal({ slug: 'site-settings', locale: locale as any }),
    ])
  } catch {}

  return (
    <html lang={locale} dir={dir} className={fontClasses}>
      <head>
        <JsonLd data={organizationJsonLd(locale)} />
      </head>
      <body className="font-body text-heading bg-white antialiased">
        <Header
          locale={locale}
          languages={languages}
          navData={navData}
          commonLabels={uiLabels}
        />
        <main className="pt-[72px]">
          {children}
        </main>
        <WhatsAppCTABar message={siteSettings?.whatsappCTA?.text} locale={locale} />
        <Footer data={footerData} locale={locale} />
        <ChatWidget labels={siteSettings?.chatbot?.labels} />
      </body>
    </html>
  )
}
