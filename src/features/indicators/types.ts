import type { BaseEntity } from '@/shared/types'

export type IndicatorTrend = 'up' | 'down' | 'stable'

export interface Indicator extends BaseEntity {
  name: string
  description: string | null
  value: number
  previous_value: number | null
  unit: string
  category: string
  trend: IndicatorTrend | null
  date: string
  user_id: string | null
  is_canonical?: boolean
}

export interface IndicatorFormData {
  name: string
  description: string
  value: number
  previous_value: number
  unit: string
  category: string
  trend: IndicatorTrend
  date: string
}
