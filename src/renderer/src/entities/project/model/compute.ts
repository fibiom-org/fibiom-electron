import { PAYROLL_CATEGORY } from './categories'
import type {
  CategorySlice,
  DashboardPeriod,
  Employee,
  MonthlyTotals,
  Payment,
  PaymentInput,
  Project,
  ProjectKpi
} from './types'

const isInPeriod = (period: DashboardPeriod, dateStr: string): boolean => {
  const date = new Date(dateStr)
  return date.getFullYear() === period.year && date.getMonth() + 1 === period.month
}

export const paymentAppliesInPeriod = (payment: Payment, period: DashboardPeriod): boolean => {
  if (payment.deletedAt) return false
  if (payment.type === 'recurring') return true
  return payment.date ? isInPeriod(period, payment.date) : false
}

export const getPaymentsInPeriod = (
  payments: Payment[],
  period: DashboardPeriod,
  direction?: Payment['direction']
): Payment[] =>
  payments.filter(
    (p) =>
      !p.deletedAt &&
      (direction === undefined || p.direction === direction) &&
      paymentAppliesInPeriod(p, period)
  )

export const getActiveEmployees = (employees: Employee[]): Employee[] =>
  employees.filter((employee) => !employee.deletedAt)

export const getVendorExpensesInPeriod = (
  payments: Payment[],
  period: DashboardPeriod
): Payment[] =>
  getPaymentsInPeriod(payments, period, 'expense').filter(
    (payment) => payment.category !== PAYROLL_CATEGORY
  )

const sumPayments = (payments: Payment[]): number =>
  payments.reduce((total, payment) => total + payment.amount, 0)

export const computePayroll = (employees: Employee[], _period: DashboardPeriod): number =>
  getActiveEmployees(employees).reduce((total, employee) => total + employee.salary, 0)

export const computeBurn = (
  payments: Payment[],
  employees: Employee[],
  period: DashboardPeriod
): number =>
  sumPayments(getVendorExpensesInPeriod(payments, period)) + computePayroll(employees, period)

export const computeRevenue = (payments: Payment[], period: DashboardPeriod): number =>
  sumPayments(getPaymentsInPeriod(payments, period, 'income'))

export const computeMrr = (payments: Payment[], period: DashboardPeriod): number =>
  sumPayments(
    getPaymentsInPeriod(payments, period, 'income').filter(
      (payment) => payment.type === 'recurring'
    )
  )

const monthsActiveInPeriod = (createdAt: string, period: DashboardPeriod): number => {
  const months =
    (period.year - new Date(createdAt).getFullYear()) * 12 +
    (period.month - (new Date(createdAt).getMonth() + 1)) +
    1
  return Math.max(months, 0)
}

const netFlowUpToPeriod = (
  payments: Payment[],
  employees: Employee[],
  period: DashboardPeriod
): number => {
  const cutoff = new Date(period.year, period.month, 0, 23, 59, 59)
  let net = 0

  for (const payment of payments) {
    if (payment.deletedAt) continue

    if (payment.type === 'recurring') {
      const months = monthsActiveInPeriod(payment.createdAt, period)
      if (months > 0) {
        const signed = payment.direction === 'income' ? payment.amount : -payment.amount
        net += signed * months
      }
      continue
    }

    if (payment.date) {
      const date = new Date(payment.date)
      if (date <= cutoff) {
        net += payment.direction === 'income' ? payment.amount : -payment.amount
      }
    }
  }

  for (const employee of getActiveEmployees(employees)) {
    const months = monthsActiveInPeriod(employee.createdAt, period)
    if (months > 0) net -= employee.salary * months
  }

  return net
}

export const computeCash = (
  project: Project,
  payments: Payment[],
  employees: Employee[],
  period: DashboardPeriod
): number => project.initialCash + netFlowUpToPeriod(payments, employees, period)

export const computeRunway = (cash: number, burn: number): number | null => {
  if (burn <= 0) return null
  return Math.round((cash / burn) * 10) / 10
}

export const computeKpi = (
  project: Project,
  payments: Payment[],
  employees: Employee[],
  period: DashboardPeriod
): ProjectKpi => {
  const burn = computeBurn(payments, employees, period)
  const cash = computeCash(project, payments, employees, period)

  return {
    burn,
    cash,
    runwayMonths: computeRunway(cash, burn),
    revenue: computeRevenue(payments, period),
    mrr: computeMrr(payments, period)
  }
}

export const computeExpenseSlices = (
  payments: Payment[],
  employees: Employee[],
  period: DashboardPeriod
): CategorySlice[] => {
  const totals = new Map<string, number>()

  for (const payment of getVendorExpensesInPeriod(payments, period)) {
    totals.set(payment.category, (totals.get(payment.category) ?? 0) + payment.amount)
  }

  const payroll = computePayroll(employees, period)
  if (payroll > 0) {
    totals.set(PAYROLL_CATEGORY, payroll)
  }

  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

const shiftPeriod = (period: DashboardPeriod, offset: number): DashboardPeriod => {
  let month = period.month + offset
  let year = period.year

  while (month <= 0) {
    month += 12
    year -= 1
  }
  while (month > 12) {
    month -= 12
    year += 1
  }

  return { month, year }
}

export const computeMonthlyTotals = (
  payments: Payment[],
  employees: Employee[],
  anchor: DashboardPeriod,
  count = 6
): MonthlyTotals[] => {
  const months: DashboardPeriod[] = []
  for (let i = count - 1; i >= 0; i--) {
    months.push(shiftPeriod(anchor, -i))
  }

  return months.map((period) => ({
    period: `${period.month}/${period.year}`,
    expenses: computeBurn(payments, employees, period),
    income: computeRevenue(payments, period)
  }))
}

export const formatPaymentField = (value: string | number | null): string => {
  if (value === null || value === '') return '—'
  return String(value)
}

export const summarizePaymentChanges = (before: Payment, after: PaymentInput): string | null => {
  const fields: Array<{ key: keyof PaymentInput; label: string }> = [
    { key: 'vendor', label: 'vendor' },
    { key: 'amount', label: 'amount' },
    { key: 'type', label: 'type' },
    { key: 'category', label: 'category' },
    { key: 'date', label: 'date' },
    { key: 'billingDay', label: 'billing day' },
    { key: 'note', label: 'note' }
  ]

  const changes: string[] = []

  for (const { key, label } of fields) {
    const oldValue = before[key as keyof Payment]
    const newValue = after[key]
    if (oldValue !== newValue) {
      changes.push(
        `${label}: ${formatPaymentField(oldValue as string | number | null)} → ${formatPaymentField(newValue)}`
      )
    }
  }

  return changes.length > 0 ? changes.join(', ') : null
}

export const summarizeEmployeeChanges = (
  before: Employee,
  after: { name: string; salary: number }
): string | null => {
  const changes: string[] = []

  if (before.name !== after.name.trim()) {
    changes.push(`name: ${before.name} → ${after.name.trim()}`)
  }
  if (before.salary !== after.salary) {
    changes.push(`salary: ${before.salary} → ${after.salary}`)
  }

  return changes.length > 0 ? changes.join(', ') : null
}
