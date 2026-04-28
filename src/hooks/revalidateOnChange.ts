import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, collection }) => {
  if (typeof window !== 'undefined') return doc // Sadece sunucu tarafında çalışmasını sağla

  try {
    const { revalidatePath } = await import('next/cache')

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

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, global }) => {
  if (typeof window !== 'undefined') return doc // Sadece sunucu tarafında çalışmasını sağla

  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    // Revalidate homepage for most globals
    revalidatePath('/[locale]', 'page')

    // Navigation changes affect all pages
    if (global.slug === 'navigation' || global.slug === 'footer' || global.slug === 'site-settings') {
      revalidatePath('/', 'layout')
    }

    // unstable_cache ile önbelleğe aldığımız tag'leri tetiklemek için:
    revalidateTag(`global_${global.slug}`)
  } catch (error) {
    console.error('Revalidation error:', error)
  }

  return doc
}
