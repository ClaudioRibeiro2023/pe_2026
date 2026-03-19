# 📋 PE-2026 — Índice de Especificações

**Repositório:** B:\PE_2026  
**Última atualização:** 08/02/2026 19:35  
**Mantido por:** Time PE-2026

---

## 🔄 Handoff Atual

> **[00_HANDOFF_CURRENT_STATE.md](./00_HANDOFF_CURRENT_STATE.md)** — Estado atual + Próximo passo

**Próximo passo:** UI Redesign Onda 2 — FilterBar + DataTable + meta raw colors <= 760 ([Blueprint](./05_UI_REDESIGN/SPEC_04_UI_REDESIGN_PLANNING.md) | [Megaplan](./05_UI_REDESIGN/MEGAPLAN_UI_REDESIGN_v1.md) | [Status](./05_UI_REDESIGN/STATUS_UI_REDESIGN.md))

---

## 🏗️ Estrutura de Pastas

```
specs/
├── 00_INDEX.md           ← Você está aqui
├── bluepoints.md         ← Roadmap completo (trilhas + dependências)
├── 01_SPECS/             ← Especificações funcionais
├── 02_GATES/             ← Gates de aprovação (checkpoints)
├── 03_TODOS/             ← Listas de tarefas por sprint/bloco
├── 04_REPORTS/           ← Relatórios de QA e migrações
├── 05_PROMPTS/           ← Prompts reutilizáveis para IA
├── 05_UI_AUDIT/          ← Auditoria visual UI
├── 05_UI_REDESIGN/       ← Blueprint UI Redesign (R0–R5)
└── 99_ARCHIVE/           ← Versões antigas/deprecated
```

---

## 📖 Especificações (SPECS)

| ID | Nome | Descrição | Status |
|----|------|-----------|--------|
| SPEC_01 | [Strategic Pack](./01_SPECS/SPEC_01_STRATEGIC_PACK.md) | Módulo de pacote estratégico por área | ✅ Implementado |
| SPEC_02 | [Planning Module](./01_SPECS/SPEC_02_PLANNING_MODULE.md) | Módulo de planejamento e planos de ação | 🔄 Em desenvolvimento |
| SPEC_03 | [Planning Reports](./01_SPECS/SPEC_03_PLANNING_REPORTS_SPRINT5.md) | Relatórios e exportações do módulo Planning | ✅ Sprint 5 P0+P1 |
| SPEC_04 | [UI Redesign Planning](./05_UI_REDESIGN/SPEC_04_UI_REDESIGN_PLANNING.md) | Redesign visual do módulo Planejamento | 🔄 Blueprint v1 |

---

## 🚪 Gates de Aprovação

| ID | Nome | Descrição | Status |
|----|------|-----------|--------|
| GATE_01 | [Strategic Pack MVP RH](./02_GATES/GATE_01_STRATEGIC_PACK_MVP_RH.md) | Gate de aprovação do MVP Strategic Pack para RH | ✅ Sprint 2 concluído |
| GATE_02 | [Planning Module Sprint 1](./02_GATES/GATE_02_PLANNING_MODULE_SPRINT1.md) | Gate de estabilização do módulo Planejamento | ✅ Aprovado |
| GATE_03 | [Planning Module Sprint 2](./02_GATES/GATE_03_PLANNING_MODULE_SPRINT2_MVP_RH.md) | Gate MVP RH Área-first | ✅ Aprovado |
| GATE_04 | [E2E RH Sprint 3](./02_GATES/GATE_04_E2E_RH_SPRINT3.md) | Gate E2E RH + Hardening | ✅ Aprovado |
| GATE_07 | [Audit ProdLocal RBAC UI RH](./02_GATES/GATE_07_AUDIT_PRODLOCAL_RBAC_UI_RH.md) | Auditoria P0 Build+RBAC+UI+RH-only | ✅ Aprovado |
| GATE_08 | [Sprint 4 RH Governança](./02_GATES/GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md) | Sprint 4 Governança + Fechamento + Dados | ✅ Aprovado |
| GATE_09 | [Reports Sprint 5](./02_GATES/GATE_09_REPORTS_SPRINT5.md) | Gate Relatórios Sprint 5 | ✅ P0+P1 Aprovado |
| GATE_10 | [UI Redesign](./05_UI_REDESIGN/GATE_UI_REDESIGN_v1.md) | Gate Redesign Visual (Ondas 1-5) | ✅ Wave1 PASSA / Wave2 NEXT |

