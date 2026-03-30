import type { StaticLabels } from './types'
import { createLocaleLoader } from '../locale-loader'
import en from './en'

export type { StaticLabels } from './types'

export const getStaticLabels = createLocaleLoader<StaticLabels>(
  en,
  (locale) => require(`./${locale}`),
)
