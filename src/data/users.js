// MOCK ONLY: public development credentials, never real accounts or production auth.
export const ROLES = Object.freeze({
  SUPER_USUARIO: 'SUPER_USUARIO',
  INVITADO: 'INVITADO',
})

export const users = [
  { id: 'admin-demo', name: 'Administrador', email: 'admin@nube3d.local', password: 'Admin123!', role: ROLES.SUPER_USUARIO },
  { id: 'invitado-demo', name: 'Invitado', email: 'invitado@nube3d.local', password: 'Invitado123!', role: ROLES.INVITADO },
]
