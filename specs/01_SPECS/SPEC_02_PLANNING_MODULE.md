# SPEC — Módulo Planejamento (Planos de Ação) — Core único + Clusters por Área
**ID:** SPEC-PLN-ACTIONS-002  
**Versão:** 1.0  
**Data:** 2026-02-05  
**Status:** Draft para implementação (MVP RH)  
**Módulo:** **Planejamento** (novo) — gestão de Planos de Ação  
**Área piloto (MVP):** RH (`areaSlug=rh`)  
**Fonte AS-IS:** `PLANNING_MODULE_AS_IS.md` (estado atual)  

---

## 0) Resumo executivo
O módulo Planejamento já existe em boa parte como **wrappers** de `area-plans` e páginas dedicadas para **Templates / Aprovações / Backlog de Evidências**.  
O objetivo desta SPEC é transformar o estado atual em um **Core único e replicável**, com:

- **Rotas e navegação consistentes** (incluindo compatibilidade `/area-plans/*` via redirects).
- **Contexto de área estável** (AreaContext funcionando para tudo em `/planning/:areaSlug/*`).
- **Plano de Ação operável por área** (RH primeiro), com:
  - criação (wizard),
  - gestão (list/kanban/timeline),
  - evidências (upload/backlog),
  - aprovações,
  - templates.
- **Estrutura única de dados/UX**: mudar o modelo do plano de ação reflete para todas as áreas (clusters por área apenas configuram labels e taxonomias).

---

## 1) Objetivo
Consolidar o módulo **Planejamento** para permitir criação, gestão, acompanhamento, mensuração e governança de Planos de Ação por área — começando por RH — com arquitetura que permita replicação para demais áreas sem duplicação de código.

---

## 2) Critérios de sucesso (Definition of Success)
1) O usuário consegue iniciar em `/planning`, selecionar **RH**, e navegar por:
   - Dashboard, Kanban, Calendário, Timeline e Plano de Ação (por área).
2) O submódulo “Plano de Ação” (novo/gerenciar/templates/aprovações/evidências) funciona por área RH.
3) Rotas legadas `/area-plans/*` continuam funcionando via redirect por 6 meses (no mínimo).
4) Links internos incoerentes são corrigidos (não navega mais para `/area-plans/...` quando o user está no módulo novo).
5) Aprovações e backlog de evidências são acessíveis por páginas dedicadas e continuam filtrando por role.
6) O modelo de Planos de Ação é **Core único**: uma alteração no template/campos/validações vale para todas as áreas (RH agora, demais depois).

---

## 3) Escopo
### 3.1 Dentro do escopo (MVP RH)
- Reestruturação de rotas e navegação conforme MegaPlan (já em andamento).
- Consolidação do módulo `planning` como camada oficial (e `area-plans` como legado).
- Implementar “Area-first flow”:
  - `/planning` → seleção de área (RH no MVP).
  - Persistência da área selecionada (localStorage).
- Completar e estabilizar rotas por área:
  - `/planning/:areaSlug/dashboard|kanban|calendar|timeline`
- Submódulo “Plano de Ação”:
  - Criar novo (wizard)
  - Gerenciar existente (lista + detalhes)
  - Templates
  - Aprovações
  - Backlog de evidências
- Correções de bugs/gaps do AS-IS (ver seção 6).

### 3.2 Fora do escopo (agora)
- Multi-ano completo (2027+) com migração automatizada de planos.
- Otimizações avançadas (tree view virtualizado/paginado) — só após medir necessidade.
- Calendário avançado com carga de trabalho se ainda estiver placeholder (pode entrar MVP+).

---

## 4) Estado atual (AS-IS) — resumo do que já existe
### 4.1 Feature legada: `area-plans`
- Tipos (`types.ts`) com status e entidades: `AreaPlan`, `PlanAction`, `ActionEvidence`, `EvidenceBacklogItem`.
- Hooks (40+ React Query) e API mock (com supabase comentado).
- Páginas ativas: list, dashboard, detalhe por área, kanban por área, timeline por área.
- Componentes já prontos:
  - `ApprovalPanel` + `EvidenceBacklogList`
  - `EvidencePanel`
  - `TemplateSelector`
  - `PlanAlertsWidget`
  - `CommentsList`

