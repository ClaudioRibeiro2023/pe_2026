// Mock API para Strategic Pack - Desenvolvimento Local
import type {
  AreaStrategicPack,
  AreaPackSection,
  PackAttachment,
  PackComment,
  PackChangeLog,
  PackReference,
  CreatePackData,
  UpdatePackData,
  UpdateSectionData,
  CreateAttachmentData,
  CreateCommentData,
  PackFull,
  SectionKey,
  MonthlyClose,
} from './types'

// ============================================================
// MOCK STORE
// ============================================================

interface MockStore {
  packs: AreaStrategicPack[]
  sections: AreaPackSection[]
  attachments: PackAttachment[]
  comments: PackComment[]
  changelog: PackChangeLog[]
  references: PackReference[]
  monthlyCloses: MonthlyClose[]
}

const RH_PACK_ID = 'pack-rh-2026'
const MARKETING_PACK_ID = 'pack-marketing-2026'
const OPERACOES_PACK_ID = 'pack-operacoes-2026'
const FIN_PACK_ID = 'pack-fin-2026'
const PD_PACK_ID = 'pack-pd-2026'
const CS_PACK_ID = 'pack-cs-2026'
const COM_PACK_ID = 'pack-com-2026'

const mockStore: MockStore = {
  packs: [
    {
      id: RH_PACK_ID,
      area_slug: 'rh',
      year: 2026,
      status: 'draft',
      version: '1.0',
      summary: 'Plano Estratégico de RH 2026 - Transformando pessoas, impulsionando resultados',
      owners: {
        headName: 'Maria Silva',
        backupName: 'João Santos',
      },
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-02-05T14:30:00Z',
    },
    {
      id: MARKETING_PACK_ID,
      area_slug: 'marketing',
      year: 2026,
      status: 'draft',
      version: '1.0',
      summary: 'Plano Estratégico Marketing 2026 - Demanda qualificada e brand awareness',
      owners: {
        headName: 'Carlos Silva',
        backupName: 'Fernanda Costa',
      },
      created_at: '2026-01-18T10:00:00Z',
      updated_at: '2026-02-08T14:30:00Z',
    },
    {
      id: OPERACOES_PACK_ID,
      area_slug: 'operacoes',
      year: 2026,
      status: 'draft',
      version: '1.0',
      summary: 'Plano Estratégico Operações 2026 - Eficiência operacional e automação',
      owners: {
        headName: 'Roberto Lima',
        backupName: 'Patricia Almeida',
      },
      created_at: '2026-01-16T10:00:00Z',
      updated_at: '2026-02-06T14:30:00Z',
    },
    {
      id: FIN_PACK_ID,
      area_slug: 'financeiro',
      year: 2026,
      status: 'draft',
      version: '1.0',
      summary: 'Plano Estratégico Financeiro 2026 - Gestão financeira e compliance',
      owners: {
        headName: 'Maria Santos',
        backupName: 'Ricardo Souza',
      },
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-02-07T14:30:00Z',
    },
  ],
  sections: [
    {
      id: 'sec-overview',
      pack_id: RH_PACK_ID,
      key: 'overview',
      title: 'Visão Geral',
      body_markdown: `# PE-2026 RH

## Mandato
Transformar a gestão de pessoas para suportar o crescimento sustentável da organização, focando em atração, desenvolvimento e retenção de talentos.

## Objetivos do Ano
- **O1:** Reduzir turnover em 15%
- **O2:** Aumentar eNPS para 70+
- **O3:** Implementar programa de desenvolvimento de lideranças
- **O4:** Digitalizar 80% dos processos de RH
- **O5:** Estruturar programa de bem-estar

## Links Rápidos
- [Plano de Ação](/planning/rh/dashboard)
- [Evidências](/planning/rh/evidences)
- [Aprovações](/planning/rh/approvals)`,
      structured_data: {
        mandate: 'Transformar a gestão de pessoas para suportar o crescimento sustentável da organização, focando em atração, desenvolvimento e retenção de talentos.',
        objectives: [
          { id: 'o1', key: 'O1', title: 'Reduzir turnover em 15%' },
          { id: 'o2', key: 'O2', title: 'Aumentar eNPS para 70+' },
          { id: 'o3', key: 'O3', title: 'Implementar programa de desenvolvimento de lideranças' },
          { id: 'o4', key: 'O4', title: 'Digitalizar 80% dos processos de RH' },
          { id: 'o5', key: 'O5', title: 'Estruturar programa de bem-estar' },
        ],
      },
      sort_order: 0,
      updated_at: '2026-02-05T14:30:00Z',
      updated_by: 'maria.silva@empresa.com',
    },
    {
      id: 'sec-diagnosis',
      pack_id: RH_PACK_ID,
      key: 'diagnosis',
      title: 'Diagnóstico e Base',
      body_markdown: `# Diagnóstico RH 2026

## Baselines
| Indicador | 2023 | 2024 | 2025 | Meta 2026 |
|-----------|------|------|------|-----------|
| Headcount | 52 | 59 | 63 | 67-70 |
| Turnover | 18% | 15% | 12% | 10% |
| eNPS | 45 | 55 | 62 | 70+ |

## Premissas
- Crescimento orgânico de 10-15% ao ano
- Mercado de talentos competitivo
- Investimento aprovado para tecnologia de RH

## Restrições
- Orçamento limitado a 5% da folha
- Prazo para implementação do novo HRIS: Q2/2026`,
      structured_data: {
        baselines: [
          { label: 'Headcount 2025', value: '63' },
          { label: 'Turnover 2025', value: '12%' },
          { label: 'eNPS 2025', value: '62' },
        ],
        premises: [
          'Crescimento orgânico de 10-15% ao ano',
          'Mercado de talentos competitivo',
          'Investimento aprovado para tecnologia de RH',
        ],
        constraints: [
          'Orçamento limitado a 5% da folha',
          'Prazo para implementação do novo HRIS: Q2/2026',
        ],
      },
      sort_order: 1,
      updated_at: '2026-02-01T10:00:00Z',
      updated_by: 'maria.silva@empresa.com',
    },
    {
      id: 'sec-objectives',
      pack_id: RH_PACK_ID,
      key: 'objectives',
      title: 'Objetivos e Metas',
      body_markdown: `# Objetivos e Metas 2026

## Objetivos Estratégicos

### O1 - Reduzir Turnover
Reduzir a taxa de turnover voluntário de 12% para 10% até dezembro/2026.

### O2 - Aumentar Engajamento
Elevar o eNPS de 62 para 70+ através de ações de clima e cultura.

### O3 - Desenvolver Lideranças
Implementar programa estruturado de desenvolvimento para 100% dos gestores.

### O4 - Digitalização
Migrar 80% dos processos manuais de RH para o novo HRIS.

### O5 - Bem-estar
Estruturar programa de bem-estar com adesão mínima de 60%.`,
      structured_data: {
        objectives: [
          { id: 'o1', key: 'O1', title: 'Reduzir Turnover', description: 'Reduzir a taxa de turnover voluntário de 12% para 10%' },
          { id: 'o2', key: 'O2', title: 'Aumentar Engajamento', description: 'Elevar o eNPS de 62 para 70+' },
          { id: 'o3', key: 'O3', title: 'Desenvolver Lideranças', description: 'Programa estruturado para 100% dos gestores' },
          { id: 'o4', key: 'O4', title: 'Digitalização', description: 'Migrar 80% dos processos para HRIS' },
          { id: 'o5', key: 'O5', title: 'Bem-estar', description: 'Programa com adesão mínima de 60%' },
        ],
        kpis: [
          { id: 'kpi1', name: 'Turnover Total', definition: 'Desligamentos voluntários / Headcount médio', cadence: 'mensal', owner: 'Maria Silva', target: '≤10%', trigger: '>12%', current_value: '11.2%' },
          { id: 'kpi2', name: 'Turnover Críticos', definition: 'Desligamentos de high performers / Total desligamentos', cadence: 'mensal', owner: 'Maria Silva', target: '≤5%', trigger: '>8%', current_value: '6.5%' },
          { id: 'kpi3', name: 'Churn 0-90 dias', definition: 'Desligamentos até 90 dias / Admissões período', cadence: 'mensal', owner: 'Ana Costa', target: '≤8%', trigger: '>12%', current_value: '9.1%' },
          { id: 'kpi4', name: 'Sucesso 90 dias', definition: '% colaboradores atingindo metas no período probatório', cadence: 'mensal', owner: 'Ana Costa', target: '≥85%', trigger: '<70%', current_value: '82%' },
          { id: 'kpi5', name: 'TTF (Time to Fill)', definition: 'Dias médios para preencher vaga', cadence: 'mensal', owner: 'João Santos', target: '≤30 dias', trigger: '>45 dias', current_value: '35 dias' },
          { id: 'kpi6', name: 'Aderência Rituais', definition: '% rituais realizados vs planejados', cadence: 'semanal', owner: 'Maria Silva', target: '≥90%', trigger: '<75%', current_value: '88%' },
          { id: 'kpi7', name: 'Onboarding 45d', definition: 'NPS do onboarding na pesquisa 45 dias', cadence: 'mensal', owner: 'Ana Costa', target: '≥75', trigger: '<60', current_value: '72' },
          { id: 'kpi8', name: 'Onboarding 90d', definition: 'NPS do onboarding na pesquisa 90 dias', cadence: 'mensal', owner: 'Ana Costa', target: '≥70', trigger: '<55', current_value: '68' },
          { id: 'kpi9', name: 'Pulsos Gargalos', definition: '% gargalos identificados em pulsos resolvidos em 30 dias', cadence: 'mensal', owner: 'João Santos', target: '≥80%', trigger: '<60%', current_value: '75%' },
          { id: 'kpi10', name: 'GPTW Readiness', definition: 'Score interno de prontidão para GPTW', cadence: 'trimestral', owner: 'Maria Silva', target: '≥75%', trigger: '<60%', current_value: '68%' },
          { id: 'kpi11', name: 'eNPS', definition: 'Employee Net Promoter Score', cadence: 'trimestral', owner: 'João Santos', target: '≥70', trigger: '<60', current_value: '62' },
        ],
      },
      sort_order: 2,
      updated_at: '2026-02-03T16:00:00Z',
      updated_by: 'maria.silva@empresa.com',
    },
    {
      id: 'sec-programs',
      pack_id: RH_PACK_ID,
      key: 'programs',
      title: 'Programas e Iniciativas',
      body_markdown: `# Programas RH 2026

## 🔗 Conecta
Programa de atração e onboarding de talentos.
- Meta: 50 novas contratações com fit cultural >80%
- Iniciativas: Employer branding, Processo seletivo gamificado

## 📈 Desenvolve
Programa de desenvolvimento e capacitação.
- Meta: 100% dos gestores com PDI
- Iniciativas: Academia de Líderes, Mentoria reversa

## 🏆 Reconhece
Programa de reconhecimento e retenção.
- Meta: Reduzir turnover crítico em 20%
- Iniciativas: Política de remuneração variável, Programa de reconhecimento

## 💡 Inova
Programa de inovação em processos de RH.
- Meta: 80% de digitalização
- Iniciativas: Implementação HRIS, People Analytics`,
      structured_data: {
        programs: [
          { id: 'prog-conecta', key: 'conecta', name: 'Conecta', description: 'Atração e onboarding de talentos', goals: ['50 novas contratações', 'Fit cultural >80%'], status: 'active' },
          { id: 'prog-desenvolve', key: 'desenvolve', name: 'Desenvolve', description: 'Desenvolvimento e capacitação', goals: ['100% gestores com PDI', 'Academia de Líderes'], status: 'active' },
          { id: 'prog-reconhece', key: 'reconhece', name: 'Reconhece', description: 'Reconhecimento e retenção', goals: ['Reduzir turnover crítico 20%', 'Programa de reconhecimento'], status: 'planned' },
          { id: 'prog-inova', key: 'inova', name: 'Inova', description: 'Inovação em processos de RH', goals: ['80% digitalização', 'People Analytics'], status: 'active' },
        ],
      },
      sort_order: 3,
      updated_at: '2026-02-04T11:00:00Z',
      updated_by: 'joao.santos@empresa.com',
    },
    {
      id: 'sec-governance',
      pack_id: RH_PACK_ID,
      key: 'governance',
      title: 'Governança e Evidências',
      body_markdown: `# Governança RH 2026

## Rituais

### WBR - Weekly Business Review
- **Cadência:** Semanal (segundas 9h)
- **Participantes:** Head RH, Líderes de área
- **Foco:** Indicadores operacionais, blockers

### MBR - Monthly Business Review
- **Cadência:** Mensal (primeira sexta do mês)
- **Participantes:** Head RH, Diretoria
- **Foco:** Resultados do mês, projeções

### QBR - Quarterly Business Review
- **Cadência:** Trimestral
- **Participantes:** Head RH, C-Level
- **Foco:** Revisão estratégica, ajustes de rota

## Decisões Registradas
- 15/01/2026: Aprovado orçamento para HRIS
- 20/01/2026: Definido cronograma de implementação`,
      structured_data: {
        rituals: [
          { id: 'rit-wbr', type: 'WBR', name: 'Weekly Business Review', cadence: 'Semanal', participants: ['Head RH', 'Líderes'], last_meeting: '2026-02-03', next_meeting: '2026-02-10' },
          { id: 'rit-mbr', type: 'MBR', name: 'Monthly Business Review', cadence: 'Mensal', participants: ['Head RH', 'Diretoria'], last_meeting: '2026-02-07', next_meeting: '2026-03-07' },
          { id: 'rit-qbr', type: 'QBR', name: 'Quarterly Business Review', cadence: 'Trimestral', participants: ['Head RH', 'C-Level'], last_meeting: '2025-12-15', next_meeting: '2026-03-15' },
        ],
        minutes: [
          {
            id: 'min-mbr-202602',
            ritual_id: 'rit-mbr',
            date: '2026-02-07',
            attendees: ['Maria Silva', 'Carlos Diretor', 'João Santos'],
            summary: 'Revisão dos KPIs de janeiro. Turnover estável em 11.2%. Discussão sobre aceleração do programa Conecta para Q1.',
            decisions: [
              { id: 'd1', description: 'Acelerar contratações do programa Conecta', responsible: 'João Santos', due_date: '2026-02-28' },
              { id: 'd2', description: 'Aprovar budget adicional para employer branding', responsible: 'Carlos Diretor' },
            ],
            action_items: [
              { id: 'ai1', description: 'Elaborar plano de aceleração Conecta', owner: 'João Santos', due_date: '2026-02-15', status: 'pending' },
              { id: 'ai2', description: 'Apresentar proposta employer branding', owner: 'Ana Costa', due_date: '2026-02-20', status: 'pending' },
            ],
            evidence_links: [],
          },
          {
            id: 'min-mbr-202601',
            ritual_id: 'rit-mbr',
            date: '2026-01-10',
            attendees: ['Maria Silva', 'Carlos Diretor', 'João Santos', 'Ana Costa'],
            summary: 'Kick-off do PE-2026 RH. Definição dos objetivos estratégicos e programas prioritários.',
            decisions: [
              { id: 'd3', description: 'Aprovar estrutura dos 4 programas (Conecta, Desenvolve, Reconhece, Inova)', responsible: 'Carlos Diretor' },
              { id: 'd4', description: 'Priorizar implementação do HRIS no Q1-Q2', responsible: 'Maria Silva' },
            ],
            action_items: [
              { id: 'ai3', description: 'Finalizar cronograma HRIS', owner: 'Maria Silva', due_date: '2026-01-20', status: 'done' },
              { id: 'ai4', description: 'Mapear fornecedores para Academia de Líderes', owner: 'Ana Costa', due_date: '2026-01-31', status: 'done' },
            ],
            evidence_links: [],
          },
        ],
        decisions: [
          { date: '2026-02-07', description: 'Acelerar contratações do programa Conecta', responsible: 'João Santos' },
          { date: '2026-02-07', description: 'Aprovar budget adicional para employer branding', responsible: 'Carlos Diretor' },
          { date: '2026-01-15', description: 'Aprovado orçamento para HRIS', responsible: 'Direção' },
          { date: '2026-01-20', description: 'Definido cronograma de implementação', responsible: 'Maria Silva' },
          { date: '2026-01-10', description: 'Aprovar estrutura dos 4 programas', responsible: 'Carlos Diretor' },
        ],
      },
      sort_order: 4,
      updated_at: '2026-02-05T09:00:00Z',
      updated_by: 'maria.silva@empresa.com',
    },
    {
      id: 'sec-docs',
      pack_id: RH_PACK_ID,
      key: 'docs',
      title: 'Documentos',
      body_markdown: `# Documentos do PE-2026 RH

Anexe aqui todos os documentos relevantes para o planejamento estratégico.

## Categorias
- **Diagnósticos:** Pesquisas, análises de mercado
- **Políticas:** Documentos normativos aprovados
- **Apresentações:** Slides de alinhamento
- **Atas:** Registros de reuniões`,
      structured_data: {},
      sort_order: 5,
      updated_at: '2026-01-15T10:00:00Z',
      updated_by: 'maria.silva@empresa.com',
    },
    // ===== MARKETING SECTIONS =====
    { id: 'sec-marketing-overview', pack_id: MARKETING_PACK_ID, key: 'overview' as SectionKey, title: 'Visao Geral', body_markdown: '# PE-2026 Marketing\n\n## Mandato\nGerar demanda qualificada e fortalecer brand awareness.\n\n## Objetivos\n- M1: Aumentar leads qualificados em 40%\n- M2: Elevar brand awareness em 25%\n- M3: Implementar ABM para enterprise\n- M4: Otimizar CAC em 20%', structured_data: { mandate: 'Gerar demanda qualificada e fortalecer brand awareness', objectives: [{ id: 'marketing-o1', key: 'M1', title: 'Aumentar leads qualificados em 40%' }, { id: 'marketing-o2', key: 'M2', title: 'Elevar brand awareness em 25%' }, { id: 'marketing-o3', key: 'M3', title: 'Implementar ABM para enterprise' }, { id: 'marketing-o4', key: 'M4', title: 'Otimizar CAC em 20%' }] }, sort_order: 0, updated_at: '2026-02-08T14:30:00Z', updated_by: 'carlos.silva@empresa.com' },
    { id: 'sec-marketing-objectives', pack_id: MARKETING_PACK_ID, key: 'objectives' as SectionKey, title: 'Objetivos e Metas', body_markdown: '# Objetivos Marketing 2026', structured_data: { objectives: [{ id: 'marketing-o1', key: 'M1', title: 'Leads qualificados +40%', description: 'Aumentar pipeline de leads qualificados' }, { id: 'marketing-o2', key: 'M2', title: 'Brand awareness +25%', description: 'Fortalecer posicionamento de marca' }], kpis: [{ id: 'marketing-kpi-1', name: 'MQLs/mes', definition: 'Marketing Qualified Leads por mes', cadence: 'mensal', owner: 'Carlos Silva', target: '200', current_value: '120' }, { id: 'marketing-kpi-2', name: 'CAC', definition: 'Custo de aquisicao de cliente', cadence: 'mensal', owner: 'Fernanda Costa', target: 'R$500', current_value: 'R$650' }] }, sort_order: 2, updated_at: '2026-02-08T14:30:00Z', updated_by: 'carlos.silva@empresa.com' },
    { id: 'sec-marketing-programs', pack_id: MARKETING_PACK_ID, key: 'programs' as SectionKey, title: 'Programas', body_markdown: '# Programas Marketing 2026', structured_data: { programs: [{ id: 'prog-marketing-inbound', key: 'inbound', name: 'Inbound Marketing', description: 'Funil de conteudo e automacao', goals: ['200 MQLs/mes', 'Conversao 5%'], status: 'active' }, { id: 'prog-marketing-brand', key: 'brand', name: 'Brand Building', description: 'Posicionamento e awareness', goals: ['Awareness +25%', 'NPS marca 60+'], status: 'active' }, { id: 'prog-marketing-abm', key: 'abm', name: 'ABM Enterprise', description: 'Account-based marketing top 50', goals: ['50 contas ativas', 'Pipeline R$5M'], status: 'planned' }] }, sort_order: 3, updated_at: '2026-02-08T14:30:00Z', updated_by: 'carlos.silva@empresa.com' },
    { id: 'sec-marketing-governance', pack_id: MARKETING_PACK_ID, key: 'governance' as SectionKey, title: 'Governanca', body_markdown: '# Governanca Marketing 2026', structured_data: { rituals: [{ id: 'rit-marketing-wbr', type: 'WBR', name: 'Weekly Marketing Review', cadence: 'Semanal', participants: ['Head Marketing', 'Leads'] }] }, sort_order: 4, updated_at: '2026-02-08T14:30:00Z', updated_by: 'carlos.silva@empresa.com' },
    { id: 'sec-marketing-docs', pack_id: MARKETING_PACK_ID, key: 'docs' as SectionKey, title: 'Documentos', body_markdown: '# Documentos Marketing 2026', structured_data: {}, sort_order: 5, updated_at: '2026-02-08T14:30:00Z', updated_by: 'carlos.silva@empresa.com' },
    // ===== OPERACOES SECTIONS =====
    { id: 'sec-operacoes-overview', pack_id: OPERACOES_PACK_ID, key: 'overview' as SectionKey, title: 'Visao Geral', body_markdown: '# PE-2026 Operacoes\n\n## Mandato\nAlcancar excelencia operacional com processos otimizados e automacao.\n\n## Objetivos\n- OP1: Reduzir tempo de ciclo em 25%\n- OP2: Automatizar 80% dos processos repetitivos\n- OP3: Certificar 20 Green Belts\n- OP4: Implementar gestao visual', structured_data: { mandate: 'Excelencia operacional com processos otimizados', objectives: [{ id: 'operacoes-o1', key: 'OP1', title: 'Reduzir tempo de ciclo em 25%' }, { id: 'operacoes-o2', key: 'OP2', title: 'Automatizar 80% processos' }, { id: 'operacoes-o3', key: 'OP3', title: 'Certificar 20 Green Belts' }, { id: 'operacoes-o4', key: 'OP4', title: 'Implementar gestao visual' }] }, sort_order: 0, updated_at: '2026-02-06T14:30:00Z', updated_by: 'roberto.lima@empresa.com' },
    { id: 'sec-operacoes-objectives', pack_id: OPERACOES_PACK_ID, key: 'objectives' as SectionKey, title: 'Objetivos e Metas', body_markdown: '# Objetivos Operacoes 2026', structured_data: { objectives: [{ id: 'operacoes-o1', key: 'OP1', title: 'Tempo de ciclo -25%', description: 'Reduzir ciclo operacional' }, { id: 'operacoes-o2', key: 'OP2', title: 'Automacao 80%', description: 'Automatizar processos repetitivos' }], kpis: [{ id: 'operacoes-kpi-1', name: 'Cycle Time', definition: 'Tempo medio de ciclo operacional', cadence: 'mensal', owner: 'Roberto Lima', target: '-25%', current_value: '-10%' }, { id: 'operacoes-kpi-2', name: 'Automacao', definition: '% processos automatizados', cadence: 'mensal', owner: 'Patricia Almeida', target: '80%', current_value: '45%' }] }, sort_order: 2, updated_at: '2026-02-06T14:30:00Z', updated_by: 'roberto.lima@empresa.com' },
    { id: 'sec-operacoes-programs', pack_id: OPERACOES_PACK_ID, key: 'programs' as SectionKey, title: 'Programas', body_markdown: '# Programas Operacoes 2026', structured_data: { programs: [{ id: 'prog-operacoes-rpa', key: 'rpa', name: 'RPA Program', description: 'Automacao robotica de processos', goals: ['15 processos automatizados', 'ROI 200%'], status: 'active' }, { id: 'prog-operacoes-lean', key: 'lean', name: 'Lean Six Sigma', description: 'Melhoria continua', goals: ['20 Green Belts', '10 projetos'], status: 'active' }] }, sort_order: 3, updated_at: '2026-02-06T14:30:00Z', updated_by: 'roberto.lima@empresa.com' },
    { id: 'sec-operacoes-governance', pack_id: OPERACOES_PACK_ID, key: 'governance' as SectionKey, title: 'Governanca', body_markdown: '# Governanca Operacoes 2026', structured_data: { rituals: [{ id: 'rit-operacoes-wbr', type: 'WBR', name: 'Weekly Ops Review', cadence: 'Semanal', participants: ['Head Operação', 'Coordinators'] }] }, sort_order: 4, updated_at: '2026-02-06T14:30:00Z', updated_by: 'roberto.lima@empresa.com' },
    { id: 'sec-operacoes-docs', pack_id: OPERACOES_PACK_ID, key: 'docs' as SectionKey, title: 'Documentos', body_markdown: '# Documentos Operacoes 2026', structured_data: {}, sort_order: 5, updated_at: '2026-02-06T14:30:00Z', updated_by: 'roberto.lima@empresa.com' },
    // ===== FINANCEIRO SECTIONS =====
    { id: 'sec-fin-overview', pack_id: FIN_PACK_ID, key: 'overview' as SectionKey, title: 'Visao Geral', body_markdown: '# PE-2026 Financeiro\n\n## Mandato\nGestao financeira eficiente com compliance e automacao.\n\n## Objetivos\n- F1: Reduzir ciclo de fechamento para 5 dias\n- F2: Garantir compliance SOX\n- F3: Implementar FP&A analytics\n- F4: Otimizar gestao de capital', structured_data: { mandate: 'Gestao financeira eficiente com compliance', objectives: [{ id: 'fo1', key: 'F1', title: 'Fechamento em 5 dias' }, { id: 'fo2', key: 'F2', title: 'Compliance SOX' }, { id: 'fo3', key: 'F3', title: 'FP&A analytics' }, { id: 'fo4', key: 'F4', title: 'Gestao de capital' }] }, sort_order: 0, updated_at: '2026-02-07T14:30:00Z', updated_by: 'maria.santos@empresa.com' },
    { id: 'sec-fin-objectives', pack_id: FIN_PACK_ID, key: 'objectives' as SectionKey, title: 'Objetivos e Metas', body_markdown: '# Objetivos Financeiro 2026', structured_data: { objectives: [{ id: 'fo1', key: 'F1', title: 'Fechamento 5 dias', description: 'Reduzir ciclo de fechamento contabil' }, { id: 'fo2', key: 'F2', title: 'Compliance SOX', description: 'Garantir conformidade regulatoria' }], kpis: [{ id: 'fkpi1', name: 'Dias Fechamento', definition: 'Dias para fechamento contabil', cadence: 'mensal', owner: 'Maria Santos', target: '5', current_value: '10' }, { id: 'fkpi2', name: 'Compliance Score', definition: 'Score de conformidade', cadence: 'trimestral', owner: 'Ricardo Souza', target: '95%', current_value: '88%' }] }, sort_order: 2, updated_at: '2026-02-07T14:30:00Z', updated_by: 'maria.santos@empresa.com' },
    { id: 'sec-fin-programs', pack_id: FIN_PACK_ID, key: 'programs' as SectionKey, title: 'Programas', body_markdown: '# Programas Financeiro 2026', structured_data: { programs: [{ id: 'prog-fin-auto', key: 'automacao', name: 'Automacao Financeira', description: 'Automatizar fechamento e conciliacao', goals: ['Fechamento 5 dias', 'Zero retrabalho'], status: 'active' }, { id: 'prog-fin-compliance', key: 'compliance', name: 'Compliance Program', description: 'SOX e auditoria', goals: ['Score 95%', 'Zero findings'], status: 'active' }] }, sort_order: 3, updated_at: '2026-02-07T14:30:00Z', updated_by: 'maria.santos@empresa.com' },
    { id: 'sec-fin-governance', pack_id: FIN_PACK_ID, key: 'governance' as SectionKey, title: 'Governanca', body_markdown: '# Governanca Financeiro 2026', structured_data: { rituals: [{ id: 'rit-fin-mbr', type: 'MBR', name: 'Monthly Finance Review', cadence: 'Mensal', participants: ['CFO', 'Controllers'] }] }, sort_order: 4, updated_at: '2026-02-07T14:30:00Z', updated_by: 'maria.santos@empresa.com' },
    { id: 'sec-fin-docs', pack_id: FIN_PACK_ID, key: 'docs' as SectionKey, title: 'Documentos', body_markdown: '# Documentos Financeiro 2026', structured_data: {}, sort_order: 5, updated_at: '2026-02-07T14:30:00Z', updated_by: 'maria.santos@empresa.com' },
  ],
  attachments: [
    {
      id: 'att-1',
      pack_id: RH_PACK_ID,
      section_id: 'sec-diagnosis',
      filename: 'Pesquisa_Clima_2025.pdf',
      content_type: 'application/pdf',
      storage_path: 'rh/2026/Pesquisa_Clima_2025.pdf',
      file_size: 2450000,
      tags: ['pesquisa', 'clima', '2025'],
      version_label: 'v1',
      uploaded_by: 'maria.silva@empresa.com',
      uploaded_at: '2026-01-20T14:00:00Z',
    },
    {
      id: 'att-2',
      pack_id: RH_PACK_ID,
      section_id: 'sec-docs',
      filename: 'Politica_Remuneracao_2026.docx',
      content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      storage_path: 'rh/2026/Politica_Remuneracao_2026.docx',
      file_size: 180000,
      tags: ['política', 'remuneração'],
      version_label: 'v2',
      uploaded_by: 'joao.santos@empresa.com',
      uploaded_at: '2026-02-01T10:00:00Z',
    },
    {
      id: 'att-3',
      pack_id: RH_PACK_ID,
      section_id: 'sec-docs',
      filename: 'Apresentacao_PE2026_Diretoria.pptx',
      content_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      storage_path: 'rh/2026/Apresentacao_PE2026_Diretoria.pptx',
      file_size: 5200000,
      tags: ['apresentação', 'diretoria', 'estratégia'],
      version_label: 'v1',
      uploaded_by: 'maria.silva@empresa.com',
      uploaded_at: '2026-02-03T16:30:00Z',
    },
  ],
  comments: [
    {
      id: 'cmt-1',
      pack_id: RH_PACK_ID,
      section_id: 'sec-objectives',
      author: 'carlos.diretor@empresa.com',
      body: 'A meta de eNPS 70+ é ambiciosa. Temos recursos suficientes para as iniciativas de clima?',
      status: 'open',
      created_at: '2026-02-04T11:30:00Z',
    },
    {
      id: 'cmt-2',
      pack_id: RH_PACK_ID,
      section_id: 'sec-programs',
      author: 'ana.costa@empresa.com',
      body: 'Sugiro incluir indicador de satisfação com onboarding no programa Conecta.',
      status: 'resolved',
      created_at: '2026-02-02T14:00:00Z',
      resolved_at: '2026-02-03T09:00:00Z',
      resolved_by: 'maria.silva@empresa.com',
    },
  ],
  changelog: [
    {
      id: 'log-1',
      pack_id: RH_PACK_ID,
      actor: 'maria.silva@empresa.com',
      change_type: 'created',
      before: null,
      after: { status: 'draft', version: '1.0' },
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: 'log-2',
      pack_id: RH_PACK_ID,
      actor: 'maria.silva@empresa.com',
      change_type: 'section_updated',
      before: { section: 'objectives', title: 'Objetivos' },
      after: { section: 'objectives', title: 'Objetivos e Metas' },
      created_at: '2026-02-03T16:00:00Z',
    },
    {
      id: 'log-3',
      pack_id: RH_PACK_ID,
      actor: 'joao.santos@empresa.com',
      change_type: 'attachment_added',
      before: null,
      after: { filename: 'Politica_Remuneracao_2026.docx', section: 'docs' },
      created_at: '2026-02-01T10:00:00Z',
    },
  ],
  references: [
    {
      id: 'ref-1',
      pack_id: RH_PACK_ID,
      ref_type: 'plan',
      label: 'Plano de Ação RH 2026',
      url: '/planning/rh/dashboard',
      metadata: { area_slug: 'rh', year: 2026 },
    },
    {
      id: 'ref-2',
      pack_id: RH_PACK_ID,
      ref_type: 'evidence',
      label: 'Backlog de Evidências',
      url: '/planning/actions/evidences',
      metadata: {},
    },
  ],
  monthlyCloses: [],
}

