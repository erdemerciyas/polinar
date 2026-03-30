import type { OurBusinessHighlights } from './types'
import { createLocaleLoader } from '../locale-loader'
import en from './en'

export type { OurBusinessHighlights } from './types'

export const getOurBusinessHighlights = createLocaleLoader<OurBusinessHighlights>(
  en,
  (locale) => require(`./${locale}`),
)
