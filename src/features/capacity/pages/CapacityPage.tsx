import { TrendingUp } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { useCapacityContext } from '@/features/capacity/hooks'

export function CapacityPage() {
  const { data, isLoading, isError, error, refetch } = useCapacityContext()

  if (isLoading) {
    return <PageLoader text="Carregando capacidade..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar capacidade"
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
        title="Sem dados de capacidade"
        description="Nao foi possivel encontrar o contexto de capacidade."
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Capacidade, Orçamento e Alocação</h1>
        <p className="text-muted mt-2">
          Distribuição de energia por trimestre, limites de WIP e diretrizes de orçamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Prioridades do ano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-foreground">{data.allocation.focus}</p>
          <p className="text-sm text-muted">{data.allocation.q1Priority}</p>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            {data.allocation.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição trimestral de capacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trimestre</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>CS / Relacionamento</TableHead>
                <TableHead>P&D / Produto / Dados</TableHead>
                <TableHead>Comercial + Marketing</TableHead>
                <TableHead>Governança</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.quarterlyMix.map((mix) => (
                <TableRow key={mix.quarter}>
                  <TableCell className="font-medium">{mix.quarter}</TableCell>
                  <TableCell>{mix.distribution.operacoes}</TableCell>
                  <TableCell>{mix.distribution.cs}</TableCell>
                  <TableCell>{mix.distribution.pd}</TableCell>
                  <TableCell>{mix.distribution.comercialMarketing}</TableCell>
                  <TableCell>{mix.distribution.governanca}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Limites de WIP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted">Institucional: {data.wipLimits.institutional}</p>
            <p className="text-sm text-muted">Por área: {data.wipLimits.perArea}</p>
            <p className="text-sm text-muted">Regra: {data.wipLimits.rule}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reforços táticos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-foreground">
              {data.tacticalReinforcement.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.area}: {item.action}</p>
                  <p className="text-xs text-muted">{item.rationale}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diretrizes de orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Regra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.budgetGuidelines.map((guideline) => (
                <TableRow key={guideline.id}>
                  <TableCell className="font-medium">{guideline.category}</TableCell>
                  <TableCell>{guideline.rule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
