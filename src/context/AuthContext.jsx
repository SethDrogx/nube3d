import { createContext, startTransition, useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticate, hasPermission, hasRole, persistSession, readSession } from './authState'

const AuthContext = createContext(null)

function browserStorage() {
  try { return window.localStorage } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession(browserStorage()))
  const navigate = useNavigate()

  const login = useCallback((email, password) => {
    const authenticatedUser = authenticate(email, password)
    if (!authenticatedUser) return { ok: false, message: 'Correo electrónico o contraseña incorrectos.' }
    const persisted = persistSession(browserStorage(), authenticatedUser)
    setUser(authenticatedUser)
    return { ok: true, user: authenticatedUser, persisted }
  }, [])

  const logout = useCallback(() => {
    persistSession(browserStorage(), null)
    // Commit session and router updates together so an old protected route
    // cannot redirect before the home navigation starts.
    startTransition(() => {
      setUser(null)
      navigate('/', { replace: true })
    })
  }, [navigate])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    role: user?.role ?? null,
    login,
    logout,
    hasRole: (requiredRole) => hasRole(user, requiredRole),
    can: (permission) => hasPermission(user, permission),
  }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
