import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'showMap', type: 'checkbox', defaultValue: true },
    { name: 'mapEmbedUrl', type: 'text', admin: { condition: (_, siblingData) => siblingData?.showMap } },
  ],
}
