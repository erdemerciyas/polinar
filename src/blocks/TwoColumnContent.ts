import type { Block } from 'payload'

export const TwoColumnContent: Block = {
  slug: 'twoColumnContent',
  labels: { singular: 'Two Column Content', plural: 'Two Column Contents' },
  fields: [
    {
      name: 'leftColumn',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'rightColumn',
      type: 'richText',
      localized: true,
      required: true,
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
