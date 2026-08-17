import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE_CODE, isKnownLocale, KNOWN_LOCALE_CODES } from '@/lib/locale-config'

const PUBLIC_PATHS = ['/admin', '/api', '/_next', '/media', '/brand_assets', '/favicon']
const knownLocales = new Set(KNOWN_LOCALE_CODES)

function withLocale(request: NextRequest, locale: string): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-polinar-locale', locale)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })

  return response
}

function detectPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (isKnownLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('Accept-Language') || ''
  const browserLangs = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().split('-')[0])

  for (const lang of browserLangs) {
    if (knownLocales.has(lang)) {
      return lang
    }
  }

  return DEFAULT_LOCALE_CODE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.includes('.')) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split('/')[1]

  if (isKnownLocale(firstSegment)) {
    return withLocale(request, firstSegment)
  }

  const preferred = detectPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
