'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getStaticLabels } from '@/data/static-labels'
import { CatalogViewer } from './CatalogViewer'
import type { CatalogItem } from './CatalogViewer'

type CatalogBadgeProps = {
  catalogs: CatalogItem[]
  locale: string
  accentColor?: string
}

export function CatalogBadge({ catalogs, locale, accentColor = '#C8A951' }: CatalogBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const labels = getStaticLabels(locale)

  if (catalogs.length === 0) return null

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
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="catalog-badge group"
        style={{ '--badge-accent': accentColor } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="catalog-badge-pulse" />
        <span className="catalog-badge-icon">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </span>
        <span className="catalog-badge-body">
          <span className="catalog-badge-label">{labels.product.digitalCatalog}</span>
          <span className="catalog-badge-sub">
            {catalogs.length} {labels.product.viewCatalog}
          </span>
        </span>
        <span className="catalog-badge-arrow">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </motion.button>

      <CatalogViewer
        catalogs={catalogs}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        labels={catalogLabels}
      />
    </>
  )
}
