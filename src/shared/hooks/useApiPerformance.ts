import { useCallback } from 'react'
import { performanceMonitor } from '@/shared/lib/performanceMonitor'

interface ApiPerformanceOptions {
  apiName: string
  context?: string
  enableLogging?: boolean
}

export function useApiPerformance({ apiName, context, enableLogging = true }: ApiPerformanceOptions) {
  
  const measureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    customContext?: string
  ): Promise<T> => {
    const finalContext = customContext || context || apiName
    
    if (enableLogging) {
      console.log(`🔄 Calling API: ${apiName} (${finalContext})`)
    }

    try {
      const start = performance.now()
      const result = await apiCall()
      const end = performance.now()
      
      performanceMonitor.recordMetric('api_response', end - start, 'ms', finalContext)

      if (enableLogging) {
        console.log(`✅ API Success: ${apiName} (${finalContext})`)
      }

      return result
    } catch (error) {
      if (enableLogging) {
        console.error(`❌ API Error: ${apiName} (${finalContext})`, error)
      }
      throw error
    }
  }, [apiName, context, enableLogging])

  const measureQueryTime = useCallback((
    queryName: string,
    startTime: number,
    endTime: number,
    recordCount?: number
  ) => {
    const duration = endTime - startTime
    const finalContext = `${queryName}${recordCount ? ` (${recordCount} records)` : ''}`
    
    performanceMonitor.recordMetric('query_time', duration, 'ms', finalContext)
    
    if (recordCount) {
      performanceMonitor.recordMetric('query_result_count', recordCount, 'count', queryName)
    }

    if (enableLogging) {
      console.log(`📊 Query: ${queryName} - ${duration.toFixed(2)}ms${recordCount ? ` - ${recordCount} records` : ''}`)
    }
  }, [enableLogging])

  return {
    measureApiCall,
    measureQueryTime,
    getStats: performanceMonitor.getStats.bind(performanceMonitor),
  }
}
