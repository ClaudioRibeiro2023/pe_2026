# MEGAPLAN — Produção Real do PE2026 na Plataforma

**Versão:** 2.0  
**Data:** Março/2026  
**Autor:** Cascade (Assessoria Técnica)  
**Classificação:** Documento de Planejamento Técnico e Operacional — Uso Interno  
**Base documental:** DOC 00–11H v2/v3 + MAP-TRC-2026 + Adendo DOC 11 v2.1 + análise do estado atual da plataforma

---

## Sumário Executivo

O desafio não é apenas substituir conteúdo mockado por conteúdo “mais realista”. O desafio é transformar a plataforma PE2026 no **sistema oficial, auditável e operável** do Planejamento Estratégico aprovado, com **dados canônicos persistidos**, **métricas derivadas homologadas**, **rastreabilidade ponta a ponta**, **cutover controlado de produção** e **rollback seguro**.

O `v1` cumpriu bem o papel de:
- identificar o gap entre os mocks atuais e o PE aprovado
- mapear entidades e superfícies impactadas
- estruturar a substituição dos dados fictícios

O `v2` eleva o plano para o nível necessário de **produção real ponta a ponta**, acrescentando:
- modelo canônico de dados
- separação entre dados mestre, operacionais, derivados e snapshots
- estratégia de persistência oficial em Supabase
- bootstrap auditável da base real
- regras oficiais de cálculo dos KPIs e guardrails
- reconciliação `Documento → Banco → UI`
- dual-run, cutover, rollback e operação assistida

### Tese central do programa

**A plataforma só será considerada aderente ao PE2026 quando deixar de funcionar como demo com fallback para mock e passar a operar como a camada oficial de gestão, leitura e governança do plano.**

---

## 1. Objetivo, Escopo e Definição de Sucesso

## 1.1 Objetivo

Inserir na plataforma os objetivos reais do PE aprovado e as métricas vinculadas, com operação em produção baseada em **fonte oficial**, **persistência real**, **governança explícita**, **cálculo homologado** e **aceite executivo**.

## 1.2 O que precisa mudar de fato

- sair do paradigma `mock local como estado principal`
- persistir o domínio do PE em base oficial
- calcular métricas institucionais a partir de regras formais
- registrar histórico e snapshots para WBR/MBR/QBR
- bloquear fallback silencioso para mock em produção
- habilitar leitura executiva confiável do placar e da cadeia de rastreabilidade

## 1.3 Fora de escopo deste documento

- redesenho visual completo da plataforma
- reestruturação ampla de módulos sem relação direta com o PE real
- refatorações cosméticas que não alterem confiabilidade de produção

## 1.4 Definição de sucesso

O programa só será concluído quando a plataforma atender simultaneamente:

1. **Aderência documental**
2. **Persistência oficial em produção**
3. **Cálculo oficial dos KPIs e guardrails**
4. **Rastreabilidade auditável**
5. **Operação segura sem fallback fictício em PROD**
6. **Cutover controlado com rollback definido**

---

## 2. Diagnóstico Atual da Plataforma

## 2.1 Gap estrutural entre mock atual e PE aprovado

| Entidade | Estado atual | Estado exigido | Gap |
|---|---|---|---|
| Áreas | 5 áreas genéricas | 7 áreas reais do PE | Estrutura incorreta |
| Pilares | 5 nomes fictícios | 5 pilares reais + 18 subpilares | Sem aderência ao DOC 04 |
| OKRs | 5 genéricos | 5 OKRs reais | Sem aderência ao DOC 06 |
| KRs | 12 genéricos | 25 KRs reais | Incompleto e incorreto |
| Iniciativas | 10 genéricas | 22 INITs reais | Sem aderência ao DOC 08 |
| KPIs | 3 indicadores genéricos | ~52 KPIs em 4 camadas | Estrutura insuficiente |
| Metas | 3 metas simples | cenários + metas por unidade + early warning | Sem aderência ao DOC 07 |
| Riscos | apenas riscos locais de ação | 13 riscos estratégicos | Entidade inexistente |
| Scorecard | inexistente | Placar 11-H operacional | inexistente |

## 2.2 Evidências técnicas do estado atual

