# SPEC — PE-2026 (Área) — Strategic Pack híbrido (Documentos + Campos)
**ID:** SPEC-PLN-PEAREA-001  
**Versão:** 1.1  
**Data:** 2026-02-05  
**Status:** Draft para implementação (MVP RH)  
**Módulo:** Planejamento → Área → **PE-2026 (Área)**  
**Área piloto (MVP):** RH (`areaSlug = rh`)  
**Princípio estrutural:** **1 plataforma / 1 core** (mudou estrutura → muda para todas as áreas) + **clusters por área** (conteúdo/config).

---

## 0) Resumo executivo
Criar um submódulo “PE-2026 (Área)” que funcione como **caderno vivo** do planejamento da área, com abordagem **híbrida**:

- **Camada Docs (rápida):** upload + catalogação + versões + comentários (ativa em poucos dias).
- **Camada Campos (governável):** objetivos, metas, KPIs, programas, governança, decisões (evolui para “fonte única”).

O módulo deve **conectar estratégia ↔ execução**, reaproveitando o que já existe no motor de Planos de Ação (evidências, aprovações, templates, comentários), sem duplicar lógica.

---

## 1) Objetivo
Permitir que a área (começando por RH) consiga:

1) **Revisitar** embasamento e decisões (docs oficiais e anexos com versionamento).  
2) **Interagir** com o gestor (comentários por seção, solicitações, histórico de mudanças).  
3) **Conectar** planejamento e execução (ações/planos vinculados a seções/programas/objetivos do caderno).  
4) **Governar** (rituais, atas, decisões e evidências rastreáveis).

---

## 2) Jobs-to-be-done (JTBD)
- **Gestor da área:** “Quero revisitar rapidamente o porquê do plano e ajustar sem perder rastreabilidade.”  
- **Head/PMO da área:** “Quero manter uma fonte única, versionada, conectada às ações e evidências.”  
- **Direção:** “Quero auditar o plano da área, ver evolução e aprovar mudanças estruturais.”  
- **Operação (usuário):** “Quero saber o que está valendo como plano e onde registrar evidência.”

---

## 3) Critérios de sucesso (Definition of Success)
1) Gestor acessa o caderno da área e encontra **Diagnóstico / Metas / Programas / Governança** em < 2 min.  
2) Comentários por seção funcionam, com **resolver** e **registro de histórico**.  
3) Uma ação do Plano de Ação pode apontar para:
   - objetivo do ano (O#)
   - programa da área (ex.: Conecta/Desenvolve/Reconhece/Inova)
   - seção do Strategic Pack
4) O Strategic Pack consegue listar **ações ativas** (Kanban/Tabela) por seção/programa.  
5) Estrutura única: alterar schema/estrutura no core reflete para todas as áreas futuras sem duplicação.

---

## 4) Escopo
### 4.1 MVP-1 (híbrido por Docs)
- Página `/planning/:areaSlug/pe-2026` com **tabs**:
  1) Visão Geral
  2) Diagnóstico e Base
  3) Objetivos e Metas
  4) Programas e Iniciativas
  5) Governança e Evidências
  6) Documentos (Uploads + versões)
- Upload/catálogo de anexos (md/docx/pdf/xlsx/imagens) + tags + versão do anexo
- Comentários por seção (reuso de Comments) + “resolver”
- ChangeLog básico (quem alterou, quando, o quê)
- Integração de navegação com:
  - Backlog de evidências
  - Aprovações
  - Plano de Ação (kanban/lista)

### 4.2 MVP-2 (campos estruturados mínimos)
- Campos estruturados mínimos:
  - Mandato (texto curto)
  - Objetivos do ano (lista)
  - Metas/KPIs (meta, cadência, dono, gatilho)
  - Programas da área (lista + metas do programa)
  - Governança (WBR/MBR/QBR) com atas
- Vínculo Section → Action Items (programKey + sectionId)
- Botão “Gerar/Atualizar Plano de Ação a partir do Pack” (gera esqueleto/sugere)

