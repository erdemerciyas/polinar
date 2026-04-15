import Link from 'next/link'
import Image from 'next/image'
import { HeroSlider } from '@/components/HeroSlider'

type Block = {
  blockType: string
  [key: string]: any
}

function HeroSliderBlock({ block, locale }: { block: Block; locale: string }) {
  if (!block.slides?.length) return null
  return <HeroSlider slides={block.slides} locale={locale} />
}

function RichTextBlock({ block }: { block: Block }) {
  // Payload rich text comes as serialized lexical nodes — render as HTML
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: block.content_html || '' }} />
      </div>
    </section>
  )
}

function ImageGalleryBlock({ block }: { block: Block }) {
  const cols = block.columns || '3'
  const gridClass = cols === '2' ? 'grid-cols-2' : cols === '4' ? 'grid-cols-4' : 'grid-cols-3'
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && (
          <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading text-center mb-8">
            {block.title}
          </h2>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:${gridClass} gap-4`}>
          {block.images?.map((item: any, idx: number) => (
            <div key={idx} className="gallery-item overflow-hidden rounded-card">
              <img
                src={item.image?.url || ''}
                alt={item.caption || ''}
                className="w-full h-[250px] object-cover"
              />
              {item.caption && (
                <p className="text-sm text-body-secondary font-body mt-2 text-center">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductGridBlock({ block, locale }: { block: Block; locale: string }) {
  return (
    <section className="py-24 lg:py-32 bg-gray-light">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && (
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">{block.title}</h2>
            <div className="divider-asymmetric justify-center"><span className="div-mustard"></span><span className="div-gray"></span></div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.products?.map((product: any) => (
            <Link key={product.id || product.slug} href={`/${locale}/products/${product.slug}`} className="product-card bg-white block">
              <div className="relative h-[200px]">
                <Image src={product.featuredImage?.url || `https://placehold.co/400x300/E8E8E8/999?text=Product`} alt={product.name || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display font-bold text-heading text-sm">{product.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactFormBlock({ block, locale }: { block: Block; locale: string }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl mb-8">{block.title}</h2>}
        {block.description && <p className="text-body-muted font-body mb-8">{block.description}</p>}
        {block.showMap && block.mapEmbedUrl && (
          <iframe src={block.mapEmbedUrl} className="w-full h-[400px] rounded-card mb-8" style={{ border: 0 }} allowFullScreen loading="lazy" />
        )}
      </div>
    </section>
  )
}

function VideoEmbedBlock({ block }: { block: Block }) {
  return (
    <section className="py-24 lg:py-32 bg-navy grain-overlay">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl text-center mb-8">{block.title}</h2>}
        <div className="aspect-video rounded-card overflow-hidden">
          <iframe src={block.videoUrl} className="w-full h-full" allowFullScreen />
        </div>
      </div>
    </section>
  )
}

function CoreValuesBlock({ block }: { block: Block }) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {block.title && (
          <h2 className="font-display font-bold italic text-polinar-mustard text-2xl sm:text-3xl tracking-tight-heading">{block.title}</h2>
        )}
        <div className="divider-asymmetric justify-center mt-4 mb-6"><span className="div-mustard"></span><span className="div-gray"></span></div>
        {block.description && <p className="max-w-3xl mx-auto text-body-muted font-body text-base leading-body mb-8">{block.description}</p>}
        {block.values && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {block.values.map((val: any, idx: number) => (
              <div key={idx} className="text-center">
                {val.icon && <span className="text-3xl mb-2 block">{val.icon}</span>}
                <h3 className="font-display font-bold text-heading text-sm mb-2">{val.title}</h3>
                {val.description && <p className="text-sm text-body-secondary font-body">{val.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CertificatesGridBlock({ block }: { block: Block }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl text-center mb-8">{block.title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {block.certificates?.map((cert: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="relative aspect-[3/4] mb-2">
                <Image src={cert.image?.url || ''} alt={cert.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-contain" />
              </div>
              <p className="font-display font-bold text-sm text-heading">{cert.name}</p>
              {cert.description && <p className="text-xs text-body-secondary font-body">{cert.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABarBlock({ block }: { block: Block }) {
  const isMustard = block.style !== 'navy' && block.style !== 'cyan'
  const bgClass = block.style === 'navy' ? 'bg-navy' : block.style === 'cyan' ? 'bg-cyan' : 'bg-polinar-mustard'
  const textClass = isMustard ? 'text-navy' : 'text-white'
  return (
    <section className={`${bgClass} py-5`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className={`${textClass} font-body text-base text-center sm:text-left`}>{block.text}</p>
        <Link href={block.buttonLink || '#'} className="btn-primary">{block.buttonLabel}</Link>
      </div>
    </section>
  )
}

function TwoColumnBlock({ block }: { block: Block }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${block.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.leftColumn_html || '' }} />
          {block.image?.url ? (
            <div className="relative aspect-[4/3]">
              <Image src={block.image.url} alt={block.image.alt || block.heading || ''} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover rounded-card" />
            </div>
          ) : (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.rightColumn_html || '' }} />
          )}
        </div>
      </div>
    </section>
  )
}

const blockComponents: Record<string, React.ComponentType<{ block: Block; locale: string }>> = {
  heroSlider: HeroSliderBlock,
  richText: RichTextBlock as any,
  imageGallery: ImageGalleryBlock as any,
  productGrid: ProductGridBlock,
  contactForm: ContactFormBlock,
  videoEmbed: VideoEmbedBlock as any,
  coreValues: CoreValuesBlock as any,
  certificatesGrid: CertificatesGridBlock as any,
  ctaBar: CTABarBlock as any,
  twoColumnContent: TwoColumnBlock as any,
}

export function RenderBlocks({ blocks, locale }: { blocks: Block[]; locale: string }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, idx) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={idx} block={block} locale={locale} />
      })}
    </>
  )
}
