import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getStaticLabels } from '@/data/static-labels'
import { generateSEO, getSiteDefaultDescription, websiteJsonLd, JsonLd } from '@/lib/seo'
import { HeroSlider } from '@/components/HeroSlider'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const labels = getStaticLabels(locale)
  let homepageData: any = null
  try {
    const payload = await getPayloadClient()
    homepageData = await payload.findGlobal({ slug: 'homepage-settings', locale: locale as any })
  } catch {}

  const seo = homepageData?.seo || {}
  const defaultDesc = await getSiteDefaultDescription(locale)
  return generateSEO({
    title: seo.title || labels.seo.defaultTitle,
    description: seo.description || homepageData?.coreValues?.description?.slice(0, 160) || defaultDesc,
    locale,
    path: '',
    image: seo.image?.url,
  })
}

function BusinessIcon({ name }: { name: string }) {
  const cls = 'w-8 h-8'
  switch (name) {
    case 'moulds':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    case 'machinery':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    case 'testing':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94 2.06a2.25 2.25 0 0 0 2.036 3.19h11.808a2.25 2.25 0 0 0 2.036-3.19L19 14.5m-14 0h14" />
        </svg>
      )
    default:
      return null
  }
}

const categoryColors: Record<string, { bg: string; text: string; hoverBg: string; hoverBorder: string }> = {
  moulds: {
    bg: 'bg-moulds-gold/10',
    text: 'text-moulds-gold',
    hoverBg: 'group-hover:bg-moulds-gold',
    hoverBorder: 'hover:border-moulds-gold/20',
  },
  machinery: {
    bg: 'bg-polinar-red/10',
    text: 'text-polinar-red',
    hoverBg: 'group-hover:bg-polinar-red',
    hoverBorder: 'hover:border-polinar-red/20',
  },
  testing: {
    bg: 'bg-pte-cyan/10',
    text: 'text-pte-cyan',
    hoverBg: 'group-hover:bg-pte-cyan',
    hoverBorder: 'hover:border-pte-cyan/20',
  },
}

const defaultCategoryColor = categoryColors.machinery

const categoryHeroImages: Record<string, string> = {
  moulds: '/images/moulds-hero.jpg',
  machinery: '/images/machinery-hero.jpg',
  testing: '/images/testing-hero.jpg',
}

type Props = {
  params: Promise<{ locale: string }>
}

