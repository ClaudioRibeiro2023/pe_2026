import { describe, it, expect } from 'vitest'
import { getErrorMessage } from '../errorUtils'

describe('getErrorMessage', () => {
  it('extracts message from Error instance', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('extracts message from TypeError', () => {
    expect(getErrorMessage(new TypeError('type fail'))).toBe('type fail')
  })

  it('returns the string itself when error is a string', () => {
    expect(getErrorMessage('plain string')).toBe('plain string')
  })

  it('extracts message from object with message property', () => {
    expect(getErrorMessage({ message: 'obj msg' })).toBe('obj msg')
  })

  it('returns fallback for object with non-string message', () => {
    expect(getErrorMessage({ message: 42 })).toBe('Erro desconhecido')
  })

  it('returns fallback for null', () => {
    expect(getErrorMessage(null)).toBe('Erro desconhecido')
  })

  it('returns fallback for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Erro desconhecido')
  })

  it('returns fallback for number', () => {
    expect(getErrorMessage(123)).toBe('Erro desconhecido')
  })

  it('returns fallback for empty object', () => {
    expect(getErrorMessage({})).toBe('Erro desconhecido')
  })

  it('returns fallback for boolean', () => {
    expect(getErrorMessage(true)).toBe('Erro desconhecido')
  })
})
