import { type TransactionDraft } from '@renderer/entities/transaction'
import { loadCategories } from '@renderer/features/settings'
import { resolveCategoryId } from './resolve-category-id'
import { resolveAccountId } from './resolve-account-id'

export const updateTransaction = async (id: number, draft: TransactionDraft): Promise<void> => {
  const projectId = Number(draft.project)
  const accountId = await resolveAccountId(projectId)

  const categories = await loadCategories()
  const category = categories.find((c) => c.value === draft.category)
  const categoryId = await resolveCategoryId(category, draft.type)

  await window.dbAPI.exec(
    'UPDATE transactions SET project_id = ?, account_id = ?, amount = ?, type = ?, category_id = ?, description = ?, date = ? WHERE id = ?',
    [projectId, accountId, draft.amount, draft.type, categoryId, draft.description ?? null, draft.date, id]
  )
}
