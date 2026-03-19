import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ShieldAlert,
  Wallet,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Layers,
  Gauge,
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { formatCurrency, formatNumber } from '@/shared/lib/format'
import { useStrategicContext } from '@/features/strategy/hooks'
import { useOkrsContext } from '@/features/okrs/hooks'
import { useScoreboardContext } from '@/features/scoreboard/hooks'
import { ROUTES } from '@/shared/config/routes'

const pillarColors: Record<string, { bg: string; text: string; light: string }> = {
  P1: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
  P2: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' },
  P3: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' },
  P4: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
  P5: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' },
}

export function StrategyOverviewPage() {
  const { data, isLoading: stratLoading, isError: stratError, error: sError, refetch: refetchStrat } = useStrategicContext()
  const { data: okrsData, isLoading: okrsLoading } = useOkrsContext()
  const { data: scoreboardData, isLoading: scoreLoading } = useScoreboardContext()

  const isLoading = stratLoading || okrsLoading || scoreLoading

  if (isLoading) {
    return <PageLoader text="Carregando dashboard executivo..." />
  }

  if (stratError) {
    return (
      <ErrorState
        title="Erro ao carregar Estratégia"
        message={sError instanceof Error ? sError.message : undefined}
        onRetry={() => {
          void refetchStrat()
        }}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title="Sem dados estratégicos"
        description="Não foi possível encontrar o arquivo de contexto estratégico."
      />
    )
  }

  const perf = data.performance2025
  const alerts = data.alertasCriticos
  const pillars = data.pillars ?? []
  const corporateOkrs = okrsData?.corporate ?? []
  const guardrails = scoreboardData?.guardrails ?? []
  const monetization = scoreboardData?.monetization

  // Calculate KR stats
  const totalKrs = corporateOkrs.reduce((acc, okr) => acc + okr.krs.length, 0)
  const completedKrs = corporateOkrs.reduce(
    (acc, okr) => acc + okr.krs.filter((kr) => kr.status === 'CONCLUIDO').length,
    0
  )
  const attentionKrs = corporateOkrs.reduce(
    (acc, okr) => acc + okr.krs.filter((kr) => kr.status === 'ATENCAO').length,
    0
  )
  const inProgressKrs = totalKrs - completedKrs - attentionKrs

  // Calculate guardrail stats
  const guardrailsOk = guardrails.filter((g) => g.status === 'OK').length
  const guardrailsAttention = guardrails.filter((g) => g.status === 'ATENCAO').length
  const guardrailsCritical = guardrails.filter((g) => g.status === 'CRITICO').length

  // Critical alerts
  const criticalAlerts = alerts.filter((a) => a.nivel === 'CRITICO')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoTooltip
          title="Receita 2025"
          description="Receita consolidada do período, refletindo execução contratual e expansão comercial."
          details={`Crescimento YoY: ${formatNumber(perf.receita.crescimentoYoY, 1)}%`}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="h-5 w-5 text-primary-600" />
                <span className="text-xs text-success-600 font-medium">
                  +{formatNumber(perf.receita.crescimentoYoY, 1)}% YoY
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(perf.receita.consolidado)}
              </p>
              <p className="text-xs text-muted mt-1">Receita 2025</p>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Margem Operacional"
          description="Margem operacional atual comparada ao alvo do ciclo estratégico."
          details={`Meta: ${formatNumber(perf.operacional.margemMeta, 0)}%`}
        >
          <Card className="bg-gradient-to-br from-success-50 to-white border-success-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-success-600" />
                <span className="text-xs text-muted">Meta: {formatNumber(perf.operacional.margemMeta, 0)}%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(perf.operacional.margemOperacional, 1)}%
              </p>
              <p className="text-xs text-muted mt-1">Margem Operacional</p>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="KRs em andamento"
          description="Key Results corporativos em execução no ciclo atual."
          details={`Concluídos: ${completedKrs} · Atenção: ${attentionKrs}`}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-amber-600" />
                <span className="text-xs text-muted">{totalKrs} total</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{inProgressKrs}</p>
                <p className="text-sm text-success-600">+{completedKrs}</p>
                {attentionKrs > 0 && <p className="text-sm text-warning-600">⚠ {attentionKrs}</p>}
              </div>
              <p className="text-xs text-muted mt-1">KRs em andamento</p>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Guardrails"
          description="Indicadores de segurança para manter a estratégia dentro de limites aceitáveis."
          details={`OK: ${guardrailsOk} · Atenção: ${guardrailsAttention} · Crítico: ${guardrailsCritical}`}
        >
          <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="h-5 w-5 text-violet-600" />
                <span className="text-xs text-muted">{guardrails.length} indicadores</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-success-600" />
                  <span className="text-lg font-bold text-success-600">{guardrailsOk}</span>
                </div>
                {guardrailsAttention > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning-600" />
                    <span className="text-lg font-bold text-warning-600">{guardrailsAttention}</span>
                  </div>
                )}
                {guardrailsCritical > 0 && (
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4 text-danger-600" />
                    <span className="text-lg font-bold text-danger-600">{guardrailsCritical}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted mt-1">Guardrails</p>
            </CardContent>
          </Card>
        </InfoTooltip>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillars Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary-600" />
                Pilares Estratégicos
              </CardTitle>
              <Link
                to={ROUTES.STRATEGY_PILLARS}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Ver detalhes <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pillars.map((pillar) => {
                  const colors = pillarColors[pillar.id] || pillarColors.P1
                  const pillarOkr = corporateOkrs.find((o) => o.pillar === pillar.id)
                  const krsCount = pillarOkr?.krs.length ?? 0
                  const completedCount = pillarOkr?.krs.filter((kr) => kr.status === 'CONCLUIDO').length ?? 0
                  const progress = krsCount > 0 ? Math.round((completedCount / krsCount) * 100) : 0

                  return (
                    <InfoTooltip
                      key={pillar.id}
                      title={`${pillar.id} — ${pillar.title}`}
                      description={pillar.frontier ? `Fronteira estratégica: ${pillar.frontier}` : 'Pilar estratégico do PE2026.'}
                      details={`${krsCount} KRs · Progresso ${progress}%`}
                    >
                      <div
                        className={`p-4 rounded-xl ${colors.light} border border-transparent hover:border-primary-200 transition-all cursor-pointer`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{pillar.id}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{pillar.title}</p>
                            <p className="text-xs text-muted">{krsCount} KRs</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted">Progresso</span>
                            <span className={colors.text}>{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bg} rounded-full transition-all`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </InfoTooltip>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-danger-600" />
                Alertas Críticos
              </CardTitle>
              <span className="text-xs text-danger-600 font-medium bg-danger-50 px-2 py-1 rounded-full">
                {criticalAlerts.length} ativos
              </span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.slice(0, 4).map((alert) => (
                  <InfoTooltip
                    key={alert.id}
                    title={alert.titulo}
                    description={`Métrica crítica: ${alert.metrica}`}
                    details={`Categoria: ${alert.categoria} · Prazo: ${alert.prazo}`}
                  >
                    <div className="p-3 rounded-lg bg-danger-50 border border-danger-100">
                      <p className="text-sm font-medium text-danger-800 line-clamp-1">{alert.titulo}</p>
                      <p className="text-xs text-danger-600 mt-1">{alert.metrica}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-danger-500">{alert.prazo}</span>
                        <span className="text-xs text-danger-700 font-medium">{alert.categoria}</span>
                      </div>
                    </div>
                  </InfoTooltip>
                ))}
                {criticalAlerts.length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                    <p className="text-sm text-muted">Nenhum alerta crítico</p>
                  </div>
                )}
              </div>
              {criticalAlerts.length > 4 && (
                <Link
                  to={ROUTES.STRATEGY_RISKS}
                  className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700"
                >
                  Ver todos os {criticalAlerts.length} alertas
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monetization Quick View */}
      {monetization && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              Monetização Q1
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                monetization.warRoom.status === 'Ativo' 
                  ? 'bg-success-100 text-success-700' 
                  : 'bg-accent text-muted'
              }`}>
                War Room {monetization.warRoom.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <InfoTooltip
                title="Saldo (ha)"
                description="Saldo contratual total em hectares para monetização no trimestre."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(monetization.summary.saldoTotal / 1000, 1)}k
                  </p>
                  <p className="text-xs text-muted mt-1">Saldo (ha)</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Execução"
                description="Percentual executado em relação ao saldo monetizável planejado."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(monetization.summary.execucaoPercentual, 1)}%
                  </p>
                  <p className="text-xs text-muted mt-1">Execução</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Run-rate semanal"
                description="Velocidade semanal de execução em hectares."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(monetization.summary.runRateSemanal)}
                  </p>
                  <p className="text-xs text-muted mt-1">ha/semana</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Ativação"
                description="Percentual do saldo ativado para execução."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(monetization.summary.ativacaoPercentual, 0)}%
                  </p>
                  <p className="text-xs text-muted mt-1">Ativação</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Pareto Top-14"
                description="Concentração do saldo nos 14 maiores clientes."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(monetization.summary.paretoTop14Percent, 0)}%
                  </p>
                  <p className="text-xs text-muted mt-1">Pareto Top-14</p>
                </div>
              </InfoTooltip>
              <InfoTooltip
                title="Idade média"
                description="Tempo médio em dias do saldo aberto."
              >
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold text-foreground">
                    {monetization.summary.idadeSaldoMedia}
                  </p>
                  <p className="text-xs text-muted mt-1">Idade média (dias)</p>
                </div>
              </InfoTooltip>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores Saudáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.indicadoresSaudaveis.map((it) => (
                <InfoTooltip
                  key={it.indicador}
                  title={it.indicador}
                  description={`Status: ${it.status}. Indicador saudável da operação.`}
                  details={typeof it.meta === 'number' ? `Meta: ${formatNumber(it.meta, 1)}%` : undefined}
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success-50/50 border border-success-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-success-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{it.indicador}</p>
                        <p className="text-xs text-muted">{it.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success-700">
                        {formatNumber(it.valor, 1)}
                        {typeof it.valor === 'number' && !it.indicador.includes('HHI') && '%'}
                      </p>
                      {typeof it.meta === 'number' && (
                        <p className="text-xs text-muted">Meta: {formatNumber(it.meta, 1)}%</p>
                      )}
                    </div>
                  </div>
                </InfoTooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights Estratégicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
                  Estratégicos
                </p>
                <ul className="space-y-1">
                  {data.insights.estrategicos.slice(0, 2).map((t) => (
                    <li key={t} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                  Operacionais
                </p>
                <ul className="space-y-1">
                  {data.insights.operacionais.slice(0, 2).map((t) => (
                    <li key={t} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  Financeiros
                </p>
                <ul className="space-y-1">
                  {data.insights.financeiros.slice(0, 2).map((t) => (
                    <li key={t} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
