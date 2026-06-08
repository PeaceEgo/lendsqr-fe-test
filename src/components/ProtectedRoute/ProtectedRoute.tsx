import { Outlet, Navigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'

export function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
