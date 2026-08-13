import type { CategoryOption } from '@renderer/entities/transaction'

export async function resolveCategoryId(
  category: CategoryOption | undefined,
  type: 'income' | 'expense'
): Promise<number | null> {
  if (!category) return null

  const existing = await window.dbAPI.query<{ id: number }>(
    'SELECT id FROM categories WHERE name = ? AND type = ? LIMIT 1',
    [category.label, type]
  )
  if (existing[0]) return existing[0].id

  const inserted = await window.dbAPI.query<{ id: number }>(
    'INSERT INTO categories (project_id, name, color, icon, type) VALUES (NULL, ?, ?, ?, ?) RETURNING id',
    [category.label, category.color, category.icon, type]
  )
  return inserted[0]?.id ?? null
}