| Superfície | Situação observada | Implicação |
|---|---|---|
| `src/features/area-plans/api.ts` | reexporta `api-mock.ts` em modo mock completo | domínio central opera fora da base real |
| `src/features/area-plans/utils/mockData.ts` | concentra áreas, pilares, OKRs, KRs, INITs e planos fictícios | fonte principal atual é inválida para produção |
| `src/features/areas/api.ts` | usa fallback silencioso para mock quando Supabase falha ou retorna vazio | risco de mascarar indisponibilidade real |
| `src/features/goals/api.ts` | metas mock inline | ausência de metas oficiais |
| `src/features/indicators/api.ts` | indicadores mock inline | ausência de cálculo institucional |
| `src/features/action-plans/api.ts` | planos mock inline com 5W2H genérico | sem aderência ao PE |
| `src/features/strategic-pack/api.ts` | Supabase com fallback para mock | comportamento inseguro para produção |
| `supabase/migrations/20260205_consolidated_schema.sql` | parte importante do schema já existe | oportunidade de reaproveitamento |

## 2.3 Diagnóstico de produção

Hoje o problema da plataforma não é apenas “dados errados”. O problema é composto por 5 camadas:

1. **Fonte canônica indefinida**
2. **Persistência parcial e não endurecida**
3. **Ausência de engine oficial de métricas**
4. **Ausência de reconciliação documental/banco/UI**
5. **Ausência de estratégia formal de go-live**

---

## 3. Modelo Canônico de Dados

## 3.1 Camadas oficiais de informação

O modelo do PE2026 na plataforma deve ser dividido em 4 camadas:

### Camada A — Dados Mestre
Elementos estáveis do planejamento aprovado.

- áreas
- pilares
- subpilares
- temas estratégicos
- OKRs corporativos
- KRs corporativos
- iniciativas corporativas
- motores
- riscos estruturais
- cenários de referência

### Camada B — Dados Operacionais
Elementos que variam com execução e ritos.

- planos por área
- ações e subtarefas
- evidências
- comentários
- decisões formais
- forecasts 30/60/90
- evolução dos riscos
- andamento por iniciativa e KR

### Camada C — Métricas Derivadas
Indicadores calculados a partir de fatos e regras homologadas.

- guardrails
- KPIs por pilar
- KPIs de monetização C1–C7
- KPIs setoriais
- leituras de capacidade, margem, qualidade e saúde

### Camada D — Snapshots e Histórico
Registros congelados para leitura executiva e auditabilidade.

- snapshots de KPI
- snapshots de KR
- snapshots de INIT
- snapshots de risco
- snapshots de forecast

## 3.2 Matriz canônica por domínio

| Domínio | Tipo | Origem oficial | Dono | Cadência | Persistência |
|---|---|---|---|---|---|
| Áreas | mestre | DOC 11 + estrutura organizacional | Direção | eventual | tabela real |
| Pilares/Subpilares | mestre | DOC 04 | Direção | estável | tabela real |
| OKRs/KRs | mestre | DOC 06 | Direção | controlada | tabela real |
| INITs | mestre operacional | DOC 08 | Direção Executiva | controlada | tabela real |
| Riscos estratégicos | mestre operacional | DOC 10 | Direção + donos | mensal | tabela real |
| Cenários | mestre de referência | DOC 07 + DOC 09 | Financeiro | trimestral | tabela real |
| Plans/Actions | operacional | execução da plataforma | gestores | contínua | tabela real |
| Evidências | operacional | execução | gestores + direção | contínua | storage + tabela real |
| Guardrails | derivada | fatos operacionais + regras oficiais | Financeiro/Operação/RH | semanal/mensal | cálculo + snapshot |
| Monetização C1–C7 | derivada | operação real + CS + Financeiro | CS + Financeiro + Operação | semanal | cálculo + snapshot |
| Placar 11-H | derivada/apresentação | KPIs homologados | Direção | WBR/MBR/QBR | leitura consolidada |

## 3.3 Regras obrigatórias do modelo canônico

1. cada entidade mestre deve ter chave canônica estável
2. cada entidade derivada deve ter fórmula explícita
3. nenhum número executivo pode depender de valor digitado manualmente sem trilha
4. todo dado exibido em placar deve poder ser rastreado até sua fonte
5. todo domínio crítico deve ter owner funcional e owner técnico

