# TODO — Sprint 4 RH: Governança Operacional + Fechamento Mensal + Dados Reais

> **Localização:** `specs/03_TODOS/TODO_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 06/02/2026  
**Status:** 🔄 Em Progresso  
**QA:** [QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../04_REPORTS/QA_09_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)  
**Gate:** [GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md](../02_GATES/GATE_08_RH_SPRINT4_GOVERNANCA_FECHAMENTO_DADOS.md)

---

## Objetivo

Implementar funcionalidades de governança operacional (WBR/MBR/QBR), fechamento mensal com geração MD+PDF, e seed de dados reais do RH no Strategic Pack.

---

## P0 — Bloqueadores (Críticos)

### GOV-001: Schema Governança com Minutes Completo ⬜

**Descrição:** Expandir `MeetingMinutes` para suportar vinculos a evidências e ações.

**Arquivos:**
- [ ] `src/features/strategic-pack/types.ts` — Expandir MeetingMinutes com evidenceLinks[]
- [ ] `src/features/strategic-pack/schemas.ts` — Adicionar Zod schemas

**Como testar:**
```typescript
// Minutes deve ter: id, ritual_id, date, attendees[], summary, decisions[], action_items[], evidenceLinks[]
```

---

### GOV-002: CRUD Governança no api-mock ⬜

**Descrição:** Implementar funções para gerenciar atas e decisões.

**Arquivos:**
- [ ] `src/features/strategic-pack/api-mock.ts` — addMinutes, updateMinutes, addDecision

**Como testar:**
```bash
# Via UI: criar ata MBR no pack RH e recarregar página
```

---

### CLOSE-001: MonthlyCloseButton + generateMonthlyReportMarkdown ⬜

**Descrição:** Botão "Fechar Mês" que gera relatório Markdown do mês.

**Arquivos:**
- [ ] `src/features/strategic-pack/components/MonthlyCloseButton.tsx` — Novo componente
- [ ] `src/features/strategic-pack/utils/generateMonthlyReport.ts` — Função geradora

**Template MD:**
```markdown
# Fechamento Mensal — [Área] — [Mês/Ano]

## 1. Identificação
- Área: RH
- Pack: PE-2026 RH
- Mês: Fevereiro/2026
- Versão: 1.0

## 2. KPIs/Metas (Snapshot)
| KPI | Meta | Atual | Status |
|-----|------|-------|--------|

## 3. Status do Plano de Ação
| Status | Qtd |
|--------|-----|
| Concluído | X |
| Em andamento | X |
| Atrasado | X |
| Bloqueado | X |

## 4. Pendências de Evidências/Aprovações
| Tipo | Pendente | Aprovado | Rejeitado |
|------|----------|----------|-----------|

## 5. Decisões do MBR (Top 5)
1. ...

