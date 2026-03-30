import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateCollection: CollectionAfterChangeHook = ({ doc, collection }) => {
  try {
    // Revalidate specific collection paths
    const slugMap: Record<string, string> = {
      'product-categories': '/[locale]/products',
      services: '/[locale]/services',
      news: '/[locale]/news',
      pages: '/[locale]',
    }

    const basePath = slugMap[collection.slug]
    if (basePath) {
      revalidatePath(basePath, 'page')
      // Also revalidate detail page if doc has slug
      if (doc?.slug) {
        revalidatePath(`${basePath}/${doc.slug}`, 'page')
      }
    }

    // Always revalidate homepage
    revalidatePath('/[locale]', 'page')
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global }) => {
  try {
    // Revalidate homepage for most globals
    revalidatePath('/[locale]', 'page')

    // Navigation changes affect all pages
    if (global.slug === 'navigation' || global.slug === 'footer' || global.slug === 'site-settings') {
      revalidatePath('/', 'layout')
    }
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return doc
}
