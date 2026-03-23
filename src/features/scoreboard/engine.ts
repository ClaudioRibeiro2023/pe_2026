/**
 * Engine de Cálculo do Scorecard PE2026
 * Versão: 2.0.0 — Onda D (Métricas Oficiais)
 *
 * Responsabilidades:
 *  - Calcular status de guardrails (A1–A4) com base em valor e gatilho
 *  - Calcular status de KPIs por pilar (P1–P5)
 *  - Calcular métricas de monetização (C1–C7)
 *  - Derivar score consolidado do scorecard
 *  - Early Warning System para desvios críticos
 */

import type { Guardrail, PillarKpi, MonetizationMetric, ScoreboardContext } from './types'

// ============================================================
// TIPOS INTERNOS DO ENGINE
// ============================================================

export type KpiStatus = 'OK' | 'ATENCAO' | 'CRITICO'

export interface GuardrailRule {
  id: string
  threshold: number
  direction: 'above' | 'below'   // 'below': valor < threshold = problema; 'above': valor > threshold = problema
  criticalThreshold?: number       // segundo limite para CRITICO
}

export interface ScoreResult {
  totalKpis: number
  ok: number
  atencao: number
  critico: number
  scorePercent: number             // (ok / total) * 100
  hasGuardrailBreach: boolean
  criticalGuardrails: string[]     // IDs dos guardrails em CRITICO
  ews: EarlyWarning[]              // Early Warnings ativos
}

export interface EarlyWarning {
  id: string
  type: 'GUARDRAIL' | 'KPI' | 'MONETIZACAO'
  pillar?: string
  indicador: string
  valor: number
  threshold: number
  message: string
  severity: KpiStatus
}

// ============================================================
// REGRAS CANÔNICAS DE GUARDRAILS (DOC 05 v2)
// ============================================================

const GUARDRAIL_RULES: GuardrailRule[] = [
  {
    id: 'A1',
    threshold: 30,        // margem ≥ 30% → abaixo é problema
    direction: 'below',
    criticalThreshold: 25,
  },
  {
    id: 'A2',
    threshold: 70,        // previsibilidade 30/60/90 ≥ 70% → abaixo é atenção
    direction: 'below',
    criticalThreshold: 50,
  },
  {
    id: 'A3',
    threshold: 90,        // qualidade/SLA ≥ 90% → abaixo é problema
    direction: 'below',
    criticalThreshold: 80,
  },
  {
    id: 'A4',
    threshold: 85,        // saúde organizacional ≥ 85% → abaixo é atenção
    direction: 'below',
    criticalThreshold: 70,
  },
]

// Regras de KPIs por pilar (direction + thresholds)
const KPI_RULES: Record<string, { threshold: number; direction: 'above' | 'below'; critical?: number }> = {
  // P1
  'P1.KPI-01': { threshold: 80,  direction: 'below', critical: 60  },
  'P1.KPI-02': { threshold: 75,  direction: 'below', critical: 50  },
  'P1.KPI-03': { threshold: 80,  direction: 'below', critical: 60  },
  // P2
  'P2.KPI-01': { threshold: 65,  direction: 'below', critical: 50  },
  'P2.KPI-02': { threshold: 25,  direction: 'above', critical: 40  }, // baixa execução — acima é ruim
  'P2.KPI-03': { threshold: 75,  direction: 'below', critical: 60  },
  // P3
  'P3.KPI-01': { threshold: 85,  direction: 'below', critical: 70  },
  'P3.KPI-02': { threshold: 80,  direction: 'below', critical: 65  },
  'P3.KPI-03': { threshold: 10,  direction: 'above', critical: 20  }, // retrabalho — acima é ruim
  // P4
  'P4.KPI-01': { threshold: 70,  direction: 'below', critical: 50  },
  'P4.KPI-02': { threshold: 80,  direction: 'below', critical: 60  },
  'P4.KPI-03': { threshold: 10,  direction: 'below', critical: 5   },
  // P5
  'P5.KPI-01': { threshold: 35,  direction: 'above', critical: 50  }, // turnover — acima é ruim
  'P5.KPI-02': { threshold: 85,  direction: 'below', critical: 70  },
  'P5.KPI-03': { threshold: 80,  direction: 'below', critical: 60  },
  'P5.KPI-04': { threshold: 75,  direction: 'below', critical: 55  },
  // Monetização
  'C1': { threshold: 37911, direction: 'above', critical: 45000 }, // saldo — acima é pior
  'C2': { threshold: 65,    direction: 'below', critical: 50    },
  'C3': { threshold: 3500,  direction: 'below', critical: 2500  },
  'C4': { threshold: 70,    direction: 'below', critical: 55    },
  'C5': { threshold: 25000, direction: 'below', critical: 15000 },
  'C6': { threshold: 120,   direction: 'above', critical: 150   }, // idade — acima é ruim
  'C7': { threshold: 70,    direction: 'below', critical: 50    },
}