## 6. Próximas Ações Críticas (Top 10)
1. ...
```

**Como testar:**
```bash
# 1. Abrir /planning/rh/pe-2026
# 2. Ir para tab Governança ou Overview
# 3. Clicar "Fechar Mês"
# 4. Verificar MD gerado
```

---

### PDF-001: Exportar PDF do Relatório Mensal ⬜

**Descrição:** Converter Markdown gerado em PDF para download.

**Arquivos:**
- [ ] `package.json` — Adicionar dependência (html2pdf.js ou jspdf + marked)
- [ ] `src/features/strategic-pack/utils/exportToPdf.ts` — Função de export
- [ ] `src/features/strategic-pack/components/MonthlyCloseButton.tsx` — Botão "Exportar PDF"

**Como testar:**
```bash
# 1. Gerar relatório MD
# 2. Clicar "Exportar PDF"
# 3. Verificar download do arquivo .pdf
```

---

### SEED-001: Dados Reais RH no Pack ⬜

**Descrição:** Popular pack RH com dados reais completos.

**Arquivos:**
- [ ] `src/features/strategic-pack/api-mock.ts` — Atualizar mockStore com dados reais

**Dados a incluir:**
- Mandato RH completo
- O1-O5 com descrições detalhadas
- KPIs: turnover, churn 0-90, sucesso 90d, TTF, aderência rituais, onboarding, GPTW
- Programas: Conecta, Desenvolve, Reconhece, Inova com metas específicas
- Rituais WBR/MBR/QBR com primeiras atas

**Como testar:**
```bash
# 1. Abrir /planning/rh/pe-2026
# 2. Verificar dados em cada aba
```

---

## P1 — Melhorias (Importantes)

### UI-001: GovernanceRituals melhorado ⬜

**Descrição:** Adicionar seletor de ritual, anexar evidência, e vínculo a ações.

**Arquivos:**
- [ ] `src/features/strategic-pack/components/GovernanceRituals.tsx` — Expandir formulário

**Features:**
- [ ] Seletor de tipo de ritual (WBR/MBR/QBR) no form de nova ata
- [ ] Campo para anexar evidência (link ou upload)
- [ ] Campo para vincular action item a actionId existente
- [ ] Botão para exportar ata individual

---

### FILTER-001: Filtros por packId em evidences/approvals ⬜

**Descrição:** Garantir que rotas aceitam &packId= como filtro.

**Arquivos:**
- [ ] `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` — Suportar packId
- [ ] `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` — Suportar packId

**Como testar:**
```bash
# 1. Acessar /planning/actions/evidences?areaSlug=rh&packId=pack-rh-2026
# 2. Verificar filtro aplicado
```

---

### LINKS-001: Quick Links com packId ⬜

**Descrição:** Links do pack devem passar packId para evidências/aprovações.

**Arquivos:**
- [ ] `src/features/strategic-pack/pages/StrategicPackPage.tsx` — Ajustar QuickLinks

---

### CLOSE-002: Salvar MD como Attachment ⬜

**Descrição:** Após gerar relatório, salvar como attachment do pack.

**Arquivos:**
- [ ] `src/features/strategic-pack/components/MonthlyCloseButton.tsx` — Chamar createAttachment

**Tags:** `monthly_close`, `YYYY-MM`

---

## P2 — Refinamentos (Nice to Have)

### UI-002: Histórico de Fechamentos Mensais ⬜

**Descrição:** Listar fechamentos anteriores com links para MD/PDF.

---

### UI-003: Indicadores visuais de progresso ⬜

**Descrição:** Cards com % de conclusão por programa/objetivo.

---

### EXPORT-001: Template PDF customizado ⬜

**Descrição:** Layout profissional com logo e estilos corporativos.

---

## Checklist de Entrega

| Item | Status |
|------|--------|
| Schema Governança expandido | ⬜ |
| CRUD atas no mock | ⬜ |
| MonthlyCloseButton funcional | ⬜ |
| Geração MD completa | ⬜ |
| Export PDF funcional | ⬜ |
| Dados reais RH no seed | ⬜ |
| Filtro packId em evidences/approvals | ⬜ |
| Build + Preview OK | ⬜ |
| QA smoke test | ⬜ |
| Gate aprovado | ⬜ |

---

## Arquivos Principais

```
src/features/strategic-pack/
├── types.ts                    # MeetingMinutes expandido
├── schemas.ts                  # Zod schemas
├── api-mock.ts                 # CRUD + seed dados reais
├── hooks.ts                    # hooks existentes
├── components/
│   ├── GovernanceRituals.tsx   # UI melhorada
│   ├── MonthlyCloseButton.tsx  # NOVO
│   └── index.ts                # exports
├── utils/
│   ├── generateMonthlyReport.ts # NOVO
│   └── exportToPdf.ts          # NOVO
└── pages/
    └── StrategicPackPage.tsx   # Integração

src/features/planning/pages/actions/
├── ActionsEvidencesPage.tsx    # Filtro packId
└── ActionsApprovalsPage.tsx    # Filtro packId
```

---

## Dependências

```json
{
  "html2pdf.js": "^0.10.1"  // ou alternativa para export PDF
}
```

---

**Última atualização:** 06/02/2026 12:20
