'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export type MegaMenuItem = {
  title: string
  description: string
  icon: string
  href: string
  image?: { url?: string; alt?: string } | null
}

export type NavItem = {
  key: string
  path: string
  label: string
  megaMenu?: MegaMenuItem[]
}

type CTALabels = {
  title?: string
  description?: string
  button?: string
}

type CommonLabels = {
  learnMore?: string
}

function MegaMenuIcon({ name }: { name: string }) {
  const cls = 'w-7 h-7'
  switch (name) {
    case 'moulds':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    case 'machinery':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    case 'testing':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94 2.06a2.25 2.25 0 0 0 2.036 3.19h11.808a2.25 2.25 0 0 0 2.036-3.19L19 14.5m-14 0h14" />
        </svg>
      )
    default:
      return null
  }
}

const categoryTheme: Record<string, {
  iconBg: string; iconText: string; hoverIconBg: string;
  hoverBorder: string; linkText: string; fallbackImage: string;
}> = {
  moulds: {
    iconBg: 'bg-moulds-gold/10',
    iconText: 'text-moulds-gold',
    hoverIconBg: 'group-hover:bg-moulds-gold',
    hoverBorder: 'hover:border-moulds-gold/20',
    linkText: 'text-moulds-gold',
    fallbackImage: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050250/polinar/static/moulds-hero.jpg',
  },
  machinery: {
    iconBg: 'bg-polinar-red/10',
    iconText: 'text-polinar-red',
    hoverIconBg: 'group-hover:bg-polinar-red',
    hoverBorder: 'hover:border-polinar-red/20',
    linkText: 'text-polinar-red',
    fallbackImage: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050215/polinar/static/machinery-hero.jpg',
  },
  testing: {
    iconBg: 'bg-pte-cyan/10',
    iconText: 'text-pte-cyan',
    hoverIconBg: 'group-hover:bg-pte-cyan',
    hoverBorder: 'hover:border-pte-cyan/20',
    linkText: 'text-pte-cyan',
    fallbackImage: 'https://res.cloudinary.com/dtdogh9wg/image/upload/v1775050294/polinar/static/testing-hero.jpg',
  },
}

const defaultCategoryTheme = categoryTheme.machinery

export function MegaMenu({
  locale,
  items,
  ctaLabels,
  commonLabels,
}: {
  locale: string
  items: NavItem[]
  ctaLabels?: CTALabels | null
  commonLabels?: CommonLabels | null
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function handleEnter(key: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenMenu(key)
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <nav className="hidden lg:flex items-center gap-1" ref={menuRef}>
      {items.map((item) => (
        <div
          key={item.key}
          className="relative"
          onMouseEnter={() => (item.megaMenu ? handleEnter(item.key) : undefined)}
          onMouseLeave={item.megaMenu ? handleLeave : undefined}
        >
          <Link
            href={`/${locale}${item.path}`}
            className="nav-link font-display font-semibold text-[14px] text-heading tracking-wide px-3 py-5 inline-block"
          >
            {item.label}
            {item.megaMenu && (
              <svg
                className={`w-3 h-3 ml-1 inline-block transition-transform duration-300 ${openMenu === item.key ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>

          <AnimatePresence>
            {item.megaMenu && openMenu === item.key && (
              <motion.div
                className="fixed left-0 right-0 top-[72px] bg-white border-t-2 border-polinar-red shadow-mega z-50"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                onMouseEnter={() => handleEnter(item.key)}
                onMouseLeave={handleLeave}
              >
                <motion.div
                  className="max-w-container mx-auto px-8 py-10 grid grid-cols-4 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {item.megaMenu.map((menuItem, idx) => {
                    const theme = categoryTheme[menuItem.icon] || defaultCategoryTheme
                    const imageUrl = menuItem.image?.url || theme.fallbackImage
                    return (
                      <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
                        }}
                      >
                        <Link
                          href={menuItem.href}
                          className={`group rounded-card border border-border-soft ${theme.hoverBorder} hover:shadow-card-hover transition-all duration-300 overflow-hidden block`}
                          onClick={() => setOpenMenu(null)}
                        >
                          {imageUrl && (
                            <div className="relative aspect-[2/1] bg-gray-light overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={menuItem.image?.alt || menuItem.title}
                                fill
                                sizes="25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-smooth-out"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <div className={`w-10 h-10 rounded-card-sm ${theme.iconBg} ${theme.iconText} flex items-center justify-center mb-3 ${theme.hoverIconBg} group-hover:text-white transition-colors duration-300`}>
                              <MegaMenuIcon name={menuItem.icon} />
                            </div>
                            <h4 className="font-display font-bold text-heading text-base mb-1.5">
                              {menuItem.title}
                            </h4>
                            <p className="text-sm text-body-secondary font-body leading-relaxed mb-3">
                              {menuItem.description}
                            </p>
                            <span className={`${theme.linkText} font-display font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300`}>
                              {commonLabels?.learnMore || 'Learn More'}
                              <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                              </span>
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
                    }}
                    className="bg-navy rounded-card p-6 flex flex-col justify-between text-white"
                  >
                    <div>
                      <h4 className="font-display font-bold text-lg mb-3">
                        {ctaLabels?.title || 'Get in Touch'}
                      </h4>
                      <p className="text-white/70 text-sm font-body leading-relaxed mb-6">
                        {ctaLabels?.description || ''}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/contact`}
                      className="btn-primary text-center text-sm"
                      onClick={() => setOpenMenu(null)}
                    >
                      {ctaLabels?.button || 'Contact Us'}
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  )
}
