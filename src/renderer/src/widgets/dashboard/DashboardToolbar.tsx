import MonthPicker from '@renderer/features/dashboard-period/ui/MonthPicker'
import { formatDate } from '@renderer/shared/lib/format'

interface DashboardToolbarProps {
  month: number
  year: number
  lastUpdated: string
  onMonthChange: (value: string) => void
}

function DashboardToolbar({
  month,
  year,
  lastUpdated,
  onMonthChange
}: DashboardToolbarProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
      <div className="md:col-span-3">
        <MonthPicker month={month} year={year} onChange={onMonthChange} />
      </div>
      <div className="flex items-center justify-end gap-2 text-sm text-zinc-500 md:col-span-9">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
        <span>Last update</span>
        <span className="text-zinc-300">{formatDate(lastUpdated)}</span>
      </div>
    </div>
  )
}

export default DashboardToolbar
