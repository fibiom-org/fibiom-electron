export type DemoProjectKey = 'acme' | 'streampay'

export interface DemoProjectSeed {
  key: DemoProjectKey
  name: string
  currency: 'USD' | 'EUR' | 'GBP'
  initialCash: number
  description: string
  type: 'personal' | 'business'
}

export interface DemoPaymentSeed {
  id: string
  projectKey: DemoProjectKey
  direction: 'expense' | 'income'
  vendor: string
  amount: number
  type: 'recurring' | 'one-time'
  category: string
  date: string | null
  billingDay: number | null
  note: string | null
  createdAt: string
}

export interface DemoEmployeeSeed {
  id: string
  projectKey: DemoProjectKey
  name: string
  salary: number
  createdAt: string
}

export interface DemoPlanTargetSeed {
  id: string
  projectKey: DemoProjectKey
  metric: 'revenue' | 'burn' | 'cash' | 'mrr' | 'runway'
  targetValue: number
  operator: 'gte' | 'lte' | 'eq'
  periodGranularity: 'month' | 'quarter'
  periodMonth: number
  periodYear: number
}

export const DEMO_PROJECTS: DemoProjectSeed[] = [
  {
    key: 'acme',
    name: 'Acme Labs',
    currency: 'USD',
    initialCash: 42_000,
    description: 'Infrastructure-heavy startup',
    type: 'business'
  },
  {
    key: 'streampay',
    name: 'StreamPay',
    currency: 'USD',
    initialCash: 85_000,
    description: 'Subscription business with mixed revenue',
    type: 'business'
  }
]

export const DEMO_PAYMENTS: DemoPaymentSeed[] = [
  {
    id: 'pay-vercel-acme',
    projectKey: 'acme',
    direction: 'expense',
    vendor: 'Vercel',
    amount: 5,
    type: 'recurring',
    category: 'SaaS',
    date: null,
    billingDay: 1,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pay-aws-acme',
    projectKey: 'acme',
    direction: 'expense',
    vendor: 'AWS',
    amount: 500,
    type: 'recurring',
    category: 'Infrastructure',
    date: null,
    billingDay: 1,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pay-ip-acme',
    projectKey: 'acme',
    direction: 'expense',
    vendor: 'IP for music',
    amount: 1000,
    type: 'one-time',
    category: 'Legal',
    date: '2026-05-15',
    billingDay: null,
    note: 'Music licensing',
    createdAt: '2026-05-15T00:00:00.000Z'
  },
  {
    id: 'pay-vercel-stream',
    projectKey: 'streampay',
    direction: 'expense',
    vendor: 'Vercel',
    amount: 5,
    type: 'recurring',
    category: 'SaaS',
    date: null,
    billingDay: 1,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pay-aws-stream',
    projectKey: 'streampay',
    direction: 'expense',
    vendor: 'AWS',
    amount: 500,
    type: 'recurring',
    category: 'Infrastructure',
    date: null,
    billingDay: 1,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pay-client-stream',
    projectKey: 'streampay',
    direction: 'income',
    vendor: 'Client A',
    amount: 200,
    type: 'recurring',
    category: 'Subscriptions',
    date: null,
    billingDay: 1,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'pay-seed-stream',
    projectKey: 'streampay',
    direction: 'income',
    vendor: 'Seed round',
    amount: 50_000,
    type: 'one-time',
    category: 'Investment',
    date: '2026-03-01',
    billingDay: null,
    note: null,
    createdAt: '2026-03-01T00:00:00.000Z'
  }
]

export const DEMO_EMPLOYEES: DemoEmployeeSeed[] = [
  {
    id: 'emp-alice-acme',
    projectKey: 'acme',
    name: 'Alice',
    salary: 8000,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-bob-acme',
    projectKey: 'acme',
    name: 'Bob',
    salary: 5000,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-carol-acme',
    projectKey: 'acme',
    name: 'Carol',
    salary: 3500,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-dana-stream',
    projectKey: 'streampay',
    name: 'Dana',
    salary: 10_000,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-evan-stream',
    projectKey: 'streampay',
    name: 'Evan',
    salary: 6000,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'emp-faye-stream',
    projectKey: 'streampay',
    name: 'Faye',
    salary: 4500,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
]

export const DEMO_PLAN_TARGETS: DemoPlanTargetSeed[] = [
  {
    id: 'plan-acme-revenue-jun',
    projectKey: 'acme',
    metric: 'revenue',
    targetValue: 12_000,
    operator: 'gte',
    periodGranularity: 'month',
    periodMonth: 6,
    periodYear: 2026
  },
  {
    id: 'plan-acme-burn-jun',
    projectKey: 'acme',
    metric: 'burn',
    targetValue: 8_500,
    operator: 'lte',
    periodGranularity: 'month',
    periodMonth: 6,
    periodYear: 2026
  },
  {
    id: 'plan-acme-runway-jun',
    projectKey: 'acme',
    metric: 'runway',
    targetValue: 10,
    operator: 'gte',
    periodGranularity: 'month',
    periodMonth: 6,
    periodYear: 2026
  },
  {
    id: 'plan-streampay-revenue-q2',
    projectKey: 'streampay',
    metric: 'revenue',
    targetValue: 45_000,
    operator: 'gte',
    periodGranularity: 'quarter',
    periodMonth: 4,
    periodYear: 2026
  },
  {
    id: 'plan-streampay-mrr-q2',
    projectKey: 'streampay',
    metric: 'mrr',
    targetValue: 12_000,
    operator: 'gte',
    periodGranularity: 'quarter',
    periodMonth: 4,
    periodYear: 2026
  }
]