### 4.2 Módulo novo: `planning`
- Rotas `/planning/*` com wrappers:
  - dashboard/kanban/timeline usando páginas de `area-plans`
- Páginas dedicadas já existem:
  - `/planning/actions/templates`
  - `/planning/actions/approvals`
  - `/planning/actions/evidences`
- Contexto de área existe:
  - `planning/contexts/AreaContext.tsx` (staleTime 10 min)

---

## 5) Princípios de arquitetura (Core vs Área)
### 5.1 Motor único (Core)
Tudo que é estrutura/contrato/regra deve viver em um núcleo único:
- Tipos e enums (status, prioridade, node_type)
- Schemas Zod
- Hooks React Query + query keys
- Serviços/API
- Componentes genéricos (kanban, timeline, tabela, painel evidências, aprovação, templates)
- Regras de WIP, validações e gatilhos (futuro)

### 5.2 Clusters por área (config, não duplicação)
Área define apenas:
- labels, cores, ícones
- “programKey”/taxonomias (ex.: RH: Conecta/Desenvolve/Reconhece/Inova)
- filtros default e “owners”
- seeds de templates (opcional)

> Importante: RH é piloto; as demais áreas entram como `config.ts` + templates, sem duplicar componentes.

---

## 6) Lacunas e correções obrigatórias (AS-IS)
### 6.1 Bugs
- **BUG-001:** redirect `/planning/:areaSlug` com replace string vazia (corrigir para redirect explícito para `/planning/:areaSlug/dashboard`).
- **BUG-002:** `AreaPlansTimeline` usa `slug` em vez de `areaSlug` no `useParams` (padronizar).
- **BUG-003:** rota `/area-plans/:areaSlug/approvals` definida sem componente — resolver com redirect para `/planning/actions/approvals` (ou criar página wrapper legada).

### 6.2 Gaps funcionais
- **GAP-001:** `?tab=evidences` em `AreaPlansListPage` não persiste (ajustar state + back navigation).
- **GAP-002:** links internos ainda apontam para `/area-plans/*`:
  - corrigir `navigate(`/area-plans/${areaSlug}`)` para `/planning/${areaSlug}/dashboard`
  - corrigir `<Link to={`/area-plans/${areaSlug}/approvals`}>` etc.
- **GAP-003:** `AreaContext` não integrado globalmente (definir escopo correto: Provider para subtree `/planning/:areaSlug/*`).
- **GAP-004:** `PlanningAreaCalendarPage` placeholder (definir MVP: usar o `PlanningCalendarPage` ou reduzir escopo).
- **GAP-005:** `CreatePlanWizard` não utilizado (decidir: eliminar ou promover como wizard oficial com templates).

---

## 7) Navegação e rotas (TO-BE)
### 7.1 Menu (alto nível)
- Visão Geral
- Gerencial (antigo Planejamento — Estratégia/Metas/Indicadores/Áreas)
- **Planejamento** (novo)
  - Dashboard
  - Kanban
  - Calendário (planos)
  - Timeline
  - Plano de Ação
    - Criar Novo
    - Gerenciar Existente
    - Templates
    - Aprovações
    - Backlog de Evidências

### 7.2 Rotas principais
**Sem área**
- `/planning` (home: seletor de área + cards)
- `/planning/dashboard|kanban|calendar|timeline` (visão geral — opcional, pode ser “agregada”)

**Por área (MVP RH)**
- `/planning/:areaSlug/dashboard`
- `/planning/:areaSlug/kanban`
- `/planning/:areaSlug/calendar`
- `/planning/:areaSlug/timeline`

**Plano de ação (global ou filtrável por área)**
- `/planning/actions/new`
- `/planning/actions/manage`
- `/planning/actions/templates`
- `/planning/actions/approvals`
- `/planning/actions/evidences`

### 7.3 Compatibilidade (legado)
- `/area-plans/*` deve redirecionar para as rotas equivalentes em `/planning/*` por no mínimo 6 meses.
- Links internos devem ser migrados para `/planning/*`.

---

## 8) Estrutura recomendada de diretórios (TO-BE)
Manter o que já existe, mas evoluir para:

```
src/features/planning/
  core/
    api/
    hooks/
    types/
    schemas/
    components/
    pages/
    utils/
  areas/
    rh/
      config.ts
      templates.seed.ts (opcional)
      mapping.ts (opcional)
  contexts/
    AreaContext.tsx (pode ir para core/contexts no futuro)
  pages/
    ... (wrappers ou composição)
```

