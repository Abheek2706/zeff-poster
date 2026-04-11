import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg"

const connectionString = process.env.DATABASE_URL?.trim()

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.")
}

declare global {
  var __zeffDbPool: Pool | undefined
}

const pool =
  global.__zeffDbPool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })

if (process.env.NODE_ENV !== "production") {
  global.__zeffDbPool = pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params)
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export { pool }
