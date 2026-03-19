# DOC 11 — Guia Institucional para Desdobramento
**Padrão dos Cadernos Setoriais — PE2026**

Versão: **2.0 — revisada (PE2026 Bloco B3/B5)**
Data: **01/mar/2026**
Autor: **Cláudio Ribeiro (Direção Executiva)**
Base de referência: **DOC 00–10 v2 + cadernos setoriais existentes**
Status: **Guia canônico — padrão obrigatório do PE2026**

| Métrica | Valor |
|---------|-------|
| Áreas setoriais | 7 |
| Docs por área | 3 |
| Cadernos totais | 21 |
| Placar Integrado (11-H) | 1 |

> 🔴 **Nota de revisão v2.0:** Guia atualizado para refletir DOC 00–10 v2. Principais adições: (1) WIP limits alinhados ao DOC 08 v2; (2) Requisito de custo/INIT (padrão LR-01); (3) Calibrações P&D e Comercial nos templates; (4) Vínculo obrigatório com Placar Integrado (11-H); (5) Mapa atualizado de status por área; (6) Padrão de IDs consolidado com uso real.

---

## 1  O que é o DOC 11

O DOC 11 é o conjunto de documentos que desdobra o PE2026 por área funcional, mantendo clareza de mandato (o que a área faz e não faz), direção (diagnóstico, prioridades e OKRs setoriais) e execução (programas, iniciativas, DoD, evidências e cadência). É o mecanismo que transforma estratégia em execução sem "telefone sem fio".

O DOC 11 não substitui os documentos corporativos (DOC 00–10) — ele os desdobra. Cada caderno setorial deve vincular-se explicitamente aos OKRs corporativos (DOC 06 v2), à Carteira Estratégica (DOC 08 v2) e ao Placar Institucional (DOC 05 v2). Sem esse vínculo, o caderno é lista de tarefas, não plano estratégico.

> ℹ️ **Regra v2.0:** todo caderno setorial deve indicar qual(is) KR(s) corporativo(s) do DOC 06 v2 cada KR setorial movimenta. A rastreabilidade Pilar → OKR → KR → INIT → EVID é obrigatória e será verificada no Placar Integrado (11-H).

---

## 2  Estrutura obrigatória (trio por área)

Cada área entrega 3 documentos, sempre na mesma sequência e padrão:

| Documento | Nome | Conteúdo central | Analogia |
|-----------|------|-----------------|----------|
| DOC 11-[X] | Macro (Gerencial) | Mandato, fronteiras, placar setorial, governança, RACI | "O que a área é e como se governa" |
| DOC 11-[X].1 | Direção | Diagnóstico, prioridades, OKRs setoriais, dicionário de métricas | "Para onde a área vai e como mede" |
| DOC 11-[X].2 | Execução | Programas, INITs, DoD, EVIDs, cadência, riscos, custos | "O que a área faz, quando e quanto custa" |

> ✅ **Exemplo:** Marketing → DOC 11-B (Gerencial), DOC 11-B.1 (Direção), DOC 11-B.2 (Execução). Financeiro → DOC 11-G, DOC 11-G.1, DOC 11-G.2.

---

## 3  Mapa de áreas e status

O PE2026 possui 7 áreas setoriais + 1 Placar Integrado consolidado. Status atualizado para mar/2026:

| Código | Área | Gerencial | Direção | Execução | Ação B3 |
|--------|------|-----------|---------|----------|---------|
| 11-A | RH / Pessoas | ✓ | ✓ | ✓ | Validar (B5) |
| 11-B | Marketing | ✓ | ✓ | ✓ | Validar (B5) |
| 11-C | P&D | ✓ | ✓ | ✓ | ⚠ Revisar — modelo Direção + consultorias |
| 11-D | Operação | ✓ | ✓ | ✓ | Validar (B5) |
| 11-E | CS / Relacionamento | ✓ | ✗ | ✗ | 🔴 CONSTRUIR Direção + Execução (LC-05) |
| 11-F | Comercial | ✓ | ✓ | ✓ | ⚠ Revisar — área em criação (LC-06) |
| 11-G | Financeiro | ✓ | ✓ | ✓ | Validar (B5) |
| 11-H | Placar Integrado | — | — | VAZIO | 🔴 CONSTRUIR completo (LC-04) |

> 🔴 **Lacunas críticas B3:** LC-04 (11-H Placar Integrado vazio) e LC-05 (11-E CS sem Direção nem Execução). Lacunas relevantes: LR-05 (11-C P&D) e LC-06 (11-F Comercial).

---

## 4  Regras de qualidade (não negociáveis)

