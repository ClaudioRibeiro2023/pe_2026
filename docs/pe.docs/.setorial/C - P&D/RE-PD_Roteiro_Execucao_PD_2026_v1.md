# RE-P&D v1 — Roteiro de Execução Produto/Dados/P&D

**Camada 3 · WBR · 14 INIT Cards · Envelope · Painel Operacional**

---

| Campo | Valor |
|---|---|
| **Versão** | 1.0 |
| **Data** | Março/2026 |
| **Camada** | 3 — WBR (Roteiro de Execução) |
| **Classificação** | Confidencial — Uso interno da Direção |
| **Responsável** | Cláudio Ribeiro — Direção Executiva |
| **Base** | DOC 11-C v2 + DOC 11-C.1 v2 + DOC 11-C.2 v2 |
| **Modelo** | RE-RH v1 + RE-MKT v1 (validados) |

---

## Sumário

1. Contexto e princípios
2. Tabela master — todas as INITs
3. Envelope orçamentário do roteiro
4. INIT Cards — P&D-P1 (Eficiência e Qualidade)
5. INIT Cards — P&D-P2 (Prova de Valor e Dados)
6. INIT Cards — P&D-P3 (IA e Automação)
7. INIT Cards — P&D-P4 (Produtos e Sell-Ready)
8. Painel WBR
9. Glossário operacional

---

## 1. Contexto e princípios

> 🔵 A Camada 3 é aditiva — não altera documentos das Camadas 1 e 2 já entregues. O Roteiro de Execução (RE) traduz os cadernos setoriais em linguagem operacional para acompanhamento WBR.

Este RE contém 14 iniciativas (INIT-PD-001 a 014) distribuídas em 4 programas, com envelope consolidado de R$700-900K. Cada INIT card tem 14 campos obrigatórios: rastreabilidade OKR/KR, sponsor, dono nomeado, partners, problema, hipótese, escopo/entregáveis, prazo, dependências, capacidade, custo em BRL, riscos/mitigação, evidências e critério de encerramento.

O modelo segue os REs validados de RH e MKT. A terminologia operacional é traduzida no glossário ao final.

---

## 2. Tabela master — todas as INITs

| INIT | Título | Prog. | Prior. | Custo | Prazo | Tipo | Sem. |
|---|---|---|---|---|---|---|---|
| PD-001 | Mapeamento do fluxo operacional padrão | P1 | Alta | R$60–80K | Mar/26 | PROJ | 🟢 |
| PD-002 | Programa de redução de retrabalho | P1 | Alta | R$40–60K | Jun/26 | IMPL | ⚪ |
| PD-003 | Padronização de checklists de campo | P1 | Média | R$15–25K | Mar/26 | ROT | 🟢 |
| PD-004 | Construção do Pacote de Evidências Top-14 | P2 | **Crítica** | R$120–160K | Mar/26 | PROJ | 🟢 |
| PD-005 | Relatório executivo de prova de valor v1.0 | P2 | **Crítica** | R$30–45K | Mar/26 | PROJ | 🟢 |
| PD-006 | Painel de gestão da monetização | P2 | **Crítica** | R$60–80K | Abr/26 | IMPL | 🟢 |
| PD-007 | Baseline de uso do produto | P2 | Alta | R$40–55K | Abr/26 | PROJ | 🟢 |
| PD-008 | Expansão pacote evidências 100% Pareto | P2 | Média | R$30–40K | Jul/26 | IMPL | ⚪ |
| PD-009 | Roadmap de IA priorizado | P3 | Alta | R$35–50K | Abr/26 | PROJ | 🟢 |
| PD-010 | Framework ROI para frentes IA | P3 | Alta | R$25–35K | Jun/26 | PROJ | 🟢 |
| PD-011 | Execução e validação ≥ 2 frentes IA | P3 | **Crítica** | R$20–30K | Abr/26 | IMPL | ⚪ |
| PD-012 | Inventário de ativos técnicos e IP | P4 | Média | R$40–55K | Jun/26 | PROJ | 🟢 |
| PD-013 | Roadmap de produto | P4 | Média | R$35–45K | Jun/26 | PROJ | 🟢 |
| PD-014 | Portfólio técnico v1.0 para diligência | P4 | Média | R$50–65K | Dez/26 | PROJ | ⚪ |

