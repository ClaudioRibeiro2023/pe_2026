import { describe, it, expect, vi, beforeEach } from 'vitest'
import { performanceMonitor, measureTime, measureTimeAsync } from '../performanceMonitor'

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    // Clear metrics between tests by recording fresh ones
    // The cleanup method keeps last 100, so we work within limits
  })

  it('recordMetric stores a metric', () => {
    performanceMonitor.recordMetric('test_metric', 50, 'ms', 'test')
    const metrics = performanceMonitor.getMetrics('test_metric')
    expect(metrics.length).toBeGreaterThanOrEqual(1)
    const last = metrics[metrics.length - 1]
    expect(last.name).toBe('test_metric')
    expect(last.value).toBe(50)
    expect(last.unit).toBe('ms')
    expect(last.context).toBe('test')
  })

  it('getMetrics returns all metrics when no name given', () => {
    performanceMonitor.recordMetric('metric_a', 10, 'ms')
    performanceMonitor.recordMetric('metric_b', 20, 'count')
    const all = performanceMonitor.getMetrics()
    expect(all.length).toBeGreaterThanOrEqual(2)
  })

  it('getMetrics filters by name', () => {
    performanceMonitor.recordMetric('unique_filter_test', 99, 'bytes')
    const filtered = performanceMonitor.getMetrics('unique_filter_test')
    expect(filtered.every(m => m.name === 'unique_filter_test')).toBe(true)
  })

  it('getStats returns correct statistics', () => {
    performanceMonitor.recordMetric('stats_test', 10, 'ms')
    performanceMonitor.recordMetric('stats_test', 20, 'ms')
    performanceMonitor.recordMetric('stats_test', 30, 'ms')
    const stats = performanceMonitor.getStats('stats_test')
    expect(stats).not.toBeNull()
    expect(stats!.count).toBeGreaterThanOrEqual(3)
    expect(stats!.min).toBeLessThanOrEqual(10)
    expect(stats!.max).toBeGreaterThanOrEqual(30)
  })

  it('getStats returns null for unknown metric', () => {
    const stats = performanceMonitor.getStats('nonexistent_xyz_123')
    expect(stats).toBeNull()
  })

  it('cleanup keeps at most 100 metrics', () => {
    for (let i = 0; i < 110; i++) {
      performanceMonitor.recordMetric('cleanup_test', i, 'count')
    }
    performanceMonitor.cleanup()
    const all = performanceMonitor.getMetrics()
    expect(all.length).toBeLessThanOrEqual(100)
  })

  it('exportReport returns valid JSON', () => {
    performanceMonitor.recordMetric('export_test', 42, 'ms')
    const report = performanceMonitor.exportReport()
    const parsed = JSON.parse(report)
    expect(parsed).toHaveProperty('timestamp')
    expect(parsed).toHaveProperty('thresholds')
    expect(parsed).toHaveProperty('metrics')
    expect(parsed).toHaveProperty('stats')
  })

  it('logs warning when metric exceeds warning threshold', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    performanceMonitor.recordMetric('api_response', 350, 'ms')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('logs error when metric exceeds critical threshold', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    performanceMonitor.recordMetric('api_response', 700, 'ms')
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})

describe('measureTime', () => {
  it('returns the function result', () => {
    const result = measureTime('sync_test', () => 42)
    expect(result).toBe(42)
  })

  it('records a metric for the measurement', () => {
    measureTime('sync_measure', () => 'done')
    const metrics = performanceMonitor.getMetrics('sync_measure')
    expect(metrics.length).toBeGreaterThanOrEqual(1)
  })
})

describe('measureTimeAsync', () => {
  it('returns the async function result', async () => {
    const result = await measureTimeAsync('async_test', async () => 'async-result')
    expect(result).toBe('async-result')
  })

  it('records a metric for async measurement', async () => {
    await measureTimeAsync('async_measure', async () => {
      return new Promise(resolve => setTimeout(resolve, 10))
    })
    const metrics = performanceMonitor.getMetrics('async_measure')
    expect(metrics.length).toBeGreaterThanOrEqual(1)
  })
})
