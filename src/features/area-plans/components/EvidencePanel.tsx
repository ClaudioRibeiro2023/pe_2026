import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Upload, 
  FileText, 
  ImageIcon, 
  File, 
  Trash2, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EvidenceStatusBadge } from './StatusBadge'
import { useUploadEvidence, useDeleteEvidence } from '../hooks'
import type { ActionEvidence } from '../types'

interface EvidencePanelProps {
  actionId: string
  evidences: ActionEvidence[]
  readonly?: boolean
  requiresEvidence?: boolean
}

export function EvidencePanel({ 
  actionId, 
  evidences, 
  readonly = false,
  requiresEvidence = true 
}: EvidencePanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadEvidence = useUploadEvidence()
  const deleteEvidence = useDeleteEvidence()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      try {
        await uploadEvidence.mutateAsync({ actionId, file })
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDelete = async (evidenceId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta evidência?')) return

    try {
      await deleteEvidence.mutateAsync({ evidenceId, actionId })
    } catch (error) {
      console.error('Erro ao excluir evidência:', error)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon
    if (mimeType.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJEITADA':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'PENDENTE':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'APROVADA_GESTOR':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const pendingCount = evidences.filter(e => e.status === 'PENDENTE').length
  const approvedCount = evidences.filter(e => e.status === 'APROVADA').length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Evidências
            {requiresEvidence && evidences.length === 0 && (
              <span className="text-xs text-red-500 font-normal">(obrigatória)</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            {pendingCount > 0 && (
              <span className="text-yellow-600">{pendingCount} pendente(s)</span>
            )}
            {approvedCount > 0 && (
              <span className="text-green-600">{approvedCount} aprovada(s)</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readonly && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-border hover:border-primary-400 hover:bg-accent'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <Upload className={cn(
              'w-8 h-8 mx-auto mb-2',
              isDragging ? 'text-blue-500' : 'text-muted'
            )} />
            <p className="text-sm text-muted">
              {isDragging 
                ? 'Solte os arquivos aqui' 
                : 'Arraste arquivos ou clique para selecionar'}
            </p>
            <p className="text-xs text-muted mt-1">
              PDF, imagens, documentos (máx. 10MB)
            </p>
            {uploadEvidence.isPending && (
              <p className="text-sm text-blue-600 mt-2">Enviando...</p>
            )}
          </div>
        )}

        {evidences.length > 0 ? (
          <div className="space-y-2">
            {evidences.map((evidence) => {
              const FileIcon = getFileIcon(evidence.mime_type)

              return (
                <div
                  key={evidence.id}
                  className="flex items-center gap-3 p-3 bg-accent rounded-lg group"
                >
                  <div className="p-2 bg-surface rounded-lg border border-border">
                    <FileIcon className="w-5 h-5 text-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {evidence.filename}
                      </p>
                      {getStatusIcon(evidence.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{formatFileSize(evidence.file_size)}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(evidence.submitted_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  <EvidenceStatusBadge status={evidence.status} />

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implementar download de evidência
                        void evidence.storage_path
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {!readonly && evidence.status === 'PENDENTE' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(evidence.id)}
                        disabled={deleteEvidence.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted">
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted" />
            <p className="text-sm">Nenhuma evidência anexada</p>
            {requiresEvidence && (
              <p className="text-xs text-red-500 mt-1">
                Esta ação requer evidência para ser concluída
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
