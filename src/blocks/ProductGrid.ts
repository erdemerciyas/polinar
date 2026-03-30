import type { Block } from 'payload'

export const ProductGrid: Block = {
  slug: 'productGrid',
  labels: { singular: 'Product Grid', plural: 'Product Grids' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { description: 'Max products to show. Leave empty to show selected products.' },
    },
  ],
}
