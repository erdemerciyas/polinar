import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { exportLocaleData } from '@/lib/i18n-helpers'
import { exportStaticLocaleData } from '@/lib/static-i18n-helpers'
import { clearDictionaryCache } from '@/lib/getDictionary'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Authenticate admin user
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Default master locale is English
    const locale = 'en'

    // Get Globals Data (Navigation, Footer, etc.)
    const globalsData = await exportLocaleData(payload, locale)
    
    // Get Static Data (from src/data/*)
    const staticData = exportStaticLocaleData(locale)

    // Combine them into a single master dictionary
    const masterData = {
      ...globalsData,
      "static-content": staticData
    }

    // Clear in-memory cache so the next page load re-reads the new JSON
    clearDictionaryCache()

    return new NextResponse(JSON.stringify(masterData, null, 2), {
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
