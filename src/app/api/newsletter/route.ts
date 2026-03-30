import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: { name: name || '', email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
