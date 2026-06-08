import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

const langs = await client.query(
  'SELECT id, code, label, native_label, short_label, is_active, is_default, sort_order FROM languages ORDER BY sort_order',
)
console.log('=== DB languages collection ===')
console.log(JSON.stringify(langs.rows, null, 2))

const locales = await client.query(
  "SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = '_locales') ORDER BY enumsortorder",
)
console.log('\n=== PostgreSQL _locales enum ===')
console.log(locales.rows.map((r) => r.enumlabel).join(', '))

// Check if CMS has localized rows for missing languages
for (const code of ['ar', 'ru']) {
  const nav = await client.query(
    `SELECT COUNT(*)::int AS count FROM navigation_locales WHERE _locale = $1`,
    [code],
  )
  const footer = await client.query(
    `SELECT COUNT(*)::int AS count FROM footer_locales WHERE _locale = $1`,
    [code],
  )
  console.log(`\n=== CMS rows for ${code} ===`)
  console.log(`navigation_locales: ${nav.rows[0].count}`)
  console.log(`footer_locales: ${footer.rows[0].count}`)
}

try {
  const versions = await client.query(
    `SELECT id, parent_id, version__status, created_at FROM _languages_v ORDER BY created_at DESC LIMIT 30`,
  )
  console.log('\n=== languages version history (recent) ===')
  console.log(JSON.stringify(versions.rows, null, 2))
} catch {
  console.log('\n(no _languages_v table)')
}

await client.end()
