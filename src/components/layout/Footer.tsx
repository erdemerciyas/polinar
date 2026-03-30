'use client'

import Link from 'next/link'
import { getStaticLabels } from '@/data/static-labels'

type FooterData = {
  labels?: {
    addressLabel?: string
    phoneFaxLabel?: string
    emailLabel?: string
    newsletterLabel?: string
    subscribeButton?: string
    namePlaceholder?: string
    emailPlaceholder?: string
  }
  copyrightText?: string
}

export function Footer({ data, locale }: { data?: FooterData | null; locale: string }) {
  const cmsLabels = data?.labels || {}
  const staticLabels = getStaticLabels(locale)

  return (
    <footer className="relative bg-navy-deep text-white grain-overlay overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <img src="/brand_assets/logo.png" alt="Polinar" className="h-[40px] w-auto brightness-0 invert" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-white/90">{cmsLabels.addressLabel || ''}</h4>
            <p className="text-white/60 font-body text-sm leading-body">
              {staticLabels.company.address.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-white/90">{cmsLabels.phoneFaxLabel || ''}</h4>
            <div className="space-y-2 text-white/60 font-body text-sm">
              {staticLabels.company.phones.map((phone) => (
                <p key={phone}>{phone}</p>
              ))}
              <p>{staticLabels.company.fax}</p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-white/90">{cmsLabels.emailLabel || ''}</h4>
            <a href={`mailto:${staticLabels.company.email}`} className="text-white/60 font-body text-sm hover:text-polinar-red transition-colors">
              {staticLabels.company.email}
            </a>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-white/90">{cmsLabels.newsletterLabel || ''}</h4>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder={cmsLabels.namePlaceholder || ''}
                className="bg-white/10 border border-white/20 rounded-[3px] px-4 py-2 text-white text-sm font-body placeholder-white/40 focus:outline-none focus:border-polinar-red transition-colors"
              />
              <input
                type="email"
                placeholder={cmsLabels.emailPlaceholder || ''}
                className="bg-white/10 border border-white/20 rounded-[3px] px-4 py-2 text-white text-sm font-body placeholder-white/40 focus:outline-none focus:border-polinar-red transition-colors"
              />
              <button type="submit" className="btn-primary text-center">{cmsLabels.subscribeButton || ''}</button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 font-body text-xs">{data?.copyrightText || ''}</p>
          <div className="flex items-center gap-4">
            {staticLabels.company.socialLinks.map(({ name, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-cyan transition-colors" aria-label={name}>
                <span className="text-xs font-display">{name[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
