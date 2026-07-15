import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 text-center py-2 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/cajitas" className={linkClass}>
        Cajitas
      </NavLink>
      <NavLink to="/deudas" className={linkClass}>
        Deudas
      </NavLink>
    </nav>
  )
}
