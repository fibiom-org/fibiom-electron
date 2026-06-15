export interface CapabilityInfo {
  capability: string
  detail: string
  model: string
  note: string
}

export const VOICE_AND_SEARCH_MODELS: CapabilityInfo[] = [
  {
    capability: 'Voice input',
    detail: 'Speech → text',
    model: 'Whisper base',
    note: 'Transcribes mic recordings in the chat composer.'
  },
  {
    capability: 'Spoken replies',
    detail: 'Text → speech',
    model: 'Supertonic (English)',
    note: 'Reads answers aloud via the Listen action.'
  },
  {
    capability: 'Semantic search',
    detail: 'RAG embeddings',
    model: 'EmbeddingGemma 300M',
    note: 'Indexes records so the assistant can retrieve them.'
  }
]
