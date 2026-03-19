# MEGAPLAN — UI Redesign Incremental v1

**Data:** 2026-02-06  
**Versao:** v1  
**Estrategia:** 5 ondas incrementais, cada uma independentemente deployavel

---

## Visao Geral das Ondas

| Onda | Tema | Estimativa | Risco | Status |
|------|------|-----------|-------|--------|
| 1 | Unificacao de cores + PageHeader + Breadcrumbs | 1-2 sprints | Baixo | **DONE / PASSA** |
| 2 | FilterBar + DataTable + reducao forte raw colors | 1-2 sprints | Medio | **NEXT** |
| 3 | Calendar + responsividade + tokens de status | 1 sprint | Medio | Planned |
| 4 | Consolidacao thin-wrappers + tabs + Strategic Pack | 1-2 sprints | Medio-Alto | Planned |
| 5 | Polimento: motion, a11y, perf, regressoes | 1 sprint | Baixo | Planned |

---

## Onda 1: Unificacao de Cores + PageHeader + Breadcrumbs — **DONE / PASSA**

### Objetivo
Eliminar inconsistencia de cores (text-gray-* → tokens) e criar PageHeader com breadcrumbs para pages-chave.

### Entregas Realizadas (2026-02-08)

| # | Entrega | Status |
|---|---------|--------|
| 1 | `Breadcrumbs.tsx` criado (ARIA compliant) | DONE |
| 2 | `PageHeader.tsx` criado (title + description + breadcrumbs + actions) | DONE |
| 3 | `Card.tsx` migrado (`bg-surface`, `border-border`) | DONE |
| 4 | `Input.tsx` migrado (13 raw colors removidos) | DONE |
| 5 | `Progress.tsx` migrado (`bg-accent` track) | DONE |
| 6 | `Tooltip.tsx` migrado (dark mode fix) | DONE |
| 7 | PageHeader aplicado em 5 pages (Home, Dashboard, Calendar, AreaDashboard, Reports) | DONE |
| 8 | Breadcrumbs aplicado em 5 pages | DONE |
| 9 | Scripts: baseline count, guardrail, QA | DONE |

### Metricas

| Metrica | Valor |
|---------|-------|
| Raw colors baseline | 889 |
| Raw colors after | 852 |
| Delta | **-37 (-4.2%)** |
| PageHeader | 5/5 |
| Breadcrumbs | 5/5 |
| Build | OK (exit 0, 12.91s) |

### Evidencias

- `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md`
- `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md`
- `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md`
- `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1539.md` (baseline)
- `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1801.md` (after)

---

## Onda 2: FilterBar + DataTable + Reducao Forte Raw Colors — **NEXT**

### Objetivo
Criar componentes reutilizaveis FilterBar e DataTable. Aplicar em Dashboard e Gerenciar Acoes. Reduzir raw colors para <= 760.

### Meta numerica

| Metrica | Baseline (pos-W1) | Target W2 | Reducao necessaria |
|---------|-------------------|-----------|--------------------|
| Raw colors | 852 | **<= 760** | -92 (-10.8%) |
| Paginas com FilterBar | 0 | **>= 3** | +3 |
| Paginas com DataTable | 0 | **>= 3** | +3 |

### Arquivos Impactados

| # | Arquivo | Mudanca |
|---|---------|--------|
| 1 | `src/shared/ui/FilterBar.tsx` | CRIAR — filtros configurados via props |
| 2 | `src/shared/ui/DataTable.tsx` | CRIAR — table + sort + pagination + export |
| 3 | `src/shared/ui/Pagination.tsx` | AJUSTAR — integrar com DataTable |
| 4 | `src/features/planning/pages/PlanningDashboardPage.tsx` | Usar DataTable para progresso por area |
| 5 | `src/features/planning/pages/PlanningHomePage.tsx` | Adicionar metricas inline nos cards de area |
| 6 | `src/features/area-plans/pages/AreaPlansListPage.tsx` | Integrar FilterBar + DataTable com paginacao |
| 7 | `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` | Melhorar quick links com metricas |
| 8 | `src/features/reports/components/PackActionsReport.tsx` | Migrar para DataTable |
| 9 | Top-10 arquivos com mais raw colors (heatmap) | Migracao direcionada para atingir meta <= 760 |

