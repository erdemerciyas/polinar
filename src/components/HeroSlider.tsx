'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getStaticLabels } from '@/data/static-labels'

type Slide = {
  title: string
  subtitle?: string
  backgroundImage?: { url: string; alt?: string }
  ctaLabel?: string
  ctaLink?: string
  overlayOpacity?: number
  textAlignment?: 'left' | 'center' | 'right'
  textPosition?: 'top' | 'center' | 'bottom'
  titleSize?: 'small' | 'medium' | 'large'
  animateText?: boolean
  textAnimation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
}

type SliderSettings = {
  autoPlay?: boolean
  interval?: number
  transitionDuration?: number
  transitionType?: 'fade' | 'slide' | 'zoom' | 'slideUp'
  pauseOnHover?: boolean
  showArrows?: boolean
  showDots?: boolean
}

type HeroSliderProps = {
  slides: Slide[]
  settings?: SliderSettings
  locale: string
}

const defaultSettings: Required<SliderSettings> = {
  autoPlay: true,
  interval: 5000,
  transitionDuration: 800,
  transitionType: 'fade',
  pauseOnHover: true,
  showArrows: true,
  showDots: true,
}

function getSlideVariants(type: string, duration: number) {
  const sec = duration / 1000
  const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
  const transition = { duration: sec, ease }

  switch (type) {
    case 'slide':
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1, transition },
        exit: { x: '-100%', opacity: 0, transition },
      }
    case 'zoom':
      return {
        initial: { scale: 1.2, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition },
        exit: { scale: 0.9, opacity: 0, transition },
      }
    case 'slideUp':
      return {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1, transition },
        exit: { y: '-50%', opacity: 0, transition },
      }
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: sec, ease: 'easeInOut' as const } },
        exit: { opacity: 0, transition: { duration: sec * 0.6, ease: 'easeInOut' as const } },
      }
  }
}

function getTextVariants(animation: string) {
  switch (animation) {
    case 'fadeIn':
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    case 'slideLeft':
      return { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }
    case 'slideRight':
      return { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } }
    case 'fadeUp':
    default:
      return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
  }
}

const titleSizeClasses: Record<string, string> = {
  small: 'text-xl sm:text-2xl lg:text-3xl',
  medium: 'text-2xl sm:text-3xl lg:text-4xl',
  large: 'text-3xl sm:text-4xl lg:text-5xl',
}

const textAlignClasses: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

const textPositionClasses: Record<string, string> = {
  top: 'items-start pt-[168px] sm:pt-[200px]',
  center: 'items-center pt-[72px]',
  bottom: 'items-end pb-24 sm:pb-32 pt-[72px]',
}

