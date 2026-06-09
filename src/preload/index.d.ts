import { ElectronAPI } from '@electron-toolkit/preload'

interface AuthStatus {
  /** Whether a master key has been configured (an encrypted db exists). */
  initialized: boolean
  /** Whether the db is currently unlocked in this session. */
  unlocked: boolean
}

interface AuthAPI {
  status: () => Promise<AuthStatus>
  /** First run: create the encrypted db from a new master key. */
  setup: (masterKey: string) => Promise<void>
  /** Returns false when the master key is wrong. */
  unlock: (masterKey: string) => Promise<boolean>
  lock: () => Promise<void>
  /** Wipe the encrypted db so a new master key can be set. */
  reset: () => Promise<void>
}

interface DbAPI {
  status: () => Promise<AuthStatus>
  query: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>
  exec: (sql: string, params?: unknown[]) => Promise<void>
}

interface QvacAPI {
  loadModel: () => Promise<string>
  infer: (history: { role: string; content: string }[]) => Promise<void>
  onCompletionStream: (cb: (token: string) => void) => void
  unloadModel: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    authAPI: AuthAPI
    dbAPI: DbAPI
    qvacAPI: QvacAPI
  }
}

export {}
