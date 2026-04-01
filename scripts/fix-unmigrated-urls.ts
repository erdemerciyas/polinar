import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const FOLDER = 'polinar/media'

function buildUrl(filename: string, transform?: string): string {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '')
  const ext = filename.split('.').pop()
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
  const t = transform ? `/${transform}` : ''
  return `${base}${t}/v1/${FOLDER}/${nameWithoutExt}.${ext}`
}

async function main() {
  const DB_URL = process.env.DATABASE_URL
  if (!DB_URL) { console.error('DATABASE_URL not found.'); process.exit(1) }

  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()

  const r = await client.query(
    `SELECT id, filename FROM media WHERE url NOT LIKE 'https://res.cloudinary.com/%'`,
  )

  console.log(`Found ${r.rows.length} unmigrated record(s).\n`)

  for (const row of r.rows) {
    const { id, filename } = row
    const mainUrl = buildUrl(filename)
    const thumbUrl = buildUrl(filename, 'c_fill,w_320,h_240,q_auto,f_auto')
    const cardUrl = buildUrl(filename, 'c_fill,w_600,h_400,q_auto,f_auto')
    const heroUrl = buildUrl(filename, 'c_fill,w_1920,h_800,q_auto,f_auto')

    await client.query(
      `UPDATE media SET 
        url = $1, 
        thumbnail_u_r_l = $2, 
        sizes_thumbnail_url = $2, 
        sizes_card_url = $3, 
        sizes_hero_url = $4 
       WHERE id = $5`,
      [mainUrl, thumbUrl, cardUrl, heroUrl, id],
    )
    console.log(`  Fixed id=${id} filename=${filename} -> ${mainUrl}`)
  }

  await client.end()
  console.log('\nDone!')
}
main()
