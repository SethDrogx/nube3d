import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState([])
  const options = ['Buscar un producto', 'Quiero una impresión personalizada', 'Consultar precios', 'Tiempo de entrega']

  const send = (text) => {
    setSent((current) => [...current, text])
    setMessage('')
  }

  return (
    <div className="assistant-wrap">
      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key="chat"
            className="chat-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 27 }}
          >
            <div className="chat-head">
              <motion.div className="bot-avatar" animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}>
                3D
              </motion.div>
              <div><strong>Asistente Nube</strong><small>Normalmente responde al instante</small></div>
              <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.86 }} onClick={() => setOpen(false)} aria-label="Cerrar asistente">×</motion.button>
            </div>
            <div className="chat-body">
              <motion.div className="bot-bubble" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                ¡Hola! Soy el asistente de Nube 3D. ¿Qué estás buscando hoy?
              </motion.div>
              <AnimatePresence initial={false}>
                {sent.map((item, index) => (
                  <motion.div
                    key={`${item}-${index}`}
                    className="user-bubble"
                    initial={{ opacity: 0, x: 18, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="quick-options">
                {options.map((option, index) => (
                  <motion.button
                    key={option}
                    onClick={() => send(option)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.045 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
            <form className="chat-input" onSubmit={(event) => { event.preventDefault(); if (message.trim()) send(message.trim()) }}>
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe un mensaje..." aria-label="Mensaje" />
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} aria-label="Enviar mensaje">→</motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.div
            key="note"
            className="assistant-note"
            initial={{ opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.97 }}
            transition={{ delay: 0.45 }}
          >
            ¿Te puedo ayudar con algo?
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="assistant-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        animate={open ? { scale: 1 } : { scale: [1, 1.045, 1] }}
        transition={open ? { duration: 0.2 } : { duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08, rotate: open ? 0 : 3 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span className="spark" animate={{ rotate: [0, 18, 0] }} transition={{ duration: 3, repeat: Infinity }}>✦</motion.span>
        <span>{open ? '×' : '3D'}</span>
      </motion.button>
    </div>
  )
}
