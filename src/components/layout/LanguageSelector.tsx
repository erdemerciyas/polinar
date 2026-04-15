'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { Language } from '@/lib/i18n'

type Props = {
  locale: string
  languages: Language[]
  solid?: boolean
  goldBar?: boolean
  isTransparent?: boolean
}

export function LanguageSelector({ locale, languages, solid = true, goldBar = false, isTransparent = false }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const current = languages.find(l => l.code === locale)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function navigate(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  const triggerColor = isTransparent
    ? 'text-white/80 hover:text-white border-white/20 hover:border-white/40'
    : goldBar
      ? 'text-navy/70 hover:text-navy border-navy/15 hover:border-navy/30'
      : 'text-body-secondary hover:text-heading border-border-soft hover:border-border-soft'

  const chevronColor = isTransparent
    ? 'text-white/50'
    : goldBar
      ? 'text-navy/40'
      : 'text-body-tertiary'

  const dropdownBg = 'bg-white'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`lang-select-trigger ${triggerColor} transition-all duration-200`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current?.flagEmoji && <span className="text-sm leading-none">{current.flagEmoji}</span>}
        <span className="font-display font-semibold text-[13px] uppercase tracking-wide">
          {current?.shortLabel || locale.toUpperCase()}
        </span>
        <svg
          className={`w-3.5 h-3.5 ${chevronColor} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-2 ${dropdownBg} rounded-lg shadow-mega border border-border-soft overflow-hidden min-w-[140px] z-50`}
          role="listbox"
          aria-activedescendant={`lang-${locale}`}
        >
          {languages.map((lang) => {
            const isActive = lang.code === locale
            return (
              <button
                key={lang.code}
                id={`lang-${lang.code}`}
                role="option"
                aria-selected={isActive}
                onClick={() => navigate(lang.code)}
                className={`lang-select-option ${isActive ? 'lang-select-option--active' : ''}`}
              >
                {lang.flagEmoji && <span className="text-sm leading-none">{lang.flagEmoji}</span>}
                <span className="flex-1 text-left">{lang.nativeLabel}</span>
                {isActive && (
                  <svg className="w-4 h-4 text-polinar-mustard flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