// ============================================================
// FUNÇÕES DO ENGINE
// ============================================================

/**
 * Calcula o status de um indicador dado valor e regra
 */
export function calcStatus(
  id: string,
  value: number,
  overrideRule?: { threshold: number; direction: 'above' | 'below'; critical?: number }
): KpiStatus {
  const rule = overrideRule ?? KPI_RULES[id]
  if (!rule) return 'OK'

  const { threshold, direction, critical } = rule

  if (direction === 'below') {
    if (critical !== undefined && value < critical) return 'CRITICO'
    if (value < threshold) return 'ATENCAO'
    return 'OK'
  } else {
    if (critical !== undefined && value > critical) return 'CRITICO'
    if (value > threshold) return 'ATENCAO'
    return 'OK'
  }
}

/**
 * Recalcula status de todos os guardrails
 */
export function recalcGuardrails(guardrails: Guardrail[]): Guardrail[] {
  return guardrails.map(g => {
    const rule = GUARDRAIL_RULES.find(r => r.id === g.id)
    if (!rule) return g
    return {
      ...g,
      status: calcStatus(g.id, g.valor, {
        threshold: rule.threshold,
        direction: rule.direction,
        critical: rule.criticalThreshold,
      }),
    }
  })
}

/**
 * Recalcula status de todos os KPIs de pilar
 */
export function recalcPillarKpis(kpis: PillarKpi[]): PillarKpi[] {
  return kpis.map(kpi => ({
    ...kpi,
    status: calcStatus(kpi.id, kpi.valor),
  }))
}

/**
 * Recalcula status de métricas de monetização
 */
export function recalcMonetizationMetrics(metrics: MonetizationMetric[]): (MonetizationMetric & { status: KpiStatus })[] {
  return metrics.map(m => ({
    ...m,
    status: calcStatus(m.id, m.valor),
  }))
}

/**
 * Early Warning System — detecta desvios críticos e de atenção
 */
