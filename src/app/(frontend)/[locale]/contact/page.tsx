import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getStaticLabels } from '@/data/static-labels'
import { generateSEO, localBusinessJsonLd, JsonLd } from '@/lib/seo'
import { ContactForm } from '@/components/ContactForm'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  let contactSettings: any = null
  try {
    const payload = await getPayloadClient()
    contactSettings = await payload.findGlobal({ slug: 'contact-page-settings', locale: locale as any })
  } catch {}

  const seo = contactSettings?.seo || {}
  const title = seo.title || contactSettings?.hero?.title || 'Contact'

  return generateSEO({
    title,
    description: seo.description || contactSettings?.hero?.subtitle || title,
    locale,
    path: '/contact',
    image: seo.image?.url,
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const staticLabels = getStaticLabels(locale)

  let contactSettings: any = null
  try {
    const payload = await getPayloadClient()
    contactSettings = await payload.findGlobal({ slug: 'contact-page-settings', locale: locale as any })
  } catch {}

  const hero = contactSettings?.hero || {}
  const form = contactSettings?.form || {}
  const messages = contactSettings?.messages || {}
  const info = contactSettings?.info || {}

  return (
    <>
      <JsonLd data={localBusinessJsonLd(locale)} />

      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay py-24 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-2">
            {hero.subtitle || ''}
          </p>
          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight-heading">
            {hero.title || ''}
          </h1>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <StaggerContainer className="space-y-6">
              <StaggerItem>
                <div className="contact-box">
                  <h3 className="font-display font-bold text-base mb-3">{info.addressLabel || ''}</h3>
                  <p className="font-body text-sm leading-body whitespace-pre-line">{info.addressText || ''}</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="contact-box">
                  <h3 className="font-display font-bold text-base mb-3">{info.phoneLabel || ''}</h3>
                  <div className="font-body text-sm space-y-1">
                    {staticLabels.company.phones.map((phone) => (
                      <p key={phone}>{phone}</p>
                    ))}
                    <p>{staticLabels.company.fax}</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="contact-box">
                  <h3 className="font-display font-bold text-base mb-3">{info.emailLabel || ''}</h3>
                  <a href={`mailto:${staticLabels.company.email}`} className="text-polinar-red font-body text-sm hover:underline">
                    {staticLabels.company.email}
                  </a>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Contact Form */}
            <ScrollReveal className="lg:col-span-2" direction="right">
              <ContactForm formLabels={form} messages={messages} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="relative h-[450px]">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <iframe
          src={staticLabels.company.mapUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Polinar Location"
        />
      </section>
    </>
  )
}
