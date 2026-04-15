import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import sharp from 'sharp'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const ROOT = path.resolve(dirname, '..')

interface ImageDef {
  file: string
  alt: string
  altTr: string
}

const HERO_IMAGE: ImageDef = {
  file: 'about-hero.jpg',
  alt: 'Polinar factory overview',
  altTr: 'Polinar fabrika genel görünüm',
}

const STORY_MAIN: ImageDef = {
  file: 'about-story-main.jpg',
  alt: 'Polinar injection mould production',
  altTr: 'Polinar enjeksiyon kalıp üretimi',
}

const STORY_ACCENT: ImageDef = {
  file: 'about-story-accent.jpg',
  alt: 'Polinar manufacturing detail',
  altTr: 'Polinar üretim detayı',
}

const GALLERY_IMAGES: ImageDef[] = [
  { file: 'about-gallery-01.jpg', alt: 'Production facility view 1', altTr: 'Üretim tesisi görünüm 1' },
  { file: 'about-gallery-02.jpg', alt: 'Production facility view 2', altTr: 'Üretim tesisi görünüm 2' },
  { file: 'about-gallery-03.jpg', alt: 'Production facility view 3', altTr: 'Üretim tesisi görünüm 3' },
  { file: 'about-gallery-04.jpg', alt: 'Production facility view 4', altTr: 'Üretim tesisi görünüm 4' },
  { file: 'about-gallery-05.jpg', alt: 'Production facility view 5', altTr: 'Üretim tesisi görünüm 5' },
  { file: 'about-gallery-06.jpg', alt: 'CNC machining workshop', altTr: 'CNC işleme atölyesi' },
  { file: 'about-gallery-07.jpg', alt: 'Mould manufacturing workshop', altTr: 'Kalıp üretim atölyesi' },
]

const MAX_FILE_SIZE = 9 * 1024 * 1024 // 9MB — stay under Cloudinary's 10MB free-tier limit
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
      data: { alt: def.altTr },
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
    data: { alt: def.altTr },
  })

  return id
}

async function main() {
  console.log('=== Polinar About Page Image Seeder ===\n')

  const config = (await import('../payload.config')).default

  const payload = await getPayload({ config })
  console.log('Payload initialized.\n')

  // 1. Upload hero image
  console.log('[1/4] Uploading hero background image...')
  const heroId = await uploadImage(payload, HERO_IMAGE)

  // 2. Upload story images
  console.log('\n[2/4] Uploading story images...')
  const storyMainId = await uploadImage(payload, STORY_MAIN)
  const storyAccentId = await uploadImage(payload, STORY_ACCENT)

  // 3. Upload gallery images
  console.log('\n[3/4] Uploading gallery images...')
  const galleryIds: number[] = []
  for (const img of GALLERY_IMAGES) {
    const id = await uploadImage(payload, img)
    galleryIds.push(id)
  }

  // 4. Update About Page Settings
  console.log('\n[4/4] Updating About Page Settings global...')

  const current = await payload.findGlobal({ slug: 'about-page-settings' }) as any

  const galleryItems = galleryIds.map((id, idx) => ({
    image: id,
    caption: GALLERY_IMAGES[idx].alt,
    size: idx === 0 ? 'large' : 'normal',
  }))

  await payload.updateGlobal({
    slug: 'about-page-settings',
    data: {
      hero: {
        ...current.hero,
        backgroundImage: heroId,
      },
      story: {
        ...current.story,
        mainImage: storyMainId,
        accentImage: storyAccentId,
      },
      gallery: {
        ...current.gallery,
        images: galleryItems,
      },
    },
  })

  const galleryItemsTr = galleryIds.map((id, idx) => ({
    image: id,
    caption: GALLERY_IMAGES[idx].altTr,
    size: idx === 0 ? 'large' : 'normal',
  }))

  const currentTr = await payload.findGlobal({ slug: 'about-page-settings', locale: 'tr' as any }) as any

  await payload.updateGlobal({
    slug: 'about-page-settings',
    locale: 'tr' as any,
    data: {
      hero: {
        ...currentTr.hero,
        backgroundImage: heroId,
      },
      story: {
        ...currentTr.story,
        mainImage: storyMainId,
        accentImage: storyAccentId,
      },
      gallery: {
        ...currentTr.gallery,
        images: galleryItemsTr,
      },
    },
  })

  console.log('\n✅ About Page Settings updated successfully!')
  console.log(`   Hero image: ${heroId}`)
  console.log(`   Story main: ${storyMainId}`)
  console.log(`   Story accent: ${storyAccentId}`)
  console.log(`   Gallery: ${galleryIds.length} images`)

  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})
