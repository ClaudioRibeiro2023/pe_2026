import { ClipboardList } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatDate } from '@/shared/lib/format'
import { useInitiativesContext, useCanonicalInitiatives } from '@/features/initiatives/hooks'
import type { Initiative as AreaInitiative } from '@/features/area-plans/types'
import type { Initiative as CtxInitiative } from '@/features/initiatives/types'

interface DisplayInitiative {
  id: string
  code: string
  title: string
  type: string
  priority: string
  pillar: string
  okr: string
  owner: string
  status: string
  startDate: string | null
  endDate: string | null
  motorCodes: string[]
}

function normalizeAreaInit(i: AreaInitiative): DisplayInitiative {
  return {
    id: i.id,
    code: i.code,
    title: i.title,
    type: i.type ?? '—',
    priority: i.priority ?? '—',
    pillar: i.pillar?.code ?? i.pillar_id ?? '—',
    okr: i.okr_code ?? '—',
    owner: i.owner ?? '—',
    status: i.status,
    startDate: i.start_date,
    endDate: i.end_date,
    motorCodes: i.motor_codes ?? [],
  }
}

function normalizeCtxInit(i: CtxInitiative): DisplayInitiative {
  return {
    id: i.id,
    code: i.id,
    title: i.title,
    type: i.type,
    priority: i.priority,
    pillar: i.pillar,
    okr: i.okr,
    owner: i.owner,
    status: i.status,
    startDate: i.startDate,
    endDate: i.endDate,
    motorCodes: [],
  }
}

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
  const { data: ctx, isLoading: ctxLoading, isError: ctxError, error: ctxErr, refetch: refetchCtx } = useInitiativesContext()
  const { data: canonicalInits, isLoading: initsLoading, isError: initsError, refetch: refetchInits } = useCanonicalInitiatives()

  const isLoading = ctxLoading || initsLoading
  const isError = ctxError || initsError

  if (isLoading) {
    return <PageLoader text="Carregando carteira de iniciativas..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar carteira"
        message={ctxErr instanceof Error ? ctxErr.message : undefined}
        onRetry={() => {
          void refetchCtx()
          void refetchInits()
        }}
      />
    )
  }

  // Normaliza para DisplayInitiative — resolve conflito de tipos entre as duas fontes
  const initiatives: DisplayInitiative[] = (canonicalInits && canonicalInits.length > 0)
    ? canonicalInits.map(normalizeAreaInit)
    : (ctx?.initiatives ?? []).map(normalizeCtxInit)

  if (initiatives.length === 0) {
    return (
      <EmptyState
        title="Sem iniciativas"
        description="Nenhuma iniciativa foi encontrada na carteira atual."
      />
    )
  }

  const capacity = ctx?.capacity
  const prioritizationCriteria = ctx?.prioritizationCriteria ?? []
  const evidenceRequirement = ctx?.evidenceRequirement

  // Capacidade calculada em tempo real com base nas INITs canônicas
  const wipLimit = capacity?.wipInstitutionalLimit ?? 10
  const wipAreaLimit = capacity?.wipAreaLimit ?? 5
  const inProgressCount = canonicalInits
    ? canonicalInits.filter(i => i.status === 'EM_ANDAMENTO').length
    : (capacity?.inProgressCount ?? 0)
  const blockedCount = canonicalInits
    ? canonicalInits.filter(i => i.status === 'BLOQUEADA').length
    : (capacity?.blockedCount ?? 0)
  const p0Count = canonicalInits
    ? canonicalInits.filter(i => i.priority === 'P0').length
    : (capacity?.p0Count ?? 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Carteira de Iniciativas PE2026</h1>
        <p className="text-muted mt-2">
          {canonicalInits && canonicalInits.length > 0
            ? `${canonicalInits.length} iniciativas canônicas — INIT-001 a INIT-022 (DOC 08 v2)`
            : 'Prioridades, capacidade e rastreabilidade das iniciativas estratégicas.'
          }
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
              {evidenceRequirement?.mandatory ? 'Obrigatória para conclusão' : 'Opcional'}
            </p>
            <p className="text-sm text-muted">Artefatos mínimos:</p>
            <ul className="list-disc pl-5 text-sm text-muted space-y-1">
              {(evidenceRequirement?.requiredArtifacts ?? ['EVID-*', 'DEC-*']).map((artifact) => (
                <li key={artifact}>{artifact}</li>
              ))}
            </ul>
            <p className="text-xs text-muted">{evidenceRequirement?.validation}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">WIP institucional</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {inProgressCount} / {wipLimit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">WIP por área</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {wipAreaLimit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Iniciativas bloqueadas</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {blockedCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">P0 em execução</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {p0Count}
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
                        {initiative.okr}
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
                    {initiative.startDate ? formatDate(initiative.startDate) : '—'}
                    {' → '}
                    {initiative.endDate ? formatDate(initiative.endDate) : '—'}
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
