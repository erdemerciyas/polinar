'use client'

import { AnimatePresence, motion, useInView, useScroll, useTransform, type Variants } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

type SubtitleSlide = {
  title?: string
  description: string
}

type CoreValuesSectionProps = {
  title: string
  description: string
  locale: string
  subtitleSlides?: SubtitleSlide[]
}

const defaultKeys = ['quality', 'robust', 'durable', 'reliable']

function parseValues(title: string): { word: string; iconKey: string }[] {
  const parts = title.split('/').map(s => s.trim()).filter(Boolean)
  if (parts.length < 2) return [{ word: title, iconKey: 'quality' }]

  return parts.map((word, i) => ({
    word,
    iconKey: defaultKeys[i] || defaultKeys[i % defaultKeys.length],
  }))
}

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 16 }

function ValueIcon({ iconKey, isInView }: { iconKey: string; isInView: boolean }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: { duration: 1.4, ease: EASE },
  }
  const d2 = { ...draw, transition: { ...draw.transition, delay: 0.5, duration: 0.9 } }

  const map: Record<string, React.ReactNode> = {
    quality: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.4}>
        <motion.path d="M24 6l5.4 11 12.1 1.8-8.8 8.5 2.1 12L24 33.6 13.2 39.3l2.1-12-8.8-8.5L18.6 17z" strokeLinecap="round" strokeLinejoin="round" {...draw} />
      </svg>
    ),
    robust: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.4}>
        <motion.path d="M24 5l15 6v11c0 9-6.5 17-15 20-8.5-3-15-11-15-20V11z" strokeLinecap="round" strokeLinejoin="round" {...draw} />
      </svg>
    ),
    durable: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.4}>
        <motion.path d="M24 6l16 8v10c0 9.5-7 18-16 22-9-4-16-12.5-16-22V14z" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        <motion.rect x="18" y="20" width="12" height="14" rx="1.5" {...d2} />
      </svg>
    ),
    reliable: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.4}>
        <motion.circle cx="24" cy="24" r="17" {...draw} />
        <motion.path d="M16 24.5l5.5 5.5L33 18.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} {...d2} />
      </svg>
    ),
  }
  return map[iconKey] || map.quality
}

function DotsCluster() {
  return (
    <svg className="cv-dots" viewBox="0 0 80 80" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={6 + c * 16} cy={6 + r * 16} r={2.2} fill="currentColor" />
        )),
      )}
    </svg>
  )
}

function octagonPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 8) + (Math.PI * 2 * i) / 8
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
  }
  return pts.join(' ')
}

const OCTAGON_VIEWBOX = 200
const OCTAGON_CENTER = OCTAGON_VIEWBOX / 2
const RINGS: { outerR: number; innerR: number }[] = [
  { outerR: 95, innerR: 78 },
  { outerR: 68, innerR: 60 },
  { outerR: 50, innerR: 42 },
  { outerR: 32, innerR: 24 },
  { outerR: 16, innerR: 0 },
]

function buildRingPath(outerR: number, innerR: number): string {
  const C = OCTAGON_CENTER
  const outer = octagonPoints(C, C, outerR)
  if (innerR <= 0) return `M ${outer.split(' ').map(p => p.replace(',', ' ')).join(' L ')} Z`
  const inner = octagonPoints(C, C, innerR)
  const outerParts = outer.split(' ').map(p => p.replace(',', ' '))
  const innerParts = inner.split(' ').map(p => p.replace(',', ' ')).reverse()
  return `M ${outerParts.join(' L ')} Z M ${innerParts.join(' L ')} Z`
}

const ringPaths = RINGS.map(r => buildRingPath(r.outerR, r.innerR))

function OctagonRing({ d, scrollYProgress, index }: {
  d: string
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
}) {
  const reversed = RINGS.length - 1 - index
  const waveOffset = reversed * 0.1
  const start = 0.0 + waveOffset
  const mid = 0.15 + waveOffset
  const end = 0.35 + waveOffset
  const scale = useTransform(scrollYProgress, [start, mid, end], [0.92, 1.02, 1])
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0, 0.7, 1])

  return (
    <motion.path
      d={d}
      fill="#EDBA13"
      fillRule="evenodd"
      style={{ scale, opacity, transformOrigin: 'center' }}
    />
  )
}

function NestedOctagons() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.15'],
  })

  return (
    <div ref={ref} className="cv-octagons" aria-hidden="true">
      <svg viewBox={`0 0 ${OCTAGON_VIEWBOX} ${OCTAGON_VIEWBOX}`} className="cv-octagons-svg">
        {ringPaths.map((d, i) => (
          <OctagonRing key={i} d={d} scrollYProgress={scrollYProgress} index={i} />
        ))}
      </svg>
    </div>
  )
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: SPRING },
}

const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function CoreValuesSection({ title, description, subtitleSlides }: CoreValuesSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const values = parseValues(title)

  const slides = useMemo<SubtitleSlide[]>(() => {
    const list: SubtitleSlide[] = []
    if (description) list.push({ description })
    if (subtitleSlides?.length) {
      for (const s of subtitleSlides) {
        if (s?.description) list.push({ title: s.title, description: s.description })
      }
    }
    return list
  }, [description, subtitleSlides])

  const [[active, direction], setActiveDir] = useState<[number, 1 | -1]>([0, 1])
  const [paused, setPaused] = useState(false)

  const goTo = (next: number, dir: 1 | -1) => {
    if (slides.length === 0) return
    const wrapped = ((next % slides.length) + slides.length) % slides.length
    setActiveDir([wrapped, dir])
  }

  useEffect(() => {
    if (slides.length < 2 || paused) return
    const id = setInterval(() => {
      setActiveDir(([i]) => [(i + 1) % slides.length, 1])
    }, 5500)
    return () => clearInterval(id)
  }, [slides.length, paused])

  const current = slides[active] || { description: '' }

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden cv-section">
      <div className="cv-deco cv-deco--dots" aria-hidden="true">
        <DotsCluster />
      </div>
      <NestedOctagons />

      <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="cv-header"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {slides.length > 0 && (
            <motion.div
              className="cv-subtitle-wrap"
              variants={fade}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="cv-subtitle-stage">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={active}
                    className="cv-subtitle-slide"
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    {current.title && <span className="cv-subtitle-tag">{current.title}</span>}
                    <p className="cv-subtitle">{current.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {slides.length > 1 && (
                <div className="cv-subtitle-dots" role="tablist" aria-label="Slides">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Slide ${i + 1}`}
                      className={`cv-subtitle-dot${i === active ? ' is-active' : ''}`}
                      onClick={() => goTo(i, i > active ? 1 : -1)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="cv-grid"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {values.map((v, i) => (
            <motion.div key={v.iconKey + i} className="cv-card" variants={cardReveal}>
              <div className="cv-card-body">
                <div className="cv-card-icon">
                  <ValueIcon iconKey={v.iconKey} isInView={inView} />
                </div>
                <span className="cv-card-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="cv-card-title">{v.word}</h3>
                <span className="cv-card-rule" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
