import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Subscriber', plural: 'Newsletter Subscribers' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
    group: 'System',
    description: 'Newsletter email list',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email', required: true, unique: true },
  ],
}
