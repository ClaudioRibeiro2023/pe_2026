import { ClipboardList } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatDate } from '@/shared/lib/format'
import { useInitiativesContext } from '@/features/initiatives/hooks'

const statusStyles: Record<string, string> = {
  PLANEJADA: 'bg-accent text-muted',
  EM_ANDAMENTO: 'bg-primary-100 text-primary-700',
  BLOQUEADA: 'bg-warning-100 text-warning-700',
  CONCLUIDA: 'bg-success-100 text-success-700',
  CANCELADA: 'bg-danger-100 text-danger-700',
}

const priorityStyles: Record<string, string> = {
  P0: 'bg-danger-100 text-danger-700',
  P1: 'bg-warning-100 text-warning-700',
  P2: 'bg-accent text-muted',
}

export function InitiativesPage() {
  const { data, isLoading, isError, error, refetch } = useInitiativesContext()

  if (isLoading) {
    return <PageLoader text="Carregando carteira de iniciativas..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar carteira"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data || data.initiatives.length === 0) {
    return (
      <EmptyState
        title="Sem iniciativas"
        description="Nenhuma iniciativa foi encontrada na carteira atual."
      />
    )
  }

  const { capacity, initiatives, prioritizationCriteria, evidenceRequirement } = data

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Carteira de Iniciativas</h1>
        <p className="text-muted mt-2">
          Prioridades, capacidade e rastreabilidade das iniciativas estratégicas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Critérios de priorização</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted">
              {prioritizationCriteria.map((criterion) => (
                <li key={criterion.id}>
                  <p className="font-medium text-foreground">{criterion.title}</p>
                  <p className="text-xs text-muted">{criterion.description}</p>
                  <span className="text-xs text-muted">Peso: {criterion.weight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evidência obrigatória</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted">
              {evidenceRequirement.mandatory ? 'Obrigatória para conclusão' : 'Opcional'}
            </p>
            <p className="text-sm text-muted">Artefatos mínimos:</p>
            <ul className="list-disc pl-5 text-sm text-muted space-y-1">
              {evidenceRequirement.requiredArtifacts.map((artifact) => (
                <li key={artifact}>{artifact}</li>
              ))}
            </ul>
            <p className="text-xs text-muted">{evidenceRequirement.validation}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">WIP institucional</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {capacity.inProgressCount} / {capacity.wipInstitutionalLimit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">WIP por área</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {capacity.wipAreaLimit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Iniciativas bloqueadas</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {capacity.blockedCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">P0 em execução</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {capacity.p0Count}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Iniciativas prioritárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Iniciativa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Pilar</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initiatives.map((initiative) => (
                <TableRow key={initiative.id}>
                  <TableCell className="font-medium">{initiative.id}</TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{initiative.title}</p>
                      <p className="text-xs text-muted truncate">
                        {initiative.okr} · {initiative.kr}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{initiative.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        priorityStyles[initiative.priority] || 'bg-accent text-muted'
                      }`}
                    >
                      {initiative.priority}
                    </span>
                  </TableCell>
                  <TableCell>{initiative.pillar}</TableCell>
                  <TableCell>{initiative.owner}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[initiative.status] || 'bg-accent text-muted'
                      }`}
                    >
                      {initiative.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted">
                    {formatDate(initiative.startDate)} → {formatDate(initiative.endDate)}
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
