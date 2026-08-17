import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import localesConfig from '@/lib/locales.json'
import { clearDictionaryCache } from '@/lib/getDictionary'

const INDEXNOW_API = '/api/indexnow'
const LOCALE_CODES = localesConfig.locales.map((locale) => locale.code)

async function notifyIndexNow(urls: string[]) {
  try {
    await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    })
  } catch {
    // IndexNow notification failed — non-critical
  }
}

function revalidateLocalePaths(
  revalidatePath: (path: string, type?: 'page' | 'layout') => void,
  basePath: string,
) {
  for (const locale of LOCALE_CODES) {
    revalidatePath(`/${locale}${basePath}`, 'page')
  }
}

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, collection }) => {
  if (typeof window !== 'undefined') return doc

  try {
    const { revalidatePath } = await import('next/cache')

    const slugMap: Record<string, string> = {
      'product-categories': '/products',
      services: '/services',
      news: '/news',
      pages: '',
    }

    const basePath = slugMap[collection.slug]
    const toRevalidate: string[] = []

    if (basePath !== undefined) {
      revalidateLocalePaths(revalidatePath, basePath)
      toRevalidate.push(basePath || '/')

      if (doc?.slug) {
        revalidateLocalePaths(revalidatePath, `${basePath}/${doc.slug}`)
        toRevalidate.push(`${basePath}/${doc.slug}`)
      }
    }

    clearDictionaryCache()

    if (toRevalidate.length > 0) {
      notifyIndexNow(toRevalidate)
    }
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, global }) => {
  if (typeof window !== 'undefined') return doc

  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    clearDictionaryCache()

    revalidateLocalePaths(revalidatePath, '')
    revalidateLocalePaths(revalidatePath, '/about')
    revalidateLocalePaths(revalidatePath, '/contact')
    revalidateLocalePaths(revalidatePath, '/news')
    revalidateLocalePaths(revalidatePath, '/our-business')

    if (
      global.slug === 'navigation' ||
      global.slug === 'footer' ||
      global.slug === 'site-settings'
    ) {
      revalidatePath('/', 'layout')
    }

    revalidateTag(`global_${global.slug}`)
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return doc
}