### Riscos e Mitigacao

| Risco | Probabilidade | Mitigacao |
|-------|--------------|-----------|
| DataTable complexo demais | Media | Manter API simples; sort e pagination opcionais |
| Paginacao quebra scroll position | Baixa | Scroll to top ao mudar pagina |
| Performance com 42+ acoes | Baixa | VirtualizedList ja existe como fallback |

### DoD

| # | Criterio | Evidencia |
|---|----------|-----------|
| 1 | FilterBar renderiza com >=3 filtros | Verificacao em /planning/actions/manage |
| 2 | DataTable pagina com 10 items/page | Verificacao com 42 acoes RH |
| 3 | Sort funciona por pelo menos 2 colunas | Clicar header e verificar ordem |
| 4 | ExportButtons integrados no DataTable | PDF/CSV exportam dados filtrados |
| 5 | Build passa | `npm run build` exit 0 |
| 6 | Toast em CRUD de acoes | Criar/editar/deletar mostram toast |

---

## Onda 3: Calendar + Responsividade + Tokens de Status

### Objetivo
Melhorar responsividade em tabelas e grids. Expandir tokenizacao para paginas restantes.

> **Nota (v1.1):** PlanningCalendarPage.tsx ja foi migrado na Wave1 (cores inline → tokens semanticos + dark mode).

### Arquivos Impactados

| # | Arquivo | Mudanca |
|---|---------|--------|
| 1 | `src/features/planning/pages/PlanningCalendarPage.tsx` | DONE (W1) — verificar responsividade mobile |
| 2 | `src/features/planning/pages/area/PlanningAreaCalendarPage.tsx` | Mesma migracao |
| 3 | `src/styles/tokens.css` | Adicionar `--status-*` tokens se necessario |
| 4 | `src/shared/ui/Table.tsx` | Adicionar `overflow-x-auto` wrapper |
| 5 | `src/features/area-plans/pages/AreaPlansListPage.tsx` | Responsividade em mobile |
| 6 | `src/features/reports/components/ProgressReport.tsx` | Verificar responsive |
| 7 | `src/features/reports/components/PackActionsReport.tsx` | Scroll horizontal em mobile |

### Riscos e Mitigacao

| Risco | Probabilidade | Mitigacao |
|-------|--------------|-----------|
| Calendar layout quebra em mobile | Alta | Adicionar `overflow-x-auto` no grid; min-width |
| Status tokens diferentes das cores atuais | Baixa | Usar mesmos valores RGB, apenas via token |
| Testes visuais necessarios em multiplos viewports | Media | Testar em 3 breakpoints: 375px, 768px, 1280px |

### DoD

| # | Criterio | Evidencia |
|---|----------|-----------|
| 1 | Zero cores inline (bg-red-100 etc.) no calendario | `grep` retorna 0 |
| 2 | Calendar renderiza sem overflow em 768px | Verificacao manual |
| 3 | Tabelas tem scroll horizontal em mobile | Verificacao em 375px |
| 4 | Status tokens mapeados 1:1 com badges existentes | Comparacao visual |
| 5 | Build passa | exit 0 |

---

## Onda 4: Consolidacao Thin-Wrappers + Tabs

### Objetivo
Eliminar 4 thin-wrapper pages (Kanban/Timeline/Calendar/Templates) consolidando com tabs/ViewTabs. Ajustar Strategic Pack.

### Arquivos Impactados