export const revalidate = 3600

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  let homepageData: any = null
  let navData: any = null
  let uiLabels: any = null
  let news = null

  try {
    const payload = await getPayloadClient()

    ;[homepageData, navData, uiLabels, news] = await Promise.all([
      payload.findGlobal({ slug: 'homepage-settings', locale: locale as any }),
      payload.findGlobal({ slug: 'navigation', locale: locale as any }),
      payload.findGlobal({ slug: 'ui-labels', locale: locale as any }),
      payload.find({
        collection: 'news',
        locale: locale as any,
        where: { status: { equals: 'published' } },
        sort: '-date',
        limit: 3,
      }),
    ])
  } catch {}

  const megaMenuItem = navData?.mainMenu?.find((item: any) => item.type === 'mega')
  const businessCards: Array<{
    icon: string
    title: string
    description: string
    href: string
    image: { url?: string; alt?: string } | null
  }> = []

  if (megaMenuItem) {
    for (const col of megaMenuItem.megaMenuColumns || []) {
      if (col.columnType === 'links') {
        for (const link of col.links || []) {
          businessCards.push({
            icon: link.icon || '',
            title: link.label,
            description: link.description || '',
            href: link.url.startsWith('http') ? link.url : `/${locale}${link.url}`,
            image: link.image ?? null,
          })
        }
      }
    }
  }

  const aboutPreview = homepageData?.aboutPreviewLabels || {}
  const businessSection = homepageData?.businessSection || {}
  const newsSection = homepageData?.newsSection || {}

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <HeroSlider
        slides={
          homepageData?.heroSlides?.length
            ? homepageData.heroSlides.map((s: any) => ({
                title: s.title,
                subtitle: s.subtitle,
                backgroundImage: s.backgroundImage,
                ctaLabel: s.ctaLabel,
                ctaLink: s.ctaLink,
                overlayOpacity: s.overlayOpacity,
                textAlignment: s.textAlignment,
                textPosition: s.textPosition,
                titleSize: s.titleSize,
                animateText: s.animateText,
                textAnimation: s.textAnimation,
              }))
            : [
                {
                  title: 'DURABLE MOULDS AND CUSTOMIZED PRODUCTS',
                  subtitle: 'High quality plastic injection moulds for the global market',
                },
              ]
        }
        settings={homepageData?.sliderSettings ?? undefined}
        locale={locale}
      />

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold italic text-polinar-red text-2xl sm:text-3xl tracking-tight-heading">
            {homepageData?.coreValues?.title || ''}
          </h2>
          <div className="divider-asymmetric justify-center mt-4 mb-6">
            <span className="div-red"></span>
            <span className="div-gray"></span>
          </div>
          <p className="max-w-3xl mx-auto text-[#555] font-body text-base leading-body">
            {homepageData?.coreValues?.description || ''}
          </p>
        </div>
      </section>

      {/* Our Business */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-1">
              {businessSection.sectionLabel || ''}
            </p>
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
              {businessSection.sectionTitle || ''}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-red"></span>
              <span className="div-gray"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessCards.map((card) => {
              const colors = categoryColors[card.icon] || defaultCategoryColor
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group bg-white rounded-lg overflow-hidden border border-gray-100 ${colors.hoverBorder} hover:shadow-xl transition-all duration-300`}
                >
                  <div className="relative h-[220px] bg-[#f0f1f3] overflow-hidden">
                    {(card.image?.url || categoryHeroImages[card.icon]) ? (
                      <Image
                        src={card.image?.url || categoryHeroImages[card.icon]}
                        alt={card.image?.alt || card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center ${colors.hoverBg} group-hover:text-white transition-colors duration-300`}>
                        <BusinessIcon name={card.icon} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-bold text-heading text-lg mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#666] font-body leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <span className={`${colors.text} font-display font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all`}>
                      {uiLabels?.learnMore || ''}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-1">
                {aboutPreview.label || ''}
              </p>
              <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
                {aboutPreview.title || ''}
              </h2>
              <div className="divider-asymmetric">
                <span className="div-red"></span>
                <span className="div-gray"></span>
              </div>
              <p className="text-[#555] font-body text-base leading-relaxed-body mb-4">
                {aboutPreview.description || ''}
              </p>
              <Link href={`/${locale}/about`} className="btn-outline">
                {uiLabels?.readMore || ''}
              </Link>
            </div>
            <div className="relative aspect-[640/420]">
              <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent mix-blend-multiply rounded-[3px] z-10"></div>
              <Image
                src="https://placehold.co/640x420/E8E8E8/999?text=Factory"
                alt="Polinar Factory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-[3px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider">
              {newsSection.label || ''}
            </p>
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
              {newsSection.title || ''}
            </h2>
            <div className="divider-asymmetric">
              <span className="div-red"></span>
              <span className="div-gray"></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news?.docs?.map((item: any) => (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.slug}`}
                className="bg-white rounded-[3px] overflow-hidden product-card block"
              >
                <div className="relative h-[200px]">
                  <Image
                    src={item.featuredImage?.url || `https://placehold.co/400x220/E8E8E8/999?text=News`}
                    alt={item.featuredImage?.alt || item.title || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block bg-polinar-red text-white text-xs font-display font-bold px-3 py-1 rounded-[2px] mb-3">
                    {item.year || new Date(item.date).getFullYear()}
                  </span>
                  <h3 className="font-display font-bold text-heading text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-[#666] font-body leading-body">{item.excerpt}</p>
                </div>
              </Link>
            )) || (
              <p className="col-span-full text-center text-[#999]">
                {newsSection.empty || ''}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
