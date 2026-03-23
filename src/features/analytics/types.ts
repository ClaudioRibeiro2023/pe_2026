export interface Insight {
  id: string
  title: string
  description: string
  type: 'trend' | 'anomaly' | 'recommendation' | 'alert'
  severity: 'low' | 'medium' | 'high'
  source: string
  metric?: string
  value?: number
  change?: number
  created_at: string
}

export interface Forecast {
  id: string
  metric: string
  current_value: number
  predicted_value: number
  confidence: number
  period: string
  trend: 'up' | 'down' | 'stable'
  factors: string[]
}

export interface DataHealthMetric {
  id: string
  name: string
  completeness: number
  accuracy: number
  timeliness: number
  consistency: number
  overall_score: number
  last_updated: string
  issues: string[]
}

export interface ModuleStatus {
  module: string
  enabled: boolean
  source: string
  updated_at: string | null
  label?: string
}

export interface BenchmarkData {
  id: string
  metric: string
  internal_value: number
  industry_average: number
  best_in_class: number
  percentile: number
}