### 4.3 Fora do escopo (por enquanto)
- Editor rich-text avançado com diff inline tipo Google Docs
- OCR e extração automática obrigatória de PDFs
- IA auto-preenchendo campos como obrigação (apenas sugestão futura)
- Multi-ano completo (2027+) — manter preparado, mas MVP é 2026

---

## 5) Premissas e restrições
- **Híbrido:** docs são fonte rápida; campos estruturados evoluem como “fonte única”.
- **Core único:** schema do pack é compartilhado (evitar RH-only hardcoded).
- **Área piloto:** RH; demais áreas entram por config/seed sem duplicar código.
- **Compatibilidade:** links legados (evidences/approvals) devem continuar acessíveis via redirects do módulo Planejamento.

---

## 6) Arquitetura de informação e UX
### 6.1 Local na navegação
- **Recomendação:** “PE-2026 (Área)” em **Gerencial → Áreas → [Área] → PE-2026** (contexto e embasamento).  
- **Execução:** em **Planejamento → [Área] → Plano de Ação / Kanban / Evidências / Aprovações**.

> MVP pode viver em Planejamento por simplicidade; mas a distinção “contexto vs execução” é importante no produto final.

### 6.2 Tabs (conteúdo mínimo por tab)
**Tab 1 — Visão Geral**
- Mandato (1 parágrafo)
- Objetivos do ano (O1…)
- KPIs do mês (snapshot — leitura)
- Programas da área (cards com status)
- Links rápidos (Plano de Ação, Evidências, Aprovações, última ata)

**Tab 2 — Diagnóstico e Base**
- Baselines (ex.: 52/59/63/67–70 no RH)
- Premissas e restrições
- Fontes (docs anexados + links)

**Tab 3 — Objetivos e Metas**
- Objetivos O1…O5 (texto curto)
- Metas mensuráveis (macro)
- KPIs (nome, definição curta, cadência, dono, meta, gatilho)

**Tab 4 — Programas e Iniciativas**
- Lista de programas (programKey)
- Metas por programa
- Iniciativas ativas (puxa do Plano de Ação filtrando por programKey/sectionId)
- Evidência mínima esperada (resumo)

**Tab 5 — Governança e Evidências**
- Rituais (WBR/MBR/QBR)
- Atas (histórico)
- Decisões (log)
- Evidências (biblioteca + backlog)

**Tab 6 — Documentos**
- Upload + listagem
- Versionamento (v1, v2)
- Tags + filtro + busca por título
- (MVP-2) links de “referência” para seções/campos

---

## 7) Modelo de dados (Core)
### 7.1 Entidade principal
**AreaStrategicPack**
- id
- areaSlug
- year (ex.: 2026)
- status: `draft | review | published | archived`
- version: string (ex.: 1.0, 1.1)
- owners: `{ headName, backupName }`
- summary (texto curto)
- createdAt / updatedAt
- sections: `AreaPackSection[]`
- attachments: `PackAttachment[]`
- references: `PackReference[]`
- comments: `PackComment[]`
- changeLog: `PackChangeLog[]`

### 7.2 Seções estruturadas
**AreaPackSection**
- id
- key (enum): `overview | diagnosis | objectives | programs | governance | docs`
- title
- bodyMarkdown (opcional no MVP-1)
- structuredData (JSON, MVP-2)
- lastUpdatedAt / lastUpdatedBy

### 7.3 Anexos
**PackAttachment**
- id
- packId
- filename
- contentType
- storageUrl
- tags: string[]
- versionLabel (ex.: v1, v2)
- uploadedBy / uploadedAt
- checksum (opcional)

### 7.4 Referências
**PackReference**
- id
- packId
- type: `plan | action | evidence | approval | externalDoc`
- label
- url
- metadata (JSON opcional)

### 7.5 Comentários e auditoria
**PackComment**
- id
- packId
- sectionId (nullable)
- author
- body
- createdAt
- status: `open | resolved`

**PackChangeLog**
- id
- packId
- actor
- changeType: `created | updated | published | attachment_added | section_updated | status_changed`
- before (json) / after (json)
- createdAt

---

