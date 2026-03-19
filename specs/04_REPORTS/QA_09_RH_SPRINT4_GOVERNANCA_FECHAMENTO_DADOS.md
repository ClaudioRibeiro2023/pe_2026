# QA — Sprint 4 RH: Governança Operacional + Fechamento Mensal + Dados Reais

> **Localização:** `specs/04_REPORTS/QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Sprint:** 4 — Governança + Fechamento + Dados Reais  
**Data:** 06/02/2026  
**Executor:** Cascade  
**TODO:** [TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../03_TODOS/TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)  
**Gate:** [GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../02_GATES/GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)

---

## 1. Escopo do QA

| Área | Descrição |
|------|-----------|
| Governança | Rituais WBR/MBR/QBR, atas, decisões |
| Fechamento Mensal | Geração MD + Export PDF |
| Dados Reais RH | Seed com KPIs, programas, objetivos reais |
| Filtros | packId em evidências/aprovações |

---

## 2. Build + Preview

### Comandos

```powershell
npm run build   # TypeScript + Vite build
npm run preview # Serve dist/ em modo produção
```

### Resultado do Build

| Item | Status | Detalhes |
|------|--------|----------|
| TypeScript (`tsc -b`) | ✅ | Sem erros críticos |
| Vite Build | ✅ | ~6s, 3300+ modules |
| Warnings | ⚠️ | Lucide-react dynamic imports (não bloqueantes) |

### Preview

| Item | Valor |
|------|-------|
| URL | `http://localhost:4173/` |
| Status | ✅ Funcional |

---

## 3. Smoke Test em Preview

### Rotas Testadas

| # | Rota | Status | Observações |
|---|------|--------|-------------|
| 1 | `/planning` | ✅ OK | AreaSelector carrega, RH-only mode ativo |
| 2 | `/planning/rh/dashboard` | ✅ OK | Dashboard com quick links |
| 3 | `/planning/rh/pe-2026` | ✅ OK | Pack RH carrega com todas as seções |
| 4 | `/planning/rh/pe-2026` → Governança | ✅ OK | Rituais e atas visíveis |
| 5 | `/planning/rh/pe-2026` → Governança → Fechar Mês | ✅ OK | MonthlyCloseButton funcional |
| 6 | `/planning/actions/evidences?areaSlug=rh` | ✅ OK | Filtro por área funciona |
| 7 | `/planning/actions/approvals?areaSlug=rh` | ✅ OK | Filtro por área funciona |

---

## 4. Funcionalidades Testadas

### 4.1 Governança (GovernanceRituals)

| Teste | Resultado |
|-------|-----------|
| Exibir rituais WBR/MBR/QBR | ✅ 3 rituais visíveis |
| Expandir ritual | ✅ Mostra atas |
| Atas de reunião (MBR) | ✅ 2 atas seed visíveis |
| Decisões na ata | ✅ Listadas corretamente |
| Action items na ata | ✅ Com owner e status |
| Criar nova ata | ✅ Formulário funcional |

### 4.2 Fechamento Mensal (MonthlyCloseButton)

| Teste | Resultado |
|-------|-----------|
| Seletor de mês | ✅ 12 meses disponíveis |
| Botão "Fechar Mês" | ✅ Gera markdown |
| Preview do markdown | ✅ Exibido em textarea |
| Botão "Baixar MD" | ✅ Download funcional |
| Botão "Exportar PDF" | ✅ Abre janela de impressão |

### 4.3 Dados Reais RH

| Dado | Status |
|------|--------|
| Mandato RH | ✅ Visível em Overview |
| Objetivos O1-O5 | ✅ Com descrições |
| KPIs (11 indicadores) | ✅ Com metas e valores atuais |
| Programas (4) | ✅ Conecta, Desenvolve, Reconhece, Inova |
| Atas MBR seed | ✅ Jan e Fev/2026 |

### 4.4 Quick Links com packId

| Teste | Resultado |
|-------|-----------|
| Link Evidências inclui areaSlug | ✅ `?areaSlug=rh` |
| Link Evidências inclui packId | ✅ `&packId=pack-rh-2026` |
| Link Aprovações inclui areaSlug | ✅ `?areaSlug=rh` |
| Link Aprovações inclui packId | ✅ `&packId=pack-rh-2026` |

---

## 5. Conteúdo do Relatório Mensal Gerado

Exemplo de seções geradas:

```markdown
# Fechamento Mensal — RH — fevereiro de 2026

## 1. Identificação
- Área: RH
- Pack: PE-2026 RH
- Mês: fevereiro de 2026

## 2. KPIs/Metas (Snapshot)
| KPI | Meta | Atual | Status |
| Turnover Total | ≤10% | 11.2% | 🟡 |
| eNPS | ≥70 | 62 | 🟡 |
...

## 3. Status do Plano de Ação
| Status | Quantidade | % |
| Concluído | X | Y% |
...

## 5. Decisões do MBR (Top 5)
1. Acelerar contratações do programa Conecta
2. Aprovar budget adicional para employer branding
...
```

---

## 6. Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/features/strategic-pack/types.ts` | MeetingMinutes expandido, Decision, ActionItem, EvidenceLink, MonthlyClose |
| `src/features/strategic-pack/api-mock.ts` | Seed com atas MBR, KPIs reais |
| `src/features/strategic-pack/components/MonthlyCloseButton.tsx` | NOVO |
| `src/features/strategic-pack/components/index.ts` | Export MonthlyCloseButton |
| `src/features/strategic-pack/utils/generateMonthlyReport.ts` | NOVO |
| `src/features/strategic-pack/utils/exportToPdf.ts` | NOVO |
| `src/features/strategic-pack/pages/StrategicPackPage.tsx` | Integração MonthlyCloseButton, QuickLinks com packId |
| `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` | Suporte packId |
| `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` | Suporte packId |

---

## 7. Issues Encontrados

| # | Severidade | Descrição | Status |
|---|------------|-----------|--------|
| 1 | P2 | Warning lint MeetingMinutes unused | ⚠️ Ignorável |
| 2 | P2 | hasActiveFilters unused | ⚠️ Preparado para uso futuro |
| 3 | P1 | Export PDF via print dialog (não lib dedicada) | ⚠️ MVP OK, refinar depois |

---

## 8. Conclusão

| Critério | Status |
|----------|--------|
| Build sem erros | ✅ |
| Preview funcional | ✅ |
| Governança salva e recarrega | ✅ |
| Fechamento mensal gera MD | ✅ |
| Export PDF funcional | ✅ |
| Dados reais RH visíveis | ✅ |
| Quick Links com packId | ✅ |

**Resultado:** ✅ **APROVADO**

---

**Última atualização:** 06/02/2026 12:35
