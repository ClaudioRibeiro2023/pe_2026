# TODO_06 - Reports Sprint 5

**Spec:** SPEC_03_PLANNING_REPORTS_SPRINT5  
**Data:** 2026-02-06  
**Status:** Backlog  

---

## WIP Limit: 2 tasks em andamento simultaneo

---

## Tasks

### P0 - MVP (obrigatorio para gate)

| # | Task | Deps | Status |
|---|------|------|--------|
| 1 | Criar `hooks.ts` com `useReportData` (agregar mockStore: areas, planos, acoes, progresso) | - | Backlog |
| 2 | Reescrever `ReportsPage.tsx` com hub de relatorios (cards + filtros area/pack/periodo) | 1 | Backlog |
| 3 | Criar componente `ExecutiveReport` (metricas por area + tabela status + grafico progresso) | 1 | Backlog |
| 4 | Criar componente `ActionsReport` (tabela de acoes por pack com indicador de atraso) | 1 | Backlog |
| 5 | Criar componente `ProgressReport` (cards metricas + bar chart comparativo por area) | 1 | Backlog |

### P1 - Exportacao

| # | Task | Deps | Status |
|---|------|------|--------|
| 6 | Integrar `ExportButtons` no ExecutiveReport (PDF + Excel) | 3 | Backlog |
| 7 | Integrar `ExportButtons` no ActionsReport (PDF + Excel) | 4 | Backlog |
| 8 | Integrar `ExportButtons` no ProgressReport (PDF + Excel) | 5 | Backlog |

### P2 - Refinamentos

| # | Task | Deps | Status |
|---|------|------|--------|
| 9 | Criar componente `EvidencesPendingReport` (backlog evidencias por area/responsavel) | 1 | Backlog |
| 10 | Implementar historico de fechamentos mensais (snapshot) | 1 | Backlog |
| 11 | Adicionar testes de regressao (navegar Planejamento/RH sem erros) | 5 | Backlog |

---

## Sequencia Recomendada

```
1 (hook) -> 2 (hub) -> 3 (executivo) -> 4 (acoes) -> 5 (progresso)
                        -> 6 (export)    -> 7 (export) -> 8 (export)
                                                         -> 9 (evidencias)
                                                         -> 10 (historico)
                                                         -> 11 (regressao)
```

**MVP = tasks 1-5** (minimo para gate)  
**Completo = tasks 1-8** (recomendado)  
**Full = tasks 1-11** (ideal)

---

## Definition of Done (DoD)

- [ ] Hook `useReportData` retorna dados agregados corretos
- [ ] Hub exibe >= 3 cards de relatorio
- [ ] Filtro por area funciona corretamente
- [ ] Cada relatorio mostra dados consistentes com mockStore
- [ ] Acoes atrasadas tem indicador visual
- [ ] Export PDF gera arquivo valido
- [ ] Export Excel gera CSV com dados corretos
- [ ] Build passa sem erros (`npm run build` exit 0)
- [ ] Preview funcional em localhost
- [ ] Nenhuma regressao em /planning e /planning/rh
