import { ragSaveEmbeddings, ragSearch, ragDeleteEmbeddings, type RagEmbeddedDoc } from '@qvac/sdk'
import * as secureStore from './secure-store'
import { embedTexts, ensureEmbeddingModel } from './embeddings'

const TOP_K = 6
// Hybrid score from the QVAC HyperDB adapter is `0.7 * cosine + 0.3 * textScore`,
// so it sits lower than a pure cosine score — keep the floor lenient.
const MIN_SCORE = 0.2

// Stored on every embedded doc as its `embeddingModelId`. The QVAC HyperDB
// adapter persists this on the first save and rejects later saves that use a
// different value, so it must be STABLE across sessions — unlike the live
// `loadModel` handle, which we only use to embed the search query at query time.
const EMBED_MODEL_TAG = 'embeddinggemma-300m-q4'

// Vectors live in the QVAC on-device vector DB (HyperDB), one workspace per
// project. We never store embeddings in SQLite.
const workspaceFor = (projectId: number): string => `project-${projectId}`

// Avoid re-embedding records we have already pushed into the QVAC DB this
// session. After a restart this is empty, so records are re-embedded once and
// the QVAC adapter de-duplicates the save by id.
const indexed = new Set<string>()
const indexedKey = (projectId: number, id: string): string => `${projectId}:${id}`

interface PendingDoc {
  id: string
  content: string
}

const money = (value: number): string => value.toFixed(2)

const collectPending = (projectId: number): PendingDoc[] => {
  const docs: PendingDoc[] = []

  const transactions = secureStore.query<{
    id: number
    date: string
    type: string
    amount: number
    description: string | null
    category: string | null
    account: string | null
    currency: string
  }>(
    `SELECT t.id, t.date, t.type, t.amount, t.description,
            c.name AS category, a.name AS account, p.currency AS currency
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     LEFT JOIN accounts a ON a.id = t.account_id
     JOIN projects p ON p.id = t.project_id
     WHERE t.project_id = ?`,
    [projectId]
  )
  for (const t of transactions) {
    const parts = [
      `${t.date}: ${t.type} of ${money(t.amount)} ${t.currency}`,
      t.category ? `category ${t.category}` : null,
      t.account ? `account ${t.account}` : null,
      t.description ? `— ${t.description}` : null
    ].filter(Boolean)
    docs.push({ id: `transaction-${t.id}`, content: parts.join(' ') })
  }

  const goals = secureStore.query<{
    id: number
    name: string
    target_amount: number
    current_amount: number
    deadline: string | null
  }>(
    `SELECT g.id, g.name, g.target_amount, g.current_amount, g.deadline
     FROM goals g
     WHERE g.project_id = ?`,
    [projectId]
  )
  for (const g of goals) {
    const deadline = g.deadline ? `, deadline ${g.deadline}` : ''
    docs.push({
      id: `goal-${g.id}`,
      content: `Goal "${g.name}": saved ${money(g.current_amount)} of ${money(g.target_amount)}${deadline}`
    })
  }

  const receipts = secureStore.query<{
    id: number
    parsed_data: string | null
  }>(
    `SELECT rc.id, rc.parsed_data
     FROM receipts rc
     JOIN transactions t ON t.id = rc.transaction_id
     WHERE t.project_id = ? AND rc.parsed_data IS NOT NULL`,
    [projectId]
  )
  for (const rc of receipts) {
    const content = receiptToText(rc.parsed_data)
    if (content) docs.push({ id: `receipt-${rc.id}`, content })
  }

  return docs.filter((d) => !indexed.has(indexedKey(projectId, d.id)))
}

const receiptToText = (parsed: string | null): string | null => {
  if (!parsed) return null
  try {
    const data = JSON.parse(parsed) as {
      merchant?: string
      date?: string
      total?: number | string
      items?: { name?: string }[]
    }
    const parts = [
      data.merchant ? `Receipt from ${data.merchant}` : 'Receipt',
      data.date ? `dated ${data.date}` : null,
      data.total != null ? `total ${data.total}` : null,
      data.items?.length
        ? `items: ${data.items
            .map((i) => i.name)
            .filter(Boolean)
            .join(', ')}`
        : null
    ].filter(Boolean)
    return parts.join(', ')
  } catch {
    return null
  }
}

// Embed `docs` with the on-device EmbeddingGemma model and persist them to the
// project's QVAC vector workspace.
const saveDocs = async (projectId: number, docs: PendingDoc[]): Promise<void> => {
  if (docs.length === 0) return
  const vectors = await embedTexts(docs.map((d) => d.content))
  const embedded: RagEmbeddedDoc[] = docs.map((d, i) => ({
    id: d.id,
    content: d.content,
    embedding: vectors[i],
    embeddingModelId: EMBED_MODEL_TAG
  }))
  await ragSaveEmbeddings({ workspace: workspaceFor(projectId), documents: embedded })
  for (const d of docs) indexed.add(indexedKey(projectId, d.id))
}

export const indexProject = async (projectId: number): Promise<void> => {
  const pending = collectPending(projectId)
  if (pending.length === 0) return
  console.log(`[rag] embedding ${pending.length} new record(s) for project ${projectId}`)
  await saveDocs(projectId, pending)
}

export const retrieve = async (projectId: number, queryText: string): Promise<string[]> => {
  // ragSearch embeds the query in the QVAC worker, so it needs a LIVE model
  // handle (the stored EMBED_MODEL_TAG is only metadata on the saved vectors).
  const modelId = await ensureEmbeddingModel()
  const results = await ragSearch({
    modelId,
    query: queryText,
    topK: TOP_K,
    workspace: workspaceFor(projectId)
  })
  const hits = results.filter((r) => r.score >= MIN_SCORE)
  console.log(`[rag] retrieved ${hits.length}/${results.length} chunk(s) for query "${queryText}"`)
  return hits.map((r) => r.content)
}

export const buildRagContext = async (projectId: number, queryText: string): Promise<string> => {
  if (!queryText.trim()) return ''
  try {
    await indexProject(projectId)
    const hits = await retrieve(projectId, queryText)
    if (hits.length === 0) return ''
    return ['Most relevant records (semantic search):', ...hits.map((h) => `- ${h}`)].join('\n')
  } catch (err) {
    console.error('[rag] retrieval failed, continuing without it:', err)
    return ''
  }
}

// Persist already-chunked document text into the project's QVAC vector
// workspace. Used by the document upload flow.
export const indexDocumentChunks = async (
  projectId: number,
  documentId: number,
  chunks: string[]
): Promise<void> => {
  const docs = chunks.map((content, i) => ({ id: `doc-${documentId}-${i}`, content }))
  await saveDocs(projectId, docs)
}

// Remove a document's chunks from the QVAC vector workspace.
export const deleteDocumentChunks = async (
  projectId: number,
  documentId: number,
  chunkCount: number
): Promise<void> => {
  if (chunkCount <= 0) return
  const ids = Array.from({ length: chunkCount }, (_, i) => `doc-${documentId}-${i}`)
  try {
    await ragDeleteEmbeddings({ workspace: workspaceFor(projectId), ids })
  } catch (err) {
    console.error('[rag] failed to delete document chunks:', err)
  }
  for (const id of ids) indexed.delete(indexedKey(projectId, id))
}
