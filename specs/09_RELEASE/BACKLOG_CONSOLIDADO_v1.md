# Backlog Consolidado P1/P2 — PE-2026 v1.0.6

**Data:** 2026-02-09  
**Versao:** 1.0.6  
**Fonte:** Outputs de Sprints 1-8, Waves 1-5, QA reports, GATE reports

---

## 1. Backlog por Modulo e Prioridade

### 1.1 UI Redesign

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| UI-01 | sr-only coverage expansion (a11y 1/10 WARN) | P2 | S | Baixo | Wave 5 OUTPUT — sr-only count=1 | Pendente |
| UI-02 | bg-white remanescentes (22 ocorrencias) | P2 | S | Nenhum | Intencionais — opacidades decorativas | Aceito como design |
| UI-03 | bg-gray remanescentes (3 ocorrencias) | P2 | S | Nenhum | ProgressReport, AreaPlansTimeline | Aceito |
| UI-04 | border-gray remanescentes (3 ocorrencias) | P2 | S | Nenhum | AreaPlansTimeline, ContextManagerPage | Aceito |
| UI-05 | Mobile tables overflow-x validation | P1 | S | Baixo | Regression Matrix M3/M4 — a validar | Pendente |
| UI-06 | Microinteracoes (hover, press, transitions) | P2 | M | Nenhum | Bluepoints R5 — planejado | Pendente |

### 1.2 Reports

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| REP-01 | XLSX nativo (em vez de CSV) | P2 | M | Baixo | Sprint 5 P0 decisao P1 -> adiado para P2 | Pendente |
| REP-02 | VirtualizedList para >100 acoes | P2 | M | Medio | Sprint 5 P0 — sem paginacao para listas grandes | Pendente |
| REP-03 | Area filter dropdown em Reports | P1 | S | Baixo | Sprint 8 OUTPUT — pendencia RBAC | Pendente |
| REP-04 | Charts no PDF — confirmacao Sprint 7 | P0 | - | - | Sprint 7 OUTPUT: 15/15 PASS, chart pipeline funcional | **Resolvido** |

### 1.3 PDF Institucional

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| PDF-01 | TOC (Table of Contents) no PDF | P2 | L | Medio | Nao implementado — feature avancada | Pendente |
| PDF-02 | Cover page (capa institucional) | P2 | M | Baixo | Nao implementado | Pendente |
| PDF-03 | Watermark (rascunho/confidencial) | P2 | S | Nenhum | Nao implementado | Pendente |
| PDF-04 | Compressao de imagens no PDF | P2 | M | Baixo | Charts como PNG 0.92 quality — pode otimizar | Pendente |
| PDF-05 | Landscape mode para tabelas largas | P2 | M | Baixo | autoTable com linebreak — funcional mas pode melhorar | Pendente |

### 1.4 Closings

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| CLO-01 | Charts interativos no detalhe do closing | P1 | M | Baixo | Barras CSS puras no detalhe — Chart.js melhoraria UX | Pendente |
| CLO-02 | localStorage dados stale | P1 | S | Medio | Sprint 8 GATE — seeds idempotentes mitigam | Mitigado |
| CLO-03 | Area filter dropdown em Closings | P1 | S | Baixo | Sprint 8 OUTPUT — pendencia | Pendente |
| CLO-04 | Comparativo temporal (line charts) | P2 | L | Medio | Bluepoints Sprint 6 — planejado | Pendente |
| CLO-05 | Persist closing edits (notas, status) | P2 | M | Baixo | Atualmente em memoria/localStorage | Pendente |

### 1.5 Multi-area / RBAC

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| MA-01 | RBAC UI enforcement (ocultar botoes por role) | P1 | M | Medio | useRBAC hook criado mas nao integrado nos componentes | Pendente |
| MA-02 | TI pack estrategico | P1 | S | Baixo | TI tem 15 acoes mas sem pack | Pendente |
| MA-03 | Area-specific mensagens/labels | P2 | S | Nenhum | Todos os labels sao genericos | Pendente |
| MA-04 | Role-based route guards | P1 | M | Medio | Rotas nao verificam role no router | Pendente |
| MA-05 | User area_id enforcement | P2 | M | Medio | area_id no UserProfile existe mas nao e usado para filtrar | Pendente |
| MA-06 | Benchmark entre areas (analytics) | P2 | L | Baixo | Bluepoints Sprint 8 — planejado | Pendente |

### 1.6 Planning

| # | Item | Pri | Esforco | Risco | Evidencia | Status |
|---|------|-----|---------|-------|-----------|--------|
| PLA-01 | Breadcrumbs em P1 (Sprint 5 pendencia) | P0 | - | - | Implementado em Wave 1 | **Resolvido** |
| PLA-02 | Drag-and-drop no Kanban | P2 | L | Medio | Indicadores visiveis, DnD real nao implementado | Pendente |
| PLA-03 | Bulk actions (selecionar multiplas acoes) | P2 | M | Baixo | Nao implementado | Pendente |
| PLA-04 | Action templates | P2 | M | Baixo | Rota existe mas funcionalidade basica | Pendente |

