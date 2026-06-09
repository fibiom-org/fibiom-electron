import { z } from 'zod'

export const transactionTypes = ['income', 'expense'] as const

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(transactionTypes),
  category: z.string().min(1, 'Select a category'),
  date: z.string().min(1, 'Pick a date'),
  description: z.string().max(200, 'Must be 200 characters or fewer').optional()
})

export type TransactionInput = z.input<typeof transactionSchema>

export type TransactionDraft = z.output<typeof transactionSchema>
