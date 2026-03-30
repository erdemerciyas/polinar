import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { generateSEO, newsArticleJsonLd, breadcrumbJsonLd, JsonLd, SITE_URL } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'news', where: { status: { equals: 'published' } }, limit: 100 })
    const locales = (await import('@/lib/locales.json')).default.locales.map((l: { code: string }) => l.code)
    for (const doc of result.docs) {
      for (const locale of locales) {
        params.push({ locale, slug: (doc as any).slug })
      }
    }
  } catch {}
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  let article: any = null
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug } },
      locale: locale as any,
      limit: 1,
    })
    article = result.docs[0]
  } catch {}

  if (!article) return {}

  const meta = article.meta || {}
  return generateSEO({
    title: meta.title || article.title,
    description: meta.description || article.excerpt?.slice(0, 160) || article.title,
    locale,
    path: `/news/${slug}`,
    image: meta.image?.url || article.featuredImage?.url,
    type: 'article',
  })
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params

  let article: any = null
  let newsSettings: any = null
  try {
    const payload = await getPayloadClient()
    const [result, settings] = await Promise.all([
      payload.find({
        collection: 'news',
        where: { slug: { equals: slug } },
        locale: locale as any,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'news-page-settings', locale: locale as any }),
    ])
    article = result.docs[0]
    newsSettings = settings
  } catch {}

  if (!article) return notFound()

  const labels = newsSettings?.labels || {}

  return (
    <>
      <JsonLd data={newsArticleJsonLd({
        title: article.title,
        description: article.excerpt || article.title,
        image: article.featuredImage?.url,
        datePublished: article.date || article.createdAt,
        dateModified: article.updatedAt,
        locale,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: labels.breadcrumb || 'News', url: `${SITE_URL}/${locale}/news` },
        { name: article.title, url: `${SITE_URL}/${locale}/news/${slug}` },
      ])} />
      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-2">
            <Link href={`/${locale}/news`} className="hover:text-white transition-colors">
              {labels.breadcrumb || ''}
            </Link>
          </p>
          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl tracking-tight-heading">
            {article.title}
          </h1>
          {article.date && (
            <p className="mt-3 text-white/60 font-body text-sm">
              {new Date(article.date).toLocaleDateString(locale, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          {article.featuredImage?.url && (
            <div className="relative mb-8 rounded-[3px] overflow-hidden h-[400px]">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alt || article.title}
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                priority
                className="object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <p className="text-lg text-[#555] font-body leading-relaxed-body mb-8 border-l-4 border-polinar-red pl-4">
              {article.excerpt}
            </p>
          )}

          <div className="prose max-w-none font-body text-[#555] leading-relaxed-body">
            <p>{labels.cmsPlaceholder || ''}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href={`/${locale}/news`} className="btn-outline inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {labels.allNews || ''}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
