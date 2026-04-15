'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const PDFJS_VERSION = '3.11.174'
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`

const MIN_SCALE = 0.5
const MAX_SCALE = 5.0
const ZOOM_SENSITIVITY = 0.002

export type CatalogItem = {
  id: string
  name: string
  pdfUrl: string
}

export type CatalogLabels = {
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

export type CatalogViewerInnerProps = {
  catalogs: CatalogItem[]
  initialCatalogId?: string
  onClose: () => void
  labels: CatalogLabels
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type PdfjsLib = any
type PDFDocProxy = { numPages: number; getPage: (n: number) => Promise<any>; destroy: () => void }

let pdfjsPromise: Promise<PdfjsLib> | null = null

function loadPdfjs(): Promise<PdfjsLib> {
  if (pdfjsPromise) return pdfjsPromise
  pdfjsPromise = new Promise<PdfjsLib>((resolve, reject) => {
    const win = window as any
    if (win.pdfjsLib) { resolve(win.pdfjsLib); return }
    const script = document.createElement('script')
    script.src = `${PDFJS_BASE}/pdf.min.js`
    script.onload = () => {
      const lib = win.pdfjsLib
      if (!lib) { reject(new Error('pdfjsLib not found')); return }
      lib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`
      resolve(lib)
    }
    script.onerror = () => reject(new Error('Failed to load pdf.js'))
    document.head.appendChild(script)
  })
  return pdfjsPromise
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

