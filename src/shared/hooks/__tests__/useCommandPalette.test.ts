import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommandPalette } from '../useCommandPalette'

describe('useCommandPalette', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useCommandPalette())
    expect(result.current.open).toBe(false)
  })

  it('toggle opens and closes', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => result.current.toggle())
    expect(result.current.open).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.open).toBe(false)
  })

  it('close sets open to false', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => result.current.setOpen(true))
    expect(result.current.open).toBe(true)

    act(() => result.current.close())
    expect(result.current.open).toBe(false)
  })

  it('setOpen can set to true', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => result.current.setOpen(true))
    expect(result.current.open).toBe(true)
  })

  it('Ctrl+K toggles open state', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    })
    expect(result.current.open).toBe(true)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    })
    expect(result.current.open).toBe(false)
  })

  it('Meta+K toggles open state', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    })
    expect(result.current.open).toBe(true)
  })

  it('regular K key does not toggle', () => {
    const { result } = renderHook(() => useCommandPalette())

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }))
    })
    expect(result.current.open).toBe(false)
  })
})
