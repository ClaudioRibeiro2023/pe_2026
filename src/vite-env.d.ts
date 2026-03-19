/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ElectronAPI {
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getTheme: () => Promise<'light' | 'dark'>
  checkForUpdates: () => Promise<unknown>
  installUpdate: () => void
  onUpdateAvailable: (callback: (info: unknown) => void) => void
  onUpdateProgress: (callback: (progress: unknown) => void) => void
  onUpdateDownloaded: (callback: (info: unknown) => void) => void
  removeUpdateListeners: () => void
}

interface Window {
  electronAPI?: ElectronAPI
}
