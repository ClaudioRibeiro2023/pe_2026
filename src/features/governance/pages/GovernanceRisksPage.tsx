import { AlertTriangle } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { useGovernanceContext } from '@/features/governance/hooks'

const exposureStyles: Record<string, string> = {
  CRITICO: 'bg-danger-100 text-danger-700',
  ALTO: 'bg-warning-100 text-warning-700',
  MEDIO: 'bg-primary-100 text-primary-700',
  BAIXO: 'bg-success-100 text-success-700',
}

const statusStyles: Record<string, string> = {
  ATIVO: 'bg-danger-100 text-danger-700',
  MITIGADO: 'bg-warning-100 text-warning-700',
  ENCERRADO: 'bg-success-100 text-success-700',
}

export function GovernanceRisksPage() {
  const { data, isLoading, isError, error, refetch } = useGovernanceContext()

  if (isLoading) {
    return <PageLoader text="Carregando riscos..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar riscos"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data || data.risks.length === 0) {
    return (
      <EmptyState
        title="Sem riscos registrados"
        description="Nenhum risco foi encontrado no contexto de governança."
      />
    )
  }

  const risks = data.risks
  const criticalCount = risks.filter((r) => r.exposure === 'CRITICO').length
  const activeCount = risks.filter((r) => r.status === 'ATIVO').length
  const mitigatedCount = risks.filter((r) => r.status === 'MITIGADO').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Governança — Riscos</h1>
        <p className="text-muted mt-2">
          Riscos críticos, gatilhos e planos de mitigação em acompanhamento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Exposição crítica</p>
            <p className="text-2xl font-bold text-foreground mt-2">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Riscos ativos</p>
            <p className="text-2xl font-bold text-foreground mt-2">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Mitigados</p>
            <p className="text-2xl font-bold text-foreground mt-2">{mitigatedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {risks.map((risk) => (
          <Card key={risk.id} className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                  <span className="truncate">{risk.title}</span>
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    exposureStyles[risk.exposure] || 'bg-accent text-muted'
                  }`}
                >
                  {risk.exposure}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted">Categoria</p>
                <p className="text-sm font-medium text-foreground">{risk.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Descrição</p>
                <p className="text-sm text-foreground">{risk.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted">Impacto / Prob.</p>
                  <p className="text-sm font-medium text-foreground">
                    {risk.impact} / {risk.probability}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      statusStyles[risk.status] || 'bg-accent text-muted'
                    }`}
                  >
                    {risk.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted">Gatilhos</p>
                <ul className="mt-1 space-y-1 text-sm text-foreground list-disc pl-5">
                  {risk.triggers.map((trigger) => (
                    <li key={trigger}>{trigger}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted">Mitigação</p>
                <p className="text-sm text-foreground">{risk.mitigation}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Contingência</p>
                <p className="text-sm text-foreground">{risk.contingency}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted">Dono</p>
                  <p className="text-sm font-medium text-foreground">{risk.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Cadência</p>
                  <p className="text-sm font-medium text-foreground">{risk.cadence}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted">KPIs associados</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {risk.kpis.map((kpi) => (
                    <span
                      key={kpi}
                      className="px-2 py-1 text-xs font-medium rounded bg-accent text-muted"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
