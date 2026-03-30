import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { importLocaleData, summarizeResults } from '@/lib/i18n-helpers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body || !body.locale || !body.data) {
      return NextResponse.json(
        { error: 'Missing required fields: locale, data' },
        { status: 400 },
      )
    }

    const { locale, data, force = false } = body
    const results = await importLocaleData(payload, locale, data, force)
    const summary = summarizeResults(results)

    return NextResponse.json({ ...summary, results })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
