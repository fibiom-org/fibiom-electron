import { useMemo, useState } from 'react'
import type { DashboardPeriod } from '@renderer/entities/dashboard/model/types'

export function useDashboardPeriod(): DashboardPeriod & {
  label: string
  setFromInput: (value: string) => void
} {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const label = useMemo(
    () =>
      new Date(year, month - 1).toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    [month, year]
  )

  const setFromInput = (value: string): void => {
    const [y, m] = value.split('-').map(Number)
    if (y && m) {
      setYear(y)
      setMonth(m)
    }
  }

  return { month, year, label, setFromInput }
}
