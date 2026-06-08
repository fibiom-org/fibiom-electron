import AppShell from '@renderer/components/layout/AppShell'
import { useDashboardData } from '@renderer/entities/dashboard/model/useDashboardData'
import { useDashboardPeriod } from '@renderer/features/dashboard-period/model/useDashboardPeriod'
import { useFinanceMode } from '@renderer/features/finance-mode/model/useFinanceMode'
import AnomaliesWidget from '@renderer/widgets/dashboard/AnomaliesWidget'
import BudgetOverviewWidget from '@renderer/widgets/dashboard/BudgetOverviewWidget'
import DashboardSummaryBar from '@renderer/widgets/dashboard/DashboardSummaryBar'
import DashboardToolbar from '@renderer/widgets/dashboard/DashboardToolbar'
import DistributionWidget from '@renderer/widgets/dashboard/DistributionWidget'
import ExpensesOverTimeWidget from '@renderer/widgets/dashboard/ExpensesOverTimeWidget'
import PeriodComparisonWidget from '@renderer/widgets/dashboard/PeriodComparisonWidget'
import RunwayCalculatorWidget from '@renderer/widgets/dashboard/RunwayCalculatorWidget'
import TopCategoriesWidget from '@renderer/widgets/dashboard/TopCategoriesWidget'

function MainPage(): React.JSX.Element {
  const period = useDashboardPeriod()
  const { mode, setMode, isBusiness } = useFinanceMode()
  const { data, loading } = useDashboardData(period, mode)

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
              mode={mode}
              onMonthChange={period.setFromInput}
              onModeChange={setMode}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <BudgetOverviewWidget overview={data.budgetOverview} />
              </div>
              <div className="lg:col-span-9">
                <ExpensesOverTimeWidget points={data.expensesOverTime} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DistributionWidget title="Expenses by category" slices={data.expensesByCategory} />
              <PeriodComparisonWidget comparison={data.periodComparison} />
            </div>
            <div
              className={`grid grid-cols-1 gap-4 ${isBusiness ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}
            >
              <TopCategoriesWidget categories={data.topCategories} />
              <AnomaliesWidget anomalies={data.anomalies} />
              {isBusiness && data.runway && <RunwayCalculatorWidget runway={data.runway} />}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

export default MainPage
