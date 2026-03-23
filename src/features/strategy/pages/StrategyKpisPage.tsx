import { Gauge, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Wallet } from '@/shared/ui/icons'
import { PILLAR_COLORS } from '@/shared/config/pillarColors'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { formatCurrency, formatNumber } from '@/shared/lib/format'
import { useScoreboardContext } from '@/features/scoreboard/hooks'

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: typeof CheckCircle }> = {
  OK: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200', icon: CheckCircle },
  ATENCAO: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200', icon: AlertTriangle },
  CRITICO: { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', icon: ShieldAlert },
}

const pillarColors = PILLAR_COLORS

export function StrategyKpisPage() {
  const { data, isLoading, isError, error, refetch } = useScoreboardContext()

  if (isLoading) {
    return <PageLoader text="Carregando KPIs..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar KPIs"
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
        title="Sem dados de KPIs"
        description="Não foi possível encontrar o contexto estratégico."
      />
    )
  }

  const formatKpiValue = (value: number, unit: string) => {
    if (unit === 'R$') return formatCurrency(value)
    if (unit === '%') return `${formatNumber(value)}%`
    if (unit.includes('ha')) return `${formatNumber(value)} ${unit}`
    return `${formatNumber(value)} ${unit}`
  }

  const summary = data.monetization.summary

  // Calculate stats
  const guardrailsOk = data.guardrails.filter((g) => g.status === 'OK').length
  const guardrailsAttention = data.guardrails.filter((g) => g.status === 'ATENCAO').length
  const guardrailsCritical = data.guardrails.filter((g) => g.status === 'CRITICO').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoTooltip
          title="Guardrails OK"
          description="Indicadores dentro dos limites de segurança definidos."
          details={`${guardrailsOk} guardrails em status OK`}
        >
          <Card className="bg-gradient-to-br from-success-50 to-white border-success-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success-100">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-700">{guardrailsOk}</p>
                  <p className="text-xs text-muted">Guardrails OK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Guardrails em Atenção"
          description="Indicadores próximos do limite de segurança que exigem acompanhamento."
          details={`${guardrailsAttention} guardrails em atenção`}
        >
          <Card className="bg-gradient-to-br from-warning-50 to-white border-warning-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning-100">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-700">{guardrailsAttention}</p>
                  <p className="text-xs text-muted">Em Atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Guardrails Críticos"
          description="Indicadores que ultrapassaram o limite de segurança."
          details={`${guardrailsCritical} guardrails críticos`}
        >
          <Card className="bg-gradient-to-br from-danger-50 to-white border-danger-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-danger-100">
                  <ShieldAlert className="h-5 w-5 text-danger-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-danger-700">{guardrailsCritical}</p>
                  <p className="text-xs text-muted">Críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Pilares com KPIs"
          description="Quantidade de pilares estratégicos com indicadores monitorados."
          details={`${data.pillars.length} pilares ativos`}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <Gauge className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{data.pillars.length}</p>
                  <p className="text-xs text-muted">Pilares com KPIs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>
      </div>

      {/* Guardrails Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary-600" />
            Guardrails (Limites de Segurança)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.guardrails.map((guardrail) => {
              const status = statusConfig[guardrail.status] || statusConfig.OK
              const StatusIcon = status.icon

              return (
                <InfoTooltip
                  key={guardrail.id}
                  title={guardrail.indicador}
                  description={guardrail.definicao}
                  details={`Status ${guardrail.status} · ${formatKpiValue(guardrail.valor, guardrail.unidade)} · ${guardrail.cadencia}`}
                >
                  <div
                    className={`p-4 rounded-xl border-2 ${status.border} ${status.bg} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{guardrail.indicador}</p>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{guardrail.definicao}</p>
                      </div>
                      <div className={`p-1.5 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${status.text}`} />
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatKpiValue(guardrail.valor, guardrail.unidade)}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {guardrail.cadencia} · {guardrail.owner}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${status.bg} ${status.text}`}>
                        {guardrail.status}
                      </span>
                    </div>

                    {guardrail.gatilho && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted">
                          <span className="font-medium">Gatilho:</span> {guardrail.gatilho}
                        </p>
                      </div>
                    )}
                  </div>
                </InfoTooltip>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pillar KPIs */}
      <div className="space-y-6">
        {data.pillars.map((pillar) => {
          const colors = pillarColors[pillar.pillar] || pillarColors.P1
          const okCount = pillar.kpis.filter((k) => k.status === 'OK').length
          const totalCount = pillar.kpis.length

          return (
            <Card key={pillar.pillar} className="overflow-hidden">
              <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-bold bg-white/20 rounded">
                        {pillar.pillar}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{pillar.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{okCount}/{totalCount}</p>
                    <p className="text-xs text-white/80">KPIs OK</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {pillar.kpis.map((kpi) => {
                    const status = statusConfig[kpi.status ?? 'OK'] || statusConfig.OK
                    const StatusIcon = status.icon

                    return (
                      <InfoTooltip
                        key={kpi.id}
                        title={kpi.indicador}
                        description={kpi.definicao}
                        details={`Status ${kpi.status ?? 'N/A'} · ${formatKpiValue(kpi.valor, kpi.unidade)} · ${kpi.cadencia}`}
                      >
                        <div className="p-4 hover:bg-accent/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${status.bg} shrink-0`}>
                              <StatusIcon className={`h-4 w-4 ${status.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{kpi.indicador}</p>
                                  <p className="text-xs text-muted mt-1">{kpi.definicao}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-lg font-bold text-foreground">
                                    {formatKpiValue(kpi.valor, kpi.unidade)}
                                  </p>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${status.bg} ${status.text}`}>
                                    {kpi.status ?? 'N/A'}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-2 rounded-lg bg-accent/50">
                                  <p className="text-xs font-medium text-muted">Cadência</p>
                                  <p className="text-sm text-foreground">{kpi.cadencia}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-accent/50">
                                  <p className="text-xs font-medium text-muted">Fonte</p>
                                  <p className="text-sm text-foreground">{kpi.source}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-accent/50">
                                  <p className="text-xs font-medium text-muted">Dono</p>
                                  <p className="text-sm text-foreground">{kpi.owner}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-accent/50">
                                  <p className="text-xs font-medium text-muted">Gatilho</p>
                                  <p className="text-sm text-foreground truncate">{kpi.gatilho || '—'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </InfoTooltip>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Monetization Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Monetização — Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <InfoTooltip
              title="Saldo (ha)"
              description="Saldo contratual total em hectares para monetização."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(summary.saldoTotal / 1000, 1)}k
                </p>
                <p className="text-xs text-muted mt-1">Saldo (ha)</p>
              </div>
            </InfoTooltip>
            <InfoTooltip
              title="Execução"
              description="Percentual executado em relação ao saldo monetizável planejado."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(summary.execucaoPercentual, 1)}%
                </p>
                <p className="text-xs text-muted mt-1">Execução</p>
              </div>
            </InfoTooltip>
            <InfoTooltip
              title="Run-rate semanal"
              description="Velocidade semanal de execução em hectares."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(summary.runRateSemanal)}
                </p>
                <p className="text-xs text-muted mt-1">ha/semana</p>
              </div>
            </InfoTooltip>
            <InfoTooltip
              title="Ativação"
              description="Percentual do saldo ativado para execução."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-100">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(summary.ativacaoPercentual, 0)}%
                </p>
                <p className="text-xs text-muted mt-1">Ativação</p>
              </div>
            </InfoTooltip>
            <InfoTooltip
              title="Pareto Top-14"
              description="Concentração do saldo nos 14 maiores clientes."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-white border border-rose-100">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(summary.paretoTop14Percent, 0)}%
                </p>
                <p className="text-xs text-muted mt-1">Pareto Top-14</p>
              </div>
            </InfoTooltip>
            <InfoTooltip
              title="Idade média"
              description="Tempo médio em dias do saldo aberto."
            >
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100">
                <p className="text-2xl font-bold text-foreground">
                  {summary.idadeSaldoMedia}
                </p>
                <p className="text-xs text-muted mt-1">Idade média (dias)</p>
              </div>
            </InfoTooltip>
          </div>

          {/* War Room Status */}
          <InfoTooltip
            title="War Room Q1"
            description={data.monetization.warRoom.focus}
            details={`${data.monetization.warRoom.status} · ${data.monetization.warRoom.cadence} · ${data.monetization.warRoom.owner}`}
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">War Room Q1</p>
                  <p className="text-lg font-semibold">{data.monetization.warRoom.focus}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    data.monetization.warRoom.status === 'Ativo'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {data.monetization.warRoom.status}
                  </span>
                  <p className="text-xs text-white/70 mt-1">
                    {data.monetization.warRoom.cadence} · {data.monetization.warRoom.owner}
                  </p>
                </div>
              </div>
            </div>
          </InfoTooltip>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.monetization.metrics.map((metric) => (
              <InfoTooltip
                key={metric.id}
                title={metric.indicador}
                description={metric.nota}
                details={`${formatKpiValue(metric.valor, metric.unidade)} · ${metric.cadencia} · ${metric.owner}`}
              >
                <div
                  className="p-4 rounded-xl border border-border hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{metric.indicador}</p>
                      <p className="text-xs text-muted mt-1">{metric.nota}</p>
                    </div>
                    <p className="text-xl font-bold text-foreground shrink-0">
                      {formatKpiValue(metric.valor, metric.unidade)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-accent/50">
                      <p className="text-xs text-muted">Cadência</p>
                      <p className="text-sm font-medium text-foreground">{metric.cadencia}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/50">
                      <p className="text-xs text-muted">Fonte</p>
                      <p className="text-sm font-medium text-foreground">{metric.source}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/50">
                      <p className="text-xs text-muted">Dono</p>
                      <p className="text-sm font-medium text-foreground">{metric.owner}</p>
                    </div>
                  </div>

                  {metric.gatilho && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted">
                        <span className="font-medium">Gatilho:</span> {metric.gatilho}
                      </p>
                    </div>
                  )}
                </div>
              </InfoTooltip>
            ))}
          </div>

          {/* Forecast */}
          <div className="mt-6 p-4 rounded-xl bg-accent/30 border border-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              Previsão 30/60/90
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <InfoTooltip
                title="Previsão 30 dias"
                description="Estimativa de execução nos próximos 30 dias."
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{formatNumber(summary.previsao30)}</p>
                  <p className="text-xs text-muted">30 dias (ha)</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Previsão 60 dias"
                description="Estimativa de execução nos próximos 60 dias."
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{formatNumber(summary.previsao60)}</p>
                  <p className="text-xs text-muted">60 dias (ha)</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Previsão 90 dias"
                description="Estimativa de execução nos próximos 90 dias."
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{formatNumber(summary.previsao90)}</p>
                  <p className="text-xs text-muted">90 dias (ha)</p>
                </div>
              </InfoTooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
