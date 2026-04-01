'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

function GlobeIcon() {
  return (
    <svg
      className="i18n-nav-link__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8h13M8 1.5c-2.5 2.2-2.5 10.6 0 13M8 1.5c2.5 2.2 2.5 10.6 0 13" />
    </svg>
  )
}

export default function I18nNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin/i18n-generate'

  return (
    <a
      href="/admin/i18n-generate"
      className={`i18n-nav-link${isActive ? ' i18n-nav-link--active' : ''}`}
    >
      <GlobeIcon />
      i18n Management
    </a>
  )
}
