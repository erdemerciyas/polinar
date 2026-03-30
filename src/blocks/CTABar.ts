import type { Block } from 'payload'

export const CTABar: Block = {
  slug: 'ctaBar',
  labels: { singular: 'CTA Bar', plural: 'CTA Bars' },
  fields: [
    { name: 'text', type: 'text', localized: true, required: true },
    { name: 'buttonLabel', type: 'text', localized: true, required: true },
    { name: 'buttonLink', type: 'text', required: true },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'red',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Navy', value: 'navy' },
        { label: 'Cyan', value: 'cyan' },
      ],
    },
  ],
}
