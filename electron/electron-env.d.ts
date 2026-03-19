declare namespace NodeJS {
  interface ProcessEnv {
    VITE_DEV_SERVER_URL?: string
    DIST: string
    VITE_PUBLIC: string
  }
}

interface Window {
  electronAPI?: {
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
}
