import type { PlanPeriod } from './finance-types'

export const quarterStartMonth = (month: number): number => Math.floor((month - 1) / 3) * 3 + 1

export const normalizePlanPeriod = (period: PlanPeriod): PlanPeriod => {
  if (period.granularity === 'quarter') {
    return { ...period, month: quarterStartMonth(period.month) }
  }
  return period
}

export const planPeriodStorageKey = (period: PlanPeriod): string => {
  const normalized = normalizePlanPeriod(period)
  return `${normalized.granularity}:${normalized.year}:${normalized.month}`
}
