# OUTPUT — UI Redesign Wave 2 (R2)

**Data:** 2026-02-08 22:05 (UTC-03:00)
**Repo:** B:\PE_2026
**Tipo:** Implementacao UI (componentes + migracao cores + aplicacao em rotas)

---

## 1. Resumo Executivo

Wave 2 entregou os dois componentes estruturantes do Design System (FilterBar + DataTable), aplicou-os em 3 rotas, e reduziu raw colors de 852 para **759 (-10.9%)**, atingindo a meta <= 760.

### Entregas P0

| # | Entrega | Evidencia |
|---|---------|-----------|
| 1 | **FilterBar.tsx** — slots left/right, responsive, tokens-only, a11y | `src/shared/ui/FilterBar.tsx` |
| 2 | **DataTable.tsx** — sort 1-col, paginacao 10/25/50, skeleton, empty, aria | `src/shared/ui/DataTable.tsx` |
| 3 | **Heatmap script** — top 30 arquivos com breakdown por tipo | `scripts/dev/ui_raw_colors_heatmap.ps1` |
| 4 | FilterBar em **3 rotas**: Dashboard, Manage, Reports | AreaPlansDashboard, AreaPlansListPage, ReportsPage |
| 5 | DataTable em **3 usos**: Dashboard, Manage, PackActionsReport | AreaProgressTable, packActionColumns, actionColumns |
| 6 | Raw colors **759 <= 760** | `METRICS_RAW_COLORS_20260208_2203.md` |
| 7 | PageHeader+Breadcrumbs em AreaPlansListPage (novo W2) | PageHeader + Crumb[] |
| 8 | Sidebar.tsx migrado (~50 raw colors eliminados) | bg-surface, border-border, text-muted, hover:bg-accent |

---

## 2. Metricas — Raw Colors Trajectory

| Metrica | Pre-W1 | Pos-W1 | Pos-W2 | Delta total |
|---------|--------|--------|--------|-------------|
| Raw colors | 889 | 852 | **759** | **-130 (-14.6%)** |
| text-gray-* | ~500 | ~470 | **420** | -80 |
| bg-gray-* | ~140 | ~130 | **118** | -22 |
| border-gray-* | ~110 | ~100 | **94** | -16 |
| bg-white | ~55 | ~52 | **48** | -7 |
| text-white | ~84 | ~80 | **79** | -5 |

### Meta <= 760

| Criterio | Valor | Status |
|----------|-------|--------|
| Target | <= 760 | - |
| Actual | 759 | **PASSA** |

---

## 3. Heatmap Pos-W2 — Top 30

| # | Arquivo | Total | text-gray | bg-gray | border-gray | bg-white | text-white |
|---|---------|-------|-----------|---------|-------------|----------|------------|
| 1 | ActionPlanTimeline.tsx | 40 | 15 | 7 | 12 | 2 | 4 |
| 2 | AreaPlanPage.tsx | 40 | 36 | 1 | 0 | 3 | 0 |
| 3 | ActionPlanDashboard.tsx | 38 | 22 | 7 | 2 | 0 | 7 |
| 4 | ActionPlanKanban.tsx | 35 | 19 | 8 | 4 | 1 | 3 |
| 5 | GovernanceRituals.tsx | 27 | 20 | 2 | 2 | 3 | 0 |
| 6 | LoginPage.tsx | 26 | 8 | 2 | 0 | 4 | 12 |
| 7 | UnifiedPlanWizard.tsx | 25 | 15 | 4 | 5 | 0 | 1 |
| 8 | design/utils.ts | 24 | 8 | 9 | 4 | 1 | 2 |
| 9 | ActionForm.tsx | 23 | 14 | 0 | 9 | 0 | 0 |
| 10 | PlanningAreaCalendarPage.tsx | 21 | 15 | 2 | 3 | 1 | 0 |
| 11 | ProgramCard.tsx | 20 | 13 | 3 | 3 | 1 | 0 |
| 12 | Button.tsx | 19 | 6 | 8 | 2 | 1 | 2 |
| 13 | ApprovalPanel.tsx | 19 | 14 | 2 | 2 | 1 | 0 |
| 14 | ActionCard.tsx | 16 | 11 | 1 | 3 | 1 | 0 |
| 15 | PackComments.tsx | 15 | 10 | 1 | 3 | 1 | 0 |
| 16 | ActionTimeline.tsx | 14 | 6 | 3 | 3 | 1 | 1 |
| 17 | EvidencePanel.tsx | 13 | 8 | 2 | 2 | 1 | 0 |
| 18 | AttachmentList.tsx | 13 | 8 | 2 | 3 | 0 | 0 |
| 19 | KpiTable.tsx | 12 | 8 | 2 | 2 | 0 | 0 |
| 20 | SubtaskList.tsx | 12 | 7 | 3 | 1 | 0 | 1 |
| 21 | DashboardPage.tsx | 11 | 8 | 1 | 0 | 0 | 2 |
| 22 | AreaSelector.tsx | 11 | 9 | 0 | 0 | 0 | 2 |
| 23 | types.ts | 11 | 5 | 6 | 0 | 0 | 0 |
| 24 | AreaPlanApprovalsPage.tsx | 11 | 11 | 0 | 0 | 0 | 0 |
| 25 | CommentsList.tsx | 11 | 8 | 1 | 2 | 0 | 0 |
| 26 | StrategyKpisPage.tsx | 10 | 0 | 0 | 0 | 3 | 7 |
| 27 | PackHeader.tsx | 10 | 5 | 2 | 2 | 1 | 0 |
| 28 | LegacyMigrationPage.tsx | 10 | 3 | 3 | 3 | 1 | 0 |
| 29 | ObjectivesList.tsx | 10 | 7 | 2 | 1 | 0 | 0 |
| 30 | ActionHistoryList.tsx | 10 | 9 | 1 | 0 | 0 | 0 |