---

## 4. Princípios de Arquitetura e Operação

1. **Sistema oficial, não demo evoluída**
2. **Fonte única da verdade por domínio**
3. **Sem fallback silencioso para mock em produção**
4. **Rastreabilidade obrigatória `Pilar → OKR → KR → INIT → EVID → KPI`**
5. **Separação entre estrutura do plano e fatos operacionais**
6. **Métrica derivada só entra em produção com fórmula homologada**
7. **Snapshot executivo é obrigatório para WBR/MBR/QBR**
8. **Cutover só ocorre após dual-run e reconciliação**

---

## 5. Estratégia de Persistência e Ambientes

## 5.1 Diretriz central

O Supabase passa a ser a **base oficial** do PE2026. O objetivo não é “deixar preparado para usar Supabase”; é **operar oficialmente pelo Supabase**.

## 5.2 Premissa importante

O repositório já possui parte relevante do schema consolidado. A estratégia correta é:

- **reaproveitar** o que já existe
- **estender** apenas o necessário
- **endurecer** o comportamento de produção

## 5.3 Tabelas já evidentes no schema consolidado

- `areas`
- `pillars`
- `subpillars`
- `corporate_okrs`
- `key_results`
- `area_okrs`

## 5.4 Extensões previstas

- `initiatives` com campos canônicos expandidos
- `strategic_themes`
- `motors`
- `strategic_risks`
- `financial_scenarios`
- `institutional_kpis`
- `kpi_snapshots`
- `kr_snapshots`
- `initiative_snapshots`
- `risk_snapshots`
- `forecast_snapshots`
- `formal_decisions`

## 5.5 Política por ambiente

| Ambiente | Mock | Supabase | Regra |
|---|---|---|---|
| DEV | permitido | opcional | mock aceito para desenvolvimento controlado |
| HML/UAT | restrito | obrigatório | mock apenas por flag explícita e observável |
| PROD | proibido como fallback | obrigatório | falha real deve ser exibida e monitorada |

## 5.6 Regras de fallback

### Permitido
- ambiente local de desenvolvimento
- demonstrações controladas
- testes de interface isolada

### Proibido
- fallback automático em produção
- retorno silencioso para arrays mock quando a base real falha
- leitura de tabela vazia como justificativa para “seguir com mock” em PROD

---

## 6. Bootstrap de Produção e Carga Inicial

## 6.1 Objetivo

Subir para a base oficial a estrutura validada do PE2026 com rastreabilidade, consistência e reconciliação formal.

## 6.2 Lotes de carga inicial

| Lote | Conteúdo | Origem |
|---|---|---|
| L1 | áreas | DOC 11 + desenho organizacional validado |
| L2 | pilares e subpilares | DOC 04 |
| L3 | OKRs e KRs | DOC 06 |
| L4 | iniciativas corporativas | DOC 08 |
| L5 | riscos estratégicos | DOC 10 |
| L6 | cenários e envelopes de referência | DOC 07 + DOC 09 |
| L7 | KPIs institucionais e monetização | DOC 05 + MAP-TRC |
| L8 | vínculos setoriais | DOC 11-A a 11-G |

## 6.3 Artefatos obrigatórios da carga

1. **seed canônico**
2. **validador de integridade**
3. **relatório de reconciliação**
4. **termo de aceite da carga inicial**

## 6.4 Validações mínimas por lote

- contagem esperada vs inserida
- chaves duplicadas
- referências órfãs
- aderência ao padrão canônico de IDs
- conformidade com o documento fonte

## 6.5 Resultado esperado

A base deve sair do bootstrap com:
- 100% dos domínios mestre carregados
- 0 órfãos em relações estruturais
- 0 códigos duplicados canônicos
- reconciliação assinada por owner funcional

---

## 7. Estratégia Oficial de Métricas e Cálculo

## 7.1 Premissa

KPIs institucionais não devem ser apenas registros cadastrados. Eles precisam ser o resultado de **regras formais de cálculo**, controladas e auditáveis.

## 7.2 Blocos de cálculo

