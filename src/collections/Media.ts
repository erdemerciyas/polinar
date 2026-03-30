import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Library' },
  admin: {
    group: 'Content',
    description: 'Images, documents and files',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    staticURL: '/media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 240, position: 'centre' },
      { name: 'card', width: 600, height: 400, position: 'centre' },
      { name: 'hero', width: 1920, height: 800, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'alt', type: 'text', localized: true, admin: { description: 'Alt text for accessibility & SEO' } },
    { name: 'caption', type: 'text', localized: true },
  ],
}
