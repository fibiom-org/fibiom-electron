import { useEffect, useState } from 'react'
import type {
  DashboardPeriod,
  Employee,
  Payment,
  PaymentDirection,
  ProjectCurrency
} from '@renderer/entities/project'
import {
  computePayroll,
  getActiveEmployees,
  getPaymentsInPeriod,
  getVendorExpensesInPeriod,
  PAYROLL_CATEGORY
} from '@renderer/entities/project'
import { PaymentHistoryPopover } from '@renderer/features/manage-payment'
import { Button } from '@renderer/components/ui/Button'
import { formatCurrency } from '@renderer/shared/lib/format'
import { cn } from '@renderer/lib/cn'

interface PaymentsTableProps {
  payments: Payment[]
  employees: Employee[]
  period: DashboardPeriod
  currency: ProjectCurrency
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
  onAdd: (direction: PaymentDirection) => void
  onEditEmployee: (employee: Employee) => void
  onDeleteEmployee: (employee: Employee) => void
  onAddEmployee: () => void
}

const tabs: Array<{ id: PaymentDirection; label: string }> = [
  { id: 'expense', label: 'Expenses' },
  { id: 'income', label: 'Income' }
]

const formatSchedule = (payment: Payment): string => {
  if (payment.type === 'recurring') {
    return payment.billingDay ? `day ${payment.billingDay}` : '—'
  }
  return payment.date ?? '—'
}

export const PaymentsTable = ({
  payments,
  employees,
  period,
  currency,
  onEdit,
  onDelete,
  onAdd,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee
}: PaymentsTableProps) => {
  const [activeTab, setActiveTab] = useState<PaymentDirection>('expense')
  const activeEmployees = getActiveEmployees(employees)
  const payrollTotal = computePayroll(employees, period)
  const vendorExpenses = getVendorExpensesInPeriod(payments, period)
  const income = getPaymentsInPeriod(payments, period, 'income')
  const [payrollOpen, setPayrollOpen] = useState(activeEmployees.length > 0)

  useEffect(() => {
    setPayrollOpen(activeEmployees.length > 0)
  }, [activeEmployees.length])

  const expenseCount = vendorExpenses.length + 1
  const vendorLabel = activeTab === 'expense' ? 'Vendor' : 'Source'

  const renderExpenseRows = () => (
    <>
      <tr className="border-b border-zinc-800/60 bg-zinc-800/20">
        <td className="px-5 py-3">
          <button
            type="button"
            onClick={() => setPayrollOpen((open) => !open)}
            className="flex items-center gap-2 text-left font-medium text-zinc-100"
          >
            <span className="text-zinc-500">{payrollOpen ? '▼' : '▶'}</span>
            Payroll
          </button>
        </td>
        <td className="px-5 py-3 font-medium text-zinc-200">
          {formatCurrency(payrollTotal, currency)}
        </td>
        <td className="px-5 py-3 capitalize text-zinc-400">recurring</td>
        <td className="px-5 py-3 text-zinc-400">{PAYROLL_CATEGORY}</td>
        <td className="px-5 py-3 text-zinc-400">—</td>
        <td className="px-5 py-3" />
      </tr>

      {payrollOpen &&
        (activeEmployees.length === 0 ? (
          <tr className="border-b border-zinc-800/60">
            <td colSpan={6} className="px-5 py-8 text-center">
              <p className="text-sm text-zinc-500">No employees yet.</p>
              <Button className="mt-3" onClick={onAddEmployee}>
                + Add employee
              </Button>
            </td>
          </tr>
        ) : (
          <>
            {activeEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-zinc-800/60">
                <td className="px-5 py-3 pl-12 text-zinc-100">{employee.name}</td>
                <td className="px-5 py-3 text-zinc-200">
                  {formatCurrency(employee.salary, currency)}
                </td>
                <td className="px-5 py-3 text-zinc-600">—</td>
                <td className="px-5 py-3 text-zinc-600">—</td>
                <td className="px-5 py-3 text-zinc-600">—</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <PaymentHistoryPopover history={employee.history} />
                    <button
                      type="button"
                      onClick={() => onEditEmployee(employee)}
                      className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                      aria-label="Edit employee"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEmployee(employee)}
                      className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-rose-300"
                      aria-label="Remove employee"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="border-b border-zinc-800/60">
              <td colSpan={6} className="px-5 py-3 pl-12">
                <Button variant="ghost" onClick={onAddEmployee}>
                  + Add employee
                </Button>
              </td>
            </tr>
          </>
        ))}

      {vendorExpenses.map((payment) => (
        <tr key={payment.id} className="border-b border-zinc-800/60 last:border-0">
          <td className="px-5 py-3 text-zinc-100">{payment.vendor}</td>
          <td className="px-5 py-3 text-zinc-200">{formatCurrency(payment.amount, currency)}</td>
          <td className="px-5 py-3 capitalize text-zinc-400">{payment.type}</td>
          <td className="px-5 py-3 text-zinc-400">{payment.category}</td>
          <td className="px-5 py-3 text-zinc-400">{formatSchedule(payment)}</td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-end gap-1">
              <PaymentHistoryPopover history={payment.history} />
              <button
                type="button"
                onClick={() => onEdit(payment)}
                className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Edit payment"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => onDelete(payment)}
                className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-rose-300"
                aria-label="Delete payment"
              >
                ✕
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  )

  const visible = activeTab === 'expense' ? vendorExpenses : income
  const showEmptyIncome = activeTab === 'income' && visible.length === 0

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-zinc-800/60 p-1">
          {tabs.map((tab) => {
            const count = tab.id === 'expense' ? expenseCount : income.length
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm transition-colors',
                  activeTab === tab.id
                    ? 'bg-zinc-700 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {tab.label} ({count})
              </button>
            )
          })}
        </div>
        {activeTab === 'income' && (
          <Button variant="ghost" onClick={() => onAdd(activeTab)}>
            + Add payment
          </Button>
        )}
      </div>

      {activeTab === 'expense' ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">{vendorLabel}</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{renderExpenseRows()}</tbody>
          </table>
        </div>
      ) : showEmptyIncome ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-zinc-500">No income this month.</p>
          <Button className="mt-4" onClick={() => onAdd('income')}>
            Add your first payment
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">{vendorLabel}</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((payment) => (
                <tr key={payment.id} className="border-b border-zinc-800/60 last:border-0">
                  <td className="px-5 py-3 text-zinc-100">{payment.vendor}</td>
                  <td className="px-5 py-3 text-zinc-200">
                    {formatCurrency(payment.amount, currency)}
                  </td>
                  <td className="px-5 py-3 capitalize text-zinc-400">{payment.type}</td>
                  <td className="px-5 py-3 text-zinc-400">{payment.category}</td>
                  <td className="px-5 py-3 text-zinc-400">{formatSchedule(payment)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <PaymentHistoryPopover history={payment.history} />
                      <button
                        type="button"
                        onClick={() => onEdit(payment)}
                        className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                        aria-label="Edit payment"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(payment)}
                        className="rounded-lg px-2 py-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-rose-300"
                        aria-label="Delete payment"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
