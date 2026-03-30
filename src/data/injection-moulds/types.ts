export type MouldCategoryData = {
  id: string
  name: string
  materials: string
  technologies: string[]
  mouldImage: string
  productImage: string
  pdfUrl: string
}

export type CommonTechnologyData = {
  title: string
  description: string
}

export type HighlightData = {
  value: string
  label: string
}

export type InjectionMouldsUI = {
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
}

export type InjectionMouldsData = {
  categories: MouldCategoryData[]
  commonTechnologies: CommonTechnologyData[]
  highlights: HighlightData[]
  ui: InjectionMouldsUI
}
