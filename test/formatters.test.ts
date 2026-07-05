import { describe, it, expect } from 'vitest'
import {
  stripTags,
  formatCurrency,
  formatDateByPeriod,
  formatDateRange,
  formatDateTimeShort
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

describe('formatDateRange', () => {
  // TZ is pinned to UTC in vitest.config, so a midday UTC date is stable.
  const date = new Date('2025-03-15T12:00:00.000Z')

  it('renders a short date with day, month and year (en-US)', () => {
    const out = formatDateRange(date, 'en-US')
    expect(out).toMatch(/3\/15\/25/)
  })

  it('respects the locale order (de-DE puts the day first)', () => {
    const out = formatDateRange(date, 'de-DE')
    expect(out).toMatch(/^15\./) // day-first
    expect(out).toContain('25')
  })
})

describe('formatDateTimeShort', () => {
  const date = new Date('2025-03-15T14:30:00.000Z')

  it('renders month, day and 24h time (en-US)', () => {
    const out = formatDateTimeShort(date, 'en-US')
    expect(out).toMatch(/Mar/)
    expect(out).toMatch(/15/)
    expect(out).toMatch(/14:30/)
  })

  it('uses 24-hour clock (no AM/PM)', () => {
    const out = formatDateTimeShort(date, 'en-US')
    expect(out).not.toMatch(/[AP]M/i)
  })
})
