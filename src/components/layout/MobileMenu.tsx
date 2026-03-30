'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { NavItem } from './MegaMenu'
import { getStaticLabels } from '@/data/static-labels'

export function MobileMenu({
  locale,
  items,
  isOpen,
  onClose,
}: {
  locale: string
  items: NavItem[]
  isOpen: boolean
  onClose: () => void
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const labels = getStaticLabels(locale)

  function toggleSubmenu(key: string) {
    setExpandedItem(expandedItem === key ? null : key)
  }

  return (
    <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
      <button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white text-3xl"
        onClick={onClose}
        aria-label={labels.aria.closeMenu}
      >
        &times;
      </button>

      <div className="w-full max-w-sm mx-auto pt-20 px-6">
        {items.map((item) => (
          <div key={item.key} className="border-b border-white/10">
            {item.megaMenu ? (
              <>
                <button
                  className="w-full flex items-center justify-between text-white font-display font-bold text-lg py-4 hover:text-polinar-red transition-colors"
                  onClick={() => toggleSubmenu(item.key)}
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedItem === item.key ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedItem === item.key && (
                  <div className="pb-4 pl-4 space-y-2">
                    {item.megaMenu.map((menuItem, idx) => (
                      <Link
                        key={idx}
                        href={menuItem.href}
                        className="block text-white/60 font-body text-sm py-1 hover:text-white transition-colors"
                        onClick={onClose}
                      >
                        {menuItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={`/${locale}${item.path}`}
                className="block text-white font-display font-bold text-lg py-4 hover:text-polinar-red transition-colors"
                onClick={onClose}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