---

## 2. Items Resolvidos (Confirmados)

| # | Item | Origem | Resolucao | Evidencia |
|---|------|--------|-----------|-----------|
| REP-04 | Charts no PDF | Sprint 5 P1 pendencia | Sprint 7 chart pipeline completo | OUTPUT S7 15/15 PASS |
| PLA-01 | Breadcrumbs | Sprint 5 P1 pendencia | Wave 1 Breadcrumbs component | OUTPUT W1 |
| - | Icon hardening | Sprint 5 P1 | 29 arquivos migrados, 0 warnings | OUTPUT S5 P1 |
| - | Toast feedback | Sprint 5 P1 | Implementado em exports | OUTPUT S5 P1 |
| - | Pack selector real | Sprint 5 P1 | Dropdown por area funcional | OUTPUT S5 P1 |
| - | Date range picker | Sprint 5 P1 | Inputs date com filtragem | OUTPUT S5 P1 |

---

## 3. Quick Wins (Top 10)

| # | Item | Esforco | Impacto | Modulo |
|---|------|---------|---------|--------|
| 1 | REP-03: Area filter em Reports | S | Alto | Reports |
| 2 | CLO-03: Area filter em Closings | S | Alto | Closings |
| 3 | MA-02: TI pack estrategico | S | Medio | Multi-area |
| 4 | UI-05: Mobile tables validation | S | Medio | UI |
| 5 | PDF-03: Watermark rascunho | S | Medio | PDF |
| 6 | MA-03: Area-specific labels | S | Baixo | Multi-area |
| 7 | UI-01: sr-only expansion | S | Baixo | A11y |
| 8 | CLO-02: localStorage cleanup util | S | Medio | Closings |
| 9 | UI-06: Hover/press microinteracoes | M | Medio | UI |
| 10 | MA-01: RBAC UI enforcement | M | Alto | RBAC |

---

## 4. Riscos (Top 5)

| # | Risco | Probabilidade | Impacto | Mitigacao | Modulo |
|---|-------|---------------|---------|-----------|--------|
| 1 | RBAC nao enforced em rotas — qualquer user pode acessar qualquer rota | Alta | Alto | MA-04: Implementar route guards com useRBAC | RBAC |
| 2 | localStorage stale pode causar inconsistencia em closings | Media | Medio | CLO-02: Utility de cleanup + versioning ja implementado | Closings |
| 3 | Performance com >100 acoes (sem virtualizacao) | Baixa | Medio | REP-02: VirtualizedList quando necessario | Reports |
| 4 | Charts falham silenciosamente no PDF | Baixa | Baixo | Fallback com nota ja implementado (Sprint 7) | PDF |
| 5 | area_id no UserProfile nao enforced — user pode ver areas que nao deveria | Media | Alto | MA-05: Filtrar por area_id no useRBAC | RBAC |

---

## 5. Sequenciamento Recomendado

### Proximos 30 dias — Fase 1 (P1 Quick Wins)

| Semana | Items | Esforco total |
|--------|-------|---------------|
| S1 | REP-03 + CLO-03 (area filters) | 2S |
| S1 | MA-02 (TI pack) | 1S |
| S2 | MA-01 (RBAC UI enforcement) | 1M |
| S2 | MA-04 (Route guards) | 1M |
| S3 | CLO-01 (Charts no closing detail) | 1M |
| S3 | UI-05 (Mobile validation) | 1S |
| S4 | Buffer + QA integration | - |

### Fase 2 (P2 Hardening)

| Ordem | Items | Esforco total |
|-------|-------|---------------|
| 1 | MA-05 (area_id enforcement) | 1M |
| 2 | PDF-01 + PDF-02 (TOC + Cover) | 1L |
| 3 | REP-02 (VirtualizedList) | 1M |
| 4 | CLO-04 (Line charts comparativo) | 1L |
| 5 | UI-06 (Microinteracoes) | 1M |
| 6 | PLA-02 (DnD Kanban) | 1L |

### Fase 3 (P2 Features)

| Ordem | Items | Esforco total |
|-------|-------|---------------|
| 1 | MA-06 (Benchmark areas) | 1L |
| 2 | REP-01 (XLSX nativo) | 1M |
| 3 | PDF-04 + PDF-05 (Compressao + Landscape) | 1M |
| 4 | PLA-03 + PLA-04 (Bulk + Templates) | 1M + 1M |

---

## 6. Legenda

| Simbolo | Significado |
|---------|------------|
| P0 | Critico — bloqueia release |
| P1 | Alto — proximo ciclo |
| P2 | Medio — backlog futuro |
| S | Small (< 2h) |
| M | Medium (2-8h) |
| L | Large (> 8h) |

---

**Versao:** 1.0.6  
**Data:** 2026-02-09 08:44 UTC-3
