import { loadDbConfig } from './config'
import { createSqliteDriver } from './drivers/sqlite'
import { createPostgresDriver } from './drivers/postgres'
import type { Database } from './types'

export type { Database } from './types'
export type { DbConfig, DbDriver } from './config'

let instance: Database | null = null

/**
 * Returns the singleton database, selecting the driver from config
 * (local SQLite by default, external Postgres when DB_DRIVER=postgres).
 */
export function getDb(): Database {
  if (instance) return instance

  const config = loadDbConfig()
  instance =
    config.driver === 'postgres' ? createPostgresDriver(config) : createSqliteDriver(config)
  return instance
}
