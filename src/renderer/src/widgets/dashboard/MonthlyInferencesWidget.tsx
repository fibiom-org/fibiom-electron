import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'
import type { MonthlyInferencePoint } from '@renderer/entities/dashboard/model/types'
import ChartCard from '@renderer/shared/ui/ChartCard'
import { CHART_COLORS } from '@renderer/shared/config/charts'

interface MonthlyInferencesWidgetProps {
  points: MonthlyInferencePoint[]
}

function MonthlyInferencesWidget({ points }: MonthlyInferencesWidgetProps): React.JSX.Element {
  return (
    <ChartCard title="Monthly inferences">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#27272a" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {points.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                fill="#e4e4e7"
                fontSize={11}
                formatter={(v) => String(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default MonthlyInferencesWidget
