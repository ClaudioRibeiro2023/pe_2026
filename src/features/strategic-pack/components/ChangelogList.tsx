import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  History, 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle,
  MessageSquare,
  Edit3,
  Archive
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { cn } from '@/shared/lib/cn'
import type { PackChangeLog, ChangeType } from '../types'

interface ChangelogListProps {
  changelog: PackChangeLog[]
  maxItems?: number
}

const CHANGE_CONFIG: Record<ChangeType, { label: string; icon: React.ElementType; color: string }> = {
  created: { label: 'Pack criado', icon: FileText, color: 'text-green-600 bg-green-50' },
  updated: { label: 'Pack atualizado', icon: Edit3, color: 'text-blue-600 bg-blue-50' },
  published: { label: 'Pack publicado', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  archived: { label: 'Pack arquivado', icon: Archive, color: 'text-muted bg-accent' },
  attachment_added: { label: 'Documento adicionado', icon: Upload, color: 'text-purple-600 bg-purple-50' },
  attachment_removed: { label: 'Documento removido', icon: Trash2, color: 'text-red-600 bg-red-50' },
  section_updated: { label: 'Seção atualizada', icon: Edit3, color: 'text-blue-600 bg-blue-50' },
  status_changed: { label: 'Status alterado', icon: CheckCircle, color: 'text-yellow-600 bg-yellow-50' },
  comment_added: { label: 'Comentário adicionado', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
  comment_resolved: { label: 'Comentário resolvido', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
}

export function ChangelogList({ changelog, maxItems = 10 }: ChangelogListProps) {
  const displayItems = changelog.slice(0, maxItems)

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Alterações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-6 text-muted">
            <History className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhuma alteração registrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((log) => {
              const config = CHANGE_CONFIG[log.change_type]
              const Icon = config.icon

              return (
                <div 
                  key={log.id}
                  className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0"
                >
                  <div className={cn('p-2 rounded-lg', config.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {config.label}
                    </p>
                    <p className="text-xs text-muted">
                      {log.actor.split('@')[0]} • {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    {log.after && Object.keys(log.after).length > 0 && (
                      <p className="text-xs text-muted mt-1 truncate">
                        {JSON.stringify(log.after).slice(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {changelog.length > maxItems && (
          <p className="text-center text-sm text-muted mt-3">
            + {changelog.length - maxItems} alterações anteriores
          </p>
        )}
      </CardContent>
    </Card>
  )
}
