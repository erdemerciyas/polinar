import type { Block } from 'payload'

export const CertificatesGrid: Block = {
  slug: 'certificatesGrid',
  labels: { singular: 'Certificates Grid', plural: 'Certificates Grids' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'certificates',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'description', type: 'text', localized: true },
      ],
    },
  ],
}
