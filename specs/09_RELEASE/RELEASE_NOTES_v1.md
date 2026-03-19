# Release Notes — PE-2026 v1.0.6

**Data:** 2026-02-09  
**Versao:** 1.0.6  
**Repositorio:** B:\PE_2026  
**Build:** `tsc -b && vite build` — exit 0

---

## Overview

PE-2026 e o Sistema de Planejamento Estrategico corporativo. Versao 1.0.6 consolida 8 sprints de plataforma + 5 ondas de UI Redesign, entregando:

- Modulo Planning completo (Dashboard, Kanban, Timeline, Calendar, Acoes)
- Strategic Pack por area (CRUD, secoes estruturadas, geracao de plano)
- Relatorios com export PDF/CSV e charts interativos
- Fechamentos mensais com comparativos e auditoria
- PDF institucional reutilizavel com chart embed pipeline
- Multi-area (RH, Marketing, Operacoes, TI, Financeiro) com RBAC
- Design System com tokens semanticos, dark mode, e 90% de reducao de raw colors

---

## Destaques

1. **Multi-area completo** — 5 areas com 147 acoes, packs estrategicos, closings e navegacao dinamica
2. **RBAC** — Role-area access matrix, feature-level permissions, flag `MULTIAREA_ENABLED` para modo RH-only
3. **PDF Institucional** — Template reutilizavel com header/footer, chart capture pipeline, fallback robusto
4. **UI Redesign** — Raw colors de 889 para 88 (-90%), a11y 9/10, componentes FilterBar + DataTable
5. **Relatorios** — 3 reports (Executivo, Acoes, Progresso) com Chart.js, filtros avancados, export PDF/CSV

---

## Linha do Tempo

| Ciclo | Data | Entregas | QA |
|-------|------|----------|----|
| Sprint 1 | 2026-02-04 | Estabilizacao Planning, componentes base, dark mode, sidebar + routing | QA_01, QA_03 |
| Sprint 2 | 2026-02-05 | Strategic Pack CRUD, Structured Data, vinculo acoes, area-first nav | QA_02, QA_04 |
| Sprint 3 | 2026-02-06 | E2E RH (42 acoes), subtasks, comments, history, error/loading states | QA_05 |
| Audit P0 | 2026-02-06 | RBAC + UI + RH-only audit | REPORT_08 |
| Sprint 4 | 2026-02-06 | Governanca, fechamento, dados reais seed, approval workflow | QA_09 |
| Sprint 5 P0 | 2026-02-06 | 3 relatorios MVP, filtros basicos, export PDF/CSV | QA_07 (8/8) |
| Sprint 5 P1 | 2026-02-06 | Pack selector, date range, Chart.js, PDF melhorado, icon hardening | QA_08 (8/8) |
| Wave 1 (R1) | 2026-02-08 | Cores + PageHeader + Breadcrumbs (889 -> 852, -4.2%) | GATE W1 |
| Wave 2 (R2) | 2026-02-08 | FilterBar + DataTable + raw colors (852 -> 759, -10.9%) | OUTPUT W2 |
| Wave 3 (R3) | 2026-02-08 | Calendar tokens + responsive + thin wrapper (759 -> 553, -27.1%) | OUTPUT W3 |
| Wave 4 (R4) | 2026-02-08 | Consolidacao wrappers + ataque guiado (553 -> 277, -49.9%) | OUTPUT W4 |
| Wave 5 (R5) | 2026-02-08 | Polimento final + a11y (277 -> 88, -68.2%) | OUTPUT W5 |
| Sprint 6 | 2026-02-09 | Closings module (snapshots, historico, auditoria, comparativos, CSV) | OUTPUT S6 (10/10) |
| Sprint 7 | 2026-02-09 | PDF institucional (template, chart capture, 3 exports, fallback) | OUTPUT S7 (15/15) |
| Sprint 8 | 2026-02-09 | Multi-area + RBAC (seeds, packs, closings, nav, rbac config) | OUTPUT S8 (35/35) |

---

## Features por Modulo

### Planning

- **Dashboard** — KPIs, distribuicao status, progresso por programa
- **Kanban** — Board com drag-and-drop por status
- **Timeline** — Gantt view com barras de progresso
- **Calendar** — Tokens-only, responsive (AgendaMode mobile), ARIA grid + keyboard
- **Acoes** — CRUD completo, subtasks, evidencias, comentarios, historico, riscos
- **Aprovacoes** — Workflow manager + direction com audit trail

### Reports

