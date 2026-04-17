'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSelector } from './LanguageSelector'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import type { Language } from '@/lib/i18n'
import type { NavItem } from './MegaMenu'
import { getStaticLabels } from '@/data/static-labels'

type CmsLink = {
  label: string
  url: string
  description?: string | null
  icon?: string | null
  image?: { url?: string; alt?: string } | null
}

type CmsMenuColumn = {
  columnType: 'links' | 'featuredProducts' | 'imageCard'
  links?: CmsLink[]
}

type CmsMenuItem = {
  label: string
  type: 'link' | 'mega'
  url?: string | null
  megaMenuColumns?: CmsMenuColumn[]
}

type NavData = {
  mainMenu?: CmsMenuItem[]
}

function buildNavItems(navData: NavData | null, locale: string): NavItem[] {
  if (!navData?.mainMenu?.length) return []

  return navData.mainMenu.map((item, idx) => {
    const key = `nav-${idx}`
    const path = item.url || ''

    if (item.type === 'mega') {
      const megaLinks: NonNullable<NavItem['megaMenu']> = []
      for (const col of item.megaMenuColumns || []) {
        if (col.columnType === 'links') {
          for (const link of col.links || []) {
            megaLinks.push({
              title: link.label,
              description: link.description || '',
              icon: link.icon || '',
              href: link.url.startsWith('http') ? link.url : `/${locale}${link.url}`,
              image: link.image ?? null,
            })
          }
        }
      }
      const megaPath = path || '/our-business'
      return { key, path: megaPath, label: item.label, megaMenu: megaLinks.length ? megaLinks : undefined }
    }

    return { key, path, label: item.label }
  })
}

type HeaderProps = {
  locale: string
  languages: Language[]
  navData: (NavData & { megaMenuCTA?: { title?: string; description?: string; button?: string } }) | null
  commonLabels: any
}

export function Header({ locale, languages, navData, commonLabels }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const items = buildNavItems(navData, locale)
  const labels = getStaticLabels(locale)

  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleMegaOpenChange = useCallback((open: boolean) => setMegaOpen(open), [])

  const solid = !isHomepage || scrolled || mobileOpen || megaOpen
  const goldBar = scrolled
  const isTransparent = !solid
  const barColor = isTransparent ? 'bg-white' : 'bg-heading'

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,box-shadow,height] duration-300 ease-out ${
          goldBar
            ? 'bg-polinar-mustard shadow-nav'
            : solid
              ? 'bg-white shadow-nav'
              : 'bg-transparent'
        } ${scrolled ? 'h-[56px]' : 'h-[72px]'}`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href={`/${locale}`} className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
                <Image
                  src="/brand_assets/logo.png"
                  alt="Polinar"
                  width={200}
                  height={60}
                  className={`w-auto transition-[filter,height] duration-300 ${
                    isTransparent ? 'brightness-0 invert' : ''
                  } ${scrolled ? 'h-[48px]' : 'h-[60px]'}`}
                  priority
                />
              </Link>

              <Image
                src="/brand_assets/25-years.png"
                alt="25 Years"
                width={1024}
                height={410}
                priority
                className={`hidden sm:block w-auto transition-[filter,opacity,height] duration-300 ${
                  goldBar
                    ? 'opacity-70'
                    : isTransparent
                      ? 'brightness-0 invert'
                      : ''
                } ${scrolled ? 'h-[28px]' : 'h-[36px]'}`}
              />
            </div>

            <MegaMenu
              locale={locale}
              items={items}
              ctaLabels={navData?.megaMenuCTA}
              commonLabels={commonLabels}
              solid={solid}
              goldBar={goldBar}
              isTransparent={isTransparent}
              scrolled={scrolled}
              onOpenChange={handleMegaOpenChange}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 ${
                  isTransparent
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : goldBar
                      ? 'text-navy/60 hover:text-navy hover:bg-navy/10'
                      : 'text-body-secondary hover:text-heading hover:bg-gray-light'
                }`}
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              <LanguageSelector locale={locale} languages={languages} solid={solid} goldBar={goldBar} isTransparent={isTransparent} />

              <button
                className="lg:hidden relative flex items-center justify-center w-10 h-10"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? labels.aria.closeMenu : labels.aria.openMenu}
              >
                <span
                  className={`absolute block w-6 h-[2px] ${barColor} transition-all duration-300 ease-spring ${
                    mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-[7px]'
                  }`}
                />
                <span
                  className={`absolute block w-6 h-[2px] ${barColor} transition-all duration-300 ease-spring ${
                    mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute block w-6 h-[2px] ${barColor} transition-all duration-300 ease-spring ${
                    mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-[7px]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu locale={locale} items={items} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </>
  )
}
