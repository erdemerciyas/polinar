import type { Block } from 'payload'

export const CoreValues: Block = {
  slug: 'coreValues',
  labels: { singular: 'Core Values', plural: 'Core Values Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'values',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Icon name or emoji' } },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}
