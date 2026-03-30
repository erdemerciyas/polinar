import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { generateSEO, getSiteDefaultDescription } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  let newsSettings: any = null
  try {
    const payload = await getPayloadClient()
    newsSettings = await payload.findGlobal({ slug: 'news-page-settings', locale: locale as any })
  } catch {}

  const seo = newsSettings?.seo || {}
  const defaultDesc = await getSiteDefaultDescription(locale)
  const title = seo.title || newsSettings?.hero?.title || 'News'
  return generateSEO({
    title,
    description: seo.description || defaultDesc,
    locale,
    path: '/news',
    image: seo.image?.url,
  })
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params

  let news: any[] = []
  let newsSettings: any = null
  try {
    const payload = await getPayloadClient()
    const [result, settings] = await Promise.all([
      payload.find({
        collection: 'news',
        locale: locale as any,
        where: { status: { equals: 'published' } },
        sort: '-date',
        limit: 50,
      }),
      payload.findGlobal({ slug: 'news-page-settings', locale: locale as any }),
    ])
    news = result.docs
    newsSettings = settings
  } catch {}

  const hero = newsSettings?.hero || {}
  const labels = newsSettings?.labels || {}

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-2">
            {hero.label || ''}
          </p>
          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight-heading">
            {hero.title || ''}
          </h1>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug}`}
                  className="bg-white rounded-[3px] overflow-hidden product-card block"
                >
                  <div className="relative h-[220px]">
                    <Image
                      src={item.featuredImage?.url || `https://placehold.co/400x220/E8E8E8/999?text=News`}
                      alt={item.featuredImage?.alt || item.title || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block bg-polinar-red text-white text-xs font-display font-bold px-3 py-1 rounded-[2px]">
                        {item.year || (item.date ? new Date(item.date).getFullYear() : '')}
                      </span>
                      {item.date && (
                        <span className="text-xs text-[#999] font-body">
                          {new Date(item.date).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-heading text-base mb-2">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-sm text-[#666] font-body leading-body line-clamp-3">{item.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-[#999] font-body py-8">
                {labels.empty || ''}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
