import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', danger = false, onCancel, onConfirm }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => { if (event.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => confirmRef.current?.focus(), 20)
    return () => { document.removeEventListener('keydown', onKeyDown); window.clearTimeout(timer) }
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="admin-modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
          <motion.div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title" initial={{ opacity: 0, y: 12, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.99 }}>
            <p className="kicker">CONFIRMACIÓN</p>
            <h2 id="admin-confirm-title">{title}</h2>
            <p>{message}</p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancelar</button>
              <button ref={confirmRef} type="button" className={danger ? 'admin-danger-button' : 'primary-button'} onClick={onConfirm}>{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
