import { useState, useRef } from 'react'
import { Upload, X, File, Loader2 } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export function FileUpload({ 
  onUpload, 
  accept = '*', 
  maxSize = 5 * 1024 * 1024,
  disabled = false 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      addToast({
        type: 'error',
        title: 'Arquivo muito grande',
        message: `O arquivo deve ter no máximo ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      await onUpload(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      addToast({
        type: 'success',
        title: 'Upload concluído',
        message: 'O arquivo foi enviado com sucesso.',
      })
    } catch (_error) {
      addToast({
        type: 'error',
        title: 'Erro no upload',
        message: 'Não foi possível enviar o arquivo.',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 text-muted mb-2" />
            <p className="text-sm font-medium text-foreground">
              Clique para selecionar um arquivo
            </p>
            <p className="text-xs text-muted mt-1">
              Tamanho máximo: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-accent rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={handleCancel}
                className="text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading}
              size="sm"
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Enviar Arquivo
                </>
              )}
            </Button>
            {!uploading && (
              <Button
                variant="outline"
                onClick={handleCancel}
                size="sm"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
