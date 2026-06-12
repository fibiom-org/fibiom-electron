import { z } from 'zod'

export const employeeFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  salary: z.coerce.number().positive('Salary must be greater than 0'),
  reason: z.string().optional()
})

export type EmployeeFormInput = z.input<typeof employeeFormSchema>
export type EmployeeFormValues = z.output<typeof employeeFormSchema>
