import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const DB_URL = process.env.DATABASE_URL
if (!DB_URL) {
  console.error('DATABASE_URL not found.')
  process.exit(1)
}

async function main() {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()

  // First, discover the actual column names in the media table
  const cols = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'media' ORDER BY ordinal_position`,
  )
  console.log('Media table columns:', cols.rows.map((r: any) => r.column_name).join(', '))

  const OLD_PREFIX = '/api/media/file/'
  const NEW_PREFIX = '/media/'

  // Find all columns that contain URL paths to update
  const urlColumns = cols.rows
    .map((r: any) => r.column_name as string)
    .filter((c: string) => c === 'url' || c === 'thumbnail_u_r_l' || c.endsWith('_url'))

  console.log('URL columns to update:', urlColumns.join(', '))

  for (const col of urlColumns) {
    const result = await client.query(
      `UPDATE media SET "${col}" = REPLACE("${col}", $1, $2) WHERE "${col}" LIKE $3`,
      [OLD_PREFIX, NEW_PREFIX, `${OLD_PREFIX}%`],
    )
    console.log(`  ${col}: updated ${result.rowCount} rows`)
  }

  // Verify
  const sample = await client.query('SELECT id, filename, url, thumbnail_u_r_l FROM media LIMIT 5')
  console.log('\nSample after update:')
  for (const row of sample.rows) {
    console.log(`  id=${row.id} filename=${row.filename} url=${row.url} thumb=${row.thumbnail_u_r_l}`)
  }

  await client.end()
  console.log('\nDone! URLs updated to use /media/ static path.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
