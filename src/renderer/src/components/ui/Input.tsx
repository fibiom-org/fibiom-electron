import type { InputHTMLAttributes } from 'react'
import { cn } from '@renderer/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function Input({ label, className, id, ...props }: InputProps): React.JSX.Element {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-zinc-400">{label}</span>}
      <input
        id={id}
        className={cn(
          'w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-100 outline-none',
          'placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/50',
          className
        )}
        {...props}
      />
    </label>
  )
}

export default Input
