import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Employee } from '@renderer/entities/project'
import { Button } from '@renderer/components/ui/Button'
import { Input } from '@renderer/components/ui/Input'
import { Form, FormButton, FormField } from '@renderer/shared/ui'
import {
  employeeFormSchema,
  type EmployeeFormInput,
  type EmployeeFormValues
} from '../model/employee-form-schema'

interface EmployeeFormProps {
  employee?: Employee
  requireReason?: boolean
  submitLabel: string
  onSubmit: (values: { name: string; salary: number; reason?: string }) => void
  onCancel: () => void
}

const toFormValues = (employee: Employee | undefined): EmployeeFormInput => {
  if (!employee) {
    return { name: '', salary: '', reason: '' }
  }

  return {
    name: employee.name,
    salary: employee.salary,
    reason: ''
  }
}

export const EmployeeForm = ({
  employee,
  requireReason = false,
  submitLabel,
  onSubmit,
  onCancel
}: EmployeeFormProps) => {
  const form = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: toFormValues(employee)
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (requireReason && !values.reason?.trim()) {
      form.setError('reason', { message: 'Reason is required when editing' })
      return
    }

    onSubmit({
      name: values.name,
      salary: values.salary,
      reason: values.reason?.trim()
    })
  })

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-4">
      <FormField name="name" label="Name" required>
        {(field) => <Input placeholder="Alice" {...field} />}
      </FormField>

      <FormField name="salary" label="Salary" required>
        {(field) => <Input type="number" step="0.01" min="0" placeholder="5000" {...field} />}
      </FormField>

      {requireReason && (
        <FormField name="reason" label="Reason for change" required>
          {(field) => <Input placeholder="Why are you changing this?" {...field} />}
        </FormField>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <FormButton className="flex-1">{submitLabel}</FormButton>
      </div>
    </Form>
  )
}
