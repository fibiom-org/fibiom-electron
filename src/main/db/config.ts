import { app } from 'electron'
import { join } from 'path'

export type DbDriver = 'sqlite' | 'postgres'

export interface DbConfig {
  driver: DbDriver
  /** Absolute path to the local SQLite file (sqlite driver only). */
  file: string
  /** Connection string for an external database, e.g. postgres://… (postgres driver only). */
  url?: string
}

/**
 * Resolves the active database configuration.
 *
 * Defaults to a local SQLite file under the repo's `db/` folder in dev, or the
 * app's userData folder once packaged. Set `DB_DRIVER=postgres` + `DATABASE_URL`
 * to point at an external database instead.
 */
export function loadDbConfig(): DbConfig {
  const driver = (process.env.DB_DRIVER as DbDriver) ?? 'sqlite'
  const url = process.env.DATABASE_URL

  // In dev the repo root is cwd; once packaged, write to a user-writable dir.
  const baseDir = app.isPackaged ? app.getPath('userData') : join(process.cwd(), 'db')
  const file = process.env.SQLITE_PATH ?? join(baseDir, 'app.sqlite')

  return { driver, file, url }
}
