/**
 * PostgreSQL logical data export using COPY (text).
 * Loads DATABASE_URL from .env; .env.local overrides when present.
 *
 * Prefer native `pg_dump` when installed; this script is a fallback (e.g. no local client / Docker).
 * Usage: npx tsx scripts/export-db.ts
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'node:stream/promises'

import pg from 'pg'
import { to as copyTo } from 'pg-copy-streams'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

function quoteIdentPart(s: string) {
  return `"${String(s).replace(/"/g, '""')}"`
}

async function writeAll(ws: fs.WriteStream, chunk: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    ws.write(chunk, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function loadTables(client: pg.Client): Promise<{ schema: string; name: string; full: string }[]> {
  const r = await client.query<{ schemaname: string; tablename: string }>(
    `
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY schemaname, tablename
  `,
  )
  return r.rows.map((row) => ({
    schema: row.schemaname,
    name: row.tablename,
    full: `${row.schemaname}.${row.tablename}`,
  }))
}

async function loadFkEdges(client: pg.Client): Promise<[string, string][]> {
  const r = await client.query<{
    from_schema: string
    from_table: string
    to_schema: string
    to_table: string
  }>(
    `
    SELECT
      tc.table_schema AS from_schema,
      tc.table_name AS from_table,
      ccu.table_schema AS to_schema,
      ccu.table_name AS to_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema NOT IN ('pg_catalog', 'information_schema')
  `,
  )

  const edges: [string, string][] = []
  const seen = new Set<string>()
  for (const row of r.rows) {
    const prereq = `${row.to_schema}.${row.to_table}`
    const dep = `${row.from_schema}.${row.from_table}`
    const key = `${prereq}|${dep}`
    if (seen.has(key)) continue
    seen.add(key)
    edges.push([prereq, dep])
  }
  return edges
}

function topoOrder(tableFullNames: string[], edges: [string, string][]): string[] {
  const nodes = new Set(tableFullNames)
  const indegree = new Map<string, number>()
  const adj = new Map<string, string[]>()
  for (const n of nodes) {
    indegree.set(n, 0)
    adj.set(n, [])
  }
  for (const [prereq, dep] of edges) {
    if (!nodes.has(prereq) || !nodes.has(dep)) continue
    adj.get(prereq)!.push(dep)
    indegree.set(dep, (indegree.get(dep) ?? 0) + 1)
  }
  const q = [...nodes].filter((n) => indegree.get(n) === 0).sort()
  const out: string[] = []
  while (q.length) {
    const n = q.shift()!
    out.push(n)
    const next = (adj.get(n) ?? []).slice().sort()
    for (const m of next) {
      indegree.set(m, indegree.get(m)! - 1)
      if (indegree.get(m) === 0) {
        const pos = q.findIndex((x) => x > m)
        if (pos === -1) q.push(m)
        else q.splice(pos, 0, m)
      }
    }
  }
  if (out.length !== nodes.size) {
    console.warn('FK graph has a cycle or unresolved deps; using alphabetical table order.')
    return [...nodes].sort()
  }
  return out
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set (.env / .env.local).')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outFile = path.join(process.cwd(), `polinar-db-export-${stamp}.sql`)
const fh = fs.createWriteStream(outFile, { flags: 'w' })
fh.setMaxListeners(0)

try {
  await client.connect()
  const tables = await loadTables(client)
  if (tables.length === 0) {
    console.warn('No user tables found; writing empty header only.')
  }
  const edges = await loadFkEdges(client)
  const order = topoOrder(
    tables.map((t) => t.full),
    edges,
  )
  const byFull = new Map(tables.map((t) => [t.full, t]))

  await writeAll(
    fh,
    [
      '-- Polinar PostgreSQL export (table data via COPY text format)',
      `-- ${new Date().toISOString()}`,
      '-- Restore into a DB that already has the same schema (e.g. after Payload migrations).',
      'BEGIN;',
      'SET session_replication_role = replica;',
      'SET statement_timeout = 0;',
      'SET lock_timeout = 0;',
      '',
    ].join('\n'),
  )

  for (const full of order) {
    const t = byFull.get(full)
    if (!t) continue
    const ident = `${quoteIdentPart(t.schema)}.${quoteIdentPart(t.name)}`
    process.stdout.write(`Exporting ${ident}\n`)
    await writeAll(fh, `\n-- ${ident}\nCOPY ${ident} FROM stdin;\n`)
    const copyStream = client.query(copyTo(`COPY ${ident} TO STDOUT`))
    await pipeline(copyStream, fh, { end: false })
    await writeAll(fh, '\n\\.\n')
  }

  await writeAll(fh, '\nCOMMIT;\n')
} finally {
  await new Promise<void>((resolve, reject) => {
    fh.end((err) => (err ? reject(err) : resolve()))
  })
  await client.end().catch(() => {})
}

console.log(`Done. Wrote ${outFile}`)
