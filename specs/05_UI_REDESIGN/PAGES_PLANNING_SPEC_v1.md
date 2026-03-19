# Pages Planning Spec v1 — Especificacao por Pagina

**Data:** 2026-02-06  
**Versao:** v1  
**Escopo:** 16 rotas do modulo Planejamento + /reports

---

## Inventario de Rotas

| # | Rota | Arquivo | Onda | PageHeader | Breadcrumbs | Status |
|---|------|---------|------|-----------|------------|--------|
| 1 | `/planning` | PlanningHomePage.tsx | 1 | OK | OK | **DONE (W1)** |
| 2 | `/planning/dashboard` | PlanningDashboardPage.tsx | 1 | OK | OK | **DONE (W1)** |
| 3 | `/planning/kanban` | PlanningKanbanPage.tsx | 4 | - | - | Planned |
| 4 | `/planning/timeline` | PlanningTimelinePage.tsx | 4 | - | - | Planned |
| 5 | `/planning/calendar` | PlanningCalendarPage.tsx | 1 | OK | OK | **DONE (W1)** |
| 6 | `/planning/actions/manage` | ActionsManagePage.tsx | 2 | - | - | Next (W2) |
| 7 | `/planning/actions/new` | ActionsNewPage.tsx | 2 | - | - | Next (W2) |
| 8 | `/planning/actions/templates` | ActionsTemplatesPage.tsx | 4 | - | - | Planned |
| 9 | `/planning/actions/approvals` | ActionsApprovalsPage.tsx | 2 | - | - | Next (W2) |
| 10 | `/planning/actions/evidences` | ActionsEvidencesPage.tsx | 2 | - | - | Next (W2) |
| 11 | `/planning/:areaSlug/dashboard` | PlanningAreaDashboardPage.tsx | 1 | OK | OK | **DONE (W1)** |
| 12 | `/planning/:areaSlug/kanban` | PlanningAreaKanbanPage.tsx | 4 | - | - | Planned |
| 13 | `/planning/:areaSlug/calendar` | PlanningAreaCalendarPage.tsx | 3 | - | - | Planned |
| 14 | `/planning/:areaSlug/timeline` | PlanningAreaTimelinePage.tsx | 4 | - | - | Planned |
| 15 | `/planning/:areaSlug/pe-2026` | PlanningAreaStrategicPackPage.tsx | 4 | - | - | Planned |
| 16 | `/reports` | ReportsPage.tsx | 1 | OK | OK | **DONE (W1 + Sprint5)** |

---

## Page 1: `/planning` — Home (Selecao de Area)

### 1) Objetivo
Porta de entrada do modulo Planejamento. Permite selecionar a area de trabalho.

### 2) Funcoes do usuario
- **Selecionar area** — Clicar no card da area para navegar ao dashboard
- **Continuar ultima area** — Botao baseado em localStorage
- **Trocar area** — Voltar e selecionar outra

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento                              |
|   H1: Planejamento                                       |
|   Subtitle: Selecione a area de trabalho                 |
+----------------------------------------------------------+
| [Continue Banner] (se lastArea)                          |
|   "Continuar em RH — 72% concluido"        [Continuar >]|
+----------------------------------------------------------+
| [Area Cards Grid] (lg:3cols, md:2cols, 1col)             |
|   +----------+  +----------+  +----------+               |
|   | RH       |  | TI       |  | MKT      |              |
|   | 42 acoes |  | — acoes  |  | — acoes  |              |
|   | [===72%] |  | [---0%]  |  | [---0%]  |              |
|   +----------+  +----------+  +----------+               |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader` (NOVO), `Card` (ajustado tokens), `Progress` (inline), `Button`, `Badge`

### 5) Estados
| Estado | Comportamento |
|--------|---------------|
| Loading | Skeleton cards (3 placeholders) |
| Empty | EmptyState: "Nenhuma area cadastrada" |
| Dados | Grid de cards com info inline |
| RH-only | Apenas RH ativo; demais `opacity-50` + tooltip "Em breve" |

### 6) Acessibilidade
- Cards: `role="link"` ou `<a>` semantico, `tabIndex={0}`, focus ring
- `aria-label="Selecionar area RH"`

### 7) Metricas UX
- Tempo para acao: < 2s | Clareza: Alta | Densidade: Baixa

---

## Page 2: `/planning/dashboard` — Dashboard Consolidado

### 1) Objetivo
Visao agregada de todas as areas com KPIs, progresso e alertas.

### 2) Funcoes do usuario
- **Ver KPIs** — 4 stat cards (total, concluidas, em andamento, atrasadas)
- **Ver progresso por area** — Tabela com barras
- **Navegar para area** — Clicar para ir ao dashboard especifico
- **Ver alertas** — Acoes atrasadas ou bloqueadas
- **Exportar** — PDF / CSV

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > Dashboard                  |
|   H1: Dashboard Consolidado        [Export PDF | CSV]    |
+----------------------------------------------------------+
| [StatCards 4x] (md:4cols, sm:2cols)                      |
+----------------------------------------------------------+
| [Progresso por Area] (DataTable)                         |
+----------------------------------------------------------+
| [Alertas] (cards de acoes atrasadas/bloqueadas)          |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader` (NOVO), `StatCard`, `DataTable` (NOVO), `ExportButtons`, `Badge`, `Card`

