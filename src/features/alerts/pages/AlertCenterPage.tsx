import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Bell, AlertTriangle, Info, CheckCircle, Filter, RefreshCw } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { Alert, AlertSeverity, AlertStatus, AlertStats } from '../types'

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Meta de receita abaixo do esperado',
    description: 'A meta de receita Q1 está 15% abaixo do planejado. Ação corretiva necessária.',
    severity: 'critical',
    status: 'active',
    category: 'goal',
    source_type: 'goal',
    source_id: 'goal-1',
    source_label: 'Meta Receita Q1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prazo de plano de ação próximo',
    description: 'O plano "Expansão Regional" vence em 3 dias.',
    severity: 'warning',
    status: 'active',
    category: 'deadline',
    source_type: 'action_plan',
    source_id: 'plan-1',
    source_label: 'Expansão Regional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Indicador atualizado com sucesso',
    description: 'O indicador NPS foi atualizado para 78 pontos.',
    severity: 'success',
    status: 'resolved',
    category: 'indicator',
    source_type: 'indicator',
    source_id: 'ind-1',
    source_label: 'NPS',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Nova evidência pendente de aprovação',
    description: 'Uma nova evidência foi submetida e aguarda validação.',
    severity: 'info',
    status: 'active',
    category: 'compliance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockStats: AlertStats = {
  total: 12,
  critical: 2,
  warning: 4,
  info: 6,
  active: 8,
  acknowledged: 2,
  resolved: 2,
}

const severityConfig: Record<AlertSeverity, { icon: typeof Bell; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-900/30' },
  warning: { icon: AlertTriangle, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' },
  info: { icon: Info, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  success: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' },
}

export function AlertCenterPage() {
  const [alerts] = useState<Alert[]>(mockAlerts)
  const [stats] = useState<AlertStats>(mockStats)
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all')
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all')

  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centro de Alertas</h1>
          <p className="text-muted mt-1">Monitore e gerencie alertas do sistema</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-danger-100 dark:bg-danger-900/30">
                <AlertTriangle className="h-5 w-5 text-danger-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                <p className="text-sm text-muted">Críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.warning}</p>
                <p className="text-sm text-muted">Avisos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Info className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.info}</p>
                <p className="text-sm text-muted">Informativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                <p className="text-sm text-muted">Resolvidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <label className="text-sm font-medium text-muted">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AlertStatus | 'all')}
                className="block w-40 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="acknowledged">Reconhecidos</option>
                <option value="resolved">Resolvidos</option>
                <option value="dismissed">Dispensados</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Severidade</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'all')}
                className="block w-40 px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todas</option>
                <option value="critical">Crítico</option>
                <option value="warning">Aviso</option>
                <option value="info">Informativo</option>
                <option value="success">Sucesso</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas ({filteredAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum alerta encontrado</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const config = severityConfig[alert.severity]
                const Icon = config.icon

                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className={cn('p-2 rounded-lg', config.bg)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">{alert.title}</h3>
                          <p className="text-sm text-muted mt-1">{alert.description}</p>
                          {alert.source_label && (
                            <p className="text-xs text-muted mt-2">
                              Fonte: <span className="font-medium">{alert.source_label}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'px-2 py-1 text-xs font-medium rounded-full',
                              alert.status === 'active' && 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
                              alert.status === 'acknowledged' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
                              alert.status === 'resolved' && 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
                              alert.status === 'dismissed' && 'bg-muted/20 text-muted'
                            )}
                          >
                            {alert.status === 'active' && 'Ativo'}
                            {alert.status === 'acknowledged' && 'Reconhecido'}
                            {alert.status === 'resolved' && 'Resolvido'}
                            {alert.status === 'dismissed' && 'Dispensado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
