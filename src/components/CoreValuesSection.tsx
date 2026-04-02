'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type CoreValuesSectionProps = {
  title: string
  description: string
  locale: string
}

const valueIcons: Record<string, React.ReactNode> = {
  quality: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 36 36" stroke="currentColor" strokeWidth={1.3}>
      <path d="M18 3l4.326 8.557L32 13.236l-7 6.691L26.652 30 18 25.557 9.348 30 11 19.927l-7-6.691 9.674-1.679z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10v8m-3.5 2L18 18l3.5 2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
    </svg>
  ),
  robust: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 36 36" stroke="currentColor" strokeWidth={1.3}>
      <circle cx="18" cy="18" r="7" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M18 4v4m0 20v4M4 18h4m20 0h4" strokeLinecap="round" />
      <path d="M8.2 8.2l2.8 2.8m14 14l2.8 2.8M27.8 8.2l-2.8 2.8M11 25l-2.8 2.8" strokeLinecap="round" opacity={0.35} />
    </svg>
  ),
  durable: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 36 36" stroke="currentColor" strokeWidth={1.3}>
      <path d="M18 4L6 10v8c0 7.7 5.4 14 12 16.2 6.6-2.2 12-8.5 12-16.2v-8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 4v30.2" strokeLinecap="round" opacity={0.2} />
      <path d="M6 10l12 6 12-6" strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
    </svg>
  ),
  reliable: (
    <svg className="w-9 h-9" fill="none" viewBox="0 0 36 36" stroke="currentColor" strokeWidth={1.3}>
      <rect x="5" y="8" width="26" height="20" rx="3" />
      <path d="M13 18l3.5 3.5L23 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
      <path d="M5 13h26" strokeLinecap="round" opacity={0.25} />
    </svg>
  ),
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

const EASE = [0.32, 0.72, 0, 1] as const

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, delay: 0.05, ease: EASE },
  },
}

const descVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.65, ease: EASE },
  },
}

export function CoreValuesSection({ title, description }: CoreValuesSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const values = parseValues(title)

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden core-values-bg"
    >
      {/* Precision grid pattern */}
      <div className="precision-grid" aria-hidden="true" />

      {/* Grain overlay */}
      <div className="grain-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Thin red rule at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-polinar-red to-transparent origin-center"
        variants={lineVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      />

      <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value pillars */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px core-values-grid-wrap"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {values.map((v, i) => (
            <motion.div
              key={v.iconKey + i}
              className="core-value-pillar group"
              variants={cardVariants}
            >
              {/* Subtle index */}
              <span className="core-value-index">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="core-value-icon">
                {valueIcons[v.iconKey] || valueIcons.quality}
              </div>

              {/* Value word */}
              <h3 className="font-display font-extrabold text-white uppercase text-base lg:text-lg tracking-[0.08em] mt-4 mb-0">
                {v.word}
              </h3>

              {/* Bottom accent on hover */}
              <div className="core-value-bar" />
            </motion.div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto text-center text-white/55 font-body text-base lg:text-lg leading-relaxed mt-10 lg:mt-14"
          variants={descVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}
