# SPEC_04 — UI Redesign do Modulo Planejamento

**Data:** 2026-02-06  
**Versao:** v1.1 (atualizado 2026-02-08)  
**Status:** Wave1 DONE / Wave2 NEXT  
**Baseline:** UI_VISUAL_AUDIT_PLANNING_v1.md + Sprint 5 P0/P1

---

## 0. Status Atual

| Item | Status |
|------|--------|
| Sprint 5 Reports (P0+P1) | **DONE** — 8/8 PASSA |
| Wave 1 (Cores + PageHeader + Breadcrumbs) | **DONE / PASSA** — build OK, -37 raw colors |
| Wave 2 (FilterBar + DataTable) | **NEXT** — meta raw colors <= 760 |
| Guardrail anti-regressao | **ATIVO** — modo nao-regressao (falha esperada por legado) |

### Resultados Wave 1

| Metrica | Valor |
|---------|-------|
| Raw colors baseline | 889 |
| Raw colors after | 852 |
| Delta | -37 (-4.2%) |
| PageHeader aplicado | 5/5 |
| Breadcrumbs aplicado | 5/5 |
| Componentes migrados | Card, Input, Progress, Tooltip |
| Componentes novos | Breadcrumbs.tsx, PageHeader.tsx |
| Build | OK (exit 0, 12.91s) |

**Evidencias:** `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md` | `OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md` | `GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md`

### Pendencias Prioritarias v1.1 (Wave2 P0 + P1)

| # | Item | Prioridade | Wave |
|---|------|-----------|------|
| 1 | Criar FilterBar reutilizavel | P0 | W2 |
| 2 | Criar DataTable (sort + pagination + export) | P0 | W2 |
| 3 | Heatmap raw colors — top-10 arquivos | P0 | W2 |
| 4 | Aplicar FilterBar + DataTable no Dashboard | P0 | W2 |
| 5 | Aplicar FilterBar + DataTable em Gerenciar Acoes | P0 | W2 |
| 6 | Toast em CRUD de acoes | P1 | W2 |
| 7 | Migrar cores em Button, Badge, Modal, Table, etc. | P1 | W2 |
| 8 | Paginacao na lista de acoes (10 items/page) | P1 | W2 |

---

## 1. Visao

> **"UI premium + eficiencia operacional + rastreabilidade"**

Transformar a interface do modulo Planejamento de uma UI funcional-mas-inconsistente para uma experiencia **visualmente surpreendente**, mantendo o carater **corporativo e auditavel** exigido pela Aero Engenharia.

### Principios-chave

- **Premium sem frivolidade** — Cada pixel deve comunicar profissionalismo e confianca
- **Eficiencia operacional** — Reducao de cliques, densidade informacional otimizada, feedback imediato
- **Rastreabilidade total** — Toda acao do usuario gera evidencia auditavel (toast, historico, logs)
- **Consistencia absoluta** — Zero divergencia entre tokens e implementacao

---

## 2. Scorecard

| Criterio | Peso | Score Atual (1-5) | Target (1-5) | Gap |
|----------|------|--------------------|--------------|-----|
| Consistencia de cor (tokens vs raw) | 20% | 2 | 5 | -3 |
| Feedback ao usuario (toast/loading) | 15% | 3.5 | 5 | -1.5 |
| Acessibilidade (WCAG 2.1 AA) | 15% | 3 | 4.5 | -1.5 |
| Responsividade (1024px-1920px) | 10% | 3 | 4.5 | -1.5 |
| Hierarquia visual | 10% | 4 | 5 | -1 |
| Navegacao e wayfinding | 10% | 3 | 5 | -2 |
| Component API consistency | 10% | 4 | 5 | -1 |
| Dark mode coverage | 10% | 2.5 | 4.5 | -2 |
| **Score Ponderado** | | **2.98** | **4.78** | **-1.80** |

**Nota:** Score "Feedback" subiu de 3 para 3.5 apos Sprint 5 (toast integrado em Reports).  
**Nota:** Score "Dark mode" subiu de 2 para 2.5 apos icon hardening.  
**Nota (v1.1):** Score "Consistencia de cor" subiu de 2 para 2.5 apos Wave1 (-37 raw, tokens em 4 shared components).  
**Nota (v1.1):** Score "Navegacao" subiu de 3 para 3.5 apos Wave1 (Breadcrumbs em 5 pages).

---

## 3. Principios de UI/UX

### 3.1 Benchmark-Inspired

