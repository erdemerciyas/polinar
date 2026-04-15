'use client'

import dynamic from 'next/dynamic'

const CatalogViewerInner = dynamic(() => import('./CatalogViewerInner'), {
  ssr: false,
})

export type CatalogItem = {
  id: string
  name: string
  pdfUrl: string
}

export type CatalogViewerProps = {
  catalogs: CatalogItem[]
  initialCatalogId?: string
  isOpen: boolean
  onClose: () => void
  labels: {
    digitalCatalog: string
    page: string
    zoomIn: string
    zoomOut: string
    resetZoom: string
    print: string
    download: string
    close: string
    previousPage: string
    nextPage: string
    loading: string
    pageOf: string
    downloadAll: string
    downloadAllProgress: string
  }
}

export function CatalogViewer({ catalogs, initialCatalogId, isOpen, onClose, labels }: CatalogViewerProps) {
  if (!isOpen || catalogs.length === 0) return null

  return (
    <CatalogViewerInner
      catalogs={catalogs}
      initialCatalogId={initialCatalogId}
      onClose={onClose}
      labels={labels}
    />
  )
}
