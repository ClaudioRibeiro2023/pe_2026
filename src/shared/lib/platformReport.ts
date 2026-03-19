import { navSections } from '@/shared/config/navigation'
import { ROUTES } from '@/shared/config/routes'
import { filterNavByRole } from '@/shared/lib/navAccess'
import type { UserRole } from '@/shared/types'

export interface PlatformCheck {
  id: string
  category: string
  name: string
  status: 'passed' | 'failed' | 'warning'
  message: string
  detail?: string
}

/**
 * Run all automated platform health checks.
 * Works entirely client-side with no async needed.
 */
export function runPlatformReport(userRole?: UserRole): PlatformCheck[] {
  const results: PlatformCheck[] = []

  // ── 1. Auth & RBAC ──────────────────────────────────────
  results.push({
    id: 'auth-role',
    category: 'Auth & RBAC',
    name: 'Role do usuário atual',
    status: userRole ? 'passed' : 'failed',
    message: userRole ? `Role ativa: ${userRole}` : 'Nenhum role definido — sidebar admin ficará oculto',
  })

  // Check that each role sees the expected sections
  const roleSectionMap: Record<UserRole, string[]> = {
    admin: ['overview', 'management', 'planning', 'analytics', 'settings'],
    direcao: ['overview', 'management', 'planning', 'analytics', 'settings'],
    gestor: ['overview', 'management', 'planning', 'analytics', 'settings'],
    colaborador: ['overview', 'management', 'planning', 'analytics'],
    cliente: ['overview', 'management', 'planning', 'analytics'],
  }

  if (userRole) {
    const filtered = filterNavByRole(navSections, userRole)
    const filteredIds = filtered.map(s => s.id)
    const expected = roleSectionMap[userRole]
    const missing = expected.filter(id => !filteredIds.includes(id))
    const extra = filteredIds.filter(id => !expected.includes(id))

    results.push({
      id: 'rbac-sections',
      category: 'Auth & RBAC',
      name: `Seções visíveis para "${userRole}"`,
      status: missing.length === 0 ? 'passed' : 'failed',
      message: missing.length === 0
        ? `${filteredIds.length} seções visíveis — correto`
        : `Faltam seções: ${missing.join(', ')}`,
      detail: `Esperadas: ${expected.join(', ')}\nRecebidas: ${filteredIds.join(', ')}${extra.length ? `\nExtras: ${extra.join(', ')}` : ''}`,
    })
  }

  // ── 2. Navigation integrity ──────────────────────────────
  const allRouteValues = Object.values(ROUTES) as string[]
  const allNavHrefs: string[] = []
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href) allNavHrefs.push(item.href)
      if (item.subItems) {
        for (const sub of item.subItems) {
          allNavHrefs.push(sub.href)
        }
      }
    }
  }

  // Routes defined but not in navigation
  // Classify: exclude dynamic params, auth pages, module index routes, and known future routes
  const knownModuleIndexes = [
    '/action-plans', '/planning', '/strategy', '/admin', '/analytics', '/audit',
    '/area-plans', '/governance', '/settings',
  ]
  const knownFutureRoutes = [
    '/capacity', '/finance', '/monetization', '/initiatives', '/alerts', '/dashboards',
    '/analytics/dashboards', '/analytics/benchmark', '/analytics/forecasts',
    '/audit/compliance', '/audit/access', '/audit/evidences', '/audit/risk-map',
    '/admin/okrs', '/admin/pillars', '/admin/areas', '/admin/approvals',
    '/admin/integrations', '/admin/templates',
    '/governance/risks', '/governance/evidences', '/governance/traceability', '/governance/committees',
    '/strategy/thesis', '/strategy/pillars', '/strategy/okrs', '/strategy/kpis',
    '/strategy/scenarios', '/strategy/risks',
    '/action-plans/dashboard', '/action-plans/kanban', '/action-plans/timeline',
    '/action-plans/calendar', '/action-plans/risks',
    '/planning/actions', '/audit',
  ]
  const orphanRoutes = allRouteValues.filter(r =>
    !allNavHrefs.includes(r) &&
    r !== ROUTES.LOGIN &&
    r !== '/reset-password' &&
    !r.includes(':') &&
    !knownModuleIndexes.includes(r) &&
    !knownFutureRoutes.includes(r)
  )

  const totalUnlinked = allRouteValues.filter(r =>
    !allNavHrefs.includes(r) && r !== ROUTES.LOGIN && r !== '/reset-password' && !r.includes(':')
  ).length

  results.push({
    id: 'nav-orphan-routes',
    category: 'Navegação',
    name: 'Rotas sem link no menu',
    status: orphanRoutes.length === 0 ? 'passed' : orphanRoutes.length <= 5 ? 'warning' : 'failed',
    message: orphanRoutes.length === 0
      ? `Todas as rotas classificadas (${totalUnlinked} módulo/futuro, ${allNavHrefs.length} no menu)`
      : `${orphanRoutes.length} rota(s) não classificada(s) (${totalUnlinked} total sem link)`,
    detail: orphanRoutes.length > 0 ? orphanRoutes.join('\n') : undefined,
  })

  // Nav items pointing to valid routes
  const invalidNavHrefs = allNavHrefs.filter(href => !allRouteValues.includes(href))
  results.push({
    id: 'nav-invalid-hrefs',
    category: 'Navegação',
    name: 'Links inválidos no menu',
    status: invalidNavHrefs.length === 0 ? 'passed' : 'failed',
    message: invalidNavHrefs.length === 0
      ? 'Todos os links do menu apontam para rotas válidas'
      : `${invalidNavHrefs.length} link(s) apontam para rota inexistente`,
    detail: invalidNavHrefs.join('\n'),
  })

  // Section count
  results.push({
    id: 'nav-sections-total',
    category: 'Navegação',
    name: 'Total de seções definidas',
    status: navSections.length === 5 ? 'passed' : 'warning',
    message: `${navSections.length} seção(ões): ${navSections.map(s => s.title).join(', ')}`,
  })

  // ── 3. Mock Data integrity ──────────────────────────────
  try {
    // Dynamic import would be async; we'll check synchronously via window
    // These checks verify the mockStore has data after initialization
    const checks = [
      /* eslint-disable @typescript-eslint/no-explicit-any */
      { name: 'mockStore.actions', check: () => { const m = (window as any).__mockStoreDebug; return m?.actions?.length ?? -1 } },
      { name: 'mockStore.plans', check: () => { const m = (window as any).__mockStoreDebug; return m?.plans?.length ?? -1 } },
      { name: 'mockStore.areas', check: () => { const m = (window as any).__mockStoreDebug; return m?.areas?.length ?? -1 } },
      /* eslint-enable @typescript-eslint/no-explicit-any */
    ]

    for (const { name, check } of checks) {
      const count = check()
      if (count === -1) {
        results.push({
          id: `mock-${name}`,
          category: 'Dados Mock',
          name,
          status: 'warning',
          message: 'mockStore não exposto (normal em produção)',
        })
      } else {
        results.push({
          id: `mock-${name}`,
          category: 'Dados Mock',
          name,
          status: count > 0 ? 'passed' : 'failed',
          message: `${count} registro(s)`,
        })
      }
    }
  } catch {
    results.push({
      id: 'mock-error',
      category: 'Dados Mock',
      name: 'Verificação mock store',
      status: 'warning',
      message: 'Não foi possível verificar (esperado em produção)',
    })
  }

  // ── 4. Browser & environment ────────────────────────────
  results.push({
    id: 'env-mode',
    category: 'Ambiente',
    name: 'Modo de execução',
    status: 'passed',
    message: import.meta.env.PROD ? 'Produção (build)' : 'Desenvolvimento (dev)',
  })

  results.push({
    id: 'env-supabase',
    category: 'Ambiente',
    name: 'Supabase configurado',
    status: import.meta.env.VITE_SUPABASE_URL ? 'passed' : 'warning',
    message: import.meta.env.VITE_SUPABASE_URL
      ? 'URL Supabase definida'
      : 'Sem VITE_SUPABASE_URL — modo demo ativo',
  })

  results.push({
    id: 'env-viewport',
    category: 'Ambiente',
    name: 'Viewport',
    status: window.innerWidth >= 1024 ? 'passed' : 'warning',
    message: `${window.innerWidth}×${window.innerHeight}px${window.innerWidth < 1024 ? ' — sidebar oculto em telas < 1024px' : ''}`,
  })

  return results
}

