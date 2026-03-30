import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getStaticDataModules } from '@/lib/static-i18n-helpers'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = req.nextUrl.searchParams.get('locale')
    const modules = getStaticDataModules()
    const dataDir = path.join(process.cwd(), 'src', 'data')

    const moduleInfo = modules.map((mod) => {
      const modDir = path.join(dataDir, mod)
      const localeFiles = fs.readdirSync(modDir)
        .filter((f) => f.endsWith('.ts') && !['types.ts', 'index.ts'].includes(f))
        .map((f) => f.replace('.ts', ''))

      const hasLocale = locale ? localeFiles.includes(locale) : undefined

      return { name: mod, locales: localeFiles, hasLocale }
    })

    return NextResponse.json({ modules: moduleInfo })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
