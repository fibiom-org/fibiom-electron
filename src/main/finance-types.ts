export type FinanceMode = 'personal' | 'business'
export type PaymentDirection = 'expense' | 'income'
export type PaymentType = 'recurring' | 'one-time'
export type ProjectCurrency = 'USD' | 'EUR' | 'GBP'
export type ProjectType = 'personal' | 'business'

export interface DashboardPeriod {
  month: number
  year: number
}

export interface ChangeRecord {
  id: string
  timestamp: string
  summary: string
  reason: string
}

export interface Employee {
  id: string
  projectId: string
  name: string
  salary: number
  deletedAt: string | null
  history: ChangeRecord[]
  createdAt: string
}

export interface Payment {
  id: string
  projectId: string
  direction: PaymentDirection
  vendor: string
  amount: number
  type: PaymentType
  category: string
  date: string | null
  billingDay: number | null
  note: string | null
  deletedAt: string | null
  history: ChangeRecord[]
  createdAt: string
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  currency: ProjectCurrency
  initialCash: number
  description: string | null
  createdAt: string
}

export interface CreateProjectInput {
  name: string
  currency: ProjectCurrency
  initialCash?: number
  description?: string
  type?: ProjectType
}

export interface PaymentInput {
  direction: PaymentDirection
  vendor: string
  amount: number
  type: PaymentType
  category: string
  date: string | null
  billingDay: number | null
  note: string | null
}

export interface UpdatePaymentInput extends PaymentInput {
  reason: string
}

export interface DeletePaymentInput {
  reason: string
}

export interface EmployeeInput {
  name: string
  salary: number
}

export interface UpdateEmployeeInput extends EmployeeInput {
  reason: string
}

export interface DeleteEmployeeInput {
  reason: string
}

export type PlanPeriodGranularity = 'month' | 'quarter'

export interface PlanPeriod {
  granularity: PlanPeriodGranularity
  month: number
  year: number
}

export type PlanMetric = 'revenue' | 'burn' | 'cash' | 'mrr' | 'runway'
export type PlanTargetOperator = 'gte' | 'lte' | 'eq'

export interface PlanTarget {
  id: string
  projectId: string
  metric: PlanMetric
  targetValue: number
  operator: PlanTargetOperator
  period: PlanPeriod
  createdAt: string
  updatedAt: string
}

export interface PlanTargetInput {
  metric: PlanMetric
  targetValue: number
  operator: PlanTargetOperator
}
