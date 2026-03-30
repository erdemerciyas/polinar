import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || 'en'

  try {
    const payload = await getPayloadClient()
    const labels = await payload.findGlobal({ slug: 'ui-labels', locale: locale as any })
    return NextResponse.json(labels)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
