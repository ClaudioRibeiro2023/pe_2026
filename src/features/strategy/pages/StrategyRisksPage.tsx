import { AlertTriangle, ShieldAlert, Target, TrendingUp } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { useStrategicContext } from '@/features/strategy/hooks'

const levelConfig = {
  CRITICO: {
    gradient: 'from-danger-500 to-danger-600',
    light: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-700',
    icon: ShieldAlert,
  },
  ATENCAO: {
    gradient: 'from-warning-500 to-warning-600',
    light: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-700',
    icon: AlertTriangle,
  },
}

export function StrategyRisksPage() {
  const { data, isLoading, isError, error, refetch } = useStrategicContext()

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

  if (!data) {
    return (
      <EmptyState
        title="Sem dados de riscos"
        description="Não foi possível encontrar o contexto estratégico."
      />
    )
  }

  const alerts = data.alertasCriticos

  const sortedAlerts = [...alerts].sort((a, b) => {
    const aCritical = a.nivel === 'CRITICO'
    const bCritical = b.nivel === 'CRITICO'
    if (aCritical === bCritical) return 0
    return aCritical ? -1 : 1
  })

  const criticalCount = alerts.filter((a) => a.nivel === 'CRITICO').length
  const attentionCount = alerts.filter((a) => a.nivel !== 'CRITICO').length

  if (!alerts || alerts.length === 0) {
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
          details={`${alerts.length} alertas catalogados`}
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
          details={`${new Set(alerts.map((a) => a.categoria)).size} categorias distintas`}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(alerts.map((a) => a.categoria)).size}
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
          const config = levelConfig[alert.nivel as keyof typeof levelConfig] || levelConfig.ATENCAO
          const Icon = config.icon

          return (
            <InfoTooltip
              key={alert.id}
              title={alert.titulo}
              description={`Categoria ${alert.categoria} · Métrica ${alert.metrica}`}
              details={`Risco: ${alert.risco} · Ação: ${alert.acaoRequerida} · Prazo: ${alert.prazo}`}
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
                        <p className="font-semibold line-clamp-1">{alert.titulo}</p>
                        <p className="text-xs text-white/80 mt-0.5">{alert.categoria}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded shrink-0">
                      {alert.nivel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-4">
                  {/* Metric */}
                  <div className={`p-3 rounded-lg ${config.light}`}>
                    <p className="text-xs font-medium text-muted mb-1">Métrica</p>
                    <p className={`font-semibold ${config.text}`}>{alert.metrica}</p>
                  </div>

                  {/* Risk */}
                  <div>
                    <p className="text-xs font-medium text-muted mb-1">Risco</p>
                    <p className="text-sm text-foreground">{alert.risco}</p>
                  </div>

                  {/* Required Action */}
                  <div className="p-3 rounded-lg bg-accent/50 border border-border">
                    <p className="text-xs font-medium text-muted mb-1">Ação Requerida</p>
                    <p className="text-sm text-foreground">{alert.acaoRequerida}</p>
                  </div>

                  {/* Footer Info */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted">Prazo</p>
                      <p className="text-sm font-medium text-foreground">{alert.prazo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Impacto</p>
                      <p className="text-sm font-medium text-foreground">{alert.impacto}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Probabilidade</p>
                      <p className="text-sm font-medium text-foreground">{alert.probabilidade}</p>
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
