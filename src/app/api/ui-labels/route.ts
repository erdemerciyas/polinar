import { NextRequest, NextResponse } from 'next/server'
import { getDictionary } from '@/lib/getDictionary'

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || 'en'

  try {
    const dictionary = await getDictionary(locale)
    return NextResponse.json(dictionary['ui-labels'] || {})
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
