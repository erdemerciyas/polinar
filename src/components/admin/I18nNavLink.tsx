'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function I18nNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin/i18n-generate'

  return (
    <a
      href="/admin/i18n-generate"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        fontSize: 13,
        textDecoration: 'none',
        color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-500)',
        background: isActive ? 'var(--theme-elevation-50)' : 'transparent',
        borderRadius: 4,
        transition: 'color 0.15s, background 0.15s',
      }}
    >
      <span style={{ fontSize: 16 }}>🌐</span>
      i18n Management
    </a>
  )
}
