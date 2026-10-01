import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/cotizaciones', label: 'Cotizaciones' },
]

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="Navegación administrativa">
      <p className="admin-sidebar-label">ADMINISTRACIÓN</p>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'active' : undefined}>
            {link.label}<span>↗</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
