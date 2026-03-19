export interface ScoreboardContext {
  metadata: ScoreboardMetadata
  guardrails: Guardrail[]
  pillars: PillarScore[]
  monetization: MonetizationScore
}

export interface ScoreboardMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface Guardrail {
  id: string
  indicador: string
  definicao: string
  valor: number
  unidade: string
  cadencia: string
  gatilho: string
  owner: string
  source: string
  status: 'OK' | 'ATENCAO' | 'CRITICO' | string
}

export interface PillarScore {
  pillar: string
  title: string
  kpis: PillarKpi[]
}

export interface PillarKpi {
  id: string
  indicador: string
  definicao: string
  valor: number
  unidade: string
  cadencia: string
  gatilho: string
  owner: string
  source: string
  status?: 'OK' | 'ATENCAO' | 'CRITICO' | string
}

export interface MonetizationScore {
  summary: MonetizationSummary
  metrics: MonetizationMetric[]
  warRoom: WarRoomStatus
}

export interface MonetizationSummary {
  saldoTotal: number
  execucaoPercentual: number
  runRateSemanal: number
  ativacaoPercentual: number
  paretoTop14Percent: number
  previsao30: number
  previsao60: number
  previsao90: number
  idadeSaldoMedia: number
}

export interface MonetizationMetric {
  id: string
  indicador: string
  valor: number
  unidade: string
  cadencia: string
  gatilho: string
  owner: string
  source: string
  alert: string
  nota?: string
}

export interface WarRoomStatus {
  status: string
  cadence: string
  focus: string
  owner: string
}
