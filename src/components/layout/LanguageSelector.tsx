'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Language } from '@/lib/i18n'

type Props = {
  locale: string
  languages: Language[]
}

export function LanguageSelector({ locale, languages }: Props) {
  const pathname = usePathname()

  function getLocalizedPath(targetLocale: string) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang, i) => (
        <span key={lang.code} className="flex items-center gap-1">
          <Link
            href={getLocalizedPath(lang.code)}
            className={`lang-btn ${lang.code === locale ? 'active' : ''}`}
            title={lang.nativeLabel}
          >
            {lang.flagEmoji ? `${lang.flagEmoji} ` : ''}{lang.shortLabel}
          </Link>
          {i < languages.length - 1 && (
            <span className="text-[#ccc] text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  )
}
