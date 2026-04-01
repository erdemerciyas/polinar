import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import pg from 'pg'

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

const cols = ['url', 'thumbnail_u_r_l', 'sizes_thumbnail_url', 'sizes_card_url', 'sizes_hero_url']
for (const col of cols) {
  const r = await client.query(
    `UPDATE media SET "${col}" = REPLACE("${col}", '/api/media/file/', '/media/') WHERE "${col}" LIKE '/api/media/file/%'`,
  )
  console.log(`${col}: updated ${r.rowCount} rows`)
}

const s = await client.query('SELECT id, filename, url, thumbnail_u_r_l FROM media LIMIT 3')
for (const row of s.rows) {
  console.log(`  id=${row.id} url=${row.url} thumb=${row.thumbnail_u_r_l}`)
}

await client.end()
console.log('Done! URLs updated to /media/ static path.')
