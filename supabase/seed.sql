-- Seed context_store

INSERT INTO context_store (slug, data)
VALUES (
  'scoreboard',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 05 + DOC 06"
  },
  "guardrails": [
    {
      "id": "A1",
      "indicador": "Margem operacional",
      "definicao": "Resultado operacional / receita",
      "valor": 30.8,
      "unidade": "%",
      "cadencia": "Mensal",
      "gatilho": "Queda por 2 meses seguidos",
      "owner": "Financeiro",
      "source": "DRE",
      "status": "OK"
    },
    {
      "id": "A2",
      "indicador": "Caixa e previsibilidade 30/60/90",
      "definicao": "Posicao de caixa + projecao",
      "valor": 62.0,
      "unidade": "%",
      "cadencia": "Semanal",
      "gatilho": "Quebra de previsibilidade",
      "owner": "Financeiro",
      "source": "Fluxo de caixa",
      "status": "ATENCAO"
    },
    {
      "id": "A3",
      "indicador": "Qualidade de entrega",
      "definicao": "Retrabalho + falhas criticas",
      "valor": 8.0,
      "unidade": "%",
      "cadencia": "Semanal",
      "gatilho": "Aumento de falhas repetidas",
      "owner": "Operacao",
      "source": "Auditoria interna",
      "status": "OK"
    },
    {
      "id": "A4",
      "indicador": "Saude organizacional",
      "definicao": "Turnover e pulso de clima",
      "valor": 18.0,
      "unidade": "%",
      "cadencia": "Mensal",
      "gatilho": "Aceleracao de turnover",
      "owner": "RH",
      "source": "People Analytics",
      "status": "OK"
    }
  ],
  "pillars": [
    {
      "pillar": "P1",
      "title": "Estrutura corporativa e governanca",
      "kpis": [
        {
          "id": "P1.KPI-01",
          "indicador": "Separacao gerencial Aero x Techdengue",
          "definicao": "DRE e rotinas por unidade",
          "valor": 72,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Abaixo de 80% por 2 meses",
          "owner": "Direcao Executiva",
          "source": "Relatorios gerenciais",
          "status": "ATENCAO"
        },
        {
          "id": "P1.KPI-02",
          "indicador": "Disciplina documental",
          "definicao": "% de iniciativas com DEC/RSK/EVID",
          "valor": 65,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Abaixo de 75% por 30 dias",
          "owner": "Guardiã PE",
          "source": "MAP-TRC",
          "status": "ATENCAO"
        }
      ]
    },
    {
      "pillar": "P2",
      "title": "Crescimento e diversificacao",
      "kpis": [
        {
          "id": "P2.KPI-01",
          "indicador": "Concentracao de receita",
          "definicao": "% top 5 e participacao Techdengue",
          "valor": 42.0,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Top 5 acima de 45% por 2 meses",
          "owner": "Comercial",
          "source": "Financeiro",
          "status": "ATENCAO"
        },
        {
          "id": "P2.KPI-02",
          "indicador": "Renovacoes e permanencia",
          "definicao": "Contratos renovados vs elegiveis",
          "valor": 78.0,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Renovacao abaixo de 75%",
          "owner": "CS",
          "source": "CRM",
          "status": "OK"
        }
      ]
    },
    {
      "pillar": "P3",
      "title": "Excelencia operacional e escala",
      "kpis": [
        {
          "id": "P3.KPI-01",
          "indicador": "Capacidade operacional",
          "definicao": "Capacidade disponivel vs necessaria",
          "valor": 84.0,
          "unidade": "%",
          "cadencia": "Semanal",
          "gatilho": "Capacidade abaixo de 80%",
          "owner": "Operacao",
          "source": "Pipeline operacional",
          "status": "OK"
        },
        {
          "id": "P3.KPI-02",
          "indicador": "Produtividade por equipe",
          "definicao": "Ha por equipe/semana",
          "valor": 1150,
          "unidade": "ha",
          "cadencia": "Semanal",
          "gatilho": "Queda acima de 10% por 2 semanas",
          "owner": "Operacao",
          "source": "Relatorio operacional",
          "status": "OK"
        }
      ]
    },
    {
      "pillar": "P4",
      "title": "Produto, dados e IA",
      "kpis": [
        {
          "id": "P4.KPI-01",
          "indicador": "Prova de valor entregue",
          "definicao": "Pacotes de evidencia por Pareto",
          "valor": 58,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Abaixo de 60% por ciclo",
          "owner": "Produto/Dados",
          "source": "Biblioteca de provas",
          "status": "ATENCAO"
        },
        {
          "id": "P4.KPI-02",
          "indicador": "Automacao aplicada",
          "definicao": "Ganho operacional mensurado",
          "valor": 12.5,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Ganho abaixo de 10%",
          "owner": "Produto/Dados",
          "source": "Relatorios internos",
          "status": "OK"
        }
      ]
    },
    {
      "pillar": "P5",
      "title": "Pessoas e lideranca",
      "kpis": [
        {
          "id": "P5.KPI-01",
          "indicador": "Turnover",
          "definicao": "Rotatividade acumulada",
          "valor": 21.0,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Acima de 30%",
          "owner": "RH",
          "source": "People Analytics",
          "status": "OK"
        },
        {
          "id": "P5.KPI-02",
          "indicador": "Aderencia a rituais de lideranca",
          "definicao": "% de rituais executados",
          "valor": 68.0,
          "unidade": "%",
          "cadencia": "Mensal",
          "gatilho": "Abaixo de 75% por 2 ciclos",
          "owner": "RH",
          "source": "MBR RH",
          "status": "ATENCAO"
        }
      ]
    }
  ],
  "monetization": {
    "summary": {
      "saldoTotal": 88348.85,
      "execucaoPercentual": 62.4,
      "runRateSemanal": 1570,
      "ativacaoPercentual": 48.0,
      "paretoTop14Percent": 71.0,
      "previsao30": 12400,
      "previsao60": 22600,
      "previsao90": 31100,
      "idadeSaldoMedia": 112
    },
    "metrics": [
      {
        "id": "C1",
        "indicador": "Saldo a executar",
        "valor": 88348.85,
        "unidade": "ha",
        "cadencia": "Semanal",
        "gatilho": "Saldo sem reducao por 3 semanas",
        "owner": "CS",
        "source": "Base contratual",
        "alert": "Top-14 concentra 71% do saldo",
        "nota": "Priorizar Pareto Top-14"
      },
      {
        "id": "C2",
        "indicador": "Execucao acumulada",
        "valor": 62.4,
        "unidade": "%",
        "cadencia": "Semanal",
        "gatilho": "Execucao abaixo de 70% no Q1",
        "owner": "Operacao",
        "source": "Relatorio operacional",
        "alert": "Meta Q1: 85%",
        "nota": "Acelerar vazao em fevereiro"
      },
      {
        "id": "C3",
        "indicador": "Vazao de execucao (run-rate)",
        "valor": 1570,
        "unidade": "ha/sem",
        "cadencia": "Semanal",
        "gatilho": "Queda de vazao por 2 semanas",
        "owner": "Operacao",
        "source": "Pipeline operacional",
        "alert": "Queda por 2 semanas aciona War Room",
        "nota": "Monitorar janelas criticas"
      },
      {
        "id": "C4",
        "indicador": "Taxa de ativacao de demanda",
        "valor": 48.0,
        "unidade": "%",
        "cadencia": "Semanal",
        "gatilho": "Ativacao abaixo de 60%",
        "owner": "CS",
        "source": "Plano de ativacao",
        "alert": "Alvo Q2 >= 70%",
        "nota": "Ativar contratantes com saldo envelhecido"
      },
      {
        "id": "C5",
        "indicador": "Previsao 30/60/90",
        "valor": 31100,
        "unidade": "ha",
        "cadencia": "Semanal",
        "gatilho": "Previsao sem evidencia confirmada",
        "owner": "CS",
        "source": "Agenda confirmada",
        "alert": "Sem evidencia -> acionar escalonamento",
        "nota": "Consolidar agenda Pareto"
      },
      {
        "id": "C6",
        "indicador": "Idade do saldo",
        "valor": 112,
        "unidade": "dias",
        "cadencia": "Mensal",
        "gatilho": "> 120 dias",
        "owner": "CS",
        "source": "Base contratual",
        "alert": "> 120 dias aciona plano",
        "nota": "Revisar carteira base"
      },
      {
        "id": "C7",
        "indicador": "Pareto do saldo",
        "valor": 71.0,
        "unidade": "%",
        "cadencia": "Semanal",
        "gatilho": "Top-14 sem plano de ativacao",
        "owner": "CS",
        "source": "Pareto Top-14",
        "alert": "Status de execucao por contratante",
        "nota": "Relatorio semanal por cliente"
      }
    ],
    "warRoom": {
      "status": "Ativo",
      "cadence": "Semanal",
      "focus": "Top-14 + previsao 30/60/90",
      "owner": "CS + Operacao"
    }
  }
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'strategic',
  $$
{
  "metadata": {
    "version": "3.0",
    "lastUpdate": "2026-01-14",
    "source": "Analise_Estrategica_2025_Validada.md + PE2026_Metas_Final.md"
  },
  "pillars": [
    {
      "id": "P1",
      "title": "Estrutura corporativa e governança",
      "frontier": "Governança, separação Aero x Techdengue e padrão sell-ready.",
      "subpillars": [
        {
          "id": "P1.S1",
          "title": "Governança e compliance",
          "frontier": "Rituais, decisões e controles de qualidade contínuos."
        },
        {
          "id": "P1.S2",
          "title": "Finanças por unidade",
          "frontier": "P&L gerencial e disciplina de reporting por unidade."
        },
        {
          "id": "P1.S3",
          "title": "Rastreabilidade e evidências",
          "frontier": "Mapas de rastreabilidade e evidências verificáveis."
        }
      ]
    },
    {
      "id": "P2",
      "title": "Crescimento e diversificação",
      "frontier": "Monetização previsível e carteira diversificada.",
      "subpillars": [
        {
          "id": "P2.S1",
          "title": "Monetização Q1",
          "frontier": "War Room e execução do saldo com previsibilidade."
        },
        {
          "id": "P2.S2",
          "title": "Novos contratos",
          "frontier": "Pipeline robusto e diversificado."
        }
      ]
    },
    {
      "id": "P3",
      "title": "Excelência operacional",
      "frontier": "Escala com qualidade, capacidade e margem sustentadas.",
      "subpillars": [
        {
          "id": "P3.S1",
          "title": "Capacidade e escala",
          "frontier": "Planejamento operacional e produtividade."
        },
        {
          "id": "P3.S2",
          "title": "Qualidade e padronização",
          "frontier": "Processos replicáveis e auditoria interna."
        }
      ]
    },
    {
      "id": "P4",
      "title": "Produto, dados e IA",
      "frontier": "Provas de valor e automação orientada a resultados.",
      "subpillars": [
        {
          "id": "P4.S1",
          "title": "Prova de valor",
          "frontier": "Biblioteca de evidências e painéis por cliente."
        },
        {
          "id": "P4.S2",
          "title": "Automação aplicada",
          "frontier": "Eficiência operacional e uso de IA com governança."
        }
      ]
    },
    {
      "id": "P5",
      "title": "Pessoas e liderança",
      "frontier": "Densidade intelectual, liderança e cultura sustentável.",
      "subpillars": [
        {
          "id": "P5.S1",
          "title": "People analytics",
          "frontier": "Indicadores de clima, retenção e performance."
        },
        {
          "id": "P5.S2",
          "title": "Rituais de liderança",
          "frontier": "Cadência e desenvolvimento de líderes."
        }
      ]
    }
  ],
  "themes": [
    {
      "id": "TH-01",
      "title": "Governança mínima e rastreável",
      "description": "Padrões e evidências obrigatórias para decisões e execução.",
      "pillar": "P1"
    },
    {
      "id": "TH-02",
      "title": "Monetização com previsibilidade",
      "description": "War Room, Pareto ativo e plano de ativação por cliente.",
      "pillar": "P2"
    },
    {
      "id": "TH-03",
      "title": "Escala com qualidade",
      "description": "Processos padronizados, auditoria interna e produtividade.",
      "pillar": "P3"
    },
    {
      "id": "TH-04",
      "title": "Produto como prova de valor",
      "description": "Evidências, painéis e automação aplicada.",
      "pillar": "P4"
    },
    {
      "id": "TH-05",
      "title": "Liderança e pessoas",
      "description": "Rituais de liderança, clima e retenção.",
      "pillar": "P5"
    }
  ],
  "objectives": [
    {
      "id": "OBJ-01",
      "title": "Implementar governança corporativa e separação gerencial",
      "pillar": "P1",
      "theme": "TH-01",
      "owner": "Direção Executiva",
      "linkedOkrs": ["OKR-P1"],
      "krs": ["KR-P1-01", "KR-P1-02", "KR-P1-03"]
    },
    {
      "id": "OBJ-02",
      "title": "Monetizar base contratual com previsibilidade",
      "pillar": "P2",
      "theme": "TH-02",
      "owner": "Direção Executiva",
      "linkedOkrs": ["OKR-P2"],
      "krs": ["KR-P2-01", "KR-P2-02", "KR-P2-03"]
    },
    {
      "id": "OBJ-03",
      "title": "Escalar operação com qualidade e margem",
      "pillar": "P3",
      "theme": "TH-03",
      "owner": "Operação",
      "linkedOkrs": ["OKR-P3"],
      "krs": ["KR-P3-01", "KR-P3-02"]
    },
    {
      "id": "OBJ-04",
      "title": "Produto e dados como prova de valor",
      "pillar": "P4",
      "theme": "TH-04",
      "owner": "Produto/Dados",
      "linkedOkrs": ["OKR-P4"],
      "krs": ["KR-P4-01", "KR-P4-02"]
    },
    {
      "id": "OBJ-05",
      "title": "Fortalecer liderança e densidade intelectual",
      "pillar": "P5",
      "theme": "TH-05",
      "owner": "RH",
      "linkedOkrs": ["OKR-P5"],
      "krs": ["KR-P5-01", "KR-P5-02"]
    }
  ],
  "performance2025": {
    "receita": {
      "consolidado": 10323677.92,
      "techdengue": 9430536.76,
      "aeroeng": 893141.16,
      "crescimentoYoY": 84.8,
      "metaAtingimento": 95.0
    },
    "operacional": {
      "margemOperacional": 34.3,
      "margemMeta": 26.0,
      "resultadoOperacional": 3544513.95,
      "despesas": 6779163.97,
      "economiaVsMeta": 1245248
    },
    "volumetria": {
      "hectaresMapeados": 117366.59,
      "medicoes": 288,
      "haPorMedicao": 407.5,
      "precoMedio": 80.35
    },
    "financeiro": {
      "roi": 319.2,
      "payback": 3.8,
      "pmrTechdengue": 21.4,
      "pmrAeroeng": 40.8,
      "inadimplencia": 0.47
    }
  },
  "alertasCriticos": [
    {
      "id": "AE-CONC-001",
      "nivel": "CRITICO",
      "categoria": "Concentração",
      "titulo": "Concentração Aero Engenharia",
      "metrica": "HHI = 4.410",
      "risco": "Perda de 1 cliente = -R$ 346k resultado",
      "acaoRequerida": "Prospectar 3+ novos clientes em 90 dias",
      "prazo": "Q1/2026",
      "impacto": "ALTO",
      "probabilidade": "MEDIA"
    },
    {
      "id": "AE-GAP-001",
      "nivel": "CRITICO",
      "categoria": "Performance",
      "titulo": "Gap Receita AE",
      "metrica": "48,3% da meta",
      "risco": "Unidade subperformando",
      "acaoRequerida": "Revisar estratégia comercial AE",
      "prazo": "Q1/2026",
      "impacto": "ALTO",
      "probabilidade": "ALTA"
    },
    {
      "id": "PD-INV-001",
      "nivel": "ATENCAO",
      "categoria": "Investimento",
      "titulo": "Subinvestimento P&D",
      "metrica": "-38,3% vs orçado",
      "risco": "Perda competitividade médio prazo",
      "acaoRequerida": "Revisar orçamento P&D",
      "prazo": "Q2/2026",
      "impacto": "MEDIO",
      "probabilidade": "MEDIA"
    },
    {
      "id": "FIN-SAZ-001",
      "nivel": "ATENCAO",
      "categoria": "Fluxo de Caixa",
      "titulo": "Sazonalidade Extrema",
      "metrica": "Jul+Ago = 10% do ano",
      "risco": "Fluxo de caixa irregular",
      "acaoRequerida": "Planejar reserva de caixa",
      "prazo": "Q2/2026",
      "impacto": "MEDIO",
      "probabilidade": "ALTA"
    }
  ],
  "indicadoresSaudaveis": [
    {
      "indicador": "Margem Operacional",
      "valor": 34.3,
      "meta": 26.0,
      "status": "EXCELENTE",
      "variacao": 8.3
    },
    {
      "indicador": "Crescimento YoY",
      "valor": 84.8,
      "status": "EXCEPCIONAL"
    },
    {
      "indicador": "Inadimplência",
      "valor": 0.47,
      "status": "MUITO_BAIXA"
    },
    {
      "indicador": "ROI Investimentos",
      "valor": 319,
      "status": "EXCEPCIONAL"
    },
    {
      "indicador": "HHI Techdengue",
      "valor": 268,
      "status": "BEM_DIVERSIFICADO",
      "threshold": 1500
    }
  ],
  "concentracaoCarteira": {
    "techdengue": {
      "hhi": 268,
      "cr5": 25.0,
      "cr10": 42.3,
      "cr20": 65.2,
      "status": "SAUDAVEL",
      "interpretacao": "Desconcentrado (<1.500)"
    },
    "aeroeng": {
      "hhi": 4410,
      "cr2": 84.1,
      "cr3": 100.0,
      "status": "CRITICO",
      "interpretacao": "Altamente concentrado (>2.500)",
      "clientes": [
        {
          "nome": "Brumadinho (Vale)",
          "receita": 532747,
          "participacao": 59.6,
          "impactoPerda": 346000
        },
        {
          "nome": "Belo Horizonte",
          "receita": 218954,
          "participacao": 24.5,
          "impactoPerda": 142000
        },
        {
          "nome": "Barão de Cocais",
          "receita": 141440,
          "participacao": 15.8,
          "impactoPerda": 92000
        }
      ]
    }
  },
  "economiaUnitaria": {
    "niveis": [
      {
        "nivel": 1,
        "descricao": "Custo Base (Direto de Campo)",
        "valor": 6.87,
        "componentes": [
          "Folha OP",
          "Viagens",
          "Insumos",
          "Frota"
        ],
        "margem": 91.5
      },
      {
        "nivel": 2,
        "descricao": "Custo Ampliado (+ Tecnologia)",
        "valor": 14.29,
        "componentes": [
          "Nível 1",
          "Drones",
          "Veículos",
          "Equipamentos"
        ],
        "margem": 82.2
      },
      {
        "nivel": 3,
        "descricao": "Com Apoio (+ Estrutura Rateada)",
        "valor": 21.95,
        "componentes": [
          "Nível 2",
          "ADM",
          "Financeiro",
          "RH"
        ],
        "margem": 72.7
      },
      {
        "nivel": 4,
        "descricao": "Total Alocado",
        "valor": 52.74,
        "componentes": [
          "Todas despesas rateadas 91,3%"
        ],
        "margem": 34.4
      }
    ],
    "precoVenda": 80.35,
    "margemUnitaria": 27.61,
    "breakEven": 52.74
  },
  "sazonalidade": {
    "indices": [
      {
        "mes": "Janeiro",
        "indice": 89.7,
        "categoria": "NORMAL"
      },
      {
        "mes": "Fevereiro",
        "indice": 74.3,
        "categoria": "BAIXO"
      },
      {
        "mes": "Março",
        "indice": 100.0,
        "categoria": "BASE"
      },
      {
        "mes": "Abril",
        "indice": 120.6,
        "categoria": "ALTO"
      },
      {
        "mes": "Maio",
        "indice": 109.1,
        "categoria": "MEDIO_ALTO"
      },
      {
        "mes": "Junho",
        "indice": 132.0,
        "categoria": "ALTO"
      },
      {
        "mes": "Julho",
        "indice": 59.4,
        "categoria": "MINIMO"
      },
      {
        "mes": "Agosto",
        "indice": 61.1,
        "categoria": "BAIXO"
      },
      {
        "mes": "Setembro",
        "indice": 87.4,
        "categoria": "NORMAL"
      },
      {
        "mes": "Outubro",
        "indice": 80.4,
        "categoria": "NORMAL"
      },
      {
        "mes": "Novembro",
        "indice": 119.5,
        "categoria": "ALTO"
      },
      {
        "mes": "Dezembro",
        "indice": 166.6,
        "categoria": "MAXIMO"
      }
    ],
    "amplitude": 180.7,
    "coeficienteVariacao": 32.4,
    "trimestres": {
      "Q1": {
        "valor": 2271983,
        "participacao": 22.0
      },
      "Q2": {
        "valor": 3112538,
        "participacao": 30.1
      },
      "Q3": {
        "valor": 1788123,
        "participacao": 17.3
      },
      "Q4": {
        "valor": 3153008,
        "participacao": 30.5
      }
    }
  },
  "metas2026": {
    "cenarios": {
      "pessimista": {
        "probabilidade": 15,
        "receita": 8310000,
        "hectares": 92172,
        "variacao": -19.5,
        "gatilho": "Resolução SES/MG não renovada",
        "techdengue": 7410000,
        "aeroeng": 900000
      },
      "base": {
        "probabilidade": 60,
        "receita": 11440000,
        "hectares": 120000,
        "variacao": 10.8,
        "gatilho": "Resolução renovada com continuidade",
        "techdengue": 9640000,
        "aeroeng": 1800000,
        "oficial": true
      },
      "otimista": {
        "probabilidade": 25,
        "receita": 13290000,
        "hectares": 137388,
        "variacao": 28.7,
        "gatilho": "Resolução renovada + expansão investimentos",
        "techdengue": 11040000,
        "aeroeng": 2250000
      }
    },
    "valorEsperado": {
      "receita": 11430000,
      "hectares": 120173,
      "variacao": 10.7,
      "techdengue": 9660000,
      "aeroeng": 1780000
    },
    "q1Fixo": {
      "hectares": 50438,
      "receita": 4052693,
      "participacao": 42.0,
      "status": "GARANTIDO",
      "descricao": "Contratos já firmados - independe de cenário"
    }
  },
  "gatilhosCenario": [
    {
      "id": "REG-001",
      "gatilho": "Resolução renovada sem alterações",
      "prazo": "Fev/2026",
      "acao": "Elevar metas",
      "cenarioAlvo": "otimista"
    },
    {
      "id": "REG-002",
      "gatilho": "Resolução renovada com alterações",
      "prazo": "Mar/2026",
      "acao": "Manter metas",
      "cenarioAlvo": "base"
    },
    {
      "id": "REG-003",
      "gatilho": "Resolução não renovada",
      "prazo": "Mar/2026",
      "acao": "Contingência",
      "cenarioAlvo": "pessimista"
    },
    {
      "id": "COM-001",
      "gatilho": "Pipeline TD >10 novos contratos",
      "prazo": "Jun/2026",
      "acao": "Revisar para cima",
      "cenarioAlvo": "otimista"
    },
    {
      "id": "COM-002",
      "gatilho": "AE: 3+ novos clientes fechados",
      "prazo": "Jun/2026",
      "acao": "Confirmar meta",
      "cenarioAlvo": "base"
    },
    {
      "id": "RIS-001",
      "gatilho": "Perda contrato Vale",
      "prazo": "Qualquer",
      "acao": "Revisão estrutural",
      "cenarioAlvo": "pessimista"
    }
  ],
  "kpis": {
    "techdengue": [
      {
        "indicador": "Hectares/mês",
        "meta": 10000,
        "alertaAmarelo": 8000,
        "alertaVermelho": 5000,
        "unidade": "ha"
      },
      {
        "indicador": "Receita/mês",
        "meta": 803000,
        "alertaAmarelo": 640000,
        "alertaVermelho": 400000,
        "unidade": "R$"
      },
      {
        "indicador": "ha/dia útil",
        "meta": 492,
        "alertaAmarelo": 400,
        "alertaVermelho": 300,
        "unidade": "ha/dia"
      },
      {
        "indicador": "Taxa recebimento",
        "meta": 85,
        "alertaAmarelo": 75,
        "alertaVermelho": 65,
        "unidade": "%"
      }
    ],
    "aeroeng": [
      {
        "indicador": "Receita/mês",
        "meta": 150000,
        "alertaAmarelo": 100000,
        "alertaVermelho": 50000,
        "unidade": "R$"
      },
      {
        "indicador": "Novos clientes/trim",
        "meta": 2,
        "alertaAmarelo": 1,
        "alertaVermelho": 0,
        "unidade": "clientes"
      },
      {
        "indicador": "Concentração Vale",
        "meta": 70,
        "alertaAmarelo": 80,
        "alertaVermelho": 90,
        "unidade": "%",
        "inverso": true
      }
    ]
  },
  "estruturaCustos": {
    "custoEstruturalMinimo": {
      "anual": 1773680,
      "mensal": 147807,
      "descricao": "Piso de sobrevivência"
    },
    "pontoEquilibrio": {
      "anual": 5500920,
      "mensal": 458410,
      "margemSeguranca": 45.2
    },
    "alavancagem": {
      "gao": 1.91,
      "interpretacao": "+10% receita = +19% lucro",
      "margemContribuicao": 65
    },
    "elasticidade": [
      {
        "crescimentoReceita": 10,
        "crescimentoCusto": 3,
        "novaMargemOperacional": 38.4
      },
      {
        "crescimentoReceita": 25,
        "crescimentoCusto": 8,
        "novaMargemOperacional": 43.3
      },
      {
        "crescimentoReceita": 50,
        "crescimentoCusto": 15,
        "novaMargemOperacional": 49.7
      }
    ]
  },
  "capacidadeOperacional": {
    "atual": {
      "operadoresCampo": 6,
      "capacidadeMaxMes": 17046,
      "produtividadeMedia": 492,
      "utilizacao": 57.4
    },
    "necessaria": {
      "picoFevereiro": 18352,
      "produtividadePico": 1080,
      "acaoNecessaria": "Contratar +1 piloto temporário para fevereiro"
    },
    "capacidadeOciosa": 42.6
  },
  "insights": {
    "estrategicos": [
      "Techdengue é motor validado: superou meta, alta margem, carteira diversificada",
      "Aero Engenharia apresenta risco existencial: 84,1% em 2 clientes (HHI 4.410)",
      "GAO 1,91x: estrutura altamente escalável - crescer receita maximiza valor",
      "Q1 2026 é janela crítica: 50.438 ha garantidos (42% do ano)",
      "Consórcios têm ticket 2,85x maior e preço 12,6% superior aos municípios"
    ],
    "operacionais": [
      "Capacidade ociosa de 42,6% permite crescer 50% sem aumentos proporcionais de custo fixo",
      "Sazonalidade: usar Q1 e Q3 (baixa) para capacitação e prospecção",
      "Fevereiro é pico crítico: 1.080 ha/dia (8% acima da capacidade atual)",
      "PMR Techdengue (21,4 dias) é saudável; AE (40,8 dias) requer atenção"
    ],
    "financeiros": [
      "Margem de segurança de 45,2% acima do ponto de equilíbrio",
      "ROI de 319% valida investimentos em tecnologia",
      "Preço R$ 80,35/ha está 52% acima do break-even (R$ 52,74)",
      "Nunca aceitar contratos abaixo de R$ 65/ha (margem <20%)"
    ]
  }
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'okrs',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 06 + DOC 11"
  },
  "corporate": [
    {
      "id": "OKR-P1",
      "pillar": "P1",
      "objective": "Governanca, separacao Aero x Techdengue e padrao sell-ready",
      "owner": "Direcao Executiva",
      "priority": "Alta",
      "krs": [
        {
          "id": "KR-P1-01",
          "title": "P&L gerencial por unidade com fechamento mensal ate dia 10",
          "target": "Mar-Dez/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-003"],
          "kpis": ["P1.KPI-01"],
          "initiatives": ["INIT-2026-007"]
        },
        {
          "id": "KR-P1-02",
          "title": "Alcadas e DEC ativos com registro formal",
          "target": "Fev/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-005"],
          "kpis": ["P1.KPI-02"],
          "initiatives": ["INIT-2026-006"]
        },
        {
          "id": "KR-P1-03",
          "title": "RSK criticos mapeados e revisados em MBR",
          "target": "Mar/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-006"],
          "kpis": ["A3"],
          "initiatives": []
        },
        {
          "id": "KR-P1-04",
          "title": "Disciplina de evidencias com MAP-TRC atualizado",
          "target": "Jan/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-002"],
          "kpis": ["P1.KPI-02"],
          "initiatives": ["INIT-2026-009"]
        }
      ]
    },
    {
      "id": "OKR-P2",
      "pillar": "P2",
      "objective": "Monetizar base contratual com previsibilidade (contrato → demanda → execucao → caixa)",
      "owner": "Direcao Executiva",
      "priority": "Critica",
      "krs": [
        {
          "id": "KR-P2-01",
          "title": "Executar minimo 50.438 ha no Q1",
          "target": "Q1/2026",
          "status": "ATENCAO",
          "evidence": ["EVID-2026-001"],
          "kpis": ["C2", "C3"],
          "initiatives": ["INIT-2026-002"]
        },
        {
          "id": "KR-P2-02",
          "title": "Reduzir saldo para <= 37.910 ha ate 31/mar",
          "target": "Mar/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-004"],
          "kpis": ["C1", "C6"],
          "initiatives": []
        },
        {
          "id": "KR-P2-03",
          "title": "Operar War Room Q1 semanal com Top-14",
          "target": "Fev/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-001"],
          "kpis": ["C7"],
          "initiatives": ["INIT-2026-001"]
        }
      ]
    },
    {
      "id": "OKR-P3",
      "pillar": "P3",
      "objective": "Escala operacional com margem, qualidade e prontidao",
      "owner": "Operacao",
      "priority": "Alta",
      "krs": [
        {
          "id": "KR-P3-01",
          "title": "Manter margem operacional anual >= 30%",
          "target": "2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-008"],
          "kpis": ["A1"],
          "initiatives": []
        },
        {
          "id": "KR-P3-02",
          "title": "Planejamento semanal de capacidade no Q1",
          "target": "Fev-Mar/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-007"],
          "kpis": ["P3.KPI-01", "P3.KPI-02"],
          "initiatives": ["INIT-2026-005", "INIT-2026-008"]
        }
      ]
    },
    {
      "id": "OKR-P4",
      "pillar": "P4",
      "objective": "Produto, dados e IA como prova de valor",
      "owner": "Produto/Dados",
      "priority": "Alta",
      "krs": [
        {
          "id": "KR-P4-01",
          "title": "Pacote de evidencias Pareto Top-14 entregue mensalmente",
          "target": "Q1/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-009"],
          "kpis": ["P4.KPI-01"],
          "initiatives": ["INIT-2026-004"]
        },
        {
          "id": "KR-P4-02",
          "title": "Painel de monetizacao publicado ate mar",
          "target": "Mar/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-010"],
          "kpis": ["C5"],
          "initiatives": ["INIT-2026-003"]
        }
      ]
    },
    {
      "id": "OKR-P5",
      "pillar": "P5",
      "objective": "Densidade intelectual, lideranca e capacidade humana",
      "owner": "RH",
      "priority": "Alta",
      "krs": [
        {
          "id": "KR-P5-01",
          "title": "Turnover anual <= 35%",
          "target": "2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-011"],
          "kpis": ["P5.KPI-01"],
          "initiatives": []
        },
        {
          "id": "KR-P5-02",
          "title": "Rituais de lideranca implantados com aderencia >= 85%",
          "target": "Jun/2026",
          "status": "EM_ANDAMENTO",
          "evidence": ["EVID-2026-012"],
          "kpis": ["P5.KPI-02"],
          "initiatives": []
        }
      ]
    }
  ],
  "areas": [
    {
      "area": "RH",
      "owner": "RH",
      "focus": "Lideranca, retenção e people analytics",
      "okrs": [
        {
          "id": "OKR-RH-01",
          "objective": "Reduzir rotatividade e estabilizar o time",
          "linkedCorporateKrs": ["KR-P5-01"],
          "status": "EM_ANDAMENTO"
        },
        {
          "id": "OKR-RH-02",
          "objective": "Elevar engajamento e corrigir gaps",
          "linkedCorporateKrs": ["KR-P5-02"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "RH-MOD-01",
          "title": "People Analytics + painel RH 1.0",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-RH-01"],
          "notes": "Clima, turnover e retenção monitorados mensalmente."
        },
        {
          "id": "RH-MOD-02",
          "title": "Escola de Líderes + rituais mínimos",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-RH-02"],
          "notes": "Rotina de coaching e agenda trimestral de liderança."
        },
        {
          "id": "RH-MOD-03",
          "title": "Onboarding 45/90 + retenção ativa",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-RH-01", "OKR-RH-02"],
          "notes": "Aderência acompanhada por jornada de 45/90 dias."
        }
      ]
    },
    {
      "area": "Marketing",
      "owner": "Marketing",
      "focus": "Demanda qualificada e provas",
      "okrs": [
        {
          "id": "OKR-MKT-01",
          "objective": "Gerar demanda qualificada com previsibilidade",
          "linkedCorporateKrs": ["KR-P2-01"],
          "status": "EM_ANDAMENTO"
        },
        {
          "id": "OKR-MKT-02",
          "objective": "Biblioteca de provas ativa",
          "linkedCorporateKrs": ["KR-P4-01"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "MKT-MOD-01",
          "title": "Funil de demanda + SLA com Comercial",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-MKT-01"],
          "notes": "SLA MQL/SQL com revisão quinzenal."
        },
        {
          "id": "MKT-MOD-02",
          "title": "Biblioteca de provas + kits de decisão",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-MKT-02"],
          "notes": "Playbooks e cases alinhados a tese."
        },
        {
          "id": "MKT-MOD-03",
          "title": "Agenda nacional (eventos com tese + pós-evento)",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-MKT-01"],
          "notes": "Calendário com follow-up e pipeline rastreado."
        }
      ]
    },
    {
      "area": "Produto/Dados",
      "owner": "Produto/Dados",
      "focus": "Evidencia, IA e eficiencia",
      "okrs": [
        {
          "id": "OKR-PROD-01",
          "objective": "Entregar provas e painéis de valor",
          "linkedCorporateKrs": ["KR-P4-01", "KR-P4-02"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "PROD-MOD-01",
          "title": "Eficiência e padronização do fluxo",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-PROD-01"],
          "linkedInitiatives": ["INIT-2026-003"],
          "notes": "Fluxo de entrega padronizado com SLAs por etapa."
        },
        {
          "id": "PROD-MOD-02",
          "title": "Biblioteca de evidências + painéis",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-PROD-01"],
          "linkedInitiatives": ["INIT-2026-004"],
          "notes": "Painéis por cliente e evidências mensais."
        },
        {
          "id": "PROD-MOD-03",
          "title": "IA aplicada com governança",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-PROD-01"],
          "notes": "Backlog de automações com controles de qualidade."
        }
      ]
    },
    {
      "area": "Operacao",
      "owner": "Operacao",
      "focus": "Capacidade e qualidade",
      "okrs": [
        {
          "id": "OKR-OP-01",
          "objective": "Pipeline operacional e aderencia",
          "linkedCorporateKrs": ["KR-P3-02", "KR-P2-01"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "OP-MOD-01",
          "title": "Pipeline 4-6 semanas + aderência",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-OP-01"],
          "linkedInitiatives": ["INIT-2026-008"],
          "notes": "Pipeline semanal com aderência por squad."
        },
        {
          "id": "OP-MOD-02",
          "title": "Qualidade padronizada + auditoria interna",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-OP-01"],
          "linkedInitiatives": ["INIT-2026-005"],
          "notes": "Checklist de qualidade e auditorias mensais."
        },
        {
          "id": "OP-MOD-03",
          "title": "Custo por hectare + manutenção preventiva",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-OP-01"],
          "notes": "Indicadores de custo e manutenção integrada."
        }
      ]
    },
    {
      "area": "CS",
      "owner": "CS",
      "focus": "Ativacao de demanda e previsibilidade",
      "okrs": [
        {
          "id": "OKR-CS-01",
          "objective": "Ativar demanda do Pareto",
          "linkedCorporateKrs": ["KR-P2-01", "KR-P2-03"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "CS-MOD-01",
          "title": "Pareto + planos de ativação por cliente",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-CS-01"],
          "linkedInitiatives": ["INIT-2026-001", "INIT-2026-002"],
          "notes": "Top-14 com plano de ativação e follow-up semanal."
        },
        {
          "id": "CS-MOD-02",
          "title": "Previsão 30/60/90 + agenda confirmada",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-CS-01"],
          "linkedInitiatives": ["INIT-2026-001"],
          "notes": "Forecast atualizado no War Room."
        },
        {
          "id": "CS-MOD-03",
          "title": "Gestão de reclamações por causa raiz",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-CS-01"],
          "notes": "Classificação por causa raiz e plano de ação."
        }
      ]
    },
    {
      "area": "Comercial",
      "owner": "Comercial",
      "focus": "Pipeline qualificado e diversificacao",
      "okrs": [
        {
          "id": "OKR-COM-01",
          "objective": "Pipeline qualificado e diversificacao",
          "linkedCorporateKrs": ["KR-P2-02"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "COM-MOD-01",
          "title": "ICP + contas-alvo + funil disciplinado",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-COM-01"],
          "notes": "Qualificação com ICP e cadência semanal."
        },
        {
          "id": "COM-MOD-02",
          "title": "Oferta replicável + prova de valor",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-COM-01"],
          "notes": "Proposta padrão com kit de evidências."
        },
        {
          "id": "COM-MOD-03",
          "title": "Travas de capacidade + transição para CS",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-COM-01"],
          "linkedInitiatives": ["INIT-2026-005"],
          "notes": "Checklist de transição e limites de capacidade."
        }
      ]
    },
    {
      "area": "Financeiro",
      "owner": "Financeiro",
      "focus": "Caixa, margem e previsibilidade",
      "okrs": [
        {
          "id": "OKR-FIN-01",
          "objective": "Previsibilidade de caixa e margem",
          "linkedCorporateKrs": ["KR-P1-01", "KR-P3-01"],
          "status": "EM_ANDAMENTO"
        }
      ],
      "modules": [
        {
          "id": "FIN-MOD-01",
          "title": "Projeção de caixa semanal + aging de recebíveis",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-FIN-01"],
          "notes": "Aging com alertas e projeção semanal."
        },
        {
          "id": "FIN-MOD-02",
          "title": "Margem por unidade + custo por entrega",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-FIN-01"],
          "linkedInitiatives": ["INIT-2026-007"],
          "notes": "P&L gerencial por unidade e custo por entrega."
        },
        {
          "id": "FIN-MOD-03",
          "title": "Separação econômica Aero x Techdengue",
          "status": "EM_ANDAMENTO",
          "linkedOkrs": ["OKR-FIN-01"],
          "linkedInitiatives": ["INIT-2026-007"],
          "notes": "Separação de receitas/custos e reporte mensal."
        }
      ]
    }
  ]
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'capacity',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 09"
  },
  "allocation": {
    "focus": "Q1 prioriza monetizacao e prontidao operacional",
    "q1Priority": "60-70% da capacidade gerencial em monetizacao",
    "constraints": [
      "Capacidade finita de equipes e janelas climaticas",
      "Execucao por demanda gera picos se nao houver ativacao",
      "Qualidade e margem sao limites de seguranca"
    ]
  },
  "quarterlyMix": [
    {
      "quarter": "Q1",
      "distribution": {
        "operacao": "45-55%",
        "ativacao": "20-25%",
        "produtoDados": "10-15%",
        "comercialMarketing": "5-10%",
        "governanca": "10-15%"
      }
    },
    {
      "quarter": "Q2",
      "distribution": {
        "operacao": "40-50%",
        "ativacao": "15-20%",
        "produtoDados": "15-20%",
        "comercialMarketing": "10-15%",
        "governanca": "10-15%"
      }
    },
    {
      "quarter": "Q3",
      "distribution": {
        "operacao": "35-45%",
        "ativacao": "15-20%",
        "produtoDados": "20-25%",
        "comercialMarketing": "10-15%",
        "governanca": "10-15%"
      }
    },
    {
      "quarter": "Q4",
      "distribution": {
        "operacao": "35-45%",
        "ativacao": "15-20%",
        "produtoDados": "15-20%",
        "comercialMarketing": "10-15%",
        "governanca": "10-15%"
      }
    }
  ],
  "wipLimits": {
    "institutional": "7-10 iniciativas simultaneas",
    "perArea": "3-5 iniciativas simultaneas",
    "rule": "Passou disso, pausar ou cancelar"
  },
  "tacticalReinforcement": [
    {
      "id": "TR-01",
      "area": "Operacao",
      "action": "Reforco temporario de equipe no Q1",
      "rationale": "Evitar perda de janela e manter vazao"
    },
    {
      "id": "TR-02",
      "area": "CS",
      "action": "Dono por contratante Pareto",
      "rationale": "Ativacao de demanda com responsavel claro"
    },
    {
      "id": "TR-03",
      "area": "Produto/Dados",
      "action": "Painel de monetizacao e provas rapidas",
      "rationale": "Destravar decisao do cliente"
    }
  ],
  "budgetGuidelines": [
    {
      "id": "BG-01",
      "category": "Opex essencial",
      "rule": "Custos que sustentam execucao com qualidade"
    },
    {
      "id": "BG-02",
      "category": "Opex estrategico",
      "rule": "Gastos ligados a iniciativas (INIT-*) e KRs"
    },
    {
      "id": "BG-03",
      "category": "Capex",
      "rule": "Somente com justificativa objetiva e retorno esperado"
    }
  ]
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'finance',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 09 + DOC 11-G"
  },
  "budget": {
    "status": "ATENCAO",
    "variancePercent": 6.8,
    "lastReview": "2026-01-15",
    "nextReview": "2026-02-15",
    "notes": [
      "Reforcos taticos em operacao e CS pressionam Opex",
      "Revisar alocacao Q1 para manter margem"
    ]
  },
  "unitCosts": [
    {
      "id": "UC-2026-01",
      "unit": "Techdengue",
      "period": "Jan/2026",
      "costPerHa": 52.74,
      "margin": 34.4,
      "status": "OK"
    },
    {
      "id": "UC-2026-02",
      "unit": "Aero",
      "period": "Jan/2026",
      "costPerHa": 61.2,
      "margin": 28.5,
      "status": "ATENCAO"
    }
  ],
  "cash": {
    "projected30": 1520000,
    "projected60": 2180000,
    "projected90": 2750000,
    "runwayDays": 96,
    "alert": "Manter disciplina de cobranca e reduzir inadimplencia"
  },
  "receivables": {
    "aging30": 640000,
    "aging60": 320000,
    "aging90": 210000,
    "overdue": 180000
  }
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'governance',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "PE2026.todo.md + DOC 00-11"
  },
  "canonicalArtifacts": [
    {
      "id": "ART-DOC-00",
      "docRef": "DOC 00",
      "title": "Tese e diretrizes do PE2026",
      "description": "Documento mestre de tese, fronteiras e norteadores estratégicos.",
      "owner": "Direção Estratégica",
      "module": "Estratégia",
      "status": "ATIVO",
      "lastUpdate": "2026-01-10",
      "link": "https://intranet/pe2026/doc-00"
    },
    {
      "id": "ART-DOC-01",
      "docRef": "DOC 01",
      "title": "Base contratual e monetização",
      "description": "Base de contratos, saldo e diretrizes de monetização Q1.",
      "owner": "CS",
      "module": "Monetização",
      "status": "ATIVO",
      "lastUpdate": "2026-01-12",
      "link": "https://intranet/pe2026/doc-01"
    },
    {
      "id": "ART-DOC-02",
      "docRef": "DOC 02",
      "title": "Pilares e temas estratégicos",
      "description": "Mapa de pilares P1–P5, subpilares e temas prioritários.",
      "owner": "Direção Estratégica",
      "module": "Estratégia",
      "status": "ATIVO",
      "lastUpdate": "2026-01-11",
      "link": "https://intranet/pe2026/doc-02"
    },
    {
      "id": "ART-DOC-03",
      "docRef": "DOC 03",
      "title": "Cenários e metas 2026",
      "description": "Cenários probabilísticos, metas e gatilhos de ajuste.",
      "owner": "Direção Executiva",
      "module": "Estratégia",
      "status": "ATIVO",
      "lastUpdate": "2026-01-14",
      "link": "https://intranet/pe2026/doc-03"
    },
    {
      "id": "ART-DOC-04",
      "docRef": "DOC 04",
      "title": "Placar institucional (KPIs)",
      "description": "KPIs de guardrails, pilares e monetização com regras de alerta.",
      "owner": "Guardiã PE",
      "module": "Placar",
      "status": "ATIVO",
      "lastUpdate": "2026-01-18",
      "link": "https://intranet/pe2026/doc-04"
    },
    {
      "id": "ART-DOC-05",
      "docRef": "DOC 05",
      "title": "War Room e carteira Pareto",
      "description": "Rito War Room, Pareto Top-14 e plano de ativação por cliente.",
      "owner": "CS",
      "module": "Monetização",
      "status": "ATIVO",
      "lastUpdate": "2026-01-19",
      "link": "https://intranet/pe2026/doc-05"
    },
    {
      "id": "ART-DOC-06",
      "docRef": "DOC 06",
      "title": "OKRs corporativos",
      "description": "OKRs por pilar, KRs verificáveis e evidências obrigatórias.",
      "owner": "Direção Executiva",
      "module": "OKRs",
      "status": "ATIVO",
      "lastUpdate": "2026-01-22",
      "link": "https://intranet/pe2026/doc-06"
    },
    {
      "id": "ART-DOC-07",
      "docRef": "DOC 07",
      "title": "Governança e cadência",
      "description": "WBR/MBR/QBR, registros DEC/RSK/EVID e padrões de qualidade.",
      "owner": "Guardiã PE",
      "module": "Governança",
      "status": "ATIVO",
      "lastUpdate": "2026-01-20",
      "link": "https://intranet/pe2026/doc-07"
    },
    {
      "id": "ART-DOC-08",
      "docRef": "DOC 08",
      "title": "Carteira de iniciativas",
      "description": "WIP institucional, prioridades e critérios de alocação.",
      "owner": "PMO",
      "module": "Iniciativas",
      "status": "ATIVO",
      "lastUpdate": "2026-01-21",
      "link": "https://intranet/pe2026/doc-08"
    },
    {
      "id": "ART-DOC-09",
      "docRef": "DOC 09",
      "title": "Capacidade e orçamento",
      "description": "Mapeamento de capacidade, orçamento vivo e replanejamento.",
      "owner": "Financeiro",
      "module": "Capacidade",
      "status": "ATIVO",
      "lastUpdate": "2026-01-22",
      "link": "https://intranet/pe2026/doc-09"
    },
    {
      "id": "ART-DOC-10",
      "docRef": "DOC 10",
      "title": "Plano de riscos críticos",
      "description": "Mapa de riscos, gatilhos e planos de mitigação.",
      "owner": "Direção Executiva",
      "module": "Riscos",
      "status": "EM_VALIDACAO",
      "lastUpdate": "2026-01-19",
      "link": "https://intranet/pe2026/doc-10"
    },
    {
      "id": "ART-DOC-11",
      "docRef": "DOC 11",
      "title": "Módulos por área",
      "description": "Desdobramento de OKRs por RH, MKT, Produto, Operação, CS, Comercial e Financeiro.",
      "owner": "Direção Executiva",
      "module": "Áreas",
      "status": "ATIVO",
      "lastUpdate": "2026-01-22",
      "link": "https://intranet/pe2026/doc-11"
    }
  ],
  "rbacRoles": [
    {
      "id": "RBAC-ADM",
      "title": "Admin Master",
      "level": "N0",
      "scope": "Plataforma inteira",
      "responsibilities": [
        "Configurações globais e segurança",
        "Gestão de usuários e perfis",
        "Auditoria de acessos e compliance"
      ]
    },
    {
      "id": "RBAC-N1",
      "title": "Direção Estratégica (N1)",
      "level": "N1",
      "scope": "Tese, pilares e cenários",
      "responsibilities": [
        "Aprovar tese estratégica e fronteiras",
        "Validar pilares e temas",
        "Revisar cenários e metas de longo prazo"
      ]
    },
    {
      "id": "RBAC-N2",
      "title": "Direção Executiva (N2)",
      "level": "N2",
      "scope": "OKRs, carteira e orçamento",
      "responsibilities": [
        "Aprovar OKRs corporativos",
        "Gerir carteira e orçamento vivo",
        "Endereçar riscos críticos"
      ]
    },
    {
      "id": "RBAC-PE",
      "title": "Guardiã do PE",
      "level": "N2",
      "scope": "Cadência e rastreabilidade",
      "responsibilities": [
        "Garantir cadência WBR/MBR/QBR",
        "Auditar evidências e versionamento",
        "Manter mapa de rastreabilidade"
      ]
    },
    {
      "id": "RBAC-LIDER",
      "title": "Líder de Pilar/Área",
      "level": "N3",
      "scope": "Pilares e áreas",
      "responsibilities": [
        "Desdobrar OKRs e KPIs setoriais",
        "Acompanhar execução e riscos",
        "Validar evidências das equipes"
      ]
    },
    {
      "id": "RBAC-KR",
      "title": "Responsável por KR/INIT",
      "level": "N4",
      "scope": "Execução",
      "responsibilities": [
        "Atualizar progresso de KRs",
        "Registrar evidências e resultados",
        "Sincronizar dependências de iniciativas"
      ]
    },
    {
      "id": "RBAC-EXEC",
      "title": "Analista/Executor",
      "level": "N5",
      "scope": "Operação",
      "responsibilities": [
        "Atualizar tarefas e entregas",
        "Sinalizar bloqueios",
        "Apoiar coleta de evidências"
      ]
    },
    {
      "id": "RBAC-VIEW",
      "title": "Viewer/Stakeholder",
      "level": "N6",
      "scope": "Leitura",
      "responsibilities": [
        "Acompanhar dashboards e relatórios",
        "Garantir alinhamento com a tese",
        "Registrar feedback estratégico"
      ]
    }
  ],
  "decisions": [
    {
      "id": "DEC-2026-001",
      "title": "Ativar War Room Q1 para monetizacao",
      "description": "Operar rito semanal com foco no Pareto Top-14, previsao 30/60/90 e agenda ativa.",
      "date": "2026-01-22",
      "owner": "Direcao Executiva",
      "impact": "ALTO",
      "status": "ATIVA",
      "pillars": ["P2", "P3"],
      "tags": ["monetizacao", "q1"]
    },
    {
      "id": "DEC-2026-002",
      "title": "Separacao gerencial Aero x Techdengue",
      "description": "Implantar P&L gerencial por unidade e rotina de fechamento mensal ate dia 10.",
      "date": "2026-01-20",
      "owner": "Financeiro",
      "impact": "ALTO",
      "status": "ATIVA",
      "pillars": ["P1", "P5"],
      "tags": ["governanca", "sell-ready"]
    },
    {
      "id": "DEC-2026-003",
      "title": "Padrao minimo de evidencia para KRs",
      "description": "Nenhum KR fecha sem evidencias verificaveis registradas e validadas.",
      "date": "2026-01-18",
      "owner": "Consultora Estrategica",
      "impact": "MEDIO",
      "status": "ATIVA",
      "pillars": ["P1"],
      "tags": ["evidencia", "rastreabilidade"]
    }
  ],
  "risks": [
    {
      "id": "RSK-2026-01",
      "title": "Janela regulatoria reduzir vazao",
      "category": "Regulatorio",
      "description": "Mudancas de prazo ou definicoes institucionais podem reduzir a execucao do saldo no Q1.",
      "impact": "ALTO",
      "probability": "MEDIA",
      "exposure": "CRITICO",
      "triggers": ["Queda de vazao por 2 semanas", "Agenda Pareto sem confirmacao"],
      "mitigation": "Plano de choque Q1 + agenda institucional preventiva + provas por decisor.",
      "contingency": "Replanejar capacidade e escalonar casos criticos.",
      "owner": "Direcao Executiva",
      "cadence": "Semanal",
      "status": "ATIVO",
      "kpis": ["C3", "P3.KPI-01"]
    },
    {
      "id": "RSK-2026-02",
      "title": "Ativacao insuficiente de demanda",
      "category": "Relacionamento",
      "description": "Contratos sob demanda nao convertem em execucao com velocidade suficiente.",
      "impact": "ALTO",
      "probability": "ALTA",
      "exposure": "CRITICO",
      "triggers": ["Baixa ativacao no Pareto", "Previsao 30/60/90 sem evidencia"],
      "mitigation": "Plano por cliente Pareto + playbook de ativacao + kits de destrave.",
      "contingency": "War Room com cadencia reforcada e realocacao de capacidade.",
      "owner": "CS",
      "cadence": "Semanal",
      "status": "ATIVO",
      "kpis": ["C4", "C5"]
    },
    {
      "id": "RSK-2026-03",
      "title": "Retrabalho operacional alto",
      "category": "Operacao",
      "description": "Falhas de padrao elevam custo e reduzem vazao em janelas criticas.",
      "impact": "MEDIO",
      "probability": "MEDIA",
      "exposure": "ALTO",
      "triggers": ["Retrabalho acima do limite por 2 ciclos", "Falhas repetidas no Pareto"],
      "mitigation": "Checklists + auditoria interna + correcoes de causa raiz.",
      "contingency": "Reduzir volume e estabilizar padrao.",
      "owner": "Operacao",
      "cadence": "Semanal",
      "status": "ATIVO",
      "kpis": ["A3", "P3.KPI-02"]
    }
  ],
  "evidences": [
    {
      "id": "EVID-2026-001",
      "title": "Ata War Room Q1 - Semana 1",
      "type": "Ata",
      "description": "Registro de decisoes, plano Pareto e previsao 30/60/90.",
      "date": "2026-01-21",
      "owner": "CS",
      "related": ["DEC-2026-001", "RSK-2026-02"],
      "link": "https://intranet/pe2026/atas/war-room-q1-semana-1",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-21"
    },
    {
      "id": "EVID-2026-002",
      "title": "Mapa de rastreabilidade v1",
      "type": "Mapa",
      "description": "OKR -> KR -> INIT -> KPI consolidado com dono e cadencia.",
      "date": "2026-01-20",
      "owner": "Consultora Estrategica",
      "related": ["DEC-2026-003"],
      "link": "https://intranet/pe2026/mapa-trc-v1",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-003",
      "title": "Relatorio P&L por unidade - Jan",
      "type": "Relatorio",
      "description": "Fechamento gerencial por unidade Aero x Techdengue.",
      "date": "2026-01-19",
      "owner": "Financeiro",
      "related": ["DEC-2026-002"],
      "link": "https://intranet/pe2026/relatorios/pnl-jan",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-21"
    },
    {
      "id": "EVID-2026-004",
      "title": "Relatorio de saldo e aging Q1",
      "type": "Relatorio",
      "description": "Saldo atualizado, aging e projeções de execução.",
      "date": "2026-01-21",
      "owner": "CS",
      "related": ["KR-P2-02"],
      "link": "https://intranet/pe2026/relatorios/saldo-aging-q1",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-005",
      "title": "Registro de alçadas e DEC formalizados",
      "type": "Checklist",
      "description": "Checklist de decisões e alçadas publicado.",
      "date": "2026-01-22",
      "owner": "Guardiã PE",
      "related": ["DEC-2026-002"],
      "link": "https://intranet/pe2026/checklists/alcadas-dec",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-006",
      "title": "Ata MBR — riscos críticos",
      "type": "Ata",
      "description": "Ata MBR com revisão dos riscos críticos e gatilhos.",
      "date": "2026-01-21",
      "owner": "Direção Executiva",
      "related": ["RSK-2026-01", "RSK-2026-02"],
      "link": "https://intranet/pe2026/atas/mbr-riscos-q1",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-007",
      "title": "Planejamento semanal de capacidade",
      "type": "Plano",
      "description": "Capacidade operacional semanal e aderência de squads.",
      "date": "2026-01-21",
      "owner": "Operação",
      "related": ["KR-P3-02"],
      "link": "https://intranet/pe2026/planos/capacidade-q1",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-008",
      "title": "Relatório de margem operacional",
      "type": "Relatorio",
      "description": "Margem operacional consolidada e por unidade.",
      "date": "2026-01-20",
      "owner": "Financeiro",
      "related": ["KR-P3-01"],
      "link": "https://intranet/pe2026/relatorios/margem-operacional",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-009",
      "title": "Relatório de evidências Pareto Top-14",
      "type": "Relatorio",
      "description": "Pacotes de evidências entregues para Top-14.",
      "date": "2026-01-22",
      "owner": "Produto/Dados",
      "related": ["KR-P4-01"],
      "link": "https://intranet/pe2026/relatorios/pareto-evidencias",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-010",
      "title": "Publicação do painel de monetização",
      "type": "Entrega",
      "description": "Painel publicado com atualização semanal.",
      "date": "2026-01-22",
      "owner": "Produto/Dados",
      "related": ["KR-P4-02"],
      "link": "https://intranet/pe2026/painel-monetizacao",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-011",
      "title": "Relatório de turnover anualizado",
      "type": "Relatorio",
      "description": "Turnover acumulado e plano de retenção ativo.",
      "date": "2026-01-22",
      "owner": "RH",
      "related": ["KR-P5-01"],
      "link": "https://intranet/pe2026/relatorios/turnover",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    },
    {
      "id": "EVID-2026-012",
      "title": "Relatório de aderência a rituais de liderança",
      "type": "Relatorio",
      "description": "Aderência consolidada dos rituais e agenda de reforço.",
      "date": "2026-01-22",
      "owner": "RH",
      "related": ["KR-P5-02"],
      "link": "https://intranet/pe2026/relatorios/rituais-lideranca",
      "validated": true,
      "validatedBy": "Guardiã PE",
      "validatedAt": "2026-01-22"
    }
  ],
  "versionLogs": [
    {
      "id": "LOG-REV-001",
      "entityType": "KPI",
      "entityId": "P1.KPI-01",
      "version": "v1.1",
      "date": "2026-01-20",
      "owner": "Financeiro",
      "summary": "Ajuste de definicao e fonte do P&L gerencial por unidade.",
      "evidence": "EVID-2026-003"
    },
    {
      "id": "LOG-REV-002",
      "entityType": "OKR",
      "entityId": "KR-P2-01",
      "version": "v1.0",
      "date": "2026-01-18",
      "owner": "Direcao Executiva",
      "summary": "Meta Q1 de execucao validada com War Room.",
      "evidence": "EVID-2026-001"
    },
    {
      "id": "LOG-REV-003",
      "entityType": "INIT",
      "entityId": "INIT-2026-001",
      "version": "v1.2",
      "date": "2026-01-21",
      "owner": "CS",
      "summary": "Atualizacao de dependencias e cronograma de ativacao.",
      "evidence": "EVID-2026-001"
    }
  ],
  "evidenceValidation": {
    "policy": "Nenhuma entrega fecha sem evidencias verificadas.",
    "lastAudit": "2026-01-21",
    "validator": "Guardiã PE",
    "pending": [],
    "validated": [
      "EVID-2026-001",
      "EVID-2026-002",
      "EVID-2026-003",
      "EVID-2026-004",
      "EVID-2026-005",
      "EVID-2026-006",
      "EVID-2026-007",
      "EVID-2026-008",
      "EVID-2026-009",
      "EVID-2026-010",
      "EVID-2026-011",
      "EVID-2026-012"
    ]
  },
  "cadenceRituals": [
    {
      "id": "WBR-01",
      "title": "WBR Semanal",
      "cadence": "Semanal",
      "focus": "Placar, carteira, monetizacao e riscos criticos",
      "participants": "Direcao + CS + Operacao + Financeiro",
      "outputs": ["Ata WBR", "Lista de bloqueios", "Atualizacao de KPIs"]
    },
    {
      "id": "MBR-01",
      "title": "MBR Mensal",
      "cadence": "Mensal",
      "focus": "OKRs, capacidade, orcamento e riscos",
      "participants": "Direcao + Heads",
      "outputs": ["Relatorio MBR", "Revisao de metas", "Plano de ajustes"]
    },
    {
      "id": "QBR-01",
      "title": "QBR Trimestral",
      "cadence": "Trimestral",
      "focus": "Tese, cenarios e decisoes estrategicas",
      "participants": "Direcao + Conselho",
      "outputs": ["Ata QBR", "Decisoes estrategicas", "Atualizacao de tese"]
    }
  ],
  "auditReports": [
    {
      "id": "AUD-01",
      "title": "Relatorio P&L por unidade",
      "cadence": "Mensal",
      "owner": "Financeiro",
      "scope": "Aero x Techdengue",
      "lastUpdate": "2026-01-20",
      "status": "OK"
    },
    {
      "id": "AUD-02",
      "title": "Relatorio de execucao e vazao",
      "cadence": "Semanal",
      "owner": "Operacao",
      "scope": "Saldo, vazao e produtividade",
      "lastUpdate": "2026-01-21",
      "status": "ATENCAO"
    },
    {
      "id": "AUD-03",
      "title": "Relatorio de riscos criticos",
      "cadence": "Mensal",
      "owner": "Guardiã PE",
      "scope": "RSK nivel 1/2/3",
      "lastUpdate": "2026-01-19",
      "status": "OK"
    }
  ],
  "traceability": [
    {
      "id": "TRC-2026-001",
      "pillar": "P2",
      "subpillar": "P2.S2",
      "objective": "Monetizar base contratual",
      "kr": "KR-P2-03",
      "initiative": "INIT-2026-001",
      "evidences": ["EVID-2026-001"],
      "kpis": ["C1", "C3", "C5"],
      "status": "EM_ANDAMENTO"
    },
    {
      "id": "TRC-2026-002",
      "pillar": "P1",
      "subpillar": "P1.S2",
      "objective": "Separacao gerencial Aero x Techdengue",
      "kr": "KR-P1-01",
      "initiative": "INIT-2026-007",
      "evidences": ["EVID-2026-003"],
      "kpis": ["P1.KPI-01"],
      "status": "EM_ANDAMENTO"
    },
    {
      "id": "TRC-2026-003",
      "pillar": "P1",
      "subpillar": "P1.S3",
      "objective": "Disciplina de evidencias",
      "kr": "KR-P1-04",
      "initiative": "INIT-2026-006",
      "evidences": ["EVID-2026-002"],
      "kpis": ["P1.KPI-02"],
      "status": "ATIVO"
    }
  ]
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'initiatives',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 08"
  },
  "capacity": {
    "wipInstitutionalLimit": 10,
    "wipAreaLimit": 5,
    "inProgressCount": 6,
    "blockedCount": 1,
    "p0Count": 5
  },
  "prioritizationCriteria": [
    {
      "id": "CRIT-01",
      "title": "Impacto em monetizacao",
      "description": "Saldo executado, previsibilidade e ativacao de demanda.",
      "weight": "Alto"
    },
    {
      "id": "CRIT-02",
      "title": "Risco operacional",
      "description": "Exposicao a gargalos, falhas de qualidade e janelas criticas.",
      "weight": "Medio"
    },
    {
      "id": "CRIT-03",
      "title": "Esforco/capacidade",
      "description": "Disponibilidade de equipe e dependencias criticas.",
      "weight": "Medio"
    },
    {
      "id": "CRIT-04",
      "title": "Alinhamento com pilares",
      "description": "Conexao direta com OKRs corporativos e KRs prioritarios.",
      "weight": "Alto"
    }
  ],
  "evidenceRequirement": {
    "mandatory": true,
    "requiredArtifacts": ["EVID-*", "DEC-*", "MAP-TRC"],
    "validation": "Checklist de evidencias validado antes de concluir iniciativa"
  },
  "initiatives": [
    {
      "id": "INIT-2026-001",
      "title": "Implantar Sala de Situacao Q1 (Pareto Top-14)",
      "type": "MET",
      "priority": "P0",
      "pillar": "P2",
      "okr": "OKR-P2",
      "kr": "KR-P2-03",
      "owner": "CS",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-15",
      "endDate": "2026-03-31",
      "effort": "ALTO",
      "dependencies": ["INIT-2026-003"],
      "evidences": ["EVID-2026-001"]
    },
    {
      "id": "INIT-2026-002",
      "title": "Criar Playbook de Ativacao de Demanda",
      "type": "MET",
      "priority": "P0",
      "pillar": "P2",
      "okr": "OKR-P2",
      "kr": "KR-P2-01",
      "owner": "CS",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-20",
      "endDate": "2026-02-28",
      "effort": "MEDIO",
      "dependencies": [],
      "evidences": []
    },
    {
      "id": "INIT-2026-003",
      "title": "Painel de monetizacao (saldo, vazao, previsao)",
      "type": "SIS",
      "priority": "P0",
      "pillar": "P4",
      "okr": "OKR-P4",
      "kr": "KR-P4-02",
      "owner": "Produto/Dados",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-18",
      "endDate": "2026-03-15",
      "effort": "ALTO",
      "dependencies": [],
      "evidences": []
    },
    {
      "id": "INIT-2026-004",
      "title": "Pacote mensal de prova de valor para Top-14",
      "type": "COM",
      "priority": "P0",
      "pillar": "P4",
      "okr": "OKR-P4",
      "kr": "KR-P4-01",
      "owner": "Produto/Dados",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-25",
      "endDate": "2026-03-31",
      "effort": "MEDIO",
      "dependencies": [],
      "evidences": []
    },
    {
      "id": "INIT-2026-005",
      "title": "Integracao formal CS ↔ Operacao ↔ Financeiro",
      "type": "MET",
      "priority": "P0",
      "pillar": "P3",
      "okr": "OKR-P3",
      "kr": "KR-P3-02",
      "owner": "Operacao",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-22",
      "endDate": "2026-03-10",
      "effort": "MEDIO",
      "dependencies": [],
      "evidences": []
    },
    {
      "id": "INIT-2026-006",
      "title": "Registro de decisoes (DEC) e riscos (RSK) ativo",
      "type": "MET",
      "priority": "P1",
      "pillar": "P1",
      "okr": "OKR-P1",
      "kr": "KR-P1-02",
      "owner": "Guardiã PE",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-10",
      "endDate": "2026-02-15",
      "effort": "BAIXO",
      "dependencies": [],
      "evidences": ["DEC-2026-003"]
    },
    {
      "id": "INIT-2026-007",
      "title": "Apuracao gerencial por unidade",
      "type": "MET",
      "priority": "P1",
      "pillar": "P1",
      "okr": "OKR-P1",
      "kr": "KR-P1-01",
      "owner": "Financeiro",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-05",
      "endDate": "2026-03-31",
      "effort": "MEDIO",
      "dependencies": [],
      "evidences": ["EVID-2026-003"]
    },
    {
      "id": "INIT-2026-008",
      "title": "Planejamento semanal de capacidade (Q1)",
      "type": "MET",
      "priority": "P0",
      "pillar": "P3",
      "okr": "OKR-P3",
      "kr": "KR-P3-02",
      "owner": "Operacao",
      "sponsor": "Direcao Executiva",
      "status": "BLOQUEADA",
      "startDate": "2026-01-20",
      "endDate": "2026-02-28",
      "effort": "MEDIO",
      "dependencies": ["INIT-2026-005"],
      "evidences": []
    },
    {
      "id": "INIT-2026-009",
      "title": "Mapa de rastreabilidade e disciplina de evidencias",
      "type": "MET",
      "priority": "P1",
      "pillar": "P1",
      "okr": "OKR-P1",
      "kr": "KR-P1-04",
      "owner": "Guardiã PE",
      "sponsor": "Direcao Executiva",
      "status": "EM_ANDAMENTO",
      "startDate": "2026-01-18",
      "endDate": "2026-02-10",
      "effort": "BAIXO",
      "dependencies": ["INIT-2026-006"],
      "evidences": ["EVID-2026-002"]
    }
  ]
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

INSERT INTO context_store (slug, data)
VALUES (
  'monetization',
  $$
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2026-01-22",
    "source": "DOC 01 + DOC 05 + DOC 06"
  },
  "summary": {
    "saldoTotal": 88348.85,
    "execucaoPercentual": 62.4,
    "ativacaoPercentual": 48.0,
    "contratosAtivos": 126,
    "top14Percent": 71.0,
    "top32Percent": 85.0
  },
  "baseContracts": [
    {
      "id": "CT-001",
      "contratante": "Municipio A",
      "tipo": "Municipio",
      "saldoHa": 9400,
      "execucaoPercentual": 58.0,
      "valorEstimado": 754000,
      "idadeSaldoDias": 96,
      "status": "BAIXA_EXECUCAO"
    },
    {
      "id": "CT-002",
      "contratante": "Municipio B",
      "tipo": "Municipio",
      "saldoHa": 7200,
      "execucaoPercentual": 75.0,
      "valorEstimado": 578000,
      "idadeSaldoDias": 54,
      "status": "ALTA_EXECUCAO"
    },
    {
      "id": "CT-003",
      "contratante": "Consorcio C",
      "tipo": "Consorcio",
      "saldoHa": 6800,
      "execucaoPercentual": 42.0,
      "valorEstimado": 546000,
      "idadeSaldoDias": 132,
      "status": "SEM_DEMANDA"
    },
    {
      "id": "CT-004",
      "contratante": "Municipio D",
      "tipo": "Municipio",
      "saldoHa": 5900,
      "execucaoPercentual": 64.0,
      "valorEstimado": 475000,
      "idadeSaldoDias": 88,
      "status": "BAIXA_EXECUCAO"
    }
  ],
  "paretoTop14": [
    {
      "id": "CT-001",
      "contratante": "Municipio A",
      "saldoHa": 9400,
      "execucaoPercentual": 58.0,
      "status": "Em ativacao"
    },
    {
      "id": "CT-003",
      "contratante": "Consorcio C",
      "saldoHa": 6800,
      "execucaoPercentual": 42.0,
      "status": "Sem demanda"
    },
    {
      "id": "CT-004",
      "contratante": "Municipio D",
      "saldoHa": 5900,
      "execucaoPercentual": 64.0,
      "status": "Agenda confirmada"
    }
  ],
  "activationPlans": [
    {
      "id": "ACT-2026-01",
      "contratante": "Municipio A",
      "owner": "CS",
      "status": "ATIVO",
      "agenda30": 1200,
      "agenda60": 1800,
      "agenda90": 2500,
      "nextAction": "Reuniao com secretaria para agenda Q1",
      "evidence": "EVID-2026-001"
    },
    {
      "id": "ACT-2026-02",
      "contratante": "Consorcio C",
      "owner": "CS",
      "status": "EM_RISCO",
      "agenda30": 600,
      "agenda60": 900,
      "agenda90": 1400,
      "nextAction": "Escalonar patrocinio institucional",
      "evidence": "EVID-2026-004"
    }
  ],
  "integration": [
    {
      "id": "INT-01",
      "interface": "Contrato -> Demanda",
      "cadence": "Semanal",
      "owners": "CS + Direcao",
      "inputs": ["Saldo por contratante", "Mapa de stakeholders", "Pareto Top-14"],
      "outputs": ["Plano de ativacao", "Agenda 30/60/90", "EVID de contato"]
    },
    {
      "id": "INT-02",
      "interface": "Demanda -> Execucao",
      "cadence": "Semanal",
      "owners": "CS + Operacao",
      "inputs": ["Agenda confirmada", "Prioridade Pareto", "Capacidade operacional"],
      "outputs": ["Pipeline operacional", "Cronograma", "Checklist de preparo"]
    },
    {
      "id": "INT-03",
      "interface": "Execucao -> Caixa",
      "cadence": "Quinzenal",
      "owners": "Operacao + Financeiro",
      "inputs": ["Execucao realizada", "Documentacao de faturamento"],
      "outputs": ["Faturamento emitido", "Plano de cobranca", "Previsao de caixa"]
    },
    {
      "id": "INT-04",
      "interface": "Execucao -> Prova de valor",
      "cadence": "Quinzenal",
      "owners": "Produto/Dados + CS",
      "inputs": ["Dados de execucao", "Resultados entregues"],
      "outputs": ["Relatorio executivo", "Insights", "Material de decisao"]
    }
  ]
}
$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

