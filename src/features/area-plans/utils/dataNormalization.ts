import type { PlanAction } from '../types'

/**
 * Utilitário para normalizar dados de ações vindos da API
 * Garante compatibilidade entre diferentes formatos de retorno
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeActionsData(data: any): PlanAction[] {
  if (!data) return []
  
  // Se já é um array, retorna como está
  if (Array.isArray(data)) {
    return data
  }
  
  // Se é um objeto com propriedade data, extrai o array
  if (data && typeof data === 'object' && 'data' in data) {
    return Array.isArray(data.data) ? data.data : []
  }
  
  // Caso contrário, retorna array vazio
  return []
}

/**
 * Obtém o total de itens de diferentes formatos de resposta
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTotalItems(data: any): number {
  if (!data) return 0
  
  if (typeof data === 'object' && 'total' in data) {
    return data.total || 0
  }
  
  if (Array.isArray(data)) {
    return data.length
  }
  
  return 0
}
