import { useState } from 'react'
import type { Employee } from '@renderer/entities/project'
import { Button } from '@renderer/components/ui/Button'
import { Input } from '@renderer/components/ui/Input'
import { Modal } from '@renderer/shared/ui/Modal'
import { formatCurrency } from '@renderer/shared/lib/format'

interface DeleteEmployeeModalProps {
  employee: Employee | null
  currency: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

export const DeleteEmployeeModal = ({
  employee,
  currency,
  onClose,
  onConfirm
}: DeleteEmployeeModalProps) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = (): void => {
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    onConfirm(reason.trim())
    setReason('')
    setError('')
  }

  const handleClose = (): void => {
    setReason('')
    setError('')
    onClose()
  }

  return (
    <Modal open={employee !== null} onClose={handleClose} title="Remove employee">
      {employee && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Remove <span className="text-zinc-200">{employee.name}</span> (
            {formatCurrency(employee.salary, currency)}/mo)? Payroll totals will update immediately.
          </p>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-zinc-400">
              Reason for removal <span className="text-rose-400">*</span>
            </span>
            <Input
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="Why are you removing this employee?"
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </label>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-rose-600 hover:bg-rose-500"
              onClick={handleConfirm}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
