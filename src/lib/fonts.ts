import { Montserrat, Open_Sans } from 'next/font/google'

export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

export const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const fontClasses = `${montserrat.variable} ${openSans.variable}`
