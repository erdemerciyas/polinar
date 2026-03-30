import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Video Embed', plural: 'Video Embeds' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'videoUrl', type: 'text', required: true, admin: { description: 'YouTube or Vimeo URL' } },
    { name: 'thumbnailImage', type: 'upload', relationTo: 'media' },
    {
      name: 'sideImages',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
