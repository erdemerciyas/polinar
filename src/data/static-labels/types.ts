export type StaticLabels = {
  company: {
    address: string
    phones: string[]
    fax: string
    email: string
    mapUrl: string
    whatsappUrl: string
    socialLinks: { name: string; url: string }[]
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    titleSuffix: string
    siteName: string
    contactType: string
  }
  breadcrumbs: {
    home: string
    ourBusiness: string
    breadcrumbAriaLabel: string
  }
  aria: {
    close: string
    openMenu: string
    closeMenu: string
    previousSlide: string
    nextSlide: string
    heroSlider: string
    previous: string
    next: string
    playVideo: string
  }
  about: {
    scrollDown: string
    sinceTemplate: string
    videoEyebrow: string
    galleryImageAlt: string
    certificateAlt: string
    factoryAlt: string
    productionAlt: string
  }
  product: {
    viewDetails: string
    more: string
    materials: string
    technologies: string
    standards: string
    keyFeatures: string
    technicalSpecs: string
    downloadBrochure: string
    mouldAlt: string
    productsAlt: string
    overviewAlt: string
    specificationsAlt: string
    detailAlt: string
    digitalCatalog: string
    viewCatalog: string
    viewOnline: string
    catalogPage: string
    catalogZoomIn: string
    catalogZoomOut: string
    catalogResetZoom: string
    catalogPrint: string
    catalogLoading: string
    catalogPageOf: string
    downloadAll: string
    downloadAllProgress: string
  }
}
