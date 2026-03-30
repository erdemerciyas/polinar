'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-[0_2px_8px_rgba(10,17,40,0.06)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href={`/${locale}`} className="flex-shrink-0">
              <img src="/brand_assets/logo.png" alt="Polinar" className="h-[36px] w-auto min-w-[120px]" />
            </Link>

            <MegaMenu locale={locale} items={items} ctaLabels={navData?.megaMenuCTA} commonLabels={commonLabels} />

            <div className="flex items-center gap-3">
              <LanguageSelector locale={locale} languages={languages} />

              <button
                className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px]"
                onClick={() => setMobileOpen(true)}
                aria-label={labels.aria.openMenu}
              >
                <span className="block w-6 h-[2px] bg-heading"></span>
                <span className="block w-6 h-[2px] bg-heading"></span>
                <span className="block w-6 h-[2px] bg-heading"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu locale={locale} items={items} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
