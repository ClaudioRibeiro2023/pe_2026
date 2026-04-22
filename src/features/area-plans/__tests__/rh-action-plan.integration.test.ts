/**
 * Testes de Integração: Plano de Ação RH
 * 
 * Este arquivo contém testes para validar que os dados do plano de ação
 * do RH foram corretamente integrados ao sistema.
 */

import { describe, it, expect } from 'vitest'
import { supabase } from '@/shared/lib/supabaseClient'

describe('Integração Plano de Ação RH', () => {
  describe('INITs Setoriais do RH', () => {
    it('deve ter 6 iniciativas setoriais do RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(6)
    })

    it('deve ter INIT-RH-301 (Pesquisa de engajamento)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-301')
        .single()
      
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.title).toContain('engajamento')
      expect(data.priority).toBe('P0')
    })

    it('deve ter INIT-RH-302 (Indicadores de turnover)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-302')
        .single()
      
      expect(error).toBeNull()
      expect(data.type).toBe('SIS')
      expect(data.priority).toBe('P0')
    })

    it('deve ter INIT-RH-303 (Processo seletivo)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-303')
        .single()
      
      expect(error).toBeNull()
      expect(data.type).toBe('MET')
      expect(data.priority).toBe('P0')
    })

    it('deve ter INIT-RH-304 (Programa de reconhecimento)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-304')
        .single()
      
      expect(error).toBeNull()
      expect(data.priority).toBe('P1')
      expect(data.budget_allocated).toBeGreaterThan(0)
    })

    it('deve ter INIT-RH-305 (People Analytics)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-305')
        .single()
      
      expect(error).toBeNull()
      expect(data.type).toBe('SIS')
      expect(data.kr_code).toBe('P5.1')
    })

    it('deve ter INIT-RH-306 (Desenvolvimento de lideranças)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-RH-306')
        .single()
      
      expect(error).toBeNull()
      expect(data.effort).toBe('ALTO')
    })
  })

  describe('Vinculação correta à área RH', () => {
    it('todas as INITs RH devem estar vinculadas à área RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, area_id')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(6)
      
      // Todas devem ter area_id preenchido
      data?.forEach(init => {
        expect(init.area_id).toBeDefined()
        expect(init.area_id).not.toBeNull()
      })
    })
  })

  describe('Vinculação a Pilares e OKRs', () => {
    it('todas as INITs RH devem estar no Pilar P5 (Pessoas)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, pillar_id')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      
      // Busca o ID do P5
      const { data: pillar } = await supabase
        .from('pillars')
        .select('id')
        .eq('code', 'P5')
        .single()
      
      data?.forEach(init => {
        expect(init.pillar_id).toBe(pillar?.id)
      })
    })

    it('todas as INITs RH devem estar vinculadas ao OKR-P5', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, okr_code')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      
      data?.forEach(init => {
        expect(init.okr_code).toBe('OKR-P5')
      })
    })
  })

  describe('Distribuição de Prioridades', () => {
    it('deve ter 3 iniciativas P0 no RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-RH-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(3)
    })

    it('deve ter 3 iniciativas P1 no RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-RH-%')
        .eq('priority', 'P1')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(3)
    })
  })

  describe('Evidências associadas', () => {
    it('deve ter 6 evidências do RH', async () => {
      const { data, error } = await supabase
        .from('evidences')
        .select('*')
        .like('code', 'EVID-RH-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(6)
    })

    it('cada INIT RH deve ter uma evidência correspondente', async () => {
      const { data: inits, error: initError } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-RH-%')
      
      expect(initError).toBeNull()
      
      for (const init of inits || []) {
        const evidenceCode = init.code.replace('INIT', 'EVID')
        const { data: evidence } = await supabase
          .from('evidences')
          .select('code')
          .eq('code', evidenceCode)
          .single()
        
        expect(evidence).toBeDefined()
        expect(evidence?.code).toBe(evidenceCode)
      }
    })
  })

  describe('Orçamento', () => {
    it('deve ter orçamento alocado para todas as iniciativas', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, budget_allocated')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      
      data?.forEach(init => {
        expect(init.budget_allocated).toBeGreaterThan(0)
      })
    })

    it('orçamento total deve estar próximo de R$ 78.000', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('budget_allocated')
        .like('code', 'INIT-RH-%')
      
      expect(error).toBeNull()
      
      const total = data?.reduce((sum, init) => sum + (init.budget_allocated || 0), 0)
      expect(total).toBeGreaterThan(70000)
      expect(total).toBeLessThan(85000)
    })
  })

  describe('INITs Corporativas do RH', () => {
    it('INIT-009 deve estar vinculada ao RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, area_id, title')
        .eq('code', 'INIT-009')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('posições-chave')
      expect(data?.area_id).toBeDefined()
    })

    it('INIT-010 deve estar vinculada ao RH', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, area_id, title')
        .eq('code', 'INIT-010')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('Onboarding')
      expect(data?.area_id).toBeDefined()
    })
  })
})

describe('Plano de Ação RH - Metadados', () => {
  it('deve ter registro na tabela area_plans', async () => {
    const { data, error } = await supabase
      .from('area_plans')
      .select('*')
      .eq('area_id', 'a1000000-0000-0000-0000-000000000001')
      .single()
    
    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data?.total_initiatives).toBeGreaterThanOrEqual(11)  // 5 corp + 6 set
  })
})
