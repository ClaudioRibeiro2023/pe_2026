import { Target, CheckCircle, AlertTriangle, Users, ArrowRight } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { useOkrsContext } from '@/features/okrs/hooks'

const statusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  EM_ANDAMENTO: { bg: 'bg-primary-100', text: 'text-primary-700', icon: Target },
  ATENCAO: { bg: 'bg-warning-100', text: 'text-warning-700', icon: AlertTriangle },
  CONCLUIDO: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle },
}

const pillarColors: Record<string, { gradient: string; bg: string; border: string }> = {
  P1: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  P2: { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  P3: { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  P4: { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  P5: { gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
}

export function StrategyOkrsPage() {
  const { data, isLoading, isError, error, refetch } = useOkrsContext()

  if (isLoading) {
    return <PageLoader text="Carregando OKRs..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar OKRs"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data || data.corporate.length === 0) {
    return (
      <EmptyState
        title="Sem OKRs"
        description="Nenhum OKR corporativo foi encontrado no contexto atual."
      />
    )
  }

  // Calculate stats
  const totalKrs = data.corporate.reduce((acc, okr) => acc + okr.krs.length, 0)
  const completedKrs = data.corporate.reduce(
    (acc, okr) => acc + okr.krs.filter((kr) => kr.status === 'CONCLUIDO').length,
    0
  )
  const attentionKrs = data.corporate.reduce(
    (acc, okr) => acc + okr.krs.filter((kr) => kr.status === 'ATENCAO').length,
    0
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoTooltip
          title="OKRs Corporativos"
          description="Quantidade de objetivos estratégicos corporativos ativos no ciclo."
          details={`${data.corporate.length} objetivos registrados`}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <Target className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{data.corporate.length}</p>
                  <p className="text-xs text-muted">OKRs Corporativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Key Results"
          description="Total de resultados-chave vinculados aos OKRs corporativos."
          details={`${totalKrs} KRs mapeados`}
        >
          <Card className="bg-gradient-to-br from-accent to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <ArrowRight className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalKrs}</p>
                  <p className="text-xs text-muted">Key Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="KRs Concluídos"
          description="Resultados-chave finalizados dentro do ciclo atual."
          details={`${completedKrs} KRs concluídos`}
        >
          <Card className="bg-gradient-to-br from-success-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success-100">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-700">{completedKrs}</p>
                  <p className="text-xs text-muted">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="KRs em Atenção"
          description="Resultados-chave com status de atenção e necessidade de ajuste."
          details={`${attentionKrs} KRs em atenção`}
        >
          <Card className="bg-gradient-to-br from-warning-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning-100">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-700">{attentionKrs}</p>
                  <p className="text-xs text-muted">Em Atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>
      </div>

      {/* Corporate OKRs */}
      <div className="space-y-6">
        {data.corporate.map((okr) => {
          const colors = pillarColors[okr.pillar] || pillarColors.P1
          const completedCount = okr.krs.filter((kr) => kr.status === 'CONCLUIDO').length
          const progress = okr.krs.length > 0 ? Math.round((completedCount / okr.krs.length) * 100) : 0

          return (
            <Card key={okr.id} className={`overflow-hidden ${colors.border} border-l-4`}>
              {/* OKR Header */}
              <InfoTooltip
                title={okr.objective}
                description={`Pilar ${okr.pillar} · Prioridade ${okr.priority} · Dono ${okr.owner}`}
                details={`Progresso ${progress}% · ${completedCount}/${okr.krs.length} KRs concluídos`}
              >
                <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs font-bold bg-white/20 rounded">
                          {okr.pillar}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-white/20 rounded">
                          {okr.priority}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{okr.objective}</h3>
                      <p className="text-sm text-white/80 mt-1">Dono: {okr.owner}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{progress}%</p>
                      <p className="text-xs text-white/80">{completedCount}/{okr.krs.length} KRs</p>
                    </div>
                  </div>
                </div>
              </InfoTooltip>

              {/* Key Results */}
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {okr.krs.map((kr) => {
                    const status = statusConfig[kr.status] || statusConfig.EM_ANDAMENTO
                    const StatusIcon = status.icon

                    return (
                      <InfoTooltip
                        key={kr.id}
                        title={kr.title}
                        description={`Meta ${kr.target} · Status ${kr.status.replace('_', ' ')}`}
                        details={`KPIs: ${kr.kpis.length} · Iniciativas: ${kr.initiatives.length} · Evidências: ${kr.evidence.length}`}
                      >
                        <div className="p-4 hover:bg-accent/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${status.bg} shrink-0`}>
                              <StatusIcon className={`h-4 w-4 ${status.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{kr.title}</p>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-xs font-mono text-muted bg-accent px-1.5 py-0.5 rounded">
                                      {kr.id}
                                    </span>
                                    <span className="text-xs text-muted">Meta: {kr.target}</span>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${status.bg} ${status.text} shrink-0`}>
                                  {kr.status.replace('_', ' ')}
                                </span>
                              </div>

                              {/* KR Details */}
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* KPIs */}
                                <InfoTooltip
                                  title="KPIs vinculados"
                                  description="Indicadores que comprovam o avanço do KR."
                                  details={kr.kpis.length > 0 ? kr.kpis.join(', ') : 'Sem KPIs vinculados'}
                                >
                                  <div className="p-2 rounded-lg bg-accent/50">
                                    <p className="text-xs font-medium text-muted mb-1">KPIs vinculados</p>
                                    <p className="text-sm text-foreground">
                                      {kr.kpis.length > 0 ? kr.kpis.join(', ') : '—'}
                                    </p>
                                  </div>
                                </InfoTooltip>

                                {/* Initiatives */}
                                <InfoTooltip
                                  title="Iniciativas"
                                  description="Ações planejadas para entregar o KR."
                                  details={kr.initiatives.length > 0 ? kr.initiatives.join(', ') : 'Sem iniciativas definidas'}
                                >
                                  <div className="p-2 rounded-lg bg-accent/50">
                                    <p className="text-xs font-medium text-muted mb-1">Iniciativas</p>
                                    <p className="text-sm text-foreground">
                                      {kr.initiatives.length > 0 ? kr.initiatives.join(', ') : '—'}
                                    </p>
                                  </div>
                                </InfoTooltip>

                                {/* Evidence */}
                                <InfoTooltip
                                  title="Evidências"
                                  description="Evidências que comprovam a conclusão do KR."
                                  details={kr.evidence.length > 0 ? kr.evidence.join(', ') : 'Sem evidências disponíveis'}
                                >
                                  <div className="p-2 rounded-lg bg-accent/50">
                                    <p className="text-xs font-medium text-muted mb-1">Evidências</p>
                                    <p className="text-sm text-foreground">
                                      {kr.evidence.length > 0 ? kr.evidence.join(', ') : 'Sem evidências'}
                                    </p>
                                  </div>
                                </InfoTooltip>
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

      {/* Area OKRs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Desdobramento por Área
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.areas.map((area) => {
              const areaCompletedOkrs = area.okrs.filter((o) => o.status === 'CONCLUIDO').length
              const areaProgress = area.okrs.length > 0 
                ? Math.round((areaCompletedOkrs / area.okrs.length) * 100) 
                : 0

              return (
                <InfoTooltip
                  key={area.area}
                  title={`Área ${area.area}`}
                  description={`Responsável: ${area.owner}. Foco estratégico da área.`}
                  details={area.focus}
                >
                  <div
                    className="p-4 rounded-xl border border-border hover:border-primary-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{area.area}</h4>
                        <p className="text-xs text-muted">{area.owner}</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">{areaProgress}%</span>
                    </div>

                    <p className="text-sm text-muted mb-3 line-clamp-2">{area.focus}</p>

                    <div className="space-y-2">
                      {area.okrs.map((okr) => {
                        const status = statusConfig[okr.status] || statusConfig.EM_ANDAMENTO

                        return (
                          <InfoTooltip
                            key={okr.id}
                            title={okr.objective}
                            description={`Status ${okr.status.replace('_', ' ')} · ${okr.linkedCorporateKrs.length} KRs`}
                            details={`KRs corporativos: ${okr.linkedCorporateKrs.join(', ') || '—'}`}
                          >
                            <div
                              className="flex items-center gap-2 p-2 rounded-lg bg-accent/50"
                            >
                              <span className={`w-2 h-2 rounded-full ${status.bg.replace('100', '500')}`} />
                              <p className="text-sm text-foreground flex-1 truncate">{okr.objective}</p>
                              <span className="text-xs text-muted">{okr.linkedCorporateKrs.length} KRs</span>
                            </div>
                          </InfoTooltip>
                        )
                      })}
                    </div>
                  </div>
                </InfoTooltip>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
