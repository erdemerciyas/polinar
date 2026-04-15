'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-navy-deep/97 z-[100] flex flex-col items-center justify-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white"
            onClick={onClose}
            aria-label={labels.aria.closeMenu}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            className="w-full max-w-sm mx-auto pt-20 px-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
            }}
          >
            {items.map((item) => (
              <motion.div
                key={item.key}
                className="border-b border-white/10"
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                  },
                }}
              >
                {item.megaMenu ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between text-white font-display font-bold text-lg py-4 hover:text-polinar-mustard transition-colors"
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ease-spring ${expandedItem === item.key ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {expandedItem === item.key && (
                        <motion.div
                          className="pb-4 pl-4 space-y-2 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        >
                          {item.megaMenu.map((menuItem, idx) => (
                            <Link
                              key={idx}
                              href={menuItem.href}
                              className="block text-white/60 font-body text-sm py-1.5 hover:text-white hover:translate-x-1 transition-all duration-300"
                              onClick={onClose}
                            >
                              {menuItem.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={`/${locale}${item.path}`}
                    className="block text-white font-display font-bold text-lg py-4 hover:text-polinar-mustard transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
