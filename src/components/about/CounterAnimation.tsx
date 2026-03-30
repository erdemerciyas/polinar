'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCard {
  number: number
  suffix?: string | null
  label: string
  icon?: string | null
}

export function CounterAnimation({ cards }: { cards: StatCard[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="text-center p-6 lg:p-8 rounded-[3px] bg-white/5 backdrop-blur-sm border border-white/10"
        >
          {card.icon && <span className="text-3xl lg:text-4xl mb-3 block">{card.icon}</span>}
          <div className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight-heading mb-2">
            <AnimatedNumber target={card.number} active={visible} />
            {card.suffix && <span className="text-polinar-red">{card.suffix}</span>}
          </div>
          <p className="text-white/70 font-body text-sm lg:text-base">{card.label}</p>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ target, active }: { target: number; active: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      current = Math.round(eased * target)
      setValue(current)
      if (step >= steps) {
        setValue(target)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [active, target])

  return <span>{value.toLocaleString()}</span>
}
