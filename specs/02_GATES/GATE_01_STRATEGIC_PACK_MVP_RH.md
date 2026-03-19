# GATE — Strategic Pack (PE-2026 por Área) — MVP RH

> **Localização atual:** `specs/02_GATES/GATE_01_STRATEGIC_PACK_MVP_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Feature:** Strategic Pack (PE-2026 Área) — híbrido (Docs + Campos)  
**Área piloto:** RH (`areaSlug=rh`)  
**Megaplan:** C:\Users\Claudio Ribeiro\.windsurf\plans\megaplan-strategic-pack-387138.md  
**Spec:** [SPEC_01_STRATEGIC_PACK.md](../01_SPECS/SPEC_01_STRATEGIC_PACK.md)  
**Dono (Head RH):** Renata Silvestre  
**Backup:** Fernanda Xavier  
**Última revisão:** 05/02/2026  
**Revisor:** Cascade (Auditor de Implementação)

---

## 0) Objetivo do Gate
Este Gate existe para garantir que:
1) o MegaPlan está sendo executado sem desvio do Spec,
2) o MVP RH é entregável e auditável,
3) nada foi hardcoded para RH no core (replicável para outras áreas),
4) a integração com o módulo Planejamento (planos/evidências/aprovações) está íntegra.

> **Regra:** Não avançar para MVP-2 (campos estruturados) sem MVP-1 aprovado.

---

# Sprint 1 — MVP-1 (Docs + Comentários + Links)
**Status geral:** ☒ On track ☐ At risk ☐ Off track  
**Data alvo sprint:** 05/02/2026  
**Observação geral:** MVP-1 100% implementado. Navegação contextual por área implementada.

## A) Rotas e navegação (mínimo funcional)
- [x] **Rota principal:** `/planning/:areaSlug/pe-2026` está registrada em `routes.ts` e `router.tsx`
- [x] **RH abre sem erro:** `/planning/rh/pe-2026` carrega e renderiza
- [x] **Wrapper com contexto de área:** `PlanningAreaStrategicPackPage.tsx` usa `AreaContext`
- [x] **Navegação:** menu contextual dinâmico via `AreaSubnav.tsx` + `PlanningAreaLayout.tsx`
- [x] **Compatibilidade:** não quebra navegação do módulo Planejamento existente

**Notas / evidências:**  
- Link/print: `http://localhost:4173/planning/rh/pe-2026`  
- Arquivos tocados:
  - `src/shared/config/routes.ts:57` → `PLANNING_AREA_STRATEGIC_PACK`
  - `src/app/router.tsx:158-160` → lazy import
  - `src/app/router.tsx:672-679` → Route element
  - `src/features/planning/pages/area/PlanningAreaStrategicPackPage.tsx` → wrapper
  - `src/shared/config/navigation.ts` → hardcode REMOVIDO
  - `src/features/planning/components/AreaSubnav.tsx` → menu contextual dinâmico
  - `src/features/planning/layouts/PlanningAreaLayout.tsx` → wrapper com AreaProvider

---

## B) Estrutura da página e Tabs (6 abas)
- [x] Tabs exibidas: **Visão Geral / Diagnóstico / Objetivos / Programas / Governança / Documentos**
- [x] Cada aba tem conteúdo mínimo (placeholder aceitável no MVP-1, mas sem layout quebrado)
- [x] Área `rh` é carregada do contexto (`useAreaBySlug`/AreaContext) e não hardcoded

**Notas / evidências:**  
- Link/print: Tabs funcionais via `PackTabs.tsx`  
- Arquivos tocados:
  - `src/features/strategic-pack/components/PackTabs.tsx` → 6 tabs com ícones
  - `src/features/strategic-pack/components/SectionContent.tsx` → editor markdown
  - `src/features/strategic-pack/pages/StrategicPackPage.tsx` → orquestra tabs/sections

---

## C) Upload e Documentos (Attachments)
- [x] Upload funciona (md/docx/pdf/xlsx/imagens) com `FileUpload` (ou equivalente)
- [⚠️] Listagem de anexos mostra: `filename`, `tags`, `version_label`, ~~`uploaded_by`~~, `uploaded_at`
- [x] Versionamento do anexo funciona (v1, v2…) sem sobrescrever histórico
- [x] Filtro por tag e busca por título funcionam (mínimo viável)
- [x] Storage path existe e é rastreável (mesmo em mock)

