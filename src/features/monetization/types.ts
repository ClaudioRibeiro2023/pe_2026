export interface MonetizationContext {
  metadata: MonetizationMetadata
  summary: MonetizationSummary
  baseContracts: ContractBase[]
  paretoTop14: ParetoContract[]
  activationPlans: ActivationPlan[]
  integration: IntegrationRitual[]
}

export interface MonetizationMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface MonetizationSummary {
  saldoTotal: number
  execucaoPercentual: number
  ativacaoPercentual: number
  contratosAtivos: number
  top14Percent: number
  top32Percent: number
}

export interface ContractBase {
  id: string
  contratante: string
  tipo: string
  saldoHa: number
  execucaoPercentual: number
  valorEstimado: number
  idadeSaldoDias: number
  status: 'ALTA_EXECUCAO' | 'BAIXA_EXECUCAO' | 'SEM_DEMANDA' | string
}

export interface ParetoContract {
  id: string
  contratante: string
  saldoHa: number
  execucaoPercentual: number
  status: string
}

export interface ActivationPlan {
  id: string
  contratante: string
  owner: string
  status: 'ATIVO' | 'EM_RISCO' | 'CONCLUIDO' | string
  agenda30: number
  agenda60: number
  agenda90: number
  nextAction: string
  evidence: string
}

export interface IntegrationRitual {
  id: string
  interface: string
  cadence: string
  owners: string
  inputs: string[]
  outputs: string[]
}
