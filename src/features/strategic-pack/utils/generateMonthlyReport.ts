import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { PackFull, Kpi, GovernanceData, ObjectivesData, ProgramsData, Program } from '../types'
import type { PlanAction } from '@/features/area-plans/types'

interface MonthlyReportData {
  pack: PackFull
  areaName: string
  month: Date
  actions: PlanAction[]
  pendingEvidences: number
  approvedEvidences: number
  rejectedEvidences: number
}

export function generateMonthlyReportMarkdown(data: MonthlyReportData): string {
  const { pack, areaName, month, actions, pendingEvidences, approvedEvidences, rejectedEvidences } = data
  
  const monthStr = format(month, "MMMM 'de' yyyy", { locale: ptBR })
  const monthCode = format(month, 'yyyy-MM')
  
  // Extract structured data
  const objectivesSection = pack.sections.find(s => s.key === 'objectives')
  const objectivesData = (objectivesSection?.structured_data as ObjectivesData) || {}
  const kpis = objectivesData.kpis || []
  
  const governanceSection = pack.sections.find(s => s.key === 'governance')
  const governanceData = (governanceSection?.structured_data as GovernanceData) || {}
  const minutes = governanceData.minutes || []
  
  const programsSection = pack.sections.find(s => s.key === 'programs')
  const programsData = (programsSection?.structured_data as ProgramsData) || {}
  const programs = programsData.programs || []
  
  // Calculate action stats
  const actionStats = {
    total: actions.length,
    completed: actions.filter(a => a.status === 'CONCLUIDA').length,
    inProgress: actions.filter(a => a.status === 'EM_ANDAMENTO').length,
    delayed: actions.filter(a => {
      if (!a.due_date) return false
      return new Date(a.due_date) < new Date() && a.status !== 'CONCLUIDA'
    }).length,
    blocked: actions.filter(a => a.status === 'BLOQUEADA').length,
    todo: actions.filter(a => a.status === 'PENDENTE').length,
  }
  
  // Get MBR decisions for the month
  const monthlyMinutes = minutes.filter(m => m.date.startsWith(monthCode))
  const mbrMinutes = monthlyMinutes.filter(m => {
    const ritual = governanceData.rituals?.find(r => r.id === m.ritual_id)
    return ritual?.type === 'MBR'
  })
  
  const topDecisions = mbrMinutes
    .flatMap(m => m.decisions)
    .slice(0, 5)
  
  // Get critical actions (P0 priority, not done)
  const criticalActions = actions
    .filter(a => a.priority === 'P0' && a.status !== 'CONCLUIDA')
    .slice(0, 10)

  // Build markdown
  const md = `# Fechamento Mensal — ${areaName} — ${monthStr}

> **Gerado em:** ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}  
> **Pack:** ${pack.summary || `PE-${pack.year} ${areaName}`}  
> **Versão:** ${pack.version}

---

## 1. Identificação

| Campo | Valor |
|-------|-------|
| **Área** | ${areaName} |
| **Pack** | PE-${pack.year} ${areaName} |
| **Mês** | ${monthStr} |
| **Status Pack** | ${pack.status === 'published' ? '✅ Publicado' : pack.status === 'review' ? '🔄 Em Revisão' : '📝 Rascunho'} |

---

## 2. KPIs/Metas (Snapshot)

${generateKpiTable(kpis)}

---

## 3. Status do Plano de Ação

| Status | Quantidade | % |
|--------|------------|---|
| ✅ Concluído | ${actionStats.completed} | ${actionStats.total ? ((actionStats.completed / actionStats.total) * 100).toFixed(1) : 0}% |
| 🔄 Em andamento | ${actionStats.inProgress} | ${actionStats.total ? ((actionStats.inProgress / actionStats.total) * 100).toFixed(1) : 0}% |
| 📋 A fazer | ${actionStats.todo} | ${actionStats.total ? ((actionStats.todo / actionStats.total) * 100).toFixed(1) : 0}% |
| ⚠️ Atrasado | ${actionStats.delayed} | ${actionStats.total ? ((actionStats.delayed / actionStats.total) * 100).toFixed(1) : 0}% |
| 🚫 Bloqueado | ${actionStats.blocked} | ${actionStats.total ? ((actionStats.blocked / actionStats.total) * 100).toFixed(1) : 0}% |
| **Total** | **${actionStats.total}** | **100%** |

### Progresso por Programa

${generateProgramProgress(programs, actions)}

---

## 4. Pendências de Evidências/Aprovações

| Tipo | Quantidade |
|------|------------|
| 🟡 Pendente | ${pendingEvidences} |
| ✅ Aprovado | ${approvedEvidences} |
| ❌ Rejeitado | ${rejectedEvidences} |
| **Total** | **${pendingEvidences + approvedEvidences + rejectedEvidences}** |

---

## 5. Decisões do MBR (Top 5)

${topDecisions.length > 0 
  ? topDecisions.map((d, i) => `${i + 1}. ${typeof d === 'string' ? d : d.description}`).join('\n')
  : '_Nenhuma decisão registrada no MBR deste mês._'
}

---

## 6. Próximas Ações Críticas (Top 10)

${criticalActions.length > 0
  ? criticalActions.map((a, i) => {
      const dueDate = a.due_date ? format(new Date(a.due_date), 'dd/MM', { locale: ptBR }) : 'S/D'
      return `${i + 1}. **${a.title}** — ${a.responsible || 'Sem dono'} — Prazo: ${dueDate}`
    }).join('\n')
  : '_Nenhuma ação crítica pendente._'
}

---

## 7. Resumo Executivo

${generateExecutiveSummary(actionStats, kpis, pendingEvidences)}

---

*Relatório gerado automaticamente pelo sistema PE-2026.*
`

  return md
}