| Principio | Inspiracao | Aplicacao |
|-----------|-----------|-----------|
| **Information density** | Linear, Notion | Cards compactos com dados acionaveis; sem whitespace desperdicado |
| **Progressive disclosure** | Figma, Stripe Dashboard | Detalhes sob demanda (expand/collapse); filtros inteligentes |
| **Consistent elevation** | Material Design 3 | Sistema de 4 niveis de sombra (flat → raised → overlay → modal) |
| **Semantic color only** | IBM Carbon | Zero cores raw no codigo; tudo via tokens semanticos |
| **Motion with purpose** | Apple HIG | Transicoes indicam relacao espacial; nunca decorativas |
| **Data-first layout** | Grafana, Metabase | Graficos e numeros dominam; labels sao secundarios |

### 3.2 Regras de Ouro

1. **Nenhum `text-gray-*` novo** — todo texto usa `text-foreground`, `text-muted`, ou variante semantica
2. **Nenhum `bg-white` novo** — todo fundo usa `bg-surface`, `bg-background`, ou variante semantica
3. **Nenhum `border-gray-*` novo** — toda borda usa `border-border` ou `border-border-strong`
4. **Todo CRUD tem toast** — sucesso, erro, e loading sao visiveis
5. **Toda page tem PageHeader** — titulo, descricao, breadcrumbs, actions
6. **Todo loading tem skeleton** — nunca spinner sozinho em area de conteudo
7. **Todo clicavel tem focus-visible** — ring azul padrao

---

## 4. Guardrails

### 4.1 Nao Quebrar

| Guardrail | Descricao |
|-----------|-----------|
| **Flows existentes** | Nenhuma rota muda de path; nenhum flow de CRUD e interrompido |
| **RH-only** | Escopo de teste permanece area RH com 42 acoes mock |
| **Build zero-error** | Cada onda deve compilar sem erros TS e sem warnings |
| **Mock data** | Nenhum dado mock e alterado — apenas UI |

### 4.2 Acessibilidade

| Requisito | Nivel |
|-----------|-------|
| Contraste minimo | 4.5:1 (AA) para texto normal, 3:1 para texto grande |
| Focus management | `focus-visible` ring em todos os interativos |
| Keyboard navigation | Tab order logico; Escape fecha modais/dropdowns |
| ARIA labels | Todas as tabelas, grids e regioes nomeadas |
| Screen reader | Conteudo semantico (`<nav>`, `<main>`, `<section>`, `<table>`) |
| Reduced motion | `prefers-reduced-motion` respeitado (ja implementado) |

### 4.3 Performance

| Metrica | Target |
|---------|--------|
| Build time | < 30s |
| LCP (Largest Contentful Paint) | < 2.5s |
| Bundle size delta por onda | < +5KB gzip |
| Runtime re-renders | Zero re-renders desnecessarios em filtros |

---

## 5. Criterios de Aceite (verificaveis)

### Por Onda

| # | Criterio | Verificacao |
|---|----------|-------------|
| CA-01 | Zero `text-gray-*` em arquivos alterados | `grep -r "text-gray-" src/` retorna 0 nos arquivos da onda |
| CA-02 | Zero `bg-white` em arquivos alterados | `grep -r "bg-white" src/` retorna 0 nos arquivos da onda |
| CA-03 | Build passa sem erros | `npm run build` exit code 0 |
| CA-04 | Zero warnings de icones | Build output sem "dynamically imported" |
| CA-05 | Dark mode funcional | Todas as pages renderizam corretamente em `.dark` |
| CA-06 | Toast em toda acao CRUD | Criar/editar/deletar/aprovar mostram toast |
| CA-07 | PageHeader em toda page | Todas as 16 rotas tem PageHeader com breadcrumbs |
| CA-08 | Keyboard navigable | Tab percorre todos os interativos na ordem logica |
| CA-09 | Score ponderado >= 4.0 | Re-auditoria pos-Onda 3 atinge score minimo |

### Global (pos-redesign)

| # | Criterio | Verificacao |
|---|----------|-------------|
| CG-01 | Score >= 4.5 | Auditoria final |
| CG-02 | Zero regressao funcional | QA script de Reports + Planning passa |
| CG-03 | Bundle size < baseline + 20KB | `npm run build` + check dist size |
| CG-04 | Todas as 16 rotas verificadas | Checklist manual ou automated |

---

## 6. Resolucoes Sprint 5 (Audit Items Atualizados)

| Item Original do Audit | Status Pos-Sprint 5 |
|------------------------|---------------------|
| #5 ReportsPage e placeholder | **RESOLVIDO** — Hub funcional com 3 relatorios, filtros, charts, export |
| #3 Toast feedback ausente | **PARCIAL** — Integrado em Reports (export PDF/Excel); falta CRUD geral |
| #8 ExportButtons nao integrados | **PARCIAL** — Integrados em Reports; falta Planning pages |
| Icon warnings no build | **RESOLVIDO** — 29 arquivos migrados, 0 warnings |
| Importacao inconsistente de icones | **RESOLVIDO** — Todos via `@/shared/ui/icons` |

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026*
