import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = () => {
  const { unlocked, loading } = useAuth()
  if (loading) return null
  return unlocked ? <Outlet /> : <Navigate to="/auth" replace />
}
