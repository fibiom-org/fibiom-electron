import { ElectronAPI } from '@electron-toolkit/preload'

interface DbStatus {
  driver: string
  connected: boolean
  target: string
}

interface DbAPI {
  status: () => Promise<DbStatus>
  query: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>
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
    dbAPI: DbAPI
    qvacAPI: QvacAPI
  }
}

export {}
