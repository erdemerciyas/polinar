import type { Metadata } from 'next'
import { getStaticLabels } from '@/data/static-labels'
import { getPayloadClient } from '@/lib/payload'
import localesConfig from '@/lib/locales.json'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.polinar.com.tr'

const allLocaleCodes = localesConfig.locales.map((l) => l.code)
const defaultLocale = localesConfig.defaultLocale || 'en'

export async function getSiteDefaultDescription(locale: string): Promise<string> {
  const labels = getStaticLabels(locale)
  try {
    const payload = await getPayloadClient()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings', locale: locale as any })
    return (siteSettings as any)?.defaultSeoDescription || labels.seo.defaultDescription
  } catch {
    return labels.seo.defaultDescription
  }
}

const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  tr: 'tr_TR',
  de: 'de_DE',
  ar: 'ar_SA',
}

type SEOArgs = {
  title: string
  description: string
  locale: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function alternateLanguages(path: string) {
  const languages: Record<string, string> = {}
  for (const code of allLocaleCodes) {
    languages[code] = `${SITE_URL}/${code}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`
  return languages
}

export function generateSEO({ title, description, locale, path, image, type = 'website', noIndex }: SEOArgs): Metadata {
  const labels = getStaticLabels(locale)
  const fullTitle = `${title}${labels.seo.titleSuffix}`
  const url = `${SITE_URL}/${locale}${path}`
  const ogImage = image || `${SITE_URL}/brand_assets/og-default.jpg`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: labels.seo.siteName,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: ogLocaleMap[locale] || 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function organizationJsonLd(locale: string) {
  const labels = getStaticLabels(locale)
  const { company, seo } = labels

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seo.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand_assets/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.phones[0],
      contactType: seo.contactType,
      email: company.email,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'İkitelli OSB Eskoop San. Sit. D Blok No: 34',
      addressLocality: 'Başakşehir',
      addressRegion: 'İstanbul',
      postalCode: '34306',
      addressCountry: 'TR',
    },
    sameAs: company.socialLinks.map((link) => link.url),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Polinar',
    url: SITE_URL,
  }
}

export function newsArticleJsonLd(article: {
  title: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  locale: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_URL}/brand_assets/og-default.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Polinar',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand_assets/logo.png` },
    },
  }
}

export function localBusinessJsonLd(locale: string) {
  const labels = getStaticLabels(locale)
  const { company, seo } = labels

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: seo.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand_assets/logo.png`,
    telephone: company.phones[0],
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'İkitelli OSB Eskoop San. Sit. D Blok No: 34',
      addressLocality: 'Başakşehir',
      addressRegion: 'İstanbul',
      postalCode: '34306',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0865,
      longitude: 28.7817,
    },
    sameAs: company.socialLinks.map((link) => link.url),
  }
}

export function productJsonLd(locale: string, product: { name: string; description?: string; image?: string; slug: string }) {
  const labels = getStaticLabels(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.image || `${SITE_URL}/brand_assets/logo.png`,
    manufacturer: {
      '@type': 'Organization',
      name: labels.seo.siteName,
    },
  }
}

export { SITE_URL }
