import type { Block } from 'payload'

export const HeroSlider: Block = {
  slug: 'heroSlider',
  labels: { singular: 'Hero Slider', plural: 'Hero Sliders' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        { name: 'ctaLink', type: 'text' },
        {
          type: 'row',
          fields: [
            {
              name: 'overlayOpacity',
              label: 'Overlay Opacity (%)',
              type: 'number',
              defaultValue: 60,
              min: 0,
              max: 100,
              admin: { width: '25%' },
            },
            {
              name: 'textAlignment',
              label: 'Text Alignment',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              admin: { width: '25%' },
            },
            {
              name: 'textPosition',
              label: 'Text Position',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'bottom' },
              ],
              admin: { width: '25%' },
            },
            {
              name: 'titleSize',
              label: 'Title Size',
              type: 'select',
              defaultValue: 'large',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'animateText',
              label: 'Animate Text',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'textAnimation',
              label: 'Text Animation',
              type: 'select',
              defaultValue: 'fadeUp',
              options: [
                { label: 'Fade Up', value: 'fadeUp' },
                { label: 'Fade In', value: 'fadeIn' },
                { label: 'Slide from Left', value: 'slideLeft' },
                { label: 'Slide from Right', value: 'slideRight' },
              ],
              admin: { width: '50%', condition: (_: any, siblingData: any) => siblingData?.animateText },
            },
          ],
        },
      ],
    },
  ],
}
