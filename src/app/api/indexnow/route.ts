import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const INDEXNOW_URL = 'https://api.indexnow.org/Submit'

async function getIndexNowSettings() {
  try {
    const payload = await getPayloadClient()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const gi = (siteSettings as any)?.googleIntegration?.indexNow
    return {
      apiKey: gi?.apiKey || process.env.INDEXNOW_API_KEY || '',
      enabled: gi?.enabled !== false,
    }
  } catch {
    return {
      apiKey: process.env.INDEXNOW_API_KEY || '',
      enabled: true,
    }
  }
}

export async function POST(request: Request) {
  const { urls, url } = await request.json()
  const toSubmit = urls || (url ? [url] : [])

  if (!toSubmit.length) {
    return NextResponse.json({ ok: false })
  }

  const { apiKey, enabled } = await getIndexNowSettings()

  if (!enabled || !apiKey) {
    return NextResponse.json({ ok: false, reason: 'IndexNow disabled or no API key' })
  }

  const host = process.env.NEXT_PUBLIC_SITE_URL
  if (!host) {
    return NextResponse.json({ ok: false, error: 'NEXT_PUBLIC_SITE_URL not configured' })
  }

  const payload = {
    host,
    key: apiKey,
    keyLocation: `${host}/${apiKey}.txt`,
    urlList: toSubmit,
  }

  try {
    await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // IndexNow submission failed — non-critical
  }

  return NextResponse.json({ ok: true, submitted: toSubmit.length })
}