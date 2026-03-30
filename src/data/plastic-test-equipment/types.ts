export type TestEquipmentSpec = {
  label: string
  value: string
}

export type TestEquipmentCategory = {
  id: string
  name: string
  shortDescription: string
  description: string
  features: string[]
  standards: string[]
  specs: TestEquipmentSpec[]
  image01: string
  image02: string
  pdfUrl: string
}

export type CoreCapability = {
  title: string
  description: string
}

export type Highlight = {
  value: string
  label: string
}

export type PlasticTestEquipmentUI = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introDescription: string
  productRangeEyebrow: string
  productRangeTitle: string
  whyPolinarEyebrow: string
  whyPolinarTitle: string
  whyPolinarDescription: string
  ctaTitle: string
  ctaSubtitle: string
  contactUs: string
  breadcrumbCurrent: string
}

export type PlasticTestEquipmentData = {
  categories: TestEquipmentCategory[]
  coreCapabilities: CoreCapability[]
  highlights: Highlight[]
  ui: PlasticTestEquipmentUI
}
