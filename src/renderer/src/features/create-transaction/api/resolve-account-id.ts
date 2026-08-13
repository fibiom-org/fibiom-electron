export async function resolveAccountId(projectId: number): Promise<number> {
  const [account] = await window.dbAPI.query<{ id: number }>(
    'SELECT id FROM accounts WHERE project_id = ? ORDER BY id LIMIT 1',
    [projectId]
  )
  if (!account) throw new Error('No account found for this project')
  return account.id
}