export function HeroSlider({ slides, settings, locale }: HeroSliderProps) {
  const cfg = { ...defaultSettings, ...settings }
  const labels = getStaticLabels(locale)
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const containerRef = useRef<HTMLElement>(null)
  const touchStartRef = useRef<number>(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setActive((prev) => (prev + 1) % slides.length)
    progressRef.current = 0
    setProgress(0)
    lastTimeRef.current = 0
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((prev) => (prev - 1 + slides.length) % slides.length)
    progressRef.current = 0
    setProgress(0)
    lastTimeRef.current = 0
  }, [slides.length])

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1)
    setActive(idx)
    progressRef.current = 0
    setProgress(0)
    lastTimeRef.current = 0
  }, [active])

  // Auto-play with progress tracking via requestAnimationFrame
  useEffect(() => {
    if (slides.length <= 1 || !cfg.autoPlay || isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const elapsed = timestamp - lastTimeRef.current
      progressRef.current = Math.min(elapsed / cfg.interval, 1)
      setProgress(progressRef.current)

      if (progressRef.current >= 1) {
        setDirection(1)
        setActive((prev) => (prev + 1) % slides.length)
        progressRef.current = 0
        setProgress(0)
        lastTimeRef.current = 0
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, slides.length, cfg.autoPlay, cfg.interval, isPaused])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    const el = containerRef.current
    if (el) {
      el.addEventListener('keydown', handleKey)
      return () => el.removeEventListener('keydown', handleKey)
    }
  }, [next, prev])

  if (!slides || slides.length === 0) return null

  const slide = slides[active]
  const overlayOpacity = (slide?.overlayOpacity ?? 60) / 100
  const textAlign = slide?.textAlignment || 'left'
  const textPos = slide?.textPosition || 'center'
  const titleSize = slide?.titleSize || 'large'
  const shouldAnimate = slide?.animateText !== false
  const textAnim = slide?.textAnimation || 'fadeUp'

  const slideVariants = getSlideVariants(cfg.transitionType, cfg.transitionDuration)
  const textVariant = getTextVariants(textAnim)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85dvh] overflow-hidden grain-overlay focus:outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.aria.heroSlider}
      onMouseEnter={() => cfg.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => cfg.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={slideVariants.initial}
          animate={slideVariants.animate}
          exit={slideVariants.exit}
        >
          {slide?.backgroundImage?.url ? (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: cfg.interval / 1000 + 2, ease: 'linear' }}
              key={`ken-burns-${active}`}
            >
              <Image
                src={slide.backgroundImage.url}
                alt={slide.backgroundImage.alt || slide.title || ''}
                fill
                sizes="100vw"
                priority={active === 0}
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-navy" />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgba(10,17,40,${overlayOpacity}) 0%, rgba(10,17,40,${overlayOpacity * 0.75}) 40%, rgba(10,17,40,${overlayOpacity * 0.35}) 100%)`,
            }}
          />

          <div className={`relative z-10 flex h-full max-w-container mx-auto px-4 sm:px-6 lg:px-8 ${textPositionClasses[textPos]}`}>
            <div className={`flex flex-col max-w-2xl w-full ${textAlignClasses[textAlign]}`}>
              {shouldAnimate ? (
                <motion.div
                  className={`flex flex-col ${textAlignClasses[textAlign]}`}
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
                >
                  <motion.h1
                    className={`font-display font-extrabold text-white ${titleSizeClasses[titleSize]} tracking-tight-heading leading-tight`}
                    variants={textVariant}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {slide?.title}
                  </motion.h1>
                  {slide?.subtitle && (
                    <motion.p
                      className="mt-4 text-white/80 text-lg font-body max-w-xl"
                      variants={textVariant}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                  {slide?.ctaLabel && slide?.ctaLink && (
                    <motion.div
                      variants={textVariant}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Link href={slide.ctaLink} className="btn-primary mt-6 inline-block">
                        {slide.ctaLabel}
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <>
                  <h1 className={`font-display font-extrabold text-white ${titleSizeClasses[titleSize]} tracking-tight-heading leading-tight`}>
                    {slide?.title}
                  </h1>
                  {slide?.subtitle && (
                    <p className="mt-4 text-white/80 text-lg font-body max-w-xl">{slide.subtitle}</p>
                  )}
                  {slide?.ctaLabel && slide?.ctaLink && (
                    <Link href={slide.ctaLink} className="btn-primary mt-6 inline-block">
                      {slide.ctaLabel}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots with progress */}
      {cfg.showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="relative w-10 h-1.5 rounded-full overflow-hidden bg-white/30 transition-all duration-300 hover:bg-white/50"
            >
              {idx === active ? (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              ) : (
                <div className="absolute inset-0 bg-transparent" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Prev / Next arrows */}
      {cfg.showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label={labels.aria.previousSlide}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden sm:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label={labels.aria.nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden sm:flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-6 z-20 text-white/60 text-xs font-display tracking-wider">
          <span className="text-white font-semibold">{String(active + 1).padStart(2, '0')}</span>
          <span className="mx-1">/</span>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      )}
    </section>
  )
}
