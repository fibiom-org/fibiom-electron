import { useRef } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { useDocuments } from '../model/use-documents'

const formatDate = (iso: string): string => {
  const date = new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const DocumentsPanel = () => {
  const { documents, loading, uploading, error, upload, remove } = useDocuments()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Upload PDFs to give your CFO context. The text is read on-device, embedded for semantic
        search, and never uploaded — then you can ask about it in chat.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) void upload(file)
        }}
      />

      <Button className="w-full" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? 'Reading & embedding…' : 'Upload PDF'}
      </Button>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
          No documents yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">{doc.filename}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {doc.chunk_count} chunk{doc.chunk_count === 1 ? '' : 's'} ·{' '}
                  {formatDate(doc.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void remove(doc.id)}
                className="shrink-0 text-xs text-zinc-500 transition-colors hover:text-rose-400"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
