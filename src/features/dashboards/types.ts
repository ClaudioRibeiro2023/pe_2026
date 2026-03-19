export type WidgetType = 'chart' | 'stat' | 'table' | 'list' | 'progress' | 'gauge'
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar'

export interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  chartType?: ChartType
  dataSource?: string
  filters?: Record<string, unknown>
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  is_default: boolean
  is_shared: boolean
  owner_id: string
  widgets: WidgetConfig[]
  created_at: string
  updated_at: string
}

export interface DashboardView {
  id: string
  name: string
  filters: Record<string, unknown>
  columns?: string[]
  sort?: { field: string; direction: 'asc' | 'desc' }
  created_at: string
  updated_at: string
}
