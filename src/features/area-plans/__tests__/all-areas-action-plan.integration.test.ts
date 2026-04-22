/**
 * Testes de Integração: Planos de Ação - Todas as Áreas
 * 
 * Valida que todas as INITs setoriais foram corretamente importadas
 * para Marketing, P&D, Operação, CS, Comercial e Financeiro.
 */

import { describe, it, expect } from 'vitest'
import { supabase } from '@/shared/lib/supabaseClient'

describe('Integração Planos de Ação - Todas as Áreas', () => {
  
  describe('Marketing (INIT-MKT-*)', () => {
    it('deve ter 7 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-MKT-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(7)
    })

    it('deve ter INIT-MKT-101 (Plano de comunicação)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-MKT-101')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('comunicação')
      expect(data?.priority).toBe('P0')
      expect(data?.type).toBe('MET')
    })

    it('deve ter 4 iniciativas P0', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-MKT-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(4)
    })

    it('deve estar vinculada à área Marketing', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('area_id')
        .like('code', 'INIT-MKT-%')
        .limit(1)
        .single()
      
      expect(error).toBeNull()
      expect(data?.area_id).toBe('a1000000-0000-0000-0000-000000000002')
    })
  })

  describe('P&D (INIT-PD-*)', () => {
    it('deve ter 6 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-PD-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(6)
    })

    it('deve ter INIT-PD-251 (Arquitetura de dados)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-PD-251')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('Arquitetura')
      expect(data?.priority).toBe('P0')
      expect(data?.type).toBe('SIS')
    })

    it('deve ter 3 iniciativas P0', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-PD-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(3)
    })

    it('todas devem estar no Pilar P4 (Produto/Dados/IA)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('pillar_id')
        .like('code', 'INIT-PD-%')
      
      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThan(0)
      
      data?.forEach(init => {
        expect(init.pillar_id).toBe('b1000000-0000-0000-0000-000000000004')
      })
    })
  })

  describe('Operação (INIT-OP-*)', () => {
    it('deve ter 8 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-OP-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(8)
    })

    it('deve ter INIT-OP-151 (Agenda Q1)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-OP-151')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('planejamento semanal')
      expect(data?.priority).toBe('P0')
    })

    it('deve ter 5 iniciativas P0', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-OP-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(5)
    })

    it('todas devem estar no Pilar P3 (Excelência Operacional)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('pillar_id')
        .like('code', 'INIT-OP-%')
      
      expect(error).toBeNull()
      
      data?.forEach(init => {
        expect(init.pillar_id).toBe('b1000000-0000-0000-0000-000000000003')
      })
    })
  })

  describe('CS (INIT-CS-*)', () => {
    it('deve ter 8 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-CS-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(8)
    })

    it('deve ter INIT-CS-201 (Pareto Top-14)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-CS-201')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('Pareto')
      expect(data?.priority).toBe('P0')
    })

    it('deve ter 5 iniciativas P0', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-CS-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(5)
    })
  })

  describe('Comercial (INIT-COM-*)', () => {
    it('deve ter 5 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-COM-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(5)
    })

    it('deve ter INIT-COM-401 (Processos comerciais)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-COM-401')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('processos comerciais')
      expect(data?.priority).toBe('P1')
    })

    it('não deve ter iniciativas P0 (área em criação)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-COM-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(0)
    })
  })

  describe('Financeiro (INIT-FIN-*)', () => {
    it('deve ter 8 iniciativas setoriais', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-FIN-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(8)
    })

    it('deve ter INIT-FIN-351 (DRE gerencial)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('code', 'INIT-FIN-351')
        .single()
      
      expect(error).toBeNull()
      expect(data?.title).toContain('DRE gerencial')
      expect(data?.priority).toBe('P0')
    })

    it('deve ter 5 iniciativas P0', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .like('code', 'INIT-FIN-%')
        .eq('priority', 'P0')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(5)
    })

    it('todas devem estar no Pilar P1 (Governança)', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('pillar_id')
        .like('code', 'INIT-FIN-%')
      
      expect(error).toBeNull()
      
      data?.forEach(init => {
        expect(init.pillar_id).toBe('b1000000-0000-0000-0000-000000000001')
      })
    })
  })

  describe('Resumo Consolidado', () => {
    it('deve ter exatamente 48 iniciativas setoriais no total', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code')
        .or('code.like.INIT-MKT-%,code.like.INIT-PD-%,code.like.INIT-OP-%,code.like.INIT-CS-%,code.like.INIT-COM-%,code.like.INIT-FIN-%')
      
      expect(error).toBeNull()
      expect(data).toHaveLength(48)
    })

    it('todas as iniciativas setoriais devem ter área vinculada', async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('code, area_id')
        .or('code.like.INIT-MKT-%,code.like.INIT-PD-%,code.like.INIT-OP-%,code.like.INIT-CS-%,code.like.INIT-COM-%,code.like.INIT-FIN-%')
      
      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThan(0)
      
      data?.forEach(init => {
        expect(init.area_id).toBeDefined()
        expect(init.area_id).not.toBeNull()
      })
    })

    it('deve ter orçamento alocado para todas as áreas', async () => {
      const areas = [
        'a1000000-0000-0000-0000-000000000002', // Marketing
        'a1000000-0000-0000-0000-000000000003', // P&D
        'a1000000-0000-0000-0000-000000000004', // Operação
        'a1000000-0000-0000-0000-000000000005', // CS
        'a1000000-0000-0000-0000-000000000006', // Comercial
        'a1000000-0000-0000-0000-000000000007', // Financeiro
      ]

      for (const areaId of areas) {
        const { data, error } = await supabase
          .from('area_plans')
          .select('budget_allocated')
          .eq('area_id', areaId)
          .single()
        
        expect(error).toBeNull()
        expect(data?.budget_allocated).toBeGreaterThan(0)
      }
    })
  })
})
