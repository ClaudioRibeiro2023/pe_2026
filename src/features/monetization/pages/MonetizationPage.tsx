import { Wallet } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { formatCurrency, formatNumber } from '@/shared/lib/format'
import { useMonetizationContext } from '@/features/monetization/hooks'

const statusStyles: Record<string, string> = {
  ALTA_EXECUCAO: 'bg-success-100 text-success-700',
  BAIXA_EXECUCAO: 'bg-warning-100 text-warning-700',
  SEM_DEMANDA: 'bg-danger-100 text-danger-700',
}

const planStatusStyles: Record<string, string> = {
  ATIVO: 'bg-primary-100 text-primary-700',
  EM_RISCO: 'bg-warning-100 text-warning-700',
  CONCLUIDO: 'bg-success-100 text-success-700',
}

export function MonetizationPage() {
  const { data, isLoading, isError, error, refetch } = useMonetizationContext()

  if (isLoading) {
    return <PageLoader text="Carregando monetizacao..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar monetizacao"
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
        title="Sem dados de monetizacao"
        description="Nao foi possivel encontrar o contexto de monetizacao."
      />
    )
  }

  const summary = data.summary

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Monetização</h1>
        <p className="text-muted mt-2">
          Base contratual, Pareto e planos de ativação para converter saldo em execução.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Saldo total</p>
            <p className="text-2xl font-bold text-foreground mt-2">{formatNumber(summary.saldoTotal)} ha</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Execução acumulada</p>
            <p className="text-2xl font-bold text-foreground mt-2">{formatNumber(summary.execucaoPercentual, 1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Ativação de demanda</p>
            <p className="text-2xl font-bold text-foreground mt-2">{formatNumber(summary.ativacaoPercentual, 1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Contratos ativos</p>
            <p className="text-2xl font-bold text-foreground mt-2">{summary.contratosAtivos}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Pareto Top-14
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contratante</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Execução</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.paretoTop14.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.contratante}</TableCell>
                    <TableCell>{formatNumber(item.saldoHa)} ha</TableCell>
                    <TableCell>{formatNumber(item.execucaoPercentual, 1)}%</TableCell>
                    <TableCell className="text-xs text-muted">{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted mt-3">
              Top-14 concentra {formatNumber(summary.top14Percent, 1)}% do saldo · Top-32 concentra {formatNumber(summary.top32Percent, 1)}%.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos de ativação</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contratante</TableHead>
                  <TableHead>Agenda 30/60/90</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.activationPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{plan.contratante}</p>
                        <p className="text-xs text-muted">Dono: {plan.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted">
                      {formatNumber(plan.agenda30)} · {formatNumber(plan.agenda60)} · {formatNumber(plan.agenda90)} ha
                      <div className="text-xs text-muted mt-1">{plan.nextAction}</div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          planStatusStyles[plan.status] || 'bg-accent text-muted'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base contratual (amostra)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contratante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Idade do saldo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.baseContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contratante}</TableCell>
                  <TableCell>{contract.tipo}</TableCell>
                  <TableCell>{formatNumber(contract.saldoHa)} ha</TableCell>
                  <TableCell>{formatNumber(contract.execucaoPercentual, 1)}%</TableCell>
                  <TableCell>{formatCurrency(contract.valorEstimado)}</TableCell>
                  <TableCell>{formatNumber(contract.idadeSaldoDias)} dias</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusStyles[contract.status] || 'bg-accent text-muted'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integração interáreas (rituais e handoffs)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interface</TableHead>
                <TableHead>Cadência</TableHead>
                <TableHead>Donos</TableHead>
                <TableHead>Entradas</TableHead>
                <TableHead>Saídas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.integration.map((ritual) => (
                <TableRow key={ritual.id}>
                  <TableCell className="font-medium">{ritual.interface}</TableCell>
                  <TableCell>{ritual.cadence}</TableCell>
                  <TableCell>{ritual.owners}</TableCell>
                  <TableCell className="text-xs text-muted">{ritual.inputs.join(', ')}</TableCell>
                  <TableCell className="text-xs text-muted">{ritual.outputs.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
