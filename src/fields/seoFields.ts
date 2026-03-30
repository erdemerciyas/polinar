import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: {
    description: 'Search engine optimization settings. Leave blank to auto-generate from page content.',
  },
  fields: [
    {
      name: 'title',
      label: 'Meta Title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Override the page title in search results. Max ~60 characters recommended.',
      },
    },
    {
      name: 'description',
      label: 'Meta Description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Override the page description in search results. Max ~160 characters recommended.',
      },
    },
    {
      name: 'image',
      label: 'OG Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Override the Open Graph / social sharing image. Recommended: 1200×630px.',
      },
    },
  ],
}
