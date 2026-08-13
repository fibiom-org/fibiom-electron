import { useFormContext } from 'react-hook-form'
import { TransactionTypeToggle } from '@renderer/features/create-transaction/ui/TransactionTypeToggle'
import { CategorySelect } from '@renderer/features/create-transaction/ui/CategorySelect'
import { useProjects } from '@renderer/entities/project'
import { FormField } from '@renderer/shared/ui'
import { Select } from '@renderer/shared/ui/Select'
import { Input } from '@renderer/components/ui/Input'

export const TransactionFormFields = () => {
  const {
    formState: { errors }
  } = useFormContext()
  const projects = useProjects()

  return (
    <>
      <FormField name="type" label="Type" required>
        {(field) => <TransactionTypeToggle value={field.value} onChange={field.onChange} />}
      </FormField>

      <FormField name="amount" label="Amount" required>
        {(field) => <Input type="number" step="0.01" placeholder="0.00" {...field} />}
      </FormField>

      <FormField name="category" label="Category" required>
        {(field) => <CategorySelect value={field.value} onChange={field.onChange} />}
      </FormField>

      <FormField name="project" label="Project" required>
        {(field) => (
          <Select
            {...field}
            options={[
              { value: '', label: 'Select a project' },
              ...projects.map((project) => ({
                value: project.id,
                label: `${project.name} (${project.type})`
              }))
            ]}
          />
        )}
      </FormField>

      <FormField name="date" label="Date" required>
        {(field) => <Input type="date" {...field} />}
      </FormField>

      <FormField name="description" label="Description">
        {(field) => <Input placeholder="Optional" {...field} />}
      </FormField>

      {errors.root && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {errors.root.message}
        </p>
      )}
    </>
  )
}
