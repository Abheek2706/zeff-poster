import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.join(__dirname, "..", "migrations")

async function loadEnvFile(filename) {
  try {
    const contents = await fs.readFile(path.join(__dirname, "..", filename), "utf8")

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) {
        continue
      }

      const separatorIndex = trimmed.indexOf("=")
      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()

      if (key && !(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    // Ignore missing env files so the script can still rely on process.env.
  }
}

await loadEnvFile(".env")
await loadEnvFile(".env.local")

const connectionString = process.env.DATABASE_URL?.trim()

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.")
}

const pool = new Pool({ connectionString })

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function run() {
  await ensureMigrationsTable()

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right))

  const appliedResult = await pool.query("SELECT name FROM schema_migrations")
  const applied = new Set(appliedResult.rows.map((row) => row.name))

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping ${file}`)
      continue
    }

    const client = await pool.connect()

    try {
      console.log(`Applying ${file}`)
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8")
      await client.query("BEGIN")
      await client.query(sql)
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file])
      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  console.log("Migrations complete.")
}

run()
  .catch((error) => {
    console.error("Migration failed:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
