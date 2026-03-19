import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn (class name merger)', () => {
  it('merges multiple class strings', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional classes via objects', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('handles arrays of classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })

  it('handles undefined/null/false gracefully', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b')
  })

  it('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })
})
