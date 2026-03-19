import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilters } from '../useFilters'

interface Item {
  id: number
  name: string
  category: string
}

const mockData: Item[] = [
  { id: 1, name: 'Alpha Widget', category: 'A' },
  { id: 2, name: 'Beta Gadget', category: 'B' },
  { id: 3, name: 'Gamma Widget', category: 'A' },
  { id: 4, name: 'Delta Device', category: 'C' },
]

describe('useFilters', () => {
  it('returns all data when no search or filters applied', () => {
    const { result } = renderHook(() =>
      useFilters({ data: mockData, searchFields: ['name'] })
    )
    expect(result.current.filteredData).toHaveLength(4)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('filters by search query', () => {
    const { result } = renderHook(() =>
      useFilters({ data: mockData, searchFields: ['name'] })
    )
    act(() => result.current.setSearchQuery('widget'))
    expect(result.current.filteredData).toHaveLength(2)
    expect(result.current.filteredData.map(d => d.id)).toEqual([1, 3])
  })

  it('search is case-insensitive', () => {
    const { result } = renderHook(() =>
      useFilters({ data: mockData, searchFields: ['name'] })
    )
    act(() => result.current.setSearchQuery('GADGET'))
    expect(result.current.filteredData).toHaveLength(1)
    expect(result.current.filteredData[0].name).toBe('Beta Gadget')
  })

  it('searches across multiple fields', () => {
    const { result } = renderHook(() =>
      useFilters({ data: mockData, searchFields: ['name', 'category'] })
    )
    act(() => result.current.setSearchQuery('C'))
    // Matches: category 'C' (Delta Device)
    expect(result.current.filteredData.length).toBeGreaterThanOrEqual(1)
  })

  it('applies custom filterFn', () => {
    const { result } = renderHook(() =>
      useFilters({
        data: mockData,
        searchFields: ['name'],
        filterFn: (item, filters) =>
          !filters.category || item.category === filters.category,
      })
    )
    act(() => result.current.setFilter('category', 'A'))
    expect(result.current.filteredData).toHaveLength(2)
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() =>
      useFilters({
        data: mockData,
        searchFields: ['name'],
        filterFn: (item, filters) =>
          !filters.category || item.category === filters.category,
      })
    )
    act(() => {
      result.current.setSearchQuery('widget')
      result.current.setFilter('category', 'A')
    })
    expect(result.current.hasActiveFilters).toBe(true)

    act(() => result.current.clearFilters())
    expect(result.current.filteredData).toHaveLength(4)
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.searchQuery).toBe('')
  })

  it('setFilter with empty value removes the filter key', () => {
    const { result } = renderHook(() =>
      useFilters({
        data: mockData,
        searchFields: ['name'],
        filterFn: (item, filters) =>
          !filters.category || item.category === filters.category,
      })
    )
    act(() => result.current.setFilter('category', 'A'))
    expect(result.current.filters).toHaveProperty('category', 'A')

    act(() => result.current.setFilter('category', ''))
    expect(result.current.filters).not.toHaveProperty('category')
  })

  it('returns empty when search matches nothing', () => {
    const { result } = renderHook(() =>
      useFilters({ data: mockData, searchFields: ['name'] })
    )
    act(() => result.current.setSearchQuery('zzz-nonexistent'))
    expect(result.current.filteredData).toHaveLength(0)
  })
})
