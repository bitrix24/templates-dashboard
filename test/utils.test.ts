import { describe, it, expect } from 'vitest'
import { randomInt, randomFrom, sleepAction } from '../app/utils'

describe('randomInt', () => {
  it('stays within the inclusive range', () => {
    for (let i = 0; i < 100; i++) {
      const value = randomInt(1, 5)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(5)
    }
  })

  it('returns the bound when min === max', () => {
    expect(randomInt(3, 3)).toBe(3)
  })
})

describe('randomFrom', () => {
  it('returns an element of the array', () => {
    const arr = ['a', 'b', 'c']
    expect(arr).toContain(randomFrom(arr))
  })
})

describe('sleepAction', () => {
  it('resolves after the given timeout', async () => {
    await expect(sleepAction(1)).resolves.toBeUndefined()
  })
})