---

## ✅ TODOs (Tarefas)

| ID | Nome | Sprint | Status |
|----|------|--------|--------|
| TODO_01 | [Strategic Pack S2 Bloco 1](./03_TODOS/TODO_01_STRATEGIC_PACK_S2_BLOCO1.md) | Sprint 2 - Bloco 1 (Structured Data) | ✅ Concluído |
| TODO_02 | [Strategic Pack S2 Bloco 2+3](./03_TODOS/TODO_02_STRATEGIC_PACK_S2_BLOCO2e3.md) | Sprint 2 - Blocos 2+3 (Ações + Gerar Plano) | ✅ Concluído |
| TODO_03 | [Planning S1 Stabilization](./03_TODOS/TODO_03_PLANNING_S1_STABILIZATION.md) | Sprint 1 - Estabilização e Compatibilidade | ✅ Concluído |
| TODO_04 | [Planning S2 MVP RH](./03_TODOS/TODO_04_PLANNING_SPRINT2_MVP_RH.md) | Sprint 2 - MVP RH Área-first | ✅ Concluído |
| TODO_05 | [E2E RH Sprint 3](./03_TODOS/TODO_05_E2E_RH_SPRINT3.md) | Sprint 3 - E2E RH + Hardening | ✅ Concluído |
| TODO_08 | [Fix ProdLocal RBAC UI RH](./03_TODOS/TODO_08_FIX_PRODLOCAL_RBAC_UI_RH.md) | Fixes Auditoria P0 | ✅ Concluído |
| TODO_09 | [Sprint 4 RH Governança](./03_TODOS/TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md) | Sprint 4 Governança + Fechamento + Dados | ✅ Concluído |
| TODO_06 | [Reports Sprint 5](./03_TODOS/TODO_06_REPORTS_SPRINT5.md) | Sprint 5 - Relatórios + Exportações | ✅ Concluído |

---

## 📊 Relatórios de QA

| ID | Nome | Data | Status |
|----|------|------|--------|
| QA_01 | [Strategic Pack Sprint 1](./04_REPORTS/QA_01_STRATEGIC_PACK_SPRINT1.md) | 04/02/2026 | ✅ Aprovado |
| QA_02 | [Strategic Pack Sprint 2 Bloco 1](./04_REPORTS/QA_02_STRATEGIC_PACK_SPRINT2_BLOCO1.md) | 05/02/2026 | ✅ Aprovado |
| QA_03 | [Planning Sprint 1](./04_REPORTS/QA_03_PLANNING_SPRINT1.md) | 05/02/2026 | ✅ Aprovado |
| QA_04 | [Planning Sprint 2 MVP RH](./04_REPORTS/QA_04_PLANNING_SPRINT2_MVP_RH.md) | 06/02/2026 | ✅ Aprovado |
| QA_05 | [E2E RH Sprint 3](./04_REPORTS/QA_05_E2E_RH_SPRINT3.md) | 06/02/2026 | ✅ Aprovado |
| REPORT_08 | [Audit ProdLocal RBAC UI RH](./04_REPORTS/REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md) | 06/02/2026 | ✅ Aprovado |
| QA_09 | [Sprint 4 RH Governança](./04_REPORTS/QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md) | 06/02/2026 | ✅ Aprovado |
| QA_06 | [Reports Sprint 5](./04_REPORTS/QA_06_REPORTS_SPRINT5.md) | 06/02/2026 | ✅ Aprovado |
| QA_07 | [Reports Sprint 5 P0](./04_REPORTS/QA_07_REPORTS_SPRINT5_P0_20260206_1814.md) | 06/02/2026 | ✅ 8/8 PASSA |
| QA_08 | [Reports Sprint 5 P1](./04_REPORTS/QA_08_REPORTS_SPRINT5_P1_20260206_1838.md) | 06/02/2026 | ✅ 8/8 PASSA |

---

## 🤖 Prompts

| ID | Nome | Uso |
|----|------|-----|
| PROMPT_GATE | [Gate Auditor](./05_PROMPTS/PROMPT_GATE_AUDITOR.md) | Auditoria de gates de aprovação |

---

## 📈 Status Atual do Projeto

