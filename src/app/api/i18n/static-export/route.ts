import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { exportStaticLocaleData, getStaticDataModules } from '@/lib/static-i18n-helpers'

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

    const data = exportStaticLocaleData(locale)
    const modules = getStaticDataModules()
    const availableModules = Object.keys(data)

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="static-${locale}.json"`,
        'X-Modules-Total': String(modules.length),
        'X-Modules-Exported': String(availableModules.length),
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
