import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { ScrollText, Filter, User, Edit2, Trash2, Plus, CheckCircle } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { AuditLog, AuditAction } from '../types'

const mockLogs: AuditLog[] = [
  {
    id: '1',
    action: 'update',
    entity_type: 'goal',
    entity_id: 'goal-1',
    entity_label: 'Meta de Receita Q1',
    user_id: 'user-1',
    user_name: 'João Silva',
    user_email: 'joao@empresa.com',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    action: 'create',
    entity_type: 'action_plan',
    entity_id: 'plan-1',
    entity_label: 'Plano de Expansão Regional',
    user_id: 'user-2',
    user_name: 'Maria Santos',
    user_email: 'maria@empresa.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    action: 'approve',
    entity_type: 'evidence',
    entity_id: 'ev-1',
    entity_label: 'Relatório Financeiro Q4',
    user_id: 'user-1',
    user_name: 'João Silva',
    user_email: 'joao@empresa.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    action: 'delete',
    entity_type: 'indicator',
    entity_id: 'ind-1',
    entity_label: 'Indicador Obsoleto',
    user_id: 'user-3',
    user_name: 'Carlos Oliveira',
    user_email: 'carlos@empresa.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

const actionConfig: Record<AuditAction, { icon: typeof Edit2; color: string; label: string }> = {
  create: { icon: Plus, color: 'text-success-600', label: 'Criou' },
  update: { icon: Edit2, color: 'text-primary-600', label: 'Atualizou' },
  delete: { icon: Trash2, color: 'text-danger-600', label: 'Excluiu' },
  view: { icon: ScrollText, color: 'text-muted', label: 'Visualizou' },
  export: { icon: ScrollText, color: 'text-primary-600', label: 'Exportou' },
  login: { icon: User, color: 'text-success-600', label: 'Login' },
  logout: { icon: User, color: 'text-muted', label: 'Logout' },
  approve: { icon: CheckCircle, color: 'text-success-600', label: 'Aprovou' },
  reject: { icon: Trash2, color: 'text-danger-600', label: 'Rejeitou' },
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  return `${diffDays}d atrás`
}

export function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(mockLogs)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trilhas de Auditoria</h1>
          <p className="text-muted mt-1">Histórico completo de ações no sistema</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Ação</label>
              <select className="block w-40 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Todas</option>
                <option value="create">Criação</option>
                <option value="update">Atualização</option>
                <option value="delete">Exclusão</option>
                <option value="approve">Aprovação</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Entidade</label>
              <select className="block w-40 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Todas</option>
                <option value="goal">Metas</option>
                <option value="indicator">Indicadores</option>
                <option value="action_plan">Planos de Ação</option>
                <option value="evidence">Evidências</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Período</label>
              <select className="block w-40 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {logs.map((log) => {
              const config = actionConfig[log.action]
              const Icon = config.icon

              return (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors">
                  <div className={cn('p-2 rounded-lg bg-accent')}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.user_name}</span>
                      {' '}
                      <span className={config.color}>{config.label.toLowerCase()}</span>
                      {' '}
                      <span className="font-medium">{log.entity_label}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span>{log.user_email}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
