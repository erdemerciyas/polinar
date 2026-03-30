'use client'

import { useState, useCallback, useEffect } from 'react'
import { getStaticLabels } from '@/data/static-labels'

interface GalleryImage {
  image: { url?: string | null; alt?: string } | null
  caption?: string | null
  size?: 'normal' | 'large'
}

export function GalleryLightbox({ images, locale }: { images: GalleryImage[]; locale: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const labels = getStaticLabels(locale)

  const handleClose = useCallback(() => setActiveIndex(null), [])
  const handlePrev = useCallback(() => {
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1))
  }, [images.length])
  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0))
  }, [images.length])

  useEffect(() => {
    if (activeIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [activeIndex, handleClose, handlePrev, handleNext])

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 auto-rows-[200px] lg:auto-rows-[260px]">
        {images.map((item, idx) => {
          const imgUrl = item.image?.url
          if (!imgUrl) return null
          return (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative overflow-hidden rounded-[3px] group cursor-pointer ${
              item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
            }`}
            aria-label={item.caption || labels.about.galleryImageAlt.replace('{index}', String(idx + 1))}
          >
            <img
              src={imgUrl}
              alt={item.image?.alt || item.caption || ''}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors duration-300" />
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-body">{item.caption}</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>
          </button>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && images[activeIndex] && (
        <div
          className="fixed inset-0 z-[300] bg-navy-deep/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={labels.aria.close}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={labels.aria.previous}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={labels.aria.next}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            {images[activeIndex].image?.url && <img
              src={images[activeIndex].image.url}
              alt={images[activeIndex].image?.alt || images[activeIndex].caption || ''}
              className="max-w-full max-h-[85vh] object-contain rounded-[3px]"
            />}
            {images[activeIndex].caption && (
              <p className="text-white/80 text-center text-sm font-body mt-3">{images[activeIndex].caption}</p>
            )}
            <p className="text-white/40 text-center text-xs font-body mt-1">
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
