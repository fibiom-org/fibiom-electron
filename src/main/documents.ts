import * as secureStore from './secure-store'
import { indexDocumentChunks, deleteDocumentChunks } from './rag'

const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 150

export interface DocumentRow {
  id: number
  project_id: number
  filename: string
  char_count: number
  chunk_count: number
  created_at: string
}

const resolveProjectId = (projectId?: number): number | null => {
  if (projectId) return projectId
  const row = secureStore.query<{ id: number }>('SELECT id FROM projects ORDER BY id LIMIT 1')[0]
  return row?.id ?? null
}

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
  if (pid === null) return []
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
  if (pid === null) throw new Error('Create a project before uploading documents')
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

  console.log(`[documents] embedding ${chunks.length} chunk(s) of "${filename}" (doc ${doc.id})`)
  await indexDocumentChunks(
    pid,
    doc.id,
    chunks.map((chunk) => `[${filename}] ${chunk}`)
  )

  return doc
}

export const deleteDocument = async (documentId: number, projectId?: number): Promise<void> => {
  const pid = resolveProjectId(projectId)
  if (pid === null) return
  const row = secureStore.query<{ chunk_count: number }>(
    'SELECT chunk_count FROM documents WHERE id = ? AND project_id = ?',
    [documentId, pid]
  )[0]
  if (row) await deleteDocumentChunks(pid, documentId, row.chunk_count)
  secureStore.exec('DELETE FROM documents WHERE id = ? AND project_id = ?', [documentId, pid])
}
