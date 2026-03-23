import { lazy, Suspense } from 'react'
import { Target, TrendingUp, ClipboardList, Activity, ArrowUp, ArrowDown, Minus } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { formatNumber } from '@/shared/lib/format'
import { useGoals } from '@/features/goals/hooks'
import { useIndicators } from '@/features/indicators/hooks'
import { useActionPlans } from '@/features/action-plans/hooks'
import { useScoreboardContext } from '@/features/scoreboard/hooks'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

const GoalsProgressChart = lazy(() =>
  import('@/shared/components/charts/GoalsProgressChart').then((m) => ({ default: m.GoalsProgressChart }))
)
const IndicatorsTrendChart = lazy(() =>
  import('@/shared/components/charts/IndicatorsTrendChart').then((m) => ({ default: m.IndicatorsTrendChart }))
)
const ActionPlansStatusChart = lazy(() =>
  import('@/shared/components/charts/ActionPlansStatusChart').then((m) => ({ default: m.ActionPlansStatusChart }))
)

function ChartFallback() {
  return <div className="h-[300px] w-full rounded-lg skeleton" />
}

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColors = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-muted',
  }

  const changeIcons = {
    positive: <ArrowUp className="h-3.5 w-3.5" />,
    negative: <ArrowDown className="h-3.5 w-3.5" />,
    neutral: <Minus className="h-3.5 w-3.5" />,
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm mt-2 ${changeColors[changeType]}`}>
                {changeIcons[changeType]}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const {
    data: goals,
    isLoading: goalsLoading,
    error: goalsError,
    refetch: refetchGoals,
  } = useGoals()
  const {
    data: indicators,
    isLoading: indicatorsLoading,
    error: indicatorsError,
    refetch: refetchIndicators,
  } = useIndicators()
  const {
    data: actionPlans,
    isLoading: actionPlansLoading,
    error: actionPlansError,
    refetch: refetchActionPlans,
  } = useActionPlans()
  const {
    data: scoreboard,
    isLoading: scoreboardLoading,
    error: scoreboardError,
    refetch: refetchScoreboard,
  } = useScoreboardContext()

  const isLoading = goalsLoading || indicatorsLoading || actionPlansLoading || scoreboardLoading
  const error = goalsError ?? indicatorsError ?? actionPlansError ?? scoreboardError
  const errorMessage =
    error instanceof Error
      ? error.name === 'AbortError'
        ? 'Tempo limite ao conectar com o servidor. Tente novamente.'
        : error.message
      : 'Não foi possível carregar o dashboard.'
  const handleRetry = () => {
    void refetchGoals()
    void refetchIndicators()
    void refetchActionPlans()
    void refetchScoreboard()
  }

  // Calcular estatísticas reais
  const activeGoals = goals?.filter(g => g.status === 'active').length || 0
  const completedGoals = goals?.filter(g => g.status === 'completed').length || 0
  const avgProgress = goals?.length 
    ? Math.round(goals.reduce((acc, g) => acc + (g.current_value / g.target_value * 100), 0) / goals.length)
    : 0

  const activeActionPlans = actionPlans?.filter(ap => ap.status === 'in_progress').length || 0
  const completedActionPlans = actionPlans?.filter(ap => ap.status === 'completed').length || 0

  const indicatorsWithTrend = indicators?.filter(i => i.trend).length || 0
  const positiveIndicators = indicators?.filter(i => i.trend === 'up').length || 0

  const guardrailsAttention = scoreboard?.guardrails.filter((g) => g.status !== 'OK').length || 0
  const kpisAttention = scoreboard
    ? scoreboard.pillars.flatMap((pillar) => pillar.kpis).filter((kpi) => kpi.status !== 'OK').length
    : 0
  const execucaoPercentual = scoreboard?.monetization.summary.execucaoPercentual ?? 0
  const ativacaoPercentual = scoreboard?.monetization.summary.ativacaoPercentual ?? 0

  const stats = [
    {
      title: 'Metas Ativas',
      value: formatNumber(activeGoals),
      change: completedGoals > 0 ? `${completedGoals} concluídas` : 'Nenhuma concluída',
      changeType: completedGoals > 0 ? 'positive' as const : 'neutral' as const,
      icon: <Target className="h-5 w-5 text-primary-600" />,
    },
    {
      title: 'Progresso Médio',
      value: `${avgProgress}%`,
      change: avgProgress >= 70 ? 'Ótimo desempenho' : avgProgress >= 40 ? 'Bom ritmo' : 'Precisa atenção',
      changeType: avgProgress >= 70 ? 'positive' as const : avgProgress >= 40 ? 'neutral' as const : 'negative' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary-600" />,
    },
    {
      title: 'Planos de Ação',
      value: formatNumber(activeActionPlans),
      change: completedActionPlans > 0 ? `${completedActionPlans} finalizados` : 'Em andamento',
      changeType: completedActionPlans > 0 ? 'positive' as const : 'neutral' as const,
      icon: <ClipboardList className="h-5 w-5 text-primary-600" />,
    },
    {
      title: 'Indicadores',
      value: formatNumber(indicatorsWithTrend),
      change: positiveIndicators > 0 ? `${positiveIndicators} em alta` : 'Estável',
      changeType: positiveIndicators > 0 ? 'positive' as const : 'neutral' as const,
      icon: <Activity className="h-5 w-5 text-primary-600" />,
    },
  ]

  if (isLoading) {
    return <PageLoader text="Carregando dashboard..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar o dashboard"
        message={errorMessage}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted mt-1">
          Visão geral do desempenho e progresso
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {scoreboard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Placar institucional</h2>
              <p className="text-sm text-muted">
                Última atualização: {scoreboard.metadata.lastUpdate}
              </p>
            </div>
            <Link to={ROUTES.STRATEGY_KPIS} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver detalhes →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted">Guardrails em atenção</p>
                <p className="text-3xl font-bold text-foreground mt-2">{formatNumber(guardrailsAttention)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted">KPIs em atenção</p>
                <p className="text-3xl font-bold text-foreground mt-2">{formatNumber(kpisAttention)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted">Execução monetização</p>
                <p className="text-3xl font-bold text-foreground mt-2">{formatNumber(execucaoPercentual, 1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted">Ativação de demanda</p>
                <p className="text-3xl font-bold text-foreground mt-2">{formatNumber(ativacaoPercentual, 1)}%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Metas Recentes</CardTitle>
            <Link to={ROUTES.GOALS} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas →
            </Link>
          </CardHeader>
          <CardContent>
            {goals && goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => {
                  const progress = Math.round((goal.current_value / goal.target_value) * 100)
                  return (
                    <div key={goal.id} className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{goal.title}</h4>
                        <span className="text-sm font-medium text-primary-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-2">
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted">
                <Target className="h-12 w-12 mb-2" />
                <p>Nenhuma meta cadastrada</p>
                <Link to={ROUTES.GOALS} className="text-sm text-primary-600 hover:text-primary-700 mt-2">
                  Criar primeira meta
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Action Plans */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Planos de Ação</CardTitle>
            <Link to={ROUTES.ACTION_PLANS} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {actionPlans && actionPlans.length > 0 ? (
              <div className="space-y-3">
                {actionPlans.slice(0, 4).map((plan) => {
                  const statusColors: Record<string, string> = {
                    draft: 'bg-accent text-muted',
                    planned: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
                    in_progress: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
                    blocked: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
                    completed: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
                    cancelled: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
                  }
                  const statusLabels: Record<string, string> = {
                    draft: 'Rascunho',
                    planned: 'Planejado',
                    in_progress: 'Em Execução',
                    blocked: 'Bloqueado',
                    completed: 'Concluído',
                    cancelled: 'Cancelado',
                  }
                  return (
                    <div key={plan.id} className="flex items-center justify-between p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{plan.title}</h4>
                        <p className="text-xs text-muted mt-1">
                          {plan.due_date ? new Date(plan.due_date).toLocaleDateString('pt-BR') : 'Sem prazo'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[plan.status]}`}>
                        {statusLabels[plan.status]}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted">
                <ClipboardList className="h-12 w-12 mb-2" />
                <p>Nenhum plano cadastrado</p>
                <Link to={ROUTES.ACTION_PLANS} className="text-sm text-primary-600 hover:text-primary-700 mt-2">
                  Criar primeiro plano
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Indicators Overview */}
      {indicators && indicators.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Indicadores em Destaque</CardTitle>
            <Link to={ROUTES.INDICATORS} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {indicators.slice(0, 3).map((indicator) => {
                const trendColors = {
                  up: 'text-success-600 bg-success-50',
                  down: 'text-danger-600 bg-danger-50',
                  stable: 'text-muted bg-accent',
                }
                const trendIcons = {
                  up: <ArrowUp className="h-4 w-4" />,
                  down: <ArrowDown className="h-4 w-4" />,
                  stable: <Minus className="h-4 w-4" />,
                }
                return (
                  <div key={indicator.id} className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                    <p className="text-sm text-muted mb-1">{indicator.name}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {indicator.value} {indicator.unit}
                    </p>
                    {indicator.trend && (
                      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium ${trendColors[indicator.trend]}`}>
                        {trendIcons[indicator.trend]}
                        <span className="capitalize">{indicator.trend === 'up' ? 'Alta' : indicator.trend === 'down' ? 'Baixa' : 'Estável'}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Progresso das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartFallback />}>
              <GoalsProgressChart goals={goals || []} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Status dos Planos de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartFallback />}>
              <ActionPlansStatusChart actionPlans={actionPlans || []} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Indicators Trend Chart */}
      {indicators && indicators.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Tendência dos Indicadores</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartFallback />}>
              <IndicatorsTrendChart indicators={indicators} />
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
