import { describe, it, expect } from 'vitest'
import {
  generateMockStats,
  generateMockChart,
  generateMockSales
} from '../app/composables/useDealStats/mocks'
import { getDatesByPeriod } from '../app/composables/useDealStats/helpers'

const labels = {
  customers: 'Customers',
  conversions: 'Won Deals',
  orders: 'Total Deals',
  revenue: 'Revenue'
}

describe('generateMockStats', () => {
  it('returns one card per label, using the provided titles', () => {
    const stats = generateMockStats('en-US', 'USD', labels)
    expect(stats).toHaveLength(4)
    expect(stats.map(s => s.title)).toEqual([
      labels.customers,
      labels.conversions,
      labels.orders,
      labels.revenue
    ])
  })

  it('leaves the first card without a variation', () => {
    const stats = generateMockStats('en-US', 'USD', labels)
    expect(stats[0]!.variation).toBeNull()
  })

  it('formats the revenue card as currency', () => {
    const stats = generateMockStats('en-US', 'USD', labels)
    const revenue = stats.find(s => s.title === labels.revenue)
    expect(revenue?.formatValue).toContain('$')
  })
})

describe('generateMockChart', () => {
  const range = {
    start: new Date('2025-01-01T00:00:00.000Z'),
    end: new Date('2025-01-31T00:00:00.000Z')
  }

  it('produces one point per date in the period', () => {
    const chart = generateMockChart('daily', range, 'USD')
    expect(chart).toHaveLength(getDatesByPeriod(range, 'daily').length)
  })

  it('each point carries a date and an amount for the currency', () => {
    const chart = generateMockChart('daily', range, 'EUR')
    expect(chart[0]!.date).toBeInstanceOf(Date)
    expect(typeof chart[0]!.amount.EUR).toBe('number')
  })
})

describe('generateMockSales', () => {
  it('returns five deals with the requested currency', () => {
    const sales = generateMockSales('USD')
    expect(sales).toHaveLength(5)
    expect(sales.every(s => s.currencyId === 'USD')).toBe(true)
  })

  it('gives in-progress deals no closedate and closed deals a closedate', () => {
    const sales = generateMockSales('USD')
    for (const sale of sales) {
      if (sale.stageSemanticId === 'P') {
        expect(sale.closedate).toBeNull()
      } else {
        expect(sale.closedate).not.toBeNull()
      }
    }
  })

  it('sorts deals newest-first by begin date', () => {
    const sales = generateMockSales('USD')
    for (let i = 1; i < sales.length; i++) {
      expect(new Date(sales[i - 1]!.begindate).getTime())
        .toBeGreaterThanOrEqual(new Date(sales[i]!.begindate).getTime())
    }
  })
})
