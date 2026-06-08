import { createHashRouter } from 'react-router-dom'
import ProtectedRoute from '@renderer/features/auth/ProtectedRoute'
import AuthPage from '@renderer/pages/auth'
import MainPage from '@renderer/pages/main'

/**
 * HashRouter is used because the production build is served from a file:// URL,
 * where the browser-history (path) router can't resolve deep links.
 */
export const router = createHashRouter([
  { path: '/auth', element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/', element: <MainPage /> }]
  }
])
