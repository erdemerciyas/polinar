import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { I18nPanel } from './I18nPanel'

export default function I18nGenerateView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter className="py-12">
        <header className="mb-12 max-w-prose">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight-heading text-navy-deep mb-4">
            Yerelleştirme (i18n) Yönetimi
          </h1>
          <p className="font-body text-lg text-body-muted leading-relaxed">
            Sistemdeki tüm sabit metinleri ve menüleri tek bir <code>en.json</code> dosyası olarak dışa aktarabilir, çevirilerini kod tarafında yapabilirsiniz.
          </p>
          <hr className="mt-8 border-t-2 border-polinar-mustard w-16 opacity-80" />
        </header>

        <div className="bg-white rounded-card-lg border border-border-faint shadow-diffused p-6 md:p-10 transition-[box-shadow,transform] duration-500 ease-spring hover:shadow-card-hover hover:-translate-y-1">
          <I18nPanel />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
