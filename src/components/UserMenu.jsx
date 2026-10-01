import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PERMISSIONS } from '../context/authState'

export default function UserMenu() {
  const { user, can, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const trigger = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!user) return <Link className="login auth-login" to="/login">Iniciar sesión</Link>

  return (
    <div className="user-menu" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <button ref={trigger} type="button" className="user-menu-trigger" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen((current) => !current)}>
        {user.name} <span aria-hidden="true">▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div id={panelId} className="user-menu-panel" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>
            <p>Rol <strong>{user.role}</strong></p>
            {can(PERMISSIONS.ACCESS_ADMIN) && <Link to="/admin" onClick={() => setOpen(false)}>Panel de administración</Link>}
            <button type="button" onClick={() => { setOpen(false); logout() }}>Cerrar sesión</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
