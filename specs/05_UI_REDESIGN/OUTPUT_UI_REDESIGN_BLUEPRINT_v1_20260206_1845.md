# OUTPUT — UI Redesign Blueprint v1

**Data:** 2026-02-06 18:45 (UTC-03:00)  
**Repo:** B:\PE_2026  
**Tipo:** Documentacao (zero codigo alterado)

---

## 1. Resumo Executivo

O Blueprint v1 do UI Redesign do modulo Planejamento da PE_2026 foi criado com base na auditoria visual existente (`UI_VISUAL_AUDIT_PLANNING_v1.md`), atualizada com as resolucoes da Sprint 5 (P0+P1).

**Visao:** "UI premium + eficiencia operacional + rastreabilidade"

**Estado atual:** Score ponderado **2.98/5.0** (auditoria + Sprint 5 fixes)  
**Target:** Score **4.78/5.0** apos 5 ondas de redesign

**Estrategia:** 5 ondas incrementais, cada uma independentemente deployavel, sem quebrar flows existentes. Sprint 6-8 (features avancadas) rodam em paralelo apos Onda 2.

### O que a Sprint 5 ja resolveu

| Item do Audit | Resolucao |
|---------------|-----------|
| ReportsPage placeholder (#5) | **RESOLVIDO** — Hub funcional com 3 relatorios, charts, export |
| Toast feedback (#3) | **PARCIAL** — Integrado em Reports; falta CRUD geral |
| ExportButtons (#8) | **PARCIAL** — Integrados em Reports; falta Planning |
| Icon warnings | **RESOLVIDO** — 29 arquivos migrados, 0 warnings |

### O que falta (Top 10 prioridades atualizadas)

| # | Prioridade | Impacto | Onda |
|---|-----------|---------|------|
| 1 | Unificar cores (text-gray-* → tokens semanticos) | Alto | 1 |
| 2 | Criar PageHeader (titulo + breadcrumbs + actions) | Alto | 1 |
| 3 | Adicionar Breadcrumbs no Planning | Alto | 1 |
| 4 | Migrar Card/Input/Progress → tokens (dark mode fix) | Alto | 1 |
| 5 | Calendar responsive + cores via tokens | Medio | 3 |
| 6 | Consolidar thin-wrapper pages com tabs | Medio | 4 |
| 7 | Paginacao em lista de acoes (42+ items) | Medio | 2 |
| 8 | Toast em CRUD (criar/editar/deletar) | Medio | 2 |
| 9 | AreaSelector com metricas inline | Medio | 2 |
| 10 | FilterBar reutilizavel | Medio | 2 |

---

## 2. Documentos Criados

### A) SPEC_04_UI_REDESIGN_PLANNING.md

Conteudo: Visao, scorecard (peso + score atual + target), principios UI/UX (benchmark-inspired), guardrails (nao quebrar flows, RH-only, a11y, perf), criterios de aceite verificaveis (CA-01 a CA-09 por onda, CG-01 a CG-04 global).

**Destaques:**
- Score atual: 2.98 → Target: 4.78
- 7 regras de ouro (zero text-gray-*, zero bg-white, todo CRUD com toast, etc.)
- Guardrails: build zero-error, RH-only, mock data intocado
- a11y: WCAG 2.1 AA (4.5:1 contraste, focus-visible, ARIA, reduced-motion)

---

### B) DESIGN_SYSTEM_v1.md

Conteudo: Tokens (cores semanticas, tipografia, spacing, radius, sombras, estados), componentes alvo (minimo 10), padroes de responsividade, microinteracoes.

**Destaques:**
- 7 cores semanticas + 7 status tokens
- Escala tipografica: Display/Title/Subtitle(NOVO)/Body/Label/Caption/Mono
- Elevation system 4 niveis (flat → raised → overlay → modal)
- 10 componentes: PageHeader(NOVO), Breadcrumbs(NOVO), FilterBar(NOVO), DataTable(NOVO), Card(ajustar), Input(ajustar), Badge(manter), Toast(expandir uso), EmptyState(manter), Modal(ajustar)
- Responsive: 5 breakpoints, padroes por componente
- Microinteracoes: card hover, button press, tab switch, toast enter/exit, modal open

---

### C) PAGES_PLANNING_SPEC_v1.md

Conteudo: Especificacao page-by-page das 16 rotas + /reports. Para cada rota: objetivo, funcoes do usuario, layout textual (wireframe), componentes, estados, acessibilidade, metricas UX.

**Rotas especificadas:**

| # | Rota | Onda |
|---|------|------|
| 1 | `/planning` (Home) | 2 |
| 2 | `/planning/dashboard` | 2 |
| 3-4 | `/planning/kanban`, `/planning/timeline` | 4 |
| 5 | `/planning/calendar` | 3 |
| 6 | `/planning/actions/manage` | 2 |
| 7 | `/planning/actions/new` | 2 |
| 8 | `/planning/actions/templates` | 4 |
| 9 | `/planning/actions/approvals` | 2 |
| 10 | `/planning/actions/evidences` | 2 |
| 11 | `/planning/:areaSlug/dashboard` | 2 |
| 12-14 | Area Kanban/Calendar/Timeline | 3-4 |
| 15 | `/planning/:areaSlug/pe-2026` | 4 |
| 16 | `/reports` | 1 (ja entregue) |

---

### D) MEGAPLAN_UI_REDESIGN_v1.md

Conteudo: 5 ondas de execucao incremental com arquivos impactados, riscos/mitigacao, e DoD.

| Onda | Tema | Arquivos | Risco |
|------|------|----------|-------|
| 1 | Cores + PageHeader + Breadcrumbs | ~13 arquivos | Baixo |
| 2 | FilterBar + DataTable + Dashboard | ~8 arquivos | Medio |
| 3 | Calendar + responsive + status tokens | ~7 arquivos | Medio |
| 4 | Consolidacao thin-wrappers + tabs | ~11 arquivos | Medio-Alto |
| 5 | Polimento: motion, a11y, perf | ~9 arquivos | Baixo |

**Dependencias:**
```
Onda 1 → Onda 2 → Onda 3 → Onda 4 → Onda 5
                  ↘ Sprint 6 (paralelo) → Sprint 7 → Sprint 8
```

---

### E) QA_UI_REDESIGN_v1.md

Conteudo: Heuristica (7 criterios ponderados), checklist a11y (17 items WCAG 2.1 AA), checklist de regressao (21 flows), scripts lint sugeridos, evidencias exigidas.

**Scripts lint:**
1. `lint_no_raw_colors.ps1` — Bloquear text-gray-*, bg-white, border-gray-*
2. `lint_page_headers.ps1` — Verificar PageHeader em todas as pages
3. `lint_breadcrumbs.ps1` — Verificar breadcrumbs

**Regressao:** 10 flows Planning + 8 flows Reports + 3 checks infra = 21 total

---

### F) GATE_UI_REDESIGN_v1.md

Conteudo: 14 criterios PASSA/FALHA, 15 checks de nao-regressao, 8 evidencias obrigatorias, comandos de verificacao.

**Regra:**
- PASSA: 14/14 criterios
- PASSA CONDICIONAL: 12+, desvios documentados
- FALHA: < 12

---

### G) bluepoints.md (NOVO)

Roadmap completo com 3 trilhas:
- **Trilha 1:** Plataforma Base + Planning (Sprint 1-5) — 100% Done
- **Trilha 2:** UI Redesign (R0-R5) — R0 Active, R1-R5 Planned
- **Trilha 3:** Features Avancadas (Sprint 6-8) — Parallel apos R2

---

### H) 00_INDEX.md (ATUALIZADO)

- Sprint 5 marcado como concluido
- SPEC_04 + GATE_10 adicionados
- QA_07 + QA_08 adicionados
- Proximo passo: UI Redesign Onda 1
- Link para bluepoints.md

---

## 3. Estatisticas

| Metrica | Valor |
|---------|-------|
| Documentos criados | 7 |
| Documentos atualizados | 1 |
| Total de conteudo | ~45KB |
| Paginas especificadas | 16 rotas |
| Ondas planejadas | 5 |
| Criterios de gate | 14 |
| Checks de regressao | 21 |
| Items a11y | 17 |
| Scripts lint sugeridos | 3 |

---

## 4. Lista Final dos Arquivos

### Criados

| # | Arquivo |
|---|---------|
| 1 | `specs/05_UI_REDESIGN/SPEC_04_UI_REDESIGN_PLANNING.md` |
| 2 | `specs/05_UI_REDESIGN/DESIGN_SYSTEM_v1.md` |
| 3 | `specs/05_UI_REDESIGN/PAGES_PLANNING_SPEC_v1.md` |
| 4 | `specs/05_UI_REDESIGN/MEGAPLAN_UI_REDESIGN_v1.md` |
| 5 | `specs/05_UI_REDESIGN/QA_UI_REDESIGN_v1.md` |
| 6 | `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_v1.md` |
| 7 | `specs/bluepoints.md` |
| 8 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_BLUEPRINT_v1_20260206_1845.md` |

### Atualizados

| # | Arquivo | Mudanca |
|---|---------|---------|
| 1 | `specs/00_INDEX.md` | Sprint 5 done, SPEC_04, GATE_10, QA_07/08, bluepoints link |

---

## 5. Proximo Passo

Executar **Onda 1 (R1)** do redesign:
1. Criar `src/shared/ui/PageHeader.tsx`
2. Criar `src/shared/ui/Breadcrumbs.tsx`
3. Migrar cores raw → tokens em `Card.tsx`, `Input.tsx`, `Progress.tsx`, `AreaSubnav.tsx`
4. Aplicar PageHeader em todas as planning pages + /reports
5. Rodar lint scripts e validar

---

*Blueprint v1 completo — PE_2026 UI Redesign*
