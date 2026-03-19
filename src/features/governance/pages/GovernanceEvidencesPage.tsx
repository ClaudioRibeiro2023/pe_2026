import { CheckCircle } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatDate } from '@/shared/lib/format'
import { useGovernanceContext } from '@/features/governance/hooks'

const typeStyles: Record<string, string> = {
  Ata: 'bg-primary-100 text-primary-700',
  Mapa: 'bg-warning-100 text-warning-700',
  Relatorio: 'bg-success-100 text-success-700',
}

const validationStyles: Record<string, string> = {
  Validada: 'bg-success-100 text-success-700',
  Pendente: 'bg-warning-100 text-warning-700',
}

export function GovernanceEvidencesPage() {
  const { data, isLoading, isError, error, refetch } = useGovernanceContext()

  if (isLoading) {
    return <PageLoader text="Carregando evidências..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar evidências"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data || data.evidences.length === 0) {
    return (
      <EmptyState
        title="Sem evidências registradas"
        description="Nenhuma evidência foi encontrada no contexto de governança."
      />
    )
  }

  const evidences = data.evidences
  const validatedCount = evidences.filter((evidence) => evidence.validated).length
  const pendingCount = evidences.length - validatedCount
  const { evidenceValidation, versionLogs } = data

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Governança — Evidências</h1>
        <p className="text-muted mt-2">
          Evidências registradas para comprovar execução e fechamento de decisões/OKRs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Evidências validadas</p>
            <p className="text-2xl font-bold text-foreground mt-2">{validatedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Pendentes</p>
            <p className="text-2xl font-bold text-foreground mt-2">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Última auditoria</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatDate(evidenceValidation.lastAudit)}
            </p>
            <p className="text-xs text-muted">Validador: {evidenceValidation.validator}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Política de validação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted">{evidenceValidation.policy}</p>
            <p className="text-xs text-muted">Pendentes: {evidenceValidation.pending.join(', ') || 'Nenhum'}</p>
            <p className="text-xs text-muted">Validadas: {evidenceValidation.validated.join(', ')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Logs de versão (LOG-REV)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Dono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versionLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.entityType}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell>{log.version}</TableCell>
                    <TableCell>{formatDate(log.date)}</TableCell>
                    <TableCell>{log.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Evidências registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Validação</TableHead>
                <TableHead>Relacionamentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidences.map((evidence) => {
                const validationLabel = evidence.validated ? 'Validada' : 'Pendente'

                return (
                  <TableRow key={evidence.id}>
                    <TableCell className="font-medium">{evidence.id}</TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{evidence.title}</p>
                        <p className="text-xs text-muted truncate">{evidence.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          typeStyles[evidence.type] || 'bg-accent text-muted'
                        }`}
                      >
                        {evidence.type}
                      </span>
                    </TableCell>
                    <TableCell>{evidence.owner}</TableCell>
                    <TableCell>{formatDate(evidence.date)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          validationStyles[validationLabel] || 'bg-accent text-muted'
                        }`}
                      >
                        {validationLabel}
                      </span>
                      {evidence.validatedBy && (
                        <p className="text-xs text-muted mt-1">{evidence.validatedBy}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted">
                      {evidence.related.join(', ')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
