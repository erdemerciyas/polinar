import type { MachineryData } from './types'
import { createLocaleLoader } from '../locale-loader'
import en from './en'

export type { MachineCategory, CoreCapability, Highlight, MachineryUI, MachineryData } from './types'

export const getMachineryData = createLocaleLoader<MachineryData>(
  en,
  (locale) => require(`./${locale}`),
)
