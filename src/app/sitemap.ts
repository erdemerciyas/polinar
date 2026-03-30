import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import localesConfig from '@/lib/locales.json'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.polinar.com.tr'
const locales = localesConfig.locales.map((l) => l.code)
const defaultLocale = localesConfig.defaultLocale || 'en'

function buildAlternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const staticPages = ['', '/about', '/news', '/contact', '/our-business']
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: buildAlternates(page),
      })
    }
  }

  const businessSlugs = ['injection-moulds', 'machinery', 'plastic-test-equipment']
  for (const slug of businessSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/our-business/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: buildAlternates(`/our-business/${slug}`),
      })
    }
  }

  try {
    const payload = await getPayloadClient()

    const news = await payload.find({
      collection: 'news',
      where: { status: { equals: 'published' } },
      limit: 100,
    })
    for (const article of news.docs) {
      const slug = (article as any).slug
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/news/${slug}`,
          lastModified: new Date((article as any).updatedAt || Date.now()),
          changeFrequency: 'yearly',
          priority: 0.6,
          alternates: buildAlternates(`/news/${slug}`),
        })
      }
    }

    const pages = await payload.find({ collection: 'pages', limit: 100 })
    for (const page of pages.docs) {
      const slug = (page as any).slug
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/${slug}`,
          lastModified: new Date((page as any).updatedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: buildAlternates(`/${slug}`),
        })
      }
    }
  } catch {
    // CMS not available — return static pages only
  }

  return entries
}