## 8) Integração com Planos de Ação (loop fechado)
### 8.1 Campos mínimos adicionais no Item de Ação (se ainda não existir)
- `packId` (opcional)
- `packSectionId` (opcional)
- `programKey` (string) — por área (RH: conecta/desenvolve/reconhece/inova)
- `objectiveKey` (string) — O1..O5 (ou equivalente por área)

### 8.2 Regras de vínculo
- Ação pode ser vinculada a:
  - 1 programa (obrigatório no RH)
  - 0..1 seção do pack (recomendado)
  - 0..1 objetivo do ano (recomendado)

### 8.3 Reuso de componentes existentes
- Evidence backlog + approvals
- Evidence panel (upload/visualização)
- Comments list (por seção)
- Templates (se aplicável)

---

## 9) Permissões (RBAC)
### Papéis
- **Direção/Admin:** cria/edita/publica pack; aprova mudanças; vê tudo.
- **Head da área:** edita conteúdo; publica para review; valida evidências.
- **Gestor/Líder:** comenta; solicita ajustes; anexa evidências (se permitido).
- **Viewer:** leitura.

### Regras
- Publicar `published` exige sign-off (Direção ou Head).
- Somente Head/Admin pode alterar campos estruturados “de governança” (metas/KPIs) em MVP-2.
- Comentários: todos com acesso à área podem comentar (config).

---

## 10) API (mínimo)
- `GET /api/area-packs/:areaSlug/:year`
- `POST /api/area-packs/:areaSlug/:year`
- `PATCH /api/area-packs/:id`
- `POST /api/area-packs/:id/attachments`
- `GET /api/area-packs/:id/attachments`
- `POST /api/area-packs/:id/comments`
- `PATCH /api/area-packs/:id/comments/:commentId` (resolve)
- `GET /api/area-packs/:id/changelog`

---

## 11) Não-funcionais (NFR)
- Performance: tabs com lazy-load de anexos e paginação de lista de docs.
- Segurança: RBAC aplicado em rotas e APIs; evidências podem conter dados sensíveis.
- Auditoria: qualquer publicação e alteração de metas/KPIs gera changelog.
- Usabilidade: busca/filtro por tags e título na aba Documentos.

---

## 12) Critérios de aceitação (MVP RH)
**Funcional**
- [ ] `/planning/rh/pe-2026` abre com tabs e conteúdo mínimo.
- [ ] Upload + listagem + versão de anexos funciona.
- [ ] Comentários por seção: criar, listar, resolver.
- [ ] Changelog registra alterações e publicação.
- [ ] Aba Programas lista ações do RH filtrando por `programKey`.
- [ ] Links para Evidências/Aprovações/Plano de Ação funcionam.

**Estrutural**
- [ ] Nenhum componente RH-only no core; RH entra via `areas/rh/config`.
- [ ] Mudança no schema do pack reflete para outras áreas futuras.

---

## 13) Plano de implementação (duas sprints)
### Sprint 1 — MVP-1 (Docs + comentários + links)
- Model e endpoints do pack
- UI tabs
- Upload docs + listagem/versões + tags
- Comentários por seção
- Integração com links (evidences/approvals/plan)

### Sprint 2 — MVP-2 (Campos estruturados mínimos)
- Campos mandatórios: objetivos/metas/KPIs/programas/rituais
- Vínculo sectionId ↔ action items
- Botão “gerar/update plano de ação” (esqueleto)

---

## 14) Riscos e mitigação
- **Duplicação docs vs campos:** docs são fonte inicial; campos evoluem e passam a ser “fonte única”.
- **Escopo estourar:** Sprint 1 enxuta; Sprint 2 incremental.
- **Acoplamento ao RH:** RH via config/seed; core genérico.
- **Conflito de versões:** status + changelog + sign-off.

---

## 15) Questões em aberto (para fechar no AS-IS)
- Onde o upload será armazenado (storage) e qual padrão de URL.
- Como o módulo atual modela “Área” e permissões (RBAC).
- Se existe modelo de Comments e como reutilizar (ideal).
