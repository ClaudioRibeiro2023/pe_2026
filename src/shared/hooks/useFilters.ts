import { useState, useMemo } from 'react'

interface UseFiltersOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  filterFn?: (item: T, filters: Record<string, string>) => boolean
}

export function useFilters<T>({ data, searchFields, filterFn }: UseFiltersOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredData = useMemo(() => {
    let result = data

    // Aplicar busca
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (normalizedQuery) {
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return String(value).toLowerCase().includes(normalizedQuery)
        })
      )
    }

    // Aplicar filtros customizados
    if (filterFn) {
      result = result.filter((item) => filterFn(item, filters))
    }

    return result
  }, [data, searchQuery, filters, searchFields, filterFn])

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => {
      if (!value) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: value }
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({})
  }

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
    hasActiveFilters:
      searchQuery.trim() !== '' || Object.values(filters).some((value) => Boolean(value)),
  }
}
