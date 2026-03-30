import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const SITE_HOSTNAME = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'www.polinar.com.tr' },
      ...(SITE_HOSTNAME && SITE_HOSTNAME !== 'www.polinar.com.tr'
        ? [{ protocol: 'https' as const, hostname: SITE_HOSTNAME }]
        : []),
    ],
  },
}

export default withPayload(nextConfig)