### Strategic Pack (SPEC_01)
| Sprint | Bloco | Descrição | Status |
|--------|-------|-----------|--------|
| Sprint 1 | - | CRUD básico, seções, comentários, anexos | ✅ Aprovado |
| Sprint 2 | Bloco 1 | Structured Data (Objectives, KPIs, Programs, Governance) | ✅ Concluído |
| Sprint 2 | Bloco 2 | Vínculo com Ações (pack_id, program_key, objective_key) | ✅ Concluído |
| Sprint 2 | Bloco 3 | Gerar Plano de Ação (idempotência) | ✅ Concluído |

### Planning Module (SPEC_02)
| Sprint | Descrição | Status |
|--------|-----------|--------|
| Sprint 1 | Estabilização módulo Planejamento | ✅ Concluído |
| Sprint 2 | MVP RH Área-first | ✅ Concluído |
| Sprint 3 | E2E RH + Hardening | ✅ Concluído |
| Audit P0 | RBAC + UI + RH-only | ✅ Concluído |
| Sprint 4 | Governança + Fechamento + Dados Reais | ✅ Concluído |
| Sprint 5 | Relatórios + Exportações (SPEC_03) | ✅ Concluído (P0+P1) |
| UI Redesign | Blueprint v1.1 (SPEC_04) | ✅ R0+R1 DONE / R2 NEXT |

---

## 🗺️ Roadmap

> **[bluepoints.md](./bluepoints.md)** — Roadmap completo com 3 trilhas e dependências

## 🎯 Próximo Passo

**UI Redesign — Onda 2 (R2)** ([Status](./05_UI_REDESIGN/STATUS_UI_REDESIGN.md))
- Criar FilterBar + DataTable reutilizáveis
- Aplicar em Dashboard, Gerenciar Ações, Reports
- Heatmap raw colors (top-10 arquivos)
- **Meta: raw colors <= 760** (-10.8% do pós-W1)
- Toast em CRUD de ações

**Trilha paralela (após R2):** Sprint 6 — Histórico + PDF Avançado

---

## � Release v1.0.6

| Documento | Path | Status |
|-----------|------|--------|
| Release Notes | [RELEASE_NOTES_v1.md](./09_RELEASE/RELEASE_NOTES_v1.md) | ✅ Aprovado |
| Deploy Checklist | [DEPLOY_CHECKLIST_v1.md](./09_RELEASE/DEPLOY_CHECKLIST_v1.md) | ✅ Aprovado |
| Regression Matrix | [REGRESSION_MATRIX_v1.md](./09_RELEASE/REGRESSION_MATRIX_v1.md) | ✅ Aprovado |
| Backlog Consolidado | [BACKLOG_CONSOLIDADO_v1.md](./09_RELEASE/BACKLOG_CONSOLIDADO_v1.md) | ✅ Aprovado |
| QA Release | [QA_RELEASE_READINESS_20260225_2246.md](./09_RELEASE/QA_RELEASE_READINESS_20260225_2246.md) | ✅ 44/44 PASS |
| OUTPUT Release | [OUTPUT_RELEASE_READINESS_20260225_2246.md](./09_RELEASE/OUTPUT_RELEASE_READINESS_20260225_2246.md) | ✅ APROVADO |

### Ciclos Concluídos (completos)

| Ciclo | Output | Gate |
|-------|--------|------|
| Sprint 6 — Closings | [OUTPUT_CLOSINGS_SPRINT6](./06_CLOSINGS/OUTPUT_CLOSINGS_SPRINT6_20260209_0003.md) | 10/10 PASS |
| Sprint 7 — PDF | [OUTPUT_PDF_SPRINT7](./07_PDF/OUTPUT_PDF_SPRINT7_20260209_0026.md) | 15/15 PASS |
| Sprint 8 — Multi-area | [OUTPUT_MULTIAREA_SPRINT8](./08_MULTIAREA/OUTPUT_MULTIAREA_SPRINT8_20260209_0830.md) | 35/35 PASS |
| Waves 1–5 — UI Redesign | [OUTPUT_WAVE5](./05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE5_20260208_2341.md) | 889→88 raw colors |

---

## �📝 Notas

- Arquivos antigos ou deprecated devem ser movidos para `99_ARCHIVE/` com prefixo `YYYYMMDD_`
- Nomenclatura padrão: `TIPO_NN_NOME_CONTEXTO.md`
- Todos os caminhos são relativos à pasta `specs/`

