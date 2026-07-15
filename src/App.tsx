import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import LoginPage from './auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CajitasPage from './pages/CajitasPage'
import DeudasPage from './pages/DeudasPage'
import NuevoIngresoPage from './pages/NuevoIngresoPage'
import NuevaCompraPage from './pages/NuevaCompraPage'
import BottomNav from './components/BottomNav'

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const showNav = location.pathname !== '/login'
  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/cajitas" element={<CajitasPage />} />
              <Route path="/deudas" element={<DeudasPage />} />
              <Route path="/ingreso" element={<NuevoIngresoPage />} />
              <Route path="/compra" element={<NuevaCompraPage />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