### 4.1  Auditabilidade
Tudo que for declarado como "feito", "concluído" ou "atingido" precisa de evidência verificável. KR só fecha com EVID. INIT só conclui com EVID. Risco só é gerenciável com gatilho definido.

### 4.2  Rastreabilidade
Cadeia mínima obrigatória em todo caderno setorial:

> Pilar (DOC 04 v2) → OKR corporativo (DOC 06 v2) → KR corporativo → KR setorial (11-X.1) → Iniciativa INIT-* (DOC 08 v2 / 11-X.2) → Evidência EVID-* → Cadência → Resultado no Placar (11-H)

Para monetização (cadeia específica do Techdengue):

> Contrato/Base → Ativação (CS) → Evidência → Execução (Operação) → Caixa (Financeiro)

### 4.3  Governança por cadência (ritos)

| Rito | Cadência | Escopo setorial | Registro |
|------|---------|----------------|----------|
| WBR | Semanal | Vazão, impedimentos, INITs P0, decisões rápidas | Ata resumida + DEC-* se houver |
| MBR | Mensal | Resultado, causa-raiz, carteira, envelope acumulado, riscos | Relatório mensal + LOG-DEC |
| QBR | Trimestral | Revisão de tese, cenários, decisões estruturais, rebalanceamento | Relatório trimestral + DOC 08 v2 |

### 4.4  WIP limits (alinhado DOC 08 v2)

| Nível | WIP limit | Regra |
|-------|-----------|-------|
| P0 (Crítico 90 dias) | Sem limite no Q1 | Máxima urgência — motor do ano |
| P1 (Estratégico do ano) | 2–3 por motor | Ativadas após Q1 ou conforme gatilho |
| P2 (Melhoria) | 1–2 por motor | Não disputam recursos do motor principal |
| Total por área | Máx. 5 ativas simultâneas | Exceção requer DEC-* com trade-off explícito |

### 4.5  Dimensionamento financeiro (v2.0 — padrão LR-01)

> 🔴 **Requisito novo na v2.0:** todo caderno de Execução (11-X.2) deve incluir estimativa de custo (ordem de grandeza) para cada INIT, permitindo verificação contra o envelope orçamentário do DOC 09 v2 e o portfólio do DOC 08 v2. Sem custo, a iniciativa é ficção — não entra na Carteira.

### 4.6  Linguagem
Português como padrão. Inglês apenas quando necessário, com tradução entre parênteses (ex.: "war room (sala de situação)", "sell-ready (pronto para transação)").

---

## 5  Padrões de IDs

| Elemento | Padrão | Exemplo | Fonte |
|----------|--------|---------|-------|
| Pilar | P1..P5 | P2 (Crescimento) | DOC 04 v2 |
| Subpilar | P?.S? | P2.S1 | DOC 04 v2 |
| OKR corporativo | OKR-P? | OKR-P2 | DOC 06 v2 |
| KR corporativo | P?.# | P2.3 | DOC 06 v2 |
| KPI guardrail | A? | A1 (Margem ≥ 30%) | DOC 05 v2 |
| KPI estratégico | P?.KPI-? | P2.KPI-1 | DOC 05 v2 |
| KPI monetização | C? | C1 (Run-rate) | DOC 05 v2 |
| KPI setorial | B.[ÁREA].KPI-? | B.MKT.KPI-1 | DOC 11-X.1 |
| Iniciativa | INIT-2026-### | INIT-2026-001 | DOC 08 v2 / 11-X.2 |
| Evidência | EVID-2026-### | EVID-2026-001 | DOC 11-X.2 |
| Decisão | DEC-2026-### | DEC-2026-001 | LOG-DEC-2026 |
| Risco | RSK-2026-## | RSK-2026-01 | DOC 10 v2 |
| Motor (carteira) | M1..M5 | M1 (Monetização) | DOC 08 v2 |

> ✅ **Boa prática:** reservar faixas de INIT por área — ex.: 001–022 corporativas (DOC 08 v2), 100–149 Marketing, 150–199 Operação, 200–249 CS, 250–299 P&D, 300–349 RH, 350–399 Financeiro, 400–449 Comercial.

---

## 6  Template — DOC 11-[X] Macro (Gerencial)

Seções mínimas obrigatórias:

| # | Seção | Conteúdo | Vínculo PE |
|---|-------|---------|-----------|
| 1 | Mandato | Por que a área existe em 2026 — missão, papel no PE, entrega principal | DOC 02 v2 |
| 2 | Norte estratégico | Tese do PE aplicada à área — qual é o norte do ano | DOC 02 v2 |
| 3 | Fronteiras (faz / não faz) | Delimitação clara + guardrails da área | DOC 04 v2 |
| 4 | Interfaces e SLAs | Clientes internos, entregas, prazos, qualidade esperada | DOC 03 v2 |
| 5 | Placar setorial | KPIs com definição, fonte, cadência, dono + vínculo ao DOC 05 v2 | DOC 05 v2 / 11-H |
| 6 | Governança | WBR/MBR/QBR: pauta, participantes, registros | DOC 03 v2 |
| 7 | RACI | Responsáveis e aprovadores por entrega principal | — |
| 8 | Riscos macro | Riscos da área + gatilhos + mitigação | DOC 10 v2 |
| 9 | Conclusão | Mandato resumido em 1 frase | — |
| 10 | Glossário | Termos específicos da área | — |

