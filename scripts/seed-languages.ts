/**
 * Idempotently seed all 5 default languages into the Languages collection
 * and sync src/lib/locales.json. Safe to run against production.
 *
 * Usage: npm run seed:languages
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import { DEFAULT_LANGUAGES } from '../src/lib/default-languages'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOCALES_PATH = path.resolve(__dirname, '../src/lib/locales.json')

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

let created = 0
for (const lang of DEFAULT_LANGUAGES) {
  const exists = await client.query('SELECT id FROM languages WHERE code = $1', [lang.code])
  if (exists.rows.length > 0) {
    console.log(`  ⏭️  Exists: ${lang.code}`)
    continue
  }

  await client.query(
    `INSERT INTO languages (code, label, native_label, short_label, is_default, is_active, is_r_t_l, flag_emoji, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      lang.code,
      lang.label,
      lang.nativeLabel,
      lang.shortLabel,
      lang.isDefault,
      lang.isActive,
      lang.isRTL,
      lang.flagEmoji ?? null,
      lang.sortOrder,
    ],
  )
  console.log(`  ✓ Created: ${lang.code}`)
  created++

  await client.query(`ALTER TYPE _locales ADD VALUE IF NOT EXISTS '${lang.code}'`)
  console.log(`  ✓ Enum _locales: ${lang.code}`)
}

// Ensure all default locale codes exist in PostgreSQL enum
for (const lang of DEFAULT_LANGUAGES) {
  await client.query(`ALTER TYPE _locales ADD VALUE IF NOT EXISTS '${lang.code}'`)
}

const allLangs = await client.query(
  `SELECT code, label, is_active, is_default, sort_order FROM languages ORDER BY sort_order`,
)
const defaultLang = allLangs.rows.find((r) => r.is_default) || allLangs.rows[0]
const localesData = {
  locales: allLangs.rows
    .filter((r) => r.is_active)
    .map((r) => ({ label: r.label, code: r.code })),
  defaultLocale: defaultLang?.code || 'en',
}

fs.writeFileSync(LOCALES_PATH, JSON.stringify(localesData, null, 2) + '\n', 'utf-8')
console.log(`✓ locales.json synced: ${localesData.locales.map((l) => l.code).join(', ')}`)
console.log(created > 0 ? `Done. ${created} language(s) added.` : 'Done. No new languages needed.')

await client.end()
