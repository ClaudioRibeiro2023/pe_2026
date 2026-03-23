import type { BaseEntity } from '@/shared/types'

export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export type GoalStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export interface Goal extends BaseEntity {
  title: string
  description: string | null
  target_value: number
  current_value: number
  unit: string
  category: string
  period: GoalPeriod
  start_date: string
  end_date: string
  status: GoalStatus
  user_id: string | null
  is_canonical?: boolean
}

export interface GoalFormData {
  title: string
  description: string
  target_value: number
  current_value: number
  unit: string
  category: string
  period: GoalPeriod
  start_date: string
  end_date: string
  status: GoalStatus
}