---

## 7  Template — DOC 11-[X].1 Direção

Seções mínimas obrigatórias:

| # | Seção | Conteúdo | Vínculo PE |
|---|-------|---------|-----------|
| 1 | Diagnóstico | Análise interna + externa da área | DOC 01 v2 |
| 2 | Princípios de decisão | Critérios para escolhas — como a área prioriza | DOC 02 v2 |
| 3 | Prioridades por fase | P0 (Q1), P1 (Q2–Q3), P2 (Q4) — alinhadas à Carteira | DOC 08 v2 |
| 4 | OKRs setoriais | Objetivos + KRs da área — cada KR com EVID mínima definida | DOC 06 v2 |
| 5 | Dicionário de métricas | Definição, cálculo, fonte, dono, cadência de cada KPI/KR | DOC 05 v2 |
| 6 | Interdependências | Quem precisa de quem — mapa de dependências entre áreas | DOC 03 v2 |
| 7 | Riscos e mitigação | Riscos setoriais + plano + gatilhos | DOC 10 v2 |
| 8 | Conclusão | Síntese do norte da área | — |
| 9 | Glossário | Termos específicos | — |

> ℹ️ **Obrigatório:** cada KR setorial deve indicar (a) qual KR corporativo do DOC 06 v2 ele movimenta, (b) qual EVID-* mínima prova sua conclusão, e (c) cadência de verificação.

---

## 8  Template — DOC 11-[X].2 Execução

Seções mínimas obrigatórias:

| # | Seção | Conteúdo | Vínculo PE |
|---|-------|---------|-----------|
| 1 | Arquitetura de execução | Programas da área (agrupamento lógico de INITs) | DOC 08 v2 |
| 2 | DoD mínimo | Definition of Done — padrão de qualidade para a área | DOC 03 v2 |
| 3 | Programas detalhados | Para cada programa: INITs, entregáveis, DoD, EVIDs, cadência, riscos | DOC 08 v2 |
| 4 | Custo por INIT (v2.0) | Ordem de grandeza de investimento — faixa em R$ | DOC 08 v2 / 09 v2 |
| 5 | WIP e priorização | Regra de corte, limite de simultaneidade, critério de suspensão | DOC 08 v2 |
| 6 | Painéis mínimos | O que precisa existir para governar a área | DOC 05 v2 |
| 7 | Conclusão | Síntese do plano de execução | — |
| 8 | Glossário | Termos específicos | — |

> ⚠️ **v2.0 — Seção 4 (Custo por INIT) é nova.** Reflete a resolução da LR-01: toda iniciativa no PE2026 revisado deve ter estimativa de custo. Sem custo, a INIT não entra na Carteira Estratégica (DOC 08 v2) e não consome envelope orçamentário (DOC 09 v2).

---

## 9  Evidências: o que conta e o que não conta

### 9.1  Conta como evidência

| Tipo | Exemplo | Requisito |
|------|---------|-----------|
| Relatório | Exportado de CRM/financeiro/painel | Com data, dono e versão |
| Documento | Playbook, manual, processo documentado | Versionado + checklist de qualidade |
| Registro de reunião | Ata de WBR/MBR com pauta e próximos passos | Com participantes e data |
| Auditoria | Amostra trimestral com achados e correções | Metodologia documentada |
| Entrega em produção | Sistema/painel/automação em uso | Com data de deploy e validação |
| Print/screenshot | Captura de tela de painel ou sistema | Com fonte, data e referência |

### 9.2  NÃO conta como evidência

| O que dizem | Por que não conta |
|-------------|-------------------|
| "Feito no WhatsApp" | Sem registro formal, sem rastreabilidade |
| "Achamos que melhorou" | Sem métrica, sem baseline, sem comparação |
| "Está quase pronto" | Sem DoD, sem EVID, sem data |
| "Todos sabem que funciona" | Sem documentação, sem prova verificável |
| "O cliente gostou" | Sem NPS, sem registro formal |

---

## 10  Calibrações especiais por área

### 10.1  P&D (11-C) — Direção Executiva + consultorias

