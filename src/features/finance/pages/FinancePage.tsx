import { Wallet } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatCurrency, formatNumber, formatDate } from '@/shared/lib/format'
import { useFinanceContext } from '@/features/finance/hooks'

const statusStyles: Record<string, string> = {
  OK: 'bg-success-100 text-success-700',
  ATENCAO: 'bg-warning-100 text-warning-700',
  CRITICO: 'bg-danger-100 text-danger-700',
}

export function FinancePage() {
  const { data, isLoading, isError, error, refetch } = useFinanceContext()

  if (isLoading) {
    return <PageLoader text="Carregando financeiro..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar financeiro"
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
        title="Sem dados financeiros"
        description="Nao foi possivel encontrar o contexto financeiro."
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted mt-2">
          Orçamento vivo, custos por unidade, caixa e recebíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Orçamento (variação)</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatNumber(data.budget.variancePercent, 1)}%
            </p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded mt-2 ${
                statusStyles[data.budget.status] || 'bg-accent text-muted'
              }`}
            >
              {data.budget.status}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Caixa 30 dias</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatCurrency(data.cash.projected30)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Caixa 90 dias</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatCurrency(data.cash.projected90)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Runway</p>
            <p className="text-2xl font-bold text-foreground mt-2">{data.cash.runwayDays} dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Orçamento vivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted">Ultima revisão: {formatDate(data.budget.lastReview)}</p>
            <p className="text-sm text-muted">Proxima revisão: {formatDate(data.budget.nextReview)}</p>
            <ul className="list-disc pl-5 text-sm text-muted space-y-1">
              {data.budget.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recebíveis (aging)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted">0-30 dias: {formatCurrency(data.receivables.aging30)}</p>
            <p className="text-sm text-muted">31-60 dias: {formatCurrency(data.receivables.aging60)}</p>
            <p className="text-sm text-muted">61-90 dias: {formatCurrency(data.receivables.aging90)}</p>
            <p className="text-sm text-muted">Vencidos: {formatCurrency(data.receivables.overdue)}</p>
            <p className="text-xs text-muted mt-2">{data.cash.alert}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custos por unidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Custo/ha</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.unitCosts.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell className="font-medium">{cost.unit}</TableCell>
                  <TableCell>{cost.period}</TableCell>
                  <TableCell>{formatCurrency(cost.costPerHa)}</TableCell>
                  <TableCell>{formatNumber(cost.margin, 1)}%</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[cost.status] || 'bg-accent text-muted'
                      }`}
                    >
                      {cost.status}
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
