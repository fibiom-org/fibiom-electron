import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    loadModel: () => Promise<string>
    infer: (history: { role: string; content: string }[]) => Promise<void>
    onCompletionStream: (cb: (token: string) => void) => void
    unloadModel: () => Promise<string>
  }
}

export {}
