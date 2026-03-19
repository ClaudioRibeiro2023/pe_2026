# DOC 11-C v2 — Caderno Gerencial Produto/Dados/P&D

**Mandato · Fronteiras · Programas · Envelope · Placar · Governança**

---

| Campo | Valor |
|---|---|
| **Versão** | 2.0 |
| **Data de revisão** | Março/2026 |
| **Camada** | 2 — MBR (Caderno Gerencial) |
| **Classificação** | Confidencial — Uso interno da Direção |
| **Responsável** | Cláudio Ribeiro — Direção Executiva |
| **Lacunas endereçadas** | LR-05 (P&D como equipe dedicada) · LC-04 (parcial) |
| **Base de referência** | DOC 11-C original + DOC 06 v2 + ESTUDO_DESPESAS_2025 + Calibrações #2, #4, #10 |

---

## Sumário

1. Contexto e justificativa estratégica
2. Mandato da área de Produto/Dados/P&D
3. Fronteiras e interfaces
4. Premissas e restrições
5. Arquitetura gerencial — Objetivos e programas
6. Envelope orçamentário 2026
7. Placar — KPIs e guardrails
8. Governança WBR / MBR / QBR
9. Entregas mínimas do ano
10. Identidade visual por programa
11. Rastreabilidade
12. Glossário

---

## 1. Contexto e justificativa estratégica

A tese estratégica do PE2026 posiciona Produto, Dados e P&D como pilar de vantagem defensável (OKR-P4). A construção de densidade intelectual — prova de valor, inteligência de dados, automação e maturidade de produto — é condição para o Techdengue atingir padrão sell-ready em 5 anos. Em 2025, P&D operou com subinvestimento de 38,3% (R$512K real vs R$829K orçado), resultando em atraso em frentes críticas como pacote de evidências, baseline de adoção e automação.

