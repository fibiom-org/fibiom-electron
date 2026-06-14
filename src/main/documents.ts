import * as secureStore from './secure-store'
import { embedTexts } from './embeddings'

const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 150
const EMBED_BATCH = 16

export interface DocumentRow {
  id: number
  project_id: number
  filename: string
  char_count: number
  chunk_count: number
  created_at: string
}

const resolveProjectId = (projectId?: number): number => {
  if (projectId) return projectId
  const row = secureStore.query<{ id: number }>('SELECT id FROM projects ORDER BY id LIMIT 1')[0]
  if (!row) throw new Error('No project found — complete onboarding first')
  return row.id
}

const sourceTypeFor = (documentId: number): string => `doc:${documentId}`

const chunkText = (text: string): string[] => {
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  let current = ''

  for (const word of words) {
    if (current.length + word.length + 1 > CHUNK_SIZE && current) {
      chunks.push(current.trim())
      const tail = current.slice(Math.max(0, current.length - CHUNK_OVERLAP))
      current = `${tail} ${word}`
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

export const listDocuments = (projectId?: number): DocumentRow[] => {
  const pid = resolveProjectId(projectId)
  return secureStore.query<DocumentRow>(
    `SELECT id, project_id, filename, char_count, chunk_count, created_at
     FROM documents
     WHERE project_id = ?
     ORDER BY created_at DESC, id DESC`,
    [pid]
  )
}

export const addDocument = async (
  filename: string,
  text: string,
  projectId?: number
): Promise<DocumentRow> => {
  const pid = resolveProjectId(projectId)
  const clean = text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (!clean) throw new Error('No readable text found in this document')

  const chunks = chunkText(clean)

  secureStore.exec(
    `INSERT INTO documents (project_id, filename, char_count, chunk_count)
     VALUES (?, ?, ?, ?)`,
    [pid, filename, clean.length, chunks.length]
  )
  const doc = secureStore.query<DocumentRow>(
    `SELECT id, project_id, filename, char_count, chunk_count, created_at
     FROM documents WHERE rowid = last_insert_rowid()`
  )[0]

  const sourceType = sourceTypeFor(doc.id)
  console.log(`[documents] embedding ${chunks.length} chunk(s) of "${filename}" (doc ${doc.id})`)

  for (let start = 0; start < chunks.length; start += EMBED_BATCH) {
    const batch = chunks.slice(start, start + EMBED_BATCH)
    const vectors = await embedTexts(batch)
    for (let i = 0; i < batch.length; i++) {
      secureStore.exec(
        `INSERT INTO rag_chunks (project_id, source_type, source_id, content, embedding)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(project_id, source_type, source_id)
         DO UPDATE SET content = excluded.content,
                       embedding = excluded.embedding,
                       updated_at = datetime('now')`,
        [pid, sourceType, start + i, `[${filename}] ${batch[i]}`, JSON.stringify(vectors[i])]
      )
    }
  }

  return doc
}

export const deleteDocument = (documentId: number, projectId?: number): void => {
  const pid = resolveProjectId(projectId)
  secureStore.exec('DELETE FROM rag_chunks WHERE project_id = ? AND source_type = ?', [
    pid,
    sourceTypeFor(documentId)
  ])
  secureStore.exec('DELETE FROM documents WHERE id = ? AND project_id = ?', [documentId, pid])
}