const SECTION_TITLES: Record<SectionKey, string> = {
  overview: 'Visão Geral',
  diagnosis: 'Diagnóstico e Base',
  objectives: 'Objetivos e Metas',
  programs: 'Programas e Iniciativas',
  governance: 'Governança e Evidências',
  docs: 'Documentos',
}

function buildSection(
  id: string,
  packId: string,
  key: SectionKey,
  bodyMarkdown: string,
  structuredData: Record<string, unknown>,
  sortOrder: number,
): AreaPackSection {
  return {
    id,
    pack_id: packId,
    key,
    title: SECTION_TITLES[key],
    body_markdown: bodyMarkdown,
    structured_data: structuredData,
    sort_order: sortOrder,
    updated_at: '2026-03-01T10:00:00Z',
    updated_by: 'seed.pe2026@local',
  }
}

const realPackSeeds: Array<{ pack: AreaStrategicPack; sections: AreaPackSection[] }> = [
  {
    pack: {
      id: RH_PACK_ID,
      area_slug: 'rh',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'RH 2026 — densidade intelectual, liderança, saúde organizacional e onboarding para posições críticas.',
      owners: {
        headName: 'Renata Silvestre',
        backupName: 'Fernanda Xavier',
      },
      created_at: '2026-02-06T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-rh-overview-real', RH_PACK_ID, 'overview', `# PE-2026 RH

## Mandato
Garantir capacidade humana, liderança e saúde organizacional para sustentar a execução do PE2026.

## Foco do ano
- Turnover anual ≤ 35%
- Rituais mínimos de liderança implantados
- Onboarding 30/60/90 para posições críticas
- Base de talentos e sucessão mínima por área`, {
        mandate: 'Garantir capacidade humana, liderança e saúde organizacional para sustentar a execução do PE2026.',
        objectives: [
          { id: 'rh-o1', key: 'O1', title: 'Turnover anual ≤ 35%' },
          { id: 'rh-o2', key: 'O2', title: 'Rituais mínimos de liderança implantados' },
          { id: 'rh-o3', key: 'O3', title: 'Onboarding 30/60/90 para posições críticas' },
          { id: 'rh-o4', key: 'O4', title: 'Mapa de sucessão mínima por área' },
        ],
      }, 0),
      buildSection('sec-rh-diagnosis-real', RH_PACK_ID, 'diagnosis', `# Diagnóstico RH

- Turnover e retenção de posições críticas seguem como risco alto.
- Há necessidade de rituais mínimos de liderança e gestão.
- Onboarding e sucessão ainda precisam de padrão único.`, {
        baselines: [
          { label: 'Turnover anual', value: '28%' },
          { label: 'Aderência a rituais mínimos', value: '68%' },
          { label: 'Onboarding com trilha 30/60/90', value: 'Piloto em andamento' },
        ],
        premises: [
          'A sustentação da tese depende de liderança e retenção em posições-chave.',
          'Os rituais mínimos precisam ser auditáveis e com cadência mensal.',
        ],
        constraints: [
          'Capacidade limitada das lideranças no Q1.',
          'Base histórica ainda pouco padronizada para posições críticas.',
        ],
      }, 1),
      buildSection('sec-rh-objectives-real', RH_PACK_ID, 'objectives', `# Objetivos RH

- Reduzir turnover e risco em posições críticas.
- Implantar rituais mínimos de liderança.
- Padronizar onboarding 30/60/90.
- Fortalecer sucessão mínima e leitura de saúde organizacional.`, {
        objectives: [
          { id: 'rh-obj-1', key: 'O1', title: 'Reduzir turnover e risco em posições críticas', description: 'Atuar sobre a saúde organizacional e retenção com governança mensal.' },
          { id: 'rh-obj-2', key: 'O2', title: 'Implantar rituais mínimos de liderança', description: 'Garantir rotina mínima por líder e por área.' },
          { id: 'rh-obj-3', key: 'O3', title: 'Padronizar onboarding 30/60/90', description: 'Criar trilha replicável para funções prioritárias.' },
        ],
        kpis: [
          { id: 'rh-kpi-1', name: 'Turnover anual', definition: 'Rotatividade acumulada anual', cadence: 'mensal', owner: 'Renata Silvestre', target: '≤35%', trigger: '>35%', current_value: '28%' },
          { id: 'rh-kpi-2', name: 'Aderência a rituais mínimos', definition: '% de rituais mínimos executados por área', cadence: 'mensal', owner: 'Renata Silvestre', target: '≥90%', trigger: '<75%', current_value: '68%' },
          { id: 'rh-kpi-3', name: 'Onboarding 30/60/90', definition: '% de funções críticas com trilha implantada', cadence: 'mensal', owner: 'Fernanda Xavier', target: '100%', trigger: '<60%', current_value: '42%' },
        ],
      }, 2),
      buildSection('sec-rh-programs-real', RH_PACK_ID, 'programs', `# Programas RH

- Conecta — onboarding e integração.
- Desenvolve — liderança e rituais mínimos.
- Reconhece — saúde organizacional e retenção.
- Inova — dados e cadência de gestão.`, {
        programs: [
          { id: 'rh-prog-1', key: 'conecta', name: 'Conecta', description: 'Onboarding e integração para posições críticas', goals: ['Trilha 30/60/90 ativa', 'Reduzir churn inicial'], status: 'active' },
          { id: 'rh-prog-2', key: 'desenvolve', name: 'Desenvolve', description: 'Rituais mínimos e liderança prática', goals: ['Rituais mínimos por área', 'Aderência ≥90%'], status: 'active' },
          { id: 'rh-prog-3', key: 'reconhece', name: 'Reconhece', description: 'Saúde organizacional e retenção', goals: ['Turnover ≤35%', 'Pulso de saúde organizacional'], status: 'planned' },
          { id: 'rh-prog-4', key: 'inova', name: 'Inova', description: 'Dados de RH e cadência de gestão', goals: ['Painel RH mensal', 'Base única de posições críticas'], status: 'active' },
        ],
      }, 3),
      buildSection('sec-rh-governance-real', RH_PACK_ID, 'governance', `# Governança RH

- WBR RH semanal
- MBR RH mensal
- QBR trimestral com Direção`, {
        rituals: [
          { id: 'rh-rit-1', type: 'WBR', name: 'WBR RH', cadence: 'Semanal', participants: ['RH', 'Lideranças'], last_meeting: '2026-02-26', next_meeting: '2026-03-05' },
          { id: 'rh-rit-2', type: 'MBR', name: 'MBR RH', cadence: 'Mensal', participants: ['RH', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-31' },
          { id: 'rh-rit-3', type: 'QBR', name: 'QBR Pessoas', cadence: 'Trimestral', participants: ['RH', 'Direção Executiva'], last_meeting: '2025-12-20', next_meeting: '2026-03-25' },
        ],
        decisions: [
          { date: '2026-03-01', description: 'Priorizar posições críticas e onboarding 30/60/90 no Q1/Q2.', responsible: 'RH' },
        ],
      }, 4),
      buildSection('sec-rh-docs-real', RH_PACK_ID, 'docs', `# Documentos RH

Espaço para rituais, checklists de onboarding, mapa de posições críticas e evidências mensais.`, {}, 5),
    ],
  },
  {
    pack: {
      id: MARKETING_PACK_ID,
      area_slug: 'marketing',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'Marketing 2026 — provas de valor, agenda nacional e narrativa única para expansão com tese.',
      owners: {
        headName: 'Liderança de Marketing',
        backupName: 'Direção Executiva',
      },
      created_at: '2026-02-12T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-marketing-overview-real', MARKETING_PACK_ID, 'overview', `# PE-2026 Marketing

## Mandato
Consolidar provas de valor, agenda nacional e narrativa única para apoiar a tese comercial e a monetização.`, {
        mandate: 'Consolidar provas de valor, agenda nacional e narrativa única para apoiar a tese comercial e a monetização.',
        objectives: [
          { id: 'marketing-o1', key: 'O1', title: 'Biblioteca de provas por tese' },
          { id: 'marketing-o2', key: 'O2', title: 'Agenda nacional rastreada' },
          { id: 'marketing-o3', key: 'O3', title: 'Pós-evento conectado ao pipeline' },
        ],
      }, 0),
      buildSection('sec-marketing-diagnosis-real', MARKETING_PACK_ID, 'diagnosis', `# Diagnóstico Marketing

- Provas de valor ainda dispersas.
- Agenda nacional precisa de rastreabilidade até pipeline.
- Narrativa deve refletir a tese e os motores do ano.`, {
        baselines: [
          { label: 'Biblioteca de provas', value: 'Em consolidação' },
          { label: 'Agenda nacional rastreada', value: 'Parcial' },
          { label: 'Pós-evento conectado ao pipeline', value: 'Baixo' },
        ],
        premises: ['Marketing deve sustentar a tese, não apenas gerar volume.', 'Toda agenda precisa virar evidência e aprendizado.'],
        constraints: ['Dependência de integração com Comercial e P&D / Produto / Dados.'],
      }, 1),
      buildSection('sec-marketing-objectives-real', MARKETING_PACK_ID, 'objectives', `# Objetivos Marketing

- Publicar provas de valor por tese.
- Operar agenda nacional com leitura de retorno.
- Conectar narrativa, proposta e expansão com permanência.`, {
        objectives: [
          { id: 'marketing-obj-1', key: 'O1', title: 'Publicar provas de valor por tese', description: 'Materializar biblioteca de argumentos, casos e kits de decisão.' },
          { id: 'marketing-obj-2', key: 'O2', title: 'Operar agenda nacional com leitura de retorno', description: 'Rastrear a agenda até pipeline e proposta.' },
        ],
        kpis: [
          { id: 'marketing-kpi-1', name: 'Kits de decisão publicados', definition: 'Quantidade de kits por tese priorizada', cadence: 'mensal', owner: 'Liderança de Marketing', target: '8', trigger: '<4', current_value: '5' },
          { id: 'marketing-kpi-2', name: 'Agenda rastreada até pipeline', definition: '% de eventos com pós-evento e evidência de retorno', cadence: 'mensal', owner: 'Liderança de Marketing', target: '100%', trigger: '<70%', current_value: '62%' },
        ],
      }, 2),
      buildSection('sec-marketing-programs-real', MARKETING_PACK_ID, 'programs', `# Programas Marketing

- Provas de Valor
- Agenda Nacional
- Pós-evento rastreado`, {
        programs: [
          { id: 'marketing-prog-1', key: 'provas', name: 'Provas de Valor', description: 'Biblioteca de materiais e argumentos por tese', goals: ['Kits por tese', 'Casos com evidência'], status: 'active' },
          { id: 'marketing-prog-2', key: 'agenda', name: 'Agenda Nacional', description: 'Presença coordenada em agenda prioritária', goals: ['Agenda anual', 'Rastreabilidade por evento'], status: 'active' },
          { id: 'marketing-prog-3', key: 'pos-evento', name: 'Pós-evento rastreado', description: 'Conectar agenda, comercial e evidências', goals: ['Follow-up padronizado', 'Leitura de retorno'], status: 'planned' },
        ],
      }, 3),
      buildSection('sec-marketing-governance-real', MARKETING_PACK_ID, 'governance', `# Governança Marketing

- WBR de agenda e pipeline
- MBR de tese, narrativa e retorno`, {
        rituals: [
          { id: 'marketing-rit-1', type: 'WBR', name: 'WBR Agenda', cadence: 'Semanal', participants: ['Marketing', 'Comercial'], last_meeting: '2026-02-27', next_meeting: '2026-03-06' },
          { id: 'marketing-rit-2', type: 'MBR', name: 'MBR Marketing', cadence: 'Mensal', participants: ['Marketing', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-31' },
        ],
      }, 4),
      buildSection('sec-marketing-docs-real', MARKETING_PACK_ID, 'docs', `# Documentos Marketing

Espaço para kits de decisão, provas de valor, plano de agenda e fechamento mensal.`, {}, 5),
    ],
  },
  {
    pack: {
      id: PD_PACK_ID,
      area_slug: 'pd',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'P&D / Produto / Dados 2026 — painel executivo, fonte única e IA aplicada como vantagem defensável.',
      owners: {
        headName: 'Direção Executiva',
        backupName: 'Consultorias Especializadas',
      },
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-pd-overview-real', PD_PACK_ID, 'overview', `# PE-2026 P&D / Produto / Dados

## Mandato
Transformar produto, dados e IA em camada defensável para monetização, previsibilidade e prova de valor.`, {
        mandate: 'Transformar produto, dados e IA em camada defensável para monetização, previsibilidade e prova de valor.',
        objectives: [
          { id: 'pd-o1', key: 'O1', title: 'Painel executivo de monetização' },
          { id: 'pd-o2', key: 'O2', title: 'Fonte única para saldo, vazão e forecast' },
          { id: 'pd-o3', key: 'O3', title: 'Trilha de evidências técnicas e executivas' },
        ],
      }, 0),
      buildSection('sec-pd-diagnosis-real', PD_PACK_ID, 'diagnosis', `# Diagnóstico P&D / Produto / Dados

- Fontes ainda fragmentadas para saldo e forecast.
- Evidências precisam de biblioteca única.
- IA deve ser aplicada a decisões e não só a experimentos.`, {
        baselines: [
          { label: 'Fonte única de dados', value: 'Parcial' },
          { label: 'Forecast com lastro', value: 'Em consolidação' },
          { label: 'Biblioteca de evidências', value: 'Inicial' },
        ],
        premises: ['Sem dado confiável não há monetização previsível.', 'Produto e IA precisam reduzir incerteza executiva.'],
        constraints: ['Dependência de reconciliação com Operação e CS / Relacionamento.'],
      }, 1),
      buildSection('sec-pd-objectives-real', PD_PACK_ID, 'objectives', `# Objetivos P&D / Produto / Dados

- Implantar painel executivo com saldo, vazão e forecast.
- Sustentar fonte única para leitura semanal.
- Produzir trilha de evidências e ativos de IA aplicados à tese.`, {
        objectives: [
          { id: 'pd-obj-1', key: 'O1', title: 'Implantar painel executivo', description: 'Conectar saldo, vazão, forecast 30/60/90 e Pareto.' },
          { id: 'pd-obj-2', key: 'O2', title: 'Sustentar fonte única', description: 'Eliminar divergências críticas entre fontes operacionais.' },
        ],
        kpis: [
          { id: 'pd-kpi-1', name: 'Fontes reconciliadas', definition: '% de fontes críticas reconciliadas no ciclo semanal', cadence: 'semanal', owner: 'Direção Executiva', target: '100%', trigger: '<80%', current_value: '76%' },
          { id: 'pd-kpi-2', name: 'Forecast com lastro', definition: '% do forecast 30/60/90 apoiado por agenda confirmada', cadence: 'semanal', owner: 'Direção Executiva', target: '≥90%', trigger: '<70%', current_value: '72%' },
        ],
      }, 2),
      buildSection('sec-pd-programs-real', PD_PACK_ID, 'programs', `# Programas P&D / Produto / Dados

- Painel Executivo
- Biblioteca de Evidências
- IA aplicada à decisão`, {
        programs: [
          { id: 'pd-prog-1', key: 'painel', name: 'Painel Executivo', description: 'Saldo, vazão, ativação e forecast', goals: ['Fonte única', 'Leitura semanal'], status: 'active' },
          { id: 'pd-prog-2', key: 'evidencias', name: 'Biblioteca de Evidências', description: 'Ativos executivos e técnicos por cliente', goals: ['Evidência por tese', 'Histórico auditável'], status: 'active' },
          { id: 'pd-prog-3', key: 'ia', name: 'IA Aplicada', description: 'IA como apoio à previsão e priorização', goals: ['Menos ruído decisório', 'Mais velocidade de análise'], status: 'planned' },
        ],
      }, 3),
      buildSection('sec-pd-governance-real', PD_PACK_ID, 'governance', `# Governança P&D / Produto / Dados

- WBR de reconciliação
- War Room semanal da monetização
- MBR de produto e dados`, {
        rituals: [
          { id: 'pd-rit-1', type: 'WBR', name: 'WBR Dados', cadence: 'Semanal', participants: ['Direção', 'Dados', 'CS'], last_meeting: '2026-02-27', next_meeting: '2026-03-05' },
          { id: 'pd-rit-2', type: 'WBR', name: 'War Room Monetização', cadence: 'Semanal', participants: ['Direção', 'Operação', 'CS'], last_meeting: '2026-02-28', next_meeting: '2026-03-06' },
        ],
      }, 4),
      buildSection('sec-pd-docs-real', PD_PACK_ID, 'docs', `# Documentos P&D / Produto / Dados

Espaço para dicionário de KPIs, modelos de forecast, evidências e decisões técnicas.`, {}, 5),
    ],
  },
  {
    pack: {
      id: OPERACOES_PACK_ID,
      area_slug: 'operacoes',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'Operação 2026 — capacidade, qualidade, SLA e prontidão para escalar com margem.',
      owners: {
        headName: 'Liderança de Operação',
        backupName: 'Coordenação Operacional',
      },
      created_at: '2026-02-08T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-operacoes-overview-real', OPERACOES_PACK_ID, 'overview', `# PE-2026 Operação

## Mandato
Escalar execução com margem, qualidade e leitura semanal de capacidade.`, {
        mandate: 'Escalar execução com margem, qualidade e leitura semanal de capacidade.',
        objectives: [
          { id: 'operacoes-o1', key: 'O1', title: 'Capacidade 4-6 semanas visível' },
          { id: 'operacoes-o2', key: 'O2', title: 'Checklist mínimo de qualidade e SLA' },
          { id: 'operacoes-o3', key: 'O3', title: 'Integração Operação + CS' },
        ],
      }, 0),
      buildSection('sec-operacoes-diagnosis-real', OPERACOES_PACK_ID, 'diagnosis', `# Diagnóstico Operação

- Pico de capacidade no Q1.
- Retrabalho acima do tolerável em frentes críticas.
- Interface com CS precisa de padrão operacional único.`, {
        baselines: [
          { label: 'Planejamento 4-6 semanas', value: 'Implantação inicial' },
          { label: 'Retrabalho em frentes críticas', value: 'Acima do alvo' },
          { label: 'Checklist mínimo de qualidade', value: 'Parcial' },
        ],
        premises: ['Margem depende de capacidade e qualidade, não apenas de volume.', 'Operação precisa aparecer no War Room com dados simples e frequentes.'],
        constraints: ['Pressão de agenda no Q1 e dependência de forecast confiável.'],
      }, 1),
      buildSection('sec-operacoes-objectives-real', OPERACOES_PACK_ID, 'objectives', `# Objetivos Operação

- Tornar capacidade visível semanalmente.
- Reduzir retrabalho e desvios de SLA.
- Padronizar interface com CS / Relacionamento.`, {
        objectives: [
          { id: 'operacoes-obj-1', key: 'O1', title: 'Tornar capacidade visível semanalmente', description: 'Planejamento de 4 a 6 semanas com leitura de gargalos.' },
          { id: 'operacoes-obj-2', key: 'O2', title: 'Reduzir retrabalho e desvios de SLA', description: 'Checklist mínimo e auditoria simples.' },
        ],
        kpis: [
          { id: 'operacoes-kpi-1', name: 'SLA operacional', definition: 'Execução dentro do padrão acordado', cadence: 'semanal', owner: 'Liderança de Operação', target: '≥95%', trigger: '<90%', current_value: '91%' },
          { id: 'operacoes-kpi-2', name: 'Capacidade crítica coberta', definition: '% das próximas 4-6 semanas com capacidade mapeada', cadence: 'semanal', owner: 'Liderança de Operação', target: '100%', trigger: '<80%', current_value: '74%' },
        ],
      }, 2),
      buildSection('sec-operacoes-programs-real', OPERACOES_PACK_ID, 'programs', `# Programas Operação

- Capacidade
- Qualidade
- Integração com CS`, {
        programs: [
          { id: 'operacoes-prog-1', key: 'capacidade', name: 'Capacidade', description: 'Planejamento semanal de 4 a 6 semanas', goals: ['Mapa de gargalos', 'Prontidão de agenda'], status: 'active' },
          { id: 'operacoes-prog-2', key: 'qualidade', name: 'Qualidade', description: 'Checklist mínimo e redução de retrabalho', goals: ['SLA ≥95%', 'Retrabalho em queda'], status: 'active' },
          { id: 'operacoes-prog-3', key: 'integracao-cs', name: 'Integração com CS', description: 'Transição e leitura compartilhada de agenda', goals: ['Handoffs claros', 'Menos ruído operacional'], status: 'planned' },
        ],
      }, 3),
      buildSection('sec-operacoes-governance-real', OPERACOES_PACK_ID, 'governance', `# Governança Operação

- War Room semanal
- WBR de capacidade
- MBR operacional`, {
        rituals: [
          { id: 'operacoes-rit-1', type: 'WBR', name: 'WBR Capacidade', cadence: 'Semanal', participants: ['Operação', 'CS'], last_meeting: '2026-02-28', next_meeting: '2026-03-06' },
          { id: 'operacoes-rit-2', type: 'MBR', name: 'MBR Operação', cadence: 'Mensal', participants: ['Operação', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-31' },
        ],
      }, 4),
      buildSection('sec-operacoes-docs-real', OPERACOES_PACK_ID, 'docs', `# Documentos Operação

Espaço para checklists, leitura semanal de capacidade, auditorias e evidências críticas.`, {}, 5),
    ],
  },
  {
    pack: {
      id: CS_PACK_ID,
      area_slug: 'cs',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'CS / Relacionamento 2026 — ativação, Pareto Top-14 e forecast 30/60/90 com lastro.',
      owners: {
        headName: 'Liderança de CS / Relacionamento',
        backupName: 'Direção Executiva',
      },
      created_at: '2026-02-05T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-cs-overview-real', CS_PACK_ID, 'overview', `# PE-2026 CS / Relacionamento

## Mandato
Converter saldo em agenda, execução e previsibilidade via ativação e gestão do Pareto Top-14.`, {
        mandate: 'Converter saldo em agenda, execução e previsibilidade via ativação e gestão do Pareto Top-14.',
        objectives: [
          { id: 'cs-o1', key: 'O1', title: 'Pareto Top-14 com plano por cliente' },
          { id: 'cs-o2', key: 'O2', title: 'Ativação acima do mínimo' },
          { id: 'cs-o3', key: 'O3', title: 'Forecast 30/60/90 com lastro' },
        ],
      }, 0),
      buildSection('sec-cs-diagnosis-real', CS_PACK_ID, 'diagnosis', `# Diagnóstico CS

- Saldo envelhecido e ativação irregular nos clientes prioritários.
- Forecast ainda oscila sem lastro completo.
- Pareto precisa de disciplina semanal.`, {
        baselines: [
          { label: 'Ativação no Pareto', value: 'Abaixo do alvo' },
          { label: 'Forecast com lastro', value: 'Parcial' },
          { label: 'Saldo envelhecido', value: 'Alto em parte da base' },
        ],
        premises: ['O motor do ano exige foco em ativação e monetização da base.', 'CS é elo entre saldo, operação e caixa.'],
        constraints: ['Dependência de agenda confirmada e interface com Operação.'],
      }, 1),
      buildSection('sec-cs-objectives-real', CS_PACK_ID, 'objectives', `# Objetivos CS / Relacionamento

- Operar Pareto Top-14 com plano por cliente.
- Aumentar ativação com foco em agenda e vazão.
- Sustentar forecast 30/60/90 com lastro e previsibilidade.`, {
        objectives: [
          { id: 'cs-obj-1', key: 'O1', title: 'Operar Pareto Top-14', description: 'Plano ativo por cliente prioritário.' },
          { id: 'cs-obj-2', key: 'O2', title: 'Aumentar ativação', description: 'Converter saldo em agenda confirmada.' },
        ],
        kpis: [
          { id: 'cs-kpi-1', name: 'Taxa de ativação', definition: 'Percentual do Pareto com ativação em ritmo esperado', cadence: 'semanal', owner: 'Liderança de CS / Relacionamento', target: '≥70%', trigger: '<55%', current_value: '58%' },
          { id: 'cs-kpi-2', name: 'Forecast com lastro', definition: '% do 30/60/90 suportado por agenda confirmada', cadence: 'semanal', owner: 'Liderança de CS / Relacionamento', target: '≥90%', trigger: '<70%', current_value: '71%' },
        ],
      }, 2),
      buildSection('sec-cs-programs-real', CS_PACK_ID, 'programs', `# Programas CS / Relacionamento

- War Room Monetização
- Ativação e Agenda
- Pareto Top-14`, {
        programs: [
          { id: 'cs-prog-1', key: 'war-room', name: 'War Room Monetização', description: 'Leitura semanal do motor do ano', goals: ['Plano por cliente', 'Escalonamento rápido'], status: 'active' },
          { id: 'cs-prog-2', key: 'ativacao', name: 'Ativação e Agenda', description: 'Converter saldo em agenda confirmada', goals: ['Ativação ≥70%', 'Menos saldo envelhecido'], status: 'active' },
          { id: 'cs-prog-3', key: 'pareto', name: 'Pareto Top-14', description: 'Gestão de concentração e monetização', goals: ['Plano por cliente', 'Ritmo de execução'], status: 'active' },
        ],
      }, 3),
      buildSection('sec-cs-governance-real', CS_PACK_ID, 'governance', `# Governança CS / Relacionamento

- War Room semanal
- MBR da monetização
- Revisão quinzenal do Pareto`, {
        rituals: [
          { id: 'cs-rit-1', type: 'WBR', name: 'War Room Monetização', cadence: 'Semanal', participants: ['CS', 'Operação', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-06' },
          { id: 'cs-rit-2', type: 'MBR', name: 'MBR Monetização', cadence: 'Mensal', participants: ['CS', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-31' },
        ],
      }, 4),
      buildSection('sec-cs-docs-real', CS_PACK_ID, 'docs', `# Documentos CS / Relacionamento

Espaço para Pareto Top-14, planos por cliente, forecast 30/60/90 e evidências de ativação.`, {}, 5),
    ],
  },
  {
    pack: {
      id: COM_PACK_ID,
      area_slug: 'comercial',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'Comercial 2026 — área em estruturação, com ICP, contas-alvo e handover disciplinado para CS.',
      owners: {
        headName: 'Direção Executiva',
        backupName: 'Comercial (em estruturação)',
      },
      created_at: '2026-03-01T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-com-overview-real', COM_PACK_ID, 'overview', `# PE-2026 Comercial

## Mandato
Estruturar a área comercial com tese, ICP, proposta replicável e transição disciplinada para CS.`, {
        mandate: 'Estruturar a área comercial com tese, ICP, proposta replicável e transição disciplinada para CS.',
        objectives: [
          { id: 'com-o1', key: 'O1', title: 'ICP e contas-alvo publicados' },
          { id: 'com-o2', key: 'O2', title: 'Oferta replicável por tese' },
          { id: 'com-o3', key: 'O3', title: 'Checklist de handover para CS' },
        ],
      }, 0),
      buildSection('sec-com-diagnosis-real', COM_PACK_ID, 'diagnosis', `# Diagnóstico Comercial

- Área ainda em formação.
- Necessidade de ICP, contas-alvo e proposta replicável.
- Handover comercial → CS precisa nascer certo.`, {
        baselines: [
          { label: 'ICP formalizado', value: 'Não' },
          { label: 'Checklist de handover', value: 'Não' },
          { label: 'Proposta replicável por tese', value: 'Parcial' },
        ],
        premises: ['O crescimento sem tese é risco monitorado.', 'A área deve nascer acoplada à monetização da base e à permanência.'],
        constraints: ['Equipe ainda em estruturação.'],
      }, 1),
      buildSection('sec-com-objectives-real', COM_PACK_ID, 'objectives', `# Objetivos Comercial

- Publicar ICP e contas-alvo.
- Estruturar proposta replicável por tese.
- Implantar checklist de transição para CS / Relacionamento.`, {
        objectives: [
          { id: 'com-obj-1', key: 'O1', title: 'Publicar ICP e contas-alvo', description: 'Definir foco comercial inicial.' },
          { id: 'com-obj-2', key: 'O2', title: 'Estruturar proposta replicável', description: 'Conectar tese, proposta e evidências.' },
        ],
        kpis: [
          { id: 'com-kpi-1', name: 'ICP publicado', definition: 'Existência de ICP validado e contas-alvo priorizadas', cadence: 'mensal', owner: 'Direção Executiva', target: 'Sim', trigger: 'Não', current_value: 'Em construção' },
        ],
      }, 2),
      buildSection('sec-com-programs-real', COM_PACK_ID, 'programs', `# Programas Comercial

- Go-to-Market Base
- ICP & Contas-Alvo
- Handover disciplinado`, {
        programs: [
          { id: 'com-prog-1', key: 'gtm', name: 'Go-to-Market Base', description: 'Escopo inicial da operação comercial', goals: ['Rotina comercial mínima', 'Proposta replicável'], status: 'planned' },
          { id: 'com-prog-2', key: 'icp', name: 'ICP & Contas-Alvo', description: 'Definição de foco e priorização', goals: ['ICP publicado', 'Contas-alvo priorizadas'], status: 'active' },
          { id: 'com-prog-3', key: 'handover', name: 'Handover disciplinado', description: 'Transição comercial → CS', goals: ['Checklist ativo', 'Menos ruído de passagem'], status: 'planned' },
        ],
      }, 3),
      buildSection('sec-com-governance-real', COM_PACK_ID, 'governance', `# Governança Comercial

- WBR comercial
- Revisão quinzenal com Marketing e CS
- MBR com Direção`, {
        rituals: [
          { id: 'com-rit-1', type: 'WBR', name: 'WBR Comercial', cadence: 'Semanal', participants: ['Comercial', 'Marketing'], last_meeting: '2026-03-01', next_meeting: '2026-03-08' },
        ],
      }, 4),
      buildSection('sec-com-docs-real', COM_PACK_ID, 'docs', `# Documentos Comercial

Espaço para ICP, contas-alvo, proposta replicável e checklist de handover.`, {}, 5),
    ],
  },
  {
    pack: {
      id: FIN_PACK_ID,
      area_slug: 'financeiro',
      year: 2026,
      status: 'draft',
      version: '2.0',
      summary: 'Financeiro 2026 — DRE gerencial por unidade, caixa 30/60/90 e separação Aero × Techdengue.',
      owners: {
        headName: 'Financeiro',
        backupName: 'Direção Executiva',
      },
      created_at: '2026-02-10T10:00:00Z',
      updated_at: '2026-03-01T10:00:00Z',
    },
    sections: [
      buildSection('sec-fin-overview-real', FIN_PACK_ID, 'overview', `# PE-2026 Financeiro

## Mandato
Dar previsibilidade econômica, leitura de caixa e separação por unidade para suportar margem e transação.`, {
        mandate: 'Dar previsibilidade econômica, leitura de caixa e separação por unidade para suportar margem e transação.',
        objectives: [
          { id: 'fin-o1', key: 'O1', title: 'DRE gerencial por unidade' },
          { id: 'fin-o2', key: 'O2', title: 'Caixa 30/60/90 com governança' },
          { id: 'fin-o3', key: 'O3', title: 'Separação Aero × Techdengue' },
        ],
      }, 0),
      buildSection('sec-fin-diagnosis-real', FIN_PACK_ID, 'diagnosis', `# Diagnóstico Financeiro

- Rateios e fronteiras econômicas ainda em estabilização.
- Caixa precisa de leitura 30/60/90 mais frequente.
- DRE por unidade é requisito para a tese de transação.`, {
        baselines: [
          { label: 'DRE por unidade', value: '1º fechamento concluído' },
          { label: 'Leitura de caixa 30/60/90', value: 'Mensal' },
          { label: 'Separação econômica', value: 'Em consolidação' },
        ],
        premises: ['Margem precisa ser lida por unidade e não só no consolidado.', 'Preparação para transação exige disciplina documental e econômica.'],
        constraints: ['Dependência de alocação correta de custos e integrações operacionais.'],
      }, 1),
      buildSection('sec-fin-objectives-real', FIN_PACK_ID, 'objectives', `# Objetivos Financeiro

- Estabilizar DRE por unidade.
- Aumentar previsibilidade de caixa 30/60/90.
- Formalizar separação Aero × Techdengue com trilha auditável.`, {
        objectives: [
          { id: 'fin-obj-1', key: 'O1', title: 'Estabilizar DRE por unidade', description: 'Centros de custo, alocação e fechamento gerencial mensal.' },
          { id: 'fin-obj-2', key: 'O2', title: 'Aumentar previsibilidade de caixa', description: 'Leitura de 30/60/90 com governança executiva.' },
        ],
        kpis: [
          { id: 'fin-kpi-1', name: 'Margem consolidada', definition: 'Guardrail de margem da companhia', cadence: 'mensal', owner: 'Financeiro', target: '≥30%', trigger: '<30%', current_value: '30.4%' },
          { id: 'fin-kpi-2', name: 'Caixa 30/60/90', definition: 'Previsibilidade de caixa por janela', cadence: 'mensal', owner: 'Financeiro', target: 'Atualizado mensalmente', trigger: 'Sem atualização', current_value: 'Atualizado' },
        ],
      }, 2),
      buildSection('sec-fin-programs-real', FIN_PACK_ID, 'programs', `# Programas Financeiro

- DRE Gerencial
- Caixa 30/60/90
- Separação Econômica`, {
        programs: [
          { id: 'fin-prog-1', key: 'dre', name: 'DRE Gerencial', description: 'Leitura por unidade e centro de custo', goals: ['Fechamento mensal por unidade', 'Rateios estabilizados'], status: 'active' },
          { id: 'fin-prog-2', key: 'caixa', name: 'Caixa 30/60/90', description: 'Previsibilidade de caixa e alertas', goals: ['Atualização mensal', 'Leitura executiva'], status: 'active' },
          { id: 'fin-prog-3', key: 'separacao', name: 'Separação Econômica', description: 'Aero × Techdengue com trilha auditável', goals: ['Separação formalizada', 'Base para transação'], status: 'planned' },
        ],
      }, 3),
      buildSection('sec-fin-governance-real', FIN_PACK_ID, 'governance', `# Governança Financeiro

- MBR financeiro
- Fechamento mensal executivo
- QBR econômico`, {
        rituals: [
          { id: 'fin-rit-1', type: 'MBR', name: 'MBR Financeiro', cadence: 'Mensal', participants: ['Financeiro', 'Direção'], last_meeting: '2026-02-28', next_meeting: '2026-03-31' },
          { id: 'fin-rit-2', type: 'QBR', name: 'QBR Econômico', cadence: 'Trimestral', participants: ['Financeiro', 'Direção Executiva'], last_meeting: '2025-12-20', next_meeting: '2026-03-25' },
        ],
      }, 4),
      buildSection('sec-fin-docs-real', FIN_PACK_ID, 'docs', `# Documentos Financeiro

Espaço para fechamentos mensais, DRE por unidade, leitura de caixa e decisões de alocação.`, {}, 5),
    ],
  },
]

mockStore.packs = realPackSeeds.map((seed) => seed.pack)
mockStore.sections = realPackSeeds.flatMap((seed) => seed.sections)
mockStore.attachments = []
mockStore.comments = []
mockStore.changelog = []
mockStore.references = []
mockStore.monthlyCloses = []

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function delay(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId(): string {
  return crypto.randomUUID()
}

function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// ============================================================
// PACK API
// ============================================================

export async function fetchPack(areaSlug: string, year: number): Promise<AreaStrategicPack | null> {
  await delay()
  console.info('[Mock API] fetchPack:', areaSlug, year)
  return mockStore.packs.find((p) => p.area_slug === areaSlug && p.year === year) || null
}

export async function fetchPackFull(areaSlug: string, year: number): Promise<PackFull | null> {
  await delay()
  console.info('[Mock API] fetchPackFull:', areaSlug, year)
  
  const pack = mockStore.packs.find((p) => p.area_slug === areaSlug && p.year === year)
  if (!pack) return null

  return {
    ...pack,
    sections: mockStore.sections.filter((s) => s.pack_id === pack.id).sort((a, b) => a.sort_order - b.sort_order),
    attachments: mockStore.attachments.filter((a) => a.pack_id === pack.id),
    comments: mockStore.comments.filter((c) => c.pack_id === pack.id),
    references: mockStore.references.filter((r) => r.pack_id === pack.id),
  }
}

export async function createPack(data: CreatePackData): Promise<AreaStrategicPack> {
  await delay()
  console.info('[Mock API] createPack:', data)

  const newPack: AreaStrategicPack = {
    id: generateId(),
    area_slug: data.area_slug,
    year: data.year,
    status: 'draft',
    version: '1.0',
    summary: data.summary || null,
    owners: data.owners || { headName: '' },
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }

  mockStore.packs.push(newPack)

  // Create default sections
  const sectionKeys: SectionKey[] = ['overview', 'diagnosis', 'objectives', 'programs', 'governance', 'docs']
  const sectionTitles: Record<SectionKey, string> = {
    overview: 'Visão Geral',
    diagnosis: 'Diagnóstico e Base',
    objectives: 'Objetivos e Metas',
    programs: 'Programas e Iniciativas',
    governance: 'Governança e Evidências',
    docs: 'Documentos',
  }

  sectionKeys.forEach((key, index) => {
    mockStore.sections.push({
      id: generateId(),
      pack_id: newPack.id,
      key,
      title: sectionTitles[key],
      body_markdown: null,
      structured_data: {},
      sort_order: index,
      updated_at: getCurrentTimestamp(),
      updated_by: null,
    })
  })

  // Log creation
  mockStore.changelog.push({
    id: generateId(),
    pack_id: newPack.id,
    actor: 'system',
    change_type: 'created',
    before: null,
    after: { status: 'draft', version: '1.0' },
    created_at: getCurrentTimestamp(),
  })

  return newPack
}

export async function updatePack(packId: string, data: UpdatePackData): Promise<AreaStrategicPack> {
  await delay()
  console.info('[Mock API] updatePack:', packId, data)

  const index = mockStore.packs.findIndex((p) => p.id === packId)
  if (index === -1) throw new Error('Pack not found')

  const before = { ...mockStore.packs[index] }
  const updated = {
    ...mockStore.packs[index],
    ...data,
    updated_at: getCurrentTimestamp(),
  }
  mockStore.packs[index] = updated

  // Log update
  mockStore.changelog.push({
    id: generateId(),
    pack_id: packId,
    actor: 'user',
    change_type: data.status ? 'status_changed' : 'updated',
    before: { status: before.status, version: before.version },
    after: { status: updated.status, version: updated.version },
    created_at: getCurrentTimestamp(),
  })

  return updated
}

// ============================================================
// SECTIONS API
// ============================================================

export async function fetchSections(packId: string): Promise<AreaPackSection[]> {
  await delay()
  console.info('[Mock API] fetchSections:', packId)
  return mockStore.sections.filter((s) => s.pack_id === packId).sort((a, b) => a.sort_order - b.sort_order)
}

export async function fetchSection(sectionId: string): Promise<AreaPackSection | null> {
  await delay()
  return mockStore.sections.find((s) => s.id === sectionId) || null
}

export async function updateSection(sectionId: string, data: UpdateSectionData, actor?: string): Promise<AreaPackSection> {
  await delay()
  console.info('[Mock API] updateSection:', sectionId, data)

  const index = mockStore.sections.findIndex((s) => s.id === sectionId)
  if (index === -1) throw new Error('Section not found')

  const section = mockStore.sections[index]
  const updated = {
    ...section,
    ...data,
    updated_at: getCurrentTimestamp(),
    updated_by: actor || null,
  }
  mockStore.sections[index] = updated

  // Log update
  mockStore.changelog.push({
    id: generateId(),
    pack_id: section.pack_id,
    actor: actor || 'user',
    change_type: 'section_updated',
    before: { section: section.key, title: section.title },
    after: { section: updated.key, title: updated.title },
    created_at: getCurrentTimestamp(),
  })

  return updated
}

export async function updateSectionStructuredData(
  sectionId: string, 
  patch: Record<string, unknown>, 
  actor?: string
): Promise<AreaPackSection> {
  await delay()
  console.info('[Mock API] updateSectionStructuredData:', sectionId, patch)

  const index = mockStore.sections.findIndex((s) => s.id === sectionId)
  if (index === -1) throw new Error('Section not found')

  const section = mockStore.sections[index]
  const mergedData = {
    ...(section.structured_data || {}),
    ...patch,
  }

  const updated = {
    ...section,
    structured_data: mergedData,
    updated_at: getCurrentTimestamp(),
    updated_by: actor || null,
  }
  mockStore.sections[index] = updated

  // Log update
  mockStore.changelog.push({
    id: generateId(),
    pack_id: section.pack_id,
    actor: actor || 'user',
    change_type: 'section_updated',
    before: { section: section.key, structured_data: 'previous' },
    after: { section: updated.key, structured_data: 'updated' },
    created_at: getCurrentTimestamp(),
  })

  return updated
}

// ============================================================
// ATTACHMENTS API
// ============================================================

export async function fetchAttachments(packId: string, sectionId?: string): Promise<PackAttachment[]> {
  await delay()
  console.info('[Mock API] fetchAttachments:', packId, sectionId)
  
  let attachments = mockStore.attachments.filter((a) => a.pack_id === packId)
  if (sectionId) {
    attachments = attachments.filter((a) => a.section_id === sectionId)
  }
  return attachments.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
}

export async function createAttachment(data: CreateAttachmentData, actor?: string): Promise<PackAttachment> {
  await delay()
  console.info('[Mock API] createAttachment:', data)

  const newAttachment: PackAttachment = {
    id: generateId(),
    pack_id: data.pack_id,
    section_id: data.section_id || null,
    filename: data.filename,
    content_type: data.content_type || null,
    storage_path: data.storage_path,
    file_size: data.file_size || null,
    tags: data.tags || [],
    version_label: data.version_label || 'v1',
    uploaded_by: actor || null,
    uploaded_at: getCurrentTimestamp(),
  }

  mockStore.attachments.push(newAttachment)

  // Log attachment
  mockStore.changelog.push({
    id: generateId(),
    pack_id: data.pack_id,
    actor: actor || 'user',
    change_type: 'attachment_added',
    before: null,
    after: { filename: data.filename, section_id: data.section_id },
    created_at: getCurrentTimestamp(),
  })

  return newAttachment
}

export async function deleteAttachment(attachmentId: string, actor?: string): Promise<void> {
  await delay()
  console.info('[Mock API] deleteAttachment:', attachmentId)

  const index = mockStore.attachments.findIndex((a) => a.id === attachmentId)
  if (index === -1) throw new Error('Attachment not found')

  const attachment = mockStore.attachments[index]
  mockStore.attachments.splice(index, 1)

  // Log removal
  mockStore.changelog.push({
    id: generateId(),
    pack_id: attachment.pack_id,
    actor: actor || 'user',
    change_type: 'attachment_removed',
    before: { filename: attachment.filename },
    after: null,
    created_at: getCurrentTimestamp(),
  })
}

// ============================================================
// COMMENTS API
// ============================================================

export async function fetchComments(packId: string, sectionId?: string): Promise<PackComment[]> {
  await delay()
  console.info('[Mock API] fetchComments:', packId, sectionId)
  
  let comments = mockStore.comments.filter((c) => c.pack_id === packId)
  if (sectionId) {
    comments = comments.filter((c) => c.section_id === sectionId)
  }
  return comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function createComment(data: CreateCommentData, actor: string): Promise<PackComment> {
  await delay()
  console.info('[Mock API] createComment:', data)

  const newComment: PackComment = {
    id: generateId(),
    pack_id: data.pack_id,
    section_id: data.section_id || null,
    author: actor,
    body: data.body,
    status: 'open',
    created_at: getCurrentTimestamp(),
  }

  mockStore.comments.push(newComment)

  // Log comment
  mockStore.changelog.push({
    id: generateId(),
    pack_id: data.pack_id,
    actor,
    change_type: 'comment_added',
    before: null,
    after: { section_id: data.section_id, body: data.body.substring(0, 50) },
    created_at: getCurrentTimestamp(),
  })

  return newComment
}

export async function resolveComment(commentId: string, actor: string): Promise<PackComment> {
  await delay()
  console.info('[Mock API] resolveComment:', commentId)

  const index = mockStore.comments.findIndex((c) => c.id === commentId)
  if (index === -1) throw new Error('Comment not found')

  const comment = mockStore.comments[index]
  const updated = {
    ...comment,
    status: 'resolved' as const,
    resolved_at: getCurrentTimestamp(),
    resolved_by: actor,
  }
  mockStore.comments[index] = updated

  // Log resolution
  mockStore.changelog.push({
    id: generateId(),
    pack_id: comment.pack_id,
    actor,
    change_type: 'comment_resolved',
    before: { status: 'open' },
    after: { status: 'resolved' },
    created_at: getCurrentTimestamp(),
  })

  return updated
}

// ============================================================
// CHANGELOG API
// ============================================================

export async function fetchChangelog(packId: string): Promise<PackChangeLog[]> {
  await delay()
  console.info('[Mock API] fetchChangelog:', packId)
  return mockStore.changelog
    .filter((l) => l.pack_id === packId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// ============================================================
// REFERENCES API
// ============================================================

export async function fetchReferences(packId: string): Promise<PackReference[]> {
  await delay()
  console.info('[Mock API] fetchReferences:', packId)
  return mockStore.references.filter((r) => r.pack_id === packId)
}