| Bloco | Natureza | Exemplo |
|---|---|---|
| Guardrails | derivado | margem, caixa, qualidade, saúde |
| Pilar | derivado/controlado | KPIs P1–P5 |
| Monetização | derivado | C1–C7 |
| Setorial | misto | KPIs por área |

## 7.3 Regra mínima por KPI

Cada KPI deve ter:

- código canônico
- definição executiva
- fórmula oficial
- unidade
- granularidade
- janela temporal
- regra de corte
- regra de arredondamento
- owner funcional
- owner técnico
- fonte de dados
- status de homologação

## 7.4 Prioridade máxima de homologação

### Guardrails
- margem operacional
- caixa e previsibilidade 30/60/90
- qualidade/SLA
- saúde organizacional

### Monetização
- C1 saldo a executar
- C2 execução acumulada
- C3 vazão
- C4 taxa de ativação
- C5 previsão 30/60/90
- C6 idade do saldo
- C7 Pareto Top-14/32

## 7.5 Engine oficial de cálculo

O programa deve prever uma camada explícita de cálculo para:
- consolidar dados operacionais
- derivar métricas executivas
- gerar snapshots
- alimentar scorecard e dashboards sem divergência entre telas

---

## 8. Reconciliação Documento → Banco → UI

## 8.1 Objetivo

Garantir que o que está aprovado no PE é exatamente o que foi persistido e exatamente o que a plataforma exibe.

## 8.2 Matriz obrigatória de reconciliação

| Domínio | Documento | Banco | UI |
|---|---|---|---|
| Pilares/Subpilares | DOC 04 | `pillars`, `subpillars` | visão estratégica |
| OKRs/KRs | DOC 06 | `corporate_okrs`, `key_results` | páginas de estratégia/planning |
| INITs | DOC 08 | `initiatives` | planning/portfolio |
| KPIs | DOC 05 | `institutional_kpis` | placar/indicadores |
| Cenários | DOC 07 | `financial_scenarios` | dashboard/financeiro |
| Riscos | DOC 10 | `strategic_risks` | painel de risco |
| Rastreabilidade | MAP-TRC | vínculos persistidos | scorecard/trilha |

## 8.3 Critério de homologação

Nenhum domínio entra em cutover sem:
- reconciliação documental concluída
- conferência de persistência concluída
- conferência visual/API concluída
- aceite do owner funcional

---

## 9. Snapshots, Histórico e Cadências

## 9.1 Por que esta camada é obrigatória

Sem histórico, a plataforma mostra apenas “valor atual”, mas não sustenta:
- WBR
- MBR
- QBR
- war room de monetização
- auditoria executiva

## 9.2 Objetos de snapshot

- KPI institucional
- KR corporativo
- INIT corporativa
- risco estratégico
- forecast 30/60/90
- leitura de scorecard por ciclo

## 9.3 Regra de uso

O dado vivo atende operação. O snapshot atende governança, análise comparativa e prestação de contas.

---

## 10. Ondas de Implementação

## Onda A — Base Canônica do PE

**Objetivo:** estruturar o domínio oficial do planejamento aprovado.  
**Prioridade:** crítica.

### Escopo
- áreas reais
- pilares e subpilares
- OKRs e KRs
- temas estratégicos
- motores
- iniciativas corporativas
- riscos estruturais
- cenários de referência

### Superfícies impactadas
- schema Supabase
- seeds canônicos
- `src/features/area-plans/utils/mockData.ts`
- `src/features/areas/api.ts`
- `src/features/area-plans/types.ts`

### Critério de aceite
- domínio mestre persistido
- sem dependência de mocks para leitura estrutural

## Onda B — Persistência Real e Hardening de Ambientes

**Objetivo:** consolidar Supabase como base oficial e endurecer comportamento por ambiente.  
**Prioridade:** crítica.

### Escopo
- revisão das tabelas existentes
- migrations complementares
- revisão de RLS e políticas
- eliminação de fallback silencioso em PROD
- sinalização observável de erro de fonte real

### Superfícies impactadas
- `src/shared/lib/supabaseClient.ts`
- `src/features/area-plans/api.ts`
- `src/features/areas/api.ts`
- `src/features/strategic-pack/api.ts`
- APIs de goals, indicators e action plans