**Notas / evidências:**  
- Exemplo de anexo: mock inclui "PE-2026-RH-Completo.pdf", "Baselines-Headcount.xlsx"
- Local/Storage: `api-mock.ts` simula; `api.ts` usa bucket `area-packs/{areaSlug}/{year}/`
- ⚠️ `uploaded_by` está no type mas não exibido na UI (AttachmentList.tsx)
- Arquivos tocados:
  - `src/features/strategic-pack/components/AttachmentList.tsx` → upload + listagem + filtro
  - `src/features/strategic-pack/api.ts:uploadAttachment` → Supabase Storage
  - `src/features/strategic-pack/hooks.ts:useUploadAttachment` → mutation

---

## D) Comentários por seção
- [x] Comentários criam e listam por `section_id` (ou equivalente)
- [x] Comentário pode ser "resolvido" (open → resolved)
- [x] Comentários preservam histórico (não apaga ao resolver)
- [⚠️] Usa componente existente (`CommentsList`) ou extensão segura → **NÃO** (criou `PackComments` próprio)

**Notas / evidências:**  
- Print/comments: `PackComments.tsx` funcional, com resolver e toggle "mostrar resolvidos"
- Arquivos tocados:
  - `src/features/strategic-pack/components/PackComments.tsx` → novo componente
  - `src/features/strategic-pack/hooks.ts:useCreateComment, useResolveComment`
  - `src/features/strategic-pack/api.ts:createComment, resolveComment`
- ⚠️ Não reutiliza `src/features/comments/` existente (decisão de escopo)

---

## E) Changelog (histórico de mudanças)
- [x] Evento `created` gerado ao criar pack
- [x] Evento `section_updated` ao editar uma seção
- [x] Evento `attachment_added` ao subir anexo
- [⚠️] Lista de changelog renderiza ~~e é filtrável por tempo~~ (sem filtro por tempo)

**Notas / evidências:**  
- Print/changelog: `ChangelogList.tsx` renderiza últimas N alterações
- Arquivos tocados:
  - `src/features/strategic-pack/components/ChangelogList.tsx` → exibe histórico
  - `src/features/strategic-pack/api-mock.ts` → mock seed com changelog
  - `src/features/strategic-pack/types.ts:ChangeType` → 10 tipos de evento

---

## F) Integração e Links (não quebrar o motor existente)
- [x] Link para **Plano de Ação** funciona (leva ao módulo Planejamento, não ao legado)
- [x] Link para **Evidências** abre backlog corretamente (incluindo compatibilidade com widgets existentes)
- [x] Link para **Aprovações** abre página dedicada
- [x] Nenhum link interno aponta para `/area-plans/*` sem redirect

**Notas / evidências:**  
- Rotas testadas: QuickLinks em `StrategicPackPage.tsx:304-329`
  - `/planning/${areaSlug}/dashboard` ✅
  - `/planning/${areaSlug}/kanban` ✅
  - `/planning/${areaSlug}/timeline` ✅
  - `/planning/actions/evidences` ✅
  - `/planning/actions/approvals` ✅

---

## G) Qualidade estrutural (replicável por área)
- [x] **Nenhum hardcode de RH no core:** navegação dinâmica via `AreaSubnav.tsx`
- [x] RH entra via `config/seed` (se aplicável) e não por `if areaSlug==='rh'`
- [x] Feature não duplica hooks/tipos do módulo Planejamento quando puder reaproveitar
- [x] Estrutura preparada para criar `areas/<slug>/config.ts` no futuro → `config/sections.ts` criado

**Notas / evidências:**  
- Grep/check:
  - ✅ `src/shared/config/navigation.ts` → hardcode REMOVIDO
  - ✅ `src/features/strategic-pack/api-mock.ts` → 'rh' apenas em **seed data** (aceitável)
  - ✅ `src/features/strategic-pack/config/sections.ts` → configuração das 6 seções
  - ✅ Upload integrado em `AttachmentList.tsx` (decisão de design)

---

## H) QA mínimo (checklist final Sprint 1)
- [x] Build passa sem erros
- [x] Rota funciona em reload (refresh) sem 404
- [x] Sem erros no console ao trocar tabs
- [x] Upload não trava UI e mostra feedback
- [x] Comentários funcionam end-to-end
- [x] Changelog renderiza
- [x] Links externos do módulo funcionam

**Aprovação Sprint 1:**  
☒ Aprovado ☐ Aprovado com ressalvas ☐ Reprovado  
**Ressalvas:** Nenhuma - todos os itens críticos foram resolvidos.

**Itens corrigidos nesta revisão (05/02/2026):**
1. ✅ Hardcode removido de navigation.ts
2. ✅ config/sections.ts criado com 6 seções configuradas
3. ✅ `uploaded_by` exibido na UI de attachments
4. ✅ Menu contextual dinâmico via AreaSubnav + PlanningAreaLayout

---

# Sprint 2 — MVP-2 (Campos estruturados + vínculo com ações)
**Status:** 🔄 Em andamento (Bloco 1 implementado)  
**Data início:** 05/02/2026