A área não possui equipe formal dedicada. O modelo operacional real é Direção Executiva como sponsor e decisor, com consultorias externas como executoras de frentes específicas. A revisão v2 reflete essa realidade — sem premissa de contratação P&D em 2026 (Cal.#2, Cal.#4).

### 1.1 Gaps quantificados

| Tema | Situação 2025 | Meta H1/2026 | Meta H2/2026 |
|---|---|---|---|
| **Prova de valor por contratante** | Inexistente — sem pacote padronizado | Pacote Top-14 mensal + devolutiva ≥ 70% | 100% Pareto com prova recorrente |
| **Inteligência de dados** | Dados operacionais sem consolidação analítica | Baseline adoção + painel monetização | Melhoria ≥ 15% uso do produto |
| **Automação e IA** | Nenhuma frente implantada | Roadmap priorizado + 1ª frente em execução | ≥ 2 frentes com ganho mensurável |
| **Padronização do fluxo** | Processos informais, retrabalho recorrente | Fluxo padrão documentado | Retrabalho −20% vs baseline |
| **Maturidade documental sell-ready** | Sem IP, sem portfólio técnico estruturado | Inventário de ativos + roadmap | Portfólio v1.0 para diligência |

### 1.2 Por que 2026 amplifica o risco

2026 concentra pressões sobre P&D: a monetização da base contratual (P2) exige prova de valor padronizada; a escala operacional (P3) demanda automação para sustentar margem; a tese sell-ready requer maturidade documental e de produto; e a IA aprovada (R$230-370K) exige orientação estratégica de P&D mesmo que executada por Tecnologia. Se os gaps não forem tratados: prova de valor improvisada, escala sem padronização e diligência sem lastro técnico.

---

## 2. Mandato da área de Produto/Dados/P&D

> 🔵 **Calibração #4** — P&D opera sem equipe formal dedicada. Modelo: Direção Executiva como sponsor/decisor + consultorias externas como executoras.

| Responsabilidade | Descrição |
|---|---|
| **Orientação estratégica de produto** | Definir roadmap, priorização de funcionalidades e evolução do portfólio Techdengue e Aero |
| **Prova de valor e inteligência de dados** | Construir, padronizar e entregar pacotes de evidências para contratantes, alimentando CS e Comercial |
| **Orientação de IA e automação** | Definir diretrizes, priorizar frentes e validar resultados. Execução via centro Tecnologia/Investimentos (Cal.#10) |
| **Padronização e qualidade do fluxo** | Documentar processos-chave, reduzir retrabalho, elevar qualidade de entrega operacional |
| **Maturidade técnica sell-ready** | Construir portfólio de IP, documentação técnica e ativos de conhecimento para diligência futura |
| **Gestão de consultorias P&D** | Contratar, acompanhar e avaliar entregas de consultorias externas que executam frentes de P&D |

### 2.1 O que P&D não faz

**Execução direta de IA/automação** — centro Tecnologia/Investimentos (Cal.#10). **Operação de campo** — área de Operações. **Relacionamento direto com contratante** — CS/Relacionamento. **Geração de demanda ou posicionamento** — Marketing.

---

## 3. Fronteiras e interfaces

| Área | Interface com P&D | Papel de P&D |
|---|---|---|
| **Operações** | Fluxo operacional, qualidade de entrega, retrabalho | Define padrão; Operações executa e reporta aderência |
| **CS / Relacionamento** | Prova de valor, devolutiva, adoção de produto | Produz pacote de evidências; CS entrega e coleta feedback |
| **Marketing** | Conteúdo técnico, kits de prova de valor | Fornece insumo técnico; MKT posiciona e distribui |
| **Comercial (em criação)** | Portfólio técnico, argumentário de valor | Fornece material técnico; Comercial usa em prospecção |
| **Tecnologia/Investimentos** | IA, automação, sistemas | Orienta e valida; Tecnologia executa e mantém |
| **Financeiro** | Envelope P&D, ROI de investimentos | Define necessidade; Financeiro controla e reporta |

### 3.1 Regras de fronteira

P&D é dono do "quê" e "por quê"; as áreas executoras são donas do "como" e "quando". Quando há sobreposição (ex.: conteúdo técnico para MKT, ferramentas para CS), P&D produz o ativo; a área parceira distribui e opera. Conflitos de priorização sobem para a Direção Executiva na WBR.

---

## 4. Premissas e restrições

### 4.1 Premissas

| # | Premissa | Se não se confirmar |
|---|---|---|
| PM-01 | Direção Executiva mantém disponibilidade de 15-20% para sponsorship P&D | Frentes sem decisor → atraso em entregas críticas |
| PM-02 | Consultorias externas contratáveis com lead time ≤ 30 dias | Início de frentes atrasa → timeline de KRs comprometida |
| PM-03 | Dados operacionais de 2025 disponíveis e confiáveis para baseline | Baseline imprecisa → metas de melhoria sem referência |
| PM-04 | CS e Operações colaboram na coleta de dados e feedback de contratantes | P&D sem insumo → prova de valor incompleta |
| PM-05 | Envelope de R$700-900K aprovado e disponível por trimestre | Subinvestimento recorrente → repetição de 2025 |

### 4.2 Restrições

| # | Restrição | Implicação |
|---|---|---|
| RS-01 | Sem contratação de liderança P&D em 2026 (Cal.#2) | Toda coordenação fica com Direção Executiva |
| RS-02 | IA/Automação executada por Tecnologia, não P&D (Cal.#10) | P&D orienta e valida, mas não controla prazo de execução |
| RS-03 | Orçamento IA (R$230-370K) separado do envelope P&D | Envelope P&D de R$700-900K não inclui investimentos IA |
| RS-04 | Área Comercial em criação — sem interlocutor fixo até Q2 | Portfólio técnico fica com P&D e CS até ativação do Comercial |
| RS-05 | Sem equipe interna P&D — dependência total de consultorias | Risco de continuidade se consultoria descontinuar |

---

## 5. Arquitetura gerencial — Objetivos e programas

A área opera com 4 objetivos estratégicos desdobrados em 4 programas, cada um vinculado a OKRs corporativos. O modelo é orientado por resultados (KRs), não por atividades.

### 5.1 Objetivos estratégicos do ano

| Código | Objetivo | Pilar PE | OKR Corporativo |
|---|---|---|---|
| **O1** | Padronizar fluxo e elevar qualidade operacional | P3 — Escala/Margem | OKR-P3 (P3.3, P3.4) |
| **O2** | Construir prova de valor e inteligência de dados | P4 — Produto/Dados/IA | OKR-P4 (P4.1–P4.4) |
| **O3** | Orientar IA e automação como alavanca de eficiência | P4 — Produto/Dados/IA | OKR-P4 (P4.5) |
| **O4** | Elevar maturidade técnica para padrão sell-ready | P1 — Governança/Spin-off | OKR-P1 (P1.5) |

### 5.2 Programas vinculados

| Programa | Obj. | Problema que resolve | Executor primário |
|---|---|---|---|
| **P&D-P1 · Eficiência e Qualidade do Fluxo** `#455A64` | O1 | Processos informais geram retrabalho e inconsistência de entrega | Consultoria processos + Operações |
| **P&D-P2 · Prova de Valor e Inteligência de Dados** `#00838F` | O2 | Contratantes não recebem evidência padronizada de resultado — risco de não renovação | Consultoria dados + CS |
| **P&D-P3 · IA Aplicada e Automação** `#6D4C41` | O3 | Processos manuais limitam escala e comprimem margem | Tecnologia (execução) · P&D (orientação) |
| **P&D-P4 · Novos Produtos e Maturidade Sell-Ready** `#E65100` | O4 | Sem portfólio técnico nem IP documentada, diligência futura fica sem lastro | Consultoria produto + Comercial (quando ativa) |

---

## 6. Envelope orçamentário 2026

> 🟢 Envelope P&D: R$700-900K. Separado do investimento IA/Automação (R$230-370K em Tecnologia). Base: P&D 2025 real R$512K + restauração.

| Componente | Faixa (R$) | Status | Vínculo |
|---|---|---|---|
| Consultorias especializadas (dados, produto, processos) | R$ 350–450K | A contratar | P&D-P1, P2, P4 |
| Modelos analíticos e ferramentas | R$ 150–200K | Parcial existente | P&D-P2 |
| Testes de campo e prototipagem | R$ 80–100K | Sob demanda | P&D-P1, P4 |
| Licenças e plataformas | R$ 40–60K | Renovação + novas | P&D-P2, P3 |
| Folha P&D (alocação Direção) | R$ 65–80K | Ativo | Transversal |
| Contingência P&D (5%) | R$ 35–45K | Reserva | — |

**Envelope total P&D: R$ 700–900K** · Variação vs 2025: +37% a +76% · Meta de P&D/Receita: ≥ 6,5%

### 6.1 Relação com IA/Automação

O investimento em IA/Automação (R$230-370K, Cal.#10) está alocado no centro de custo Tecnologia/Investimentos, não no envelope P&D. P&D contribui com orientação estratégica (roadmap, priorização, validação de resultados), mas o custo de execução é separado. Essa separação evita distorção do envelope P&D e mantém rastreabilidade contábil limpa.

---

## 7. Placar — KPIs e guardrails

### 7.1 KPIs de acompanhamento

| # | KPI | Frequência | Meta | Programa |
|---|---|---|---|---|
| KPI-01 | % contratantes Pareto Top-14 com pacote de evidências entregue | Mensal | ≥ 70% até jun · 100% até dez | P&D-P2 |
| KPI-02 | Taxa de devolutiva registrada por contratante | Mensal | ≥ 70% | P&D-P2 |
| KPI-03 | Índice de adoção do produto (baseline → melhoria) | Trimestral | Baseline Q1 · +15% até dez | P&D-P2 |
| KPI-04 | Frentes de automação/IA com ganho mensurável | Trimestral | ≥ 2 até set/2026 | P&D-P3 |
| KPI-05 | Redução de retrabalho operacional vs baseline | Trimestral | −20% até dez/2026 | P&D-P1 |
| KPI-06 | Execução do envelope P&D (% gasto vs alocado) | Mensal | 70–100% (evitar sub/sobreexecução) | Transversal |
| KPI-07 | Ativos técnicos documentados para diligência | Semestral | Inventário Q2 · Portfólio v1.0 Q4 | P&D-P4 |

### 7.2 Guardrails

| Guardrail | Nível | Gatilho | Ação |
|---|---|---|---|
| Subexecução P&D > 25% por trimestre | **CRÍTICO** | Gasto < 75% do alocado trimestral | Revisão extraordinária de roadmap e consultorias |
| Nenhuma frente IA iniciada até jun/2026 | **CRÍTICO** | P4.5 sem avanço no H1 | Escalar para Direção com plano de contingência |
| Prova de valor sem uso por CS | ATENÇÃO | Pacote entregue mas não utilizado em ≥ 3 meses | Revisar formato e canal com CS |
| Consultoria sem entrega em 60 dias | ATENÇÃO | Contrato ativo sem deliverable | Revisão contratual + plano B |

---

## 8. Governança WBR / MBR / QBR

| Cadência | Pauta fixa | Saída obrigatória |
|---|---|---|
| **WBR (semanal)** · 15 min — Direção + partners | Status das INITs ativas · Impedimentos · Decisões rápidas · Semáforo atualizado | Painel WBR atualizado com semáforo e próxima ação por INIT |
| **MBR (mensal)** · 30 min — Direção + Coord. áreas | KPIs do mês · Execução do envelope · Andamento dos programas · Riscos emergentes | Relatório MBR com KPIs, desvios e plano de correção |
| **QBR (trimestral)** · 60 min — Direção + Board | Revisão de tese P&D · Roadmap vs realidade · ROI de consultorias · Decisões estruturais | Apresentação executiva com recomendação de ajustes para próximo trimestre |

> 🟡 A WBR de P&D pode ser integrada à WBR geral da Direção, dado que o sponsor é o mesmo. A separação só é necessária se o volume de INITs justificar.

---

## 9. Entregas mínimas do ano

| # | Entrega | Programa | Deadline | Evidência |
|---|---|---|---|---|
| E-01 | Fluxo operacional padrão documentado | P&D-P1 | Jun/2026 | Documento + baseline retrabalho |
| E-02 | Pacote de Evidências Top-14 operante mensalmente | P&D-P2 | Mar–Jun/2026 | EVID mensal + devolutiva registrada |
| E-03 | Relatório executivo de prova de valor v1.0 | P&D-P2 | Mar/2026 | Documento publicado + uso por CS |
| E-04 | Painel de gestão da monetização operante | P&D-P2 | Abr/2026 | Dashboard ativo + leitura WBR |
| E-05 | Baseline de uso do produto | P&D-P2 | Abr/2026 | Métricas registradas + plano de melhoria |
| E-06 | Roadmap IA priorizado e validado | P&D-P3 | Abr/2026 | Documento + aprovação Direção |
| E-07 | ≥ 2 frentes IA com ganho mensurável | P&D-P3 | Set/2026 | Evidência de tempo, custo ou qualidade |
| E-08 | Inventário de ativos técnicos/IP | P&D-P4 | Jun/2026 | Catálogo documentado |
| E-09 | Portfólio técnico v1.0 para diligência | P&D-P4 | Dez/2026 | Documento entregável para due diligence |

---

## 10. Identidade visual por programa

| Swatch | Programa | Hex | Token |
|---|---|---|---|
| 🟫 | P&D-P1 · Eficiência e Qualidade do Fluxo | `#455A64` | P&D-P1 |
| 🟦 | P&D-P2 · Prova de Valor e Inteligência de Dados | `#00838F` | P&D-P2 |
| 🟤 | P&D-P3 · IA Aplicada e Automação | `#6D4C41` | P&D-P3 |
| 🟧 | P&D-P4 · Novos Produtos e Maturidade Sell-Ready | `#E65100` | P&D-P4 |

> 🟡 Paleta estrutural PE2026 mantida: navy #0C2340 / accent #2980B9. Paletas RH e MKT preservadas sem alteração.

---

## 11. Rastreabilidade

### 11.1 Decisões executivas de referência (DECs)

| DEC | Conteúdo | Data |
|---|---|---|
| Cal.#2 | Prioridade COO + Comercial > P&D Supervisor | Fev/2026 |
| Cal.#4 | P&D sem equipe formal — Direção + consultorias | Fev/2026 |
| Cal.#10 | IA/Automação R$230-370K em Tecnologia, não P&D | Fev/2026 |

### 11.2 Dependências externas

| De | Para P&D | Natureza |
|---|---|---|
| CS / Relacionamento | Dados de feedback e adoção dos contratantes | Insumo para P&D-P2 |
| Operações | Dados de retrabalho, lead time, qualidade de entrega | Insumo para P&D-P1 |
| Tecnologia/Investimentos | Execução de frentes IA aprovadas | Executor de P&D-P3 |
| Financeiro | Liberação trimestral do envelope P&D | Recurso |
| Comercial (quando ativa) | Feedback de mercado, demanda de portfólio | Insumo para P&D-P4 |

---

## 12. Glossário

| Termo | Significado |
|---|---|
| Pacote de Evidências | Conjunto padronizado de indicadores, mapas e resultados entregue a cada contratante mensalmente |
| Devolutiva | Retorno formal do contratante sobre o pacote de evidências recebido — indicador de engajamento |
| Baseline de adoção | Medição inicial de uso do produto (métricas de engajamento, funcionalidades utilizadas, satisfação) |
| Prova de valor | Demonstração quantificada do impacto do serviço — insumo para renovação e expansão |
| Roadmap de produto | Plano priorizado de evolução de funcionalidades e novos produtos, com horizonte de 12-18 meses |
| IP (Propriedade Intelectual) | Ativos de conhecimento documentados: modelos, algoritmos, processos, publicações, marcas |
| Sell-ready | Padrão de maturidade técnica e documental compatível com processo de diligência/transação |
| Diligência (due diligence) | Processo de auditoria técnica e financeira para avaliação de empresa em contexto de transação |
| Envelope orçamentário | Limite macro de despesa por área, sem detalhamento mensal — restrição que dá credibilidade ao plano |
| Guardrail | Limite de segurança que, quando violado, ativa revisão extraordinária ou escala para decisor |

---

*DOC 11-C v2 — Caderno Gerencial Produto/Dados/P&D — Março/2026 — Bloco B3*

*Aero Engenharia + Techdengue · Confidencial — Uso Interno da Direção*
