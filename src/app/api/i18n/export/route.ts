import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { exportLocaleData } from '@/lib/i18n-helpers'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = req.nextUrl.searchParams.get('locale')
    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 })
    }

    const data = await exportLocaleData(payload, locale)

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${locale}.json"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