| # | Arquivo | Mudanca |
|---|---------|---------|
| 1 | `src/shared/ui/ViewTabs.tsx` | CRIAR — tabs para alternar List/Kanban/Timeline/Calendar |
| 2 | `src/features/planning/pages/PlanningKanbanPage.tsx` | REFATORAR ou REMOVER (redirect para unified) |
| 3 | `src/features/planning/pages/PlanningTimelinePage.tsx` | REFATORAR ou REMOVER |
| 4 | `src/features/planning/pages/PlanningCalendarPage.tsx` | Integrar como tab |
| 5 | `src/features/planning/pages/area/PlanningAreaKanbanPage.tsx` | Consolidar |
| 6 | `src/features/planning/pages/area/PlanningAreaTimelinePage.tsx` | Consolidar |
| 7 | `src/features/planning/pages/area/PlanningAreaCalendarPage.tsx` | Consolidar |
| 8 | `src/features/strategic-pack/pages/StrategicPackPage.tsx` | Migrar cores → tokens |
| 9 | `src/features/strategic-pack/components/*.tsx` | Migrar cores → tokens (10+ arquivos) |
| 10 | `src/shared/config/navigation.ts` | Ajustar rotas se necessario |
| 11 | `src/shared/config/routes.ts` | Manter rotas para backwards compat |

### Riscos e Mitigacao

| Risco | Probabilidade | Mitigacao |
|-------|--------------|-----------|
| Rotas quebram (bookmarks, links) | Alta | Manter rotas antigas como redirects |
| State management entre tabs | Media | Manter state no parent, passar via props |
| Strategic Pack e complexo | Media | Limitar mudancas a cores; nao refatorar logica |

### DoD

| # | Criterio | Evidencia |
|---|----------|-----------|
| 1 | Todas as views acessiveis via tabs | Verificacao manual |
| 2 | Rotas antigas fazem redirect | Testar URLs diretas |
| 3 | Strategic Pack sem cores raw | `grep` retorna 0 |
| 4 | Nenhum flow quebrado | QA script planning + reports passam |
| 5 | Build passa | exit 0 |

---

## Onda 5: Polimento — Motion, A11y, Perf, Regressoes

### Objetivo
Adicionar microinteracoes, melhorar acessibilidade, otimizar performance e garantir zero regressao.

### Arquivos Impactados

| # | Arquivo | Mudanca |
|---|---------|---------|
| 1 | `src/styles/index.css` | Adicionar animacoes (tab switch, card hover) |
| 2 | `src/shared/ui/Card.tsx` | Hover shadow transition |
| 3 | `src/shared/ui/Button.tsx` | Active scale animation |
| 4 | `src/shared/ui/Modal.tsx` | Enter/exit animation |
| 5 | `src/shared/ui/Toast.tsx` | Slide-in animation |
| 6 | `src/features/planning/pages/PlanningCalendarPage.tsx` | aria-labels no grid |
| 7 | `src/features/planning/components/AreaSelector.tsx` | `role="link"` nos cards |
| 8 | Todos os `<table>` | Verificar `<caption>`, `<th scope>` |
| 9 | `scripts/dev/qa_ui_redesign.ps1` | CRIAR — QA script final |

### Riscos e Mitigacao

| Risco | Probabilidade | Mitigacao |
|-------|--------------|-----------|
| Animacoes afetam perf | Baixa | Usar `will-change` seletivamente; respeitar reduced-motion |
| Regressoes sutis | Media | QA script automatizado + checklist manual |

### DoD

| # | Criterio | Evidencia |
|---|----------|-----------|
| 1 | Score ponderado >= 4.5 | Re-auditoria |
| 2 | Zero warnings no build | exit 0 + 0 warnings |
| 3 | Todas as 16 rotas verificadas | Checklist completo |
| 4 | a11y: tab navigation funciona em todas as pages | Verificacao manual |
| 5 | `prefers-reduced-motion` desabilita animacoes | Verificacao |
| 6 | QA script passa com 100% | Script output |
| 7 | Bundle size < baseline + 20KB gzip | Medida pos-build |

---

## Dependencias entre Ondas

```
Onda 1 (cores + PageHeader)
    |
    v
Onda 2 (FilterBar + DataTable)  <-- pode rodar em paralelo com Sprint 6-8
    |
    v
Onda 3 (Calendar + responsive)
    |
    v
Onda 4 (consolidacao)
    |
    v
Onda 5 (polimento)
```

**Nota:** Sprint 6-8 (Historico/PDF/Multiarea) pode iniciar apos Onda 2 sem conflito, pois o redesign e incremental e nao altera logica de negocio.

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026*