---

## 3. Envelope orçamentário do roteiro

| Programa | # INITs | Envelope | % Total | Executor |
|---|---|---|---|---|
| P&D-P1 · Eficiência e Qualidade | 3 | R$ 115–165K | 16–18% | Consultoria processos + Operações |
| P&D-P2 · Prova de Valor e Dados | 5 | R$ 280–380K | 40–42% | Consultoria dados + CS |
| P&D-P3 · IA e Automação | 3 | R$ 80–115K | 11–13% | Consultoria IA + Tecnologia |
| P&D-P4 · Produtos e Sell-Ready | 3 | R$ 125–165K | 18% | Consultoria produto |
| Folha P&D (Direção) | — | R$ 65–80K | 9% | Direção Executiva |
| Contingência (5%) | — | R$ 35–45K | 5% | Reserva |

**Total RE-P&D: R$ 700–900K** · Separado do envelope IA/Tecnologia (R$230-370K, Cal.#10)

---

## 4. INIT Cards — P&D-P1 (Eficiência e Qualidade do Fluxo) `#455A64`

### INIT-PD-001 — Mapeamento e documentação do fluxo operacional padrão [PROJETO · Alta · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P3 → KR-P3.3, P3.4 → KR-C1.1, KR-C1.2 |
| **Sponsor** | Cláudio Ribeiro — Direção Executiva |
| **Dono (Owner)** | Consultoria Processos (a contratar) |
| **Partners** | Operações (líderes de campo) |
| **Problema** | Processos-chave não documentados geram retrabalho estimado em 8-12% do esforço operacional |
| **Hipótese** | Mapeamento e padronização reduzirão retrabalho e criarão base mensurável |
| **Escopo e entregáveis** | (1) Mapa BPMN; (2) Manual v1.0; (3) Treinamento com registro; (4) Baseline retrabalho |
| **Prazo** | Mar–Jun/2026 |
| **Dependências** | PM-04 (Operações) · Contratação consultoria (≤ 30d) |
| **Capacidade** | Consultoria ~200h · Operações ~40h · Direção ~15h |
| **Custo (BRL)** | R$ 60–80K |
| **Riscos e mitigação** | Operações indisponível → slots fixos Q1 · Complexidade → priorizar top-5 |
| **Evidências** | P&D2026/P1/INIT-001/EVID_202606_mapa_processos.pdf |
| **Critério de encerramento** | ✓ 100% documentados ✓ Aderência ≥ 85% ✓ Baseline registrada |

### INIT-PD-002 — Programa de redução de retrabalho operacional [IMPLANTAÇÃO · Alta · ⚪]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P3 → KR-P3.3, P3.4 → KR-C1.3 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Processos + Coord. Operações |
| **Partners** | Operações (equipes de campo) |
| **Problema** | Retrabalho consome margem e capacidade. Sem baseline não há medição |
| **Hipótese** | Checkpoints de qualidade nos fluxos reduzirão retrabalho ≥ 20% |
| **Escopo e entregáveis** | (1) Causas-raiz; (2) Checkpoints; (3) Dashboard mensal; (4) Meta −20% |
| **Prazo** | Jun–Dez/2026 (pós-baseline) |
| **Dependências** | INIT-PD-001 concluída |
| **Capacidade** | Consultoria ~120h · Operações ~60h · Direção ~10h |
| **Custo (BRL)** | R$ 40–60K |
| **Riscos e mitigação** | Baseline imprecisa → proxy confiável · Resistência → líderes no design |
| **Evidências** | P&D2026/P1/INIT-002/EVID_202612_retrabalho_dashboard.xlsx |
| **Critério de encerramento** | ✓ Causas-raiz mapeadas ✓ Checkpoints operantes ✓ −20% evidenciado |

### INIT-PD-003 — Padronização de checklists de campo [ROTINA · Média · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P3 → KR-P3.3 → KR-C1.1 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Coord. Operações |
| **Partners** | Consultoria Processos · Equipes de campo |
| **Problema** | Procedimentos variam entre equipes, gerando inconsistência |
| **Hipótese** | Checklist unificado digital elevará consistência e facilitará auditoria |
| **Escopo e entregáveis** | (1) Modelo unificado; (2) Digital; (3) Treinamento; (4) Auditoria trimestral |
| **Prazo** | Mar–Jun/2026 (implantação) · Contínuo (auditoria) |
| **Dependências** | Colaboração Operações |
| **Capacidade** | Operações ~80h · Consultoria ~40h · Direção ~5h |
| **Custo (BRL)** | R$ 15–25K |
| **Riscos e mitigação** | Resistência → líderes no design do modelo |
| **Evidências** | P&D2026/P1/INIT-003/EVID_2026Q3_aderencia_checklist.pdf |
| **Critério de encerramento** | ✓ Publicado ✓ 100% treinadas ✓ Aderência ≥ 85% |

---

## 5. INIT Cards — P&D-P2 (Prova de Valor e Inteligência de Dados) `#00838F`

### INIT-PD-004 — Construção do Pacote de Evidências Top-14 [PROJETO · Crítica · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.1 → KR-C2.1 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Dados (a contratar) |
| **Partners** | CS/Relacionamento · Operações (dados) |
| **Problema** | Contratantes não recebem evidência padronizada — risco de não renovação |
| **Hipótese** | Pacote mensal padronizado elevará engajamento e devolutiva |
| **Escopo e entregáveis** | (1) Template; (2) Motor de dados; (3) Piloto 3 contratantes; (4) Escala Top-14; (5) Registro devolutiva |
| **Prazo** | Mar–Jun/2026 |
| **Dependências** | PM-03 (dados) · PM-04 (CS) · Contratação consultoria |
| **Capacidade** | Consultoria ~300h · CS ~60h · Operações ~40h · Direção ~20h |
| **Custo (BRL)** | R$ 120–160K |
| **Riscos e mitigação** | Dados insuficientes → sprint coleta Q1 · CS sem capacidade → simplificar formato |
| **Evidências** | P&D2026/P2/INIT-004/EVID_2026MM_pacote_[contratante].pdf |
| **Critério de encerramento** | ✓ Template validado ✓ Motor operante ✓ Top-14 mensal ✓ Devolutiva ≥ 70% |

### INIT-PD-005 — Relatório executivo de prova de valor v1.0 [PROJETO · Crítica · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.2 → KR-C2.2 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Dados |
| **Partners** | CS · MKT |
| **Problema** | Sem documento institucional de impacto quantificado |
| **Hipótese** | Relatório executivo criará instrumento de renovação e prospecção |
| **Escopo e entregáveis** | (1) Dados 2025; (2) Redação executiva; (3) Validação; (4) Publicação via CS |
| **Prazo** | Mar/2026 → atualização semestral |
| **Dependências** | Dados 2025 · Aprovação Direção |
| **Capacidade** | Consultoria ~80h · CS ~15h · MKT ~10h · Direção ~10h |
| **Custo (BRL)** | R$ 30–45K |
| **Riscos e mitigação** | Dados incompletos → amostra Top-14 |
| **Evidências** | P&D2026/P2/INIT-005/EVID_202603_relatorio_prova_valor_v1.pdf |
| **Critério de encerramento** | ✓ Publicado ✓ Em uso por CS ✓ Feedback ≥ 3 contratantes |

### INIT-PD-006 — Painel de gestão da monetização [IMPLANTAÇÃO · Crítica · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.3 → KR-C2.3 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Dados |
| **Partners** | Financeiro · Operações |
| **Problema** | Sem visão consolidada de saldo, vazão e previsibilidade |
| **Hipótese** | Dashboard integrado com leitura WBR dará visibilidade em tempo real |
| **Escopo e entregáveis** | (1) Métricas; (2) Dashboard; (3) Beta; (4) Go-live + treinamento |
| **Prazo** | Abr/2026 |
| **Dependências** | Fontes de dados integradas · PM-03 |
| **Capacidade** | Consultoria ~150h · Financeiro ~20h · Direção ~15h |
| **Custo (BRL)** | R$ 60–80K |
| **Riscos e mitigação** | Integração lenta → MVP Top-14 primeiro |
| **Evidências** | P&D2026/P2/INIT-006/EVID_202604_painel_monetizacao_golive.pdf |
| **Critério de encerramento** | ✓ Dashboard operante ✓ WBR semanal ✓ Dados D+1 |

### INIT-PD-007 — Baseline de uso do produto e plano de melhoria [PROJETO · Alta · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.4 → KR-C2.4, KR-C2.5 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Dados |
| **Partners** | CS · Operações |
| **Problema** | Melhorias guiadas por intuição, não por dados |
| **Hipótese** | Baseline quantificada permitirá priorizar com impacto e medir progresso |
| **Escopo e entregáveis** | (1) Métricas de adoção; (2) Coleta baseline; (3) Plano de melhoria; (4) Meta +15% |
| **Prazo** | Abr/2026 (baseline) → Dez/2026 (+15%) |
| **Dependências** | CS disponível · Dados acessíveis |
| **Capacidade** | Consultoria ~100h · CS ~30h · Direção ~10h |
| **Custo (BRL)** | R$ 40–55K |
| **Riscos e mitigação** | Coleta difícil → proxy simples e refinar |
| **Evidências** | P&D2026/P2/INIT-007/EVID_202604_baseline_adocao.xlsx |
| **Critério de encerramento** | ✓ Métricas ✓ Baseline ✓ Plano ✓ +15% evidenciado |

### INIT-PD-008 — Expansão pacote evidências 100% Pareto [IMPLANTAÇÃO · Média · ⚪]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.1 → KR-C2.1 (expansão) |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Dados |
| **Partners** | CS |
| **Problema** | Cobertura parcial limita impacto na retenção |
| **Hipótese** | Motor automatizado + templates por perfil escalam sem esforço proporcional |
| **Escopo e entregáveis** | (1) Avaliação escalabilidade; (2) Templates por perfil; (3) Expansão Q3-Q4 |
| **Prazo** | Jul–Dez/2026 |
| **Dependências** | INIT-PD-004 estabilizado |
| **Capacidade** | Consultoria ~80h · CS ~20h |
| **Custo (BRL)** | R$ 30–40K |
| **Riscos e mitigação** | Volume → automatizar via template paramétrico |
| **Evidências** | P&D2026/P2/INIT-008/EVID_202612_cobertura_pareto_100.pdf |
| **Critério de encerramento** | ✓ 100% Pareto ✓ Devolutiva ≥ 70% |

---

## 6. INIT Cards — P&D-P3 (IA Aplicada e Automação) `#6D4C41`

### INIT-PD-009 — Roadmap de IA priorizado [PROJETO · Alta · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.5 → KR-C3.1 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria IA (a contratar) |
| **Partners** | Tecnologia · Operações |
| **Problema** | IA aprovada (R$230-370K) sem priorização gera dispersão |
| **Hipótese** | Roadmap com critérios de ROI focará investimento |
| **Escopo e entregáveis** | (1) Inventário oportunidades; (2) Framework ROI; (3) Priorização; (4) Roadmap v1.0 |
| **Prazo** | Abr/2026 |
| **Dependências** | Framework ROI (INIT-010, paralelo) · Input Operações |
| **Capacidade** | Consultoria ~80h · Tecnologia ~20h · Operações ~15h · Direção ~15h |
| **Custo (BRL)** | R$ 35–50K |
| **Riscos e mitigação** | Dimensionamento errado → POC antes de investimento full |
| **Evidências** | P&D2026/P3/INIT-009/EVID_202604_roadmap_ia_v1.pdf |
| **Critério de encerramento** | ✓ Inventário ✓ Framework ✓ Roadmap aprovado |

### INIT-PD-010 — Framework de avaliação de ROI para frentes IA [PROJETO · Alta · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.5 → KR-C3.3 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria IA |
| **Partners** | Financeiro |
| **Problema** | Decisões de investimento IA ad-hoc |
| **Hipótese** | Framework antes/depois permitirá comparar e justificar |
| **Escopo e entregáveis** | (1) Pesquisa; (2) Adaptação; (3) Teste na 1ª frente; (4) Modelo padrão |
| **Prazo** | Jun/2026 |
| **Dependências** | 1ª frente em execução (parcial) |
| **Capacidade** | Consultoria ~60h · Financeiro ~10h · Direção ~10h |
| **Custo (BRL)** | R$ 25–35K |
| **Riscos e mitigação** | Dados insuficientes → definir métricas antes de implantar |
| **Evidências** | P&D2026/P3/INIT-010/EVID_202606_framework_roi_ia.pdf |
| **Critério de encerramento** | ✓ Framework publicado ✓ ≥ 1 frente aplicada ✓ ROI registrado |

### INIT-PD-011 — Execução e validação ≥ 2 frentes IA [IMPLANTAÇÃO · Crítica · ⚪]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P4 → KR-P4.5 → KR-C3.2 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Tecnologia/Investimentos |
| **Partners** | P&D (orientação) · Operações (validação) |
| **Problema** | Nenhuma frente IA implantada — KR-P4.5 exige ≥ 2 até set |
| **Hipótese** | Frentes priorizadas pelo roadmap terão ROI positivo |
| **Escopo e entregáveis** | (1) Seleção; (2) Acompanhamento; (3) Métricas antes/depois; (4) Documentação |
| **Prazo** | Abr–Set/2026 |
| **Dependências** | INIT-009 (roadmap) · Envelope Tecnologia |
| **Capacidade** | Tecnologia ~400h · P&D ~60h · Operações ~40h |
| **Custo (BRL)** | R$ 20–30K (orientação P&D) · R$ 230-370K (Tecnologia — envelope separado) |
| **Riscos e mitigação** | Prioridade concorrente → WBR semanal · Sem ROI → pivotar frente |
| **Evidências** | P&D2026/P3/INIT-011/EVID_202609_frente[N]_ganho.pdf |
| **Critério de encerramento** | ✓ ≥ 2 frentes ✓ Ganho documentado ✓ Framework ROI aplicado |

---

## 7. INIT Cards — P&D-P4 (Novos Produtos e Maturidade Sell-Ready) `#E65100`

### INIT-PD-012 — Inventário de ativos técnicos e IP [PROJETO · Média · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P1 → KR-P1.5 → KR-C4.1 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Produto (a contratar) |
| **Partners** | Todas as áreas |
| **Problema** | IP não documentada é IP perdida |
| **Hipótese** | Catálogo estruturado revelará ativos valiosos e gaps |
| **Escopo e entregáveis** | (1) Levantamento; (2) Classificação; (3) Registro; (4) Relatório gaps |
| **Prazo** | Jun/2026 |
| **Dependências** | Colaboração cross-funcional |
| **Capacidade** | Consultoria ~100h · Áreas ~40h · Direção ~15h |
| **Custo (BRL)** | R$ 40–55K |
| **Riscos e mitigação** | Áreas sem visibilidade → workshop estruturado |
| **Evidências** | P&D2026/P4/INIT-012/EVID_202606_catalogo_ativos_ip.xlsx |
| **Critério de encerramento** | ✓ Catálogo publicado ✓ 100% classificados ✓ Gaps priorizados |

### INIT-PD-013 — Roadmap de produto com priorização [PROJETO · Média · 🟢]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P1 → KR-P1.5 → KR-C4.2 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Produto |
| **Partners** | CS · Comercial (quando ativa) · Operações |
| **Problema** | Evolução de produto sem priorização perde oportunidades |
| **Hipótese** | Framework ICE/RICE alinhará evolução à demanda real |
| **Escopo e entregáveis** | (1) Demandas; (2) Priorização; (3) Validação; (4) Publicação v1.0 |
| **Prazo** | Jun/2026 → revisão trimestral |
| **Dependências** | Feedback CS/Comercial · INIT-012 |
| **Capacidade** | Consultoria ~80h · CS ~20h · Direção ~15h |
| **Custo (BRL)** | R$ 35–45K |
| **Riscos e mitigação** | Conflitos → critérios objetivos documentados |
| **Evidências** | P&D2026/P4/INIT-013/EVID_202606_roadmap_produto_v1.pdf |
| **Critério de encerramento** | ✓ v1.0 publicado ✓ Priorização documentada ✓ Validado |

### INIT-PD-014 — Portfólio técnico v1.0 para diligência [PROJETO · Média · ⚪]

| Campo | Conteúdo |
|---|---|
| **Rastreabilidade OKR/KR** | OKR-P1 → KR-P1.5 → KR-C4.3 |
| **Sponsor** | Cláudio Ribeiro |
| **Dono (Owner)** | Consultoria Produto |
| **Partners** | Financeiro · Direção (narrativa) |
| **Problema** | Sell-ready sem portfólio técnico consolidado |
| **Hipótese** | Portfólio estruturado posicionará empresa para transação futura |
| **Escopo e entregáveis** | (1) Estrutura DD; (2) Consolidação ativos; (3) Narrativa técnica; (4) Validação |
| **Prazo** | Dez/2026 |
| **Dependências** | INIT-012 · INIT-013 |
| **Capacidade** | Consultoria ~120h · Financeiro ~15h · Direção ~20h |
| **Custo (BRL)** | R$ 50–65K |
| **Riscos e mitigação** | Ativos imaturos → classificar maturidade + roadmap evolução |
| **Evidências** | P&D2026/P4/INIT-014/EVID_202612_portfolio_dd_v1.pdf |
| **Critério de encerramento** | ✓ v1.0 publicado ✓ Estrutura DD ✓ Aprovado pela Direção |

---

## 8. Painel WBR

| INIT | Título | Prior. | Status | Próxima ação | Owner |
|---|---|---|---|---|---|
| PD-001 | Mapeamento fluxo operacional | 🟡 | 🟢 | *(a preencher)* | Consultoria Processos |
| PD-002 | Redução de retrabalho | 🟡 | ⚪ | *(a preencher)* | Consultoria + Operações |
| PD-003 | Checklists de campo | ⚪ | 🟢 | *(a preencher)* | Coord. Operações |
| PD-004 | Pacote Evidências Top-14 | 🔴 | 🟢 | *(a preencher)* | Consultoria Dados |
| PD-005 | Relatório prova de valor | 🔴 | 🟢 | *(a preencher)* | Consultoria Dados |
| PD-006 | Painel monetização | 🔴 | 🟢 | *(a preencher)* | Consultoria Dados |
| PD-007 | Baseline adoção | 🟡 | 🟢 | *(a preencher)* | Consultoria Dados |
| PD-008 | Expansão 100% Pareto | ⚪ | ⚪ | *(a preencher)* | Consultoria Dados |
| PD-009 | Roadmap IA | 🟡 | 🟢 | *(a preencher)* | Consultoria IA |
| PD-010 | Framework ROI IA | 🟡 | 🟢 | *(a preencher)* | Consultoria IA |
| PD-011 | ≥ 2 frentes IA | 🔴 | ⚪ | *(a preencher)* | Tecnologia |
| PD-012 | Inventário ativos/IP | ⚪ | 🟢 | *(a preencher)* | Consultoria Produto |
| PD-013 | Roadmap produto | ⚪ | 🟢 | *(a preencher)* | Consultoria Produto |
| PD-014 | Portfólio DD v1.0 | ⚪ | ⚪ | *(a preencher)* | Consultoria Produto |

> 🟡 Legenda semáforo: 🟢 No prazo · 🟡 Atenção · 🔴 Atrasado · ⚪ Aguardando pré-condição

---

## 9. Glossário operacional

| Termo operacional | Equivalente PE2026 | Onde usar |
|---|---|---|
| Roteiro de Execução (RE) | Camada 3 — documento WBR | Este documento |
| INIT card | Cartão de iniciativa com 14 campos | Seções 4–7 |
| Semáforo | Indicador visual de status (🟢🟡🔴⚪) | Painel WBR |
| Sprint Review | Rito quinzenal Direção + Consultoria | Cadência |
| Owner / Dono | Responsável pela entrega da INIT | Cada INIT card |
| Sponsor | Decisor e patrocinador (Direção Executiva) | Cada INIT card |
| Partner | Área que contribui com insumo ou co-execução | Cada INIT card |
| Critério de encerramento | Condição para considerar INIT concluída | Cada INIT card |
| EVID | Evidência documentada de execução | Path de arquivo |
| Baseline | Medição de referência (ponto zero) | KRs de melhoria |
| Motor de dados | Sistema automatizado de geração de pacotes | P&D-P2 |
| Framework ROI | Modelo de avaliação de retorno IA | P&D-P3 |
| Portfólio DD | Documentos para due diligence | P&D-P4 |
| Pacote de Evidências | Kit padronizado por contratante | P&D-P2 |
| Devolutiva | Retorno formal do contratante | P&D-P2 |
| Envelope | Limite macro de despesa por área/programa | Seção 3 |

---

*RE-P&D v1 — Roteiro de Execução Produto/Dados/P&D — Março/2026 — Camada 3*

*Aero Engenharia + Techdengue · Confidencial — Uso Interno da Direção*
