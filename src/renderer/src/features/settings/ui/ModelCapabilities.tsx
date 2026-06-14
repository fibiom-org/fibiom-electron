import type { ModelEntry } from '../model/use-models'
import { VOICE_AND_SEARCH_MODELS, type CapabilityInfo } from '../model/capabilities'

interface ModelCapabilitiesProps {
  activeModel?: ModelEntry
}

interface Row extends CapabilityInfo {
  shared?: boolean
}

const CapabilityRow = ({ row }: { row: Row }) => (
  <div className="flex items-start justify-between gap-4 px-4 py-3">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-zinc-100">{row.capability}</p>
        {row.shared && (
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
            Shared model
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-zinc-500">
        {row.detail} · {row.note}
      </p>
    </div>
    <p className="shrink-0 text-sm text-zinc-300">{row.model}</p>
  </div>
)

export const ModelCapabilities = ({ activeModel }: ModelCapabilitiesProps) => {
  const primary = activeModel?.label ?? 'Not selected'

  const rows: Row[] = [
    {
      capability: 'Text chat',
      detail: 'CFO assistant',
      model: primary,
      note: 'Answers questions and calls financial tools.',
      shared: true
    },
    {
      capability: 'Receipts',
      detail: 'Image understanding',
      model: primary,
      note: 'Parses receipt photos — same model as chat.',
      shared: true
    },
    ...VOICE_AND_SEARCH_MODELS
  ]

  return (
    <div className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      {rows.map((row, index) => (
        <CapabilityRow key={`${row.capability}-${index}`} row={row} />
      ))}
    </div>
  )
}
