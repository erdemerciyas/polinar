import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'polinar-red': '#E30613',
        'polinar-red-dark': '#B8050F',
        'moulds-gold': '#B8860B',
        'moulds-gold-dark': '#8B6914',
        'navy': '#0A1128',
        'navy-deep': '#080C16',
        'cyan': '#00B4D8',
        'cyan-dark': '#0096B7',
        'pte-cyan': '#00B4D8',
        'pte-cyan-dark': '#0096B7',
        'gray-light': '#F5F6F8',
        'heading': '#222222',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      letterSpacing: {
        'tight-heading': '-0.03em',
      },
      lineHeight: {
        'body': '1.6',
        'relaxed-body': '1.7',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
}

export default config
