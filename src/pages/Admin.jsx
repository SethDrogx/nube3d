import RouteShell from './RouteShell'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { user, role } = useAuth()
  return (
    <RouteShell kicker="ADMINISTRACIÓN" title="Panel de administración">
      <p>Sesión: <strong>{user.name}</strong><br />Rol: <strong>{role}</strong></p>
      <p>El panel administrativo se desarrollará en la siguiente fase.</p>
    </RouteShell>
  )
}
