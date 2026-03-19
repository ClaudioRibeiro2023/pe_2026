# Bluepoints — Roadmap PE_2026

**Ultima atualizacao:** 2026-02-08  
**Mantido por:** Time PE_2026

---

## Legenda

| Simbolo | Significado |
|---------|------------|
| Done | Concluido e aprovado |
| Active | Em andamento |
| Next | Proximo na fila |
| Planned | Planejado, nao iniciado |
| Parallel | Pode rodar em paralelo |

---

## Trilha 1: Plataforma Base + Planning

### Sprint 1 — Estabilizacao (Done)
- Modulo Planning estavel
- Componentes base (Card, Button, Badge, Input, Select, Modal, Toast)
- Dark mode (tokens.css)
- Sidebar + routing

### Sprint 2 — MVP RH (Done)
- Strategic Pack CRUD (secoes, comentarios, anexos)
- Structured Data (Objectives, KPIs, Programs, Governance)
- Vinculo com Acoes (pack_id, program_key)
- Gerar Plano de Acao (idempotente)
- Area-first navigation

### Sprint 3 — E2E RH + Hardening (Done)
- Flow completo RH: Pack → Acoes → Evidencias → Aprovacao
- 42 acoes mock (RH-XXX-NN)
- Subtasks, Comments, History
- Error/Loading/Empty states

### Sprint 4 — Governanca + Fechamento + Dados (Done)
- Rituais de governanca (reunioes, atas, decisoes)
- Fechamento mensal (report, export)
- Dados reais seed (002_seed_data.sql)
- RBAC (admin, direcao, gestor, operacional)
- Approval workflow (manager + direction)

### Sprint 5 — Relatorios + Exportacoes (Done)
- **P0 (MVP):**
  - 3 relatorios: Executivo, Acoes por Pack, Progresso Geral
  - Filtros basicos (area, pack, periodo fixo 2026)
  - Export PDF (jsPDF + autoTable) e CSV
  - QA script + output validado
- **P1 (Hardening):**
  - Pack selector real (dropdown por area)
  - Date range picker (inputs date)
  - Chart.js interativo (barras + doughnut)
  - Export PDF melhorado (cabecalho + filtros + tabelas)
  - Toast feedback ao exportar
  - Icon hardening (29 arquivos migrados, 0 warnings)
  - QA: 8/8 PASSA

---

## Trilha 2: UI Redesign (R0–R5)

### R0 — Blueprint v1 (Done)
- UI Visual Audit (specs/05_UI_AUDIT/)
- Blueprint completo (specs/05_UI_REDESIGN/)
  - SPEC_04: Visao, scorecard, principios, guardrails
  - DESIGN_SYSTEM_v1: Tokens, componentes, responsive
  - PAGES_PLANNING_SPEC_v1: 16 rotas especificadas
  - MEGAPLAN_v1: 5 ondas de execucao
  - QA_v1: Heuristicas, checklists, scripts lint
  - GATE_v1: Criterios PASSA/FALHA

### R1 — Onda 1: Cores + PageHeader + Breadcrumbs (Done)
- **PASSA** — build OK (exit 0, 12.91s)
- Raw colors: 889 → 852 (**-37, -4.2%**)
- PageHeader + Breadcrumbs: **5/5 pages**
- Componentes migrados: Card, Input, Progress, Tooltip
- Componentes novos: Breadcrumbs.tsx, PageHeader.tsx
- Scripts: baseline count, guardrail (nao-regressao), QA
- Evidencias: `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md`

### R2 — Onda 2: FilterBar + DataTable + Reducao Raw Colors (Next)
- Criar FilterBar reutilizavel
- Criar DataTable (sort + pagination + export)
- Aplicar em Dashboard, Gerenciar Acoes, Reports
- Heatmap raw colors (top-10 arquivos)
- **Meta: raw colors <= 760** (-10.8% do pos-W1)
- Toast em CRUD (criar/editar/deletar acoes)
- Metricas inline no AreaSelector

### R3 — Onda 3: Calendar + Responsive (Planned)
- Calendario: cores inline → tokens de status
- Responsividade: tabelas com scroll horizontal
- Breakpoints 375px/768px/1280px testados

### R4 — Onda 4: Consolidacao (Planned)
- Consolidar thin-wrapper pages com ViewTabs
- Strategic Pack: migrar cores → tokens
- Rotas antigas como redirects

### R5 — Onda 5: Polimento (Planned)
- Microinteracoes (hover, press, transitions)
- Acessibilidade (ARIA, keyboard, contraste)
- Performance (bundle size, re-renders)
- QA final + Gate report
- Score target: >= 4.5

---

## Trilha 3: Features Avancadas (Sprint 6–8) — Parallel apos R2

### Sprint 6 — Historico + PDF Avancado (Planned)
- Historico de fechamentos mensais
- PDF com graficos (html2canvas)
- Comparativo temporal (line charts)
- **Pre-requisito:** Onda 2 concluida (DataTable disponivel)

### Sprint 7 — Multiarea (Planned)
- Expansao para Marketing, TI, Financeiro, Operacoes
- Pack por area com dados reais
- Dashboard multiarea
- **Pre-requisito:** Onda 3 concluida (responsive)

### Sprint 8 — Inteligencia + Analytics (Planned)
- Scoreboard funcional
- Insights automaticos
- Data Health dashboard
- Benchmark entre areas
- **Pre-requisito:** Sprint 7 (dados multiarea)

---

## Diagrama de Dependencias

```
Sprint 1-5 (Done)
    |
    +---> R0 Blueprint (Done)
    |         |
    |         +---> R1 Cores+PageHeader (Done)
    |                   |
    |                   +---> R2 FilterBar+DataTable (Next)
    |                             |
    |                   +---------+----------+
    |                   |                    |
    |                   v                    v
    |              R3 Calendar         Sprint 6 (Parallel)
    |                   |                    |
    |                   v                    v
    |              R4 Consolidacao      Sprint 7 Multiarea
    |                   |                    |
    |                   v                    v
    |              R5 Polimento        Sprint 8 Analytics
    |
    +---> (plataforma estavel para ambas trilhas)
```

---

## Metricas de Progresso

| Trilha | Total Items | Done | % |
|--------|------------|------|---|
| Trilha 1 (Planning) | 5 sprints | 5 | 100% |
| Trilha 2 (Redesign) | 6 fases (R0-R5) | 2 (R0+R1) | 33% |
| Trilha 3 (Features) | 3 sprints | 0 | 0% |

---

*Atualizado em 2026-02-08 — PE_2026*
