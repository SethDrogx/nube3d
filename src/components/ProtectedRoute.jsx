import { Navigate, useLocation } from 'react-router-dom'
import { useIsPresent } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { getRouteAccess } from '../context/authState'
import RouteShell from '../pages/RouteShell'

// UI-only route protection for the local demo. Production must authorize on a server.
export default function ProtectedRoute({ requiredRole, children }) {
  const { user } = useAuth()
  const location = useLocation()
  const isPresent = useIsPresent()
  const access = getRouteAccess(user, requiredRole)

  // Exiting routes remain mounted during Motion transitions. They must not
  // override the logout navigation with a second redirect to /login.
  if (!isPresent && access !== 'allowed') return null
  if (access === 'login') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (access === 'denied') {
    return (
      <RouteShell kicker="ACCESO RESTRINGIDO" title="Acceso denegado">
        <p role="alert">No tienes permisos para acceder a esta sección.</p>
      </RouteShell>
    )
  }
  return children
}