- **3 relatorios:** Executivo (8 KPIs), Acoes por Pack (busca + filtro), Progresso (por programa)
- **Filtros:** Area, Pack (dropdown real), Periodo (date range picker)
- **Charts:** Chart.js interativo (barras + doughnut), dark-mode friendly
- **Export:** PDF institucional (header + filtros + tabelas + charts) e CSV (UTF-8 BOM)
- **Toast:** Feedback ao exportar

### Closings

- **Snapshot creation** por periodo com captura de acoes/KPIs
- **Historico navegavel** com lista filtrada + detalhe paginado
- **Comparativos** entre 2 fechamentos com deltas KPIs e status
- **Trilha de auditoria** (5 tipos de evento: who/when/what)
- **Export:** CSV + PDF institucional
- **Seeds:** RH 3 periodos + MKT/OPS/FIN 2 periodos cada (idempotentes)

### PDF Institucional

- **Template reutilizavel** com header (titulo, area, pack, periodo, versao) e footer (pag X de Y)
- **Secoes padronizadas:** KPI grid, tabelas autoTable, blocos de texto, imagens de charts
- **Chart embed pipeline:** Chart.js canvas.toDataURL -> html2canvas fallback -> nota no PDF
- **3 exports:** Reports PDF, Closings PDF, Pack PDF
- **Fallback robusto:** Se chart falhar, PDF continua com nota explicativa

### Multi-area / RBAC

- **5 areas:** RH (59 acoes), Marketing (25), Operacoes (27), TI (15), Financeiro (21) = 147 total
- **4 packs estrategicos:** pack-rh-2026, pack-mkt-2026, pack-ops-2026, pack-fin-2026
- **RBAC config:** `src/shared/config/rbac.ts` com role-area matrix e feature permissions
- **Hook:** `useRBAC()` com `canAccess(area)` e `can(feature)`
- **Flag:** `MULTIAREA_ENABLED` (true = todas areas; false = RH-only)
- **Navegacao:** Secao "Planos por Area" dinamica no sidebar
- **IDs padronizados:** `AREA-PROG-NN` (ex: MKT-INB-01, OPS-RPA-01, FIN-AUT-01)

### Strategic Pack

- **CRUD completo** de packs por area
- **Secoes estruturadas:** overview, diagnosis, objectives, programs, governance, docs
- **Structured Data:** Objectives, KPIs, Programs, Governance (rituais)
- **Geracao de plano de acao** a partir do pack (idempotente)
- **Export PDF** institucional do pack

---

## Breaking Changes

Nenhuma breaking change nesta release. Todas as mudancas sao retrocompativeis.

---

## Migracoes Internas

| Migracao | Escopo | Evidencia |
|----------|--------|-----------|
| Icon hardening | 29 arquivos migrados de `lucide-react` para `@/shared/ui/icons` | Sprint 5 P1 |
| Raw colors -> tokens | 889 -> 88 ocorrencias (-90.1%) | Waves 1-5 |
| `text-gray-*` zerado | 498 -> 0 ocorrencias | Wave 5 |
| Calendar refactor | Raw colors -> tokens-only, responsive AgendaMode | Wave 3 |
| Thin wrappers | PlanningViewsShell consolidado | Waves 3-4 |
| Action IDs padronizados | `action-xxx-N` -> `AREA-PROG-NN` | Sprint 8 |
| Closings multiarea | Seeds idempotentes para 4 areas | Sprint 8 |

---

## Metricas

| Metrica | Valor |
|---------|-------|
| Raw colors (inicio) | 889 |
| Raw colors (final) | **88** (-90.1%) |
| text-gray-* | **0** (zerado) |
| Build time (ultimo) | ~6s |
| Modules | ~2118 |
| Erros TS | 0 |
| Warnings | 0 |
| Acoes mock total | 147 |
| Areas | 5 |
| Packs estrategicos | 4 |
| Closings seeds | 9 |
| A11y smoke | 9/10 PASS |
| QA scripts | 6+ automatizados |
| Gates aprovados | 10+ |

---

## Known Issues

| # | Issue | Severidade | Workaround | Referencia |
|---|-------|------------|------------|------------|
| K1 | A11y sr-only count = 1 (WARN no smoke) | Baixa | Button loading spinner tem sr-only; expandir para mais contextos e P2 | Wave 5 OUTPUT |
| K2 | bg-white remanescentes (22) | Info | Intencionais — opacidades decorativas em paineis branded (bg-white/10, bg-white/20) | Wave 5 OUTPUT |
| K3 | bg-gray remanescentes (3) | Info | Contextos muito especificos (ProgressReport, AreaPlansTimeline) | Wave 5 OUTPUT |
| K4 | TI sem pack estrategico | Info | Area TI tem 15 acoes mas sem pack; fora do escopo v1 | Sprint 8 OUTPUT |
| K5 | localStorage de closings pode ter dados stale | Baixa | Seeds usam idempotencia por ID; limpar localStorage resolve | Sprint 8 GATE |
| K6 | Porta preview variavel | Info | Porta default 4173 mas pode variar se ocupada (4174, 4175...) | Observado em preview |

