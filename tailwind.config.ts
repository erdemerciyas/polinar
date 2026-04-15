import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'polinar-mustard': '#EDBA13',
        'polinar-mustard-dark': '#D4A80E',
        'polinar-gold-deep': '#B8920A',
        'moulds-gold': '#B8860B',
        'moulds-gold-dark': '#8B6914',
        'navy': '#0A1128',
        'navy-deep': '#080C16',
        'cyan': '#00B4D8',
        'cyan-dark': '#0096B7',
        'pte-cyan': '#00B4D8',
        'pte-cyan-dark': '#0096B7',
        'machinery-steel': '#6B7B8D',
        'machinery-steel-dark': '#4A5568',
        'gray-light': '#F5F6F8',
        'heading': '#222222',
        'body-muted': '#555555',
        'body-secondary': '#666666',
        'body-tertiary': '#999999',
        'border-soft': '#E5E7EB',
        'border-faint': '#F0F0F0',
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
        'prose': '65ch',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'card-sm': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(10, 17, 40, 0.04)',
        'card-hover': '0 8px 24px rgba(10, 17, 40, 0.08), 0 16px 48px rgba(10, 17, 40, 0.06)',
        'card-hover-mustard': '0 8px 24px rgba(237, 186, 19, 0.12), 0 16px 48px rgba(10, 17, 40, 0.10)',
        'card-hover-gold': '0 8px 24px rgba(184, 134, 11, 0.1), 0 16px 48px rgba(10, 17, 40, 0.10)',
        'card-hover-cyan': '0 8px 24px rgba(0, 180, 216, 0.1), 0 16px 48px rgba(10, 17, 40, 0.10)',
        'card-hover-steel': '0 8px 24px rgba(107, 123, 141, 0.12), 0 16px 48px rgba(10, 17, 40, 0.10)',
        'nav': '0 2px 8px rgba(10, 17, 40, 0.06)',
        'mega': '0 8px 32px rgba(10, 17, 40, 0.12), 0 2px 8px rgba(10, 17, 40, 0.06)',
        'modal': '0 24px 64px rgba(10, 17, 40, 0.3)',
        'diffused': '0 20px 40px -15px rgba(10, 17, 40, 0.05)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-out': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#555555',
            a: { color: '#EDBA13', textDecoration: 'underline' },
            h1: { fontFamily: 'Montserrat, sans-serif', color: '#222222' },
            h2: { fontFamily: 'Montserrat, sans-serif', color: '#222222' },
            h3: { fontFamily: 'Montserrat, sans-serif', color: '#222222' },
            h4: { fontFamily: 'Montserrat, sans-serif', color: '#222222' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
