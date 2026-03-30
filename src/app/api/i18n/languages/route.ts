import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'languages',
      where: { isActive: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
    })

    const languages = result.docs.map((doc: any) => ({
      code: doc.code,
      label: doc.label,
      nativeLabel: doc.nativeLabel,
      shortLabel: doc.shortLabel,
      flagEmoji: doc.flagEmoji || '',
      isDefault: doc.isDefault ?? false,
    }))

    return NextResponse.json({ languages })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
