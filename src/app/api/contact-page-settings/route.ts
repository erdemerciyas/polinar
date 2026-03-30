import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || 'en'

  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'contact-page-settings', locale: locale as any })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
