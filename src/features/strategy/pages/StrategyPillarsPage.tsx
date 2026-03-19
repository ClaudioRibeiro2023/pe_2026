import { Layers, Target, CheckCircle, AlertTriangle } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { useStrategicContext } from '@/features/strategy/hooks'
import { useOkrsContext } from '@/features/okrs/hooks'

const pillarColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  P1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
  P2: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
  P3: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
  P4: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', icon: 'text-violet-600' },
  P5: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-600' },
}

const statusStyles: Record<string, string> = {
  EM_ANDAMENTO: 'bg-primary-100 text-primary-700',
  ATENCAO: 'bg-warning-100 text-warning-700',
  CONCLUIDO: 'bg-success-100 text-success-700',
}

export function StrategyPillarsPage() {
  const { data: strategicData, isLoading: strategicLoading, isError: strategicError, error: stratError, refetch: refetchStrategic } = useStrategicContext()
  const { data: okrsData, isLoading: okrsLoading, isError: okrsError, error: okrError, refetch: refetchOkrs } = useOkrsContext()

  const isLoading = strategicLoading || okrsLoading
  const isError = strategicError || okrsError
  const error = stratError ?? okrError

  if (isLoading) {
    return <PageLoader text="Carregando pilares..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar Pilares"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetchStrategic()
          void refetchOkrs()
        }}
      />
    )
  }

  if (!strategicData) {
    return (
      <EmptyState
        title="Sem dados de pilares"
        description="Não foi possível encontrar o contexto estratégico."
      />
    )
  }

  const pillars = strategicData.pillars ?? []
  const objectives = strategicData.objectives ?? []
  const corporateOkrs = okrsData?.corporate ?? []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pillars.map((pillar) => {
          const colors = pillarColors[pillar.id] || pillarColors.P1
          const pillarOkr = corporateOkrs.find((o) => o.pillar === pillar.id)
          const krsCount = pillarOkr?.krs.length ?? 0
          const completedKrs = pillarOkr?.krs.filter((kr) => kr.status === 'CONCLUIDO').length ?? 0

          return (
            <InfoTooltip
              key={pillar.id}
              title={`Pilar ${pillar.id}`}
              description={pillar.title}
              details={`${krsCount} KRs · ${completedKrs} concluídos · Fronteira ${pillar.frontier}`}
            >
              <Card className={`${colors.border} border-2 hover:shadow-lg transition-all`}>
                <CardContent className="p-4">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} mb-3`}>
                    <Layers className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>{pillar.id}</p>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{pillar.title}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted">
                    <span>{krsCount} KRs</span>
                    <span>·</span>
                    <span>{completedKrs} concluídos</span>
                  </div>
                </CardContent>
              </Card>
            </InfoTooltip>
          )
        })}
      </div>

      {/* Detailed Pillar Cards */}
      <div className="space-y-6">
        {pillars.map((pillar) => {
          const colors = pillarColors[pillar.id] || pillarColors.P1
          const pillarOkr = corporateOkrs.find((o) => o.pillar === pillar.id)
          const pillarObjectives = objectives.filter((obj) => obj.pillar === pillar.id)

          return (
            <Card key={pillar.id} className={`${colors.border} border-l-4 overflow-hidden`}>
              <CardHeader className={`${colors.bg}`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${colors.text}`}>{pillar.id}</span>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{pillar.title}</p>
                      <p className="text-sm text-muted font-normal">{pillar.frontier}</p>
                    </div>
                  </div>
                  {pillarOkr && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/80 text-foreground">
                      {pillarOkr.priority}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Subpilares */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                      Subpilares
                    </h4>
                    <div className="space-y-2">
                      {pillar.subpillars.map((sub) => (
                        <InfoTooltip
                          key={sub.id}
                          title={`Subpilar ${sub.id}`}
                          description={sub.title}
                          details={`Pilar ${pillar.id} · ${pillar.title}`}
                        >
                          <div
                            className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                          >
                            <span className={`text-xs font-mono ${colors.text} bg-white px-2 py-0.5 rounded`}>
                              {sub.id}
                            </span>
                            <span className="text-sm text-foreground">{sub.title}</span>
                          </div>
                        </InfoTooltip>
                      ))}
                    </div>
                  </div>

                  {/* Key Results */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                      Key Results
                    </h4>
                    {pillarOkr ? (
                      <div className="space-y-2">
                        {pillarOkr.krs.map((kr) => (
                          <InfoTooltip
                            key={kr.id}
                            title={`KR ${kr.id}`}
                            description={kr.title}
                            details={`${kr.target} · Status ${kr.status.replace('_', ' ')}`}
                          >
                            <div
                              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary-200 transition-colors"
                            >
                              <div className="mt-0.5">
                                {kr.status === 'CONCLUIDO' ? (
                                  <CheckCircle className="h-4 w-4 text-success-600" />
                                ) : kr.status === 'ATENCAO' ? (
                                  <AlertTriangle className="h-4 w-4 text-warning-600" />
                                ) : (
                                  <Target className="h-4 w-4 text-primary-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground line-clamp-2">
                                  {kr.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted">{kr.id}</span>
                                  <span className="text-xs text-muted">·</span>
                                  <span className="text-xs text-muted">{kr.target}</span>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded ${
                                  statusStyles[kr.status] || 'bg-accent text-muted'
                                }`}
                              >
                                {kr.status.replace('_', ' ')}
                              </span>
                            </div>
                          </InfoTooltip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted">Nenhum KR vinculado.</p>
                    )}
                  </div>
                </div>

                {/* Objectives */}
                {pillarObjectives.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                      Objetivos Estratégicos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pillarObjectives.map((obj) => (
                        <InfoTooltip
                          key={obj.id}
                          title={`Objetivo ${obj.id}`}
                          description={obj.title}
                          details={`Owner ${obj.owner} · OKRs: ${obj.linkedOkrs.join(', ') || '—'}`}
                        >
                          <div
                            className="p-3 rounded-lg bg-accent/30 border border-border"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted">{obj.id}</span>
                              <span className="text-xs text-muted">·</span>
                              <span className="text-xs text-primary-600">{obj.owner}</span>
                            </div>
                            <p className="text-sm text-foreground">{obj.title}</p>
                            {obj.linkedOkrs.length > 0 && (
                              <p className="text-xs text-muted mt-2">
                                OKRs: {obj.linkedOkrs.join(', ')}
                              </p>
                            )}
                          </div>
                        </InfoTooltip>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