function generateKpiTable(kpis: Kpi[]): string {
  if (kpis.length === 0) {
    return '_Nenhum KPI cadastrado._'
  }
  
  const header = '| KPI | Meta | Atual | Status |\n|-----|------|-------|--------|'
  const rows = kpis.map(kpi => {
    const status = getKpiStatus(kpi)
    return `| ${kpi.name} | ${kpi.target} | ${kpi.current_value || '-'} | ${status} |`
  })
  
  return `${header}\n${rows.join('\n')}`
}

function getKpiStatus(kpi: Kpi): string {
  if (!kpi.current_value || !kpi.target) return '⚪'
  
  // Simple heuristic based on trigger
  if (kpi.trigger) {
    const current = parseFloat(kpi.current_value.replace(/[^0-9.-]/g, ''))
    const trigger = parseFloat(kpi.trigger.replace(/[^0-9.-]/g, ''))
    
    if (kpi.trigger.startsWith('>')) {
      return current > trigger ? '🔴' : '🟢'
    } else if (kpi.trigger.startsWith('<')) {
      return current < trigger ? '🔴' : '🟢'
    }
  }
  
  return '🟡'
}

function generateProgramProgress(programs: Program[], actions: PlanAction[]): string {
  if (programs.length === 0) {
    return '_Nenhum programa cadastrado._'
  }
  
  const header = '| Programa | Ações | Concluídas | % |\n|----------|-------|------------|---|'
  const rows = programs.map(prog => {
    const programActions = actions.filter(a => 
      a.program_key === prog.key || 
      a.title.toLowerCase().includes(prog.name.toLowerCase())
    )
    const completed = programActions.filter(a => a.status === 'CONCLUIDA').length
    const total = programActions.length
    const pct = total > 0 ? ((completed / total) * 100).toFixed(0) : 0
    return `| ${prog.name} | ${total} | ${completed} | ${pct}% |`
  })
  
  return `${header}\n${rows.join('\n')}`
}

function generateExecutiveSummary(
  actionStats: { total: number; completed: number; delayed: number; blocked: number },
  kpis: Kpi[],
  pendingEvidences: number
): string {
  const completionRate = actionStats.total > 0 
    ? ((actionStats.completed / actionStats.total) * 100).toFixed(1) 
    : 0
  
  const redKpis = kpis.filter(kpi => {
    if (!kpi.current_value || !kpi.trigger) return false
    const current = parseFloat(kpi.current_value.replace(/[^0-9.-]/g, ''))
    const trigger = parseFloat(kpi.trigger.replace(/[^0-9.-]/g, ''))
    if (kpi.trigger.startsWith('>')) return current > trigger
    if (kpi.trigger.startsWith('<')) return current < trigger
    return false
  })
  
  const highlights: string[] = []
  
  highlights.push(`- **Taxa de execução:** ${completionRate}% das ações concluídas`)
  
  if (actionStats.delayed > 0) {
    highlights.push(`- **Atenção:** ${actionStats.delayed} ação(ões) atrasada(s)`)
  }
  
  if (actionStats.blocked > 0) {
    highlights.push(`- **Bloqueios:** ${actionStats.blocked} ação(ões) bloqueada(s) requerem atenção`)
  }
  
  if (redKpis.length > 0) {
    highlights.push(`- **KPIs em alerta:** ${redKpis.map(k => k.name).join(', ')}`)
  }
  
  if (pendingEvidences > 0) {
    highlights.push(`- **Evidências pendentes:** ${pendingEvidences} aguardando aprovação`)
  }
  
  return highlights.join('\n')
}
