import { useState, useEffect } from 'react'
import { Download, RefreshCw, X } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'

interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseNotes?: string
}

interface DownloadProgress {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)
  const [updateReady, setUpdateReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!window.electronAPI) return

    window.electronAPI.onUpdateAvailable((info) => {
      setUpdateAvailable(info as UpdateInfo)
    })

    window.electronAPI.onUpdateProgress((progress) => {
      setDownloadProgress(progress as DownloadProgress)
    })

    window.electronAPI.onUpdateDownloaded(() => {
      setUpdateReady(true)
      setDownloadProgress(null)
    })

    return () => {
      window.electronAPI?.removeUpdateListeners()
    }
  }, [])

  const handleInstall = () => {
    window.electronAPI?.installUpdate()
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  if (!window.electronAPI || dismissed) return null

  if (updateReady) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold">Atualização Pronta</h4>
            <p className="text-sm text-green-100 mt-1">
              Versão {updateAvailable?.version} está pronta para instalar.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstall}
                className="bg-white text-green-700 hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reiniciar e Atualizar
              </Button>
              <button
                onClick={handleDismiss}
                className="text-green-200 hover:text-white text-sm"
              >
                Depois
              </button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-green-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  if (downloadProgress) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 mt-0.5 flex-shrink-0 animate-bounce" />
          <div className="flex-1">
            <h4 className="font-semibold">Baixando Atualização</h4>
            <p className="text-sm text-blue-100 mt-1">
              Versão {updateAvailable?.version}
            </p>
            <div className="mt-2">
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress.percent}%` }}
                />
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {Math.round(downloadProgress.percent)}% concluído
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold">Nova Atualização Disponível</h4>
            <p className="text-sm text-blue-100 mt-1">
              Versão {updateAvailable.version} está sendo baixada automaticamente.
            </p>
          </div>
          <button onClick={handleDismiss} className="text-blue-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return null
}
