'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatCard {
  number: number
  suffix?: string | null
  label: string
  icon?: string | null
}

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 16 }
const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

const iconMap: Record<string, React.ReactNode> = {
  '📅': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.2}>
      <rect x="3" y="6" width="26" height="22" rx="3" />
      <path d="M3 13h26" />
      <path d="M10 3v5M22 3v5" strokeLinecap="round" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="22" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  '🌍': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.2}>
      <circle cx="16" cy="16" r="13" />
      <ellipse cx="16" cy="16" rx="6" ry="13" />
      <path d="M3 16h26" />
      <path d="M5 9h22M5 23h22" strokeDasharray="2 2" strokeWidth={0.8} />
    </svg>
  ),
  '🏭': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.2}>
      <path d="M2 28V14l8-5v7l8-5v7l8-5v10H2z" strokeLinejoin="round" />
      <rect x="22" y="4" width="6" height="24" rx="1" />
      <path d="M24 4v-1h2v1" strokeLinecap="round" />
      <rect x="6" y="20" width="3" height="4" rx="0.5" />
      <rect x="13" y="20" width="3" height="4" rx="0.5" />
    </svg>
  ),
  '⚙️': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.2}>
      <circle cx="16" cy="16" r="5" />
      <path d="M16 3v4m0 18v4M3 16h4m18 0h4M7.1 7.1l2.8 2.8m12.2 12.2l2.8 2.8M24.9 7.1l-2.8 2.8M9.9 22.1l-2.8 2.8" strokeLinecap="round" />
    </svg>
  ),
}

function getIcon(emoji: string | null | undefined) {
  if (!emoji) return null
  return iconMap[emoji.trim()] || null
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...SPRING,
      delay: i * 0.12,
    },
  }),
}

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: { duration: 0.8, ease: EASE, delay: 0.3 + i * 0.12 },
  }),
}

const iconVariants = {
  hidden: { scale: 0, rotate: -30 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: { ...SPRING, delay: 0.15 + i * 0.12 },
  }),
}

export function CounterAnimation({ cards }: { cards: StatCard[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="stat-grid">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          className="stat-card group"
          custom={idx}
          variants={cardVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Corner accents */}
          <span className="stat-corner stat-corner--tl" aria-hidden="true" />
          <span className="stat-corner stat-corner--br" aria-hidden="true" />

          {/* Top accent line */}
          <motion.div
            className="stat-accent-line"
            custom={idx}
            variants={lineVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            aria-hidden="true"
          />

          {/* Index marker */}
          <span className="stat-index">{String(idx + 1).padStart(2, '0')}</span>

          {/* Icon */}
          {card.icon && (
            <motion.div
              className="stat-icon"
              custom={idx}
              variants={iconVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {getIcon(card.icon) || <span className="text-2xl">{card.icon}</span>}
            </motion.div>
          )}

          {/* Number */}
          <div className="stat-number">
            <AnimatedNumber target={card.number} active={inView} />
            {card.suffix && <span className="stat-suffix">{card.suffix}</span>}
          </div>

          {/* Divider */}
          <div className="stat-divider" aria-hidden="true">
            <span className="stat-divider-line" />
            <span className="stat-divider-dot" />
          </div>

          {/* Label */}
          <p className="stat-label">{card.label}</p>

          {/* Hover glow */}
          <div className="stat-glow" aria-hidden="true" />
        </motion.div>
      ))}
    </div>
  )
}

function AnimatedNumber({ target, active }: { target: number; active: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 2200
    const steps = 70
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (step >= steps) {
        setValue(target)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [active, target])

  return <span>{value.toLocaleString()}</span>
}
