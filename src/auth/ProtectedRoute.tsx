import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-4">Cargando...</div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
