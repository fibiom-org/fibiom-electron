import { type TransactionDraft } from '@renderer/entities/transaction'
import { loadCategories } from '@renderer/features/settings'
import { resolveCategoryId } from './resolve-category-id'
import { resolveAccountId } from './resolve-account-id'

export async function saveTransaction(draft: TransactionDraft): Promise<void> {
  const projectId = Number(draft.project)
  const accountId = await resolveAccountId(projectId)

  const categories = await loadCategories()
  const category = categories.find((c) => c.value === draft.category)
  const categoryId = await resolveCategoryId(category, draft.type)

  await window.dbAPI.exec(
    'INSERT INTO transactions (project_id, account_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      projectId,
      accountId,
      categoryId,
      draft.amount,
      draft.type,
      draft.description ?? null,
      draft.date
    ]
  )
}