> ⚠️ **Calibração #4:** P&D não possui equipe dedicada em 2026. Opera como Direção Executiva + consultorias especializadas sob demanda. Os cadernos 11-C devem refletir essa realidade: não há "gestor de P&D", não há "time de P&D". INITs de produto/dados/IA são executadas via consultoria, com custos incluídos na estimativa de cada INIT-SIS. O orçamento de P&D (R$ 801K no envelope DOC 09 v2) contempla honorários de consultoria, licenças e infraestrutura.

### 10.2  Comercial (11-F) — área em criação

> ⚠️ **Calibração #2 / LC-06:** a área Comercial não existe em fev/2026. Será criada a partir de mai/2026 com a contratação de liderança (INIT-016, R$ 12–16K/mês). Os cadernos 11-F devem tratar o Comercial como área a ser construída, não como área existente. Todos os KRs comerciais no DOC 06 v2 são condicionais. Estruturação inicia após contratação — INIT-021 depende de INIT-016.

### 10.3  CS (11-E) — cadernos de Direção e Execução inexistentes

> 🔴 **LC-05:** CS possui caderno Gerencial (11-E) mas faltam Direção (11-E.1) e Execução (11-E.2). Esta é a lacuna mais crítica do B3 — CS é a área que conecta contrato a demanda e é pré-condição do motor de monetização (M1). Devem ser construídos do zero seguindo os templates das Seções 7 e 8.

---

## 11  Vínculo com Placar Integrado (11-H)

### 11.1  Obrigações de cada caderno

| Obrigação | Onde | Cadência |
|-----------|------|---------|
| Cada KPI setorial deve ter ID padronizado (B.[ÁREA].KPI-#) | 11-X.1 | Definição única |
| Cada KPI deve indicar KR corporativo vinculado | 11-X.1 | Definição única |
| Valor atual (baseline) e meta 2026 devem estar definidos | 11-X.1 | Definição + MBR |
| Responsável (dono) do KPI deve estar nomeado | 11-X.1 / 11-X | Definição única |
| Valor realizado deve ser reportado no Placar | 11-H | MBR (mensal) |
| Desvios > 15% devem ter causa-raiz e plano de ação | 11-H | MBR (mensal) |

### 11.2  Estrutura do Placar Integrado (11-H)

O 11-H consolida em uma única visão: (1) KPIs guardrail (DOC 05 v2 — margem, NPS, receita); (2) KPIs estratégicos por pilar (DOC 05 v2); (3) KPIs de monetização (DOC 05 v2); (4) KPIs setoriais (DOC 11-X.1 de cada área). Formato: tabela única com área, ID, KPI, baseline, meta, realizado, status, dono, KR corporativo vinculado.

> 🔴 **LC-04:** o DOC 11-H está vazio na v1. Será construído no B3 após conclusão ou revisão dos cadernos setoriais, consolidando todos os KPIs em instrumento de gestão utilizável nos ritos WBR/MBR/QBR.

---

## 12  Glossário

| Termo | Significado |
|-------|------------|
| Caderno Gerencial (11-X) | Visão macro da área: mandato, fronteiras, governança |
| Caderno Direção (11-X.1) | Diagnóstico, prioridades e OKRs setoriais |
| Caderno Execução (11-X.2) | Programas, INITs, DoD, EVIDs, custos e cadência |
| Placar Integrado (11-H) | Consolidação de KPIs de todas as áreas em visão única |
| DoD (Definition of Done) | Critério objetivo que define quando algo está concluído |
| EVID (Evidência) | Prova verificável de conclusão de KR ou INIT |
| INIT (Iniciativa) | Ação concreta com dono, prazo, custo e evidência |
| DEC (Decisão) | Registro formal de decisão com justificativa e trade-off |
| RACI | Responsible, Accountable, Consulted, Informed |
| SLA | Service Level Agreement — acordo de nível de serviço entre áreas |
| WIP limit | Limite de iniciativas simultâneas para evitar dispersão |
| Ordem de grandeza | Estimativa de custo em faixa (ex.: R$ 20–40K) |
| Rastreabilidade | Cadeia verificável: Pilar → OKR → KR → INIT → EVID → KPI |

---

## Conclusão

O DOC 11 é o mecanismo que torna o PE2026 executável, auditável e repetível. Sem rastreabilidade, evidência e cadência, o plano vira narrativa. A v2 reforça três exigências: vínculo explícito com os documentos corporativos revisados (DOC 00–10 v2), dimensionamento financeiro obrigatório para cada iniciativa, e calibrações que refletem a realidade organizacional de fevereiro/2026 — P&D sem equipe dedicada, Comercial como área a ser criada, e CS como prioridade de completude.

*Documento revisado em 01/mar/2026 como parte dos Blocos B3 (Completude) e B5 (Integração) do PE2026.*