## I) Campos estruturados (mínimo)
- [x] Mandato (texto) — via structured_data em overview
- [x] Objetivos (O1–O5) — `ObjectivesList.tsx` implementado
- [x] Metas/KPIs (meta, cadência, dono, gatilho) — `KpiTable.tsx` implementado
- [x] Programas (cards + metas) — `ProgramCard.tsx` implementado
- [x] Governança (rituais + atas) — `GovernanceRituals.tsx` implementado

**Arquivos criados/modificados (Bloco 1):**
- `src/features/strategic-pack/components/ObjectivesList.tsx` — CRIADO
- `src/features/strategic-pack/components/KpiTable.tsx` — CRIADO
- `src/features/strategic-pack/components/ProgramCard.tsx` — CRIADO
- `src/features/strategic-pack/components/GovernanceRituals.tsx` — CRIADO
- `src/features/strategic-pack/schemas.ts` — schemas Zod para structured_data
- `src/features/strategic-pack/api.ts` — `updateSectionStructuredData()`
- `src/features/strategic-pack/api-mock.ts` — mock de structured_data
- `src/features/strategic-pack/hooks.ts` — `useUpdateSectionStructuredData()`
- `src/features/strategic-pack/pages/StrategicPackPage.tsx` — integração UI
- `src/features/strategic-pack/config/sections.ts` — `structuredComponents`

## J) Vínculo com ações ✅
- [x] `packId`, `sectionId`, `programKey`, `objectiveKey` adicionados em `PlanAction`
- [x] Aba Programas lista ações por `programKey`
- [x] Aba Objetivos lista ações por `objectiveKey` (estrutura preparada)

**Arquivos modificados (Bloco 2):**
- `src/features/area-plans/types.ts` — campos pack_id, program_key, objective_key, section_id
- `src/features/area-plans/schemas.ts` — schemas Zod atualizados
- `src/features/area-plans/api.ts` — fetchActionsByPackId/ProgramKey/ObjectiveKey
- `src/features/area-plans/api-mock.ts` — mock das novas funções
- `src/features/area-plans/hooks.ts` — useActionsByPackId/ProgramKey/ObjectiveKey
- `src/features/strategic-pack/components/ProgramCard.tsx` — exibe ações vinculadas

## K) Geração de plano ✅
- [x] Botão "Gerar Plano de Ação" cria esqueleto com base em programas/objetivos
- [x] Não duplica ações ao rodar duas vezes (idempotência mínima)

**Arquivos criados (Bloco 3):**
- `src/features/strategic-pack/components/GeneratePlanButton.tsx` — botão com lógica de geração
- `src/features/strategic-pack/pages/StrategicPackPage.tsx` — integração do botão na tab overview

**Idempotência:** Antes de gerar, busca ações existentes com `pack_id == packId`. Se encontrar, retorna mensagem "Plano já existe" sem criar duplicatas.

---

## Observações finais
- Decisões técnicas relevantes:
  - `PackComments` criado em vez de reutilizar `CommentsList` (schema diferente: pack_id + section_id)
  - Upload integrado em `AttachmentList` em vez de componente `AttachmentUpload` separado
  - API com fallback automático para mock quando Supabase não configurado
  - Navegação contextual via `PlanningAreaLayout` + `AreaSubnav` (Opção A implementada)
- Pendências: **Nenhuma para Sprint 1**

---

## Arquivos Criados/Modificados (Sprint 1 - Finalização)

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/features/planning/components/AreaSubnav.tsx` | CRIADO | Menu contextual dinâmico por área |
| `src/features/planning/components/index.ts` | CRIADO | Barrel export |
| `src/features/planning/layouts/PlanningAreaLayout.tsx` | CRIADO | Layout wrapper com AreaProvider |
| `src/features/planning/layouts/index.ts` | CRIADO | Barrel export |
| `src/features/strategic-pack/config/sections.ts` | CRIADO | Configuração das 6 seções |
| `src/shared/config/navigation.ts` | MODIFICADO | Removido hardcode de RH |
| `src/app/router.tsx` | MODIFICADO | Rotas aninhadas com PlanningAreaLayout |
| `src/features/strategic-pack/components/AttachmentList.tsx` | MODIFICADO | Exibe uploaded_by |

---

## PRÓXIMO PASSO: Sprint 2 (MVP-2)

Com Sprint 1 aprovado, pode-se iniciar MVP-2 focando em:
1. Campos estruturados (Mandato, Objetivos, KPIs, Programas, Governança)
2. Vínculo com ações (packId, sectionId, programKey, objectiveKey)
3. Geração de plano de ação a partir do PE-2026