---

## Artefatos e Evidencias

### Outputs

| Ciclo | Path |
|-------|------|
| Sprint 5 P0 | `specs/04_REPORTS/OUTPUT_SPRINT5_MVP_P0_20260206_1805.md` |
| Sprint 5 P1 | `specs/04_REPORTS/OUTPUT_SPRINT5_P1_20260206_1830.md` |
| Wave 1 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md` |
| Wave 2 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE2_FINAL_20260208_2211.md` |
| Wave 3 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE3_FINAL_20260208_2253.md` |
| Wave 4 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE4_20260208_2312.md` |
| Wave 5 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE5_20260208_2341.md` |
| Sprint 6 | `specs/06_CLOSINGS/OUTPUT_CLOSINGS_SPRINT6_20260209_0003.md` |
| Sprint 7 | `specs/07_PDF/OUTPUT_PDF_SPRINT7_20260209_0026.md` |
| Sprint 8 | `specs/08_MULTIAREA/OUTPUT_MULTIAREA_SPRINT8_20260209_0830.md` |

### QA Reports

| ID | Path |
|----|------|
| QA_01 | `specs/04_REPORTS/QA_01_STRATEGIC_PACK_SPRINT1.md` |
| QA_02 | `specs/04_REPORTS/QA_02_STRATEGIC_PACK_SPRINT2_BLOCO1.md` |
| QA_03 | `specs/04_REPORTS/QA_03_PLANNING_SPRINT1.md` |
| QA_04 | `specs/04_REPORTS/QA_04_PLANNING_SPRINT2_MVP_RH.md` |
| QA_05 | `specs/04_REPORTS/QA_05_E2E_RH_SPRINT3.md` |
| QA_07 | `specs/04_REPORTS/QA_07_REPORTS_SPRINT5_P0_20260206_1814.md` |
| QA_08 | `specs/04_REPORTS/QA_08_REPORTS_SPRINT5_P1_20260206_1838.md` |
| QA_09 | `specs/04_REPORTS/QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md` |
| QA S8 | `specs/08_MULTIAREA/QA_MULTIAREA_SPRINT8_20260209_0830.md` |

### Gates

| ID | Path |
|----|------|
| GATE_01 | `specs/02_GATES/GATE_01_STRATEGIC_PACK_MVP_RH.md` |
| GATE_02 | `specs/02_GATES/GATE_02_PLANNING_MODULE_SPRINT1.md` |
| GATE_03 | `specs/02_GATES/GATE_03_PLANNING_MODULE_SPRINT2_MVP_RH.md` |
| GATE_04 | `specs/02_GATES/GATE_04_E2E_RH_SPRINT3.md` |
| GATE_07 | `specs/02_GATES/GATE_07_AUDIT_PRODLOCAL_RBAC_UI_RH.md` |
| GATE_08 | `specs/02_GATES/GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md` |
| GATE_09 | `specs/02_GATES/GATE_09_REPORTS_SPRINT5.md` |
| GATE S8 | `specs/08_MULTIAREA/GATE_MULTIAREA_SPRINT8_20260209_0830.md` |

### Scripts QA

| Script | Path |
|--------|------|
| Reports P0 | `scripts/dev/qa_reports_sprint5_p0.ps1` |
| Multiarea S8 | `scripts/dev/qa_multiarea_sprint8.ps1` |
| Release Readiness | `scripts/dev/qa_release_readiness.ps1` |

---

## Roadmap Proximo (P1/P2)

| Pri | Item | Modulo | Esforco |
|-----|------|--------|---------|
| P1 | RBAC UI enforcement (ocultar botoes por role) | Multi-area | M |
| P1 | Area filter em Reports/Closings (dropdown) | Reports | S |
| P1 | TI pack estrategico | Multi-area | S |
| P1 | Mobile calendar agenda refinement | UI | S |
| P2 | XLSX nativo (em vez de CSV) | Reports | M |
| P2 | VirtualizedList para >100 acoes | Planning | M |
| P2 | sr-only coverage expansion | A11y | S |
| P2 | PDF TOC/cover/watermark | PDF | L |
| P2 | PDF compressao de imagens | PDF | M |
| P2 | Benchmark entre areas (analytics) | Analytics | L |

---

**Versao:** 1.0.6  
**Data:** 2026-02-09 08:44 UTC-3
