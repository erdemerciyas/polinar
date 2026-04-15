'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getInjectionMouldsData, type MouldCategoryData } from '@/data/injection-moulds'
import { getStaticLabels } from '@/data/static-labels'
import { CatalogBadge, CatalogViewer } from '@/components/catalog'

function MouldDetailModal({
  category,
  onClose,
  labels,
}: {
  category: MouldCategoryData
  onClose: () => void
  labels: ReturnType<typeof getStaticLabels>
}) {
  const [catalogOpen, setCatalogOpen] = useState(false)

  useEffect(() => {
    if (catalogOpen) return
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose, catalogOpen])

  const catalogLabels = {
    digitalCatalog: labels.product.digitalCatalog,
    page: labels.product.catalogPage,
    zoomIn: labels.product.catalogZoomIn,
    zoomOut: labels.product.catalogZoomOut,
    resetZoom: labels.product.catalogResetZoom,
    print: labels.product.catalogPrint,
    download: labels.product.downloadBrochure,
    close: labels.aria.close,
    previousPage: labels.aria.previous,
    nextPage: labels.aria.next,
    loading: labels.product.catalogLoading,
    pageOf: labels.product.catalogPageOf,
    downloadAll: labels.product.downloadAll,
    downloadAllProgress: labels.product.downloadAllProgress,
  }

  return (
    <div className="mould-modal-overlay" onClick={onClose}>
      <div
        className="mould-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-heading transition-colors"
          aria-label={labels.aria.close}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: Images */}
          <div className="bg-gray-light p-6 lg:p-8">
            <div className="space-y-4">
              <div className="rounded-card overflow-hidden border border-moulds-gold/10">
                <img
                  src={category.mouldImage}
                  alt={`${category.name} - ${labels.product.mouldAlt}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-card overflow-hidden border border-moulds-gold/10">
                <img
                  src={category.productImage}
                  alt={`${category.name} - ${labels.product.productsAlt}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-6 lg:p-8 flex flex-col">
            <h3 className="font-display font-extrabold text-heading text-xl lg:text-2xl tracking-tight-heading mb-4">
              {category.name}
            </h3>
            <div className="divider-asymmetric">
              <span className="div-gold"></span>
              <span className="div-gray"></span>
            </div>

            <div className="mb-6">
              <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-2">
                {labels.product.materials}
              </h4>
              <p className="font-body text-body-muted text-sm leading-body">
                {category.materials}
              </p>
            </div>

            <div className="mb-8 flex-1">
              <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                {labels.product.technologies}
              </h4>
              <ul className="space-y-2">
                {category.technologies.map((tech, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-body text-body-muted">
                    <svg className="w-4 h-4 text-moulds-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCatalogOpen(true)}
                className="btn-primary-gold inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                {labels.product.viewOnline}
              </button>
              <a
                href={category.pdfUrl}
                download
                className="btn-outline-gold inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-current rounded-[3px] px-6 py-2.5 text-sm font-display font-semibold transition-colors hover:bg-moulds-gold/10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {labels.product.downloadBrochure}
              </a>
            </div>
          </div>
        </div>
      </div>

      <CatalogViewer
        catalogs={[{ id: category.id, name: category.name, pdfUrl: category.pdfUrl }]}
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        labels={catalogLabels}
      />
    </div>
  )
}

const technologyIcons = [
  <svg key="shield" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
  <svg key="clock" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>,
  <svg key="sparkles" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>,
  <svg key="fire" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
  </svg>,
]

const highlightIcons = [
  <svg key="calendar" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>,
  <svg key="globe" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
  <svg key="pencil" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>,
  <svg key="grid" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>,
]

export function InjectionMouldsPage({
  locale,
  breadcrumbLabel,
}: {
  locale: string
  breadcrumbLabel: string
}) {
  const data = getInjectionMouldsData(locale)
  const labels = getStaticLabels(locale)
  const { categories, commonTechnologies, highlights, ui } = data

  const [selectedCategory, setSelectedCategory] = useState<MouldCategoryData | null>(null)

  const handleClose = useCallback(() => setSelectedCategory(null), [])

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay pt-[168px] pb-24 lg:pt-[200px] lg:pb-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050191/polinar/static/injection-moulds-hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-display font-semibold text-moulds-gold uppercase tracking-wider mb-2">
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {ui.breadcrumbHome}
                </Link>
                <span className="text-white/40 mx-2">/</span>
                <Link href={`/${locale}/our-business`} className="hover:text-white transition-colors">
                  {breadcrumbLabel || ui.breadcrumbParentFallback}
                </Link>
                <span className="text-white/40 mx-2">/</span>
                <span className="text-white/70">{ui.breadcrumbCurrent}</span>
              </p>
              <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight-heading uppercase mt-4">
                {ui.heroTitle}
              </h1>
              <p className="font-body text-white/70 text-lg mt-4 max-w-2xl">
                {ui.heroSubtitle}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 mt-8">
              <CatalogBadge
                catalogs={categories.map((c) => ({ id: c.id, name: c.name, pdfUrl: c.pdfUrl }))}
                locale={locale}
                accentColor="#C8A951"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Highlights */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-display font-bold italic text-moulds-gold text-2xl sm:text-3xl tracking-tight-heading">
              {ui.introTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-gold"></span>
              <span className="div-gray"></span>
            </div>
            <p className="text-body-muted font-body text-base leading-relaxed-body">
              {ui.introText}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, idx) => (
              <div
                key={h.label}
                className="text-center p-6 rounded-lg border border-gray-100 hover:border-moulds-gold/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-moulds-gold/10 text-moulds-gold flex items-center justify-center mx-auto mb-3">
                  {highlightIcons[idx]}
                </div>
                <p className="font-display font-extrabold text-heading text-2xl sm:text-3xl">{h.value}</p>
                <p className="font-body text-sm text-body-secondary mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-24 lg:py-32 bg-gray-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-moulds-gold uppercase tracking-wider mb-1">
              {ui.categoriesLabel}
            </p>
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
              {ui.categoriesSectionTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-gold"></span>
              <span className="div-gray"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="mould-category-card-gold group text-left"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cat.mouldImage}
                    alt={cat.name}
                    className="w-full h-[240px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-1 bg-white/90 text-heading text-xs font-display font-semibold px-3 py-1.5 rounded-full">
                      {labels.product.viewDetails}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-heading text-base mb-2 group-hover:text-moulds-gold transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cat.materials.split(' / ').slice(0, 3).map((mat) => (
                      <span
                        key={mat}
                        className="inline-block bg-gray-light text-body-muted text-[11px] font-display font-semibold px-2 py-0.5 rounded-full border border-gray-200"
                      >
                        {mat.trim()}
                      </span>
                    ))}
                    {cat.materials.split(' / ').length > 3 && (
                      <span className="inline-block text-body-tertiary text-[11px] font-display font-semibold px-1">
                        +{cat.materials.split(' / ').length - 3}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {cat.technologies.slice(0, 3).map((tech, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs font-body text-body-secondary">
                        <svg className="w-3 h-3 text-moulds-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        {tech}
                      </li>
                    ))}
                    {cat.technologies.length > 3 && (
                      <li className="text-xs font-body text-moulds-gold font-semibold pl-4.5">
                        +{cat.technologies.length - 3} {labels.product.more}
                      </li>
                    )}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Common Technologies */}
      <section className="py-24 lg:py-32 bg-navy grain-overlay relative">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-moulds-gold uppercase tracking-wider mb-1">
              {ui.whyLabel}
            </p>
            <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl tracking-tight-heading">
              {ui.whySectionTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-gold"></span>
              <span className="div-gray" style={{ background: 'rgba(255,255,255,0.2)' }}></span>
            </div>
            <p className="text-white/60 font-body text-base max-w-2xl mx-auto">
              {ui.whyText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonTechnologies.map((tech, idx) => (
              <div
                key={tech.title}
                className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-moulds-gold/20 text-moulds-gold flex items-center justify-center mx-auto mb-4">
                  {technologyIcons[idx]}
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-2">{tech.title}</h3>
                <p className="font-body text-white/50 text-xs leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="bg-moulds-gold py-6">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-display font-bold text-lg">{ui.ctaTitle}</p>
            <p className="text-white/80 font-body text-sm">{ui.ctaText}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-white text-moulds-gold font-display font-semibold text-sm px-8 py-3 rounded-[3px] hover:bg-gray-100 transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            {ui.ctaButton}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Modal */}
      {selectedCategory && (
        <MouldDetailModal
          category={selectedCategory}
          onClose={handleClose}
          labels={labels}
        />
      )}
    </>
  )
}
