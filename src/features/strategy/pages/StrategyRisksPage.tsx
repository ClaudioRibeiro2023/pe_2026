import { AlertTriangle, ShieldAlert, Target, TrendingUp } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { useStrategicRisks } from '@/features/area-plans/hooks'

const levelConfig: Record<string, { gradient: string; light: string; border: string; text: string; icon: typeof ShieldAlert }> = {
  CRITICO: {
    gradient: 'from-danger-500 to-danger-600',
    light: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-700',
    icon: ShieldAlert,
  },
  ALTO: {
    gradient: 'from-warning-500 to-warning-600',
    light: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-700',
    icon: AlertTriangle,
  },
  MONITORADO: {
    gradient: 'from-primary-400 to-primary-500',
    light: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    icon: Target,
  },
}

export function StrategyRisksPage() {
  const { data: risks, isLoading, isError, error, refetch } = useStrategicRisks()

  if (isLoading) {
    return <PageLoader text="Carregando alertas e riscos..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar Alertas & Riscos"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const alerts = risks ?? []

  const sortedAlerts = [...alerts].sort((a, b) => {
    const order: Record<string, number> = { CRITICO: 0, ALTO: 1, MONITORADO: 2 }
    return (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
  })

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICO').length
  const attentionCount = alerts.filter((a) => a.severity === 'ALTO').length

  if (alerts.length === 0) {
    return (
      <EmptyState
        title="Sem alertas"
        description="Nenhum alerta crítico foi encontrado no contexto atual."
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoTooltip
          title="Alertas Críticos"
          description="Alertas com impacto máximo que exigem ação imediata."
          details={`${criticalCount} alertas críticos ativos`}
        >
          <Card className="bg-gradient-to-br from-danger-50 to-white border-danger-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-danger-100">
                  <ShieldAlert className="h-5 w-5 text-danger-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-danger-700">{criticalCount}</p>
                  <p className="text-xs text-muted">Críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Alertas em Atenção"
          description="Alertas em monitoramento próximo para evitar escalada."
          details={`${attentionCount} alertas em atenção`}
        >
          <Card className="bg-gradient-to-br from-warning-50 to-white border-warning-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning-100">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-700">{attentionCount}</p>
                  <p className="text-xs text-muted">Em Atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Total de Alertas"
          description="Quantidade total de alertas críticos em aberto."
          details={`${alerts.length} riscos catalogados (DOC 10 v2)`}
        >
          <Card className="bg-gradient-to-br from-accent to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <Target className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                  <p className="text-xs text-muted">Total de Alertas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Categorias"
          description="Diversidade de categorias de risco monitoradas."
          details={`${new Set(alerts.map((a) => a.category)).size} categorias distintas`}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(alerts.map((a) => a.category)).size}
                  </p>
                  <p className="text-xs text-muted">Categorias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedAlerts.map((alert) => {
          const config = levelConfig[alert.severity] ?? levelConfig.MONITORADO
          const Icon = config.icon

          return (
            <InfoTooltip
              key={alert.id}
              title={alert.title}
              description={`Categoria ${alert.category} · Código ${alert.code}`}
              details={`Impacto: ${alert.impact} · Probabilidade: ${alert.probability} · Pilar: ${alert.pillar_code}`}
            >
              <Card
                className={`overflow-hidden border-2 ${config.border} hover:shadow-lg transition-all`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{alert.title}</p>
                        <p className="text-xs text-white/80 mt-0.5">{alert.category}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded shrink-0">
                      {alert.severity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-4">
                  {/* Metric */}
                  <div className={`p-3 rounded-lg ${config.light}`}>
                    <p className="text-xs font-medium text-muted mb-1">Código</p>
                    <p className={`font-semibold ${config.text}`}>{alert.code}</p>
                  </div>

                  {/* Risk */}
                  <div>
                    <p className="text-xs font-medium text-muted mb-1">Descrição</p>
                    <p className="text-sm text-foreground">{alert.description}</p>
                  </div>

                  {/* Required Action */}
                  <div className="p-3 rounded-lg bg-accent/50 border border-border">
                    <p className="text-xs font-medium text-muted mb-1">Mitigação</p>
                    <p className="text-sm text-foreground">{alert.mitigation}</p>
                  </div>

                  {/* Footer Info */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted">Cadência</p>
                      <p className="text-sm font-medium text-foreground">{alert.review_cadence}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Impacto</p>
                      <p className="text-sm font-medium text-foreground">{alert.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Probabilidade</p>
                      <p className="text-sm font-medium text-foreground">{alert.probability}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </InfoTooltip>
          )
        })}
      </div>
    </div>
  )
}
