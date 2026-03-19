import { useEffect, useRef, useState, useMemo } from 'react'
import { Loader } from './Loader'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  loading?: boolean
  emptyMessage?: string
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  loading = false,
  emptyMessage = 'Nenhum item encontrado'
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Calcula quais itens estão visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  // Itens visíveis
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  // Altura total do conteúdo
  const totalHeight = items.length * itemHeight

  // Handler de scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Se está carregando, mostra loader
  if (loading) {
    return (
      <div 
        className={className}
        style={{ height: containerHeight }}
      >
        <div className="flex items-center justify-center h-full">
          <Loader size="md" text="Carregando..." />
        </div>
      </div>
    )
  }

  // Se não há itens, mostra mensagem
  if (items.length === 0) {
    return (
      <div 
        className={className}
        style={{ height: containerHeight }}
      >
        <div className="flex items-center justify-center h-full text-muted">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.startIndex + index
          const top = actualIndex * itemHeight

          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Hook para detectar quando usar virtualização
// eslint-disable-next-line react-refresh/only-export-components
export function useVirtualizationThreshold(itemCount: number, threshold = 50) {
  const [shouldVirtualize, setShouldVirtualize] = useState(false)

  useEffect(() => {
    setShouldVirtualize(itemCount > threshold)
  }, [itemCount, threshold])

  return shouldVirtualize
}
