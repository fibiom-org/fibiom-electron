import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@renderer/hooks/use-local-storage'

export interface User {
  email: string
  name: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Mock auth provider. Persists a fake user in localStorage so the auth gate
 * survives reloads. Replace `login` with a real call (IPC -> main -> db/API)
 * once the backend exists.
 */
export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useLocalStorage<User | null>('auth.user', null)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email) => {
        // TODO: replace with real authentication
        setUser({ email, name: email.split('@')[0] || 'User' })
      },
      logout: () => setUser(null)
    }),
    [user, setUser]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
