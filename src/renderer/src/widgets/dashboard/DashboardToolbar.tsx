import MonthPicker from '@renderer/features/dashboard-period/ui/MonthPicker'
import FinanceModeToggle from '@renderer/features/finance-mode/ui/FinanceModeToggle'
import type { FinanceMode } from '@renderer/entities/dashboard/model/types'
import { formatDate } from '@renderer/shared/lib/format'

interface DashboardToolbarProps {
  month: number
  year: number
  lastUpdated: string
  mode: FinanceMode
  onMonthChange: (value: string) => void
  onModeChange: (mode: FinanceMode) => void
}

function DashboardToolbar({
  month,
  year,
  lastUpdated,
  mode,
  onMonthChange,
  onModeChange
}: DashboardToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
        <MonthPicker month={month} year={year} onChange={onMonthChange} />
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Mode
          </span>
          <FinanceModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
        <span>Last update</span>
        <span className="text-zinc-300">{formatDate(lastUpdated)}</span>
      </div>
    </div>
  )
}

export default DashboardToolbar
