import type { DbConfig } from '../config'
import type { Database } from '../types'

/**
 * Local SQLite driver — STUB.
 *
 * To make it real:
 *   1. `yarn add better-sqlite3` (native; rebuilt via electron-builder install-app-deps)
 *   2. open `config.file`, e.g. `new BetterSqlite3(config.file)`
 *   3. map query/exec onto prepared statements (better-sqlite3 is synchronous,
 *      so wrap the results in Promise.resolve to satisfy this async interface)
 */
export function createSqliteDriver(config: DbConfig): Database {
  let connected = false

  return {
    async connect() {
      // const db = new BetterSqlite3(config.file)
      // db.pragma('journal_mode = WAL')
      // run migrations…
      connected = true
    },
    async query<T>(_sql: string, _params?: unknown[]): Promise<T[]> {
      throw new Error('sqlite driver not implemented — see src/main/db/drivers/sqlite.ts')
    },
    async exec(_sql: string, _params?: unknown[]) {
      throw new Error('sqlite driver not implemented — see src/main/db/drivers/sqlite.ts')
    },
    async close() {
      connected = false
    },
    status() {
      return { driver: 'sqlite', connected, target: config.file }
    }
  }
}