### 5) Estados
| Estado | Comportamento |
|--------|---------------|
| Loading | Skeleton: 4 stat cards + table |
| Empty | EmptyState: "Nenhum plano criado" + CTA |
| Error | ErrorState com retry |
| Dados | KPIs + tabela + alertas |

### 6) Acessibilidade
- Stats: `role="status"` com `aria-label`
- Tabela: `<table>` semantico com `<caption>`
- Links: `<a>` com texto descritivo

### 7) Metricas UX
- Tempo para acao: < 3s | Clareza: Alta | Densidade: Media-alta

---

## Pages 3-4: `/planning/kanban` e `/planning/timeline` — Wrappers

### 1) Objetivo
Views alternativas (Kanban/Timeline) do mesmo dataset de acoes.

### 2-3) Layout proposto (pos-Onda 4: consolidacao com tabs)
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > Kanban                     |
|   H1: Plano de Acao                                      |
+----------------------------------------------------------+
| [ViewTabs: Lista | Kanban | Timeline | Calendario]       |
+----------------------------------------------------------+
| [FilterBar] + [Content area]                             |
+----------------------------------------------------------+
```

> **Onda 4:** Consolidar 4 thin-wrapper pages em uma unica page com ViewTabs.

### 4) Componentes
`PageHeader`, `FilterBar`, `ViewTabs` (NOVOS); Kanban board / Timeline (existentes)

### 5-7) Estados/A11y/Metricas
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected`, Arrow Left/Right
- Delegados ao componente interno

---

## Page 5: `/planning/calendar` — Calendario Mensal

### 1) Objetivo
Visualizacao de prazos em formato calendario mensal.

### 2) Funcoes do usuario
- **Navegar meses** — Anterior/proximo
- **Ver eventos** — Acoes com due_date
- **Filtrar** — Por area, status
- **Clicar evento** — Abrir detalhe

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > Calendario                 |
|   H1: Calendario de Prazos                               |
+----------------------------------------------------------+
| [MonthNav: < Janeiro 2026 >] [FilterBar: Area | Status] |
+----------------------------------------------------------+
| [Calendar Grid 7x5]                                     |
|   Dom | Seg | Ter | ... | Sab                            |
|   ... | [2 acoes] | ... | [1 acao] | ...                 |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader`, `FilterBar` (NOVOS), Calendar grid (existente — AJUSTAR cores para tokens), `Badge`

### 5) Estados
| Estado | Comportamento |
|--------|---------------|
| Loading | Skeleton calendar grid |
| Empty month | "Sem prazos neste mes" |
| Dados | Grid com eventos coloridos por status token |

### 6) Acessibilidade
- Grid: `role="grid"`, `aria-label="Calendario Janeiro 2026"`
- Celulas: `role="gridcell"`, `aria-label="15 janeiro, 2 acoes"`
- Arrow keys entre celulas

### 7) Metricas UX
- Tempo para acao: < 5s | Clareza: Media | Densidade: Media

---

## Page 6: `/planning/actions/manage` — Gerenciar Acoes

### 1) Objetivo
Lista completa de acoes com busca, filtros, ordenacao e export.

### 2) Funcoes do usuario
- Buscar, filtrar (status/prioridade/programa), ordenar, exportar, abrir detalhe

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > Plano de Acao > Gerenciar  |
|   H1: Gerenciar Acoes              [Export PDF | CSV]    |
+----------------------------------------------------------+
| [FilterBar: Area | Pack | Status | Prioridade | Busca]  |
+----------------------------------------------------------+
| [DataTable] paginada (10/page)                           |
|   ID | Titulo | Status | Prior | Progresso | Prazo | Resp|
|   < 1 2 3 4 5 >                      42 acoes           |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader`, `FilterBar`, `DataTable` (NOVOS), `ExportButtons`, `Badge`, `Progress`, `Pagination`

