import { describe, it, expect } from 'vitest'
import {
  stripTags,
  formatCurrency,
  formatDateByPeriod
} from '../app/composables/useDealStats/formatters'

describe('stripTags', () => {
  it('removes HTML tags', () => {
    expect(stripTags('<b>566</b> 168.00')).toBe('566 168.00')
  })

  it('decodes the euro entity', () => {
    expect(stripTags('168.00 &euro;')).toBe('168.00 €')
  })

  it('replaces non-breaking spaces with a regular space', () => {
    expect(stripTags('566 168.00')).toBe('566 168.00')
  })
})

describe('formatCurrency', () => {
  it('formats USD in en-US', () => {
    // Non-breaking spaces / exact symbol placement vary by ICU, so assert loosely
    const out = formatCurrency(12345.67, 'USD', 'en-US')
    expect(out).toContain('$')
    expect(out).toContain('12,346')
  })

  it('drops fraction digits', () => {
    const out = formatCurrency(10.4, 'USD', 'en-US')
    expect(out).not.toContain('.')
  })
})

describe('formatDateByPeriod', () => {
  const date = new Date('2025-03-15T00:00:00.000Z')

  it('uses day + month for the daily period', () => {
    const out = formatDateByPeriod(date, 'daily', 'en-US')
    expect(out).toMatch(/Mar/)
    expect(out).toMatch(/15/)
  })

  it('uses month + year for the monthly period', () => {
    const out = formatDateByPeriod(date, 'monthly', 'en-US')
    expect(out).toMatch(/Mar/)
    expect(out).toMatch(/2025/)
  })
})