**Total arquivos com raw colors:** 83
**Grand total:** 759

---

## 4. Build Status

```
tsc -b && vite build
✓ 2103 modules transformed.
✓ built in 6.79s
EXIT CODE: 0
```

**BUILD OK** — zero erros TypeScript, zero warnings de import.

---

## 5. QA Report — Action Ledger (inline)

### BLOCO 0 — BASELINE & DISCOVERY (A01–A06)

| ID | Pri | Acao | ✅/❌ |
|----|-----|------|-------|
| A01 | P0 | Contagem raw pre-W2 (853) | ✅ |
| A02 | P0 | Criar heatmap script | ✅ |
| A03 | P0 | Rodar heatmap pre-W2 (top 30) | ✅ |
| A04 | P0 | Top10 extraido e registrado | ✅ |
| A05 | P0 | ActionsManagePage → AreaPlansListPage | ✅ |
| A06 | P0 | Pontos de integracao confirmados | ✅ |

### BLOCO 1 — COMPONENTES (A07–A18)

| ID | Pri | Acao | ✅/❌ |
|----|-----|------|-------|
| A07 | P0 | FilterBar layout base | ✅ |
| A08 | P0 | Slots left/right + responsividade | ✅ |
| A09 | P0 | SearchInput prop-driven | ✅ |
| A10 | P0 | Chips de Status | ✅ |
| A11 | P0 | A11y: labels, foco, teclado | ✅ |
| A12 | P0 | DataTable estrutura base | ✅ |
| A13 | P0 | Sort client-side 1 col | ✅ |
| A14 | P0 | Paginacao 10/25/50 | ✅ |
| A15 | P0 | Loading skeleton + empty | ✅ |
| A16 | P0 | Render cells + badge/status | ✅ |
| A17 | P0 | Tokens-only (0 raw colors) | ✅ |
| A18 | P0 | Exportar no index.ts | ✅ |

### BLOCO 2 — APLICACAO NAS ROTAS (A19–A28)

| ID | Pri | Acao | ✅/❌ |
|----|-----|------|-------|
| A19 | P0 | FilterBar em /planning/dashboard | ✅ |
| A20 | P0 | DataTable no dashboard (AreaProgressTable) | ✅ |
| A21 | P0 | FilterBar em /planning/actions/manage | ✅ |
| A22 | P0 | DataTable no manage (packActionColumns) | ✅ |
| A23 | P0 | 42 acoes RH com paginacao | ✅ |
| A24 | P0 | FilterBar no /reports | ✅ |
| A25 | P0 | PackActionsReport → DataTable | ✅ |
| A26 | P0 | Export CSV/PDF funcional | ✅ |
| A27 | P0 | Charts/Toast sem regressao | ✅ |
| A28 | P0 | A11y: foco e tab order | ✅ |

### BLOCO 3 — REDUCAO RAW COLORS (A29–A34)

