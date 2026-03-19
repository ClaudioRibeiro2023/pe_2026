import { describe, it, expect } from 'vitest'
import { env } from '../env'

describe('env config', () => {
  it('exports an env object', () => {
    expect(env).toBeDefined()
    expect(typeof env).toBe('object')
  })

  it('has appName with a default value', () => {
    expect(env.appName).toBeTruthy()
    expect(typeof env.appName).toBe('string')
  })

  it('has appVersion with a default value', () => {
    expect(env.appVersion).toBeTruthy()
    expect(typeof env.appVersion).toBe('string')
  })

  it('has isDev boolean', () => {
    expect(typeof env.isDev).toBe('boolean')
  })

  it('has isProd boolean', () => {
    expect(typeof env.isProd).toBe('boolean')
  })

  it('isDev and isProd are mutually exclusive in test mode', () => {
    // In test mode, one should be true and the other false (or both false in some configs)
    expect(env.isDev === true && env.isProd === true).toBe(false)
  })
})
