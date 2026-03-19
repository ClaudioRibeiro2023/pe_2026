# Regression Matrix — PE-2026 v1.0.6

**Data:** 2026-02-09  
**Versao:** 1.0.6  
**Repositorio:** B:\PE_2026

---

## 1. Rotas Criticas

| # | Rota | Check 1 | Check 2 | Check 3 |
|---|------|---------|---------|---------|
| R1 | `/dashboard` | KPIs renderizam com dados | Sidebar navegavel, links ativos | Dark mode toggle funcional |
| R2 | `/planning/dashboard` | Metricas de planning carregam | Filtros de area presentes | Cards clicaveis |
| R3 | `/planning/calendar` | Calendario renderiza meses | Eventos/acoes visiveis nos dias | Responsive: AgendaMode em mobile |
| R4 | `/planning/kanban` | Colunas por status renderizam | Cards de acao com dados | Drag indicators visiveis |
| R5 | `/planning/timeline` | Timeline Gantt renderiza | Barras de progresso com cores | Scroll horizontal funciona |
| R6 | `/planning/actions/manage` | DataTable com acoes listadas | Busca/filtro funciona | Paginacao presente |
| R7 | `/planning/actions/new` | Formulario de criacao abre | Campos obrigatorios validados | Submit cria acao |
| R8 | `/planning/actions/approvals` | Lista de aprovacoes pendentes | Botoes aprovar/rejeitar presentes | Toast feedback |
| R9 | `/planning/actions/evidences` | Backlog de evidencias lista | Status de evidencia visivel | Upload funcional |
| R10 | `/reports` | 3 tabs renderizam | Filtros area/pack/periodo | KPIs calculados |
| R11 | `/governance/closings` | Lista de fechamentos | Filtro por periodo | Botao criar closing |
| R12 | `/governance/closings/:id` | Detalhe do closing | KPIs snapshot | Tabela de acoes |
| R13 | `/governance/closings/compare` | Comparativo entre 2 closings | Deltas KPIs | Status distribution diff |
| R14 | `/planning/rh/dashboard` | Dashboard RH com 42+ acoes | Pack RH referenciado | Metricas corretas |
| R15 | `/planning/marketing/dashboard` | Dashboard MKT com 20+ acoes | Pack MKT referenciado | Navegacao funcional |
| R16 | `/planning/operacoes/dashboard` | Dashboard OPS com 20+ acoes | Pack OPS referenciado | Acoes visiveis |
| R17 | `/planning/financeiro/dashboard` | Dashboard FIN com 20+ acoes | Pack FIN referenciado | Filtros funcionam |
| R18 | `/planning/rh/pe-2026` | Strategic Pack RH renderiza | Secoes navegaveis | Botao PDF presente |
| R19 | `/strategy` | Pagina de estrategia carrega | Links de navegacao | Sem erros console |
| R20 | `/admin` | Pagina admin (role admin) | Lista de usuarios | Restricted para roles menores |

---

## 2. Exports

| # | Export | Rota | Tipo | Validacao |
|---|--------|------|------|-----------|
| E1 | Report PDF | `/reports` (tab Executivo) | PDF (jsPDF) | Header institucional, KPIs, tabelas, charts como imagem |
| E2 | Report CSV | `/reports` (tab Acoes) | CSV (UTF-8 BOM) | Colunas corretas, encoding UTF-8, acentos preservados |
| E3 | Closing PDF | `/governance/closings/:id` | PDF (jsPDF) | Snapshot KPIs, tabela acoes, header/footer |
| E4 | Closing CSV | `/governance/closings/:id` | CSV | Dados do snapshot exportados |
| E5 | Closing Compare CSV | `/governance/closings/compare` | CSV | Deltas entre 2 closings |
| E6 | Pack PDF | `/planning/:area/pe-2026` | PDF (jsPDF) | Secoes do pack, structured data |
| E7 | Chart embed | Report PDF | Imagem no PDF | Chart.js -> canvas.toDataURL -> PDF; fallback com nota se falhar |

### Evidencia esperada (Exports)
- PDF: Arquivo baixa no navegador com nome formatado
- CSV: Arquivo baixa com BOM UTF-8
- Chart no PDF: Imagem do grafico embutida ou nota de fallback
- Toast: Feedback "Exportado com sucesso" ou "Erro ao exportar"

---

## 3. RBAC

