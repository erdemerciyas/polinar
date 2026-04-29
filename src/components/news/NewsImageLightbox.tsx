'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getStaticLabels } from '@/data/static-labels'

interface NewsImageLightboxProps {
  src: string
  alt: string
  locale: string
}

export function NewsImageLightbox({ src, alt, locale }: NewsImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const labels = getStaticLabels(locale)

  const handleClose = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleClose])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative mb-8 rounded-card overflow-hidden h-[400px] w-full block group cursor-zoom-in"
        aria-label={alt}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[300] bg-navy-deep/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={labels.aria.close}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-[3px]"
            />
          </div>
        </div>
      )}
    </>
  )
}