// ── Markdown Report Generator ─────────────────────────────

interface ValidationCheck {
  id: string
  category: string
  name: string
  status: string
  message?: string
  description?: string
}

function statusIcon(s: string): string {
  if (s === 'passed') return '✅'
  if (s === 'failed') return '❌'
  if (s === 'warning') return '⚠️'
  if (s === 'running') return '🔄'
  return '⬜'
}

/**
 * Generate a versioned Markdown diagnostic report.
 * Combines Supabase validation checks + platform checks into one document.
 */
export function generateMarkdownReport(opts: {
  supabaseChecks: ValidationCheck[]
  platformChecks: PlatformCheck[]
  userEmail: string
  userRole: string
  roleOverride: boolean
  completedAt: Date | null
}): { filename: string; content: string } {
  const now = opts.completedAt ?? new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Count stats
  const sbTotal = opts.supabaseChecks.length
  const sbPassed = opts.supabaseChecks.filter(c => c.status === 'passed').length
  const sbWarning = opts.supabaseChecks.filter(c => c.status === 'warning').length
  const sbFailed = opts.supabaseChecks.filter(c => c.status === 'failed').length

  const ptTotal = opts.platformChecks.length
  const ptPassed = opts.platformChecks.filter(c => c.status === 'passed').length
  const ptWarning = opts.platformChecks.filter(c => c.status === 'warning').length
  const ptFailed = opts.platformChecks.filter(c => c.status === 'failed').length

  const lines: string[] = []
  const L = (s = '') => lines.push(s)

  L(`# Diagnóstico da Plataforma PE_2026`)
  L()
  L(`**Data:** ${dateStr} ${timeStr} (UTC-03:00)  `)
  L(`**Executado por:** ${opts.userEmail}  `)
  L(`**Role ativa:** ${opts.userRole}${opts.roleOverride ? ' (override)' : ''}  `)
  L(`**Ambiente:** ${import.meta.env.PROD ? 'Produção (build)' : 'Desenvolvimento'}  `)
  L(`**Viewport:** ${window.innerWidth}×${window.innerHeight}px  `)
  L()
  L(`---`)
  L()
  L(`## Resumo`)
  L()
  L(`| Métrica | Valor |`)
  L(`|---------|-------|`)
  L(`| **Testes Supabase** | ${sbTotal} |`)
  L(`| ${statusIcon('passed')} Passou | ${sbPassed} |`)
  L(`| ${statusIcon('warning')} Alertas | ${sbWarning} |`)
  L(`| ${statusIcon('failed')} Falhou | ${sbFailed} |`)
  L(`| **Testes Plataforma** | ${ptTotal} |`)
  L(`| ${statusIcon('passed')} OK | ${ptPassed} |`)
  L(`| ${statusIcon('warning')} Alertas | ${ptWarning} |`)
  L(`| ${statusIcon('failed')} Falhas | ${ptFailed} |`)
  L()
  L(`---`)
  L()

  // Supabase checks by category
  const sbCats = [...new Set(opts.supabaseChecks.map(c => c.category))]
  for (const cat of sbCats) {
    L(`## ${cat}`)
    L()
    L(`| Check | Status | Mensagem |`)
    L(`|-------|--------|----------|`)
    for (const c of opts.supabaseChecks.filter(x => x.category === cat)) {
      L(`| ${c.name} | ${statusIcon(c.status)} ${c.status} | ${c.message || '—'} |`)
    }
    L()
  }

  L(`---`)
  L()

  // Platform checks by category
  L(`## Diagnóstico da Plataforma (automático)`)
  L()
  const ptCats = [...new Set(opts.platformChecks.map(c => c.category))]
  for (const cat of ptCats) {
    L(`### ${cat}`)
    L()
    L(`| Check | Status | Mensagem |`)
    L(`|-------|--------|----------|`)
    for (const c of opts.platformChecks.filter(x => x.category === cat)) {
      L(`| ${c.name} | ${statusIcon(c.status)} | ${c.message} |`)
    }
    // Show details if any
    for (const c of opts.platformChecks.filter(x => x.category === cat && x.detail)) {
      L()
      L(`<details><summary>${c.name} — detalhes</summary>`)
      L()
      L('```')
      L(c.detail!)
      L('```')
      L()
      L(`</details>`)
    }
    L()
  }

  L(`---`)
  L()

  // Priority actions
  const criticals = [
    ...opts.supabaseChecks.filter(c => c.status === 'failed'),
    ...opts.platformChecks.filter(c => c.status === 'failed'),
  ]
  const warnings = [
    ...opts.supabaseChecks.filter(c => c.status === 'warning'),
    ...opts.platformChecks.filter(c => c.status === 'warning'),
  ]

  L(`## Prioridades de Correção`)
  L()
  if (criticals.length > 0) {
    L(`### 🔴 Crítico`)
    criticals.forEach((c, i) => L(`${i + 1}. **${c.name}** — ${c.message || ''}`))
    L()
  }
  if (warnings.length > 0) {
    L(`### 🟡 Atenção`)
    warnings.forEach((c, i) => L(`${i + 1}. **${c.name}** — ${c.message || ''}`))
    L()
  }
  if (criticals.length === 0 && warnings.length === 0) {
    L(`### 🟢 Todos os checks passaram!`)
    L()
  }

  L(`---`)
  L()
  L(`*Gerado automaticamente pelo sistema de diagnóstico PE_2026*`)

  const filename = `DIAG_${dateStr}_v${Date.now().toString(36).slice(-4)}.md`
  return { filename, content: lines.join('\n') }
}
