import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call action when correct key combination is pressed', () => {
    const mockAction = vi.fn()
    const shortcuts = [
      {
        key: 'k',
        ctrl: true,
        description: 'Test shortcut',
        action: mockAction,
      },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    })
    window.dispatchEvent(event)

    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('should not call action when wrong key is pressed', () => {
    const mockAction = vi.fn()
    const shortcuts = [
      {
        key: 'k',
        ctrl: true,
        description: 'Test shortcut',
        action: mockAction,
      },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    const event = new KeyboardEvent('keydown', {
      key: 'j',
      ctrlKey: true,
    })
    window.dispatchEvent(event)

    expect(mockAction).not.toHaveBeenCalled()
  })

  it('should handle multiple shortcuts', () => {
    const mockAction1 = vi.fn()
    const mockAction2 = vi.fn()
    const shortcuts = [
      {
        key: 'k',
        ctrl: true,
        description: 'Shortcut 1',
        action: mockAction1,
      },
      {
        key: 'g',
        ctrl: true,
        description: 'Shortcut 2',
        action: mockAction2,
      },
    ]

    renderHook(() => useKeyboardShortcuts(shortcuts))

    const event1 = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    })
    window.dispatchEvent(event1)

    const event2 = new KeyboardEvent('keydown', {
      key: 'g',
      ctrlKey: true,
    })
    window.dispatchEvent(event2)

    expect(mockAction1).toHaveBeenCalledTimes(1)
    expect(mockAction2).toHaveBeenCalledTimes(1)
  })

  it('should cleanup event listeners on unmount', () => {
    const mockAction = vi.fn()
    const shortcuts = [
      {
        key: 'k',
        ctrl: true,
        description: 'Test shortcut',
        action: mockAction,
      },
    ]

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts))

    unmount()

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    })
    window.dispatchEvent(event)

    expect(mockAction).not.toHaveBeenCalled()
  })
})
