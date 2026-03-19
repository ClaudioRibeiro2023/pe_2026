# Log de Migração — Reorganização da Pasta specs

> **Localização atual:** `specs/04_REPORTS/MIGRATION_SPECS_LOG.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data/Hora:** 05/02/2026 18:15 UTC-03:00  
**Executor:** Cascade  
**Motivo:** Taxonomia sênior + rastreabilidade + índice centralizado

---

## Mapa de Arquivos (Antes → Depois)

| # | Arquivo Original | Novo Caminho | Status |
|---|------------------|--------------|--------|
| 1 | `specs/SPEC.1 — PE-2026 — Strategic Pack` | `specs/01_SPECS/SPEC_01_STRATEGIC_PACK.md` | ✅ Movido |
| 2 | `specs/SPEC.2 — PE-2026 — Planning Module` | `specs/01_SPECS/SPEC_02_PLANNING_MODULE.md` | ✅ Movido |
| 3 | `specs/GATE_STRATEGIC_PACK_MVP_RH.md` | `specs/02_GATES/GATE_01_STRATEGIC_PACK_MVP_RH.md` | ✅ Movido |
| 4 | `specs/TODO_STRATEGIC_PACK_SPRINT2_BLOCO1.md` | `specs/03_TODOS/TODO_01_STRATEGIC_PACK_S2_BLOCO1.md` | ✅ Movido |
| 5 | `specs/TODO_STRATEGIC_PACK_SPRINT2_BLOCO2e3.md` | `specs/03_TODOS/TODO_02_STRATEGIC_PACK_S2_BLOCO2e3.md` | ✅ Movido |
| 6 | `specs/QA_REPORT_STRATEGIC_PACK_SPRINT1.md` | `specs/04_REPORTS/QA_01_STRATEGIC_PACK_SPRINT1.md` | ✅ Movido |
| 7 | `specs/QA_REPORT_STRATEGIC_PACK_SPRINT2_BLOCO1.md` | `specs/04_REPORTS/QA_02_STRATEGIC_PACK_SPRINT2_BLOCO1.md` | ✅ Movido |
| 8 | `specs/PROMPT - GATE` | `specs/05_PROMPTS/PROMPT_GATE_AUDITOR.md` | ✅ Movido |

---

## Estrutura Criada

```
specs/
├── 00_INDEX.md                   ← CRIADO (índice central)
├── 01_SPECS/                     ← CRIADO
│   ├── SPEC_01_STRATEGIC_PACK.md
│   └── SPEC_02_PLANNING_MODULE.md
├── 02_GATES/                     ← CRIADO
│   └── GATE_01_STRATEGIC_PACK_MVP_RH.md
├── 03_TODOS/                     ← CRIADO
│   ├── TODO_01_STRATEGIC_PACK_S2_BLOCO1.md
│   └── TODO_02_STRATEGIC_PACK_S2_BLOCO2e3.md
├── 04_REPORTS/                   ← CRIADO
│   ├── QA_01_STRATEGIC_PACK_SPRINT1.md
│   ├── QA_02_STRATEGIC_PACK_SPRINT2_BLOCO1.md
│   └── MIGRATION_SPECS_LOG.md    ← Este arquivo
├── 05_PROMPTS/                   ← CRIADO
│   └── PROMPT_GATE_AUDITOR.md
└── 99_ARCHIVE/                   ← CRIADO (vazio)
```

---

## Atualizações de Referências

| Arquivo | Alteração |
|---------|-----------|
| `02_GATES/GATE_01_STRATEGIC_PACK_MVP_RH.md` | Adicionado header de localização + link para SPEC atualizado |
| `04_REPORTS/QA_01_STRATEGIC_PACK_SPRINT1.md` | Adicionado header de localização |
| `04_REPORTS/QA_02_STRATEGIC_PACK_SPRINT2_BLOCO1.md` | Adicionado header de localização |
| `03_TODOS/TODO_01_STRATEGIC_PACK_S2_BLOCO1.md` | Adicionado header de localização |
| `03_TODOS/TODO_02_STRATEGIC_PACK_S2_BLOCO2e3.md` | Adicionado header de localização |

---

## Conflitos / Observações

- **Nenhum conflito encontrado**
- Arquivos com caracteres especiais (em-dash `—`) foram renomeados para nomes padronizados
- Pasta `99_ARCHIVE/` criada vazia para versões futuras deprecated
- Nomenclatura padrão adotada: `TIPO_NN_NOME_CONTEXTO.md`

---

## Próximos Passos

1. Manter nomenclatura padrão para novos arquivos
2. Arquivos deprecated devem ir para `99_ARCHIVE/` com prefixo `YYYYMMDD_`
3. Atualizar `00_INDEX.md` ao adicionar novos specs/gates/todos/reports
