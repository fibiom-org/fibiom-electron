import type { Employee, Payment, PaymentInput } from './finance-types'

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