### Critério de aceite
- leitura real obrigatória em HML/PROD
- falha real tratada como falha operacional, não como sucesso com mock

## Onda C — Bootstrap Auditável

**Objetivo:** carregar o PE aprovado na base oficial com evidência e reconciliação.  
**Prioridade:** crítica.

### Escopo
- seeds por lote
- validador de integridade
- relatório de reconciliação
- aceite da carga inicial

### Critério de aceite
- 100% dos domínios mestre carregados e reconciliados

## Onda D — Métricas Oficiais, Guardrails e Scorecard

**Objetivo:** operacionalizar o placar institucional e os KPIs de monetização com cálculo homologado.  
**Prioridade:** alta.

### Escopo
- `institutional_kpis`
- engine de cálculo
- snapshots
- placar integrado 11-H
- rastreabilidade navegável

### Critério de aceite
- guardrails e C1–C7 homologados
- scorecard sem divergência entre API, tela e documento

## Onda E — Adequação da Aplicação e Fluxos

**Objetivo:** conectar as telas à base real e alinhar UX ao modelo oficial.  
**Prioridade:** alta.

### Escopo
- planejamento por área
- planos de ação
- packs estratégicos
- indicadores e metas
- dashboards executivos
- estados reais de erro/indisponibilidade

### Critério de aceite
- UI operando com fonte real e estados confiáveis

## Onda F — Dual-Run, Go-Live e Operação Assistida

**Objetivo:** entrar em produção com segurança e rollback definido.  
**Prioridade:** crítica.

### Escopo
- dual-run por domínio
- reconciliação final
- smoke test de produção
- cutover controlado
- rollback operacional
- operação assistida pós-virada

### Critério de aceite
- aceite executivo formal
- rollout sem fallback fictício

---

## 11. Arquivos e Superfícies Prioritárias

| Categoria | Arquivo / Superfície | Papel no programa |
|---|---|---|
| domínio mock principal | `src/features/area-plans/utils/mockData.ts` | substituir dados fictícios por base canônica temporária ou remover dependência |
| API principal | `src/features/area-plans/api.ts` | retirar modo mock como default |
| API mock | `src/features/area-plans/api-mock.ts` | limitar a DEV/demonstração |
| áreas | `src/features/areas/api.ts` | eliminar fallback silencioso inadequado |
| metas | `src/features/goals/api.ts` | substituir metas mock por fonte real |
| indicadores | `src/features/indicators/api.ts` | ligar ao modelo de KPI institucional |
| planos | `src/features/action-plans/api.ts` | alinhar aos dados reais e às INITs do PE |
| packs | `src/features/strategic-pack/api.ts` | endurecer fonte real e comportamento |
| cliente Supabase | `src/shared/lib/supabaseClient.ts` | política de ambientes e confiabilidade |
| schema | `supabase/migrations/20260205_consolidated_schema.sql` | base de reaproveitamento e extensão |

---

## 12. Segurança, Permissões e Confidencialidade

## 12.1 Diretriz

Como o PE contém cenários financeiros, riscos estratégicos e leitura executiva, a migração para produção deve incluir governança de visibilidade.

## 12.2 Controles mínimos

- RLS revisado por domínio sensível
- separação entre visão executiva e visão operacional
- trilha de auditoria para edição de dados mestre
- restrição de edição de cenários, KPIs e riscos estruturais
- evidência de quem alterou, quando e em qual rito

## 12.3 Dados sensíveis prioritários

- cenários de receita e margem
- envelopes e centros de custo
- riscos críticos
- previsões de monetização
- decisões executivas formais

---

## 13. Cutover, Rollback e Operação Assistida

## 13.1 Pré-condições de cutover

1. base mestre carregada e reconciliada
2. métricas críticas homologadas
3. telas críticas validadas
4. fallback silencioso bloqueado em produção
5. smoke test de leitura real concluído
6. aceite de Direção + Financeiro + donos funcionais

## 13.2 Cutover

- congelar datasets mock usados como apoio
- habilitar leitura oficial da base real
- validar fluxos críticos
- validar placar, scorecard e domínios sensíveis
- registrar decisão formal de virada

## 13.3 Rollback

