// Sistema de Monitoramento de Performance
import { useRef, useEffect } from 'react'
interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: number
  context?: string
}

interface PerformanceThreshold {
  name: string
  warning: number
  critical: number
  unit: 'ms' | 'bytes' | 'count'
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private thresholds: PerformanceThreshold[] = [
    { name: 'page_load', warning: 2000, critical: 3000, unit: 'ms' },
    { name: 'api_response', warning: 300, critical: 600, unit: 'ms' },
    { name: 'component_render', warning: 100, critical: 200, unit: 'ms' },
    { name: 'bundle_size', warning: 500000, critical: 800000, unit: 'bytes' },
    { name: 'query_time', warning: 200, critical: 400, unit: 'ms' },
  ]

  // Registra uma métrica de performance
  recordMetric(name: string, value: number, unit: 'ms' | 'bytes' | 'count', context?: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context,
    }

    this.metrics.push(metric)
    
    // Verifica thresholds
    this.checkThresholds(metric)
    
    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value}${unit} ${context ? `(${context})` : ''}`)
    }
  }

  // Verifica se a métrica excede os thresholds
  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.find(t => t.name === metric.name)
    if (!threshold) return

    if (metric.value > threshold.critical) {
      console.error(`🚨 CRITICAL: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${threshold.critical}${threshold.unit})`)
    } else if (metric.value > threshold.warning) {
      console.warn(`⚠️ WARNING: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${threshold.warning}${threshold.unit})`)
    }
  }

  // Obtém métricas por nome
  getMetrics(name?: string): PerformanceMetric[] {
    if (!name) return this.metrics
    return this.metrics.filter(m => m.name === name)
  }

  // Calcula estatísticas
  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null

    const values = metrics.map(m => m.value)
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    }
  }

  // Limpa métricas antigas (mantém últimas 100)
  cleanup() {
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  // Exporta relatório de performance
  exportReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      thresholds: this.thresholds,
      metrics: this.metrics.reduce((acc, metric) => {
        if (!acc[metric.name]) {
          acc[metric.name] = []
        }
        acc[metric.name].push(metric)
        return acc
      }, {} as Record<string, PerformanceMetric[]>),
      stats: Object.keys(this.metrics.reduce((acc, m) => ({ ...acc, [m.name]: true }), {}))
        .map(name => ({ name, stats: this.getStats(name) }))
        .filter(item => item.stats !== null),
    }

    return JSON.stringify(report, null, 2)
  }
}

// Instância global
export const performanceMonitor = new PerformanceMonitor()

// Utilitários para medição
export function measureTime<T>(name: string, fn: () => T, context?: string): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  performanceMonitor.recordMetric(name, end - start, 'ms', context)
  return result
}

export async function measureTimeAsync<T>(
  name: string, 
  fn: () => Promise<T>, 
  context?: string
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  performanceMonitor.recordMetric(name, end - start, 'ms', context)
  return result
}

// Hook React para medição de performance de componentes
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    const endTime = Date.now()
    performanceMonitor.recordMetric(
      'component_render',
      endTime - startTime.current,
      'ms',
      componentName
    )
  }, [componentName])

  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getStats: performanceMonitor.getStats.bind(performanceMonitor),
  }
}
