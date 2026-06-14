import { useEffect, useRef, useState } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { toImageBlob } from '../lib/render-pdf'
import { INVOICE_PROMPT } from '../model/invoice-prompt'
import { mapInvoice, type InvoicePrefill } from '../model/map-invoice'

type Status = 'idle' | 'preparing' | 'busy' | 'error'

interface PreparedImage {
  bytes: Uint8Array
  ext: string
}

interface InvoiceUploadProps {
  onContinue: (prefill: InvoicePrefill) => void
  onManual: () => void
}

export const InvoiceUpload = ({ onContinue, onManual }: InvoiceUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [prepared, setPrepared] = useState<PreparedImage | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [phase, setPhase] = useState<'downloading' | 'parsing' | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const offProgress = window.visionAPI.onProgress((pct) => {
      setProgress(pct)
      if (pct != null && pct < 100) setPhase('downloading')
    })
    const offStream = window.visionAPI.onStream(() => setPhase('parsing'))
    return () => {
      offProgress()
      offStream()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const selectFile = async (next: File | null): Promise<void> => {
    if (!next) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFileName(next.name)
    setPreviewUrl(null)
    setPrepared(null)
    setError('')
    setStatus('preparing')
    try {
      const { blob, ext } = await toImageBlob(next)
      setPreviewUrl(URL.createObjectURL(blob))
      setPrepared({ bytes: new Uint8Array(await blob.arrayBuffer()), ext })
      setStatus('idle')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read the file')
      setStatus('error')
    }
  }

  const handleScan = async (): Promise<void> => {
    if (!prepared || status === 'busy') return
    setError('')
    setProgress(null)
    setPhase(null)
    setStatus('busy')
    try {
      const { text } = await window.visionAPI.parse(prepared.bytes, prepared.ext, INVOICE_PROMPT)
      onContinue(mapInvoice(text))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read the invoice')
      setStatus('error')
    }
  }

  const busy = status === 'busy'
  const preparing = status === 'preparing'
  const busyLabel =
    phase === 'downloading' && progress != null
      ? `Downloading model… ${progress.toFixed(0)}%`
      : 'Reading invoice…'
  const buttonLabel = busy
    ? busyLabel
    : preparing
      ? 'Preparing…'
      : status === 'error'
        ? 'Try again'
        : 'Scan invoice'

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy || preparing}
        className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 text-sm text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="invoice preview"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : preparing ? (
          <span className="px-6 text-center">Preparing {fileName}…</span>
        ) : (
          <span className="px-6 text-center">
            Click to upload an invoice
            <br />
            <span className="text-xs text-zinc-600">
              PNG, JPG or PDF — read on-device, never uploaded
            </span>
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => void selectFile(e.target.files?.[0] ?? null)}
      />

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {busy && (
        <p className="flex items-center gap-2 text-sm text-amber-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          {busyLabel}
        </p>
      )}

      <Button className="w-full" onClick={handleScan} disabled={!prepared || busy || preparing}>
        {buttonLabel}
      </Button>

      <button
        type="button"
        onClick={onManual}
        disabled={busy || preparing}
        className="w-full text-center text-sm text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline disabled:opacity-40"
      >
        Enter manually
      </button>
    </div>
  )
}
