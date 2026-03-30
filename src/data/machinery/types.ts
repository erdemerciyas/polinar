export type MachineCategory = {
  id: string
  name: string
  shortDescription: string
  description: string
  features: string[]
  specs?: { label: string; value: string }[]
  standards?: string[]
  versions?: {
    name: string
    columns: string[]
    rows: { label: string; unit?: string; values: string[] }[]
  }
  positions?: string[]
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

export type MachineryUI = {
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introText: string
  categoriesLabel: string
  categoriesSectionTitle: string
  whyLabel: string
  whySectionTitle: string
  whyText: string
  ctaTitle: string
  ctaText: string
  ctaButton: string
  breadcrumbHome: string
  breadcrumbParentFallback: string
  breadcrumbCurrent: string
  workCycleTitle: string
}

export type MachineryData = {
  categories: MachineCategory[]
  coreCapabilities: CoreCapability[]
  highlights: Highlight[]
  ui: MachineryUI
}
