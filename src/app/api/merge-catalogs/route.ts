import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

const ALLOWED_HOST = 'res.cloudinary.com'

export async function POST(req: NextRequest) {
  try {
    const { urls, filename } = (await req.json()) as { urls: string[]; filename?: string }

    if (!Array.isArray(urls) || urls.length === 0 || urls.length > 50) {
      return NextResponse.json({ error: 'Invalid urls array' }, { status: 400 })
    }

    for (const url of urls) {
      try {
        const parsed = new URL(url)
        if (parsed.hostname !== ALLOWED_HOST || !parsed.pathname.endsWith('.pdf')) {
          return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
    }

    const merged = await PDFDocument.create()

    for (const url of urls) {
      const res = await fetch(url)
      if (!res.ok) continue
      const bytes = await res.arrayBuffer()
      try {
        const src = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(src, src.getPageIndices())
        for (const page of pages) merged.addPage(page)
      } catch {
        // skip corrupt PDFs
      }
    }

    if (merged.getPageCount() === 0) {
      return NextResponse.json({ error: 'No pages could be merged' }, { status: 502 })
    }

    const pdfBytes = await merged.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'all-catalogs'}.pdf"`,
        'Content-Length': String(pdfBytes.byteLength),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[merge-catalogs]', err)
    return NextResponse.json({ error: 'Merge failed' }, { status: 500 })
  }
}
