import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const STATIC_DIR = path.resolve('public/images')
const CLOUD_FOLDER = 'polinar/static'

interface UploadResult {
  localPath: string
  publicId: string
  secureUrl: string
}

function getAllFiles(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...getAllFiles(path.join(dir, entry.name), rel))
    } else {
      files.push(rel)
    }
  }
  return files
}

async function uploadFile(relPath: string): Promise<UploadResult> {
  const absPath = path.join(STATIC_DIR, relPath)
  const ext = path.extname(relPath).toLowerCase()
  const nameWithoutExt = relPath.replace(/\.[^.]+$/, '').replace(/\\/g, '/')
  const publicId = `${CLOUD_FOLDER}/${nameWithoutExt}`

  const isPdf = ext === '.pdf'
  const resourceType = isPdf ? 'raw' as const : 'image' as const

  const result = await cloudinary.uploader.upload(absPath, {
    public_id: publicId,
    resource_type: resourceType,
    overwrite: true,
    invalidate: true,
    use_filename: false,
    unique_filename: false,
  })

  return {
    localPath: `/images/${relPath.replace(/\\/g, '/')}`,
    publicId: result.public_id,
    secureUrl: result.secure_url,
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in env')
    process.exit(1)
  }

  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`)
  console.log(`Scanning ${STATIC_DIR}...\n`)

  const files = getAllFiles(STATIC_DIR)
  console.log(`Found ${files.length} files to upload.\n`)

  const results: UploadResult[] = []
  const errors: { file: string; error: string }[] = []

  for (const file of files) {
    try {
      process.stdout.write(`  Uploading ${file}...`)
      const result = await uploadFile(file)
      results.push(result)
      console.log(` OK -> ${result.secureUrl}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      errors.push({ file, error: msg })
      console.log(` FAILED: ${msg}`)
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Uploaded: ${results.length}/${files.length}`)
  if (errors.length > 0) {
    console.log(`Failed: ${errors.length}`)
    errors.forEach((e) => console.log(`  - ${e.file}: ${e.error}`))
  }

  // Write URL mapping for code replacement
  const mapping: Record<string, string> = {}
  for (const r of results) {
    mapping[r.localPath] = r.secureUrl
  }
  const mapPath = path.resolve('scripts/cloudinary-static-map.json')
  fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2) + '\n', 'utf-8')
  console.log(`\nURL mapping saved to ${mapPath}`)
}

main().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
