export const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Food', color: 'amber', icon: '🍔' },
  { value: 'transport', label: 'Transport', color: 'sky', icon: '🚗' },
  { value: 'salary', label: 'Salary', color: 'emerald', icon: '💰' },
  { value: 'entertainment', label: 'Entertainment', color: 'violet', icon: '🎬' },
  { value: 'other', label: 'Other', color: 'zinc', icon: '📦' }
] as const

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number]

export const CATEGORY_PILL: Record<CategoryOption['color'], string> = {
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  sky: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  zinc: 'border-zinc-600/60 bg-zinc-700/30 text-zinc-300'
}
