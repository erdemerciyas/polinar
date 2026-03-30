import type { Metadata } from 'next'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