O rollback deve prever:

- retorno controlado à última configuração estável
- restauração de snapshot conhecido
- registro formal do incidente
- reconciliação do delta pós-falha

## 13.4 Operação assistida

Durante as primeiras semanas pós-go-live:

- monitorar divergência de KPI
- monitorar erros de API/dados
- monitorar falhas de permissão
- monitorar inconsistência entre scorecard e relatórios

---

## 14. Critérios Finais de Aceite

## 14.1 Dados mestre

- 100% dos 5 pilares corretos
- 100% dos 18 subpilares corretos
- 100% dos 5 OKRs corretos
- 100% dos 25 KRs corretos
- 100% das 22 INITs corretas

## 14.2 Integridade

- 0 referências órfãs
- 0 códigos canônicos duplicados
- cadeia `Pilar → OKR → KR → INIT` íntegra

## 14.3 Métricas

- 100% dos 4 guardrails homologados
- 100% dos 7 KPIs de monetização homologados
- scorecard 11-H alimentável por snapshots

## 14.4 Produção

- nenhum fallback automático para mock em PROD
- observabilidade ativa para falha de dados
- dual-run concluído
- cutover formalizado
- rollback documentado e testável

---

## 15. Riscos do Programa de Migração

| Risco | Impacto | Mitigação |
|---|---|---|
| fallback silencioso mascarar indisponibilidade real | alto | bloquear fallback em PROD e expor erro operacional |
| divergência de fórmula entre telas | alto | engine oficial de cálculo + homologação funcional |
| bootstrap incompleto ou inconsistente | alto | carga por lotes + reconciliação formal |
| ausência de snapshots comprometer MBR/QBR | alto | camada explícita de snapshot antes do go-live |
| exposição indevida de dados financeiros | alto | RLS, perfis e segregação de visibilidade |
| volume de mudanças afetar a UX | médio | rollout por ondas e validação por domínio |
| customizações excessivas criarem complexidade desnecessária | médio | reaproveitar schema e superfícies já existentes |
| dependência excessiva de manutenção manual | médio | definir ownership, cadência e validações automáticas |

---

## 16. Mapa Documento PE → Domínio da Plataforma

| Documento | Domínio principal | Persistência / Superfície |
|---|---|---|
| DOC 04 | pilares e subpilares | `pillars`, `subpillars` |
| DOC 05 | KPIs, guardrails e monetização | `institutional_kpis`, engine de cálculo, scorecard |
| DOC 06 | OKRs e KRs | `corporate_okrs`, `key_results` |
| DOC 07 | cenários, metas e early warning | `financial_scenarios`, snapshots, dashboard |
| DOC 08 | iniciativas e motores | `initiatives`, `motors` |
| DOC 09 | envelopes e coerência financeira | domínio financeiro e validações de margem |
| DOC 10 | riscos estratégicos | `strategic_risks`, `risk_snapshots` |
| DOC 11 | cadernos setoriais | `area_okrs`, plans, actions |
| MAP-TRC | rastreabilidade integrada | scorecard + trilha navegável |

---

## 17. Cronograma Executivo Revisado

| Onda | Foco | Prioridade | Esforço estimado |
|---|---|---|---|
| A | base canônica | crítica | 4–6h |
| B | persistência real e hardening | crítica | 6–10h |
| C | bootstrap auditável | crítica | 4–8h |
| D | métricas oficiais e scorecard | alta | 8–12h |
| E | adequação da aplicação | alta | 8–12h |
| F | dual-run, cutover e operação assistida | crítica | 6–10h |

**Estimativa total revisada:** 36–58h de implementação, a depender do grau de reaproveitamento do schema atual e da necessidade de homologação funcional por domínio.

---

## Conclusão

O programa PE2026 deve sair do paradigma de “plataforma com dados mockados” para o paradigma de **plataforma oficial de gestão do plano**. Isso exige mais do que trocar arrays mockados: exige domínio canônico, persistência real, cálculo executivo homologado, reconciliação formal e go-live controlado.

Este `v2` estabelece essa transição de forma técnica, auditável e operacional.

---

*MEGAPLAN PE Real v2.0 — Março/2026 — Aero Engenharia + Techdengue*
