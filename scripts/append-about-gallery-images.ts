import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { getLocaleCodes, initPayload } from './lib/i18n-shared.js'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const ROOT = path.resolve(dirname, '..')

interface ImageDef {
  file: string
  alt: string
  captions: Record<string, string>
  size: 'normal' | 'large'
}

const NEW_GALLERY_IMAGES: ImageDef[] = [
  {
    file: 'uretim_5.jpg',
    alt: 'CNC lathe precision machining with technical drawing',
    captions: {
      en: 'CNC lathe precision machining with technical drawing',
      tr: 'Teknik çizimli CNC torna hassas işleme',
      de: 'CNC-Drehmaschine mit technischer Zeichnung',
      ar: 'تشغيل دقيق على مخرطة CNC مع رسم فني',
      ru: 'Точная обработка на токарном станке ЧПУ с техническим чертежом',
    },
    size: 'normal',
  },
  {
    file: 'uretim_6.jpg',
    alt: 'CNC machining workshop with Polinar technicians',
    captions: {
      en: 'CNC machining workshop with Polinar technicians',
      tr: 'Polinar teknisyenleri ile CNC işleme atölyesi',
      de: 'CNC-Bearbeitungswerkstatt mit Polinar-Technikern',
      ar: 'ورشة تشغيل CNC مع فنيي Polinar',
      ru: 'Цех обработки на станках ЧПУ с техниками Polinar',
    },
    size: 'large',
  },
]

const MAX_FILE_SIZE = 9 * 1024 * 1024
const MAX_WIDTH = 2400

async function prepareBuffer(filePath: string): Promise<Buffer> {
  const raw = fs.readFileSync(filePath)
  if (raw.length <= MAX_FILE_SIZE) return raw

  console.log(`    ⚡ Resizing (${(raw.length / 1024 / 1024).toFixed(1)}MB > 9MB limit)...`)
  let quality = 85
  let buf = await sharp(raw).resize({ width: MAX_WIDTH, withoutEnlargement: true }).jpeg({ quality }).toBuffer()

  while (buf.length > MAX_FILE_SIZE && quality > 50) {
    quality -= 10
    buf = await sharp(raw).resize({ width: MAX_WIDTH, withoutEnlargement: true }).jpeg({ quality }).toBuffer()
  }

  console.log(`    ⚡ Compressed to ${(buf.length / 1024 / 1024).toFixed(1)}MB (quality: ${quality})`)
  return buf
}

async function uploadImage(payload: any, def: ImageDef): Promise<number> {
  const filePath = path.join(ROOT, 'brand_assets', 'about', def.file)
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: def.file } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id as number
    console.log(`  ↳ "${def.file}" already exists (id: ${id}), updating alt text...`)
    await payload.update({
      collection: 'media',
      id,
      data: { alt: def.alt },
    })
    await payload.update({
      collection: 'media',
      id,
      locale: 'tr',
      data: { alt: def.captions.tr || def.alt },
    })
    return id
  }

  const fileBuffer = await prepareBuffer(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt: def.alt },
    file: {
      data: fileBuffer,
      name: def.file,
      mimetype: 'image/jpeg',
      size: fileBuffer.length,
    },
  })
  const id = doc.id as number
  console.log(`  ↳ Uploaded "${def.file}" → id: ${id}`)

  await payload.update({
    collection: 'media',
    id,
    locale: 'tr',
    data: { alt: def.captions.tr || def.alt },
  })

  return id
}

function getImageId(item: any): number | null {
  if (!item?.image) return null
  if (typeof item.image === 'number') return item.image
  if (typeof item.image === 'object' && item.image.id) return item.image.id
  return null
}

async function main() {
  console.log('=== Append About Gallery Images ===\n')

  const payload = await initPayload()
  console.log('Payload initialized.\n')

  const uploaded = []
  for (const def of NEW_GALLERY_IMAGES) {
    console.log(`Uploading ${def.file}...`)
    const id = await uploadImage(payload, def)
    uploaded.push({ def, id })
  }

  const localeCodes = getLocaleCodes()

  for (const locale of localeCodes) {
    const current = (await payload.findGlobal({
      slug: 'about-page-settings',
      locale: locale as any,
    })) as any

    const existingImages = current.gallery?.images || []
    const existingIds = new Set(existingImages.map(getImageId).filter(Boolean))

    const newItems = uploaded
      .filter(({ id }) => !existingIds.has(id))
      .map(({ def, id }) => ({
        image: id,
        caption: def.captions[locale] || def.alt,
        size: def.size,
      }))

    if (newItems.length === 0) {
      console.log(`[${locale}] Gallery already contains new images, skipping.`)
      continue
    }

    await payload.updateGlobal({
      slug: 'about-page-settings',
      locale: locale as any,
      data: {
        gallery: {
          ...current.gallery,
          images: [...existingImages, ...newItems],
        },
      },
    })

    console.log(`[${locale}] Appended ${newItems.length} gallery image(s).`)
  }

  console.log('\n✅ Gallery images appended successfully!')
  console.log('   Run "npm run i18n:export" to refresh locale JSON files.')
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Append failed:', err)
  process.exit(1)
})
