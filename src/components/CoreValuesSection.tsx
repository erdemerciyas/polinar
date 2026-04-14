'use client'

import { motion, useInView, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef } from 'react'

type CoreValuesSectionProps = {
  title: string
  description: string
  locale: string
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
    transition: { duration: 1.6, ease: EASE },
  }
  const d2 = { ...draw, transition: { ...draw.transition, delay: 0.6, duration: 1 } }

  const map: Record<string, React.ReactNode> = {
    quality: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <motion.path d="M24 4l6 11.5L42 18l-9 9 2 13-11-5.5L13 40l2-13-9-9 12-2.5z" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        <motion.path d="M24 14v11m-5 3l5-3 5 3" strokeLinecap="round" strokeLinejoin="round" {...d2} />
      </svg>
    ),
    robust: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <motion.circle cx="24" cy="24" r="10" {...draw} />
        <motion.circle cx="24" cy="24" r="4" {...d2} />
        <motion.path d="M24 4v7m0 26v7M4 24h7m26 0h7" strokeLinecap="round" {...d2} />
        <motion.path d="M10 10l5 5m18 18l5 5M38 10l-5 5M10 38l5-5" strokeLinecap="round" opacity={0.4} {...d2} />
      </svg>
    ),
    durable: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <motion.path d="M24 4L8 13v11c0 10 7 19 16 21.5 9-2.5 16-11.5 16-21.5V13z" strokeLinecap="round" strokeLinejoin="round" {...draw} />
        <motion.path d="M24 4v40.5" strokeLinecap="round" opacity={0.25} {...d2} />
        <motion.path d="M8 13l16 8.5 16-8.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.3} {...d2} />
      </svg>
    ),
    reliable: (
      <svg className="cv-ico" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <motion.rect x="6" y="10" width="36" height="28" rx="4" {...draw} />
        <motion.path d="M16 24l5 5L32 19" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} {...d2} />
        <motion.path d="M6 17h36" strokeLinecap="round" opacity={0.25} {...d2} />
      </svg>
    ),
  }
  return map[iconKey] || map.quality
}

function FloatingGeo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 120])
  const r1 = useTransform(scrollYProgress, [0, 1], [-10, 45])
  const r2 = useTransform(scrollYProgress, [0, 1], [10, -35])

  return (
    <div ref={ref} className="cv-float-wrap" aria-hidden="true">
      <motion.svg className="cv-float cv-float--1" style={{ y: y1, rotate: r1 }} viewBox="0 0 120 120" fill="none" stroke="currentColor">
        <polygon points="60,8 112,38 112,92 60,122 8,92 8,38" strokeWidth={1} />
        <polygon points="60,28 88,46 88,82 60,100 32,82 32,46" strokeWidth={0.6} opacity={0.5} />
      </motion.svg>
      <motion.svg className="cv-float cv-float--2" style={{ y: y2, rotate: r2 }} viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="42" strokeWidth={1} />
        <circle cx="50" cy="50" r="26" strokeWidth={0.6} opacity={0.5} />
        <line x1="50" y1="4" x2="50" y2="96" strokeWidth={0.5} opacity={0.4} />
        <line x1="4" y1="50" x2="96" y2="50" strokeWidth={0.5} opacity={0.4} />
      </motion.svg>
      <motion.svg className="cv-float cv-float--3" style={{ y: y1, rotate: r2 }} viewBox="0 0 80 80" fill="none" stroke="currentColor">
        <rect x="10" y="10" width="60" height="60" strokeWidth={0.8} transform="rotate(45 40 40)" />
        <rect x="20" y="20" width="40" height="40" strokeWidth={0.5} opacity={0.5} transform="rotate(45 40 40)" />
      </motion.svg>
      <motion.svg className="cv-float cv-float--4" style={{ y: y2, rotate: r1 }} viewBox="0 0 80 80" fill="none" stroke="currentColor">
        <polygon points="40,6 74,66 6,66" strokeWidth={0.8} />
        <polygon points="40,22 58,56 22,56" strokeWidth={0.5} opacity={0.45} />
      </motion.svg>
    </div>
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

const OCTAGON_LAYERS = 5
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
      fill="#E30613"
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
      <svg
        viewBox={`0 0 ${OCTAGON_VIEWBOX} ${OCTAGON_VIEWBOX}`}
        className="cv-octagons-svg"
      >
        {ringPaths.map((d, i) => (
          <OctagonRing
            key={i}
            d={d}
            scrollYProgress={scrollYProgress}
            index={i}
          />
        ))}
      </svg>
    </div>
  )
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
}

const panelReveal = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING },
}

const numReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...SPRING, delay: 0.1 } },
}

const barScale = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
}

const descReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...SPRING, delay: 0.7 } },
}

export function CoreValuesSection({ title, description }: CoreValuesSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const values = parseValues(title)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden cv-section">
      <FloatingGeo />
      <NestedOctagons />

      <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="cv-strip"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {values.map((v, i) => (
            <motion.div
              key={v.iconKey + i}
              className="cv-panel group"
              variants={panelReveal}
            >
              <div className="cv-panel-bg" aria-hidden="true" />

              <motion.span className="cv-panel-num" variants={numReveal}>
                {String(i + 1).padStart(2, '0')}
              </motion.span>

              <div className="cv-panel-icon">
                <ValueIcon iconKey={v.iconKey} isInView={inView} />
              </div>

              <motion.div className="cv-panel-bar" variants={barScale} />

              <h3 className="cv-panel-title">{v.word}</h3>

              <div className="cv-panel-glow" aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="cv-desc"
          variants={descReveal}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}
