import type { TransactionDraft } from './schema'

export type TransactionType = TransactionDraft['type']

export interface Transaction extends TransactionDraft {
  id: string
  createdAt: string
}
