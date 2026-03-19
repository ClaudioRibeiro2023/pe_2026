import { FileText, Users } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatDate } from '@/shared/lib/format'
import { useGovernanceContext } from '@/features/governance/hooks'

const statusStyles: Record<string, string> = {
  ATIVA: 'bg-primary-100 text-primary-700',
  EM_REVISAO: 'bg-warning-100 text-warning-700',
  CONCLUIDA: 'bg-success-100 text-success-700',
}

const impactStyles: Record<string, string> = {
  ALTO: 'bg-danger-100 text-danger-700',
  MEDIO: 'bg-warning-100 text-warning-700',
  BAIXO: 'bg-success-100 text-success-700',
}

const auditStatusStyles: Record<string, string> = {
  OK: 'bg-success-100 text-success-700',
  ATENCAO: 'bg-warning-100 text-warning-700',
  CRITICO: 'bg-danger-100 text-danger-700',
}

const artifactStatusStyles: Record<string, string> = {
  ATIVO: 'bg-success-100 text-success-700',
  EM_VALIDACAO: 'bg-warning-100 text-warning-700',
  EM_CONSTRUCAO: 'bg-accent text-muted',
}

export function GovernanceDecisionsPage() {
  const { data, isLoading, isError, error, refetch } = useGovernanceContext()

  if (isLoading) {
    return <PageLoader text="Carregando decisões..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar decisões"
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
        title="Sem decisões registradas"
        description="Nenhuma decisão estratégica foi encontrada no contexto atual."
      />
    )
  }

  const decisions = data.decisions
  const canonicalArtifacts = data.canonicalArtifacts ?? []
  const rbacRoles = data.rbacRoles ?? []
  const { cadenceRituals, auditReports } = data
  const activeCount = decisions.filter((d) => d.status === 'ATIVA').length
  const reviewCount = decisions.filter((d) => d.status === 'EM_REVISAO').length
  const doneCount = decisions.filter((d) => d.status === 'CONCLUIDA').length

  const hasContent =
    decisions.length > 0 ||
    canonicalArtifacts.length > 0 ||
    rbacRoles.length > 0 ||
    cadenceRituals.length > 0 ||
    auditReports.length > 0

  if (!hasContent) {
    return (
      <EmptyState
        title="Governança sem registros"
        description="Não há dados de governança disponíveis no momento."
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Governança — Decisões</h1>
        <p className="text-muted mt-2">
          Decisões registradas, impactos e status de acompanhamento.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Artefatos canônicos (DOC 00–DOC 11)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doc</TableHead>
                  <TableHead>Artefato</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Dono</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualização</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {canonicalArtifacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted">
                      Nenhum artefato canônico registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  canonicalArtifacts.map((artifact) => (
                    <TableRow key={artifact.id}>
                      <TableCell className="font-medium">{artifact.docRef}</TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{artifact.title}</p>
                          <p className="text-xs text-muted truncate">{artifact.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{artifact.module}</TableCell>
                      <TableCell>{artifact.owner}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            artifactStatusStyles[artifact.status] || 'bg-accent text-muted'
                          }`}
                        >
                          {artifact.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(artifact.lastUpdate)}</TableCell>
                      <TableCell>
                        {artifact.link ? (
                          <a
                            href={artifact.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            Abrir
                          </a>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hierarquia e papéis (RBAC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Papel</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Responsabilidades-chave</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rbacRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted">
                      Nenhum papel RBAC registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  rbacRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.title}</TableCell>
                      <TableCell>{role.level}</TableCell>
                      <TableCell>{role.scope}</TableCell>
                      <TableCell className="text-xs text-muted">
                        <ul className="list-disc pl-4 space-y-1">
                          {role.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cadência de governança (WBR/MBR/QBR)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ritual</TableHead>
                  <TableHead>Cadência</TableHead>
                  <TableHead>Foco</TableHead>
                  <TableHead>Participantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cadenceRituals.map((ritual) => (
                  <TableRow key={ritual.id}>
                    <TableCell className="font-medium">{ritual.title}</TableCell>
                    <TableCell>{ritual.cadence}</TableCell>
                    <TableCell className="text-xs text-muted">{ritual.focus}</TableCell>
                    <TableCell className="text-xs text-muted">{ritual.participants}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 text-xs text-muted">
              Entregáveis: {cadenceRituals.flatMap((ritual) => ritual.outputs).join(' · ')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Relatórios auditáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Relatório</TableHead>
                  <TableHead>Cadência</TableHead>
                  <TableHead>Dono</TableHead>
                  <TableHead>Última atualização</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{report.title}</p>
                        <p className="text-xs text-muted truncate">{report.scope}</p>
                      </div>
                    </TableCell>
                    <TableCell>{report.cadence}</TableCell>
                    <TableCell>{report.owner}</TableCell>
                    <TableCell>{formatDate(report.lastUpdate)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          auditStatusStyles[report.status] || 'bg-accent text-muted'
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Decisões ativas</p>
            <p className="text-2xl font-bold text-foreground mt-2">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Em revisão</p>
            <p className="text-2xl font-bold text-foreground mt-2">{reviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Concluídas</p>
            <p className="text-2xl font-bold text-foreground mt-2">{doneCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registro de decisões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Decisão</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisions.map((decision) => (
                <TableRow key={decision.id}>
                  <TableCell className="font-medium">{decision.id}</TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{decision.title}</p>
                      <p className="text-xs text-muted truncate">{decision.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{decision.owner}</TableCell>
                  <TableCell>{formatDate(decision.date)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        impactStyles[decision.impact] || 'bg-accent text-muted'
                      }`}
                    >
                      {decision.impact}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[decision.status] || 'bg-accent text-muted'
                      }`}
                    >
                      {decision.status}
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
