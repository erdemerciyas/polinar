/**
 * One-time script to populate all SEO fields across globals and collections
 * for all active locales (en, tr, de, ar).
 *
 * Usage: npx tsx scripts/seed-seo.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type LocaleSEO = { title: string; description: string }

// ────────────────────────────────────────────────
// Global SEO data per locale
// ────────────────────────────────────────────────

const homepageSeo: Record<string, LocaleSEO> = {
  en: {
    title: 'Polinar — Plastic Injection Moulds',
    description: 'Leading manufacturer of plastic injection moulds for pipe and fittings since 2000. High-quality PPR-C, HDPE, PVC moulds exported to 40+ countries.',
  },
  tr: {
    title: 'Polinar — Plastik Enjeksiyon Kalıpları',
    description: '2000 yılından bu yana boru ve ek parçalar için plastik enjeksiyon kalıplarında lider üretici. 40\'tan fazla ülkeye ihracat yapan yüksek kaliteli PPR-C, HDPE, PVC kalıpları.',
  },
  de: {
    title: 'Polinar — Kunststoff-Spritzgussformen',
    description: 'Führender Hersteller von Kunststoff-Spritzgussformen für Rohre und Fittings seit 2000. Hochwertige PPR-C-, HDPE- und PVC-Formen mit Export in über 40 Länder.',
  },
  ar: {
    title: 'بولينار — قوالب حقن البلاستيك',
    description: 'شركة رائدة في تصنيع قوالب حقن البلاستيك للأنابيب والتجهيزات منذ عام 2000. قوالب عالية الجودة من PPR-C وHDPE وPVC يتم تصديرها إلى أكثر من 40 دولة.',
  },
}

const aboutSeo: Record<string, LocaleSEO> = {
  en: {
    title: 'About Polinar',
    description: 'Discover Polinar\'s 25+ years of expertise in plastic injection mould manufacturing. ISO-certified quality, modern CNC facility, and global export to 40+ countries.',
  },
  tr: {
    title: 'Polinar Hakkında',
    description: 'Polinar\'ın plastik enjeksiyon kalıp üretimindeki 25 yılı aşkın deneyimini keşfedin. ISO sertifikalı kalite, modern CNC tesisi ve 40\'tan fazla ülkeye ihracat.',
  },
  de: {
    title: 'Über Polinar',
    description: 'Entdecken Sie Polinars über 25-jährige Erfahrung in der Herstellung von Kunststoff-Spritzgussformen. ISO-zertifizierte Qualität, moderne CNC-Anlage und globaler Export.',
  },
  ar: {
    title: 'عن بولينار',
    description: 'اكتشف خبرة بولينار التي تمتد لأكثر من 25 عامًا في تصنيع قوالب حقن البلاستيك. جودة معتمدة بشهادة ISO ومنشأة CNC حديثة وتصدير عالمي.',
  },
}

const contactSeo: Record<string, LocaleSEO> = {
  en: {
    title: 'Contact Us',
    description: 'Get in touch with Polinar for custom plastic injection mould solutions. Request a quote, visit our Istanbul facility, or reach us via WhatsApp.',
  },
  tr: {
    title: 'İletişim',
    description: 'Özel plastik enjeksiyon kalıp çözümleri için Polinar ile iletişime geçin. Teklif alın, İstanbul tesisimizi ziyaret edin veya WhatsApp üzerinden ulaşın.',
  },
  de: {
    title: 'Kontakt',
    description: 'Kontaktieren Sie Polinar für individuelle Kunststoff-Spritzgusslösungen. Fordern Sie ein Angebot an oder besuchen Sie unsere Fabrik in Istanbul.',
  },
  ar: {
    title: 'اتصل بنا',
    description: 'تواصل مع بولينار للحصول على حلول قوالب حقن البلاستيك المخصصة. اطلب عرض أسعار أو قم بزيارة منشأتنا في إسطنبول.',
  },
}

const newsSeo: Record<string, LocaleSEO> = {
  en: {
    title: 'News & Exhibitions',
    description: 'Stay updated with Polinar\'s latest news, trade fair participations, product launches, and industry insights in plastic injection mould manufacturing.',
  },
  tr: {
    title: 'Haberler & Fuarlar',
    description: 'Polinar\'ın son haberleri, fuar katılımları, ürün lansmanları ve plastik enjeksiyon kalıp üretimi sektör gelişmelerinden haberdar olun.',
  },
  de: {
    title: 'Nachrichten & Messen',
    description: 'Bleiben Sie über Polinars neueste Nachrichten, Messeteilnahmen, Produkteinführungen und Branchentrends im Spritzgussformenbau informiert.',
  },
  ar: {
    title: 'الأخبار والمعارض',
    description: 'ابق على اطلاع بأحدث أخبار بولينار ومشاركاتها في المعارض التجارية وإطلاق المنتجات ورؤى صناعة قوالب حقن البلاستيك.',
  },
}

const ourBusinessSeo: Record<string, LocaleSEO> = {
  en: {
    title: 'Our Business',
    description: 'Explore Polinar\'s core business areas: injection moulds for pipe fittings, precision CNC machinery, and plastic testing equipment for quality assurance.',
  },
  tr: {
    title: 'Faaliyetlerimiz',
    description: 'Polinar\'ın temel faaliyet alanlarını keşfedin: boru ek parçaları için enjeksiyon kalıpları, hassas CNC makineleri ve kalite güvence için plastik test ekipmanları.',
  },
  de: {
    title: 'Unser Geschäft',
    description: 'Entdecken Sie Polinars Kerngeschäftsbereiche: Spritzgussformen für Rohrfittings, Präzisions-CNC-Maschinen und Kunststoffprüfgeräte für die Qualitätssicherung.',
  },
  ar: {
    title: 'أعمالنا',
    description: 'استكشف مجالات عمل بولينار الأساسية: قوالب الحقن لتجهيزات الأنابيب، وآلات CNC الدقيقة، ومعدات اختبار البلاستيك لضمان الجودة.',
  },
}

// ────────────────────────────────────────────────
// SiteSettings — defaultSeoDescription
// ────────────────────────────────────────────────

const siteDefaultDesc: Record<string, string> = {
  en: 'Polinar — Leading manufacturer of plastic injection moulds for pipe and fittings since 2000. Exported to 40+ countries worldwide.',
  tr: 'Polinar — 2000 yılından bu yana boru ve ek parçalar için plastik enjeksiyon kalıplarında lider üretici. Dünya genelinde 40\'tan fazla ülkeye ihracat.',
  de: 'Polinar — Führender Hersteller von Kunststoff-Spritzgussformen für Rohre und Fittings seit 2000. Export in über 40 Länder weltweit.',
  ar: 'بولينار — شركة رائدة في تصنيع قوالب حقن البلاستيك للأنابيب والتجهيزات منذ عام 2000. تصدير إلى أكثر من 40 دولة حول العالم.',
}

// ────────────────────────────────────────────────
// Collection SEO (news, pages, product-categories)
// ────────────────────────────────────────────────

type CollectionMeta = Record<string, { title: string; description: string }>

function newsArticleMeta(titleEn: string): CollectionMeta {
  return {
    en: { title: `${titleEn} — Polinar`, description: `Read about ${titleEn} from Polinar.` },
    tr: { title: `${titleEn} — Polinar`, description: `Polinar'dan ${titleEn} hakkında okuyun.` },
    de: { title: `${titleEn} — Polinar`, description: `Lesen Sie über ${titleEn} von Polinar.` },
    ar: { title: `${titleEn} — Polinar`, description: `.${titleEn} اقرأ عن بولينار` },
  }
}

function pageMeta(titleEn: string): CollectionMeta {
  return {
    en: { title: `${titleEn} — Polinar`, description: `${titleEn} — Polinar plastic injection moulds.` },
    tr: { title: `${titleEn} — Polinar`, description: `${titleEn} — Polinar plastik enjeksiyon kalıpları.` },
    de: { title: `${titleEn} — Polinar`, description: `${titleEn} — Polinar Kunststoff-Spritzgussformen.` },
    ar: { title: `${titleEn} — Polinar`, description: `.بولينار قوالب حقن البلاستيك — ${titleEn}` },
  }
}

const productCategorySeo: Record<string, CollectionMeta> = {
  default: {
    en: { title: 'Products — Polinar', description: 'High-quality plastic injection moulds by Polinar.' },
    tr: { title: 'Ürünler — Polinar', description: 'Polinar tarafından üretilen yüksek kaliteli plastik enjeksiyon kalıpları.' },
    de: { title: 'Produkte — Polinar', description: 'Hochwertige Kunststoff-Spritzgussformen von Polinar.' },
    ar: { title: 'المنتجات — بولينار', description: 'قوالب حقن بلاستيك عالية الجودة من بولينار.' },
  },
}

// ────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config })
  const locales = ['en', 'tr', 'de', 'ar']

  console.log('\n🔧  SEO Seed Script — Populating all SEO fields in all locales\n')

  // ── 1. SiteSettings.defaultSeoDescription ──
  console.log('━━ SiteSettings.defaultSeoDescription ━━')
  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: locale as any,
      data: { defaultSeoDescription: siteDefaultDesc[locale] } as any,
    })
    console.log(`  ✓ site-settings [${locale}]`)
  }

  // ── 2. Global SEO fields ──
  const globalSeeds: Array<{ slug: string; data: Record<string, LocaleSEO> }> = [
    { slug: 'homepage-settings', data: homepageSeo },
    { slug: 'about-page-settings', data: aboutSeo },
    { slug: 'contact-page-settings', data: contactSeo },
    { slug: 'news-page-settings', data: newsSeo },
    { slug: 'our-business-page-settings', data: ourBusinessSeo },
  ]

  for (const { slug, data } of globalSeeds) {
    console.log(`━━ ${slug}.seo ━━`)
    for (const locale of locales) {
      await payload.updateGlobal({
        slug: slug as any,
        locale: locale as any,
        data: { seo: { title: data[locale].title, description: data[locale].description } } as any,
      })
      console.log(`  ✓ ${slug} [${locale}]`)
    }
  }

  // ── 3. News collection — meta fields ──
  console.log('━━ news collection meta ━━')
  const allNews = await payload.find({ collection: 'news', limit: 500, locale: 'all' as any })
  for (const doc of allNews.docs) {
    const enTitle = (doc as any).title?.en || (doc as any).title || 'News'
    const meta = newsArticleMeta(enTitle)

    for (const locale of locales) {
      const localTitle = (doc as any).title?.[locale] || enTitle
      const localExcerpt = (doc as any).excerpt?.[locale] || (doc as any).excerpt?.en || ''

      try {
        await payload.update({
          collection: 'news',
          id: doc.id,
          locale: locale as any,
          data: {
            title: localTitle,
            meta: {
              title: `${localTitle} — Polinar`,
              description: (localExcerpt || '').slice(0, 150) || meta[locale].description,
            },
          } as any,
          context: { skipRevalidation: true },
        })
      } catch (e: any) {
        console.log(`  ⚠ news id:${doc.id} [${locale}] — ${e.message?.slice(0, 100)}`)
      }
    }
    console.log(`  ✓ news "${(doc as any).slug}" [all locales]`)
  }

  // ── 4. Pages collection — meta fields ──
  console.log('━━ pages collection meta ━━')
  const allPages = await payload.find({ collection: 'pages', limit: 500, locale: 'all' as any })
  for (const doc of allPages.docs) {
    const enTitle = (doc as any).title?.en || (doc as any).title || 'Page'
    const meta = pageMeta(enTitle)

    for (const locale of locales) {
      const localTitle = (doc as any).title?.[locale] || enTitle
      const localHeroTitle = (doc as any).heroTitle?.[locale] || (doc as any).heroTitle?.en
      const localExcerpt = (doc as any).excerpt?.[locale] || (doc as any).excerpt?.en || ''

      try {
        await payload.update({
          collection: 'pages',
          id: doc.id,
          locale: locale as any,
          data: {
            title: localTitle,
            meta: {
              title: `${localHeroTitle || localTitle} — Polinar`,
              description: (localExcerpt || '').slice(0, 150) || meta[locale].description,
            },
          } as any,
          context: { skipRevalidation: true },
        })
      } catch (e: any) {
        console.log(`  ⚠ page id:${doc.id} [${locale}] — ${e.message?.slice(0, 100)}`)
      }
    }
    console.log(`  ✓ page "${(doc as any).slug}" [all locales]`)
  }

  // ── 5. ProductCategories collection — meta fields ──
  console.log('━━ product-categories collection meta ━━')
  const allProducts = await payload.find({ collection: 'product-categories', limit: 500, locale: 'all' as any })

  const productSeoMap: Record<string, CollectionMeta> = {
    'pprc-sanitary': {
      en: { title: 'PPR-C Sanitary Fittings Moulds — Polinar', description: 'High-quality PPR-C sanitary fittings injection moulds with durable mechanism, certified steels, and POLINAR hot runner system.' },
      tr: { title: 'PPR-C Sıhhi Tesisat Ek Parça Kalıpları — Polinar', description: 'Dayanıklı mekanizma, sertifikalı çelikler ve POLINAR sıcak yolluk sistemi ile yüksek kaliteli PPR-C sıhhi tesisat ek parça enjeksiyon kalıpları.' },
      de: { title: 'PPR-C Sanitärfittings-Formen — Polinar', description: 'Hochwertige PPR-C-Sanitärfittings-Spritzgussformen mit langlebigem Mechanismus und zertifizierten Stählen.' },
      ar: { title: 'قوالب تجهيزات PPR-C الصحية — بولينار', description: 'قوالب حقن تجهيزات صحية عالية الجودة من PPR-C مع آلية متينة وفولاذ معتمد ونظام التشغيل الساخن من بولينار.' },
    },
    'pprc-industrial': {
      en: { title: 'PPR-C Industrial Fittings Moulds — Polinar', description: 'Industrial-grade PPR-C pipe fittings moulds for large diameter applications with precision engineering.' },
      tr: { title: 'PPR-C Endüstriyel Ek Parça Kalıpları — Polinar', description: 'Büyük çaplı uygulamalar için hassas mühendislik ile endüstriyel sınıf PPR-C boru ek parça kalıpları.' },
      de: { title: 'PPR-C Industriefittings-Formen — Polinar', description: 'Industrielle PPR-C-Rohrfittingsformen für großkalibrige Anwendungen mit Präzisionstechnik.' },
      ar: { title: 'قوالب تجهيزات PPR-C الصناعية — بولينار', description: 'قوالب تجهيزات أنابيب PPR-C صناعية للتطبيقات ذات القطر الكبير مع هندسة دقيقة.' },
    },
    'hdpe-electrofusion': {
      en: { title: 'HDPE Electrofusion Fittings Moulds — Polinar', description: 'HDPE electrofusion fittings moulds for gas and water pipeline systems with advanced welding technology.' },
      tr: { title: 'HDPE Elektrofüzyon Ek Parça Kalıpları — Polinar', description: 'Gelişmiş kaynak teknolojisi ile gaz ve su boru hattı sistemleri için HDPE elektrofüzyon ek parça kalıpları.' },
      de: { title: 'HDPE-Elektroschweißfittings-Formen — Polinar', description: 'HDPE-Elektroschweißfittingsformen für Gas- und Wasserleitungssysteme mit fortschrittlicher Schweißtechnologie.' },
      ar: { title: 'قوالب تجهيزات HDPE الكهروحرارية — بولينار', description: 'قوالب تجهيزات لحام كهروحراري HDPE لأنظمة خطوط أنابيب الغاز والمياه بتقنية لحام متقدمة.' },
    },
    'hdpe-buttfusion': {
      en: { title: 'HDPE Butt Fusion Fittings Moulds — Polinar', description: 'HDPE butt fusion fittings injection moulds for water and gas infrastructure with high-precision tooling.' },
      tr: { title: 'HDPE Alın Kaynak Ek Parça Kalıpları — Polinar', description: 'Su ve gaz altyapısı için yüksek hassasiyetli HDPE alın kaynak ek parça enjeksiyon kalıpları.' },
      de: { title: 'HDPE-Stumpfschweißfittings-Formen — Polinar', description: 'HDPE-Stumpfschweißfittings-Spritzgussformen für Wasser- und Gasinfrastruktur mit hochpräzisen Werkzeugen.' },
      ar: { title: 'قوالب تجهيزات لحام HDPE التناكبي — بولينار', description: 'قوالب حقن تجهيزات لحام HDPE التناكبي للبنية التحتية للمياه والغاز بأدوات عالية الدقة.' },
    },
    'pvc-pressure': {
      en: { title: 'PVC Pressure Fittings Moulds — Polinar', description: 'PVC pressure pipe fittings moulds engineered for municipal water supply and industrial applications.' },
      tr: { title: 'PVC Basınçlı Ek Parça Kalıpları — Polinar', description: 'Belediye su temini ve endüstriyel uygulamalar için tasarlanmış PVC basınçlı boru ek parça kalıpları.' },
      de: { title: 'PVC-Druckfittings-Formen — Polinar', description: 'PVC-Druckrohrfittingsformen für kommunale Wasserversorgung und industrielle Anwendungen.' },
      ar: { title: 'قوالب تجهيزات PVC للضغط — بولينار', description: 'قوالب تجهيزات أنابيب PVC للضغط مصممة لإمدادات المياه البلدية والتطبيقات الصناعية.' },
    },
    'pvc-drainage': {
      en: { title: 'PVC Drainage Fittings Moulds — Polinar', description: 'PVC drainage and sewage pipe fittings moulds for building and infrastructure drainage systems.' },
      tr: { title: 'PVC Drenaj Ek Parça Kalıpları — Polinar', description: 'Bina ve altyapı drenaj sistemleri için PVC drenaj ve kanalizasyon boru ek parça kalıpları.' },
      de: { title: 'PVC-Entwässerungsfittings-Formen — Polinar', description: 'PVC-Entwässerungs- und Abwasserfittingsformen für Gebäude- und Infrastruktur-Entwässerungssysteme.' },
      ar: { title: 'قوالب تجهيزات PVC للصرف — بولينار', description: 'قوالب تجهيزات أنابيب الصرف والمجاري PVC لأنظمة صرف المباني والبنية التحتية.' },
    },
  }

  for (const doc of allProducts.docs) {
    const slug = (doc as any).slug
    const enName = (doc as any).name?.en || (doc as any).name || 'Product'
    const seoData = productSeoMap[slug] || productCategorySeo.default

    for (const locale of locales) {
      const localName = (doc as any).name?.[locale] || enName

      const finalTitle = seoData === productCategorySeo.default
        ? `${localName} — Polinar`
        : seoData[locale].title
      const finalDesc = seoData[locale].description

      try {
        await payload.update({
          collection: 'product-categories',
          id: doc.id,
          locale: locale as any,
          data: {
            name: localName,
            meta: {
              title: finalTitle,
              description: finalDesc,
            },
          } as any,
          context: { skipRevalidation: true },
        })
      } catch (e: any) {
        console.log(`  ⚠ product-category "${slug || enName}" [${locale}] — ${e.message?.slice(0, 100)}`)
      }
    }
    console.log(`  ✓ product-category "${slug || enName}" [all locales]`)
  }

  console.log('\n✅  All SEO fields populated successfully!\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌  SEO seed failed:', err)
  process.exit(1)
})