export function computeEarlyWarnings(ctx: ScoreboardContext): EarlyWarning[] {
  const warnings: EarlyWarning[] = []

  // Guardrails
  for (const g of ctx.guardrails) {
    const status = calcStatus(g.id, g.valor, GUARDRAIL_RULES.find(r => r.id === g.id)
      ? {
          threshold: GUARDRAIL_RULES.find(r => r.id === g.id)!.threshold,
          direction: GUARDRAIL_RULES.find(r => r.id === g.id)!.direction,
          critical: GUARDRAIL_RULES.find(r => r.id === g.id)!.criticalThreshold,
        }
      : undefined)
    if (status !== 'OK') {
      const rule = GUARDRAIL_RULES.find(r => r.id === g.id)!
      warnings.push({
        id: g.id,
        type: 'GUARDRAIL',
        indicador: g.indicador,
        valor: g.valor,
        threshold: rule.threshold,
        message: `Guardrail ${g.id} — ${g.indicador}: ${g.valor}${g.unidade} (gatilho: ${g.gatilho})`,
        severity: status,
      })
    }
  }

  // KPIs por pilar
  for (const pillar of ctx.pillars) {
    for (const kpi of pillar.kpis) {
      const status = calcStatus(kpi.id, kpi.valor)
      if (status !== 'OK') {
        const rule = KPI_RULES[kpi.id]
        warnings.push({
          id: kpi.id,
          type: 'KPI',
          pillar: pillar.pillar,
          indicador: kpi.indicador,
          valor: kpi.valor,
          threshold: rule?.threshold ?? 0,
          message: `${pillar.pillar} / ${kpi.id} — ${kpi.indicador}: ${kpi.valor}${kpi.unidade} (gatilho: ${kpi.gatilho})`,
          severity: status,
        })
      }
    }
  }

  // Monetização
  for (const m of ctx.monetization.metrics) {
    const status = calcStatus(m.id, m.valor)
    if (status !== 'OK') {
      const rule = KPI_RULES[m.id]
      warnings.push({
        id: m.id,
        type: 'MONETIZACAO',
        indicador: m.indicador,
        valor: m.valor,
        threshold: rule?.threshold ?? 0,
        message: `Monetização ${m.id} — ${m.indicador}: ${m.valor} ${m.unidade} (${m.alert})`,
        severity: status,
      })
    }
  }

  // Ordenar: CRITICO primeiro, depois ATENCAO
  return warnings.sort((a, b) => {
    const order: Record<KpiStatus, number> = { CRITICO: 0, ATENCAO: 1, OK: 2 }
    return order[a.severity] - order[b.severity]
  })
}

/**
 * Score consolidado do scorecard PE2026
 */
export function computeScoreResult(ctx: ScoreboardContext): ScoreResult {
  const allKpis: { id: string; valor: number; status: KpiStatus }[] = []

  // Guardrails recalculados
  const guardrailsCalc = recalcGuardrails(ctx.guardrails)
  for (const g of guardrailsCalc) {
    allKpis.push({ id: g.id, valor: g.valor, status: (g.status as KpiStatus) ?? 'OK' })
  }

  // KPIs de pilar
  for (const pillar of ctx.pillars) {
    for (const kpi of recalcPillarKpis(pillar.kpis)) {
      allKpis.push({ id: kpi.id, valor: kpi.valor, status: (kpi.status as KpiStatus) ?? 'OK' })
    }
  }

  // Métricas de monetização
  for (const m of recalcMonetizationMetrics(ctx.monetization.metrics)) {
    allKpis.push({ id: m.id, valor: m.valor, status: m.status })
  }

  const ok = allKpis.filter(k => k.status === 'OK').length
  const atencao = allKpis.filter(k => k.status === 'ATENCAO').length
  const critico = allKpis.filter(k => k.status === 'CRITICO').length
  const total = allKpis.length

  const criticalGuardrails = guardrailsCalc
    .filter(g => g.status === 'CRITICO')
    .map(g => g.id)

  return {
    totalKpis: total,
    ok,
    atencao,
    critico,
    scorePercent: total > 0 ? Math.round((ok / total) * 100) : 0,
    hasGuardrailBreach: guardrailsCalc.some(g => g.status !== 'OK'),
    criticalGuardrails,
    ews: computeEarlyWarnings(ctx),
  }
}

/**
 * Aplica recálculo completo ao contexto do scorecard
 * Retorna contexto enriquecido com status calculados pelo engine
 */
export function applyEngineToContext(ctx: ScoreboardContext): ScoreboardContext {
  return {
    ...ctx,
    guardrails: recalcGuardrails(ctx.guardrails),
    pillars: ctx.pillars.map(pillar => ({
      ...pillar,
      kpis: recalcPillarKpis(pillar.kpis),
    })),
  }
}
