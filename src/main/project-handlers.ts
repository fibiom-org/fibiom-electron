import { ipcMain } from 'electron'
import type {
  CreateProjectInput,
  DeleteEmployeeInput,
  DeletePaymentInput,
  EmployeeInput,
  PaymentInput,
  PlanPeriod,
  PlanTargetInput,
  UpdateEmployeeInput,
  UpdatePaymentInput
} from './finance-types'
import * as projects from './projects'

export const registerProjectHandlers = (): void => {
  ipcMain.handle('projects:hydrate', () => projects.hydrate())

  ipcMain.handle('projects:create', (_event, input: CreateProjectInput) =>
    projects.createProject(input)
  )

  ipcMain.handle('projects:addPayment', (_event, projectId: string, input: PaymentInput) =>
    projects.addPayment(projectId, input)
  )

  ipcMain.handle('projects:updatePayment', (_event, paymentId: string, input: UpdatePaymentInput) =>
    projects.updatePayment(paymentId, input)
  )

  ipcMain.handle('projects:deletePayment', (_event, paymentId: string, input: DeletePaymentInput) =>
    projects.deletePayment(paymentId, input)
  )

  ipcMain.handle('projects:addEmployee', (_event, projectId: string, input: EmployeeInput) =>
    projects.addEmployee(projectId, input)
  )

  ipcMain.handle(
    'projects:updateEmployee',
    (_event, employeeId: string, input: UpdateEmployeeInput) =>
      projects.updateEmployee(employeeId, input)
  )

  ipcMain.handle(
    'projects:deleteEmployee',
    (_event, employeeId: string, input: DeleteEmployeeInput) =>
      projects.deleteEmployee(employeeId, input)
  )

  ipcMain.handle(
    'projects:savePlanTargets',
    (_event, projectId: string, period: PlanPeriod, inputs: PlanTargetInput[]) =>
      projects.savePlanTargets(projectId, period, inputs)
  )
}
