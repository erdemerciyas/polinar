'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSelector } from './LanguageSelector'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
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
  const items = buildNavItems(navData, locale)
  const labels = getStaticLabels(locale)

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-nav">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href={`/${locale}`} className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/brand_assets/logo.png"
                alt="Polinar"
                width={120}
                height={36}
                className="h-[36px] w-auto"
                priority
              />
            </Link>

            <MegaMenu locale={locale} items={items} ctaLabels={navData?.megaMenuCTA} commonLabels={commonLabels} />

            <div className="flex items-center gap-3">
              <LanguageSelector locale={locale} languages={languages} />

              <button
                className="lg:hidden relative flex items-center justify-center w-10 h-10"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? labels.aria.closeMenu : labels.aria.openMenu}
              >
                <span
                  className={`absolute block w-6 h-[2px] bg-heading transition-all duration-300 ease-spring ${
                    mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-[7px]'
                  }`}
                />
                <span
                  className={`absolute block w-6 h-[2px] bg-heading transition-all duration-300 ease-spring ${
                    mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute block w-6 h-[2px] bg-heading transition-all duration-300 ease-spring ${
                    mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-[7px]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu locale={locale} items={items} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