### 5) Estados
| Estado | Comportamento |
|--------|---------------|
| Loading | Skeleton table (5 rows) |
| Empty | EmptyState: "Nenhuma acao encontrada" |
| Empty (filtro) | "Nenhuma acao corresponde" + [Limpar filtros] |
| Dados | DataTable paginada |

### 6) Acessibilidade
- `<table>` semantico, `<caption>`, `aria-sort` em headers
- Search: `<input type="search">` com `aria-label`
- Pagination: `<nav aria-label="Paginacao">`

### 7) Metricas UX
- Tempo para acao: < 5s | Clareza: Alta | Densidade: Alta

---

## Page 7: `/planning/actions/new` — Criar Acao

### 1) Objetivo
Formulario de criacao de nova acao.

### 2) Funcoes
- Preencher (titulo, descricao, responsavel, prazo, prioridade, programa)
- Salvar / Cancelar

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > Plano de Acao > Criar Novo |
|   H1: Nova Acao                                          |
+----------------------------------------------------------+
| [Form Card]                                              |
|   Titulo*: [___]  Descricao: [___]                       |
|   Pack*: [select]  Programa: [select]                    |
|   Responsavel: [___]  Prioridade: [P0|P1|P2]            |
|   Data inicio: [__]  Prazo: [__]                         |
|                              [Cancelar] [Criar Acao]     |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader`, `Card`, `Input`/`Select` (tokens), `Button`, `Toast`

### 5) Estados
Default → Validating → Submitting → Success (toast+redirect) / Error (toast)

### 6) Acessibilidade
- `<label>` com `htmlFor`, `aria-required`, `aria-describedby` para erros
- Tab order logico

### 7) Metricas UX
- Tempo para acao: < 30s | Clareza: Alta | Densidade: Baixa

---

## Page 8: `/planning/actions/templates` — Templates

Pagina thin-wrapper. **Onda 4:** consolidar com tabs no Plano de Acao.

---

## Page 9: `/planning/actions/approvals` — Aprovacoes

### 1) Objetivo
Fila de itens pendentes de aprovacao.

### 2) Funcoes
- Ver pendencias, aprovar (com comentario), rejeitar (motivo obrigatorio), filtrar

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   H1: Aprovacoes Pendentes          [Badge: 3 pendentes]|
+----------------------------------------------------------+
| [FilterBar: Tipo | Area]                                 |
+----------------------------------------------------------+
| [Approval Cards]                                         |
|   | [Badge] RH-DES-01 — Upload contrato                  |
|   | Enviado por: Ana — 2026-01-15   [Rejeitar] [Aprovar] |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader`, `FilterBar`, `Card`, `Badge`, `Button` (success/danger), `Modal`, `Toast`

### 5) Estados
Loading → Empty ("Nenhuma pendencia") → Dados → Approving (button loading) → Success (toast + remove)

### 6) Acessibilidade
- Cards: `role="article"`, botoes com `aria-label` descritivo
- Modal: focus trap, Escape fecha

### 7) Metricas UX
- Tempo para acao: < 10s por aprovacao | Clareza: Alta | Densidade: Media

---

## Page 10: `/planning/actions/evidences` — Evidencias

### 1) Objetivo
Backlog de evidencias pendentes de envio ou validacao.

