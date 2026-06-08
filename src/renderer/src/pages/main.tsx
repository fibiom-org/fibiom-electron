import AppShell from '@renderer/components/layout/AppShell'
import { useDashboardData } from '@renderer/entities/dashboard/model/useDashboardData'
import { useDashboardPeriod } from '@renderer/features/dashboard-period/model/useDashboardPeriod'
import DashboardSummaryBar from '@renderer/widgets/dashboard/DashboardSummaryBar'
import DashboardToolbar from '@renderer/widgets/dashboard/DashboardToolbar'
import DistributionWidget from '@renderer/widgets/dashboard/DistributionWidget'
import MonthlyInferencesWidget from '@renderer/widgets/dashboard/MonthlyInferencesWidget'
import MonthlyOverviewWidget from '@renderer/widgets/dashboard/MonthlyOverviewWidget'

function MainPage(): React.JSX.Element {
  const period = useDashboardPeriod()
  const { data, loading } = useDashboardData(period)

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {loading || !data ? (
          <p className="text-sm text-zinc-500">Loading dashboard…</p>
        ) : (
          <>
            <DashboardSummaryBar summary={data.summary} />
            <DashboardToolbar
              month={period.month}
              year={period.year}
              lastUpdated={data.lastUpdated}
              onMonthChange={period.setFromInput}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <MonthlyOverviewWidget overview={data.overview} />
              </div>
              <div className="lg:col-span-9">
                <MonthlyInferencesWidget points={data.monthlyInferences} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DistributionWidget title="Model usage" slices={data.modelUsage} />
              <DistributionWidget title="Storage breakdown" slices={data.storageBreakdown} />
              <DistributionWidget title="Inference types" slices={data.inferenceTypes} />
              <DistributionWidget title="Resource usage" slices={data.resourceUsage} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

export default MainPage
