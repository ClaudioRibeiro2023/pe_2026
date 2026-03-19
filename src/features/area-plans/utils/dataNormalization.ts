import type { PlanAction } from '../types'

/**
 * Utilitário para normalizar dados de ações vindos da API
 * Garante compatibilidade entre diferentes formatos de retorno
 */
export function normalizeActionsData(data: unknown): PlanAction[] {
  if (!data) return []
  
  // Se já é um array, retorna como está
  if (Array.isArray(data)) {
    return data
  }
  
  // Se é um objeto com propriedade data, extrai o array
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as { data: unknown }).data
    return Array.isArray(inner) ? inner : []
  }
  
  // Caso contrário, retorna array vazio
  return []
}

/**
 * Obtém o total de itens de diferentes formatos de resposta
 */
export function getTotalItems(data: unknown): number {
  if (!data) return 0
  
  if (data && typeof data === 'object' && 'total' in data) {
    return (data as { total: number }).total || 0
  }
  
  if (Array.isArray(data)) {
    return data.length
  }
  
  return 0
}
