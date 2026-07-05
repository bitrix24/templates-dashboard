import { describe, it, expect } from 'vitest'
import {
  calculateVariation,
  getLatestSales,
  buildChartData,
  groupSalesByDate
} from '../app/composables/useDealStats/helpers'
import type { Sale } from '../app/types'

function makeSale(partial: Partial<Sale> = {}): Sale {
  return {
    id: 1,
    begindate: '2025-01-01T00:00:00.000Z',
    closedate: '2025-01-10T00:00:00.000Z',
    status: 'success',
    title: 'Deal',
    amount: 100,
    currencyId: 'USD',
    stageSemanticId: 'S',
    ...partial
  }
}

describe('calculateVariation', () => {
  it('computes positive growth', () => {
    expect(calculateVariation(120, 100)).toBe(20)
  })

  it('computes negative growth', () => {
    expect(calculateVariation(80, 100)).toBe(-20)
  })

  it('returns null when previous is 0 (no division by zero)', () => {
    expect(calculateVariation(100, 0)).toBeNull()
  })

  it('rounds to the nearest integer', () => {
    expect(calculateVariation(133, 100)).toBe(33)
  })
})

describe('getLatestSales', () => {
  const sales: Sale[] = [
    makeSale({ id: 1, closedate: '2025-01-01T00:00:00.000Z' }),
    makeSale({ id: 2, closedate: '2025-03-01T00:00:00.000Z' }),
    makeSale({ id: 3, closedate: '2025-02-01T00:00:00.000Z' })
  ]

  it('returns the newest deals first', () => {
    const result = getLatestSales(sales, 2)
    expect(result.map(s => s.id)).toEqual([2, 3])
  })

  it('respects the limit', () => {
    expect(getLatestSales(sales, 1)).toHaveLength(1)
  })

  it('handles a limit larger than the array length', () => {
    expect(getLatestSales(sales, 10)).toHaveLength(3)
  })

  it('skips deals without a closedate (deals in progress)', () => {
    const withProcessing = [
      ...sales,
      makeSale({ id: 4, closedate: null, stageSemanticId: 'P', status: 'processing' })
    ]
    const result = getLatestSales(withProcessing, 10)
    expect(result.map(s => s.id)).not.toContain(4)
  })
})

describe('groupSalesByDate', () => {
  it('initializes an empty bucket for each timestamp', () => {
    const timestamps = [1000, 2000, 3000]
    const groups = groupSalesByDate([], timestamps)
    expect(Object.keys(groups)).toHaveLength(3)
    expect(groups[1000]).toEqual([])
  })

  it('assigns a sale to the largest timestamp <= closedate', () => {
    const t1 = new Date('2025-01-01T00:00:00.000Z').getTime()
    const t2 = new Date('2025-02-01T00:00:00.000Z').getTime()
    const sale = makeSale({ closedate: '2025-01-15T00:00:00.000Z' })
    const groups = groupSalesByDate([sale], [t1, t2])
    expect(groups[t1]).toHaveLength(1)
    expect(groups[t2]).toHaveLength(0)
  })

  it('ignores sales without a closedate', () => {
    const t1 = new Date('2025-01-01T00:00:00.000Z').getTime()
    const groups = groupSalesByDate([makeSale({ closedate: null })], [t1])
    expect(groups[t1]).toHaveLength(0)
  })
})

describe('buildChartData', () => {
  it('aggregates successful deals by currency per date', () => {
    const dates = [
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2025-02-01T00:00:00.000Z')
    ]
    const sales: Sale[] = [
      makeSale({ id: 1, closedate: '2025-01-05T00:00:00.000Z', amount: 100, currencyId: 'USD' }),
      makeSale({ id: 2, closedate: '2025-01-10T00:00:00.000Z', amount: 50, currencyId: 'USD' }),
      makeSale({ id: 3, closedate: '2025-01-10T00:00:00.000Z', amount: 30, currencyId: 'EUR' })
    ]
    const result = buildChartData(sales, dates)
    const jan = result.find(r => r.date.getTime() === dates[0]!.getTime())
    expect(jan?.amount).toEqual({ USD: 150, EUR: 30 })
  })

  it('excludes non-successful deals', () => {
    const dates = [new Date('2025-01-01T00:00:00.000Z')]
    const sales: Sale[] = [
      makeSale({ id: 1, closedate: '2025-01-05T00:00:00.000Z', amount: 100, stageSemanticId: 'F', status: 'failed' })
    ]
    const result = buildChartData(sales, dates)
    expect(result[0]?.amount).toEqual({})
  })

  it('returns data sorted by date', () => {
    const dates = [
      new Date('2025-02-01T00:00:00.000Z'),
      new Date('2025-01-01T00:00:00.000Z')
    ]
    const result = buildChartData([], dates)
    expect(result[0]!.date.getTime()).toBeLessThan(result[1]!.date.getTime())
  })
})
