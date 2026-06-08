import type { DashboardSummary } from '@renderer/entities/dashboard/model/types'
import { formatCount, formatLatency, formatStorage } from '@renderer/shared/lib/format'

interface DashboardSummaryBarProps {
  summary: DashboardSummary
}

const items = [
  { key: 'activeModels' as const, label: 'Active models' },
  { key: 'inferences' as const, label: 'Local inferences' },
  { key: 'avgLatencyMs' as const, label: 'Avg latency' },
  { key: 'storageGb' as const, label: 'Encrypted storage' }
]

function formatValue(key: keyof DashboardSummary, summary: DashboardSummary): string {
  switch (key) {
    case 'activeModels':
      return String(summary.activeModels)
    case 'inferences':
      return formatCount(summary.inferences)
    case 'avgLatencyMs':
      return formatLatency(summary.avgLatencyMs)
    case 'storageGb':
      return formatStorage(summary.storageGb)
  }
}

function DashboardSummaryBar({ summary }: DashboardSummaryBarProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3"
        >
          <p className="text-xs text-zinc-500">{item.label}</p>
          <p className="mt-1 text-lg font-semibold">{formatValue(item.key, summary)}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardSummaryBar
