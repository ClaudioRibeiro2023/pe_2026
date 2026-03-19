import { useNavigate } from 'react-router-dom'
import { Users, ExternalLink } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatDate } from '@/shared/lib/format'
import { useOkrsContext } from '@/features/okrs/hooks'
import { useInitiativesContext } from '@/features/initiatives/hooks'

const okrStatusStyles: Record<string, string> = {
  EM_ANDAMENTO: 'bg-primary-100 text-primary-700',
  ATENCAO: 'bg-warning-100 text-warning-700',
  CONCLUIDO: 'bg-success-100 text-success-700',
}

const initiativeStatusStyles: Record<string, string> = {
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

const moduleStatusStyles: Record<string, string> = {
  NAO_INICIADO: 'bg-accent text-muted',
  EM_ANDAMENTO: 'bg-primary-100 text-primary-700',
  ATENCAO: 'bg-warning-100 text-warning-700',
  CONCLUIDO: 'bg-success-100 text-success-700',
}

const areaLabelMap: Record<string, string> = {
  Marketing: 'MKT',
  Operacao: 'Operação',
}

export function AreasPage() {
  const navigate = useNavigate()
  const {
    data: okrsData,
    isLoading: okrsLoading,
    isError: okrsIsError,
    error: okrsError,
    refetch: refetchOkrs,
  } = useOkrsContext()
  const {
    data: initiativesData,
    isLoading: initiativesLoading,
    isError: initiativesIsError,
    error: initiativesError,
    refetch: refetchInitiatives,
  } = useInitiativesContext()

  const isLoading = okrsLoading || initiativesLoading
  const isError = okrsIsError || initiativesIsError
  const error = okrsError ?? initiativesError

  if (isLoading) {
    return <PageLoader text="Carregando visão por área..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar visão por área"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetchOkrs()
          void refetchInitiatives()
        }}
      />
    )
  }

  if (!okrsData || okrsData.areas.length === 0) {
    return (
      <EmptyState
        title="Sem áreas cadastradas"
        description="Nenhuma visão por área foi encontrada no contexto atual."
      />
    )
  }

  const initiatives = initiativesData?.initiatives ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Visão por Área</h1>
        <p className="text-muted mt-2">
          OKRs e iniciativas por área com rastreabilidade e status executivo.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {okrsData.areas.map((area) => {
          const areaInitiatives = initiatives.filter(
            (initiative) => initiative.owner === area.owner || initiative.owner === area.area
          )
          const areaLabel = areaLabelMap[area.area] ?? area.area
          const areaModules = area.modules ?? []

          const areaSlug = area.area.toLowerCase().replace(/\s+/g, '-')

          return (
            <Card key={area.area} className="border border-border hover:border-primary-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {areaLabel}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/planning/${areaSlug}/dashboard`)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver Planos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs text-muted gap-2">
                  <span>Dono: {area.owner}</span>
                  <span>
                    OKRs: {area.okrs.length} · INITs: {areaInitiatives.length} · Módulos:{' '}
                    {areaModules.length}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted">Foco</p>
                  <p className="text-sm text-foreground">{area.focus}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted uppercase">OKRs da área</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Objetivo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>KRs corporativos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {area.okrs.map((okr) => (
                        <TableRow key={okr.id}>
                          <TableCell className="font-medium">{okr.objective}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                okrStatusStyles[okr.status] || 'bg-accent text-muted'
                              }`}
                            >
                              {okr.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted">
                            {okr.linkedCorporateKrs.join(', ')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted uppercase">Iniciativas</p>
                  {areaInitiatives.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Iniciativa</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Prazo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {areaInitiatives.map((initiative) => (
                          <TableRow key={initiative.id}>
                            <TableCell className="font-medium">
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{initiative.title}</p>
                                <p className="text-xs text-muted truncate">{initiative.kr}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  priorityStyles[initiative.priority] || 'bg-accent text-muted'
                                }`}
                              >
                                {initiative.priority}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  initiativeStatusStyles[initiative.status] || 'bg-accent text-muted'
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
                  ) : (
                    <p className="text-xs text-muted">Sem iniciativas vinculadas.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted uppercase">Módulos DOC 11</p>
                  {areaModules.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Módulo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>OKRs</TableHead>
                          <TableHead>INITs</TableHead>
                          <TableHead>Notas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {areaModules.map((module) => (
                          <TableRow key={module.id}>
                            <TableCell className="font-medium">
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{module.title}</p>
                                <p className="text-xs text-muted truncate">{module.id}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  moduleStatusStyles[module.status] || 'bg-accent text-muted'
                                }`}
                              >
                                {module.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted">
                              {module.linkedOkrs?.length ? module.linkedOkrs.join(', ') : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-muted">
                              {module.linkedInitiatives?.length
                                ? module.linkedInitiatives.join(', ')
                                : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-muted">
                              {module.notes ?? '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-xs text-muted">Sem módulos registrados.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
