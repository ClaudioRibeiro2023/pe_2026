import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50 })
    )
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(5)
    expect(result.current.itemsPerPage).toBe(10)
    expect(result.current.startIndex).toBe(0)
    expect(result.current.endIndex).toBe(10)
  })

  it('respects custom itemsPerPage', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 25 })
    )
    expect(result.current.totalPages).toBe(2)
    expect(result.current.endIndex).toBe(25)
  })

  it('respects initialPage', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, initialPage: 3 })
    )
    expect(result.current.currentPage).toBe(3)
    expect(result.current.startIndex).toBe(20)
    expect(result.current.endIndex).toBe(30)
  })

  it('canGoNext and canGoPrevious are correct', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30 })
    )
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(false)

    act(() => result.current.nextPage())
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(true)

    act(() => result.current.goToPage(3))
    expect(result.current.canGoNext).toBe(false)
    expect(result.current.canGoPrevious).toBe(true)
  })

  it('goToPage clamps to valid range', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30 })
    )
    act(() => result.current.goToPage(100))
    expect(result.current.currentPage).toBe(3)

    act(() => result.current.goToPage(-1))
    expect(result.current.currentPage).toBe(1)
  })

  it('nextPage increments and previousPage decrements', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30 })
    )
    act(() => result.current.nextPage())
    expect(result.current.currentPage).toBe(2)

    act(() => result.current.previousPage())
    expect(result.current.currentPage).toBe(1)
  })

  it('handles zero totalItems', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0 })
    )
    expect(result.current.totalPages).toBe(0)
    expect(result.current.canGoNext).toBe(false)
  })

  it('paginationRange includes first and last page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100 })
    )
    const range = result.current.paginationRange
    expect(range[0]).toBe(1)
    expect(range[range.length - 1]).toBe(10)
  })

  it('paginationRange includes ellipsis for large page counts', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, initialPage: 5 })
    )
    expect(result.current.paginationRange).toContain('...')
  })
})