### 2) Funcoes
- Ver pendencias, upload (drag-drop), validar

### 3) Layout
Similar a Aprovacoes com tabs (Pendentes | Enviadas | Validadas) + upload area.

### 4-7) Similar a Page 9 (Aprovacoes)

---

## Page 11: `/planning/:areaSlug/dashboard` — Dashboard da Area

### 1) Objetivo
Dashboard especifico da area selecionada com KPIs e progresso.

### 2) Funcoes
- Ver KPIs, acoes recentes, quick links (Kanban, Calendar, PE-2026), progresso por programa

### 3) Layout proposto
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > RH > Dashboard             |
|   H1: Area RH — Dashboard     [Badge: pack-rh-2026]     |
+----------------------------------------------------------+
| [AreaSubnav: Dashboard | Kanban | Calendar | Timeline | PE-2026] |
+----------------------------------------------------------+
| [StatCards 4x]                                           |
+----------------------------------------------------------+
| [Quick Links Grid 4x] Kanban | Timeline | Evidencias | PE|
+----------------------------------------------------------+
| [Progresso por Programa] (barras)                        |
+----------------------------------------------------------+
```

### 4) Componentes
`PageHeader` (NOVO), `AreaSubnav` (AJUSTAR tokens), `StatCard`, `Card`, `Progress`

### 5) Estados
Loading → Area nao encontrada → Sem pack → Dados

### 6) Acessibilidade
- Subnav: `<nav aria-label="Navegacao da area">`
- Stats: `role="status"`

### 7) Metricas UX
- Tempo: < 3s | Clareza: Alta | Densidade: Media

---

## Pages 12-14: Area Kanban/Calendar/Timeline

Views alternativas scoped para a area. Mesmo pattern das Pages 3-5 mas com AreaSubnav.
**Onda 4:** Consolidar com ViewTabs dentro do dashboard da area.

---

## Page 15: `/planning/:areaSlug/pe-2026` — Strategic Pack

### 1) Objetivo
Visualizacao e edicao do pacote estrategico da area.

### 2) Funcoes
- Ver secoes (Diagnostico, Objetivos, KPIs, Programas, Governanca, Anexos)
- Editar conteudo markdown e dados estruturados
- Gerar plano de acao
- Comentar, anexar, ver changelog

### 3) Layout
```
+----------------------------------------------------------+
| [PageHeader]                                             |
|   Breadcrumbs: Planejamento > RH > PE-2026               |
|   H1: Strategic Pack — RH 2026                           |
+----------------------------------------------------------+
| [AreaSubnav]                                             |
+----------------------------------------------------------+
| [PackHeader] Status, datas, autor                        |
+----------------------------------------------------------+
| [PackTabs: 6 secoes]                                     |
+----------------------------------------------------------+
| [SectionContent] (markdown + structured data)            |
+----------------------------------------------------------+
```

### 4-7) Componentes/Estados/A11y/Metricas
- Ja bem estruturado; ajustar cores para tokens na Onda 4
- Tabs: `role="tablist"` semantico

---

## Page 16: `/reports` — Hub de Relatorios (DONE Sprint 5 + Wave1)

### Status: DONE (Sprint 5 P0+P1 + Wave1 PageHeader/Breadcrumbs)

### Funcionalidades entregues (Sprint 5)
- 3 relatorios: Executivo, Acoes por Pack, Progresso Geral
- Pack selector real (dropdown por area)
- Date range picker (inputs date, default 2026)
- Chart.js interativo (barras + doughnut)
- Export PDF melhorado (cabecalho + filtros + tabelas)
- Export CSV
- Toast feedback (sucesso/erro)

### Integracao com redesign (Wave1 DONE)
- PageHeader com breadcrumbs: **DONE**
- Ja usa `@/shared/ui/icons` (migrado na Sprint 5)
- Ja usa tokens semanticos em filtros e tabs

### Pendencias P2 (Sprint 6+)
- PDF com charts embarcados (html2canvas)
- Date picker avancado (calendario popup em vez de input date)
- Comparativo temporal (line charts)
- DataTable no PackActionsReport (Wave2)

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026*
