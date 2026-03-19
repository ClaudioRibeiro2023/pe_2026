import { describe, it, expect } from 'vitest'
import { normalizeActionsData, getTotalItems } from '../dataNormalization'

describe('normalizeActionsData', () => {
  it('returns empty array for null', () => {
    expect(normalizeActionsData(null)).toEqual([])
  })

  it('returns empty array for undefined', () => {
    expect(normalizeActionsData(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(normalizeActionsData('')).toEqual([])
  })

  it('returns the array as-is when data is already an array', () => {
    const actions = [{ id: '1', title: 'A' }, { id: '2', title: 'B' }]
    expect(normalizeActionsData(actions)).toBe(actions)
  })

  it('extracts .data property when data is a wrapper object', () => {
    const inner = [{ id: '1' }]
    expect(normalizeActionsData({ data: inner })).toBe(inner)
  })

  it('returns empty array when .data property is not an array', () => {
    expect(normalizeActionsData({ data: 'not-array' })).toEqual([])
  })

  it('returns empty array for a plain object without .data', () => {
    expect(normalizeActionsData({ foo: 'bar' })).toEqual([])
  })

  it('returns empty array for number', () => {
    expect(normalizeActionsData(42)).toEqual([])
  })
})

describe('getTotalItems', () => {
  it('returns 0 for null', () => {
    expect(getTotalItems(null)).toBe(0)
  })

  it('returns 0 for undefined', () => {
    expect(getTotalItems(undefined)).toBe(0)
  })

  it('returns total from object with total property', () => {
    expect(getTotalItems({ total: 42 })).toBe(42)
  })

  it('returns 0 when total is 0', () => {
    expect(getTotalItems({ total: 0 })).toBe(0)
  })

  it('returns array length for arrays', () => {
    expect(getTotalItems([1, 2, 3])).toBe(3)
  })

  it('returns 0 for empty array', () => {
    expect(getTotalItems([])).toBe(0)
  })

  it('returns 0 for number', () => {
    expect(getTotalItems(99)).toBe(0)
  })

  it('returns 0 for string', () => {
    expect(getTotalItems('hello')).toBe(0)
  })

  it('prefers total property over array check', () => {
    // Object with both total and array-like won't hit array branch
    expect(getTotalItems({ total: 10, length: 5 })).toBe(10)
  })
})
