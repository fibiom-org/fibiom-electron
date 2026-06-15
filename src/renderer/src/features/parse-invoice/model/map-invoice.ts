import type { PaymentFormInput } from '@renderer/features/manage-payment'
import { tryParseJson } from '@renderer/lib/parse'

export type InvoicePrefill = Partial<PaymentFormInput>

const readAmount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

const readIsoDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const match = value.match(/\d{4}-\d{2}-\d{2}/)
  return match ? match[0] : undefined
}

const buildNote = (json: Record<string, unknown>): string | null => {
  const parts: string[] = []
  if (typeof json.invoice_number === 'string' && json.invoice_number.trim()) {
    parts.push(`Invoice ${json.invoice_number.trim()}`)
  }
  if (typeof json.currency === 'string' && json.currency.trim()) {
    parts.push(json.currency.trim().toUpperCase())
  }
  return parts.length ? parts.join(' · ') : null
}

export const mapInvoice = (text: string): InvoicePrefill => {
  const json = tryParseJson(text)
  if (!json) return { type: 'one-time' }

  const prefill: InvoicePrefill = { type: 'one-time' }

  if (typeof json.vendor === 'string' && json.vendor.trim()) {
    prefill.vendor = json.vendor.trim()
  }

  const amount = readAmount(json.amount_due)
  if (amount != null) prefill.amount = amount

  const due = readIsoDate(json.due_date) ?? readIsoDate(json.date)
  if (due) prefill.date = due

  const note = buildNote(json)
  if (note) prefill.note = note

  return prefill
}
