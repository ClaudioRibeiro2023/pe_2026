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
  Tag,
  Search,
  Filter
} from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import type { PackAttachment } from '../types'

interface AttachmentListProps {
  attachments: PackAttachment[]
  onUpload?: (file: File, tags?: string[]) => Promise<void>
  onDelete?: (attachmentId: string) => Promise<void>
  isUploading?: boolean
  readonly?: boolean
}

export function AttachmentList({ 
  attachments, 
  onUpload, 
  onDelete,
  isUploading,
  readonly = false 
}: AttachmentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [newTags, setNewTags] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allTags = [...new Set(attachments.flatMap(a => a.tags))]

  const filteredAttachments = attachments.filter(att => {
    const matchesSearch = att.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || att.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUpload) return

    const tags = newTags.split(',').map(t => t.trim()).filter(Boolean)
    await onUpload(file, tags)
    setNewTags('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (contentType: string | null) => {
    if (!contentType) return File
    if (contentType.startsWith('image/')) return ImageIcon
    if (contentType.includes('pdf') || contentType.includes('document')) return FileText
    return File
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <File className="w-5 h-5" />
          Documentos ({attachments.length})
        </CardTitle>
        {!readonly && onUpload && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tags (separadas por vírgula)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="text-sm border border-border rounded px-2 py-1 w-48 bg-surface"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.md,.txt,.png,.jpg,.jpeg,.gif"
            />
            <Button 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-1" />
              {isUploading ? 'Enviando...' : 'Upload'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {attachments.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Buscar arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface"
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted" />
                <select
                  value={selectedTag || ''}
                  onChange={(e) => setSelectedTag(e.target.value || null)}
                  className="text-sm border border-border rounded px-2 py-1 bg-surface"
                >
                  <option value="">Todas as tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {filteredAttachments.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <File className="w-12 h-12 mx-auto mb-3 text-muted" />
            <p>Nenhum documento encontrado.</p>
            {!readonly && <p className="text-sm mt-1">Clique em "Upload" para adicionar.</p>}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAttachments.map((att) => {
              const Icon = getFileIcon(att.content_type)
              return (
                <div 
                  key={att.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-muted" />
                    <div>
                      <p className="font-medium text-foreground">{att.filename}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{formatFileSize(att.file_size)}</span>
                        <span>•</span>
                        <span>{att.version_label}</span>
                        {att.uploaded_by && (
                          <>
                            <span>•</span>
                            <span>{att.uploaded_by.split('@')[0]}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {format(new Date(att.uploaded_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      {att.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="w-3 h-3 text-muted" />
                          {att.tags.map(tag => (
                            <span 
                              key={tag}
                              className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    {!readonly && onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Excluir"
                        onClick={() => onDelete(att.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
