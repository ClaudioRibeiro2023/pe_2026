# GATE_09 - Reports Sprint 5

**Spec:** SPEC_03_PLANNING_REPORTS_SPRINT5  
**Data:** 2026-02-06  
**Status:** Pendente  

---

## Criterios PASSA/FALHA

| # | Criterio | Metodo de Verificacao | Status |
|---|----------|----------------------|--------|
| G-01 | Hub de relatorios exibe >= 3 tipos de relatorio em /reports | Navegar para /reports no preview | Pendente |
| G-02 | Filtro por area funciona (selecionar RH mostra apenas RH) | Interagir com filtro no preview | Pendente |
| G-03 | Relatorio executivo mostra metricas coerentes com mockStore | Comparar valores exibidos vs dados mock | Pendente |
| G-04 | Relatorio de acoes por pack lista 42 acoes para pack-rh-2026 | Contar linhas na tabela | Pendente |
| G-05 | Acoes atrasadas tem indicador visual (cor/badge) | Verificar visualmente no preview | Pendente |
| G-06 | Export PDF gera arquivo valido e abre sem erro | Clicar botao PDF, abrir arquivo baixado | Pendente |
| G-07 | Export Excel gera CSV com dados corretos | Clicar botao Excel, abrir arquivo | Pendente |
| G-08 | Build passa sem erros | `npm run build` retorna exit code 0 | Pendente |
| G-09 | Preview funcional em localhost | `npx vite preview --port 4500` + navegar | Pendente |
| G-10 | Nenhuma regressao em /planning e /planning/rh | Navegar por rotas existentes sem erros | Pendente |

---

## Comandos Obrigatorios

```powershell
# 1. Type check
npx tsc --noEmit

# 2. Build
npm run build

# 3. Preview
npx vite preview --port 4500

# 4. Diagnostico (navegar no browser)
# http://localhost:4500/admin/validation
# Clicar "Executar Validacao" + "Exportar .md"
```

---

## Evidencias Exigidas (sem prints)

| # | Evidencia | Formato |
|---|-----------|---------|
| E-01 | Output de `npm run build` mostrando "built in Xs" | Texto colado no chat |
| E-02 | Diagnostico .md exportado da ValidationPage | Arquivo .md |
| E-03 | QA report gerado pelo script de finalizacao | Arquivo .md em specs/04_REPORTS/ |
| E-04 | Checklist de regressao (QA_06 secao 3) todo marcado | Texto/Markdown |

---

## Regra de Aprovacao

- **PASSA:** Todos os criterios G-01 a G-10 marcados como "Passou"
- **FALHA:** Qualquer criterio marcado como "Falhou"
- **CONDICIONAL:** G-06 ou G-07 podem ser "Warning" se export funciona mas com formatacao menor

---

## Historico

| Data | Acao | Resultado |
|------|------|-----------|
| 2026-02-06 | Gate criado | Pendente |
