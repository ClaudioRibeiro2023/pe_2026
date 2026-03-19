# STATUS — UI Redesign PE_2026

**Ultima atualizacao:** 2026-02-08 19:35 (UTC-03:00)

---

## Sprint 5 Reports: DONE

- P0 (MVP): 3 relatorios, filtros, export PDF/CSV — **8/8 PASSA**
- P1 (Hardening): Pack selector, date range, Chart.js, PDF melhorado, toast, icon hardening — **8/8 PASSA**
- Evidencias: `specs/04_REPORTS/OUTPUT_SPRINT5_P1_20260206_1830.md`

---

## Wave 1 (R1): DONE / PASSA

| Metrica | Valor |
|---------|-------|
| Raw colors baseline | 889 |
| Raw colors after | 852 |
| Delta | **-37 (-4.2%)** |
| PageHeader aplicado | 5/5 |
| Breadcrumbs aplicado | 5/5 |
| Componentes shared migrados | 4 (Card, Input, Progress, Tooltip) |
| Componentes novos | 2 (Breadcrumbs, PageHeader) |
| Build | **OK (exit 0, 12.91s)** |
| Guardrail | Modo nao-regressao (falha esperada por legado — 852 usos restantes fora do escopo Wave1) |

### Evidencias Wave 1

| Documento | Path |
|-----------|------|
| Baseline metrics | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1539.md` |
| Post-migration metrics | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1801.md` |
| QA Report | `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md` |
| OUTPUT consolidado | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md` |
| GATE Result | `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md` |

---

## Wave 2 (R2): NEXT

### Entregas P0

| # | Entrega | Descricao |
|---|---------|-----------|
| 1 | FilterBar.tsx | Componente reutilizavel de filtros (area, pack, status, periodo) |
| 2 | DataTable.tsx | Tabela com sort, paginacao, export integrado |
| 3 | Heatmap de raw colors | Identificar top-10 arquivos com mais raw colors para migracao direcionada |
| 4 | Aplicar FilterBar + DataTable em `/planning/dashboard` | Dashboard consolidado |
| 5 | Aplicar FilterBar + DataTable em `/planning/actions/manage` | Gerenciar acoes (42+ items) |
| 6 | Aplicar DataTable em `/reports` (PackActionsReport) | Migrar tabela para DataTable |

### Meta numerica

- **Raw colors target: <= 760** (reducao de ~92 usos adicionais, -10.8% do after)
- **Paginas com FilterBar: >= 3**
- **Paginas com DataTable: >= 3**
- **Build: OK (exit 0)**

### Entregas P1

| # | Entrega |
|---|---------|
| 1 | Toast em CRUD de acoes (criar/editar/deletar) |
| 2 | Metricas inline no AreaSelector (num acoes, % progresso) |
| 3 | Paginacao na lista de acoes (10 items/page) |
| 4 | Migrar cores em Button, Badge, Modal, Table, Pagination, EmptyState, ErrorState, StatCard, Skeleton, Loader, Logo |

---

## Top 10 Pendencias (priorizadas)

| # | Item | Prioridade | Wave |
|---|------|-----------|------|
| 1 | Criar FilterBar reutilizavel | P0 | W2 |
| 2 | Criar DataTable (sort + pagination + export) | P0 | W2 |
| 3 | Heatmap raw colors — top-10 arquivos | P0 | W2 |
| 4 | Aplicar FilterBar + DataTable no Dashboard | P0 | W2 |
| 5 | Aplicar FilterBar + DataTable em Gerenciar Acoes | P0 | W2 |
| 6 | Toast em CRUD de acoes | P1 | W2 |
| 7 | Migrar cores em Button, Badge, Modal, Table, etc. | P1 | W2 |
| 8 | PDF com charts embarcados (html2canvas) | P2 | Sprint 6 |
| 9 | Date picker avancado (calendario popup) | P2 | Sprint 6 |
| 10 | Calendario: responsividade mobile + keyboard nav | P1 | W3 |

---

*Atualizado automaticamente — PE_2026*
