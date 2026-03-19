import { GitBranch } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { useGovernanceContext } from '@/features/governance/hooks'

const statusStyles: Record<string, string> = {
  ATIVO: 'bg-primary-100 text-primary-700',
  EM_ANDAMENTO: 'bg-warning-100 text-warning-700',
  CONCLUIDO: 'bg-success-100 text-success-700',
}

export function GovernanceTraceabilityPage() {
  const { data, isLoading, isError, error, refetch } = useGovernanceContext()

  if (isLoading) {
    return <PageLoader text="Carregando rastreabilidade..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar rastreabilidade"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data || data.traceability.length === 0) {
    return (
      <EmptyState
        title="Sem rastreabilidade registrada"
        description="Nenhuma trilha de rastreabilidade foi encontrada no contexto atual."
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Governança — Rastreabilidade</h1>
        <p className="text-muted mt-2">
          Trilhas que conectam pilares, KRs, iniciativas, evidências e KPIs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Mapa de rastreabilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pilar</TableHead>
                <TableHead>Subpilar</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>KR</TableHead>
                <TableHead>Iniciativa</TableHead>
                <TableHead>Evidências</TableHead>
                <TableHead>KPIs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.traceability.map((trace) => (
                <TableRow key={trace.id}>
                  <TableCell className="font-medium">{trace.id}</TableCell>
                  <TableCell>{trace.pillar}</TableCell>
                  <TableCell>{trace.subpillar}</TableCell>
                  <TableCell>{trace.objective}</TableCell>
                  <TableCell>{trace.kr}</TableCell>
                  <TableCell>{trace.initiative}</TableCell>
                  <TableCell className="text-xs text-muted">
                    {trace.evidences.join(', ')}
                  </TableCell>
                  <TableCell className="text-xs text-muted">{trace.kpis.join(', ')}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[trace.status] || 'bg-accent text-muted'
                      }`}
                    >
                      {trace.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
