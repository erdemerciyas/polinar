'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getMachineryData } from '@/data/machinery'
import type { MachineCategory } from '@/data/machinery'
import { getStaticLabels } from '@/data/static-labels'

const capabilityIcons = [
  <svg key="eng" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.048.58.024 1.194-.14 1.743Z" />
  </svg>,
  <svg key="wifi" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
  </svg>,
  <svg key="shield" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
  <svg key="db" className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>,
]

const highlightIcons = [
  <svg key="cal" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>,
  <svg key="globe" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
  <svg key="flask" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>,
  <svg key="grid" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>,
]

function MachineDetailModal({
  category,
  onClose,
  locale,
}: {
  category: MachineCategory
  onClose: () => void
  locale: string
}) {
  const labels = getStaticLabels(locale)
  const { ui } = getMachineryData(locale)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

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
          <div className="bg-gray-light p-6 lg:p-8">
            <div className="space-y-4">
              <div className="rounded-card overflow-hidden border border-polinar-red/10">
                <img
                  src={category.image01}
                  alt={`${category.name} - ${labels.product.overviewAlt}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-card overflow-hidden border border-polinar-red/10">
                <img
                  src={category.image02}
                  alt={`${category.name} - ${labels.product.specificationsAlt}`}
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
              <span className="div-red"></span>
              <span className="div-gray"></span>
            </div>

            <p className="font-body text-body-muted text-sm leading-relaxed mb-6">
              {category.description}
            </p>

            {category.standards && category.standards.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-2">
                  {labels.product.standards}
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
                {labels.product.keyFeatures}
              </h4>
              <ul className="space-y-2">
                {category.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-body text-body-muted">
                    <svg className="w-4 h-4 text-polinar-red mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {category.specs && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                  {labels.product.technicalSpecs}
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

            {category.versions && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                  {category.versions.name}
                </h4>
                <div className="border border-gray-200 rounded-card overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-3 py-2 text-left font-display font-semibold text-xs"></th>
                        {category.versions.columns.map((col) => (
                          <th key={col} className="px-3 py-2 text-center font-display font-semibold text-xs">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {category.versions.rows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-light' : 'bg-white'}>
                          <td className="px-3 py-2 font-display font-semibold text-heading text-xs">
                            {row.label}{row.unit ? ` (${row.unit})` : ''}
                          </td>
                          {row.values.map((val, vi) => (
                            <td key={vi} className="px-3 py-2 font-body text-body-muted text-xs text-center">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {category.positions && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-heading text-sm uppercase tracking-wider mb-3">
                  {ui.workCycleTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {category.positions.map((pos, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-body text-body-muted">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-polinar-red/10 text-polinar-red font-display font-bold text-[10px] flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      {pos}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-4">
              <a
                href={category.pdfUrl}
                download
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25m-18 0V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v9.75m-18 0h18M12 3v12m0 0-3.75-3.75M12 15l3.75-3.75" />
                </svg>
                {labels.product.downloadBrochure}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MachineryPage({
  locale,
  breadcrumbLabel,
}: {
  locale: string
  breadcrumbLabel: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<MachineCategory | null>(null)
  const data = getMachineryData(locale)
  const labels = getStaticLabels(locale)

  const handleClose = useCallback(() => setSelectedCategory(null), [])

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-navy grain-overlay py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050214/polinar/static/machinery-hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70"></div>
        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-2">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {data.ui.breadcrumbHome}
            </Link>
            <span className="text-white/40 mx-2">/</span>
            <Link href={`/${locale}/our-business`} className="hover:text-white transition-colors">
              {breadcrumbLabel || data.ui.breadcrumbParentFallback}
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
      </section>

      {/* Intro + Highlights */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-display font-bold italic text-polinar-red text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.introTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-red"></span>
              <span className="div-gray"></span>
            </div>
            <p className="text-body-muted font-body text-base leading-relaxed-body">
              {data.ui.introText}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {data.highlights.map((h, idx) => (
              <div
                key={h.label}
                className="text-center p-6 rounded-lg border border-gray-100 hover:border-polinar-red/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-polinar-red/10 text-polinar-red flex items-center justify-center mx-auto mb-3">
                  {highlightIcons[idx]}
                </div>
                <p className="font-display font-extrabold text-heading text-2xl sm:text-3xl">{h.value}</p>
                <p className="font-body text-sm text-body-secondary mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machine Categories Grid */}
      <section className="py-24 lg:py-32 bg-gray-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-1">
              {data.ui.categoriesLabel}
            </p>
            <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.categoriesSectionTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-red"></span>
              <span className="div-gray"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="mould-category-card group text-left"
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
                      {labels.product.viewDetails}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-heading text-base mb-2 group-hover:text-polinar-red transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm font-body text-body-secondary leading-relaxed mb-3">
                    {cat.shortDescription}
                  </p>
                  <ul className="space-y-1">
                    {cat.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs font-body text-body-secondary">
                        <svg className="w-3 h-3 text-polinar-red flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                    {cat.features.length > 3 && (
                      <li className="text-xs font-body text-polinar-red font-semibold pl-4.5">
                        +{cat.features.length - 3} {labels.product.more}
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
            <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider mb-1">
              {data.ui.whyLabel}
            </p>
            <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl tracking-tight-heading">
              {data.ui.whySectionTitle}
            </h2>
            <div className="divider-asymmetric justify-center">
              <span className="div-red"></span>
              <span className="div-gray" style={{ background: 'rgba(255,255,255,0.2)' }}></span>
            </div>
            <p className="text-white/60 font-body text-base max-w-2xl mx-auto">
              {data.ui.whyText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.coreCapabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-polinar-red/20 text-polinar-red flex items-center justify-center mx-auto mb-4">
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
      <section className="bg-polinar-red py-6">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-display font-bold text-lg">{data.ui.ctaTitle}</p>
            <p className="text-white/80 font-body text-sm">{data.ui.ctaText}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-white text-polinar-red font-display font-semibold text-sm px-8 py-3 rounded-[3px] hover:bg-gray-100 transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            {data.ui.ctaButton}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Modal */}
      {selectedCategory && (
        <MachineDetailModal
          category={selectedCategory}
          onClose={handleClose}
          locale={locale}
        />
      )}
    </>
  )
}