| ID | Pri | Acao | ✅/❌ |
|----|-----|------|-------|
| A29 | P0 | Atacar Top10 (Sidebar, AreaPlansListPage, etc) | ✅ |
| A30 | P0 | No new raw colors em arquivos tocados | ✅ |
| A31 | P0 | Contagem pos: 759 <= 760 | ✅ |
| A32 | P0 | Heatmap pos gerado | ✅ |
| A33 | P1 | Ajustes finos | ✅ |
| A34 | P1 | Top10 Wave3 (se meta nao bater) | N/A (meta OK) |

### BLOCO 4 — QA + GATE + OUTPUT (A35–A40)

| ID | Pri | Acao | ✅/❌ |
|----|-----|------|-------|
| A35 | P0 | Scripts QA + heatmap | ✅ |
| A36 | P0 | QA valida build/FilterBar/DataTable/raw/heatmap | ✅ |
| A37 | P0 | QA report gerado | ✅ |
| A38 | P0 | Gate result gerado | ✅ |
| A39 | P0 | Output unico gerado | ✅ |
| A40 | P0 | Rodar QA e entregar OUTPUT | ✅ |

**Score: 40/40 DONE**

---

## 6. Arquivos Criados

| # | Arquivo | Tipo |
|---|---------|------|
| 1 | `src/shared/ui/FilterBar.tsx` | Componente |
| 2 | `src/shared/ui/DataTable.tsx` | Componente |
| 3 | `scripts/dev/ui_raw_colors_heatmap.ps1` | Script |
| 4 | `scripts/dev/qa_ui_redesign_wave2.ps1` | Script |
| 5 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_HEATMAP_20260208_2147.md` | Metricas |
| 6 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_HEATMAP_20260208_2203.md` | Metricas |
| 7 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_2157.md` | Metricas |
| 8 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_2203.md` | Metricas |
| 9 | `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE2_20260208_2205.md` | QA Report |
| 10 | `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE2_RESULT_20260208_2205.md` | Gate |
| 11 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE2_20260208_2205.md` | OUTPUT (este) |

## 7. Arquivos Alterados

| # | Arquivo | Mudancas |
|---|---------|----------|
| 1 | `src/shared/ui/index.ts` | +2 exports (FilterBar, DataTable) |
| 2 | `src/features/area-plans/pages/AreaPlansDashboard.tsx` | +FilterBar +DataTable +AreaProgressTable sub-component, -10 raw colors |
| 3 | `src/features/area-plans/pages/AreaPlansListPage.tsx` | +PageHeader +Breadcrumbs +FilterBar +DataTable, -30 raw colors |
| 4 | `src/features/reports/pages/ReportsPage.tsx` | Filtros migrados para FilterBar |
| 5 | `src/features/reports/components/PackActionsReport.tsx` | Lista manual → DataTable, -4 raw colors |
| 6 | `src/app/layout/Sidebar.tsx` | -50 raw colors (bg-surface, border-border, text-muted, hover:bg-accent) |

---

## 8. Pendencias para Wave 3

| # | Item | Prioridade | Arquivo(s) |
|---|------|-----------|------------|
| 1 | ActionPlanTimeline.tsx (40 raw) | P0 | Migrar text-gray, border-gray, bg-gray |
| 2 | AreaPlanPage.tsx (40 raw) | P0 | Migrar text-gray (36 usos!) |
| 3 | ActionPlanDashboard.tsx (38 raw) | P0 | Migrar text-gray, bg-gray, text-white |
| 4 | ActionPlanKanban.tsx (35 raw) | P0 | Migrar text-gray, bg-gray |
| 5 | GovernanceRituals.tsx (27 raw) | P1 | Migrar text-gray, bg-white |
| 6 | LoginPage.tsx (26 raw) | P1 | Migrar bg-white, text-white |
| 7 | UnifiedPlanWizard.tsx (25 raw) | P1 | Migrar text-gray, border-gray |
| 8 | Button.tsx (19 raw) | P0 | Migrar bg-gray, text-gray |
| 9 | Responsividade Calendar mobile | P1 | PlanningAreaCalendarPage.tsx |
| 10 | Target Wave3: **<= 600** | - | -160 reducao necessaria |

### Raw Colors Trajectory

```
Baseline (pre-W1):  889
Pos-W1:             852  (-37,   -4.2%)
Pos-W2:             759  (-93,  -10.9%)  ← META ATINGIDA
Target W3:         <=600  (-159, -20.9%)
Target W5 (final): <=100
```

---

*OUTPUT UI Redesign Wave 2 — PE_2026*