export default function CatalogViewerInner({ catalogs, initialCatalogId, onClose, labels }: CatalogViewerInnerProps) {
  const initial = catalogs.find((c) => c.id === initialCatalogId) || catalogs[0]
  const [activeCatalog, setActiveCatalog] = useState<CatalogItem>(initial)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pdfDocRef = useRef<PDFDocProxy | null>(null)
  const renderingRef = useRef(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const header = document.querySelector('header')
    if (header && overlayRef.current) {
      overlayRef.current.style.setProperty('--catalog-top', `${header.offsetHeight}px`)
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      pdfDocRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setNumPages(0)
    setCurrentPage(1)
    setScale(1.0)
    setPanOffset({ x: 0, y: 0 })
    pdfDocRef.current?.destroy()
    pdfDocRef.current = null

    loadPdfjs()
      .then((pdfjs: PdfjsLib) => pdfjs.getDocument(activeCatalog.pdfUrl).promise)
      .then((doc: PDFDocProxy) => {
        if (cancelled) { doc.destroy(); return }
        pdfDocRef.current = doc
        setNumPages(doc.numPages)
        setIsLoading(false)
      })
      .catch((err: any) => {
        console.error('[CatalogViewer] PDF load error:', err)
        if (!cancelled) { setError('PDF yüklenemedi.'); setIsLoading(false) }
      })
    return () => { cancelled = true }
  }, [activeCatalog])

  useEffect(() => {
    const doc = pdfDocRef.current
    const canvas = canvasRef.current
    if (!doc || !canvas || currentPage < 1 || currentPage > numPages || renderingRef.current) return
    if (containerSize.width === 0 || containerSize.height === 0) return

    renderingRef.current = true
    const pad = 16

    doc.getPage(currentPage).then((page: any) => {
      const vp1 = page.getViewport({ scale: 1 })
      const fitW = (containerSize.width - pad * 2) / vp1.width
      const fitH = (containerSize.height - pad * 2) / vp1.height
      const fitScale = Math.min(fitW, fitH)
      const finalScale = fitScale * scale
      const viewport = page.getViewport({ scale: finalScale })

      canvas.width = viewport.width
      canvas.height = viewport.height

      const ctx = canvas.getContext('2d')
      if (!ctx) { renderingRef.current = false; return }

      page.render({ canvasContext: ctx, viewport }).promise
        .then(() => { renderingRef.current = false })
        .catch(() => { renderingRef.current = false })
    }).catch(() => { renderingRef.current = false })
  }, [currentPage, numPages, scale, containerSize])

  // ── Pan (drag) ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...panOffset }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [panOffset])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPanOffset({ x: panStartRef.current.x + dx, y: panStartRef.current.y + dy })
  }, [isDragging])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ── Scroll zoom (at cursor point) ──
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * ZOOM_SENSITIVITY
    setScale((prev) => {
      const next = clamp(prev * (1 + delta), MIN_SCALE, MAX_SCALE)
      if (next === prev) return prev

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return next

      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const containerCenterX = rect.width / 2
      const containerCenterY = rect.height / 2
      const mouseOffX = cx - containerCenterX
      const mouseOffY = cy - containerCenterY

      const ratio = next / prev
      setPanOffset((p) => ({
        x: p.x * ratio - mouseOffX * (ratio - 1),
        y: p.y * ratio - mouseOffY * (ratio - 1),
      }))

      return next
    })
  }, [])

  // ── Double click to reset ──
  const handleDoubleClick = useCallback(() => {
    setScale(1.0)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1))
    setPanOffset({ x: 0, y: 0 })
    setScale(1.0)
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(numPages, p + 1))
    setPanOffset({ x: 0, y: 0 })
    setScale(1.0)
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale((s) => clamp(s + 0.25, MIN_SCALE, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => clamp(s - 0.25, MIN_SCALE, MAX_SCALE))
  }, [])

  const resetView = useCallback(() => {
    setScale(1.0)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const handleDownload = useCallback(() => {
    const a = document.createElement('a')
    a.href = activeCatalog.pdfUrl
    a.download = activeCatalog.name + '.pdf'
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [activeCatalog])

  const handleOpenNew = useCallback(() => {
    window.open(activeCatalog.pdfUrl, '_blank')
  }, [activeCatalog])

  const [merging, setMerging] = useState(false)
  const handleDownloadAll = useCallback(async () => {
    if (merging || catalogs.length <= 1) return
    setMerging(true)
    try {
      const res = await fetch('/api/merge-catalogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: catalogs.map((c) => c.pdfUrl),
          filename: 'polinar-catalogs',
        }),
      })
      if (!res.ok) throw new Error('Merge failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'polinar-catalogs.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[CatalogViewer] Download all error:', err)
    } finally {
      setMerging(false)
    }
  }, [catalogs, merging])

  const switchCatalog = useCallback((item: CatalogItem) => {
    setActiveCatalog(item)
    setSidebarOpen(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break
        case 'ArrowLeft': goToPrevPage(); break
        case 'ArrowRight': goToNextPage(); break
        case '+': case '=':
          if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomIn() }
          break
        case '-':
          if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomOut() }
          break
        case '0':
          if (e.ctrlKey || e.metaKey) { e.preventDefault(); resetView() }
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, goToPrevPage, goToNextPage, zoomIn, zoomOut, resetView])

  // Block native pinch-zoom on the canvas area
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const prevent = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault() }
    el.addEventListener('wheel', prevent, { passive: false })
    return () => el.removeEventListener('wheel', prevent)
  }, [])

  const canvasTransform = `translate(${panOffset.x}px, ${panOffset.y}px)`

  return (
    <div ref={overlayRef} className="catalog-viewer-overlay" onClick={onClose}>
      <div className="catalog-viewer-shell" onClick={(e) => e.stopPropagation()}>

        {/* ── Desktop sidebar ── */}
        <aside className="catalog-sidebar">
          <div className="catalog-sidebar-header">
            <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="font-display font-bold text-xs text-white/70 uppercase tracking-wider">
              {labels.digitalCatalog}
            </span>
          </div>
          <nav className="catalog-sidebar-list">
            {catalogs.map((item, i) => (
              <button
                key={item.id}
                onClick={() => switchCatalog(item)}
                className={`catalog-sidebar-item ${item.id === activeCatalog.id ? 'active' : ''}`}
              >
                <span className="catalog-sidebar-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="catalog-sidebar-name">{item.name}</span>
              </button>
            ))}
          </nav>
          {catalogs.length > 1 && (
            <div className="catalog-sidebar-footer">
              <button
                onClick={handleDownloadAll}
                disabled={merging}
                className="catalog-download-all-btn"
              >
                {merging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    <span>{labels.downloadAllProgress}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>{labels.downloadAll}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </aside>

        {/* ── Main area ── */}
        <div className="catalog-main">

          {/* ── Toolbar ── */}
          <div className="catalog-viewer-toolbar">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="catalog-toolbar-btn md:hidden"
              aria-label="Select catalog"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <span className="font-display font-semibold text-white text-sm truncate min-w-0 hidden md:block">
              {activeCatalog.name}
            </span>
            <span className="font-display font-semibold text-white text-xs truncate min-w-0 md:hidden flex-1">
              {activeCatalog.name}
            </span>

            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button onClick={goToPrevPage} disabled={currentPage <= 1} className="catalog-toolbar-btn" aria-label={labels.previousPage}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-white/80 text-xs font-display font-semibold px-1 sm:px-2 min-w-[50px] text-center tabular-nums">
                {currentPage} / {numPages || '–'}
              </span>
              <button onClick={goToNextPage} disabled={currentPage >= numPages} className="catalog-toolbar-btn" aria-label={labels.nextPage}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <div className="w-px h-5 bg-white/20 mx-0.5 sm:mx-1" />

              <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className="catalog-toolbar-btn hidden sm:flex" aria-label={labels.zoomOut}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                </svg>
              </button>
              <button onClick={resetView} className="catalog-toolbar-btn text-[10px] font-bold min-w-[40px] hidden sm:flex" aria-label={labels.resetZoom}>
                {Math.round(scale * 100)}%
              </button>
              <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className="catalog-toolbar-btn hidden sm:flex" aria-label={labels.zoomIn}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                </svg>
              </button>

              <div className="w-px h-5 bg-white/20 mx-0.5 sm:mx-1 hidden sm:block" />

              <button onClick={handleOpenNew} className="catalog-toolbar-btn hidden sm:flex" aria-label={labels.print}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>
              <button onClick={handleDownload} className="catalog-toolbar-btn hidden sm:flex" aria-label={labels.download}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>

              <div className="w-px h-5 bg-white/20 mx-0.5 sm:mx-1" />

              <button onClick={onClose} className="catalog-toolbar-btn" aria-label={labels.close}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Mobile sidebar dropdown ── */}
          {sidebarOpen && (
            <div className="catalog-mobile-dropdown md:hidden">
              {catalogs.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => switchCatalog(item)}
                  className={`catalog-mobile-dropdown-item ${item.id === activeCatalog.id ? 'active' : ''}`}
                >
                  <span className="catalog-sidebar-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-left truncate">{item.name}</span>
                </button>
              ))}
              {catalogs.length > 1 && (
                <button onClick={handleDownloadAll} disabled={merging} className="catalog-mobile-download-all">
                  {merging ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{labels.downloadAllProgress}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      <span>{labels.downloadAll}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ── Canvas viewport ── */}
          <div
            ref={containerRef}
            className="catalog-viewer-canvas"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-white/60 text-sm font-display">{labels.loading}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="text-white/60 text-sm font-body text-center p-8">{error}</div>
              </div>
            )}

            {currentPage > 1 && (
              <button onClick={(e) => { e.stopPropagation(); goToPrevPage() }} className="catalog-nav-arrow catalog-nav-arrow-left" aria-label={labels.previousPage}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            {currentPage < numPages && (
              <button onClick={(e) => { e.stopPropagation(); goToNextPage() }} className="catalog-nav-arrow catalog-nav-arrow-right" aria-label={labels.nextPage}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            <canvas
              ref={canvasRef}
              className="catalog-pdf-page"
              style={{
                display: numPages > 0 ? 'block' : 'none',
                transform: canvasTransform,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* ── Mobile bottom bar ── */}
          <div className="catalog-viewer-mobile-bar sm:hidden">
            <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className="catalog-toolbar-btn" aria-label={labels.zoomOut}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
              </svg>
            </button>
            <button onClick={resetView} className="catalog-toolbar-btn text-[10px] font-bold" aria-label={labels.resetZoom}>
              {Math.round(scale * 100)}%
            </button>
            <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className="catalog-toolbar-btn" aria-label={labels.zoomIn}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button onClick={handleOpenNew} className="catalog-toolbar-btn" aria-label={labels.print}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </button>
            <button onClick={handleDownload} className="catalog-toolbar-btn" aria-label={labels.download}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 16.5v-2.25M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
