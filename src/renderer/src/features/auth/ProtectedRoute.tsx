import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Route guard: renders nested routes only when a user is signed in,
 * otherwise redirects to the auth page.
 */
function ProtectedRoute(): React.JSX.Element {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/auth" replace />
}

export default ProtectedRoute
