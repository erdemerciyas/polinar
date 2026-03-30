import type { PlasticTestEquipmentData } from './types'
import { createLocaleLoader } from '../locale-loader'
import en from './en'

export type { PlasticTestEquipmentData, TestEquipmentCategory, TestEquipmentSpec, CoreCapability, Highlight, PlasticTestEquipmentUI } from './types'

export const getPlasticTestEquipmentData = createLocaleLoader<PlasticTestEquipmentData>(
  en,
  (locale) => require(`./${locale}`),
)
