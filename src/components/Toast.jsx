import { AnimatePresence, motion } from 'motion/react'

export default function Toast({ toast, onDismiss }) {
  return (
    <div className="cart-toast-region" role="status" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false}>
        {toast && (
          <motion.div
            key={toast.id}
            className="cart-toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <span className="cart-toast-mark" aria-hidden="true">✓</span>
            <span>{toast.message}</span>
            <button type="button" onClick={onDismiss} aria-label="Cerrar notificación">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
