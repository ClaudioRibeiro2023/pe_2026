import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { History, ArrowRight } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useActionHistory } from '../hooks'
import type { ActionHistory } from '../types'

interface ActionHistoryListProps {
  actionId: string
}

export function ActionHistoryList({ actionId }: ActionHistoryListProps) {
  const { data: history, isLoading } = useActionHistory(actionId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted">
          Carregando histórico...
        </CardContent>
      </Card>
    )
  }

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      status: 'Status',
      priority: 'Prioridade',
      responsible: 'Responsável',
      due_date: 'Data de Entrega',
      start_date: 'Data de Início',
      title: 'Título',
      description: 'Descrição',
      progress: 'Progresso',
      notes: 'Observações',
    }
    return labels[field] || field
  }

  const formatValue = (field: string, value: string | null) => {
    if (value === null) return '-'
    
    if (field === 'due_date' || field === 'start_date') {
      try {
        return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
      } catch {
        return value
      }
    }
    
    if (field === 'progress') {
      return `${value}%`
    }
    
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Alterações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <div className="space-y-3">
            {history.map((entry: ActionHistory) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 bg-accent rounded-lg"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      {getFieldLabel(entry.field_changed)}
                    </span>
                    <span className="text-muted">alterado</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="text-muted line-through">
                      {formatValue(entry.field_changed, entry.old_value)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted" />
                    <span className="text-foreground font-medium">
                      {formatValue(entry.field_changed, entry.new_value)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {format(new Date(entry.changed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted">
            <History className="w-8 h-8 mx-auto mb-2 text-muted" />
            <p className="text-sm">Nenhuma alteração registrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
