import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'
import { importLocaleData, summarizeResults } from '@/lib/i18n-helpers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const force = body?.force === true
    const targetLocale: string | undefined = body?.locale

    const localesConfigPath = path.join(process.cwd(), 'src', 'lib', 'locales.json')
    const localesConfig = JSON.parse(fs.readFileSync(localesConfigPath, 'utf-8'))
    const allLocaleCodes: string[] = localesConfig.locales.map((l: any) => l.code)

    const localeCodes = targetLocale ? [targetLocale] : allLocaleCodes
    const localesDir = path.join(process.cwd(), 'public', 'locales')
    const allResults = []

    for (const locale of localeCodes) {
      const filePath = path.join(localesDir, `${locale}.json`)
      if (!fs.existsSync(filePath)) continue

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const results = await importLocaleData(payload, locale, fileData, force)
      allResults.push(...results)
    }

    const summary = summarizeResults(allResults)
    return NextResponse.json({ ...summary, results: allResults })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
