import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'

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
  const gscToken = await getGscToken()

  return (
    <html>
      <head>
        {gscToken && (
          <meta name="google-site-verification" content={gscToken} />
        )}
      </head>
      {children}
    </html>
  )
}