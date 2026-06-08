import type { Metadata } from 'next'
import { inject } from '@vercel/analytics'
import { getPayloadClient } from '@/lib/payload'
import { getRequestLocale } from '@/lib/locale-from-request'
import { fontClasses } from '@/lib/fonts'
import './globals.css'

inject()

const SITE_NAME = 'Polinar'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.polinar.com.tr'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Plastic injection moulds for pipe & fittings',
}

const GSC_VERIFICATION_TOKEN_FALLBACK = 'MlaIcOdliTsE2R6Lr70WUpiPMfc0km8sxe6hSNDXVVQ'

async function getGscToken(): Promise<string | null> {
  try {
    const payload = await getPayloadClient()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    return (siteSettings as any)?.googleIntegration?.gscVerificationToken || GSC_VERIFICATION_TOKEN_FALLBACK
  } catch {
    return GSC_VERIFICATION_TOKEN_FALLBACK
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [gscToken, { locale, dir }] = await Promise.all([getGscToken(), getRequestLocale()])

  return (
    <html lang={locale} dir={dir} className={fontClasses} suppressHydrationWarning>
      <head>
        {gscToken && (
          <meta name="google-site-verification" content={gscToken} />
        )}
      </head>
      <body className="font-body text-heading bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
