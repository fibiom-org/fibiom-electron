import { useCallback, useEffect, useState } from 'react'
import { extractPdfText, isPdf } from '@renderer/lib/pdf'

export type DocumentEntry = Awaited<ReturnType<Window['documentsAPI']['list']>>[number]

interface UseDocuments {
  documents: DocumentEntry[]
  loading: boolean
  uploading: boolean
  error: string
  upload: (file: File) => Promise<void>
  remove: (documentId: number) => Promise<void>
}

export const useDocuments = (): UseDocuments => {
  const [documents, setDocuments] = useState<DocumentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async (): Promise<void> => {
    const list = await window.documentsAPI.list()
    setDocuments(list)
  }, [])

  useEffect(() => {
    let active = true
    window.documentsAPI
      .list()
      .then((list) => active && setDocuments(list))
      .catch(() => active && setError('Could not load documents'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const upload = useCallback(
    async (file: File): Promise<void> => {
      if (uploading) return
      setError('')
      if (!isPdf(file)) {
        setError('Only PDF documents are supported')
        return
      }
      setUploading(true)
      try {
        const text = await extractPdfText(file)
        if (!text.trim()) {
          setError('No selectable text found — is this a scanned PDF?')
          return
        }
        await window.documentsAPI.add(file.name, text)
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add the document')
      } finally {
        setUploading(false)
      }
    },
    [refresh, uploading]
  )

  const remove = useCallback(
    async (documentId: number): Promise<void> => {
      await window.documentsAPI.delete(documentId)
      await refresh()
    },
    [refresh]
  )

  return { documents, loading, uploading, error, upload, remove }
}
