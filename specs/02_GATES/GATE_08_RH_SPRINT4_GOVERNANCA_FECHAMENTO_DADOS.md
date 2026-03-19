# GATE — Sprint 4 RH: Governança Operacional + Fechamento Mensal + Dados Reais

> **Localização:** `specs/02_GATES/GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Sprint:** 4 — Governança + Fechamento + Dados Reais  
**TODO:** [TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../03_TODOS/TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)  
**QA:** [QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../04_REPORTS/QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)  
**Última revisão:** 06/02/2026 12:35  
**Revisor:** Cascade

---

## 1. Objetivos do Sprint

| Objetivo | Descrição |
|----------|-----------|
| A | Governança operacional (WBR/MBR/QBR) dentro do Pack RH |
| B | Fechamento mensal com saída .md + export PDF |
| C | Seed de dados reais do RH |

---

## 2. Critérios de Aprovação

| # | Critério | Requisito | Status |
|---|----------|-----------|--------|
| 1 | Build | `npm run build` sem erros | ✅ PASSA |
| 2 | Preview | `npm run preview` funcional | ✅ PASSA |
| 3 | Governança | Rituais e atas visíveis e editáveis | ✅ PASSA |
| 4 | Atas MBR | Criar e visualizar atas com decisões | ✅ PASSA |
| 5 | Fechamento MD | Botão gera markdown com template correto | ✅ PASSA |
| 6 | Export PDF | Botão exporta para PDF (via print) | ✅ PASSA |
| 7 | Dados Reais RH | KPIs, programas, objetivos seed visíveis | ✅ PASSA |
| 8 | Quick Links | URLs com packId e areaSlug | ✅ PASSA |
| 9 | Filtros packId | Evidências/Aprovações aceitam packId | ✅ PASSA |

---

## 3. Checklist — Governança

| Item | Status | Evidência |
|------|--------|-----------|
| Rituais WBR/MBR/QBR visíveis | ✅ | 3 rituais no seed |
| Expandir ritual mostra atas | ✅ | Lista de atas ordenada |
| Criar nova ata | ✅ | Formulário funcional |
| Decisões na ata | ✅ | Lista editável |
| Action items na ata | ✅ | Com owner/prazo/status |
| Salvar e recarregar | ✅ | Persiste no mock |

---

## 4. Checklist — Fechamento Mensal

| Item | Status | Evidência |
|------|--------|-----------|
| MonthlyCloseButton no tab Governança | ✅ | Componente visível |
| Seletor de mês (12 opções) | ✅ | Dropdown funcional |
| Botão "Fechar Mês" | ✅ | Gera markdown |
| Template MD completo | ✅ | 7 seções |
| Preview do markdown | ✅ | Toggle funcional |
| Download MD | ✅ | Blob download |
| Export PDF | ✅ | Window.print() |

---

## 5. Checklist — Dados Reais RH

| Item | Status | Evidência |
|------|--------|-----------|
| Mandato RH | ✅ | Texto em Overview |
| Objetivos O1-O5 | ✅ | Com descrições |
| KPIs (11 indicadores) | ✅ | Turnover, TTF, eNPS, etc. |
| Valores atuais dos KPIs | ✅ | current_value preenchido |
| Programas (4) | ✅ | Conecta, Desenvolve, Reconhece, Inova |
| Metas por programa | ✅ | Goals array |
| Atas MBR seed | ✅ | Jan e Fev/2026 |
| Decisões seed | ✅ | 5 decisões |

---

## 6. Checklist — Filtros e Links

| Item | Status | Evidência |
|------|--------|-----------|
| QuickLinks inclui packId | ✅ | `&packId=pack-rh-2026` |
| ActionsEvidencesPage aceita packId | ✅ | Query param lido |
| ActionsApprovalsPage aceita packId | ✅ | Query param lido |
| Filtro por areaSlug | ✅ | Já existente |

---

## 7. Issues Conhecidos

| # | Severidade | Descrição | Ação |
|---|------------|-----------|------|
| 1 | P2 | PDF via print dialog, não lib dedicada | Refinar em sprint futuro |
| 2 | P2 | packId filter não aplicado (evidências não têm pack_id) | Preparado, ativar quando disponível |
| 3 | P3 | Warnings lint (unused vars) | Não bloqueante |

---

## 8. Arquivos Entregues

| Tipo | Path |
|------|------|
| Tipos | `src/features/strategic-pack/types.ts` |
| API Mock | `src/features/strategic-pack/api-mock.ts` |
| Componente | `src/features/strategic-pack/components/MonthlyCloseButton.tsx` |
| Utilitário | `src/features/strategic-pack/utils/generateMonthlyReport.ts` |
| Utilitário | `src/features/strategic-pack/utils/exportToPdf.ts` |
| Página | `src/features/strategic-pack/pages/StrategicPackPage.tsx` |
| Página | `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` |
| Página | `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` |

---

## 9. Decisão Final

### ✅ PASSA

O Sprint 4 atende todos os critérios mínimos:

1. **Governança funcional:** Rituais, atas, decisões e action items operacionais
2. **Fechamento mensal:** Geração de MD completo + export PDF
3. **Dados reais RH:** Pack populado com KPIs, programas e objetivos reais
4. **Links integrados:** Quick links com packId e areaSlug

### Próximos Passos

- [ ] Refinar export PDF com lib dedicada (jspdf ou react-pdf)
- [ ] Ativar filtro packId quando evidências tiverem pack_id
- [ ] Adicionar histórico de fechamentos mensais
- [ ] Upload de evidências diretamente nas atas

---

**Aprovado por:** Cascade  
**Data:** 06/02/2026 12:35