| # | Cenario | Como testar | Resultado esperado |
|---|---------|------------|-------------------|
| RBAC1 | Admin ve tudo | Login como admin (default) | Todas areas, todos botoes, admin menu |
| RBAC2 | Colaborador ve limitado | `localStorage pe2026-role-override = colaborador` | Ve dashboards, nao ve botoes de edicao (P1) |
| RBAC3 | Cliente sem acesso | `localStorage pe2026-role-override = cliente` | Nenhuma area visivel |
| RBAC4 | MULTIAREA true | `rbac.ts` MULTIAREA_ENABLED = true | 5 areas no sidebar "Planos por Area" |
| RBAC5 | MULTIAREA false | Alterar para false, rebuild | Apenas RH no sidebar |
| RBAC6 | useRBAC hook | `canAccess('marketing')` | true para admin/direcao/gestor |
| RBAC7 | Feature check | `can('manage_roles')` | true apenas para admin |

### Evidencia esperada (RBAC)
- Sidebar: Secao "Planos por Area" com links dinamicos
- Config: `src/shared/config/rbac.ts` com matrix completa
- Hook: `src/shared/hooks/useRBAC.ts` exportado e funcional

---

## 4. Seeds

| # | Area | Acoes esperadas | Pack | Plan link | Closings |
|---|------|----------------|------|-----------|----------|
| S1 | RH | >= 42 (regex RH-) | pack-rh-2026 | plan-rh-2026 | 3 periodos |
| S2 | Marketing | >= 20 (regex MKT-) | pack-mkt-2026 | plan-mkt-2026 | 2 periodos |
| S3 | Operacoes | >= 20 (regex OPS-) | pack-ops-2026 | plan-ops-2026 | 2 periodos |
| S4 | Financeiro | >= 20 (regex FIN-) | pack-fin-2026 | plan-fin-2026 | 2 periodos |
| S5 | TI | >= 4 | (sem pack) | plan-ti-2026 | (sem closings) |

### Validacao automatizada
- Script: `scripts/dev/qa_multiarea_sprint8.ps1` — 35/35 PASS
- IDs legados: 0 matches para `action-mkt/ops/fin-*`
- Subtasks/evidences/comments/history/risks: Refs atualizados para novos IDs

---

## 5. Performance

| Metrica | Valor baseline | Threshold | Como medir |
|---------|---------------|-----------|------------|
| Build time | ~6s | < 15s | `npm run build` output |
| tsc --noEmit | < 5s | < 30s | `npx tsc --noEmit` |
| Bundle CSS | ~82 KB (13 KB gzip) | < 150 KB | Build output |
| Modules | ~2118 | informativo | Build output |
| Preview startup | < 2s | < 10s | `npm run preview` |

---

## 6. A11y Smoke

| # | Check | Contagem | Status | Referencia |
|---|-------|----------|--------|------------|
| A1 | focus-visible | 11 | PASS | Wave 5 |
| A2 | aria-label | 30 | PASS | Wave 5 |
| A3 | role= | 23 | PASS | Wave 5 |
| A4 | aria-modal | 1 | PASS | Wave 5 |
| A5 | tabIndex | 4 | PASS | Wave 5 |
| A6 | sr-only | 1 | WARN | Expandir em P2 |
| A7 | skip-to-main | 2 | PASS | Wave 5 |
| A8 | prefers-reduced-motion | 2 | PASS | Wave 5 |
| A9 | aria-live | 1 | PASS | Wave 5 |
| A10 | aria-current | 3 | PASS | Wave 5 |

**Score: 9/10 PASS** — A6 (sr-only) e WARN por contagem baixa, nao por ausencia.

### Workaround A6
- `Button.tsx` ja tem `<span className="sr-only">Carregando...</span>` no loading spinner
- Expandir sr-only para mais contextos e tarefa P2

---

## 7. Mobile (P1)

| # | Rota | Check | Status |
|---|------|-------|--------|
| M1 | `/planning/calendar` | AgendaMode em < 768px | Implementado (Wave 3) |
| M2 | `/planning/timeline` | Scroll horizontal | Implementado |
| M3 | `/reports` | Tabelas com overflow-x | A validar |
| M4 | `/governance/closings` | Layout responsivo | A validar |

---

## 8. Scripts QA Existentes

| Script | Path | Checks | Resultado |
|--------|------|--------|-----------|
| Reports P0 | `scripts/dev/qa_reports_sprint5_p0.ps1` | Build + componentes + IDs mock | Historico |
| Multiarea S8 | `scripts/dev/qa_multiarea_sprint8.ps1` | 35 checks (seeds, packs, RBAC, nav, IDs) | 35/35 PASS |
| Release Readiness | `scripts/dev/qa_release_readiness.ps1` | tsc + build + docs + headers | Release gate |

---

**Versao:** 1.0.6  
**Data:** 2026-02-09 08:44 UTC-3
