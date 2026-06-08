import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { MonthlyOverview } from '@renderer/entities/dashboard/model/types'
import ChartCard from '@renderer/shared/ui/ChartCard'

interface MonthlyOverviewWidgetProps {
  overview: MonthlyOverview
}

function MonthlyOverviewWidget({ overview }: MonthlyOverviewWidgetProps): React.JSX.Element {
  const gaugeData = [
    { name: 'used', value: overview.usagePercent },
    { name: 'rest', value: 100 - overview.usagePercent }
  ]

  return (
    <ChartCard title="Monthly overview">
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius="65%"
              outerRadius="90%"
              stroke="none"
              cy="70%"
            >
              <Cell fill="#6366f1" />
              <Cell fill="#27272a" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
          <p className="text-2xl font-semibold">{overview.usagePercent}%</p>
          <p className="text-xs text-zinc-500">{overview.label}</p>
        </div>
      </div>
    </ChartCard>
  )
}

export default MonthlyOverviewWidget
