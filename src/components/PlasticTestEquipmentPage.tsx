'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getPlasticTestEquipmentData } from '@/data/plastic-test-equipment'
import { getStaticLabels } from '@/data/static-labels'
import type { TestEquipmentCategory } from '@/data/plastic-test-equipment'
import { CatalogBadge, CatalogViewer } from '@/components/catalog'

const capabilityIcons = [
  <svg key="precision" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>,
  <svg key="standards" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
  <svg key="custom" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.048.58.024 1.194-.14 1.743Z" />
  </svg>,
  <svg key="support" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>,
]

const highlightIcons = [
  <svg key="years" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>,
  <svg key="countries" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
  <svg key="products" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>,
  <svg key="iso" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
]

function EquipmentDetailModal({
  category,
  onClose,
  labels,
}: {
  category: TestEquipmentCategory
  onClose: () => void
  labels: {
    standards: string
    keyFeatures: string
    technicalSpecs: string
    downloadBrochure: string
    viewOnline: string
    close: string
    overviewAlt: string
    detailAlt: string
    digitalCatalog: string
    catalogPage: string
    catalogZoomIn: string
    catalogZoomOut: string
    catalogResetZoom: string
    catalogPrint: string
    catalogLoading: string
    catalogPageOf: string
    downloadAll: string
    downloadAllProgress: string
    previous: string
    next: string
  }
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
    digitalCatalog: labels.digitalCatalog,
    page: labels.catalogPage,
    zoomIn: labels.catalogZoomIn,
    zoomOut: labels.catalogZoomOut,
    resetZoom: labels.catalogResetZoom,
    print: labels.catalogPrint,
    download: labels.downloadBrochure,
    close: labels.close,
    previousPage: labels.previous,
    nextPage: labels.next,
    loading: labels.catalogLoading,
    pageOf: labels.catalogPageOf,
    downloadAll: labels.downloadAll,
    downloadAllProgress: labels.downloadAllProgress,
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
          aria-label={labels.close}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="bg-gray-light p-6 lg:p-8">
            <div className="space-y-4">
              <div className="rounded-card overflow-hidden border border-pte-cyan/10">
                <img
                  src={category.image01}
                  alt={`${category.name} - ${labels.overviewAlt}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-card overflow-hidden border border-pte-cyan/10">
                <img
                  src={category.image02}
                  alt={`${category.name} - ${labels.detailAlt}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 flex flex-col overflow-y-auto max-h-[80vh] lg:max-h-none">
            <h3 className="font-display font-extrabold text-heading text-xl lg:text-2xl tracking-tight-heading mb-4">
              {category.name}
            </h3>
            <div className="divider-asymmetric">
              <span className="div-cyan"></span>
              <span className="div-gray"></span>
            </div>

            <p className="font-body text-body-muted text-sm leading-relaxed mb-6">
              {category.description}
            </p>

            {category.standards.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-2">
                  {labels.standards}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.standards.map((std) => (
                    <span
                      key={std}
                      className="inline-block bg-gray-light text-body-muted text-[11px] font-display font-semibold px-2.5 py-1 rounded-full border border-gray-200"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                {labels.keyFeatures}
              </h4>
              <ul className="space-y-2">
                {category.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-body text-body-muted">
                    <svg className="w-4 h-4 text-pte-cyan mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {category.specs.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                  {labels.technicalSpecs}
                </h4>
                <div className="border border-gray-200 rounded-card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {category.specs.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-light' : 'bg-white'}>
                          <td className="px-3 py-2 font-display font-semibold text-heading text-xs w-2/5">
                            {spec.label}
                          </td>
                          <td className="px-3 py-2 font-body text-body-muted text-xs">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCatalogOpen(true)}
                className="btn-primary-cyan inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                {labels.viewOnline}
              </button>
              <a
                href={category.pdfUrl}
                download
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-pte-cyan/30 text-pte-cyan rounded-[3px] px-6 py-2.5 text-sm font-display font-semibold transition-colors hover:bg-pte-cyan/5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {labels.downloadBrochure}
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

export function PlasticTestEquipmentPage({
  locale,
  breadcrumbLabel,
}: {
  locale: string
  breadcrumbLabel: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<TestEquipmentCategory | null>(null)
  const data = getPlasticTestEquipmentData(locale)
  const staticLabels = getStaticLabels(locale)

  const handleClose = useCallback(() => setSelectedCategory(null), [])

  const modalLabels = {
    standards: staticLabels.product.standards,
    keyFeatures: staticLabels.product.keyFeatures,
    technicalSpecs: staticLabels.product.technicalSpecs,
    downloadBrochure: staticLabels.product.downloadBrochure,
    viewOnline: staticLabels.product.viewOnline,
    close: staticLabels.aria.close,
    overviewAlt: staticLabels.product.overviewAlt,
    detailAlt: staticLabels.product.detailAlt,
    digitalCatalog: staticLabels.product.digitalCatalog,
    catalogPage: staticLabels.product.catalogPage,
    catalogZoomIn: staticLabels.product.catalogZoomIn,
    catalogZoomOut: staticLabels.product.catalogZoomOut,
    catalogResetZoom: staticLabels.product.catalogResetZoom,
    catalogPrint: staticLabels.product.catalogPrint,
    catalogLoading: staticLabels.product.catalogLoading,
    catalogPageOf: staticLabels.product.catalogPageOf,
    downloadAll: staticLabels.product.downloadAll,
    downloadAllProgress: staticLabels.product.downloadAllProgress,
    previous: staticLabels.aria.previous,
    next: staticLabels.aria.next,
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay pt-[168px] pb-24 lg:pt-[200px] lg:pb-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050293/polinar/static/testing-hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-display font-semibold text-pte-cyan uppercase tracking-wider mb-2">
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {staticLabels.breadcrumbs.home}
                </Link>
                <span className="text-white/40 mx-2">/</span>
                <Link href={`/${locale}/our-business`} className="hover:text-white transition-colors">
                  {breadcrumbLabel || staticLabels.breadcrumbs.ourBusiness}
                </Link>
                <span className="text-white/40 mx-2">/</span>
                <span className="text-white/70">{data.ui.breadcrumbCurrent}</span>
              </p>
              <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight-heading uppercase mt-4">
                {data.ui.heroTitle}
              </h1>
              <p className="font-body text-white/70 text-lg mt-4 max-w-2xl">
                {data.ui.heroSubtitle}
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 mt-8">
              <CatalogBadge
                catalogs={data.categories.map((c) => ({ id: c.id, name: c.name, pdfUrl: c.pdfUrl }))}
                locale={locale}
                accentColor="#22B8CF"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Highlights */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-display font-bold italic text-pte-cyan text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.introTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-cyan"></span>
              <span className="div-gray"></span>
            </div>
            <p className="text-body-muted font-body text-base leading-relaxed-body">
              {data.ui.introDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {data.highlights.map((h, idx) => (
              <div
                key={h.label}
                className="text-center p-6 rounded-lg border border-gray-100 hover:border-pte-cyan/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-pte-cyan/10 text-pte-cyan flex items-center justify-center mx-auto mb-3">
                  {highlightIcons[idx]}
                </div>
                <p className="font-display font-extrabold text-heading text-2xl sm:text-3xl">{h.value}</p>
                <p className="font-body text-sm text-body-secondary mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Categories Grid */}
      <section className="py-24 lg:py-32 bg-gray-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-pte-cyan uppercase tracking-wider mb-1">
              {data.ui.productRangeEyebrow}
            </p>
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.productRangeTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-cyan"></span>
              <span className="div-gray"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="mould-category-card-cyan group text-left"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cat.image01}
                    alt={cat.name}
                    className="w-full h-[280px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-1 bg-white/90 text-heading text-xs font-display font-semibold px-3 py-1.5 rounded-full">
                      {staticLabels.product.viewDetails}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-heading text-base mb-2 group-hover:text-pte-cyan transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm font-body text-body-secondary leading-relaxed mb-3">
                    {cat.shortDescription}
                  </p>
                  <ul className="space-y-1">
                    {cat.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs font-body text-body-secondary">
                        <svg className="w-3 h-3 text-pte-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                    {cat.features.length > 3 && (
                      <li className="text-xs font-body text-pte-cyan font-semibold pl-4.5">
                        +{cat.features.length - 3} {staticLabels.product.more}
                      </li>
                    )}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 lg:py-32 bg-navy grain-overlay relative">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-pte-cyan uppercase tracking-wider mb-1">
              {data.ui.whyPolinarEyebrow}
            </p>
            <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.whyPolinarTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-cyan"></span>
              <span className="div-gray" style={{ background: 'rgba(255,255,255,0.2)' }}></span>
            </div>
            <p className="text-white/60 font-body text-base max-w-2xl mx-auto">
              {data.ui.whyPolinarDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.coreCapabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-pte-cyan/20 text-pte-cyan flex items-center justify-center mx-auto mb-4">
                  {capabilityIcons[idx]}
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-2">{cap.title}</h3>
                <p className="font-body text-white/50 text-xs leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="bg-pte-cyan py-6">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-display font-bold text-lg">{data.ui.ctaTitle}</p>
            <p className="text-white/80 font-body text-sm">{data.ui.ctaSubtitle}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-white text-pte-cyan font-display font-semibold text-sm px-8 py-3 rounded-[3px] hover:bg-gray-100 transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            {data.ui.contactUs}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Modal */}
      {selectedCategory && (
        <EquipmentDetailModal
          category={selectedCategory}
          onClose={handleClose}
          labels={modalLabels}
        />
      )}
    </>
  )
}
