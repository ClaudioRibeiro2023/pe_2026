import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  FileText, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle,
  Send,
  Archive,
  Edit3
} from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'
import type { AreaStrategicPack, PackStatus } from '../types'

interface PackHeaderProps {
  pack: AreaStrategicPack
  areaName: string
  onPublish?: () => void
  onArchive?: () => void
  onEdit?: () => void
  isUpdating?: boolean
}

const STATUS_CONFIG: Record<PackStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { 
    label: 'Rascunho', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Edit3
  },
  review: { 
    label: 'Em Revisão', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle
  },
  published: { 
    label: 'Publicado', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  archived: { 
    label: 'Arquivado', 
    color: 'bg-accent text-muted border-border',
    icon: Archive
  },
}

export function PackHeader({ 
  pack, 
  areaName, 
  onPublish, 
  onArchive, 
  onEdit,
  isUpdating 
}: PackHeaderProps) {
  const statusConfig = STATUS_CONFIG[pack.status]
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-surface border-b border-border px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-foreground">
              PE-{pack.year} — {areaName}
            </h1>
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border',
              statusConfig.color
            )}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </span>
            <span className="text-sm text-muted bg-accent px-2 py-0.5 rounded">
              v{pack.version}
            </span>
          </div>
          
          {pack.summary && (
            <p className="text-muted max-w-2xl">{pack.summary}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted mt-2">
            {pack.owners?.headName && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {pack.owners.headName}
                {pack.owners.backupName && ` / ${pack.owners.backupName}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Atualizado em {format(new Date(pack.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pack.status === 'draft' && onPublish && (
            <Button 
              variant="outline" 
              onClick={onPublish}
              disabled={isUpdating}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar para Revisão
            </Button>
          )}
          
          {pack.status === 'review' && onPublish && (
            <Button 
              onClick={onPublish}
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          )}

          {pack.status === 'published' && onArchive && (
            <Button 
              variant="outline" 
              onClick={onArchive}
              disabled={isUpdating}
            >
              <Archive className="w-4 h-4 mr-2" />
              Arquivar
            </Button>
          )}

          {onEdit && pack.status !== 'archived' && (
            <Button 
              variant="ghost"
              onClick={onEdit}
              disabled={isUpdating}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
