/** Minimal driver-agnostic database surface the rest of the app codes against. */
export interface Database {
  /** Run a query and return all rows. */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>
  /** Run a statement that returns no rows (INSERT/UPDATE/DDL). */
  exec(sql: string, params?: unknown[]): Promise<void>
  /** Open the connection / file and run any pending migrations. */
  connect(): Promise<void>
  /** Close the connection. */
  close(): Promise<void>
  /** Lightweight liveness info for the UI status indicator. */
  status(): { driver: string; connected: boolean; target: string }
}
