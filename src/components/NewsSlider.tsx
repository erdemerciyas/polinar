'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, type PanInfo } from 'framer-motion'

type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  year: string
  date?: string
  featuredImage?: { url?: string; alt?: string }
}

type NewsSliderProps = {
  items: NewsItem[]
  locale: string
  sectionLabel?: string
  sectionTitle?: string
  emptyText?: string
}

const DRAG_THRESHOLD = 40
const GAP = 24

export function NewsSlider({
  items,
  locale,
  sectionLabel,
  sectionTitle,
  emptyText,
}: NewsSliderProps) {
  const [perView, setPerView] = useState(2)
  const [page, setPage] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const containerW = trackRef.current.offsetWidth
      const pv = window.innerWidth < 768 ? 1 : 2
      setPerView(pv)
      setCardWidth((containerW - GAP * (pv - 1)) / pv)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / perView))
  const safeItems = items.slice(0, 6)

  const targetX = -(page * perView) * (cardWidth + GAP)
  const x = useMotionValue(targetX)
  const springX = useSpring(x, { stiffness: 120, damping: 24, mass: 0.8 })

  useEffect(() => {
    x.set(targetX)
  }, [targetX, x])

  const goTo = useCallback((idx: number) => {
    setPage(idx)
  }, [])

  const next = useCallback(() => {
    setPage(p => Math.min(p + 1, totalPages - 1))
  }, [totalPages])

  const prev = useCallback(() => {
    setPage(p => Math.max(p - 1, 0))
  }, [])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info
    if (Math.abs(offset.x) > DRAG_THRESHOLD || Math.abs(velocity.x) > 400) {
      if (offset.x < 0) next()
      else prev()
    } else {
      x.set(targetX)
    }
  }

  if (!safeItems.length) {
    return (
      <p className="text-center text-body-tertiary py-12">
        {emptyText || ''}
      </p>
    )
  }

  return (
    <div className="lg:w-[62%]">
      {/* Heading */}
      <div className="mb-10">
        {sectionLabel && (
          <p className="text-sm font-display font-semibold text-polinar-red uppercase tracking-wider">
            {sectionLabel}
          </p>
        )}
        {sectionTitle && (
          <h2 className="font-display font-extrabold text-heading text-2xl sm:text-3xl lg:text-4xl tracking-tight-heading">
            {sectionTitle}
          </h2>
        )}
        <div className="divider-asymmetric">
          <span className="div-red"></span>
          <span className="div-gray"></span>
        </div>
      </div>

      {/* Cards track */}
      <div ref={trackRef} className="overflow-hidden rounded-card-lg">
        <motion.div
          className="flex"
          style={{ x: springX, gap: GAP }}
          drag="x"
          dragConstraints={{
            left: -((safeItems.length - perView) * (cardWidth + GAP)),
            right: 0,
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          {safeItems.map((item) => (
            <motion.div
              key={item.id}
              className="shrink-0"
              style={{ width: cardWidth || '100%' }}
            >
              <Link
                href={`/${locale}/news/${item.slug}`}
                className="group bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover flex flex-col h-full transition-all duration-500 ease-smooth-out hover:-translate-y-1"
                draggable={false}
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={item.featuredImage?.url || 'https://placehold.co/400x220/E8E8E8/999?text=News'}
                    alt={item.featuredImage?.alt || item.title || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-smooth-out"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                <div className="p-5 lg:p-6 flex flex-col flex-1">
                  <span className="inline-block bg-polinar-red text-white text-xs font-display font-bold px-3 py-1 rounded-full mb-3 w-fit">
                    {item.year || (item.date ? new Date(item.date).getFullYear() : '')}
                  </span>
                  <h3 className="font-display font-bold text-heading text-base mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-body-secondary font-body leading-body line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={prev}
            disabled={page === 0}
            aria-label="Previous"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-card text-heading border border-border-soft hover:shadow-card-hover hover:border-polinar-red/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Page ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  idx === page
                    ? 'w-8 h-2 bg-polinar-red'
                    : 'w-2 h-2 bg-border-soft hover:bg-body-tertiary'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={page === totalPages - 1}
            aria-label="Next"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-card text-heading border border-border-soft hover:shadow-card-hover hover:border-polinar-red/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <span className="ml-1 text-xs font-display text-body-tertiary tracking-wider tabular-nums">
            <span className="text-heading font-semibold">{String(page + 1).padStart(2, '0')}</span>
            <span className="mx-0.5">/</span>
            <span>{String(totalPages).padStart(2, '0')}</span>
          </span>
        </div>
      )}
    </div>
  )
}
