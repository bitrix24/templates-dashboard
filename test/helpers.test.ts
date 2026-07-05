import { describe, it, expect } from 'vitest'
import {
  calculateVariation,
  getLatestSales,
  buildChartData,
  groupSalesByDate,
  getDatesByPeriod
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

  it('drops a sale whose closedate precedes the earliest timestamp', () => {
    const t1 = new Date('2025-02-01T00:00:00.000Z').getTime()
    const t2 = new Date('2025-03-01T00:00:00.000Z').getTime()
    const sale = makeSale({ closedate: '2025-01-15T00:00:00.000Z' }) // before t1
    const groups = groupSalesByDate([sale], [t1, t2])
    expect(groups[t1]).toHaveLength(0)
    expect(groups[t2]).toHaveLength(0)
  })

  it('assigns a sale on/after the last timestamp to the last bucket', () => {
    const t1 = new Date('2025-01-01T00:00:00.000Z').getTime()
    const t2 = new Date('2025-02-01T00:00:00.000Z').getTime()
    const onLast = makeSale({ id: 1, closedate: '2025-02-01T00:00:00.000Z' })
    const afterLast = makeSale({ id: 2, closedate: '2025-05-01T00:00:00.000Z' })
    const groups = groupSalesByDate([onLast, afterLast], [t1, t2])
    expect(groups[t2]).toHaveLength(2)
    expect(groups[t1]).toHaveLength(0)
  })

  it('picks the correct middle bucket across many timestamps (stresses the binary search)', () => {
    const ts = [
      new Date('2025-01-01T00:00:00.000Z').getTime(),
      new Date('2025-02-01T00:00:00.000Z').getTime(),
      new Date('2025-03-01T00:00:00.000Z').getTime(),
      new Date('2025-04-01T00:00:00.000Z').getTime(),
      new Date('2025-05-01T00:00:00.000Z').getTime()
    ]
    // closes on Mar 20 → largest ts <= closedate is the Mar 1 bucket (index 2)
    const sale = makeSale({ closedate: '2025-03-20T00:00:00.000Z' })
    const groups = groupSalesByDate([sale], ts)
    expect(groups[ts[2]!]).toHaveLength(1)
    ts.filter((_, i) => i !== 2).forEach(t => expect(groups[t]).toHaveLength(0))
  })
})

describe('getDatesByPeriod', () => {
  const range = {
    start: new Date('2025-01-01T00:00:00.000Z'),
    end: new Date('2025-01-31T00:00:00.000Z')
  }

  it('returns one date per day for the daily period', () => {
    const dates = getDatesByPeriod(range, 'daily')
    expect(dates).toHaveLength(31)
    expect(dates[0]).toBeInstanceOf(Date)
  })

  it('buckets the Jan 1–31 range into 5 weeks (default Sunday start)', () => {
    // date-fns eachWeekOfInterval defaults to weekStartsOn: 0 (Sunday); no options
    // are passed, so the count is deterministic regardless of locale.
    expect(getDatesByPeriod(range, 'weekly')).toHaveLength(5)
  })

  it('returns a single point for the monthly period within one month', () => {
    expect(getDatesByPeriod(range, 'monthly')).toHaveLength(1)
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
