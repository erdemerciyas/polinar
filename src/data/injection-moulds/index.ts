import type { InjectionMouldsData } from './types'
import { createLocaleLoader } from '../locale-loader'
import en from './en'

export type { InjectionMouldsData, MouldCategoryData, CommonTechnologyData, HighlightData, InjectionMouldsUI } from './types'

export const getInjectionMouldsData = createLocaleLoader<InjectionMouldsData>(
  en,
  (locale) => require(`./${locale}`),
)
