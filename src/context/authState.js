import { ROLES, users } from '../data/users.js'

export const AUTH_STORAGE_KEY = 'nube3d.auth.demo.v1'
export const PERMISSIONS = Object.freeze({ ACCESS_ADMIN: 'admin:access' })

const rolePermissions = {
  [ROLES.SUPER_USUARIO]: [PERMISSIONS.ACCESS_ADMIN],
  [ROLES.INVITADO]: [],
}

function publicUser(user) {
  if (!user) return null
  const { id, name, email, role } = user
  return { id, name, email, role }
}

export function authenticate(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return null
  return publicUser(users.find((user) => user.email === email.trim().toLowerCase() && user.password === password))
}

export function hasRole(user, requiredRole) {
  return Boolean(user && Object.values(ROLES).includes(user.role) && (!requiredRole || user.role === requiredRole))
}

export function hasPermission(user, permission) {
  return hasRole(user) && rolePermissions[user.role].includes(permission)
}

export function getRouteAccess(user, requiredRole) {
  if (!hasRole(user)) return 'login'
  return hasRole(user, requiredRole) ? 'allowed' : 'denied'
}

export function readSession(storage) {
  try {
    const session = JSON.parse(storage.getItem(AUTH_STORAGE_KEY))
    // Restore only a known demo ID. Stored role/name/password fields are ignored.
    // A user can still impersonate either demo ID: this is NOT a security boundary.
    return publicUser(users.find((user) => user.id === session?.userId))
  } catch {
    return null
  }
}

export function persistSession(storage, user) {
  try {
    if (user) storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: user.id }))
    else storage.removeItem(AUTH_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
