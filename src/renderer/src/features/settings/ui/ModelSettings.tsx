import { useModels } from '../model/use-models'
import { ModelCapabilities } from './ModelCapabilities'
import { ModelCard } from './ModelCard'
import { SettingsSection } from './SettingsSection'

export const ModelSettings = () => {
  const { models, loading, selectingId, progress, error, select } = useModels()
  const activeModel = models.find((model) => model.active)

  return (
    <SettingsSection
      title="AI models"
      description="A single on-device model handles both the CFO chat and receipt parsing. Voice and search use dedicated models. Everything runs fully offline."
    >
      {error && <p className="text-sm text-rose-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading models…</p>
      ) : (
        <div className="space-y-5">
          <ModelCapabilities activeModel={activeModel} />

          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-300">Chat &amp; receipts model</p>
            <p className="text-xs text-zinc-500">
              Pick the model used for both text chat and image parsing. Switching downloads it if
              needed.
            </p>
            <div className="space-y-3 pt-1">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  selecting={selectingId === model.id}
                  busy={selectingId !== null}
                  progress={progress}
                  onSelect={() => void select(model.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </SettingsSection>
  )
}
