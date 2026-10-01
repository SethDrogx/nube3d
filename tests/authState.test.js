import test from 'node:test'
import assert from 'node:assert/strict'
import { ROLES, users } from '../src/data/users.js'
import { AUTH_STORAGE_KEY, PERMISSIONS, authenticate, getRouteAccess, hasPermission, hasRole, persistSession, readSession } from '../src/context/authState.js'
import { CART_STORAGE_KEY, cartReducer, readCart } from '../src/context/cartState.js'
import { products } from '../src/data/products.js'

function memoryStorage() {
  const data = new Map()
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }
}

test('exactly two demo accounts authenticate with the requested roles, without exposing passwords in session state', () => {
  assert.equal(users.length, 2)
  for (const demo of users) {
    const user = authenticate(demo.email, demo.password)
    assert.equal(user.name, demo.name)
    assert.equal(user.role, demo.role)
    assert.equal(Object.hasOwn(user, 'password'), false)
  }
  assert.equal(authenticate('admin@nube3d.local', 'Admin123!').role, ROLES.SUPER_USUARIO)
  assert.equal(authenticate('invitado@nube3d.local', 'Invitado123!').role, ROLES.INVITADO)
})

test('email tolerates case and surrounding spaces but passwords must match exactly', () => {
  assert.ok(authenticate('  ADMIN@NUBE3D.LOCAL  ', 'Admin123!'))
  assert.equal(authenticate('admin@nube3d.local', 'admin123!'), null)
  assert.equal(authenticate('admin@nube3d.local', ' Admin123! '), null)
})

test('invalid credentials and missing fields do not authenticate', () => {
  for (const [email, password] of [['admin@nube3d.local', 'wrong'], ['unknown@nube3d.local', 'Admin123!'], ['', ''], [null, null], [undefined, 'Admin123!']]) {
    assert.equal(authenticate(email, password), null)
  }
})

test('admin permission and required-role routes allow only SUPER_USUARIO', () => {
  const admin = authenticate('admin@nube3d.local', 'Admin123!')
  const guest = authenticate('invitado@nube3d.local', 'Invitado123!')
  assert.equal(getRouteAccess(admin, ROLES.SUPER_USUARIO), 'allowed')
  assert.equal(getRouteAccess(guest, ROLES.SUPER_USUARIO), 'denied')
  assert.equal(getRouteAccess(null, ROLES.SUPER_USUARIO), 'login')
  assert.equal(hasPermission(admin, PERMISSIONS.ACCESS_ADMIN), true)
  assert.equal(hasPermission(guest, PERMISSIONS.ACCESS_ADMIN), false)
  assert.equal(hasPermission(null, PERMISSIONS.ACCESS_ADMIN), false)
})

test('authentication-only routes allow either demo account; unknown permissions and roles fail closed', () => {
  for (const demo of users) {
    const user = authenticate(demo.email, demo.password)
    assert.equal(getRouteAccess(user), 'allowed')
    assert.equal(hasPermission(user, 'unknown'), false)
    assert.equal(hasRole(user, 'unknown'), false)
  }
  assert.equal(getRouteAccess({ role: 'unknown' }), 'login')
  assert.equal(hasPermission({ role: '__proto__' }, PERMISSIONS.ACCESS_ADMIN), false)
})

test('session persists only the demo identifier and restores the canonical account', () => {
  const storage = memoryStorage()
  for (const demo of users) {
    const user = authenticate(demo.email, demo.password)
    assert.equal(persistSession(storage, user), true)
    assert.deepEqual(JSON.parse(storage.getItem(AUTH_STORAGE_KEY)), { userId: demo.id })
    assert.deepEqual(readSession(storage), user)
  }
})

test('restoration ignores stored role overrides and rejects obsolete demo identifiers', () => {
  const storage = memoryStorage()
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: users[1].id, role: ROLES.SUPER_USUARIO, password: 'ignored' }))
  assert.equal(readSession(storage).role, ROLES.INVITADO)
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: 'unknown', role: ROLES.SUPER_USUARIO }))
  assert.equal(readSession(storage), null)
})

test('malformed, absent or blocked storage does not crash authentication', () => {
  for (const raw of [null, '{broken', 'null', '[]', '{}', '42']) assert.equal(readSession({ getItem: () => raw }), null)
  assert.equal(readSession(null), null)
  assert.equal(persistSession(null, users[0]), false)
  assert.equal(persistSession(null, null), false)
})

test('login and logout storage operations preserve the existing cart, which remains editable', () => {
  const storage = memoryStorage()
  const cart = cartReducer([], { type: 'add', id: products[0].id })
  storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  const before = storage.getItem(CART_STORAGE_KEY)
  persistSession(storage, authenticate('admin@nube3d.local', 'Admin123!'))
  assert.equal(storage.getItem(CART_STORAGE_KEY), before)
  assert.equal(persistSession(storage, null), true)
  assert.equal(storage.getItem(AUTH_STORAGE_KEY), null)
  assert.equal(readSession(storage), null)
  assert.equal(storage.getItem(CART_STORAGE_KEY), before)
  assert.equal(cartReducer(readCart(storage), { type: 'increase', id: products[0].id })[0].quantity, 2)
})
