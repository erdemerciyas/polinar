import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { importStaticLocaleData } from '@/lib/static-i18n-helpers'

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
        { error: 'Request body must include locale and data' },
        { status: 400 },
      )
    }

    const { locale, data } = body

    if (locale === 'en') {
      return NextResponse.json(
        { error: 'Cannot overwrite English (source of truth). Edit en.ts files directly.' },
        { status: 400 },
      )
    }

    const results = importStaticLocaleData(locale, data)

    const created = results.filter((r) => r.status === 'created').length
    const updated = results.filter((r) => r.status === 'updated').length
    const errors = results.filter((r) => r.status === 'error')

    return NextResponse.json({
      success: errors.length === 0,
      created,
      updated,
      totalErrors: errors.length,
      results,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