> MVP pode manter wrappers, mas o objetivo é mover lógica para `core/` e manter `area-plans` como legado com re-exports (transição).

---

## 9) Contratos de dados (core)
### 9.1 Enums/status (existentes — manter)
- `AreaPlanStatus = RASCUNHO | EM_APROVACAO | ATIVO | CONCLUIDO | ARQUIVADO`
- `ActionStatus = PENDENTE | EM_ANDAMENTO | BLOQUEADA | AGUARDANDO_EVIDENCIA | EM_VALIDACAO | CONCLUIDA | CANCELADA`
- `EvidenceStatus = PENDENTE | APROVADA_GESTOR | APROVADA | REJEITADA`
- `ActionPriority = P0 | P1 | P2`
- `NodeType = macro | area | meta | pilar | acao`

### 9.2 Campos mínimos adicionais (para governança por área)
- `areaSlug` como dimensão oficial (já existe)
- `programKey` (string) — área define o conjunto (RH: conecta/desenvolve/reconhece/inova)
- `objectiveKey` (string) — O1..O5 por área (opcional no MVP; recomendável)

> Esses campos habilitam o submódulo PE-2026 (Área) e rastreabilidade.

---

## 10) Regras de UX e governança (MVP)
- Área selecionada deve persistir (localStorage).
- Ao entrar em `/planning`, se existir `lastAreaSlug` salvo, sugerir “Continuar em RH”.
- WIP (pesada vs leve) pode entrar no template do plano (não obrigatório no MVP, mas preparado).

---

## 11) Permissões (RBAC)
Reusar mecanismo atual (já filtra por role em evidências/aprovações).
Perfis:
- Admin/Direção: aprova como direção
- Gestor: aprova como gestor
- Responsável: envia evidência
- Viewer: leitura

Critérios:
- Aprovações sempre registram decisão (approve/reject) + note.
- Rotas de Aprovações e Evidências devem respeitar RBAC.

---

## 12) Critérios de aceitação (MVP RH)
- [ ] Menu exibe “Gerencial” e “Planejamento” conforme estrutura.
- [ ] `/planning` abre e permite selecionar RH (persistência).
- [ ] `/planning/rh/dashboard|kanban|calendar|timeline` funcionam sem bugs.
- [ ] `/planning/actions/approvals` e `/planning/actions/evidences` funcionam e reaproveitam componentes existentes.
- [ ] `PlanAlertsWidget` continua abrindo backlog de evidências corretamente.
- [ ] `/area-plans/*` redireciona para `/planning/*` (incluindo approvals).
- [ ] Links internos corrigidos (sem navegação para `/area-plans/*`).
- [ ] Build passa sem erros.

---

## 13) Plano de implementação (incremental e seguro)
### Sprint 1 — Estabilização e compatibilidade
1) Corrigir BUG-001, BUG-002, BUG-003
2) Implementar redirects legados `/area-plans/*` → `/planning/*`
3) Corrigir links internos (`navigate`, `<Link>`) para `/planning/*`
4) Implementar `?tab=evidences` compatível

### Sprint 2 — MVP RH completo
1) `PlanningHomePage` com `AreaSelector` (RH no MVP)
2) Contexto de área estável (`AreaContext Provider` no subtree)
3) Páginas por área (dashboard/kanban/timeline/calendar)
4) Plano de Ação: new/manage/templates/approvals/evidences

### Sprint 3 — Core vs Área (evitar duplicação)
1) Migrar componentes comuns para `planning/core/`
2) `areas/rh/config.ts` com taxonomias e seeds
3) Preparar replicação para outras áreas (sem ativar)

---

## 14) Riscos e mitigação
- **Quebra de URLs:** manter redirects por 6 meses + testes de rotas.
- **Duplicação de lógica:** wrappers só no MVP; mover para core em Sprint 3.
- **Mock vs Supabase:** manter interfaces e tipos consistentes.
- **Query keys inconsistentes:** unificar namespace (planejamento/core).

---

## 15) Entregáveis
- Rotas e navegação implementadas conforme TO-BE
- Módulo Planejamento operacional para RH (MVP)
- Redirecionamento/compatibilidade para legado
- Estrutura `planning/core` preparada para expansão multiárea

---
