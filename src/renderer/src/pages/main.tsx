import { useAuth } from '@renderer/features/auth/AuthContext'
import AppShell from '@renderer/components/layout/AppShell'
import Card from '@renderer/components/ui/Card'

const stats = [
  { label: 'Active models', value: '3', delta: '+1 this week' },
  { label: 'Inferences', value: '12.4k', delta: '+8.2%' },
  { label: 'Avg latency', value: '142ms', delta: '-12ms' },
  { label: 'Storage', value: '2.1 GB', delta: 'db/app.sqlite' }
]

const activity = [
  { title: 'Model llama-3.2-1b loaded', time: '2 min ago' },
  { title: 'New chat session started', time: '18 min ago' },
  { title: 'Database connected (sqlite)', time: '1 hour ago' },
  { title: 'Workspace synced', time: 'Yesterday' }
]

function MainPage(): React.JSX.Element {
  const { user } = useAuth()

  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">
            Welcome back, {user?.name} <span className="text-zinc-500">👋</span>
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className="text-sm text-zinc-500">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs text-emerald-400">{s.delta}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h3 className="mb-4 font-semibold">Recent activity</h3>
            <ul className="space-y-3">
              {activity.map((a) => (
                <li key={a.title} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {a.title}
                  </span>
                  <span className="text-zinc-600">{a.time}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">Quick actions</h3>
            <div className="space-y-2 text-sm">
              <button className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-left hover:bg-zinc-800/50">
                ＋ New chat
              </button>
              <button className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-left hover:bg-zinc-800/50">
                ⤓ Load a model
              </button>
              <button className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-left hover:bg-zinc-800/50">
                ⛁ Configure database
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

export default MainPage
