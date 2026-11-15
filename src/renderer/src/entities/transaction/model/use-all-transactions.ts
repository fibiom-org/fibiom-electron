import { useEffect, useState } from 'react'
import { getAllTransactions } from '../api/get-all-transactions'
import { useTransactionsVersion } from './transactions-store'
import type { TransactionListItem } from './types'

export function useAllTransactions(): { transactions: TransactionListItem[]; loading: boolean } {
  const version = useTransactionsVersion()
  const [transactions, setTransactions] = useState<TransactionListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getAllTransactions()
      .then((rows) => {
        if (!cancelled) setTransactions(rows)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [version])

  return { transactions, loading }
}
